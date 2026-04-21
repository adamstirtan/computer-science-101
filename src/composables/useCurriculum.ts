import type {
  CurriculumCategory,
  CurriculumData,
  CurriculumPage,
  Frontmatter,
} from "../types/curriculum";
import { parseFrontmatter } from "../utils/frontmatter";

const markdownModules = import.meta.glob("/src/content/**/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const slugCounts = new Map<string, number>();

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function ensureUniqueSlug(baseSlug: string): string {
  const seenCount = slugCounts.get(baseSlug);
  if (seenCount === undefined) {
    slugCounts.set(baseSlug, 1);
    return baseSlug;
  }

  const nextCount = seenCount + 1;
  slugCounts.set(baseSlug, nextCount);
  return `${baseSlug}-${nextCount}`;
}

function folderFromPath(path: string): string {
  const sections = path.split("/");
  return sections[sections.length - 2] ?? "general";
}

function pathSlug(path: string): string {
  return path
    .replace("/src/content/", "")
    .replace(/\.md$/, "")
    .replace(/\//g, "-");
}

function normalizePage(path: string, fileContents: string): CurriculumPage {
  const parsed = parseFrontmatter(fileContents);
  const frontmatter = parsed.data as Partial<Frontmatter>;
  const fallbackCategory = folderFromPath(path);
  const category = frontmatter.category?.trim() || fallbackCategory;
  const title = frontmatter.title?.trim() || "Untitled Page";
  const description =
    frontmatter.description?.trim() || "No description provided yet.";
  const order = Number.isFinite(frontmatter.order)
    ? Number(frontmatter.order)
    : Number.MAX_SAFE_INTEGER;

  if (!frontmatter.title || !frontmatter.description || !frontmatter.category) {
    console.warn(`[curriculum] Missing frontmatter fields in ${path}`);
  }

  const seed = frontmatter.slug?.trim() || pathSlug(path);
  const slug = ensureUniqueSlug(slugify(seed));

  return {
    slug,
    title,
    description,
    category,
    order,
    sourcePath: path,
    markdown: parsed.content,
  };
}

function buildData(): CurriculumData {
  const pages: CurriculumPage[] = Object.entries(markdownModules)
    .map(([path, content]) => normalizePage(path, content))
    .sort((a, b) => {
      if (a.category === b.category) {
        if (a.order !== b.order) {
          return a.order - b.order;
        }

        return a.title.localeCompare(b.title);
      }

      return a.category.localeCompare(b.category);
    });

  const pagesBySlug = new Map<string, CurriculumPage>();
  for (const page of pages) {
    pagesBySlug.set(page.slug, page);
  }

  const categoryMap = new Map<string, CurriculumPage[]>();
  for (const page of pages) {
    const existing = categoryMap.get(page.category);
    if (existing) {
      existing.push(page);
      continue;
    }

    categoryMap.set(page.category, [page]);
  }

  const categories: CurriculumCategory[] = Array.from(
    categoryMap.entries(),
  ).map(([name, categoryPages]) => ({
    name,
    pages: categoryPages,
  }));

  return {
    categories,
    pagesBySlug,
    firstSlug: pages[0]?.slug ?? null,
  };
}

const curriculumData = buildData();

export function useCurriculum(): CurriculumData {
  return curriculumData;
}
