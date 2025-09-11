type FooterProps = {
  name?: string;
  location?: string;
  email?: string;
  phone?: string;
};

export function Footer({ name, location, email, phone }: FooterProps) {
  const year = new Date().getFullYear();
  return (
    <footer className="mx-auto max-w-5xl px-4 py-10 text-sm text-neutral-600 dark:text-neutral-400 border-t border-neutral-200/60 dark:border-neutral-800">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="font-medium">
          {name || "Artist Name"}
          {location ? (
            <span className="ml-2 text-neutral-500">• {location}</span>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {email ? (
            <a
              className="underline underline-offset-4"
              href={`mailto:${email}`}
            >
              {email}
            </a>
          ) : null}
          {phone ? (
            <a
              className="underline underline-offset-4"
              href={`tel:${phone.replace(/[^+\d]/g, "")}`}
            >
              {phone}
            </a>
          ) : null}
        </div>
      </div>
      <div className="mt-4 text-xs text-neutral-500">
        © {year} {name || "Artist Name"}
      </div>
    </footer>
  );
}
