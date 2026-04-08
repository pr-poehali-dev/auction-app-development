import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface CatalogPageProps {
  onNavigate: (page: string) => void;
}

const categories = ['Все', 'Живопись', 'Часы', 'Керамика', 'Ювелирные', 'Скульптура', 'Мебель'];

const lots = [
  { id: 1, title: 'Антикварная ваза XVIII века', category: 'Керамика', start: '₽ 200 000', current: '₽ 485 000', bids: 14, timeLeft: '2ч 15м', status: 'active', image: 'https://cdn.poehali.dev/projects/94fe92d1-932f-4991-a361-3d7dfead04b2/files/a5ab4683-2033-4175-9829-05d69100c9bc.jpg' },
  { id: 2, title: 'Карманные часы Patek Philippe', category: 'Часы', start: '₽ 800 000', current: '₽ 1 200 000', bids: 28, timeLeft: '45м', status: 'active', image: 'https://cdn.poehali.dev/projects/94fe92d1-932f-4991-a361-3d7dfead04b2/files/8c2960d0-12e7-4cfb-8471-5760f56ba467.jpg' },
  { id: 3, title: 'Масло на холсте, XIX век', category: 'Живопись', start: '₽ 500 000', current: '₽ 890 000', bids: 9, timeLeft: '3ч 40м', status: 'active', image: 'https://cdn.poehali.dev/projects/94fe92d1-932f-4991-a361-3d7dfead04b2/files/e68c000a-2a2e-4d6d-ac23-0b5500734251.jpg' },
  { id: 4, title: 'Бронзовая статуэтка, Франция', category: 'Скульптура', start: '₽ 120 000', current: '₽ 175 000', bids: 6, timeLeft: '5ч 20м', status: 'active', image: 'https://cdn.poehali.dev/projects/94fe92d1-932f-4991-a361-3d7dfead04b2/files/a5ab4683-2033-4175-9829-05d69100c9bc.jpg' },
  { id: 5, title: 'Бриллиантовое колье, 1920-е', category: 'Ювелирные', start: '₽ 1 500 000', current: '₽ 2 100 000', bids: 41, timeLeft: '1ч 05м', status: 'active', image: 'https://cdn.poehali.dev/projects/94fe92d1-932f-4991-a361-3d7dfead04b2/files/8c2960d0-12e7-4cfb-8471-5760f56ba467.jpg' },
  { id: 6, title: 'Консоль в стиле Людовика XVI', category: 'Мебель', start: '₽ 350 000', current: '₽ 420 000', bids: 3, timeLeft: '8ч 30м', status: 'active', image: 'https://cdn.poehali.dev/projects/94fe92d1-932f-4991-a361-3d7dfead04b2/files/e68c000a-2a2e-4d6d-ac23-0b5500734251.jpg' },
];

export default function CatalogPage({ onNavigate }: CatalogPageProps) {
  const [activeCategory, setActiveCategory] = useState('Все');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('time');

  const filtered = lots.filter((l) => {
    const matchCat = activeCategory === 'Все' || l.category === activeCategory;
    const matchSearch = l.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <p className="font-golos text-xs tracking-[0.3em] uppercase text-gold mb-3">Каталог</p>
          <h1 className="font-cormorant text-5xl font-light">Все лоты</h1>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-border sticky top-16 bg-background/95 backdrop-blur-sm z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Поиск лота..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-border bg-background font-golos text-sm focus:outline-none focus:border-foreground transition-colors"
            />
          </div>

          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 flex-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-4 py-1.5 font-golos text-xs tracking-wide border transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-foreground text-background border-foreground'
                    : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-border bg-background font-golos text-sm px-3 py-2 focus:outline-none cursor-pointer"
          >
            <option value="time">По времени</option>
            <option value="price_asc">Цена: по возрастанию</option>
            <option value="price_desc">Цена: по убыванию</option>
            <option value="bids">По числу ставок</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <p className="font-golos text-sm text-muted-foreground mb-8">
          Найдено: <span className="text-foreground font-medium">{filtered.length}</span> лотов
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((lot, i) => (
            <div
              key={lot.id}
              className="group cursor-pointer animate-fade-in hover-lift"
              style={{ animationDelay: `${i * 0.08}s`, opacity: 0 }}
            >
              <div className="relative aspect-[4/3] overflow-hidden mb-4 bg-secondary">
                <img
                  src={lot.image}
                  alt={lot.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-card/95 backdrop-blur-sm px-2.5 py-1">
                  <span className="font-golos text-xs text-muted-foreground uppercase tracking-widest">{lot.category}</span>
                </div>
                <div className="absolute top-3 right-3 bg-red-500 text-white px-2.5 py-1 flex items-center gap-1.5">
                  <Icon name="Clock" size={11} className="text-white" />
                  <span className="font-golos text-xs">{lot.timeLeft}</span>
                </div>
              </div>
              <h3 className="font-cormorant text-xl font-light leading-tight mb-3">{lot.title}</h3>
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div>
                  <p className="font-golos text-xs text-muted-foreground mb-0.5">Текущая ставка</p>
                  <p className="font-cormorant text-xl font-medium text-gold">{lot.current}</p>
                </div>
                <div className="text-right">
                  <p className="font-golos text-xs text-muted-foreground mb-0.5">Старт</p>
                  <p className="font-golos text-sm text-muted-foreground">{lot.start}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={() => onNavigate('live')}
                  className="flex-1 py-2.5 bg-foreground text-background font-golos text-sm hover:bg-gold hover:text-foreground transition-all duration-200"
                >
                  Ставка
                </button>
                <button className="px-4 py-2.5 border border-border hover:border-foreground transition-colors">
                  <Icon name="Heart" size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-24 text-center">
            <Icon name="Search" size={32} className="text-muted-foreground mx-auto mb-4" />
            <p className="font-cormorant text-2xl text-muted-foreground">Лоты не найдены</p>
            <p className="font-golos text-sm text-muted-foreground mt-2">Попробуйте изменить фильтры</p>
          </div>
        )}
      </div>
    </div>
  );
}
