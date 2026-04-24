export interface Question {
  id: string;
  prompt: string;
  options: string[];
  answer: number; // zero-based index of the correct option
}

export interface Frontmatter {
  title: string;
  description: string;
  category: string;
  order?: number;
  slug?: string;
  xp?: number;
  questions?: Question[];
}

export interface CurriculumPage {
  slug: string;
  title: string;
  description: string;
  category: string;
  order: number;
  sourcePath: string;
  markdown: string;
  xp: number;
  questions: Question[];
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
