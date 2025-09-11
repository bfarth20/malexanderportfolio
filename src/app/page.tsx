import { getSiteKV, getWorks } from "@/lib/notion";

export const revalidate = 600; // ISR: re-check Notion every ~10 minutes

export default async function HomePage() {
  const [kv, featured] = await Promise.all([
    getSiteKV(),
    getWorks({ featuredOnly: true }),
  ]);

  const title = kv["home_title"] || "Artist Name";
  const subtitle = kv["home_subtitle"] || "Clean • Simple • Fast";

  return (
    <div className="space-y-10">
      <section className="flex flex-col gap-2">
        <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
        <p className="text-neutral-600 dark:text-neutral-300">{subtitle}</p>
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
            {featured.map((w) => (
              <li
                key={w.id}
                className="rounded-2xl border border-neutral-200/60 dark:border-neutral-800 p-4"
              >
                <div className="font-semibold">{w.title}</div>
                <div className="text-sm text-neutral-500">
                  {[w.role, w.year].filter(Boolean).join(" • ")}
                </div>
                {w.description ? (
                  <p className="mt-2 text-sm">{w.description}</p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
