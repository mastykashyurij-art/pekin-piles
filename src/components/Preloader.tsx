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

  // Bar fills in step with actual video playback (currentTime/duration),
  // capped below 100 until loading is confirmed done. Never regresses, so a
  // loop (if real loading outruns the clip) just holds the bar at its cap
  // instead of visibly resetting.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      if (finishScheduledRef.current || !video.duration) return;
      const pct = Math.min(99, (video.currentTime / video.duration) * 100);
      setProgress((prev) => Math.max(prev, pct));
    };

    video.addEventListener('timeupdate', onTimeUpdate);
    return () => video.removeEventListener('timeupdate', onTimeUpdate);
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
          <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center gap-1.5 pb-3">
            <div className="w-full h-2 bg-white/10">
              <div
                className="h-full bg-white transition-[width] duration-150 ease-out"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <span className="text-white text-xs font-medium tabular-nums tracking-wide">
              {Math.round(Math.min(progress, 100))}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
