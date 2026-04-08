import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

interface LivePageProps {
  onBid: (text: string) => void;
}

interface Lot {
  id: number;
  title: string;
  category: string;
  currentBid: number;
  myBid: number | null;
  bids: BidEntry[];
  totalBidders: number;
  timeLeft: number;
  image: string;
  leading: boolean;
}

interface BidEntry {
  user: string;
  amount: number;
  time: string;
}

const initialLots: Lot[] = [
  {
    id: 1,
    title: 'Антикварная ваза XVIII века',
    category: 'Керамика',
    currentBid: 485000,
    myBid: null,
    totalBidders: 14,
    timeLeft: 8100,
    leading: false,
    image: 'https://cdn.poehali.dev/projects/94fe92d1-932f-4991-a361-3d7dfead04b2/files/a5ab4683-2033-4175-9829-05d69100c9bc.jpg',
    bids: [
      { user: 'Участник #847', amount: 485000, time: '14:32' },
      { user: 'Участник #234', amount: 460000, time: '14:28' },
      { user: 'Участник #891', amount: 420000, time: '14:15' },
    ],
  },
  {
    id: 2,
    title: 'Карманные часы Patek Philippe',
    category: 'Часы',
    currentBid: 1200000,
    myBid: null,
    totalBidders: 28,
    timeLeft: 2700,
    leading: false,
    image: 'https://cdn.poehali.dev/projects/94fe92d1-932f-4991-a361-3d7dfead04b2/files/8c2960d0-12e7-4cfb-8471-5760f56ba467.jpg',
    bids: [
      { user: 'Участник #103', amount: 1200000, time: '14:35' },
      { user: 'Участник #566', amount: 1150000, time: '14:33' },
      { user: 'Участник #847', amount: 1100000, time: '14:30' },
    ],
  },
];

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}ч ${m}м`;
  if (m > 0) return `${m}м ${s}с`;
  return `${s}с`;
}

function formatPrice(n: number) {
  return '₽ ' + n.toLocaleString('ru-RU');
}

export default function LivePage({ onBid }: LivePageProps) {
  const [lots, setLots] = useState<Lot[]>(initialLots);
  const [selected, setSelected] = useState<number>(1);
  const [bidStep, setBidStep] = useState(10000);
  const [customBid, setCustomBid] = useState('');
  const [flashBid, setFlashBid] = useState(false);

  const activeLot = lots.find((l) => l.id === selected);

  useEffect(() => {
    const timer = setInterval(() => {
      setLots((prev) =>
        prev.map((l) => ({
          ...l,
          timeLeft: Math.max(0, l.timeLeft - 1),
        }))
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate random bids
  useEffect(() => {
    const sim = setInterval(() => {
      setLots((prev) =>
        prev.map((l) => {
          if (Math.random() > 0.7 && l.timeLeft > 0) {
            const increase = Math.floor(Math.random() * 3 + 1) * 5000;
            const newBid = l.currentBid + increase;
            const now = new Date();
            const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
            const newEntry: BidEntry = {
              user: `Участник #${Math.floor(Math.random() * 900 + 100)}`,
              amount: newBid,
              time: timeStr,
            };
            if (l.id === selected) {
              setFlashBid(true);
              setTimeout(() => setFlashBid(false), 1000);
              if (l.myBid && newBid > l.myBid) {
                onBid(`Вашу ставку перебили на лот «${l.title}»`);
              }
            }
            return {
              ...l,
              currentBid: newBid,
              totalBidders: l.totalBidders + (Math.random() > 0.8 ? 1 : 0),
              leading: l.myBid ? newBid <= l.myBid : false,
              bids: [newEntry, ...l.bids].slice(0, 10),
            };
          }
          return l;
        })
      );
    }, 5000);
    return () => clearInterval(sim);
  }, [selected, onBid]);

  const handleBid = (amount: number) => {
    setLots((prev) =>
      prev.map((l) => {
        if (l.id === selected && amount > l.currentBid) {
          const now = new Date();
          const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
          const newEntry: BidEntry = { user: 'Вы', amount, time: timeStr };
          onBid(`Ваша ставка ${formatPrice(amount)} на лот «${l.title}» принята`);
          return {
            ...l,
            currentBid: amount,
            myBid: amount,
            leading: true,
            bids: [newEntry, ...l.bids].slice(0, 10),
          };
        }
        return l;
      })
    );
    setCustomBid('');
  };

  if (!activeLot) return null;

  const nextBid = activeLot.currentBid + bidStep;
  const urgency = activeLot.timeLeft < 300;

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-live-dot" />
              <p className="font-golos text-xs tracking-[0.3em] uppercase text-red-500">Live</p>
            </div>
            <h1 className="font-cormorant text-4xl font-light">Активные аукционы</h1>
          </div>
          <span className="font-golos text-sm text-muted-foreground">{lots.length} лота в эфире</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 grid lg:grid-cols-3 gap-8">
        {/* Lot list */}
        <div className="lg:col-span-1 space-y-3">
          {lots.map((lot) => (
            <button
              key={lot.id}
              onClick={() => setSelected(lot.id)}
              className={`w-full text-left p-4 border transition-all duration-200 ${
                selected === lot.id
                  ? 'border-foreground bg-card'
                  : 'border-border hover:border-foreground/40'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-16 h-16 overflow-hidden flex-shrink-0 bg-secondary">
                  <img src={lot.image} alt={lot.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-cormorant text-base font-light leading-tight line-clamp-2">{lot.title}</p>
                  <p className="font-cormorant text-lg font-medium text-gold mt-1">{formatPrice(lot.currentBid)}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`font-golos text-xs flex items-center gap-1 ${
                      lot.timeLeft < 300 ? 'text-red-500' : 'text-muted-foreground'
                    }`}>
                      <Icon name="Clock" size={11} />
                      {formatTime(lot.timeLeft)}
                    </span>
                    <span className="font-golos text-xs text-muted-foreground">{lot.totalBidders} участников</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Active lot detail */}
        <div className="lg:col-span-2">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Image */}
            <div className="aspect-square overflow-hidden bg-secondary">
              <img src={activeLot.image} alt={activeLot.title} className="w-full h-full object-cover" />
            </div>

            {/* Bid panel */}
            <div className="flex flex-col">
              <span className="font-golos text-xs text-muted-foreground uppercase tracking-widest mb-2">{activeLot.category}</span>
              <h2 className="font-cormorant text-2xl font-light leading-tight mb-4">{activeLot.title}</h2>

              {/* Timer */}
              <div className={`border p-4 mb-4 text-center ${urgency ? 'border-red-500 bg-red-50' : 'border-border'}`}>
                <p className="font-golos text-xs text-muted-foreground mb-1 uppercase tracking-widest">Осталось</p>
                <p className={`font-cormorant text-3xl font-light ${urgency ? 'text-red-500' : 'text-foreground'}`}>
                  {formatTime(activeLot.timeLeft)}
                </p>
              </div>

              {/* Current bid */}
              <div className={`border p-4 mb-4 transition-colors duration-500 ${flashBid ? 'bg-gold/10 border-gold' : 'border-border'}`}>
                <p className="font-golos text-xs text-muted-foreground mb-1 uppercase tracking-widest">Текущая ставка</p>
                <p className="font-cormorant text-3xl font-medium text-gold">{formatPrice(activeLot.currentBid)}</p>
                <p className="font-golos text-xs text-muted-foreground mt-1">{activeLot.totalBidders} участников</p>
              </div>

              {/* My bid status */}
              {activeLot.myBid && (
                <div className={`border p-3 mb-4 flex items-center gap-2 ${
                  activeLot.leading ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50'
                }`}>
                  <Icon name={activeLot.leading ? 'TrendingUp' : 'TrendingDown'} size={16} className={activeLot.leading ? 'text-green-600' : 'text-red-500'} />
                  <div>
                    <p className="font-golos text-xs font-medium">
                      {activeLot.leading ? 'Вы лидируете!' : 'Вашу ставку перебили'}
                    </p>
                    <p className="font-golos text-xs text-muted-foreground">Ваша ставка: {formatPrice(activeLot.myBid)}</p>
                  </div>
                </div>
              )}

              {/* Bid step */}
              <div className="flex items-center gap-2 mb-3">
                <p className="font-golos text-xs text-muted-foreground">Шаг ставки:</p>
                {[5000, 10000, 25000, 50000].map((step) => (
                  <button
                    key={step}
                    onClick={() => setBidStep(step)}
                    className={`px-2.5 py-1 font-golos text-xs border transition-all ${
                      bidStep === step ? 'bg-foreground text-background border-foreground' : 'border-border hover:border-foreground'
                    }`}
                  >
                    +{(step / 1000).toFixed(0)}к
                  </button>
                ))}
              </div>

              <button
                onClick={() => handleBid(nextBid)}
                disabled={activeLot.timeLeft === 0}
                className="w-full py-3.5 bg-foreground text-background font-golos text-sm tracking-wide hover:bg-gold hover:text-foreground transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed mb-3"
              >
                Ставка {formatPrice(nextBid)}
              </button>

              {/* Custom bid */}
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Своя сумма"
                  value={customBid}
                  onChange={(e) => setCustomBid(e.target.value)}
                  className="flex-1 px-3 py-2.5 border border-border font-golos text-sm focus:outline-none focus:border-foreground transition-colors"
                />
                <button
                  onClick={() => customBid && handleBid(parseInt(customBid))}
                  disabled={!customBid || parseInt(customBid) <= activeLot.currentBid}
                  className="px-4 py-2.5 border border-border font-golos text-sm hover:bg-foreground hover:text-background hover:border-foreground transition-all disabled:opacity-40"
                >
                  OK
                </button>
              </div>
            </div>
          </div>

          {/* Bid history */}
          <div className="border border-border">
            <div className="px-5 py-3.5 border-b border-border">
              <p className="font-golos text-sm font-medium">История ставок</p>
            </div>
            <div className="divide-y divide-border max-h-48 overflow-y-auto">
              {activeLot.bids.map((bid, i) => (
                <div key={i} className={`px-5 py-3 flex items-center justify-between ${i === 0 ? 'animate-bid-flash' : ''}`}>
                  <div className="flex items-center gap-3">
                    {i === 0 && <span className="w-1.5 h-1.5 rounded-full bg-gold animate-live-dot" />}
                    <span className={`font-golos text-sm ${bid.user === 'Вы' ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                      {bid.user}
                    </span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="font-cormorant text-lg font-medium text-foreground">{formatPrice(bid.amount)}</span>
                    <span className="font-golos text-xs text-muted-foreground w-10 text-right">{bid.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
