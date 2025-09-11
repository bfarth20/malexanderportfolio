import "./globals.css";
import type { Metadata } from "next";
import { NavTabs } from "@/app/components/NavTabs";
import { Footer } from "@/app/components/Footer";
import { getSiteKV } from "@/lib/notion";

export const metadata: Metadata = {
  title: "M. Alexander — Portfolio",
  description: "Clean • Simple • Fast",
  openGraph: {
    title: "M. Alexander — Portfolio",
    description: "Clean • Simple • Fast",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const kv = await getSiteKV();
  const name = kv["site_artist_name"] || "M. Alexander";
  const location = kv["site_location"] || "Atlanta, GA";
  const email = kv["contact_email"] || "";
  const phone = kv["contact_phone"] || "";

  return (
    <html lang="en">
      <body>
        <header className="border-b border-neutral-200/60 dark:border-neutral-800">
          <div className="mx-auto max-w-5xl px-4 py-4">
            <h1 className="text-xl font-semibold tracking-tight">{name}</h1>
            <NavTabs />
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        <Footer name={name} location={location} email={email} phone={phone} />
      </body>
    </html>
  );
}
