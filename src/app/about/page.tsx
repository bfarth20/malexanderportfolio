import Image from "next/image";
import { getSiteKV, getAssetUrl } from "@/lib/notion";

export const revalidate = 600;

// Helper: try multiple asset names (in case your Assets DB rows are named with/without "Assets/")
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

  // Images from Assets DB (fallback to legacy key for the main headshot)
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
      {/* 1) About */}
      <section className="grid items-center gap-6 md:grid-cols-2">
        <div className="md:order-1">
          <h2 className="text-2xl font-semibold">About the Artist</h2>
          <p className="mt-4 whitespace-pre-wrap leading-relaxed text-black-600">
            {bio}
          </p>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-900 md:order-2">
          {headshot ? (
            <Image
              src={headshot}
              alt="Headshot"
              fill
              className="object-cover"
            />
          ) : null}
        </div>
      </section>

      {/* 2) Clients & Commissions (image left, text right) */}
      <section className="grid items-center gap-6 md:grid-cols-2">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-900">
          {headshotClients ? (
            <Image
              src={headshotClients}
              alt="Painting in progress"
              fill
              className="object-cover"
            />
          ) : null}
        </div>
        <div>
          <h3 className="text-2xl font-semibold">Clients &amp; Commissions</h3>
          <p className="mt-4 whitespace-pre-wrap leading-relaxed text-black-600">
            {companies}
          </p>
        </div>
      </section>

      {/* 3) Charitable Works (image left, text right) */}
      <section className="grid items-center gap-6 md:grid-cols-2">
        <div className="md:order-1">
          <h3 className="text-2xl font-semibold">Charitable Works</h3>
          <p className="mt-4 whitespace-pre-wrap leading-relaxed text-black-600">
            {charity}
          </p>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-900 md:order-2">
          {headshotCharity ? (
            <Image
              src={headshotCharity}
              alt="Community & charity work"
              fill
              className="object-cover"
            />
          ) : null}
        </div>
      </section>
    </div>
  );
}
