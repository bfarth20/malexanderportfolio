"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import clsx from "clsx";

export type Slide = {
  src: string;
  alt?: string;
  title?: string;
  fullSrc?: string;
  /** Optional focal point when using cover, e.g. "50% 30%" */
  objectPosition?: string;
};

type Props = {
  items: Slide[];
  intervalMs?: number;
  optimize?: boolean;
  className?: string;
  /** Desktop aspect ratio (Tailwind class). e.g. "md:aspect-[16/9]" */
  desktopAspectClass?: string;
  /** Mobile height (vh). Keeps mobile looking good for portraits. */
  mobileVh?: number; // e.g. 60 => h-[60vh]
};

export default function FeaturedSlideshow({
  items,
  intervalMs = 6000,
  optimize = true,
  className = "",
  desktopAspectClass = "md:aspect-[16/9]",
  mobileVh = 60,
}: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [loaded, setLoaded] = useState<boolean[]>(() =>
    items.map((_, i) => i === 0)
  );

  const count = items.length;

  // Hooks must be unconditional
  useEffect(() => {
    const onVis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    if (count < 2 || paused) return;
    const id = setInterval(() => {
      setIndex((current) => {
        // inline safeIndex to satisfy exhaustive-deps
        const next = (((current + 1) % count) + count) % count;
        return loaded[next] ? next : current;
      });
    }, intervalMs);
    return () => clearInterval(id);
  }, [count, paused, intervalMs, loaded]);

  if (!count) return null;

  // Build mobile height class (e.g., h-[60vh])
  const mobileHClass = `h-[${mobileVh}vh]`;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured works"
      className={clsx("relative", className)}
    >
      <div
        className={clsx(
          "relative w-full overflow-hidden rounded-2xl bg-neutral-100",
          mobileHClass, // mobile: fixed vh, good for portraits
          desktopAspectClass // md+: landscape aspect so cover looks intentional
        )}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {items.map((s, i) => {
          const active = i === index;
          return (
            <div
              key={i}
              aria-hidden={!active}
              className={clsx(
                "absolute inset-0 will-change-opacity",
                "transition-opacity duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                active ? "opacity-100" : "opacity-0"
              )}
            >
              <Image
                src={s.fullSrc || s.src}
                alt={s.alt || s.title || "Artwork"}
                fill
                sizes="100vw"
                className="object-contain md:object-cover select-none"
                style={
                  s.objectPosition
                    ? { objectPosition: s.objectPosition }
                    : undefined
                }
                unoptimized={!optimize}
                onLoadingComplete={() =>
                  setLoaded((prev) => {
                    if (prev[i]) return prev;
                    const next = prev.slice();
                    next[i] = true;
                    return next;
                  })
                }
                priority={i === 0}
              />
            </div>
          );
        })}

        {count > 1 && (
          <div className="pointer-events-auto absolute inset-x-0 bottom-3 flex items-center justify-center gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={clsx(
                  "h-2.5 w-2.5 rounded-full transition-transform",
                  i === index
                    ? "scale-110 bg-black/80"
                    : "bg-black/35 hover:scale-105"
                )}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
