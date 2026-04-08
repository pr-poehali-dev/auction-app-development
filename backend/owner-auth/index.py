"""
Авторизация владельца приложения: регистрация и вход по номеру телефона + пароль.
Также возвращает список администраторов.
"""
import json
import os
import hashlib
import secrets
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
    salt = 'owner_salt_v1'
    return hashlib.sha256(f'{salt}{password}'.encode()).hexdigest()


def ok(data: dict) -> dict:
    return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps(data, ensure_ascii=False)}


def err(code: int, message: str) -> dict:
    return {'statusCode': code, 'headers': CORS_HEADERS, 'body': json.dumps({'error': message}, ensure_ascii=False)}


def get_owner_by_token(cur, token: str):
    cur.execute(
        f"SELECT o.id, o.phone FROM {SCHEMA}.owner_sessions s "
        f"JOIN {SCHEMA}.owner_users o ON o.id = s.owner_id "
        f"WHERE s.token = %s AND s.expires_at > NOW()",
        (token,)
    )
    return cur.fetchone()


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    path = event.get('path', '/')
    method = event.get('httpMethod', 'GET')
    body = {}
    if event.get('body'):
        body = json.loads(event['body'])

    token = (event.get('headers') or {}).get('X-Auth-Token', '').strip()

    # POST / — регистрация владельца (только один раз)
    if path == '/' and method == 'POST':
        phone = body.get('phone', '').strip()
        password = body.get('password', '').strip()

        if not phone or not password:
            return err(400, 'Заполните все поля')

        if len(password) < 8:
            return err(400, 'Пароль должен содержать минимум 8 символов')

        db = get_db()
        cur = db.cursor()

        cur.execute(f"SELECT id FROM {SCHEMA}.owner_users LIMIT 1")
        if cur.fetchone():
            db.close()
            return err(409, 'Владелец уже зарегистрирован')

        cur.execute(
            f"INSERT INTO {SCHEMA}.owner_users (phone, password_hash) VALUES (%s, %s)",
            (phone, hash_password(password))
        )
        db.commit()
        db.close()

        return ok({'success': True})

    # POST /login — вход по телефону + пароль
    if path == '/login' and method == 'POST':
        phone = body.get('phone', '').strip()
        password = body.get('password', '').strip()

        if not phone or not password:
            return err(400, 'Заполните все поля')

        db = get_db()
        cur = db.cursor()

        cur.execute(
            f"SELECT id FROM {SCHEMA}.owner_users WHERE phone = %s AND password_hash = %s",
            (phone, hash_password(password))
        )
        owner = cur.fetchone()
        if not owner:
            db.close()
            return err(401, 'Неверный номер телефона или пароль')

        session_token = secrets.token_hex(32)
        cur.execute(
            f"INSERT INTO {SCHEMA}.owner_sessions (owner_id, token) VALUES (%s, %s)",
            (owner[0], session_token)
        )
        db.commit()
        db.close()

        return ok({'success': True, 'token': session_token})

    # GET /me — проверка токена
    if path == '/me' and method == 'GET':
        if not token:
            return err(401, 'Требуется авторизация')

        db = get_db()
        cur = db.cursor()
        owner = get_owner_by_token(cur, token)
        db.close()

        if not owner:
            return err(401, 'Неверный или истёкший токен')

        return ok({'id': owner[0], 'phone': owner[1]})

    # GET /admins — список администраторов
    if path == '/admins' and method == 'GET':
        if not token:
            return err(401, 'Требуется авторизация')

        db = get_db()
        cur = db.cursor()

        if not get_owner_by_token(cur, token):
            db.close()
            return err(401, 'Неверный или истёкший токен')

        cur.execute(
            f"SELECT id, phone, name, is_active, created_at FROM {SCHEMA}.admin_users ORDER BY created_at DESC"
        )
        rows = cur.fetchall()
        db.close()

        admins = [
            {'id': r[0], 'phone': r[1], 'name': r[2], 'is_active': r[3], 'created_at': str(r[4])}
            for r in rows
        ]

        return ok({'admins': admins})

    # POST /logout — выход
    if path == '/logout' and method == 'POST':
        if token:
            db = get_db()
            cur = db.cursor()
            cur.execute(f"UPDATE {SCHEMA}.owner_sessions SET expires_at = NOW() WHERE token = %s", (token,))
            db.commit()
            db.close()

        return ok({'success': True})

    return err(404, 'Маршрут не найден')
