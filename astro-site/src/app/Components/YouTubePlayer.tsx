import { useEffect, useRef, useState } from 'react';

interface YouTubePlayerProps {
  videoId: string;
  title?: string;
  autoplay?: boolean;
}

let apiPromise: Promise<any> | null = null;

/** Load the YouTube IFrame API once and share it between players. */
function loadYouTubeApi(): Promise<any> {
  if (typeof window === 'undefined') return Promise.resolve(null);
  const w = window as any;
  if (w.YT && w.YT.Player) return Promise.resolve(w.YT);
  if (apiPromise) return apiPromise;

  apiPromise = new Promise((resolve) => {
    const previous = w.onYouTubeIframeAPIReady;
    w.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve(w.YT);
    };
    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      document.head.appendChild(script);
    }
  });

  return apiPromise;
}

/**
 * YouTube embed where a click anywhere in the middle of the video toggles
 * play/pause. The bottom strip stays uncovered so YouTube's own progress bar,
 * volume and fullscreen controls keep working.
 */
export default function YouTubePlayer({ videoId, title, autoplay = true }: YouTubePlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<any>(null);
  const [playing, setPlaying] = useState(autoplay);
  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  useEffect(() => {
    let cancelled = false;

    loadYouTubeApi().then((YT) => {
      if (cancelled || !YT || !iframeRef.current) return;
      const player = new YT.Player(iframeRef.current, {
        events: {
          onReady: () => {
            if (autoplay) player.playVideo();
          },
          onStateChange: (event: any) => {
            setPlaying(event.data === 1 || event.data === 3);
          },
        },
      });
      playerRef.current = player;
    });

    return () => {
      cancelled = true;
      playerRef.current = null;
    };
  }, [autoplay]);

  const toggle = () => {
    const player = playerRef.current;
    if (player && typeof player.getPlayerState === 'function') {
      const state = player.getPlayerState();
      if (state === 1 || state === 3) {
        player.pauseVideo();
        setPlaying(false);
      } else {
        player.playVideo();
        setPlaying(true);
      }
      return;
    }

    // Fallback while the API is still loading.
    const next = !playing;
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func: next ? 'playVideo' : 'pauseVideo', args: [] }),
      'https://www.youtube.com'
    );
    setPlaying(next);
  };

  const src =
    `https://www.youtube.com/embed/${videoId}` +
    `?autoplay=${autoplay ? 1 : 0}&rel=0&modestbranding=1&playsinline=1&enablejsapi=1` +
    (origin ? `&origin=${encodeURIComponent(origin)}` : '');

  return (
    <div className="absolute inset-0 bg-black">
      <iframe
        ref={iframeRef}
        src={src}
        title={title || 'Tech Dental Video'}
        className="absolute inset-0 w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />

      {/* Middle click area: pause/play. Top and bottom strips stay free so
          YouTube's title, progress bar, volume and fullscreen keep working. */}
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? 'Pause video' : 'Play video'}
        title={playing ? 'Pause' : 'Play'}
        className="absolute inset-x-0 top-[8%] bottom-14 z-[5] bg-transparent cursor-pointer focus:outline-none"
      />
    </div>
  );
}
