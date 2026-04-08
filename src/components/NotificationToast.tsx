import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';

interface ToastNotif {
  id: number;
  type: 'bid' | 'win' | 'new';
  text: string;
}

interface NotificationToastProps {
  toast: ToastNotif | null;
  onClose: () => void;
}

export default function NotificationToast({ toast, onClose }: NotificationToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (toast) {
      setVisible(true);
      const t = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300);
      }, 4000);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast]);

  if (!toast) return null;

  const icons: Record<string, string> = { bid: 'TrendingUp', win: 'Trophy', new: 'Package' };
  const colors: Record<string, string> = { bid: 'text-red-500', win: 'text-gold', new: 'text-foreground' };

  return (
    <div className={`fixed bottom-6 right-6 z-[100] w-80 bg-card border border-border shadow-2xl p-4 flex items-start gap-3 transition-all duration-300 ${
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <Icon name={icons[toast.type]} size={18} className={colors[toast.type]} fallback="Bell" />
      <p className="font-golos text-sm text-foreground flex-1 leading-snug">{toast.text}</p>
      <button onClick={() => { setVisible(false); setTimeout(onClose, 300); }}>
        <Icon name="X" size={14} className="text-muted-foreground hover:text-foreground" />
      </button>
    </div>
  );
}