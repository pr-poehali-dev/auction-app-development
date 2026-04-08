import { useEffect, useState } from 'react';
import { ownerGetAdmins, ownerLogout, AdminUser } from '@/lib/owner-api';
import Icon from '@/components/ui/icon';

interface Props {
  onLogout: () => void;
}

export default function OwnerDashboardPage({ onLogout }: Props) {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    ownerGetAdmins()
      .then(setAdmins)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleLogout() {
    await ownerLogout();
    onLogout();
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-4 py-4 flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Icon name="Shield" size={16} className="text-primary-foreground" />
          </div>
          <div>
            <p className="font-cormorant text-lg font-semibold leading-none">Управление</p>
            <p className="text-xs text-muted-foreground">Владелец платформы</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Icon name="LogOut" size={16} />
          Выйти
        </button>
      </header>

      <main className="px-4 py-6 max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-cormorant text-xl font-semibold">Администраторы</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {loading ? 'Загрузка...' : `${admins.length} ${admins.length === 1 ? 'администратор' : admins.length >= 2 && admins.length <= 4 ? 'администратора' : 'администраторов'}`}
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 active:scale-[0.98] transition-all">
            <Icon name="UserPlus" size={16} />
            Добавить
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 px-3 py-3 rounded-xl mb-4">
            <Icon name="AlertCircle" size={16} />
            <span>{error}</span>
          </div>
        )}

        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        )}

        {!loading && admins.length === 0 && !error && (
          <div className="text-center py-16">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <Icon name="Users" size={24} className="text-muted-foreground" />
            </div>
            <p className="font-medium text-foreground">Администраторов пока нет</p>
            <p className="text-sm text-muted-foreground mt-1">Нажмите «Добавить», чтобы создать первого</p>
          </div>
        )}

        {!loading && admins.length > 0 && (
          <div className="space-y-3">
            {admins.map((admin) => (
              <div key={admin.id} className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:bg-accent/5 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon name="User" size={18} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{admin.name || 'Без имени'}</p>
                  <p className="text-xs text-muted-foreground">{admin.phone}</p>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${admin.is_active ? 'bg-green-500/10 text-green-600' : 'bg-muted text-muted-foreground'}`}>
                  {admin.is_active ? 'Активен' : 'Отключён'}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
