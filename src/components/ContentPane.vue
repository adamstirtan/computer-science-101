<script setup lang="ts">
import type { CurriculumPage } from "../types/curriculum";

defineProps<{
  page: CurriculumPage | null;
  html: string;
}>();

async function writeToClipboard(text: string): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.append(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

function getCodeText(block: HTMLElement): string {
  return Array.from(
    block.querySelectorAll<HTMLElement>(".code-block-line-code"),
  )
    .map((line) =>
      line.textContent === "\u200B" ? "" : (line.textContent ?? ""),
    )
    .join("\n");
}

function resetCopyState(button: HTMLButtonElement): void {
  button.textContent = "Copy";
  button.dataset.state = "idle";
}

async function handleArticleClick(event: Event): Promise<void> {
  const target = event.target;

  if (!(target instanceof Element)) {
    return;
  }

  const button = target.closest<HTMLButtonElement>(".code-block-copy");

  if (!button) {
    return;
  }

  const block = button.closest<HTMLElement>(".code-block");

  if (!block) {
    return;
  }

  button.disabled = true;

  try {
    await writeToClipboard(getCodeText(block));
    button.textContent = "Copied";
    button.dataset.state = "copied";
    window.setTimeout(() => resetCopyState(button), 1800);
  } catch {
    button.textContent = "Failed";
    button.dataset.state = "error";
    window.setTimeout(() => resetCopyState(button), 1800);
  } finally {
    button.disabled = false;
  }
}
</script>

<template>
  <main class="content" v-if="page">
    <h1>{{ page.title }}</h1>
    <p class="description">{{ page.description }}</p>
    <article class="markdown" v-html="html" @click="handleArticleClick" />
  </main>

  <main class="content" v-else>
    <div class="empty-state">
      <h1>Select a page</h1>
      <p class="description">
        Add markdown files in src/content and they will appear in navigation
        automatically.
      </p>
    </div>
  </main>
</template>
