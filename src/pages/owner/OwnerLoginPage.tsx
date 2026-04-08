import { useState } from 'react';
import { ownerLogin } from '@/lib/owner-api';
import Icon from '@/components/ui/icon';

interface Props {
  onSuccess: () => void;
  onGoRegister: () => void;
}

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '');
  const d = digits.startsWith('7') ? digits : digits.startsWith('8') ? '7' + digits.slice(1) : '7' + digits;
  let result = '+7';
  if (d.length > 1) result += ' (' + d.slice(1, 4);
  if (d.length > 4) result += ') ' + d.slice(4, 7);
  if (d.length > 7) result += '-' + d.slice(7, 9);
  if (d.length > 9) result += '-' + d.slice(9, 11);
  return result;
}

export default function OwnerLoginPage({ onSuccess, onGoRegister }: Props) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatPhone(e.target.value);
    if (formatted.replace(/\D/g, '').length <= 11) {
      setPhone(formatted);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 11) {
      setError('Введите корректный номер телефона');
      return;
    }
    if (!password) {
      setError('Введите пароль');
      return;
    }
    setLoading(true);
    try {
      await ownerLogin('+' + digits, password);
      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
            <Icon name="Shield" size={28} className="text-primary-foreground" />
          </div>
          <h1 className="font-cormorant text-2xl font-semibold tracking-wide">Вход для владельца</h1>
          <p className="text-muted-foreground text-sm mt-1">Управление платформой</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Номер телефона</label>
            <input
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="+7 (___) ___-__-__"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Пароль</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon name={showPass ? 'EyeOff' : 'Eye'} size={18} />
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 px-3 py-2.5 rounded-lg">
              <Icon name="AlertCircle" size={16} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-60"
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Нет аккаунта?{' '}
          <button onClick={onGoRegister} className="text-primary hover:underline font-medium">
            Зарегистрироваться
          </button>
        </p>
      </div>
    </div>
  );
}
