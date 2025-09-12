// app/page.tsx
import ArtworkCard from "./components/ArtworkCard";
import { getSiteKV, getWorks } from "@/lib/notion";
import type { Work } from "@/lib/types";

export const revalidate = 600; // ISR

export default async function HomePage() {
  const kv = await getSiteKV();
  const featured: Work[] = await getWorks({ featuredOnly: true });

  const title = kv["home_title"] || "Artist Name";
  const subtitle = kv["home_subtitle"] || "Clean • Simple • Fast";

  return (
    <div className="space-y-10">
      <section className="flex flex-col gap-2">
        <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
        <p className="text-neutral-600">{subtitle}</p>
      </section>

      <section>
        <h3 className="mb-4 text-lg font-semibold">Featured Work</h3>
        {featured.length === 0 ? (
          <p className="text-sm text-neutral-500">
            No featured items yet. In Notion, check the{" "}
            <strong>Featured</strong> box on a work.
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((w) => {
              const thumb = w.thumbnailUrl ?? w.images?.[0];
              const full = (w.images && w.images[w.images.length - 1]) ?? thumb;

              return (
                <li key={w.id} className="group">
                  {thumb ? (
                    <ArtworkCard
                      src={thumb}
                      fullSrc={full || thumb}
                      title={w.title}
                      alt={w.title} // no `alt` in Work, so use title
                      optimize={true} // you added remotePatterns, so go ahead
                    />
                  ) : (
                    <div className="aspect-square rounded-2xl bg-neutral-200" />
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
