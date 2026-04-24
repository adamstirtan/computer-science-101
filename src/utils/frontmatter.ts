import type { Frontmatter, Question } from "../types/curriculum";

export interface ParsedFrontmatter {
  data: Partial<Frontmatter>;
  content: string;
}

/**
 * Parses the YAML frontmatter block from a markdown file.
 * Handles scalar fields, `xp` (number), and the nested `questions` array.
 */
export function parseFrontmatter(fileContents: string): ParsedFrontmatter {
  if (!fileContents.startsWith("---\n")) {
    return { data: {}, content: fileContents.trim() };
  }

  const endFence = fileContents.indexOf("\n---\n", 4);
  if (endFence === -1) {
    return { data: {}, content: fileContents.trim() };
  }

  const rawFrontmatter = fileContents.slice(4, endFence);
  const body = fileContents.slice(endFence + 5).trim();
  const data = parseYamlBlock(rawFrontmatter);

  return { data, content: body };
}

// ---------------------------------------------------------------------------
// Minimal YAML parser — handles scalar key:value pairs and the questions block
// ---------------------------------------------------------------------------

function unquote(value: string): string {
  return value.replace(/^['"]|['"]$/g, "").trim();
}

function parseYamlBlock(raw: string): Partial<Frontmatter> {
  const lines = raw.split("\n");
  const data: Partial<Frontmatter> = {};

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      i++;
      continue;
    }

    const colonIdx = trimmed.indexOf(":");
    if (colonIdx === -1) {
      i++;
      continue;
    }

    const key = trimmed.slice(0, colonIdx).trim();
    const rest = trimmed.slice(colonIdx + 1).trim();

    if (key === "questions") {
      // Consume the indented questions block that follows
      const { questions, nextIndex } = parseQuestionsBlock(lines, i + 1);
      data.questions = questions;
      i = nextIndex;
      continue;
    }

    if (key === "order" || key === "xp") {
      const num = Number(unquote(rest));
      if (Number.isFinite(num)) {
        (data as Record<string, unknown>)[key] = num;
      }
    } else if (rest.length > 0) {
      (data as Record<string, unknown>)[key] = unquote(rest);
    }

    i++;
  }

  return data;
}

interface QuestionsParseResult {
  questions: Question[];
  nextIndex: number;
}

function parseQuestionsBlock(
  lines: string[],
  startIndex: number,
): QuestionsParseResult {
  const questions: Question[] = [];
  let i = startIndex;

  let current: Partial<Question> & { options?: string[] } = {};

  while (i < lines.length) {
    const line = lines[i];
    // A top-level key (no leading spaces) signals the end of the questions block
    if (
      line.length > 0 &&
      line[0] !== " " &&
      line[0] !== "\t" &&
      !line.trimStart().startsWith("-")
    ) {
      break;
    }

    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      i++;
      continue;
    }

    // New question entry: "  - id: q1"
    if (trimmed.startsWith("- ")) {
      if (current.id !== undefined) {
        questions.push(normalizeQuestion(current));
      }
      current = {};

      const inner = trimmed.slice(2).trim(); // strip leading "- "
      const colonIdx = inner.indexOf(":");
      if (colonIdx !== -1) {
        const k = inner.slice(0, colonIdx).trim();
        const v = inner.slice(colonIdx + 1).trim();
        applyQuestionField(current, k, v);
      }

      i++;
      continue;
    }

    // options list item: "    - \"O(n)\""
    if (trimmed.startsWith("- ") && current.options !== undefined) {
      current.options.push(unquote(trimmed.slice(2)));
      i++;
      continue;
    }

    // Regular key: value inside a question block
    const colonIdx = trimmed.indexOf(":");
    if (colonIdx !== -1) {
      const k = trimmed.slice(0, colonIdx).trim();
      const v = trimmed.slice(colonIdx + 1).trim();

      if (k === "options") {
        current.options = [];
        i++;
        // Consume the options list
        while (i < lines.length) {
          const optLine = lines[i].trim();
          if (!optLine.startsWith("- ")) break;
          current.options.push(unquote(optLine.slice(2)));
          i++;
        }
        continue;
      }

      applyQuestionField(current, k, v);
    }

    i++;
  }

  if (current.id !== undefined) {
    questions.push(normalizeQuestion(current));
  }

  return { questions, nextIndex: i };
}

function applyQuestionField(
  q: Partial<Question> & { options?: string[] },
  key: string,
  value: string,
): void {
  if (key === "id" || key === "prompt") {
    (q as Record<string, unknown>)[key] = unquote(value);
  } else if (key === "answer") {
    const num = Number(value);
    if (Number.isFinite(num)) q.answer = num;
  } else if (key === "options") {
    q.options = [];
  }
}

function normalizeQuestion(
  q: Partial<Question> & { options?: string[] },
): Question {
  return {
    id: q.id ?? "",
    prompt: q.prompt ?? "",
    options: q.options ?? [],
    answer: q.answer ?? 0,
  };
}
