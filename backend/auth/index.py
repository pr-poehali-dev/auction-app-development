"""
Авторизация пользователей: регистрация, вход, выход, получение профиля.
Маршруты через query-параметр action: register | login | logout | me
"""
import json
import os
import hashlib
import secrets
import psycopg2


CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
}

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p99711697_auction_app_developm')


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def ok(data: dict, status: int = 200) -> dict:
    return {'statusCode': status, 'headers': {**CORS, 'Content-Type': 'application/json'}, 'body': json.dumps(data, ensure_ascii=False)}


def err(message: str, status: int = 400) -> dict:
    return {'statusCode': status, 'headers': {**CORS, 'Content-Type': 'application/json'}, 'body': json.dumps({'error': message}, ensure_ascii=False)}


def get_user_by_token(conn, token: str):
    cur = conn.cursor()
    cur.execute(
        f"SELECT u.id, u.email, u.name, u.status, u.balance "
        f"FROM {SCHEMA}.sessions s JOIN {SCHEMA}.users u ON u.id = s.user_id "
        f"WHERE s.token = %s AND s.expires_at > NOW()",
        (token,)
    )
    row = cur.fetchone()
    cur.close()
    if not row:
        return None
    return {'id': row[0], 'email': row[1], 'name': row[2], 'status': row[3], 'balance': row[4]}


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    params = event.get('queryStringParameters') or {}
    action = params.get('action', '')
    body = {}
    if event.get('body'):
        body = json.loads(event['body'])

    token = (event.get('headers') or {}).get('X-Auth-Token', '')

    conn = get_conn()
    try:
        # register
        if action == 'register' and method == 'POST':
            email = (body.get('email') or '').strip().lower()
            name = (body.get('name') or '').strip()
            password = body.get('password') or ''
            if not email or not name or not password:
                return err('Заполните все поля')
            if len(password) < 6:
                return err('Пароль должен быть не менее 6 символов')

            cur = conn.cursor()
            cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE email = %s", (email,))
            if cur.fetchone():
                cur.close()
                return err('Пользователь с таким email уже существует')

            ph = hash_password(password)
            cur.execute(
                f"INSERT INTO {SCHEMA}.users (email, name, password_hash) VALUES (%s, %s, %s) RETURNING id",
                (email, name, ph)
            )
            user_id = cur.fetchone()[0]
            token_val = secrets.token_hex(32)
            cur.execute(
                f"INSERT INTO {SCHEMA}.sessions (user_id, token) VALUES (%s, %s)",
                (user_id, token_val)
            )
            conn.commit()
            cur.close()
            return ok({'token': token_val, 'user': {'id': user_id, 'email': email, 'name': name, 'status': 'bronze', 'balance': 0}}, 201)

        # login
        if action == 'login' and method == 'POST':
            email = (body.get('email') or '').strip().lower()
            password = body.get('password') or ''
            if not email or not password:
                return err('Введите email и пароль')

            cur = conn.cursor()
            cur.execute(
                f"SELECT id, name, status, balance FROM {SCHEMA}.users WHERE email = %s AND password_hash = %s",
                (email, hash_password(password))
            )
            row = cur.fetchone()
            if not row:
                cur.close()
                return err('Неверный email или пароль', 401)

            user_id, name, status, balance = row
            token_val = secrets.token_hex(32)
            cur.execute(
                f"INSERT INTO {SCHEMA}.sessions (user_id, token) VALUES (%s, %s)",
                (user_id, token_val)
            )
            conn.commit()
            cur.close()
            return ok({'token': token_val, 'user': {'id': user_id, 'email': email, 'name': name, 'status': status, 'balance': balance}})

        # me
        if action == 'me' and method == 'GET':
            if not token:
                return err('Не авторизован', 401)
            user = get_user_by_token(conn, token)
            if not user:
                return err('Сессия истекла', 401)
            return ok({'user': user})

        # logout
        if action == 'logout' and method == 'POST':
            if token:
                cur = conn.cursor()
                cur.execute(f"UPDATE {SCHEMA}.sessions SET expires_at = NOW() WHERE token = %s", (token,))
                conn.commit()
                cur.close()
            return ok({'ok': True})

        return err('Неизвестное действие', 404)

    finally:
        conn.close()
