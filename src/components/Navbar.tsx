import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { User } from '@/lib/api';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  notifications: Notification[];
  onClearNotification: (id: number) => void;
  user: User | null;
  onLoginClick: () => void;
  onLogout: () => void;
}

interface Notification {
  id: number;
  type: 'bid' | 'win' | 'new';
  text: string;
  time: string;
}

const navItems = [
  { id: 'home', label: 'Главная' },
  { id: 'catalog', label: 'Каталог' },
  { id: 'live', label: 'Активные' },
  { id: 'history', label: 'История' },
  { id: 'profile', label: 'Профиль' },
  { id: 'contacts', label: 'Контакты' },
];

export default function Navbar({ currentPage, onNavigate, notifications, onClearNotification, user, onLoginClick, onLogout }: NavbarProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <button
          onClick={() => onNavigate('home')}
          className="font-cormorant text-2xl font-light tracking-[0.15em] uppercase hover:text-gold transition-colors duration-200"
        >
          Аукцион
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`font-golos text-sm tracking-wide transition-colors duration-200 relative ${
                currentPage === item.id
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {item.label}
              {item.id === 'live' && (
                <span className="ml-1.5 inline-flex w-1.5 h-1.5 rounded-full bg-gold animate-live-dot" />
              )}
              {currentPage === item.id && (
                <span className="absolute -bottom-[22px] left-0 right-0 h-px bg-foreground" />
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 hover:bg-secondary transition-colors"
            >
              <Icon name="Bell" size={18} />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-gold text-[10px] font-golos font-medium text-white flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border shadow-xl animate-fade-in-fast">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <span className="font-golos text-sm font-medium">Уведомления</span>
                  <button onClick={() => setNotifOpen(false)}>
                    <Icon name="X" size={14} className="text-muted-foreground" />
                  </button>
                </div>
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground text-sm font-golos">
                    Нет новых уведомлений
                  </div>
                ) : (
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-4 border-b border-border last:border-0 flex items-start gap-3 animate-notif-in">
                        <span className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                          n.type === 'win' ? 'bg-gold' : n.type === 'bid' ? 'bg-red-400' : 'bg-foreground'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="font-golos text-sm text-foreground leading-snug">{n.text}</p>
                          <p className="font-golos text-xs text-muted-foreground mt-0.5">{n.time}</p>
                        </div>
                        <button onClick={() => onClearNotification(n.id)} className="flex-shrink-0">
                          <Icon name="X" size={12} className="text-muted-foreground hover:text-foreground" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {user ? (
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => onNavigate('profile')}
                className="flex items-center gap-2 px-4 py-2 border border-foreground text-sm font-golos hover:bg-foreground hover:text-background transition-all duration-200"
              >
                <Icon name="User" size={14} />
                {user.name.split(' ')[0]}
              </button>
              <button onClick={onLogout} className="p-2 hover:bg-secondary transition-colors" title="Выйти">
                <Icon name="LogOut" size={16} className="text-muted-foreground" />
              </button>
            </div>
          ) : (
            <button
              onClick={onLoginClick}
              className="hidden md:flex items-center gap-2 px-4 py-2 border border-foreground text-sm font-golos hover:bg-foreground hover:text-background transition-all duration-200"
            >
              <Icon name="User" size={14} />
              Войти
            </button>
          )}

          {/* Mobile burger */}
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name={menuOpen ? 'X' : 'Menu'} size={18} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-background animate-fade-in-fast">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { onNavigate(item.id); setMenuOpen(false); }}
              className={`w-full text-left px-6 py-3.5 font-golos text-sm border-b border-border last:border-0 flex items-center justify-between ${
                currentPage === item.id ? 'text-foreground font-medium' : 'text-muted-foreground'
              }`}
            >
              {item.label}
              {item.id === 'live' && (
                <span className="inline-flex w-1.5 h-1.5 rounded-full bg-gold animate-live-dot" />
              )}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}