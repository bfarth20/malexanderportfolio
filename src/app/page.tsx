import FeaturedSlideshow, {
  type Slide,
} from "@/app/components/FeaturedSlideshow";
import { getSiteKV, getWorks } from "@/lib/notion";

export const revalidate = 600;

export default async function HomePage() {
  const [kv, featured] = await Promise.all([
    getSiteKV(),
    getWorks({ featuredOnly: true }),
  ]);

  const title = kv["home_title"] || "Artist Name";
  const subtitle = kv["home_subtitle"] || "Clean • Simple • Fast";

  // Map works -> slides (skip items without images)
  const slides: Slide[] = featured
    .map((w) => {
      const cover = w.thumbnailUrl ?? w.images?.[0]; // first image, not last
      if (!cover) return null;
      return {
        src: cover,
        fullSrc: cover,
        title: w.title,
        alt: w.title,
      };
    })
    .filter(Boolean) as Slide[];

  return (
    <div className="space-y-10">
      <section className="flex flex-col gap-2">
        <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
        <p className="text-neutral-600">{subtitle}</p>
      </section>

      <section>
        <h3 className="sr-only">Featured Work</h3>
        <FeaturedSlideshow items={slides} intervalMs={6000} optimize />
      </section>
    </div>
  );
}
