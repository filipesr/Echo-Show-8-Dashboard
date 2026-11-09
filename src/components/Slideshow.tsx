"use client";

import { useEffect, useState } from "react";
import Clock from "@/components/Clock";

interface SlideshowProps {
  photos: string[];
}

const PHOTOS_URL = process.env.NEXT_PUBLIC_PHOTOS_URL;
const PHOTO_DURATION_MS = 10 * 1000;

export default function Slideshow({ photos: localPhotos }: SlideshowProps) {
  const [photos, setPhotos] = useState(localPhotos);
  const [slide, setSlide] = useState({ current: 0, previous: -1 });

  // Remote list (JSON array of URLs) replaces the local photos when configured
  useEffect(() => {
    if (!PHOTOS_URL) return;
    fetch(PHOTOS_URL)
      .then((res) => res.json())
      .then((data: unknown) => {
        if (Array.isArray(data) && data.length > 0) setPhotos(data);
      })
      .catch((error) => console.warn("Photos update failed", error));
  }, []);

  useEffect(() => {
    if (photos.length < 2) return;
    const id = setInterval(() => {
      setSlide(({ current }) => ({
        current: (current + 1) % photos.length,
        previous: current,
      }));
    }, PHOTO_DURATION_MS);
    return () => clearInterval(id);
  }, [photos.length]);

  // Only two images are in the DOM: the previous one stays underneath
  // while the current one fades in on top of it (3s CSS animation).
  // The key forces a remount, which restarts the animation on every change.
  return (
    <div className="absolute inset-0 z-10 bg-black">
      {/* eslint-disable @next/next/no-img-element -- arbitrary remote URLs */}
      {slide.previous >= 0 && (
        <img
          src={photos[slide.previous]}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      {photos.length > 0 && (
        <img
          key={slide.current}
          src={photos[slide.current]}
          alt=""
          className="absolute inset-0 h-full w-full animate-fade-in object-cover"
        />
      )}
      {/* eslint-enable @next/next/no-img-element */}
      <div className="absolute right-12 bottom-10 text-white/70 drop-shadow-lg">
        <Clock size="small" />
      </div>
    </div>
  );
}
