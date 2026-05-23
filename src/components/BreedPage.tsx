import { useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
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

  useEffect(() => {
    const el = bannerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          sfx.chinese.play();
        } else {
          sfx.chinese.fade(sfx.chinese.volume(), 0, 800);
          setTimeout(() => { sfx.chinese.stop(); sfx.chinese.volume(0.45); }, 850);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => { observer.disconnect(); sfx.chinese.stop(); };
  }, []);

  return (
    <div
      style={{ fontFamily: "'Inter', sans-serif", backgroundColor: '#fff', minHeight: '100vh' }}
    >
      {/* Hero banner */}
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
          padding: '0 clamp(20px, 8vw, 64px) clamp(32px, 6vh, 56px)',
          backgroundImage: 'url(/KINGDOOGS.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay + top gradient continuation */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 30%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.7) 100%)',
          pointerEvents: 'none',
        }} />
        {/* Back button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            position: 'absolute',
            top: 24,
            left: 24,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'transparent',
            border: '2px solid rgba(255,255,255,0.4)',
            color: 'white',
            borderRadius: 999,
            padding: '8px 20px',
            cursor: 'pointer',
            fontFamily: "'Inter', sans-serif",
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            transition: 'border-color 200ms, background 200ms',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'white';
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.4)';
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
          }}
        >
          <ArrowLeft size={16} strokeWidth={2.25} />
          Back
        </button>


        <h1
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: 'clamp(56px, 12vw, 160px)',
            fontWeight: 900,
            color: 'white',
            lineHeight: 0.95,
            textTransform: 'uppercase',
            letterSpacing: '-0.03em',
            margin: 0,
            position: 'relative',
          }}
        >
          PEKINGESE
        </h1>
        <p
          style={{
            marginTop: 20,
            fontSize: 'clamp(15px, 1.4vw, 20px)',
            color: 'rgba(255,255,255,0.75)',
            maxWidth: 'min(520px, 90vw)',
            lineHeight: 1.6,
            fontWeight: 400,
            position: 'relative',
          }}
        >
          The lion dog of ancient China — regal, devoted, and full of character.
        </p>

        {/* Bottom gradient into content section */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '180px',
          background: 'linear-gradient(to bottom, transparent, #ffffff)',
          pointerEvents: 'none',
        }} />
      </div>

      {/* Content grid */}
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: 'clamp(40px, 8vh, 72px) clamp(16px, 4vw, 24px) clamp(56px, 10vh, 96px)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
          gap: 'clamp(28px, 5vw, 48px)',
        }}
      >
        {SECTIONS.map(({ title, body }) => (
          <div key={title}>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#999',
                marginBottom: 12,
              }}
            >
              {title}
            </p>
            <h2
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: 'clamp(28px, 4vw, 42px)',
                fontWeight: 900,
                color: '#111',
                lineHeight: 1.05,
                textTransform: 'uppercase',
                letterSpacing: '-0.01em',
                marginBottom: 16,
              }}
            >
              {title}
            </h2>
            <div
              style={{
                width: 32,
                height: 3,
                backgroundColor: '#111',
                marginBottom: 20,
              }}
            />
            <p
              style={{
                fontSize: 15,
                lineHeight: 1.75,
                color: '#444',
                fontWeight: 400,
              }}
            >
              {body}
            </p>
          </div>
        ))}
      </div>

      {/* Footer strip */}
      <div
        style={{
          backgroundColor: '#111',
          padding: '28px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
        }}
      >
        <span
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: 'clamp(14px, 2vw, 20px)',
            color: 'white',
            opacity: 0.5,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
          }}
        >
          PEKIN PILES — TOONHUB
        </span>
      </div>
    </div>
  );
}
