import { Marked, type Tokens } from "marked";
import DOMPurify from "dompurify";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderCodeBlock({ text, lang }: Tokens.Code): string {
  const language = lang?.trim().split(/\s+/u)[0] ?? "";
  const label = language || "code";
  const lines = text.replace(/\n$/u, "").split(/\r?\n/u);
  const renderedLines = lines
    .map((line, index) => {
      const content = line.length > 0 ? escapeHtml(line) : "&#8203;";

      return [
        '<span class="code-block-line">',
        `<span class="code-block-line-number" aria-hidden="true">${index + 1}</span>`,
        `<span class="code-block-line-code">${content}</span>`,
        "</span>",
      ].join("");
    })
    .join("");

  return [
    `<section class="code-block" data-language="${escapeHtml(label)}">`,
    '<header class="code-block-header">',
    `<span class="code-block-language">${escapeHtml(label)}</span>`,
    '<button class="code-block-copy" type="button">Copy</button>',
    "</header>",
    `<pre class="code-block-pre"><code class="language-${escapeHtml(language)}">${renderedLines}</code></pre>`,
    "</section>",
  ].join("");
}

const marked = new Marked({
  async: true,
  renderer: {
    code(token: Tokens.Code): string {
      return renderCodeBlock(token);
    },
  },
});

export async function renderMarkdown(markdown: string): Promise<string> {
  const html = await marked.parse(markdown);
  return DOMPurify.sanitize(html);
}
