<script setup lang="ts">
import type { CurriculumPage } from "../types/curriculum";

defineProps<{
  page: CurriculumPage | null;
  html: string;
  isLoggedIn: boolean;
  isCompleted: boolean;
}>();

const emit = defineEmits<{ markComplete: []; openQuiz: [] }>();

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

    <div class="completion-bar">
      <span v-if="isCompleted" class="completion-badge">
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M2 7l3.5 3.5L12 4"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        Completed
        <span v-if="page && page.xp > 0" class="completion-xp"
          >+{{ page.xp }} XP</span
        >
      </span>
      <template v-else-if="isLoggedIn">
        <button
          v-if="page && page.questions.length > 0"
          class="completion-btn completion-btn--quiz"
          type="button"
          @click="emit('openQuiz')"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
          >
            <circle
              cx="7"
              cy="7"
              r="6"
              stroke="currentColor"
              stroke-width="1.5"
            />
            <path
              d="M7 4v4M7 9.5v.5"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>
          Take quiz · +{{ page?.xp ?? 0 }} XP
        </button>
        <button
          v-else
          class="completion-btn"
          type="button"
          @click="emit('markComplete')"
        >
          Mark as complete
        </button>
      </template>
    </div>
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

<style scoped>
.completion-bar {
  display: flex;
  justify-content: flex-end;
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border, #2a2a2a);
}

.completion-btn {
  padding: 0.5rem 1.1rem;
  border: 1px solid var(--color-border, #2a2a2a);
  border-radius: 8px;
  background: transparent;
  color: var(--color-text, #e8e8e8);
  font-size: 0.875rem;
  cursor: pointer;
  transition:
    background 0.15s,
    border-color 0.15s;
}

.completion-btn:hover {
  background: var(--color-surface, #1a1a1a);
  border-color: var(--color-text-muted, #888);
}

.completion-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.9rem;
  border-radius: 8px;
  background: color-mix(in srgb, #4ade80 15%, transparent);
  color: #4ade80;
  font-size: 0.875rem;
  font-weight: 500;
}

.completion-xp {
  font-size: 0.78rem;
  opacity: 0.8;
}

.completion-btn--quiz {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  border-color: #facc15;
  color: #facc15;
}

.completion-btn--quiz:hover {
  background: color-mix(in srgb, #facc15 10%, transparent);
  border-color: #facc15;
}
</style>
