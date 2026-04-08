import { useState } from 'react';
import Icon from '@/components/ui/icon';

const statCards = [
  { icon: 'Gavel', label: 'Всего аукционов', value: '47' },
  { icon: 'Trophy', label: 'Побед', value: '31' },
  { icon: 'TrendingUp', label: 'Процент побед', value: '66%' },
  { icon: 'Wallet', label: 'Потрачено', value: '₽ 4.2М' },
  { icon: 'Star', label: 'Рейтинг', value: '4.9' },
  { icon: 'Award', label: 'Статус', value: 'Золотой' },
];

const badges = [
  { icon: '🏆', label: 'Первая победа' },
  { icon: '🔥', label: '10 побед подряд' },
  { icon: '💎', label: 'VIP участник' },
  { icon: '⚡', label: 'Быстрые ставки' },
];

export default function ProfilePage() {
  const [tab, setTab] = useState('info');
  const [notifSettings, setNotifSettings] = useState({
    newLots: true,
    outbid: true,
    win: true,
    end: false,
  });

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-12 flex items-start justify-between">
          <div>
            <p className="font-golos text-xs tracking-[0.3em] uppercase text-gold mb-3">Профиль</p>
            <h1 className="font-cormorant text-5xl font-light">Личный кабинет</h1>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 border border-border font-golos text-sm hover:bg-foreground hover:text-background hover:border-foreground transition-all duration-200">
            <Icon name="LogOut" size={14} />
            Выйти
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Avatar */}
            <div className="flex flex-col items-center text-center p-8 border border-border mb-6">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4 border-2 border-gold">
                <Icon name="User" size={32} className="text-muted-foreground" />
              </div>
              <h2 className="font-cormorant text-2xl font-light">Александр В.</h2>
              <p className="font-golos text-sm text-muted-foreground mt-1">alex@example.com</p>
              <div className="flex items-center gap-1.5 mt-3 px-3 py-1.5 bg-gold/10">
                <Icon name="Award" size={13} className="text-gold" />
                <span className="font-golos text-xs text-gold font-medium">Золотой статус</span>
              </div>
            </div>

            {/* Badges */}
            <div className="border border-border p-5 mb-6">
              <p className="font-golos text-xs uppercase tracking-widest text-muted-foreground mb-4">Достижения</p>
              <div className="grid grid-cols-2 gap-3">
                {badges.map((b) => (
                  <div key={b.label} className="flex flex-col items-center gap-2 p-3 bg-secondary text-center">
                    <span className="text-2xl">{b.icon}</span>
                    <span className="font-golos text-xs text-muted-foreground leading-tight">{b.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Balance */}
            <div className="border border-foreground p-5 bg-foreground text-background">
              <p className="font-golos text-xs uppercase tracking-widest text-background/60 mb-2">Баланс счёта</p>
              <p className="font-cormorant text-3xl font-light">₽ 250 000</p>
              <button className="mt-4 w-full py-2.5 border border-background/30 font-golos text-sm hover:bg-background hover:text-foreground transition-all duration-200">
                Пополнить
              </button>
            </div>
          </div>

          {/* Main */}
          <div className="lg:col-span-2">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {statCards.map((s) => (
                <div key={s.label} className="border border-border p-5 text-center">
                  <Icon name={s.icon} size={20} className="text-gold mx-auto mb-2" fallback="Star" />
                  <p className="font-cormorant text-2xl font-light">{s.value}</p>
                  <p className="font-golos text-xs text-muted-foreground mt-1 leading-tight">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="border-b border-border mb-8 flex items-center gap-0">
              {['info', 'notif', 'security'].map((t) => {
                const labels: Record<string, string> = { info: 'Данные', notif: 'Уведомления', security: 'Безопасность' };
                return (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`px-6 py-3 font-golos text-sm border-b-2 transition-all ${
                      tab === t ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {labels[t]}
                  </button>
                );
              })}
            </div>

            {tab === 'info' && (
              <div className="space-y-5 animate-fade-in">
                <div className="grid md:grid-cols-2 gap-5">
                  {[
                    { label: 'Имя', value: 'Александр', placeholder: 'Ваше имя' },
                    { label: 'Фамилия', value: 'Волков', placeholder: 'Ваша фамилия' },
                    { label: 'Email', value: 'alex@example.com', placeholder: 'Email' },
                    { label: 'Телефон', value: '+7 (999) 123-45-67', placeholder: 'Телефон' },
                  ].map((f) => (
                    <div key={f.label}>
                      <label className="font-golos text-xs text-muted-foreground uppercase tracking-widest mb-2 block">{f.label}</label>
                      <input
                        defaultValue={f.value}
                        placeholder={f.placeholder}
                        className="w-full px-4 py-3 border border-border font-golos text-sm focus:outline-none focus:border-foreground transition-colors bg-background"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="font-golos text-xs text-muted-foreground uppercase tracking-widest mb-2 block">О себе</label>
                  <textarea
                    rows={3}
                    defaultValue="Коллекционер антиквариата и предметов искусства XIX века."
                    className="w-full px-4 py-3 border border-border font-golos text-sm focus:outline-none focus:border-foreground transition-colors bg-background resize-none"
                  />
                </div>
                <button className="px-8 py-3 bg-foreground text-background font-golos text-sm hover:bg-gold hover:text-foreground transition-all duration-200">
                  Сохранить
                </button>
              </div>
            )}

            {tab === 'notif' && (
              <div className="space-y-4 animate-fade-in">
                {[
                  { key: 'newLots', label: 'Новые лоты', desc: 'Уведомления о появлении новых лотов в избранных категориях' },
                  { key: 'outbid', label: 'Перебитая ставка', desc: 'Когда кто-то перебивает вашу ставку на аукционе' },
                  { key: 'win', label: 'Победа в аукционе', desc: 'Поздравление с победой и инструкция по оплате' },
                  { key: 'end', label: 'Завершение аукциона', desc: 'Напоминание за 30 минут до окончания аукциона' },
                ].map((n) => (
                  <div key={n.key} className="flex items-center justify-between p-5 border border-border">
                    <div>
                      <p className="font-golos text-sm font-medium">{n.label}</p>
                      <p className="font-golos text-xs text-muted-foreground mt-0.5">{n.desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifSettings((prev) => ({ ...prev, [n.key]: !prev[n.key as keyof typeof prev] }))}
                      className={`relative w-11 h-6 transition-colors duration-200 flex-shrink-0 ${
                        notifSettings[n.key as keyof typeof notifSettings] ? 'bg-foreground' : 'bg-border'
                      }`}
                    >
                      <span className={`absolute top-1 w-4 h-4 bg-background transition-all duration-200 ${
                        notifSettings[n.key as keyof typeof notifSettings] ? 'left-6' : 'left-1'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {tab === 'security' && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <label className="font-golos text-xs text-muted-foreground uppercase tracking-widest mb-2 block">Текущий пароль</label>
                  <input type="password" className="w-full px-4 py-3 border border-border font-golos text-sm focus:outline-none focus:border-foreground transition-colors bg-background" placeholder="••••••••" />
                </div>
                <div>
                  <label className="font-golos text-xs text-muted-foreground uppercase tracking-widest mb-2 block">Новый пароль</label>
                  <input type="password" className="w-full px-4 py-3 border border-border font-golos text-sm focus:outline-none focus:border-foreground transition-colors bg-background" placeholder="••••••••" />
                </div>
                <div>
                  <label className="font-golos text-xs text-muted-foreground uppercase tracking-widest mb-2 block">Подтвердите пароль</label>
                  <input type="password" className="w-full px-4 py-3 border border-border font-golos text-sm focus:outline-none focus:border-foreground transition-colors bg-background" placeholder="••••••••" />
                </div>
                <button className="px-8 py-3 bg-foreground text-background font-golos text-sm hover:bg-gold hover:text-foreground transition-all duration-200">
                  Изменить пароль
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
