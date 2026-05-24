import { useEffect, useState, useCallback, useRef } from 'react';
import { ArrowLeft, ArrowRight, PawPrint } from 'lucide-react';
import { sfx } from '../sounds';


const IMAGES = [
  {
    src: '/CANDYREADING.png', bg: '#7C3AED', panel: '#9F67F5',
    name: 'THE DAILY BARK',
    description: 'Wrapped in a velvet robe and armed with reading glasses, Candy starts every morning with the Canine Chronicle. No treat can interrupt her editorial hour. A true intellectual of the pack.',
    clickSfx: 'candy_reading' as const,
  },
  {
    src: '/DAISYBOARD.png', bg: '#0284C7', panel: '#38BDF8',
    name: 'SHRED QUEEN',
    description: "Daisy doesn't just hit the slopes — she owns them. Helmet on, board locked, she carves powder with the confidence of a seasoned pro. Fresh air and cold snow are her natural habitat.",
    clickSfx: 'daisy_board' as const,
  },
  {
    src: '/CANDYKIMONO.png', bg: '#16A34A', panel: '#4ADE80',
    name: 'IMPERIAL CANDY',
    description: 'Dressed in an ornate red kimono, Candy channels the elegance of ancient Japan. She picks up every sushi roll with chopstick precision and zero hesitation. Refinement runs in her blood.',
    clickSfx: 'char_click' as const,
  },
  {
    src: '/DAISYMODNA.png', bg: '#881337', panel: '#BE1D4A',
    name: 'HOUSE OF DAISY',
    description: 'Daisy glides in wearing a floor-length black gown and a wide-brimmed statement hat. Her designer bag completes a look that belongs on the front row. Fashion week starts when she walks in.',
    clickSfx: 'daisy_modna' as const,
  },
];

const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")`;

type Direction = 'next' | 'prev';

export default function ToonHub() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    IMAGES.forEach(({ src }) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navigate = useCallback((dir: Direction) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => dir === 'next' ? (prev + 1) % 4 : (prev + 3) % 4);
    setTimeout(() => setIsAnimating(false), 650);
  }, [isAnimating, isMobile]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) navigate(diff > 0 ? 'next' : 'prev');
    touchStartX.current = null;
  }, [navigate]);

  const center = activeIndex;
  const left = (activeIndex + 3) % 4;
  const right = (activeIndex + 1) % 4;

  const getRoleStyle = (index: number): React.CSSProperties => {
    // Mobile: only animate transform + opacity — no blur (GPU-expensive), no layout props
    // Desktop: full animation including blur and layout transitions
    const mobileT = 'transform 650ms cubic-bezier(0.4,0,0.2,1), opacity 650ms cubic-bezier(0.4,0,0.2,1)';
    const desktopT = 'transform 650ms cubic-bezier(0.4,0,0.2,1), filter 650ms cubic-bezier(0.4,0,0.2,1), opacity 650ms cubic-bezier(0.4,0,0.2,1), left 650ms cubic-bezier(0.4,0,0.2,1), bottom 650ms cubic-bezier(0.4,0,0.2,1), height 650ms cubic-bezier(0.4,0,0.2,1)';
    const transition = isMobile ? mobileT : desktopT;
    const willChange = isMobile ? 'transform, opacity' : 'transform, filter, opacity';

    if (index === center) {
      return {
        position: 'absolute',
        aspectRatio: '0.6 / 1',
        left: '50%',
        bottom: isMobile ? '22%' : '0',
        height: isMobile ? '60%' : '92%',
        transform: `translateX(-50%) scale(${isMobile ? 1.25 : 1.68})`,
        filter: 'none',
        opacity: 1,
        zIndex: 20,
        transition,
        willChange,
      };
    }
    if (index === left) {
      return {
        position: 'absolute',
        aspectRatio: '0.6 / 1',
        left: isMobile ? '20%' : '30%',
        bottom: isMobile ? '32%' : '12%',
        height: isMobile ? '16%' : '28%',
        transform: 'translateX(-50%) scale(1)',
        filter: isMobile ? 'none' : 'blur(2px)',
        opacity: isMobile ? 0.5 : 0.85,
        zIndex: 10,
        transition,
        willChange,
      };
    }
    if (index === right) {
      return {
        position: 'absolute',
        aspectRatio: '0.6 / 1',
        left: isMobile ? '80%' : '70%',
        bottom: isMobile ? '32%' : '12%',
        height: isMobile ? '16%' : '28%',
        transform: 'translateX(-50%) scale(1)',
        filter: isMobile ? 'none' : 'blur(2px)',
        opacity: isMobile ? 0.5 : 0.85,
        zIndex: 10,
        transition,
        willChange,
      };
    }
    // back
    return {
      position: 'absolute',
      aspectRatio: '0.6 / 1',
      left: '50%',
      bottom: isMobile ? '32%' : '12%',
      height: isMobile ? '13%' : '22%',
      transform: 'translateX(-50%) scale(1)',
      filter: isMobile ? 'none' : 'blur(4px)',
      opacity: isMobile ? 0.15 : 1,
      zIndex: 5,
      transition,
      willChange,
    };
  };

  const getRole = (index: number) => {
    if (index === center) return 'center';
    if (index === left) return 'left';
    if (index === right) return 'right';
    return 'back';
  };

  return (
    <div
      style={{
        backgroundColor: IMAGES[activeIndex].bg,
        transition: `background-color 650ms cubic-bezier(0.4,0,0.2,1)`,
        fontFamily: "'Inter', sans-serif",
      }}
      className="relative w-full overflow-hidden"
    >
      <div
        className="relative w-full"
        style={{ height: '100vh', overflow: 'hidden', touchAction: 'pan-y' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >

        {/* Grain overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 50,
            pointerEvents: 'none',
            backgroundImage: GRAIN_SVG,
            backgroundSize: '200px 200px',
            backgroundRepeat: 'repeat',
            opacity: 0.4,
          }}
        />

        {/* Ghost text "Beijing Piles" */}
        <div
          className="absolute inset-x-0 flex items-center justify-center pointer-events-none select-none"
          style={{ zIndex: 2, top: '18%' }}
        >
          {isMobile ? (
            // Stack words so each 5-char word fits within phone width
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 0.9 }}>
              {['Beijing', 'Piles'].map(word => (
                <span
                  key={word}
                  style={{
                    fontFamily: "'Anton', sans-serif",
                    fontSize: 'clamp(90px, 28vw, 380px)',
                    fontWeight: 900,
                    color: 'white',
                    lineHeight: 0.9,
                    textTransform: 'uppercase',
                    letterSpacing: '-0.02em',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {word}
                </span>
              ))}
            </div>
          ) : (
            <span
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: 'clamp(90px, 28vw, 380px)',
                fontWeight: 900,
                color: 'white',
                lineHeight: 1,
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
                whiteSpace: 'nowrap',
              }}
            >
              Beijing Piles
            </span>
          )}
        </div>

        {/* Brand label */}
        <button
          onClick={() => { sfx.logo_click.play(); }}
          className="absolute top-6 left-4 sm:left-8 flex items-center gap-2"
          style={{
            zIndex: 60,
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            transition: 'transform 120ms',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.06)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
          onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.94)'; }}
          onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.06)'; }}
          title="Click to hear a Pekingese bark!"
        >
          <PawPrint
            size={22}
            strokeWidth={2}
            style={{ color: 'white', opacity: 0.9, transform: 'rotate(-15deg)', flexShrink: 0 }}
          />
          <span
            className="font-semibold uppercase"
            style={{ color: 'white', opacity: 0.9, letterSpacing: '0.18em', fontSize: 'clamp(14px, 2vw, 22px)' }}
          >
            Pekingese Hub
          </span>
          <PawPrint
            size={16}
            strokeWidth={2}
            style={{ color: 'white', opacity: 0.5, transform: 'rotate(10deg)', flexShrink: 0 }}
          />
        </button>

        {/* Carousel */}
        <div className="absolute inset-0" style={{ zIndex: 3 }}>
          {IMAGES.map((img, i) => (
            <div
              key={img.src}
              style={getRoleStyle(i)}
              data-role={getRole(i)}
            >
              <img
                src={img.src}
                alt={`Character ${i + 1}`}
                draggable={false}
                onClick={() => {
                  sfx[img.clickSfx].play();
                  setClickedIndex(i);
                  setTimeout(() => setClickedIndex(null), 1000);
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  objectPosition: 'bottom center',
                  cursor: 'pointer',
                  animation: clickedIndex === i ? 'dogWiggle 1s cubic-bezier(0.4,0,0.2,1) both' : 'none',
                }}
              />
            </div>
          ))}
        </div>

        {/* Character info — mobile: bottom-centre with description; desktop: bottom-left */}
        {isMobile ? (
          <div
            style={{
              position: 'absolute',
              top: '75%', left: 0, right: 0,
              zIndex: 60,
              padding: '0 28px',
              textAlign: 'center',
            }}
          >
            <div key={activeIndex} style={{ animation: 'fadeSlideIn 340ms cubic-bezier(0.22,1,0.36,1) both' }}>
              <p style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'white',
                opacity: 0.95,
                margin: '0 0 8px',
              }}>
                {IMAGES[activeIndex].name}
              </p>
              <p style={{
                fontSize: 12,
                color: 'rgba(255,255,255,0.82)',
                lineHeight: 1.6,
                margin: 0,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical' as const,
                overflow: 'hidden',
              }}>
                {IMAGES[activeIndex].description}
              </p>
            </div>
          </div>
        ) : (
          <div
            className="absolute bottom-20 left-24"
            style={{ zIndex: 60, maxWidth: 320 }}
          >
            <div key={activeIndex} style={{ animation: 'fadeSlideIn 400ms cubic-bezier(0.4,0,0.2,1) both' }}>
              <p
                className="font-bold uppercase tracking-widest mb-3 text-[22px]"
                style={{ color: 'white', opacity: 0.95, letterSpacing: '0.02em' }}
              >
                {IMAGES[activeIndex].name}
              </p>
              <p
                className="text-sm mb-5"
                style={{ color: 'white', opacity: 0.85, lineHeight: 1.6 }}
              >
                {IMAGES[activeIndex].description}
              </p>
            </div>
          </div>
        )}

        {/* Left arrow */}
        <button
          onClick={() => navigate('prev')}
          aria-label="Previous"
          style={{
            position: 'absolute',
            left: isMobile ? '10px' : '24px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 60,
            width: isMobile ? 40 : 56,
            height: isMobile ? 40 : 56,
            borderRadius: '50%',
            backgroundColor: 'transparent',
            border: '2px solid white',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 150ms, background-color 150ms',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-50%) scale(1.08)';
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,0.12)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-50%)';
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
          }}
        >
          <ArrowLeft size={isMobile ? 18 : 26} strokeWidth={2.25} />
        </button>

        {/* Right arrow */}
        <button
          onClick={() => navigate('next')}
          aria-label="Next"
          style={{
            position: 'absolute',
            right: isMobile ? '10px' : '24px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 60,
            width: isMobile ? 40 : 56,
            height: isMobile ? 40 : 56,
            borderRadius: '50%',
            backgroundColor: 'transparent',
            border: '2px solid white',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 150ms, background-color 150ms',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-50%) scale(1.08)';
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,0.12)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-50%)';
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
          }}
        >
          <ArrowRight size={isMobile ? 18 : 26} strokeWidth={2.25} />
        </button>

        {/* Bottom gradient — blends into breed page */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '220px',
          background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.85))',
          pointerEvents: 'none',
          zIndex: 4,
        }} />

        {/* Bottom-right: DISCOVER IT link — desktop only */}
        <div
          className="absolute hidden sm:block sm:bottom-20 sm:right-10"
          style={{ zIndex: 60 }}
        >
          <a
            href="#breed"
            onClick={e => { e.preventDefault(); document.getElementById('breed')?.scrollIntoView({ behavior: 'smooth' }); }}
            className="flex items-center gap-2 no-underline"
            style={{
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
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.95'; }}
          >
            DISCOVER IT
            <ArrowRight className="w-5 h-5 sm:w-8 sm:h-8" strokeWidth={2.25} />
          </a>
        </div>

      </div>
    </div>
  );
}
