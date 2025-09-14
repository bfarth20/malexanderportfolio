import Image from "next/image";
import { getSiteKV, getAssetUrl } from "@/lib/notion";

export const revalidate = 600;

export default async function AboutPage() {
  const kv = await getSiteKV();
  const bio =
    kv["about_bio"] || "Add your artist biography in Notion (key: about_bio).";

  // Prefer Assets DB (`headshot`), fall back to the legacy `about_headshot_url` key
  const headshotAsset = await getAssetUrl("headshot");
  const headshot = headshotAsset || kv["about_headshot_url"];

  return (
    <div className="grid gap-6 sm:grid-cols-[240px,1fr]">
      <div className="relative aspect-square w-60 bg-neutral-100 dark:bg-neutral-900 rounded-xl overflow-hidden">
        {headshot ? (
          <Image src={headshot} alt="Headshot" fill className="object-cover" />
        ) : null}
      </div>
      <div>
        <h2 className="text-2xl font-semibold">About the Artist</h2>
        <p className="mt-4 whitespace-pre-wrap leading-relaxed text-black-700">
          {bio}
        </p>
      </div>
    </div>
  );
}
