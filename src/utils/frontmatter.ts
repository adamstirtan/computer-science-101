import type { Frontmatter } from "../types/curriculum";

export interface ParsedFrontmatter {
  data: Partial<Frontmatter>;
  content: string;
}

function coerceValue(key: string, value: string): string | number {
  if (key === "order") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return value;
}

export function parseFrontmatter(fileContents: string): ParsedFrontmatter {
  if (!fileContents.startsWith("---\n")) {
    return {
      data: {},
      content: fileContents.trim(),
    };
  }

  const endFence = fileContents.indexOf("\n---\n", 4);
  if (endFence === -1) {
    return {
      data: {},
      content: fileContents.trim(),
    };
  }

  const rawFrontmatter = fileContents.slice(4, endFence);
  const body = fileContents.slice(endFence + 5).trim();

  const data: Partial<Frontmatter> = {};
  const lines = rawFrontmatter.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf(":");
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim() as keyof Frontmatter;
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^['\"]|['\"]$/g, "");

    data[key] = coerceValue(key, value) as never;
  }

  return {
    data,
    content: body,
  };
}
