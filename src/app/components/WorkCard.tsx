import Image from "next/image";
import Link from "next/link";
import type { Work } from "@/lib/types";

export function WorkCard({ work }: { work: Work }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-neutral-200/60 dark:border-neutral-800 bg-white dark:bg-neutral-950">
      <div className="aspect-[4/3] w-full bg-neutral-100 dark:bg-neutral-900 relative">
        {work.thumbnailUrl ? (
          <Image
            src={work.thumbnailUrl}
            alt={work.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : null}
      </div>
      <div className="p-4">
        <h3 className="text-base font-semibold">
          <Link
            href={`/portfolio#${work.slug}`}
            className="no-underline hover:underline"
          >
            {work.title}
          </Link>
        </h3>
        <p className="text-sm text-neutral-500">
          {[work.role, work.year].filter(Boolean).join(" • ")}
        </p>
        {work.description ? (
          <p className="mt-2 line-clamp-2 text-sm text-neutral-700 dark:text-neutral-300">
            {work.description}
          </p>
        ) : null}
      </div>
    </article>
  );
}
