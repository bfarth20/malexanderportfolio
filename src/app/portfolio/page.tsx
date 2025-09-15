import { Suspense } from "react";
import { getWorks } from "@/lib/notion";
import type { Work } from "@/lib/types";
import PortfolioClient from "./portfolioClient";

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
        <Suspense
          fallback={
            <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <li
                  key={i}
                  className="aspect-square rounded-xl bg-neutral-200 animate-pulse"
                />
              ))}
            </ul>
          }
        >
          <PortfolioClient works={works} />
        </Suspense>
      )}
    </div>
  );
}
