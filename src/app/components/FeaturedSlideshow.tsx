"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { motion } from "framer-motion";

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

  // Always set up hooks
  useEffect(() => {
    const onVis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    if (count < 2 || paused) return;
    const id = setInterval(() => {
      setIndex((current) => {
        const next = (((current + 1) % count) + count) % count;
        return loaded[next] ? next : current;
      });
    }, intervalMs);
    return () => clearInterval(id);
  }, [count, paused, intervalMs, loaded]);

  if (!count) return null;

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
          mobileHClass,
          desktopAspectClass
        )}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        style={{ isolation: "isolate" }} // ensures predictable stacking
      >
        {items.map((s, i) => {
          const active = i === index;
          return (
            <motion.div
              key={i}
              aria-hidden={!active}
              className="absolute inset-0"
              initial={false}
              animate={{ opacity: active ? 1 : 0 }}
              transition={{ duration: 4.0, ease: [0.22, 1, 0.36, 1] }}
              style={{ zIndex: active ? 2 : 1, willChange: "opacity" }}
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
            </motion.div>
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
