import { useEffect, useRef, useState } from 'react';

const PRELOADER_VIDEO = '/preloader-candyjackson.mp4';
const FALLBACK_TIMEOUT_MS = 15000;

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const doneRef = useRef({ page: false, video: false });

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Eases toward 90% while real loading happens in the background, so the
  // bar never looks "finished" before the site actually is.
  useEffect(() => {
    let raf: number;
    const tick = () => {
      setProgress((p) =>
        doneRef.current.page && doneRef.current.video ? 100 : p + (90 - p) * 0.04,
      );
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const checkDone = () => {
      if (doneRef.current.page && doneRef.current.video) {
        setProgress(100);
        setTimeout(() => setFading(true), 300);
      }
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
      <div className="relative w-full h-full flex items-center justify-center">
        <video
          ref={videoRef}
          src={PRELOADER_VIDEO}
          autoPlay
          muted
          loop
          playsInline
          className="max-w-full max-h-full object-contain"
        />
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-white/10">
          <div
            className="h-full bg-white transition-[width] duration-150 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
