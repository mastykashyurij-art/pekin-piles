import { useState } from 'react';
import { PawPrint, Send } from 'lucide-react';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', fax: '', message: '' });
  const [status, setStatus] = useState<Status>('idle');
  const [isMobile] = useState(() => window.innerWidth < 640);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('https://formspree.io/f/mgoqpoez', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          fax: form.fax,
          message: form.message,
        }),
      });
      if (res.ok) {
        setStatus('sent');
        setForm({ name: '', email: '', phone: '', fax: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'transparent',
    border: 'none',
    borderBottom: '2px solid rgba(255,255,255,0.25)',
    color: 'white',
    fontFamily: "'Inter', sans-serif",
    fontSize: isMobile ? 15 : 17,
    fontWeight: 400,
    padding: '14px 0',
    outline: 'none',
    transition: 'border-color 200ms',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "'Inter', sans-serif",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.45)',
    display: 'block',
    marginBottom: 4,
  };

  return (
    <div
      style={{
        backgroundColor: '#111',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Top accent line */}
      <div style={{ height: 3, background: 'linear-gradient(to right, #7C3AED, #0284C7, #16A34A, #881337)' }} />

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          maxWidth: 1100,
          width: '100%',
          margin: '0 auto',
          padding: isMobile ? '56px 24px 72px' : '96px 48px',
          gap: isMobile ? 48 : 96,
        }}
      >
        {/* Left — headline block */}
        <div style={{ flex: '0 0 auto', maxWidth: isMobile ? '100%' : 420 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <PawPrint size={20} strokeWidth={2} style={{ color: 'white', opacity: 0.4, transform: 'rotate(-15deg)' }} />
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)',
            }}>
              Centrum Pekinesa
            </span>
          </div>

          <h2 style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: isMobile ? 'clamp(52px, 14vw, 80px)' : 'clamp(64px, 8vw, 110px)',
            fontWeight: 900,
            color: 'white',
            lineHeight: 0.92,
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            margin: '0 0 28px',
            textShadow: '0 4px 24px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.25)',
          }}>
            NAPISZ<br />DO NAS
          </h2>

          <div style={{ width: 36, height: 3, background: 'rgba(255,255,255,0.25)', marginBottom: 24 }} />

          <p style={{
            fontSize: isMobile ? 14 : 15,
            color: 'rgba(255,255,255,0.55)',
            lineHeight: 1.75,
            margin: 0,
            maxWidth: 340,
          }}>
            Masz pytania dotyczące pekińczyków? Chcesz się podzielić historią swojego pupila? Napisz do nas — odpiszemy z cesarską gracją.
          </p>
        </div>

        {/* Right — form */}
        <div style={{ flex: 1 }}>
          {status === 'error' && (
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
              color: '#ff6b6b',
              marginBottom: 24,
              letterSpacing: '0.02em',
            }}>
              Coś poszło nie tak. Spróbuj ponownie lub napisz bezpośrednio na e-mail.
            </p>
          )}
          {status === 'sent' ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: isMobile ? 'center' : 'flex-start',
              justifyContent: 'center',
              height: '100%',
              textAlign: isMobile ? 'center' : 'left',
              gap: 16,
              paddingTop: isMobile ? 0 : 24,
            }}>
              <PawPrint size={40} strokeWidth={1.5} style={{ color: 'white', opacity: 0.6 }} />
              <h3 style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: 'clamp(32px, 6vw, 52px)',
                color: 'white',
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '-0.01em',
              }}>
                WIADOMOŚĆ WYSŁANA
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, margin: 0, lineHeight: 1.7 }}>
                Dziękujemy za kontakt. Odezwiemy się wkrótce.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
              {/* Name */}
              <div>
                <label htmlFor="name" style={labelStyle}>Imię i nazwisko</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Jan Kowalski"
                  value={form.name}
                  onChange={handleChange}
                  style={inputStyle}
                  onFocus={e => { e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.8)'; }}
                  onBlur={e => { e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.25)'; }}
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" style={labelStyle}>Adres e-mail</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="jan@example.com"
                  value={form.email}
                  onChange={handleChange}
                  style={inputStyle}
                  onFocus={e => { e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.8)'; }}
                  onBlur={e => { e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.25)'; }}
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" style={labelStyle}>Numer telefonu</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+48 123 456 789"
                  value={form.phone}
                  onChange={handleChange}
                  style={inputStyle}
                  onFocus={e => { e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.8)'; }}
                  onBlur={e => { e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.25)'; }}
                />
              </div>

              {/* Fax */}
              <div>
                <label htmlFor="fax" style={labelStyle}>Numer faksu</label>
                <input
                  id="fax"
                  name="fax"
                  type="tel"
                  placeholder="+48 123 456 789"
                  value={form.fax}
                  onChange={handleChange}
                  style={inputStyle}
                  onFocus={e => { e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.8)'; }}
                  onBlur={e => { e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.25)'; }}
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" style={labelStyle}>Wiadomość</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder="Twoja wiadomość..."
                  value={form.message}
                  onChange={handleChange}
                  style={{ ...inputStyle, resize: 'none', lineHeight: 1.6 }}
                  onFocus={e => { e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.8)'; }}
                  onBlur={e => { e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.25)'; }}
                />
              </div>

              {/* Submit */}
              <div>
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 10,
                    fontFamily: "'Anton', sans-serif",
                    fontSize: 'clamp(15px, 2vw, 20px)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#111',
                    background: 'white',
                    border: 'none',
                    borderRadius: 999,
                    padding: '14px 32px',
                    cursor: status === 'sending' ? 'wait' : 'pointer',
                    opacity: status === 'sending' ? 0.7 : 1,
                    transition: 'opacity 200ms, transform 150ms',
                  }}
                  onMouseEnter={e => { if (status !== 'sending') (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.04)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
                  onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)'; }}
                  onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.04)'; }}
                >
                  {status === 'sending' ? 'Wysyłanie...' : 'Wyślij'}
                  {status !== 'sending' && <Send size={16} strokeWidth={2.25} />}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.08)',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: 'clamp(11px, 1.5vw, 16px)',
            color: 'white',
            opacity: 0.25,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            transition: 'opacity 200ms',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.7'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.25'; }}
        >
          PEKIŃSKIE KUPKI — CENTRUM PEKINESA
        </button>
      </div>
    </div>
  );
}
