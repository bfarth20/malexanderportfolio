import { getSiteKV } from "@/lib/notion";

export const revalidate = 600;

export default async function ContactPage() {
  const kv = await getSiteKV();
  const email = kv["contact_email"] || "example@example.com";
  const instagram = kv["social_instagram"];
  const artsy = kv["artsy_website"];
  const contactMessage =
    kv["contact_message"] ||
    "Monica is currently accepting new commercial clients... (add this in Notion: contact_message)";

  const subject = "Project inquiry: [Illustration/Mural/Gallery]";
  const body = `Hi Monica,

I'm reaching out about a new [illustration/mural/gallery] project.

• Company/Name:
• Project scope (1–2 sentences):
• Deliverables:
• Timeline:
• Budget range:
• Best times for a 15-minute Zoom: [Mon–Fri 6–8pm ET / weekends by request]

Thanks!`;
  const mailtoHref = `mailto:${email}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;

  return (
    <div className="mx-auto max-w-3xl px-4 space-y-8">
      <header>
        <h2 className="text-2xl font-semibold">Contact</h2>
        <p className="mt-4 whitespace-pre-wrap leading-relaxed text-neutral-800">
          {contactMessage}
        </p>
      </header>

      <div className="flex flex-wrap gap-3">
        <a
          href={mailtoHref}
          className="inline-flex items-center rounded-full border border-neutral-300 px-4 py-2 font-medium hover:border-neutral-400 hover:bg-neutral-50"
        >
          Email Monica
        </a>

        {instagram && (
          <a
            href={instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full border border-neutral-300 px-4 py-2 font-medium hover:border-neutral-400 hover:bg-neutral-50"
          >
            Instagram
          </a>
        )}

        {artsy && (
          <a
            href={artsy}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full border border-neutral-300 px-4 py-2 font-medium hover:border-neutral-400 hover:bg-neutral-50"
          >
            Buy available works
          </a>
        )}
      </div>
    </div>
  );
}
