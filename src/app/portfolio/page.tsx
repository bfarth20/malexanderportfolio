import ArtworkCard from "@/app/components/ArtworkCard"; // or "@/components/ArtworkCard"
import { getWorks } from "@/lib/notion";
import type { Work } from "@/lib/types";

export const revalidate = 600;

export default async function PortfolioPage() {
  const works: Work[] = await getWorks();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Portfolio</h2>

      {works.length === 0 ? (
        <p className="text-sm text-neutral-500">
          No works yet. Add items in Notion.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {works.map((w) => {
            const thumb = w.thumbnailUrl ?? w.images?.[0];
            const full = (w.images && w.images[w.images.length - 1]) ?? thumb;

            return (
              <li key={w.id}>
                {thumb ? (
                  <ArtworkCard
                    src={thumb}
                    fullSrc={full || thumb}
                    title={w.title}
                    alt={w.title}
                    optimize={true} // you already whitelisted hosts in next.config.mjs
                  />
                ) : (
                  <div className="aspect-square rounded-xl bg-neutral-200" />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
