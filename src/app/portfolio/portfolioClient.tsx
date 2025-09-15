"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import ArtworkCard from "@/app/components/ArtworkCard";
import RoleFilter from "@/app/components/RoleFilter";
import type { Work } from "@/lib/types";

export default function PortfolioClient({ works }: { works: Work[] }) {
  const sp = useSearchParams();
  const selectedRole = sp?.get("role") ?? "";

  // Unique roles (ignore null/blank)
  const allRoles = useMemo<string[]>(
    () =>
      Array.from(
        new Set(
          works.map((w) => w.role ?? "").filter((r) => r.trim().length > 0)
        )
      ).sort(),
    [works]
  );

  const filtered = useMemo<Work[]>(
    () =>
      selectedRole
        ? works.filter((w) => (w.role ?? "") === selectedRole)
        : works,
    [works, selectedRole]
  );

  return (
    <>
      {allRoles.length > 0 && (
        <RoleFilter allRoles={allRoles} className="mb-4" />
      )}

      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-3">
        {filtered.map((w) => {
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
                  optimize={true}
                />
              ) : (
                <div className="aspect-square rounded-xl bg-neutral-200" />
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}
