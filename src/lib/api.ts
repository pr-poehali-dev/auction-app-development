const AUTH_URL = 'https://functions.poehali.dev/de2e2b45-976b-4bda-b5c4-c7cbedf69b5b';

export interface User {
  id: number;
  email: string;
  name: string;
  status: string;
  balance: number;
}

function getToken(): string {
  return localStorage.getItem('auction_token') || '';
}

function setToken(t: string) {
  localStorage.setItem('auction_token', t);
}

function clearToken() {
  localStorage.removeItem('auction_token');
}

async function request(action: string, method: string, body?: object): Promise<unknown> {
  const res = await fetch(`${AUTH_URL}?action=${action}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-Auth-Token': getToken(),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error((data as { error?: string }).error || 'Ошибка');
  return data;
}

export async function apiRegister(email: string, name: string, password: string): Promise<User> {
  const data = await request('register', 'POST', { email, name, password }) as { token: string; user: User };
  setToken(data.token);
  return data.user;
}

export async function apiLogin(email: string, password: string): Promise<User> {
  const data = await request('login', 'POST', { email, password }) as { token: string; user: User };
  setToken(data.token);
  return data.user;
}

export async function apiMe(): Promise<User | null> {
  if (!getToken()) return null;
  try {
    const data = await request('me', 'GET') as { user: User };
    return data.user;
  } catch {
    clearToken();
    return null;
  }
}

export async function apiLogout(): Promise<void> {
  await request('logout', 'POST').catch(() => {});
  clearToken();
}
