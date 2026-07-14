"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const HERO_VIDEO_SRC = "/video/herovideo.mp4";
const HERO_POSTER_SRC = "/images/herovideoPoster.webp";

export function HeroBackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [canAutoplay, setCanAutoplay] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updatePreference = () => {
      setCanAutoplay(!mediaQuery.matches);
      if (mediaQuery.matches) {
        setIsPlaying(false);
        videoRef.current?.pause();
      }
    };

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (!canAutoplay) {
      return;
    }

    videoRef.current?.play().catch(() => setIsPlaying(false));
  }, [canAutoplay]);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <Image
        src={HERO_POSTER_SRC}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <video
        ref={videoRef}
        aria-hidden="true"
        tabIndex={-1}
        autoPlay={canAutoplay}
        muted
        loop
        playsInline
        preload="metadata"
        poster={HERO_POSTER_SRC}
        onPlaying={() => setIsPlaying(true)}
        onError={() => setIsPlaying(false)}
        className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-500 ${
          isPlaying ? "opacity-100" : "opacity-0"
        }`}
      >
        <source src={HERO_VIDEO_SRC} type="video/mp4" />
      </video>
    </div>
  );
}
