export interface Frontmatter {
  title: string;
  description: string;
  category: string;
  order?: number;
  slug?: string;
}

export interface CurriculumPage {
  slug: string;
  title: string;
  description: string;
  category: string;
  order: number;
  sourcePath: string;
  markdown: string;
}

export interface CurriculumCategory {
  name: string;
  pages: CurriculumPage[];
}

export interface CurriculumData {
  categories: CurriculumCategory[];
  pagesBySlug: Map<string, CurriculumPage>;
  firstSlug: string | null;
}
