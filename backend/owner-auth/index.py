"""
Модуль авторизации владельца: регистрация, подтверждение OTP, вход, верификация токена.
"""
import json
import os
import random
import hashlib
import secrets
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import psycopg2

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p99711697_auction_app_developm')
CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
}


def get_db():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def send_email(to_email: str, subject: str, body: str):
    host = os.environ['SMTP_HOST']
    port = int(os.environ['SMTP_PORT'])
    user = os.environ['SMTP_USER']
    password = os.environ['SMTP_PASSWORD']

    msg = MIMEMultipart()
    msg['From'] = user
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'html', 'utf-8'))

    with smtplib.SMTP_SSL(host, port) as server:
        server.login(user, password)
        server.sendmail(user, to_email, msg.as_string())


def generate_otp() -> str:
    return str(random.randint(100000, 999999))


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    path = event.get('path', '/')
    method = event.get('httpMethod', 'GET')
    body = {}
    if event.get('body'):
        body = json.loads(event['body'])

    # POST /register — отправка OTP на email владельца
    if path == '/register' and method == 'POST':
        phone = body.get('phone', '').strip()
        email = body.get('email', '').strip()
        password = body.get('password', '').strip()

        if not phone or not email or not password:
            return {'statusCode': 400, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Заполните все поля'})}

        db = get_db()
        cur = db.cursor()

        cur.execute(f"SELECT id FROM {SCHEMA}.owner_users WHERE phone = %s OR email = %s", (phone, email))
        if cur.fetchone():
            db.close()
            return {'statusCode': 409, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Пользователь с таким телефоном или email уже существует'})}

        otp = generate_otp()
        cur.execute(
            f"INSERT INTO {SCHEMA}.otp_codes (target_email, code, purpose, extra_data) VALUES (%s, %s, %s, %s)",
            (email, otp, 'owner_register', json.dumps({'phone': phone, 'email': email, 'password_hash': hash_password(password)}))
        )
        db.commit()
        db.close()

        send_email(
            email,
            'Подтверждение регистрации',
            f'<h2>Код подтверждения регистрации</h2><p>Ваш код: <strong style="font-size:24px">{otp}</strong></p><p>Код действителен 10 минут.</p>'
        )

        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'success': True, 'message': 'Код отправлен на email'})}

    # POST /register/confirm — подтверждение OTP и создание аккаунта
    if path == '/register/confirm' and method == 'POST':
        email = body.get('email', '').strip()
        code = body.get('code', '').strip()

        if not email or not code:
            return {'statusCode': 400, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Укажите email и код'})}

        db = get_db()
        cur = db.cursor()

        cur.execute(
            f"SELECT id, extra_data FROM {SCHEMA}.otp_codes WHERE target_email = %s AND code = %s AND purpose = 'owner_register' AND is_used = FALSE AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1",
            (email, code)
        )
        row = cur.fetchone()
        if not row:
            db.close()
            return {'statusCode': 400, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Неверный или устаревший код'})}

        otp_id, extra_data = row
        data = extra_data if isinstance(extra_data, dict) else json.loads(extra_data)

        cur.execute(
            f"INSERT INTO {SCHEMA}.owner_users (phone, email, password_hash, is_verified) VALUES (%s, %s, %s, TRUE)",
            (data['phone'], data['email'], data['password_hash'])
        )
        cur.execute(f"UPDATE {SCHEMA}.otp_codes SET is_used = TRUE WHERE id = %s", (otp_id,))
        db.commit()
        db.close()

        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'success': True, 'message': 'Регистрация завершена'})}

    # POST /login — проверка телефона+email+пароля, отправка OTP на email
    if path == '/login' and method == 'POST':
        phone = body.get('phone', '').strip()
        email = body.get('email', '').strip()
        password = body.get('password', '').strip()

        if not phone or not email or not password:
            return {'statusCode': 400, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Заполните все поля'})}

        db = get_db()
        cur = db.cursor()

        cur.execute(
            f"SELECT id FROM {SCHEMA}.owner_users WHERE phone = %s AND email = %s AND password_hash = %s AND is_verified = TRUE",
            (phone, email, hash_password(password))
        )
        owner = cur.fetchone()
        if not owner:
            db.close()
            return {'statusCode': 401, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Неверные данные или аккаунт не подтверждён'})}

        otp = generate_otp()
        cur.execute(
            f"INSERT INTO {SCHEMA}.otp_codes (target_email, code, purpose, extra_data) VALUES (%s, %s, %s, %s)",
            (email, otp, 'owner_login', json.dumps({'owner_id': owner[0]}))
        )
        db.commit()
        db.close()

        send_email(
            email,
            'Код входа',
            f'<h2>Код для входа в систему</h2><p>Ваш код: <strong style="font-size:24px">{otp}</strong></p><p>Код действителен 10 минут.</p>'
        )

        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'success': True, 'message': 'Код отправлен на ваш email'})}

    # POST /login/confirm — подтверждение OTP и выдача токена сессии
    if path == '/login/confirm' and method == 'POST':
        email = body.get('email', '').strip()
        code = body.get('code', '').strip()

        if not email or not code:
            return {'statusCode': 400, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Укажите email и код'})}

        db = get_db()
        cur = db.cursor()

        cur.execute(
            f"SELECT id, extra_data FROM {SCHEMA}.otp_codes WHERE target_email = %s AND code = %s AND purpose = 'owner_login' AND is_used = FALSE AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1",
            (email, code)
        )
        row = cur.fetchone()
        if not row:
            db.close()
            return {'statusCode': 400, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Неверный или устаревший код'})}

        otp_id, extra_data = row
        data = extra_data if isinstance(extra_data, dict) else json.loads(extra_data)
        owner_id = data['owner_id']

        token = secrets.token_hex(32)
        cur.execute(
            f"INSERT INTO {SCHEMA}.owner_sessions (owner_id, token) VALUES (%s, %s)",
            (owner_id, token)
        )
        cur.execute(f"UPDATE {SCHEMA}.otp_codes SET is_used = TRUE WHERE id = %s", (otp_id,))
        db.commit()
        db.close()

        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'success': True, 'token': token})}

    # GET /me — проверка токена, получение данных владельца
    if path == '/me' and method == 'GET':
        token = event.get('headers', {}).get('X-Auth-Token', '').strip()
        if not token:
            return {'statusCode': 401, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Токен не передан'})}

        db = get_db()
        cur = db.cursor()
        cur.execute(
            f"SELECT o.id, o.phone, o.email, o.admin_registration_email FROM {SCHEMA}.owner_sessions s JOIN {SCHEMA}.owner_users o ON o.id = s.owner_id WHERE s.token = %s AND s.expires_at > NOW()",
            (token,)
        )
        row = cur.fetchone()
        db.close()

        if not row:
            return {'statusCode': 401, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Неверный или истёкший токен'})}

        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({
            'id': row[0], 'phone': row[1], 'email': row[2], 'admin_registration_email': row[3]
        })}

    # PUT /settings — сохранение email для регистрации администраторов
    if path == '/settings' and method == 'PUT':
        token = event.get('headers', {}).get('X-Auth-Token', '').strip()
        if not token:
            return {'statusCode': 401, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Токен не передан'})}

        admin_email = body.get('admin_registration_email', '').strip()
        if not admin_email:
            return {'statusCode': 400, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Укажите email'})}

        db = get_db()
        cur = db.cursor()
        cur.execute(
            f"SELECT o.id FROM {SCHEMA}.owner_sessions s JOIN {SCHEMA}.owner_users o ON o.id = s.owner_id WHERE s.token = %s AND s.expires_at > NOW()",
            (token,)
        )
        row = cur.fetchone()
        if not row:
            db.close()
            return {'statusCode': 401, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Неверный токен'})}

        cur.execute(
            f"UPDATE {SCHEMA}.owner_users SET admin_registration_email = %s WHERE id = %s",
            (admin_email, row[0])
        )
        db.commit()
        db.close()

        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'success': True})}

    return {'statusCode': 404, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Маршрут не найден'})}
