import Link from "next/link";
import { getSiteKV } from "@/lib/notion";

export const revalidate = 600;

export default async function ContactPage() {
  const kv = await getSiteKV();
  const email = kv["contact_email"] || "example@example.com";
  const ig = kv["social_instagram"];
  const tw = kv["social_twitter"];
  const site = kv["social_website"];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Contact Me</h2>
      <p>
        Email:{" "}
        <a
          href={`mailto:${email}`}
          className="font-medium no-underline hover:underline"
        >
          {email}
        </a>
      </p>
      <ul className="space-y-2">
        {ig ? (
          <li>
            Instagram:{" "}
            <Link href={ig} className="no-underline hover:underline">
              {ig}
            </Link>
          </li>
        ) : null}
        {tw ? (
          <li>
            Twitter/X:{" "}
            <Link href={tw} className="no-underline hover:underline">
              {tw}
            </Link>
          </li>
        ) : null}
        {site ? (
          <li>
            Website:{" "}
            <Link href={site} className="no-underline hover:underline">
              {site}
            </Link>
          </li>
        ) : null}
      </ul>
      <p className="text-sm text-neutral-500">
        We can add a full contact form later—this keeps hosting at $0.
      </p>
    </div>
  );
}
