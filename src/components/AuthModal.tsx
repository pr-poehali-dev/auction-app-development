import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { apiLogin, apiRegister, User } from '@/lib/api';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export default function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ email: '', name: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let user: User;
      if (mode === 'login') {
        user = await apiLogin(form.email, form.password);
      } else {
        user = await apiRegister(form.email, form.name, form.password);
      }
      onSuccess(user);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-background border border-border shadow-2xl animate-fade-in mx-4">
        <div className="flex items-center justify-between px-8 py-6 border-b border-border">
          <h2 className="font-cormorant text-2xl font-light">
            {mode === 'login' ? 'Вход в аккаунт' : 'Регистрация'}
          </h2>
          <button onClick={onClose} className="p-1 hover:text-muted-foreground transition-colors">
            <Icon name="X" size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-7 space-y-5">
          {mode === 'register' && (
            <div>
              <label className="font-golos text-xs text-muted-foreground uppercase tracking-widest mb-2 block">Имя</label>
              <input
                required
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ваше имя"
                className="w-full px-4 py-3 border border-border font-golos text-sm focus:outline-none focus:border-foreground transition-colors bg-background"
              />
            </div>
          )}

          <div>
            <label className="font-golos text-xs text-muted-foreground uppercase tracking-widest mb-2 block">Email</label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="email@example.com"
              className="w-full px-4 py-3 border border-border font-golos text-sm focus:outline-none focus:border-foreground transition-colors bg-background"
            />
          </div>

          <div>
            <label className="font-golos text-xs text-muted-foreground uppercase tracking-widest mb-2 block">Пароль</label>
            <input
              required
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              minLength={6}
              className="w-full px-4 py-3 border border-border font-golos text-sm focus:outline-none focus:border-foreground transition-colors bg-background"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 border border-red-200 bg-red-50">
              <Icon name="AlertCircle" size={15} className="text-red-500 flex-shrink-0" />
              <p className="font-golos text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-foreground text-background font-golos text-sm tracking-wide hover:bg-gold hover:text-foreground transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && <Icon name="Loader" size={15} className="animate-spin" />}
            {mode === 'login' ? 'Войти' : 'Создать аккаунт'}
          </button>

          <p className="text-center font-golos text-sm text-muted-foreground">
            {mode === 'login' ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
            <button
              type="button"
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
              className="text-foreground underline underline-offset-2 hover:text-gold transition-colors"
            >
              {mode === 'login' ? 'Зарегистрироваться' : 'Войти'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
