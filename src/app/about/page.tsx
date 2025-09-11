import Image from "next/image";
import { getSiteKV } from "@/lib/notion";

export const revalidate = 600;

export default async function AboutPage() {
  const kv = await getSiteKV();
  const bio =
    kv["about_bio"] || "Add your artist biography in Notion (key: about_bio).";
  const headshot = kv["about_headshot_url"]; // direct image URL

  return (
    <div className="grid gap-6 sm:grid-cols-[240px,1fr]">
      <div className="relative aspect-square w-60 bg-neutral-100 dark:bg-neutral-900 rounded-xl overflow-hidden">
        {headshot ? (
          <Image src={headshot} alt="Headshot" fill className="object-cover" />
        ) : null}
      </div>
      <div>
        <h2 className="text-2xl font-semibold">About the Artist</h2>
        <p className="mt-4 whitespace-pre-wrap leading-relaxed text-neutral-700 dark:text-neutral-300">
          {bio}
        </p>
      </div>
    </div>
  );
}
