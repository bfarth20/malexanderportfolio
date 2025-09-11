import { getSiteKV, getWorks } from "../../lib/notion";

// Rebuild content every 10 minutes so Notion edits go live automatically
export const revalidate = 600;

export default async function HomePage() {
  const [kv, featured] = await Promise.all([
    getSiteKV(),
    getWorks({ featuredOnly: true }),
  ]);

  const title = kv["home_title"] || "Artist Name";
  const subtitle = kv["home_subtitle"] || "Clean • Simple • Fast";

  return (
    <div style={{ maxWidth: 900, margin: "2rem auto", padding: "0 1rem" }}>
      <section>
        <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>{title}</h1>
        <p style={{ color: "#666", marginTop: 8 }}>{subtitle}</p>
      </section>

      <section style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: 12 }}>
          Featured Work
        </h2>
        {featured.length === 0 ? (
          <p style={{ color: "#666" }}>
            No featured items yet. In Notion, check the{" "}
            <strong>Featured</strong> box on a work.
          </p>
        ) : (
          <ul
            style={{
              display: "grid",
              gap: 12,
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            }}
          >
            {featured.map((w) => (
              <li
                key={w.id}
                style={{
                  border: "1px solid #e5e5e5",
                  borderRadius: 12,
                  padding: 12,
                }}
              >
                <div style={{ fontWeight: 600 }}>{w.title}</div>
                <div style={{ color: "#666", fontSize: 14 }}>
                  {[w.role, w.year].filter(Boolean).join(" • ")}
                </div>
                {w.description ? (
                  <p style={{ marginTop: 8, fontSize: 14 }}>{w.description}</p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
