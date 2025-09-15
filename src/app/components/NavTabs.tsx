"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

const links = [
  { href: "/", label: "Home" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/about", label: "About the Artist" },
  { href: "/contact", label: "Connect" },
];

export function NavTabs() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href + "/"));

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on Esc & manage focus
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        queueMicrotask(() => buttonRef.current?.focus());
      }
    };
    document.addEventListener("keydown", onKey);
    const t = setTimeout(() => firstLinkRef.current?.focus(), 0);
    return () => {
      document.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [open]);

  return (
    <div className="relative">
      {/* Desktop tabs */}
      <ul className="hidden sm:flex items-center gap-6 text-sm font-medium">
        {links.map(({ href, label }) => {
          const active = isActive(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={clsx(
                  "no-underline transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2",
                  active
                    ? "text-neutral-500"
                    : "text-black hover:text-neutral-500"
                )}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Mobile trigger */}
      <button
        ref={buttonRef}
        type="button"
        className="sm:hidden inline-flex items-center justify-center rounded-md p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
        aria-label="Open navigation menu"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen((v) => !v)}
      >
        {/* Hamburger / Close icon */}
        {open ? (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            aria-hidden
            className="text-black"
          >
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            aria-hidden
            className="text-black"
          >
            <path
              d="M4 6h16M4 12h16M4 18h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        )}
      </button>

      {/* Mobile menu panel + backdrop */}
      {open && (
        <>
          {/* Backdrop to close when clicking outside */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div
            id="mobile-nav"
            role="menu"
            className="absolute right-0 top-full z-50 mt-2 w-60 rounded-xl border border-neutral-200 bg-white shadow-lg"
          >
            <ul className="p-2">
              {links.map(({ href, label }, idx) => {
                const active = isActive(href);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      role="menuitem"
                      ref={idx === 0 ? firstLinkRef : null}
                      className={clsx(
                        "block rounded-md px-3 py-2 no-underline transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300",
                        active
                          ? "text-neutral-500"
                          : "text-black hover:text-neutral-500"
                      )}
                      onClick={() => setOpen(false)}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
