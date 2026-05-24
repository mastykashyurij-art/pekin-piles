import { useEffect, useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Howler } from 'howler';
import { sfx } from '../sounds';

const SECTIONS = [
  {
    title: 'ORIGIN',
    body: 'The Pekingese is one of the oldest dog breeds in the world, originating in ancient China over 2,000 years ago. They were exclusively bred for the imperial family of the Chinese Tang Dynasty and were considered sacred companions of Chinese emperors. Commoners were required to bow in their presence.',
  },
  {
    title: 'APPEARANCE',
    body: 'Pekingese are compact, stocky dogs with a distinctive flat face, large dark eyes, and a luxurious double coat that forms a mane around the neck and shoulders. They typically weigh between 7–14 lbs and stand 6–9 inches tall. Their coat comes in all colors including red, gold, sable, black, and cream.',
  },
  {
    title: 'PERSONALITY',
    body: 'Bold, confident, and affectionate — Pekingese have the heart of a lion in a small body. They are loyal to their family, dignified in manner, and surprisingly independent. They form deep bonds with their owners but can be aloof with strangers. They carry themselves with an unmistakable imperial air.',
  },
  {
    title: 'CARE & GROOMING',
    body: 'Their long double coat requires regular brushing — ideally several times a week — to prevent matting and tangling. Due to their flat face (brachycephalic), they are sensitive to heat and should be kept cool. Daily cleaning of facial folds is essential. They enjoy short walks but are not high-energy dogs.',
  },
  {
    title: 'HEALTH',
    body: 'Pekingese are generally healthy with a lifespan of 12–15 years. Common health considerations include brachycephalic airway syndrome, eye conditions due to their prominent eyes, and intervertebral disc disease. Regular vet check-ups, weight management, and proper grooming keep them thriving.',
  },
  {
    title: 'FUN FACTS',
    body: 'In ancient China, stealing a Pekingese was punishable by death. When the British invaded Beijing in 1860, five Pekingese were found guarding the body of their owner and brought back to England — one was gifted to Queen Victoria, who named her "Looty." They have been AKC-recognized since 1906.',
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
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
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
      Back
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
            backgroundImage: 'url(/KINGDOOGS_MOBILE.webp)',
            backgroundSize: 'cover',
            backgroundPosition: '30% center',
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
            }}>
              PEKINGESE
            </h1>
            <div style={{ width: 36, height: 3, background: 'rgba(255,255,255,0.55)', margin: '0 auto 14px' }} />
            <p style={{
              fontSize: 14,
              color: 'rgba(255,255,255,0.82)',
              lineHeight: 1.65,
              fontWeight: 400,
              margin: 0,
            }}>
              The lion dog of ancient China —<br />regal, devoted, and full of character.
            </p>
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
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-end',
            padding: '0 64px 56px',
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
          <h1 style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: 'clamp(56px, 12vw, 160px)',
            fontWeight: 900,
            color: 'white',
            lineHeight: 0.95,
            textTransform: 'uppercase',
            letterSpacing: '-0.03em',
            margin: 0,
            position: 'relative',
          }}>
            PEKINGESE
          </h1>
          <p style={{
            marginTop: 20,
            fontSize: 'clamp(15px, 1.4vw, 20px)',
            color: 'rgba(255,255,255,0.75)',
            maxWidth: 520,
            lineHeight: 1.6,
            fontWeight: 400,
            position: 'relative',
          }}>
            The lion dog of ancient China — regal, devoted, and full of character.
          </p>
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
        <span style={{
          fontFamily: "'Anton', sans-serif",
          fontSize: 'clamp(13px, 2vw, 20px)',
          color: 'white',
          opacity: 0.5,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
        }}>
          PEKIN PILES — TOONHUB
        </span>
      </div>
    </div>
  );
}
