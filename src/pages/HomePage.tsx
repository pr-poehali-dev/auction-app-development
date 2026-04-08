import Icon from '@/components/ui/icon';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

const stats = [
  { value: '12 450', label: 'Лотов продано' },
  { value: '3 200', label: 'Участников' },
  { value: '₽ 1.2 млрд', label: 'Объём торгов' },
  { value: '98%', label: 'Довольных клиентов' },
];

const featured = [
  {
    id: 1,
    title: 'Антикварная ваза XVIII века',
    category: 'Керамика',
    currentBid: '₽ 485 000',
    bids: 14,
    timeLeft: '2ч 15м',
    image: 'https://cdn.poehali.dev/projects/94fe92d1-932f-4991-a361-3d7dfead04b2/files/a5ab4683-2033-4175-9829-05d69100c9bc.jpg',
  },
  {
    id: 2,
    title: 'Золотые карманные часы Patek',
    category: 'Часы',
    currentBid: '₽ 1 200 000',
    bids: 28,
    timeLeft: '45м',
    image: 'https://cdn.poehali.dev/projects/94fe92d1-932f-4991-a361-3d7dfead04b2/files/8c2960d0-12e7-4cfb-8471-5760f56ba467.jpg',
  },
  {
    id: 3,
    title: 'Масло на холсте, XIX век',
    category: 'Живопись',
    currentBid: '₽ 890 000',
    bids: 9,
    timeLeft: '3ч 40м',
    image: 'https://cdn.poehali.dev/projects/94fe92d1-932f-4991-a361-3d7dfead04b2/files/e68c000a-2a2e-4d6d-ac23-0b5500734251.jpg',
  },
];

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-36 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="font-golos text-xs tracking-[0.3em] uppercase text-gold mb-6 animate-fade-in">
              Торговая платформа премиум-класса
            </p>
            <h1 className="font-cormorant text-5xl md:text-7xl font-light leading-[1.05] text-foreground animate-fade-in delay-100">
              Искусство<br />
              <em className="not-italic text-gold">торговать</em><br />
              правильно
            </h1>
            <p className="font-golos text-base text-muted-foreground mt-8 max-w-md leading-relaxed animate-fade-in delay-200">
              Площадка для покупки и продажи предметов искусства, антиквариата и коллекционных вещей. Прозрачно. Надёжно.
            </p>
            <div className="flex items-center gap-4 mt-10 animate-fade-in delay-300">
              <button
                onClick={() => onNavigate('catalog')}
                className="px-8 py-3.5 bg-foreground text-background font-golos text-sm tracking-wide hover:bg-gold hover:text-foreground transition-all duration-300"
              >
                Смотреть каталог
              </button>
              <button
                onClick={() => onNavigate('live')}
                className="px-6 py-3.5 border border-border font-golos text-sm tracking-wide flex items-center gap-2 hover:border-foreground transition-colors duration-200"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-gold animate-live-dot" />
                Активные аукционы
              </button>
            </div>
          </div>
          <div className="relative animate-fade-in delay-400">
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src={featured[0].image}
                alt="Аукционный лот"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-card border border-border p-5 shadow-xl">
              <p className="font-golos text-xs text-muted-foreground uppercase tracking-widest mb-1">Текущая ставка</p>
              <p className="font-cormorant text-2xl font-medium text-gold">₽ 485 000</p>
              <p className="font-golos text-xs text-muted-foreground mt-1">14 участников · 2ч 15м</p>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-px h-full bg-border" />
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full border border-border opacity-30" />
      </section>

      {/* Stats */}
      <section className="border-t border-b border-border">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4">
          {stats.map((s, i) => (
            <div key={i} className="py-10 px-6 border-r border-border last:border-0 text-center animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <p className="font-cormorant text-3xl md:text-4xl font-light text-foreground">{s.value}</p>
              <p className="font-golos text-xs text-muted-foreground mt-2 uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Lots */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="font-golos text-xs tracking-[0.3em] uppercase text-gold mb-3">Избранное</p>
            <h2 className="font-cormorant text-4xl font-light">Топ лоты недели</h2>
          </div>
          <button
            onClick={() => onNavigate('catalog')}
            className="hidden md:flex items-center gap-2 font-golos text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Все лоты
            <Icon name="ArrowRight" size={16} />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {featured.map((lot, i) => (
            <div key={lot.id} className="group cursor-pointer animate-fade-in hover-lift" style={{ animationDelay: `${i * 0.15}s` }}>
              <div className="aspect-[4/3] overflow-hidden mb-4 bg-secondary">
                <img
                  src={lot.image}
                  alt={lot.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex items-start justify-between mb-2">
                <span className="font-golos text-xs text-muted-foreground uppercase tracking-widest">{lot.category}</span>
                <span className="font-golos text-xs text-red-500 flex items-center gap-1">
                  <Icon name="Clock" size={11} />
                  {lot.timeLeft}
                </span>
              </div>
              <h3 className="font-cormorant text-xl font-light leading-tight mb-3">{lot.title}</h3>
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div>
                  <p className="font-golos text-xs text-muted-foreground mb-0.5">Текущая ставка</p>
                  <p className="font-cormorant text-xl font-medium text-gold">{lot.currentBid}</p>
                </div>
                <div className="text-right">
                  <p className="font-golos text-xs text-muted-foreground mb-0.5">Ставок</p>
                  <p className="font-golos text-sm font-medium">{lot.bids}</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('live')}
                className="mt-4 w-full py-2.5 border border-border font-golos text-sm text-center hover:bg-foreground hover:text-background hover:border-foreground transition-all duration-200"
              >
                Сделать ставку
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-foreground text-background">
        <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="font-cormorant text-4xl md:text-5xl font-light mb-4">
              Готовы начать торговать?
            </h2>
            <p className="font-golos text-sm text-background/60 max-w-md leading-relaxed">
              Регистрируйтесь и получите доступ к тысячам уникальных лотов со всего мира.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('profile')}
              className="px-8 py-3.5 bg-gold text-foreground font-golos text-sm tracking-wide hover:bg-gold/90 transition-colors"
            >
              Создать аккаунт
            </button>
            <button
              onClick={() => onNavigate('contacts')}
              className="px-6 py-3.5 border border-background/30 font-golos text-sm hover:border-background transition-colors"
            >
              Связаться
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
