import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Howler } from 'howler';
import { sfx } from '../sounds';

const SECTIONS = [
  {
    title: 'POCHODZENIE',
    body: 'Pekińczyk jest jedną z najstarszych ras psów na świecie, wywodzącą się ze starożytnych Chin sprzed ponad 2000 lat. Był hodowany wyłącznie dla rodziny cesarskiej dynastii Tang i uważany za świętego towarzysza chińskich imperatorów. Zwykli ludzie musieli kłaniać mu się w pas.',
  },
  {
    title: 'WYGLĄD',
    body: 'Pekińczyk to zwarty, krępy pies o charakterystycznej płaskiej mordzie, dużych ciemnych oczach i luksusowej podwójnej sierści tworzącej grzywę wokół szyi i barków. Zazwyczaj waży od 3 do 6 kg i mierzy 15–23 cm w kłębie. Jego szata występuje we wszystkich kolorach: rudym, złotym, sablowym, czarnym i kremowym.',
  },
  {
    title: 'OSOBOWOŚĆ',
    body: 'Odważny, pewny siebie i czuły — pekińczyk kryje lwie serce w małym ciele. Jest wierny rodzinie, pełen godności i zaskakująco niezależny. Tworzy głębokie więzi z właścicielem, lecz wobec obcych bywa powściągliwy. Nosi się z nieomylną cesarską gracją.',
  },
  {
    title: 'PIELĘGNACJA',
    body: 'Długa podwójna sierść wymaga regularnego szczotkowania — najlepiej kilka razy w tygodniu — aby zapobiec kołtunieniu i splątaniu. Ze względu na płaską mordę (budowa brachycefaliczna) pekińczyki źle znoszą upały i wymagają chłodnego otoczenia. Codzienne czyszczenie fałdek na twarzy jest niezbędne. Lubią krótkie spacery, ale nie są psami wymagającymi dużej aktywności.',
  },
  {
    title: 'ZDROWIE',
    body: 'Pekińczyki są zazwyczaj zdrowe i żyją od 12 do 15 lat. Do najczęstszych problemów zdrowotnych należą: zespół brachycefaliczny, schorzenia oczu wynikające z ich wyrazistej budowy oraz choroba krążków międzykręgowych. Regularne wizyty u weterynarza, kontrola wagi i właściwa pielęgnacja zapewniają im długie, szczęśliwe życie.',
  },
  {
    title: 'CIEKAWOSTKI',
    body: 'W starożytnych Chinach kradzież pekińczyka karana była śmiercią. Gdy Brytyjczycy wkroczyli do Pekinu w 1860 roku, znaleźli pięć pekińczyków strzegących ciała swojej pani — jeden z nich trafił w prezencie do królowej Wiktorii, która nadała mu imię „Looty". Rasa jest oficjalnie uznana przez AKC od 1906 roku.',
  },
];

export default function BreedPage() {
  const bannerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const el = bannerRef.current;
    if (!el) return;

    // Resume AudioContext suspended by browser autoplay policy on scroll
    const unlockAudio = () => {
      if (Howler.ctx && Howler.ctx.state === 'suspended') {
        Howler.ctx.resume();
      }
    };

    let fadeTimer: ReturnType<typeof setTimeout> | null = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (fadeTimer) { clearTimeout(fadeTimer); fadeTimer = null; }
          unlockAudio();
          sfx.chinese.volume(0.45);
          if (!sfx.chinese.playing()) sfx.chinese.play();
        } else {
          const vol = sfx.chinese.volume();
          if (vol > 0) sfx.chinese.fade(vol, 0, 800);
          fadeTimer = setTimeout(() => { sfx.chinese.stop(); }, 850);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (fadeTimer) clearTimeout(fadeTimer);
      sfx.chinese.stop();
    };
  }, []);

  const backButton = (
    <button
      onClick={() => { sfx.arrow_swoosh.play(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
      aria-label="Wróć"
      style={{
        position: 'absolute',
        top: 20,
        left: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: 'transparent',
        border: '2px solid rgba(255,255,255,0.4)',
        color: 'white',
        borderRadius: 999,
        padding: '7px 16px',
        cursor: 'pointer',
        fontFamily: "'Inter', sans-serif",
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase' as const,
        transition: 'border-color 200ms, background 200ms',
        zIndex: 10,
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'white';
        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.1)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.4)';
        (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
      }}
    >
      <ArrowLeft size={14} strokeWidth={2.25} />
      Wróć
    </button>
  );

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", backgroundColor: '#fff', minHeight: '100vh' }}>

      {isMobile ? (
        /* ── MOBILE HERO — full-screen close-up of both dogs, text at bottom-centre ── */
        <div
          ref={bannerRef}
          style={{
            position: 'relative',
            width: '100%',
            height: '100vh',
            overflow: 'hidden',
            backgroundImage: 'url(/KINGDOGSMOBILE22.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '0 24px 64px',
          }}
        >
          {/* Gradient — only bottom darkens for text legibility */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, transparent 0%, transparent 55%, rgba(0,0,0,0.65) 80%, rgba(0,0,0,0.85) 100%)',
            pointerEvents: 'none',
          }} />

          {backButton}

          {/* Text — centred at bottom */}
          <div style={{ position: 'relative', zIndex: 5, textAlign: 'center' }}>
            <h1 style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: 'clamp(48px, 16vw, 72px)',
              fontWeight: 900,
              color: 'white',
              lineHeight: 0.92,
              textTransform: 'uppercase',
              letterSpacing: '-0.03em',
              margin: '0 0 14px',
              textShadow: '0 4px 24px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.25)',
            }}>
              PEKIŃCZYK
            </h1>
            <div style={{ width: 36, height: 3, background: 'rgba(255,255,255,0.55)', margin: '0 auto 14px' }} />
            <p style={{
              fontSize: 14,
              color: 'rgba(255,255,255,0.82)',
              lineHeight: 1.65,
              fontWeight: 400,
              margin: '0 0 20px',
            }}>
              Lwi pies starożytnych Chin —<br />dostojny, oddany i pełen charakteru.
            </p>
            <a
              href="#breed-content"
              onClick={e => { e.preventDefault(); sfx.arrow_swoosh.play(); document.getElementById('breed-content')?.scrollIntoView({ behavior: 'smooth' }); }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontFamily: "'Anton', sans-serif",
                fontSize: 'clamp(18px, 5vw, 28px)',
                fontWeight: 400,
                color: 'white',
                opacity: 0.95,
                letterSpacing: '-0.02em',
                lineHeight: 1,
                textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'opacity 200ms',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.95'; }}
            >
              CZYTAJ OPIS
              <ArrowRight size={20} strokeWidth={2.25} />
            </a>
          </div>

          {/* Fade into white content below */}
          <div style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: 56,
            background: 'linear-gradient(to bottom, transparent, #ffffff)',
            pointerEvents: 'none',
          }} />
        </div>
      ) : (
        /* ── DESKTOP HERO ── */
        <div
          ref={bannerRef}
          style={{
            position: 'relative',
            overflow: 'hidden',
            width: '100%',
            height: '100vh',
            backgroundImage: 'url(/KINGDOOGS.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 30%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.7) 100%)',
            pointerEvents: 'none',
          }} />
          {backButton}

          {/* Text block — top right */}
          <div style={{
            position: 'absolute',
            top: 56,
            right: 64,
            textAlign: 'right',
            zIndex: 10,
          }}>
            <h1 style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: 'clamp(56px, 12vw, 160px)',
              fontWeight: 900,
              color: 'white',
              lineHeight: 0.95,
              textTransform: 'uppercase',
              letterSpacing: '-0.03em',
              margin: '0 0 16px',
              textShadow: '0 4px 24px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.25)',
            }}>
              PEKIŃCZYK
            </h1>
            <p style={{
              fontSize: 'clamp(15px, 1.4vw, 20px)',
              color: 'rgba(255,255,255,0.75)',
              maxWidth: 420,
              lineHeight: 1.6,
              fontWeight: 400,
              margin: '0 0 24px',
              marginLeft: 'auto',
            }}>
              Lwi pies starożytnych Chin — dostojny, oddany i pełen charakteru.
            </p>
          </div>

          {/* CZYTAJ OPIS — bottom left */}
          <a
            href="#breed-content"
            onClick={e => { e.preventDefault(); sfx.arrow_swoosh.play(); document.getElementById('breed-content')?.scrollIntoView({ behavior: 'smooth' }); }}
            style={{
              position: 'absolute',
              bottom: 56,
              left: 64,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              fontFamily: "'Anton', sans-serif",
              fontSize: 'clamp(20px, 4vw, 56px)',
              fontWeight: 400,
              color: 'white',
              opacity: 0.95,
              letterSpacing: '-0.02em',
              lineHeight: 1,
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'opacity 200ms',
              zIndex: 10,
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.95'; }}
          >
            CZYTAJ OPIS
            <ArrowRight className="w-5 h-5 sm:w-8 sm:h-8" strokeWidth={2.25} />
          </a>
          <div style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: '180px',
            background: 'linear-gradient(to bottom, transparent, #ffffff)',
            pointerEvents: 'none',
          }} />
        </div>
      )}

      {/* Content grid */}
      <div
        id="breed-content"
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: isMobile
            ? '40px 20px 64px'
            : '72px 24px 96px',
          display: 'grid',
          gridTemplateColumns: isMobile
            ? '1fr'
            : 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: isMobile ? 0 : 48,
        }}
      >
        {SECTIONS.map(({ title, body }, idx) => (
          <div
            key={title}
            style={isMobile ? {
              borderBottom: idx < SECTIONS.length - 1 ? '1px solid #ebebeb' : 'none',
              padding: '28px 0',
            } : {}}
          >
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#999',
              margin: '0 0 10px',
            }}>
              {title}
            </p>
            <h2 style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: isMobile ? 'clamp(26px, 7vw, 34px)' : 'clamp(28px, 4vw, 42px)',
              fontWeight: 900,
              color: '#111',
              lineHeight: 1.05,
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              margin: '0 0 12px',
            }}>
              {title}
            </h2>
            <div style={{ width: 28, height: 3, backgroundColor: '#111', marginBottom: 14 }} />
            <p style={{
              fontSize: isMobile ? 14 : 15,
              lineHeight: 1.75,
              color: '#444',
              fontWeight: 400,
              margin: 0,
            }}>
              {body}
            </p>
          </div>
        ))}
      </div>

      {/* Footer strip */}
      <div style={{
        backgroundColor: '#111',
        padding: '24px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <button
          onClick={() => { sfx.arrow_swoosh.play(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: 'clamp(13px, 2vw, 20px)',
            color: 'white',
            opacity: 0.5,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            transition: 'opacity 200ms',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.9'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.5'; }}
        >
          PEKIŃSKIE KUPKI — CENTRUM PEKINESA
        </button>
      </div>
    </div>
  );
}
