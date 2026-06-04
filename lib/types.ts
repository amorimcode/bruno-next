export type Project = {
  slug: string;
  title: string;
  description: string;
  period: string;
  company?: string;
  image: string;
  href?: string;
  tags: string[];
  featured?: boolean;
};
