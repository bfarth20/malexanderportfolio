export type SiteKV = Record<string, string>;
export type Work = {
  id: string;
  title: string;
  slug: string;
  year?: number | null;
  role?: string | null;
  thumbnailUrl?: string | null;
  description?: string | null;
  featured?: boolean;
  images?: string[];
  tags?: string[];
};
