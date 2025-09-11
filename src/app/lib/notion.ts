import { Client } from "@notionhq/client";
import type { SiteKV, Work } from "../../lib/types";

/* ---------- Env & client ---------- */
const token = process.env.NOTION_TOKEN;
const siteDbId = process.env.NOTION_SITE_KV_DB_ID ?? "";
const worksDbId = process.env.NOTION_WORKS_DB_ID ?? "";
const siteDsIdEnv = process.env.NOTION_SITE_KV_DATA_SOURCE_ID ?? "";
const worksDsIdEnv = process.env.NOTION_WORKS_DATA_SOURCE_ID ?? "";

if (!token) {
  throw new Error("Missing NOTION_TOKEN in environment");
}
const notion = new Client({ auth: token });

/* ---------- Minimal Notion types (only what we read) ---------- */
type RichText = ReadonlyArray<{ plain_text?: string }>;

type FileObj =
  | { type: "file"; file?: { url?: string | null } }
  | { type: "external"; external?: { url?: string | null } };

type TitleProp = { title: RichText };
type RichTextProp = { rich_text: RichText };
type NumberProp = { number: number | null };
type SelectProp = { select: { name: string } | null };
type CheckboxProp = { checkbox: boolean };
type FilesProp = { files: ReadonlyArray<FileObj> };
type MultiSelectProp = { multi_select: ReadonlyArray<{ name: string }> };

type SiteKVProperties = {
  Name?: TitleProp;
  Value?: RichTextProp;
};

type WorkProperties = {
  Name?: TitleProp;
  Slug?: RichTextProp;
  Year?: NumberProp;
  Role?: SelectProp;
  Featured?: CheckboxProp;
  Thumbnail?: FilesProp;
  Images?: FilesProp;
  Description?: RichTextProp;
  Tags?: MultiSelectProp;
};

type Page<P extends object = object> = {
  id: string;
  properties: P;
};

type DataSourcesQueryResponse<P extends object> = {
  results?: ReadonlyArray<Page<P>>;
};

type DatabaseRetrieveResponse = {
  data_sources?: ReadonlyArray<{ id: string }>;
};

/* ---------- Small helpers ---------- */
function rt(arr?: RichText): string {
  return (arr ?? []).map((t) => t?.plain_text ?? "").join("");
}

function fileUrl(file?: FileObj): string | null {
  if (!file) return null;
  if (file.type === "file") return file.file?.url ?? null;
  if (file.type === "external") return file.external?.url ?? null;
  return null;
}

/** Resolve a v5 data source id from either an explicit DS id or a DB id */
async function resolveDataSourceId(
  dsId: string,
  dbId: string
): Promise<string> {
  if (dsId) return dsId;
  if (!dbId) throw new Error("No data source or database id provided");
  const db = (await notion.databases.retrieve({
    database_id: dbId,
  })) as unknown as DatabaseRetrieveResponse;
  const first = db.data_sources?.[0]?.id;
  if (!first) throw new Error("No data sources found on this database");
  return first;
}

/* ---------- Public API ---------- */
export async function getSiteKV(): Promise<SiteKV> {
  const data_source_id = await resolveDataSourceId(siteDsIdEnv, siteDbId);
  const resp = (await notion.dataSources.query({
    data_source_id,
    page_size: 100,
  })) as unknown as DataSourcesQueryResponse<SiteKVProperties>;

  const kv: SiteKV = {};
  for (const page of resp.results ?? []) {
    const p = page.properties;
    const key = rt(p?.Name?.title) || page.id;
    const val = rt(p?.Value?.rich_text);
    kv[key] = val;
  }
  return kv;
}

export async function getWorks(
  opts: { featuredOnly?: boolean } = {}
): Promise<Work[]> {
  const { featuredOnly = false } = opts;
  const data_source_id = await resolveDataSourceId(worksDsIdEnv, worksDbId);

  const resp = (await notion.dataSources.query({
    data_source_id,
    filter: featuredOnly
      ? { property: "Featured", checkbox: { equals: true } }
      : undefined,
    sorts: [{ property: "Year", direction: "descending" }],
    page_size: 100,
  })) as unknown as DataSourcesQueryResponse<WorkProperties>;

  const items: Work[] = [];
  for (const page of resp.results ?? []) {
    const p = page.properties;
    const thumb = p?.Thumbnail?.files?.[0];
    const images =
      p?.Images?.files?.map((f) => fileUrl(f)).filter(Boolean) ?? [];

    items.push({
      id: page.id,
      title: rt(p?.Name?.title) || "Untitled",
      slug: rt(p?.Slug?.rich_text) || page.id,
      year: p?.Year?.number ?? null,
      role: p?.Role?.select?.name ?? null,
      featured: p?.Featured?.checkbox ?? false,
      thumbnailUrl: fileUrl(thumb),
      images: images as string[],
      description: rt(p?.Description?.rich_text) || null,
      tags: (p?.Tags?.multi_select ?? []).map((t) => t.name),
    });
  }
  return items;
}
