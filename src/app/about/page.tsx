import Image from "next/image";
import { getSiteKV, getAssetUrl } from "@/lib/notion";

export const revalidate = 600;

// Helper: try multiple asset names
async function getAssetWithFallback(names: string[]) {
  for (const name of names) {
    const url = await getAssetUrl(name);
    if (url) return url;
  }
  return null;
}

export default async function AboutPage() {
  const kv = await getSiteKV();

  const bio =
    kv["about_bio"] || "Add your artist biography in Notion (key: about_bio).";
  const companies =
    kv["about_companies"] ||
    "Add notable clients and commissions in Notion (key: about_companies).";
  const charity =
    kv["about_charity"] ||
    "Add charitable work details in Notion (key: about_charity).";

  // Images
  const headshot =
    (await getAssetWithFallback(["headshot", "Assets/headshot"])) ||
    kv["about_headshot_url"] ||
    null;

  const headshotClients = await getAssetWithFallback([
    "headshot_clients",
    "Assets/headshot_clients",
  ]);

  const headshotCharity = await getAssetWithFallback([
    "headshot_charity",
    "Assets/headshot_charity",
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 space-y-16">
      {/* 1) About the Artist — desktop: text left, image right */}
      <section className="grid items-start gap-6 md:grid-cols-2">
        {/* Heading first on mobile; same column as text on desktop */}
        <h2 className="text-2xl font-semibold md:col-start-1 md:row-start-1">
          About the Artist
        </h2>

        {/* Image on the right at md+; stacked second on mobile */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-100 md:col-start-2 md:row-span-2">
          {headshot ? (
            <Image
              src={headshot}
              alt="Headshot"
              fill
              className="object-cover"
            />
          ) : null}
        </div>

        {/* Paragraph third on mobile; under heading in left column at md+ */}
        <p className="whitespace-pre-wrap leading-relaxed text-lg text-neutral-800 md:col-start-1 md:row-start-2">
          {bio}
        </p>
      </section>

      {/* 2) Clients & Commissions — desktop: image left, text right */}
      <section className="grid items-start gap-6 md:grid-cols-2">
        {/* Heading first on mobile; right column at md+ */}
        <h3 className="text-2xl font-semibold md:col-start-2 md:row-start-1">
          Clients &amp; Commissions
        </h3>

        {/* Image left at md+; second on mobile */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-100 md:col-start-1 md:row-span-2">
          {headshotClients ? (
            <Image
              src={headshotClients}
              alt="Painting in progress"
              fill
              className="object-cover"
            />
          ) : null}
        </div>

        {/* Paragraph third on mobile; right column at md+ under heading */}
        <p className="whitespace-pre-wrap leading-relaxed text-lg text-neutral-800 md:col-start-2 md:row-start-2">
          {companies}
        </p>
      </section>

      {/* 3) Charitable Works — desktop: text left, image right (kept as you had it) */}
      <section className="grid items-start gap-6 md:grid-cols-2">
        {/* Heading first on mobile; left column at md+ */}
        <h3 className="text-2xl font-semibold md:col-start-1 md:row-start-1">
          Charitable Works
        </h3>

        {/* Image right at md+; second on mobile */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-100 md:col-start-2 md:row-span-2">
          {headshotCharity ? (
            <Image
              src={headshotCharity}
              alt="Community & charity work"
              fill
              className="object-cover"
            />
          ) : null}
        </div>

        {/* Paragraph third on mobile; under heading in left column at md+ */}
        <p className="whitespace-pre-wrap leading-relaxed text-lg text-neutral-800 md:col-start-1 md:row-start-2">
          {charity}
        </p>
      </section>
    </div>
  );
}
