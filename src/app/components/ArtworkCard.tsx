"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";

export type ArtworkCardProps = {
  src: string;
  fullSrc?: string;
  title: string;
  alt?: string;
  className?: string;
  optimize?: boolean;
};

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
          className="
    pointer-events-none absolute inset-0 grid place-items-center
    bg-black/40 opacity-0 transition-opacity duration-200
    group-hover:opacity-100 group-focus-visible:opacity-100
  "
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

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
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
          <img
            src={src}
            alt={alt}
            className="object-contain w-full h-full select-none"
            draggable={false}
          />
        )}
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
