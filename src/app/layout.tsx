import "./globals.css";
import type { Metadata } from "next";
import { NavTabs } from "@/app/components/NavTabs";

export const metadata: Metadata = {
  title: "M. Alexander — Portfolio",
  description: "Clean • Simple • Fast",
  openGraph: {
    title: "M. Alexander — Portfolio",
    description: "Clean • Simple • Fast",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-neutral-200/60 dark:border-neutral-800">
          <div className="mx-auto max-w-5xl px-4 py-4">
            <h1 className="text-xl font-semibold tracking-tight">
              M. Alexander
            </h1>
            <NavTabs />
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        <footer className="mx-auto max-w-5xl px-4 py-10 text-sm text-neutral-500">
          © {new Date().getFullYear()} M. Alexander
        </footer>
      </body>
    </html>
  );
}
