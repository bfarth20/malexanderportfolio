import { getWorks } from "@/lib/notion";
import { WorkCard } from "@/app/components/WorkCard";

export const revalidate = 600;

export default async function PortfolioPage() {
  const works = await getWorks();
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Portfolio</h2>
      {works.length === 0 ? (
        <p className="text-sm text-neutral-500">
          No works yet. Add items in Notion.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {works.map((w) => (
            <WorkCard key={w.id} work={w} />
          ))}
        </div>
      )}
    </div>
  );
}
