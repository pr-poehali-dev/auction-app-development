import { useState } from 'react';
import Icon from '@/components/ui/icon';

const tabs = ['Все', 'Выигранные', 'Проигранные', 'Текущие'];

const history = [
  { id: 1, title: 'Фарфоровая статуэтка, Мейсен', category: 'Керамика', myBid: 145000, finalPrice: 145000, result: 'win', date: '5 апр 2026', image: 'https://cdn.poehali.dev/projects/94fe92d1-932f-4991-a361-3d7dfead04b2/files/a5ab4683-2033-4175-9829-05d69100c9bc.jpg' },
  { id: 2, title: 'Картина «Летний пейзаж»', category: 'Живопись', myBid: 380000, finalPrice: 420000, result: 'lose', date: '3 апр 2026', image: 'https://cdn.poehali.dev/projects/94fe92d1-932f-4991-a361-3d7dfead04b2/files/e68c000a-2a2e-4d6d-ac23-0b5500734251.jpg' },
  { id: 3, title: 'Серебряный портсигар, 1890', category: 'Ювелирные', myBid: 87000, finalPrice: 87000, result: 'win', date: '28 мар 2026', image: 'https://cdn.poehali.dev/projects/94fe92d1-932f-4991-a361-3d7dfead04b2/files/8c2960d0-12e7-4cfb-8471-5760f56ba467.jpg' },
  { id: 4, title: 'Антикварная ваза XVIII века', category: 'Керамика', myBid: 460000, finalPrice: null, result: 'active', date: 'Сегодня', image: 'https://cdn.poehali.dev/projects/94fe92d1-932f-4991-a361-3d7dfead04b2/files/a5ab4683-2033-4175-9829-05d69100c9bc.jpg' },
  { id: 5, title: 'Морской хронометр, 1875', category: 'Часы', myBid: 220000, finalPrice: 220000, result: 'win', date: '15 мар 2026', image: 'https://cdn.poehali.dev/projects/94fe92d1-932f-4991-a361-3d7dfead04b2/files/8c2960d0-12e7-4cfb-8471-5760f56ba467.jpg' },
  { id: 6, title: 'Бронзовый канделябр', category: 'Декор', myBid: 95000, finalPrice: 112000, result: 'lose', date: '10 мар 2026', image: 'https://cdn.poehali.dev/projects/94fe92d1-932f-4991-a361-3d7dfead04b2/files/e68c000a-2a2e-4d6d-ac23-0b5500734251.jpg' },
];

function formatPrice(n: number) {
  return '₽ ' + n.toLocaleString('ru-RU');
}

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState('Все');

  const filtered = history.filter((h) => {
    if (activeTab === 'Выигранные') return h.result === 'win';
    if (activeTab === 'Проигранные') return h.result === 'lose';
    if (activeTab === 'Текущие') return h.result === 'active';
    return true;
  });

  const totalSpent = history.filter((h) => h.result === 'win').reduce((sum, h) => sum + h.myBid, 0);
  const winsCount = history.filter((h) => h.result === 'win').length;
  const winRate = Math.round((winsCount / history.length) * 100);

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <p className="font-golos text-xs tracking-[0.3em] uppercase text-gold mb-3">История</p>
          <h1 className="font-cormorant text-5xl font-light">Мои участия</h1>
        </div>
      </div>

      {/* Stats */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4">
          {[
            { label: 'Аукционов', value: history.length.toString() },
            { label: 'Побед', value: winsCount.toString() },
            { label: 'Процент побед', value: `${winRate}%` },
            { label: 'Потрачено', value: '₽ ' + (totalSpent / 1000000).toFixed(2) + 'М' },
          ].map((s, i) => (
            <div key={i} className="py-8 px-6 border-r border-border last:border-0 text-center">
              <p className="font-cormorant text-3xl font-light text-foreground">{s.value}</p>
              <p className="font-golos text-xs text-muted-foreground mt-1 uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Tabs */}
        <div className="flex items-center gap-0 mb-8 border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-golos text-sm border-b-2 transition-all duration-200 ${
                activeTab === tab
                  ? 'border-foreground text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="space-y-4">
          {filtered.map((item, i) => (
            <div
              key={item.id}
              className="border border-border p-5 flex items-center gap-5 animate-fade-in hover-lift cursor-pointer"
              style={{ animationDelay: `${i * 0.07}s`, opacity: 0 }}
            >
              <div className="w-20 h-20 flex-shrink-0 overflow-hidden bg-secondary">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-golos text-xs text-muted-foreground uppercase tracking-widest">{item.category}</span>
                  <span className="font-golos text-xs text-muted-foreground">{item.date}</span>
                </div>
                <h3 className="font-cormorant text-xl font-light leading-tight">{item.title}</h3>
              </div>

              <div className="hidden md:flex items-center gap-12 flex-shrink-0">
                <div className="text-right">
                  <p className="font-golos text-xs text-muted-foreground mb-0.5">Моя ставка</p>
                  <p className="font-cormorant text-lg font-light">{formatPrice(item.myBid)}</p>
                </div>
                {item.finalPrice && (
                  <div className="text-right">
                    <p className="font-golos text-xs text-muted-foreground mb-0.5">Финал</p>
                    <p className="font-cormorant text-lg font-light">{formatPrice(item.finalPrice)}</p>
                  </div>
                )}
              </div>

              <div className="flex-shrink-0">
                {item.result === 'win' && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gold/10 border border-gold">
                    <Icon name="Trophy" size={13} className="text-gold" />
                    <span className="font-golos text-xs text-gold font-medium">Победа</span>
                  </div>
                )}
                {item.result === 'lose' && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-200">
                    <Icon name="X" size={13} className="text-red-500" />
                    <span className="font-golos text-xs text-red-500">Проиграл</span>
                  </div>
                )}
                {item.result === 'active' && (
                  <div className="flex items-center gap-2 px-3 py-1.5 border border-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-live-dot" />
                    <span className="font-golos text-xs font-medium">Активный</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="py-20 text-center">
              <Icon name="ClipboardList" size={32} className="text-muted-foreground mx-auto mb-4" />
              <p className="font-cormorant text-2xl text-muted-foreground">Нет записей</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
