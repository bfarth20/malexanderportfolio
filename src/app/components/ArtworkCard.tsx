"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";

export type ArtworkCardProps = {
  /** Thumbnail image (required) */
  src: string;
  /** Optional single full-size image (for backward-compat) */
  fullSrc?: string;
  /** Optional gallery of full-size images */
  images?: string[];
  title: string;
  alt?: string;
  className?: string;
  optimize?: boolean;
};

export default function ArtworkCard({
  src,
  fullSrc,
  images,
  title,
  alt,
  className = "",
  optimize = false,
}: ArtworkCardProps) {
  const [open, setOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const captionId = useId();

  const gallery =
    images && images.length > 0 ? images : fullSrc ? [fullSrc] : [src];

  function handleOpen() {
    // If a single fullSrc was provided and it's inside images, start there
    if (images && fullSrc) {
      const idx = images.indexOf(fullSrc);
      setStartIndex(idx >= 0 ? idx : 0);
    } else {
      setStartIndex(0);
    }
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
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
          unoptimized={!optimize}
        />

        {/* Centered title overlay on hover/focus */}
        <div
          className="pointer-events-none absolute inset-0 grid place-items-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
          aria-hidden
        >
          <span
            id={captionId}
            className="px-2 text-center text-base md:text-2xl font-semibold text-white"
          >
            {title}
          </span>
        </div>
      </button>

      <Lightbox
        open={open}
        onClose={handleClose}
        images={gallery}
        startIndex={startIndex}
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
  images,
  startIndex = 0,
  alt,
  title,
  optimize,
}: {
  open: boolean;
  onClose: () => void;
  images: string[];
  startIndex?: number;
  alt: string;
  title: string;
  optimize?: boolean;
}) {
  // ✅ All hooks at the top
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const drag = useRef<{ x: number | null }>({ x: null }); // keep hook at top
  const [fallback, setFallback] = useState(false);
  const [index, setIndex] = useState(startIndex);

  // Keep index in bounds if images change
  useEffect(() => {
    if (startIndex < 0 || startIndex >= images.length) setIndex(0);
    else setIndex(startIndex);
    setFallback(false);
  }, [startIndex, images]);

  // Keyboard + body scroll lock
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => {
      dialogRef.current
        ?.querySelector<HTMLButtonElement>("button[data-close]")
        ?.focus();
    }, 0);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, index]);

  // Preload neighbors for snappier nav
  useEffect(() => {
    const preload = (url?: string) => {
      if (!url) return;
      const img = new window.Image();
      img.src = url;
    };
    preload(images[(index + 1) % images.length]);
    preload(images[(index - 1 + images.length) % images.length]);
  }, [index, images]);

  if (!open) return null;

  function onBackdropClick(e: React.MouseEvent) {
    // Close only if user clicks the dark backdrop itself
    if (e.target === e.currentTarget) onClose();
  }

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  // --- Swipe handlers: no pointer capture, ignore when starting on controls
  const onPointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("[data-control]")) return; // don't start swipe on buttons/controls
    drag.current.x = e.clientX;
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (drag.current.x == null) return;
    const dx = e.clientX - drag.current.x;
    drag.current.x = null;
    const threshold = 50;
    if (dx > threshold) prev();
    else if (dx < -threshold) next();
  };

  const src = images[index];
  const pageLabel = `${index + 1} / ${images.length}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onBackdropClick} // ← use onClick, not onMouseDown
      ref={dialogRef}
    >
      <div
        className="relative w-full max-w-5xl h-[80vh] md:h-[85vh] select-none"
        onPointerDown={onPointerDown} // ← no setPointerCapture
        onPointerUp={onPointerUp}
      >
        {!fallback ? (
          <Image
            key={src}
            src={src}
            alt={alt}
            fill
            sizes="100vw"
            className="object-contain"
            draggable={false}
            unoptimized={!optimize}
            onError={() => setFallback(true)}
            priority
          />
        ) : (
          <img
            key={src}
            src={src}
            alt={alt}
            className="object-contain w-full h-full"
            draggable={false}
          />
        )}

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous image"
              data-control // ← mark as control
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-sm font-medium text-black shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              ←
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              data-control // ← mark as control
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-sm font-medium text-black shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              →
            </button>

            <div
              aria-live="polite"
              className="absolute left-1/2 -translate-x-1/2 bottom-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-black shadow"
            >
              {pageLabel}
            </div>
          </>
        )}

        <button
          type="button"
          data-close
          data-control // ← mark as control
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-sm font-medium text-black shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Close
        </button>
      </div>
    </div>
  );
}
