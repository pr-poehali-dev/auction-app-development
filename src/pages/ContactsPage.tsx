import { useState } from 'react';
import Icon from '@/components/ui/icon';

const faqs = [
  { q: 'Как зарегистрироваться на платформе?', a: 'Нажмите кнопку «Создать аккаунт» на главной странице, заполните форму и подтвердите email.' },
  { q: 'Как пополнить баланс?', a: 'В личном кабинете перейдите в раздел «Баланс» и выберите удобный способ пополнения.' },
  { q: 'Что происходит после победы в аукционе?', a: 'После победы вы получите уведомление с инструкцией по оплате и доставке лота.' },
  { q: 'Можно ли отменить ставку?', a: 'Ставки не могут быть отменены после их подтверждения. Это обеспечивает честность торгов.' },
  { q: 'Как выставить собственный лот?', a: 'Обратитесь к нам через форму ниже — мы проведём экспертизу и разместим лот на платформе.' },
];

export default function ContactsPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <p className="font-golos text-xs tracking-[0.3em] uppercase text-gold mb-3">Контакты</p>
          <h1 className="font-cormorant text-5xl font-light">Свяжитесь с нами</h1>
        </div>
      </div>

      {/* Contacts info */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3">
          {[
            { icon: 'Phone', label: 'Телефон', value: '+7 (800) 000-00-00', sub: 'Пн–Пт, 9:00–18:00' },
            { icon: 'Mail', label: 'Email', value: 'support@auction.ru', sub: 'Ответ в течение часа' },
            { icon: 'MapPin', label: 'Офис', value: 'Москва, ул. Тверская, 1', sub: 'Пн–Сб, 10:00–20:00' },
          ].map((c, i) => (
            <div key={i} className="py-10 px-6 border-r border-border last:border-0">
              <Icon name={c.icon} size={20} className="text-gold mb-4" fallback="Info" />
              <p className="font-golos text-xs text-muted-foreground uppercase tracking-widest mb-2">{c.label}</p>
              <p className="font-cormorant text-xl font-light mb-1">{c.value}</p>
              <p className="font-golos text-xs text-muted-foreground">{c.sub}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-16">
        {/* Form */}
        <div>
          <h2 className="font-cormorant text-3xl font-light mb-8">Написать нам</h2>

          {sent && (
            <div className="flex items-center gap-3 p-4 border border-gold bg-gold/10 mb-6 animate-fade-in">
              <Icon name="CheckCircle" size={16} className="text-gold flex-shrink-0" />
              <p className="font-golos text-sm">Ваше сообщение отправлено. Мы ответим в ближайшее время.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="font-golos text-xs text-muted-foreground uppercase tracking-widest mb-2 block">Имя</label>
                <input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-border font-golos text-sm focus:outline-none focus:border-foreground transition-colors bg-background"
                  placeholder="Ваше имя"
                />
              </div>
              <div>
                <label className="font-golos text-xs text-muted-foreground uppercase tracking-widest mb-2 block">Email</label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-border font-golos text-sm focus:outline-none focus:border-foreground transition-colors bg-background"
                  placeholder="email@example.com"
                />
              </div>
            </div>
            <div>
              <label className="font-golos text-xs text-muted-foreground uppercase tracking-widest mb-2 block">Тема</label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 border border-border font-golos text-sm focus:outline-none focus:border-foreground transition-colors bg-background cursor-pointer"
              >
                <option value="">Выберите тему</option>
                <option value="general">Общий вопрос</option>
                <option value="bid">Вопрос по ставке</option>
                <option value="lot">Разместить лот</option>
                <option value="payment">Оплата</option>
                <option value="other">Другое</option>
              </select>
            </div>
            <div>
              <label className="font-golos text-xs text-muted-foreground uppercase tracking-widest mb-2 block">Сообщение</label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 border border-border font-golos text-sm focus:outline-none focus:border-foreground transition-colors bg-background resize-none"
                placeholder="Опишите ваш вопрос..."
              />
            </div>
            <button
              type="submit"
              className="px-10 py-3.5 bg-foreground text-background font-golos text-sm tracking-wide hover:bg-gold hover:text-foreground transition-all duration-200"
            >
              Отправить
            </button>
          </form>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="font-cormorant text-3xl font-light mb-8">Частые вопросы</h2>
          <div className="space-y-0">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-border last:border-b">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left py-5 flex items-center justify-between gap-4 group"
                >
                  <span className="font-golos text-sm group-hover:text-gold transition-colors">{faq.q}</span>
                  <Icon
                    name={openFaq === i ? 'Minus' : 'Plus'}
                    size={16}
                    className="flex-shrink-0 text-muted-foreground"
                  />
                </button>
                {openFaq === i && (
                  <div className="pb-5 animate-fade-in">
                    <p className="font-golos text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Working hours */}
          <div className="mt-10 border border-border p-6">
            <p className="font-golos text-xs text-muted-foreground uppercase tracking-widest mb-4">Режим работы</p>
            {[
              { day: 'Понедельник – Пятница', time: '9:00 – 18:00' },
              { day: 'Суббота', time: '10:00 – 16:00' },
              { day: 'Воскресенье', time: 'Выходной' },
            ].map((r) => (
              <div key={r.day} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                <span className="font-golos text-sm text-muted-foreground">{r.day}</span>
                <span className="font-golos text-sm font-medium">{r.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
