const OWNER_URL = 'https://functions.poehali.dev/ce3c4efc-6e1a-47ea-87b6-93fd28335f34';

export interface AdminUser {
  id: number;
  phone: string;
  name: string;
  is_active: boolean;
  created_at: string;
}

function getToken(): string {
  return localStorage.getItem('owner_token') || '';
}

export function setOwnerToken(t: string) {
  localStorage.setItem('owner_token', t);
}

export function clearOwnerToken() {
  localStorage.removeItem('owner_token');
}

export function hasOwnerToken(): boolean {
  return !!localStorage.getItem('owner_token');
}

async function request(path: string, method: string, body?: object): Promise<unknown> {
  const res = await fetch(`${OWNER_URL}${path}`, {
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

export async function ownerRegister(phone: string, password: string): Promise<void> {
  await request('/', 'POST', { phone, password });
}

export async function ownerLogin(phone: string, password: string): Promise<void> {
  const data = await request('/login', 'POST', { phone, password }) as { token: string };
  setOwnerToken(data.token);
}

export async function ownerMe(): Promise<{ id: number; phone: string } | null> {
  if (!hasOwnerToken()) return null;
  try {
    return await request('/me', 'GET') as { id: number; phone: string };
  } catch {
    clearOwnerToken();
    return null;
  }
}

export async function ownerLogout(): Promise<void> {
  await request('/logout', 'POST').catch(() => {});
  clearOwnerToken();
}

export async function ownerGetAdmins(): Promise<AdminUser[]> {
  const data = await request('/admins', 'GET') as { admins: AdminUser[] };
  return data.admins;
}
