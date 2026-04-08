import { useState } from 'react';
import { ownerRegister } from '@/lib/owner-api';
import Icon from '@/components/ui/icon';

interface Props {
  onSuccess: () => void;
  onGoLogin: () => void;
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

const PASSWORD_RULES = [
  { label: 'Минимум 8 символов', test: (p: string) => p.length >= 8 },
  { label: 'Заглавная буква', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Строчная буква', test: (p: string) => /[a-z]/.test(p) },
  { label: 'Цифра', test: (p: string) => /[0-9]/.test(p) },
  { label: 'Спецсимвол (!@#$...)', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

export default function OwnerRegisterPage({ onSuccess, onGoLogin }: Props) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatPhone(e.target.value);
    if (formatted.replace(/\D/g, '').length <= 11) {
      setPhone(formatted);
    }
  }

  const allRulesPass = PASSWORD_RULES.every((r) => r.test(password));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 11) {
      setError('Введите корректный номер телефона');
      return;
    }
    if (!allRulesPass) {
      setError('Пароль не соответствует требованиям');
      return;
    }
    if (password !== passwordRepeat) {
      setError('Пароли не совпадают');
      return;
    }
    setLoading(true);
    try {
      await ownerRegister('+' + digits, password);
      setDone(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto mb-4">
            <Icon name="CheckCircle2" size={28} className="text-green-600" />
          </div>
          <h2 className="font-cormorant text-2xl font-semibold mb-2">Готово!</h2>
          <p className="text-muted-foreground text-sm mb-6">Аккаунт владельца успешно создан. Теперь войдите в систему.</p>
          <button
            onClick={onGoLogin}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all"
          >
            Войти
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
            <Icon name="ShieldPlus" size={28} className="text-primary-foreground" />
          </div>
          <h1 className="font-cormorant text-2xl font-semibold tracking-wide">Регистрация владельца</h1>
          <p className="text-muted-foreground text-sm mt-1">Создание аккаунта для управления</p>
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
                placeholder="Придумайте надёжный пароль"
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

            {password.length > 0 && (
              <div className="mt-2 space-y-1">
                {PASSWORD_RULES.map((rule) => (
                  <div key={rule.label} className="flex items-center gap-2 text-xs">
                    <Icon
                      name={rule.test(password) ? 'CheckCircle2' : 'Circle'}
                      size={13}
                      className={rule.test(password) ? 'text-green-500' : 'text-muted-foreground'}
                    />
                    <span className={rule.test(password) ? 'text-green-600' : 'text-muted-foreground'}>
                      {rule.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Повторите пароль</label>
            <input
              type={showPass ? 'text' : 'password'}
              value={passwordRepeat}
              onChange={(e) => setPasswordRepeat(e.target.value)}
              placeholder="Повторите пароль"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
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
            {loading ? 'Создание аккаунта...' : 'Зарегистрироваться'}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Уже есть аккаунт?{' '}
          <button onClick={onGoLogin} className="text-primary hover:underline font-medium">
            Войти
          </button>
        </p>
      </div>
    </div>
  );
}
