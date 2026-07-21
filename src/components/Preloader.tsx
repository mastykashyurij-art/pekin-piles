import { useEffect, useRef, useState } from 'react';

const PRELOADER_VIDEO = '/preloader.mp4';
const FALLBACK_TIMEOUT_MS = 15000;
const MIN_DISPLAY_MS = 4000;
// Intrinsic aspect ratio of the source clip (1280x720), used to size the
// sharp video's box so the progress bar hugs its true rendered edges.
const VIDEO_ASPECT = 1280 / 720;

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const doneRef = useRef({ page: false, video: false });
  const startTimeRef = useRef(Date.now());
  const finishScheduledRef = useRef(false);

  useEffect(() => {
    document.body.style.overflow = visible ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [visible]);

  // Bar fills smoothly in step with actual video playback (currentTime/
  // duration), sampled every frame for a fluid 0->100 sweep instead of the
  // choppier native `timeupdate` cadence. Never regresses, so if the clip
  // has to loop while real loading is still catching up, the bar simply
  // holds at 100 instead of visibly resetting to 0.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let raf: number;
    const tick = () => {
      if (video.duration) {
        const pct = Math.min(100, (video.currentTime / video.duration) * 100);
        setProgress((prev) => Math.max(prev, pct));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const checkDone = () => {
      if (!doneRef.current.page || !doneRef.current.video || finishScheduledRef.current) return;
      finishScheduledRef.current = true;

      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);
      setTimeout(() => {
        setProgress(100);
        setTimeout(() => setFading(true), 300);
      }, remaining);
    };

    const onPageLoad = () => {
      doneRef.current.page = true;
      checkDone();
    };
    const onVideoReady = () => {
      doneRef.current.video = true;
      checkDone();
    };

    if (document.readyState === 'complete') onPageLoad();
    else window.addEventListener('load', onPageLoad);

    const video = videoRef.current;
    video?.addEventListener('canplaythrough', onVideoReady, { once: true });

    const fallback = setTimeout(() => {
      doneRef.current.page = true;
      doneRef.current.video = true;
      checkDone();
    }, FALLBACK_TIMEOUT_MS);

    return () => {
      window.removeEventListener('load', onPageLoad);
      video?.removeEventListener('canplaythrough', onVideoReady);
      clearTimeout(fallback);
    };
  }, []);

  useEffect(() => {
    if (!fading) return;
    const t = setTimeout(() => setVisible(false), 500);
    return () => clearTimeout(t);
  }, [fading]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-500 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        {/* Blurred, scaled-up copy fills the screen behind the sharp video so
            wide monitors never show plain black bars around the portrait clip. */}
        <video
          src={PRELOADER_VIDEO}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover scale-125 blur-3xl opacity-60"
        />
        <div className="absolute inset-0 bg-black/40" />

        <div
          className="relative"
          style={{
            width: `min(100vw, calc(100vh * ${VIDEO_ASPECT}))`,
            height: `min(100vh, calc(100vw / ${VIDEO_ASPECT}))`,
          }}
        >
          <video
            ref={videoRef}
            src={PRELOADER_VIDEO}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-contain"
          />
          <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center gap-3 pb-5 px-4">
            <div className="w-full h-3 rounded-full bg-white/20 shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)] overflow-hidden">
              <div
                className="h-full rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)] transition-[width] duration-75 ease-linear"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <span className="text-white text-3xl md:text-4xl font-bold tabular-nums tracking-wide drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
              {Math.round(Math.min(progress, 100))}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
