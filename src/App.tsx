import { useState, useCallback, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import NotificationToast from '@/components/NotificationToast';
import AuthModal from '@/components/AuthModal';
import HomePage from '@/pages/HomePage';
import CatalogPage from '@/pages/CatalogPage';
import LivePage from '@/pages/LivePage';
import HistoryPage from '@/pages/HistoryPage';
import ProfilePage from '@/pages/ProfilePage';
import ContactsPage from '@/pages/ContactsPage';
import { User, apiMe, apiLogout } from '@/lib/api';

interface Notification {
  id: number;
  type: 'bid' | 'win' | 'new';
  text: string;
  time: string;
}

interface ToastNotif {
  id: number;
  type: 'bid' | 'win' | 'new';
  text: string;
}

let notifCounter = 3;

const initialNotifs: Notification[] = [
  { id: 1, type: 'bid', text: 'Вашу ставку перебили на «Фарфоровая статуэтка, Мейсен»', time: '14:32' },
  { id: 2, type: 'win', text: 'Вы выиграли лот «Серебряный портсигар, 1890»! Ожидайте инструкцию.', time: '12:15' },
  { id: 3, type: 'new', text: 'Новый лот: Бриллиантовое кольцо, Tiffany & Co. 1950-е', time: '10:00' },
];

export default function App() {
  const [page, setPage] = useState('home');
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifs);
  const [toast, setToast] = useState<ToastNotif | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    apiMe().then((u) => { if (u) setUser(u); });
  }, []);

  const addNotification = useCallback((text: string, type: 'bid' | 'win' | 'new' = 'bid') => {
    notifCounter++;
    const now = new Date();
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newNotif: Notification = { id: notifCounter, type, text, time: timeStr };
    setNotifications((prev) => [newNotif, ...prev]);
    setToast({ id: notifCounter, type, text });
  }, []);

  const clearNotification = useCallback((id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const handleBid = useCallback((text: string) => {
    const type: 'bid' | 'win' | 'new' = text.includes('перебили') ? 'bid' : 'win';
    addNotification(text, type);
  }, [addNotification]);

  const navigate = useCallback((p: string) => {
    if ((p === 'history' || p === 'profile') && !user) {
      setAuthOpen(true);
      return;
    }
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [user]);

  const handleLogout = useCallback(async () => {
    await apiLogout();
    setUser(null);
    setPage('home');
  }, []);

  const handleAuthSuccess = useCallback((u: User) => {
    setUser(u);
    addNotification(`Добро пожаловать, ${u.name}!`, 'win');
  }, [addNotification]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        currentPage={page}
        onNavigate={navigate}
        notifications={notifications}
        onClearNotification={clearNotification}
        user={user}
        onLoginClick={() => setAuthOpen(true)}
        onLogout={handleLogout}
      />

      <main>
        {page === 'home' && <HomePage onNavigate={navigate} />}
        {page === 'catalog' && <CatalogPage onNavigate={navigate} />}
        {page === 'live' && <LivePage onBid={handleBid} />}
        {page === 'history' && <HistoryPage />}
        {page === 'profile' && <ProfilePage user={user} onLogout={handleLogout} />}
        {page === 'contacts' && <ContactsPage />}
      </main>

      <NotificationToast toast={toast} onClose={() => setToast(null)} />

      {authOpen && (
        <AuthModal
          onClose={() => setAuthOpen(false)}
          onSuccess={handleAuthSuccess}
        />
      )}

      <footer className="border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-cormorant text-xl font-light tracking-[0.15em] uppercase">Аукцион</p>
            <p className="font-golos text-xs text-muted-foreground mt-1">Торговая платформа премиум-класса</p>
          </div>
          <div className="flex items-center gap-8">
            {['home', 'catalog', 'live', 'contacts'].map((p) => {
              const labels: Record<string, string> = { home: 'Главная', catalog: 'Каталог', live: 'Аукционы', contacts: 'Контакты' };
              return (
                <button
                  key={p}
                  onClick={() => navigate(p)}
                  className="font-golos text-xs text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
                >
                  {labels[p]}
                </button>
              );
            })}
          </div>
          <p className="font-golos text-xs text-muted-foreground">© 2026 Аукцион</p>
        </div>
      </footer>
    </div>
  );
}
