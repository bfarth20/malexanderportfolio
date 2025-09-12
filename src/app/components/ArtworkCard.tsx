"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";

export type ArtworkCardProps = {
  /** Thumbnail URL (square crop happens via CSS) */
  src: string;
  /** Optional full-size image URL for the lightbox. Defaults to `src`. */
  fullSrc?: string;
  /** Title shown on hover (and in the lightbox caption). */
  title: string;
  /** Accessible alt text for the thumbnail and lightbox image. */
  alt?: string;
  /** Optional className to style the outer wrapper. */
  className?: string;
  /** If true, Next/Image optimization is enabled (requires remotePatterns). Default: false */
  optimize?: boolean;
};

/**
 * Reusable square artwork tile with hover zoom + title overlay and a built-in lightbox.
 * - Keyboard accessible (Enter/Space opens, Esc closes)
 * - Focus is returned to the trigger on close
 * - Click outside or on backdrop closes
 * - Mobile: shows title overlay by default; desktop: on hover
 */
export default function ArtworkCard({
  src,
  fullSrc,
  title,
  alt,
  className = "",
  optimize = false,
}: ArtworkCardProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const captionId = useId();

  function handleOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    // return focus to the opener for a11y
    queueMicrotask(() => triggerRef.current?.focus());
  }

  return (
    <>
      <button
        type="button"
        ref={triggerRef}
        onClick={handleOpen}
        className={
          "group relative block w-full aspect-square overflow-hidden rounded-xl bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black/80 " +
          className
        }
        aria-labelledby={captionId}
      >
        {/* Thumbnail */}
        <Image
          src={src}
          alt={alt || title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 20vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          // Avoid Next/Image domain config footgun unless user opts in
          unoptimized={!optimize}
        />

        {/* Title overlay: visible by default on small screens; hover on md+ */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3 text-white">
          <div
            id={captionId}
            className="rounded-md bg-gradient-to-t from-black/70 via-black/30 to-transparent px-3 py-2 text-sm font-medium md:opacity-0 md:transition-opacity md:duration-200 md:group-hover:opacity-100"
          >
            {title}
          </div>
        </div>
      </button>

      <Lightbox
        open={open}
        onClose={handleClose}
        src={fullSrc || src}
        alt={alt || title}
        title={title}
        optimize={optimize}
      />
    </>
  );
}

// ---------------------------
// Lightbox (internal)
// ---------------------------
function Lightbox({
  open,
  onClose,
  src,
  alt,
  title,
  optimize,
}: {
  open: boolean;
  onClose: () => void;
  src: string;
  alt: string;
  title: string;
  optimize?: boolean;
}) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const [fallback, setFallback] = useState(false);

  // Close on Esc; prevent background scroll when open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => {
      dialogRef.current
        ?.querySelector<HTMLButtonElement>("button[data-close]")
        ?.focus();
    }, 0);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      clearTimeout(t);
    };
  }, [open, onClose]);

  if (!open) return null;

  function onBackdrop(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onMouseDown={onBackdrop}
      ref={dialogRef}
    >
      {/* Important: explicit height so Next/Image with fill can render */}
      <div className="relative w-full max-w-5xl h-[80vh] md:h-[85vh]">
        {!fallback ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes="100vw"
            className="object-contain select-none"
            draggable={false}
            unoptimized={!optimize}
            onError={() => setFallback(true)}
          />
        ) : (
          // Fallback to native img if Next/Image optimization/host fails
          <img
            src={src}
            alt={alt}
            className="object-contain w-full h-full select-none"
            draggable={false}
          />
        )}
        {/* Close button */}
        <button
          type="button"
          data-close
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-sm font-medium text-black shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Close
        </button>
      </div>
    </div>
  );
}
