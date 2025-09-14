"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";

export default function RoleFilter({
  allRoles,
  className = "",
}: {
  allRoles: string[];
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const roleFromUrl = sp?.get("role") ?? "";
  const [selected, setSelected] = useState<string>(roleFromUrl);

  useEffect(() => {
    const params = new URLSearchParams(sp?.toString());
    if (selected) params.set("role", selected);
    else params.delete("role");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, pathname, router]);

  return (
    <div className={clsx("flex flex-wrap items-center gap-2", className)}>
      <button
        type="button"
        onClick={() => setSelected("")}
        aria-pressed={selected === ""}
        className={clsx(
          "px-3 py-1.5 rounded-full border text-sm",
          selected === ""
            ? "bg-black text-white border-black"
            : "border-neutral-300 hover:border-neutral-400"
        )}
      >
        All
      </button>

      {allRoles.map((role) => {
        const active = selected === role;
        return (
          <button
            key={role}
            type="button"
            onClick={() => setSelected(active ? "" : role)}
            aria-pressed={active}
            className={clsx(
              "px-3 py-1.5 rounded-full border text-sm transition-colors",
              active
                ? "bg-black text-white border-black"
                : "border-neutral-300 hover:border-neutral-400"
            )}
          >
            {role}
          </button>
        );
      })}
    </div>
  );
}
