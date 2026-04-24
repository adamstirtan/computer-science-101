<script setup lang="ts">
import { computed, ref } from "vue";
import type { Question } from "../types/curriculum";

const props = defineProps<{
  questions: Question[];
  xp: number;
  articleSlug: string;
}>();

const emit = defineEmits<{
  close: [];
  passed: [answers: Array<{ questionId: string; correct: boolean }>];
}>();

// One selected option index per question (null = unanswered)
const selected = ref<(number | null)[]>(props.questions.map(() => null));
const submitted = ref(false);

const results = computed(() =>
  props.questions.map((q, i) => ({
    questionId: q.id,
    correct: selected.value[i] === q.answer,
  })),
);

const allAnswered = computed(() => selected.value.every((s) => s !== null));

const score = computed(() => results.value.filter((r) => r.correct).length);

const passed = computed(() => score.value === props.questions.length);

function submit(): void {
  if (!allAnswered.value) return;
  submitted.value = true;
}

function handleDone(): void {
  if (passed.value) {
    emit("passed", results.value);
  } else {
    emit("close");
  }
}

function optionClass(qIndex: number, oIndex: number): string {
  if (!submitted.value) {
    return selected.value[qIndex] === oIndex ? "option--selected" : "";
  }

  const q = props.questions[qIndex];
  if (oIndex === q.answer) return "option--correct";
  if (selected.value[qIndex] === oIndex) return "option--wrong";
  return "";
}
</script>

<template>
  <div
    class="quiz-backdrop"
    role="dialog"
    aria-modal="true"
    aria-label="Article quiz"
    @click.self="!submitted && emit('close')"
  >
    <div class="quiz-modal">
      <header class="quiz-header">
        <h2 class="quiz-title">Quick check</h2>
        <span class="quiz-xp-badge">+{{ xp }} XP</span>
        <button
          class="quiz-close"
          type="button"
          aria-label="Close quiz"
          @click="emit('close')"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M2 2l12 12M14 2L2 14"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </button>
      </header>

      <p class="quiz-intro">
        Answer all {{ questions.length }} question{{
          questions.length === 1 ? "" : "s"
        }}
        correctly to earn your XP.
      </p>

      <ol class="quiz-questions">
        <li v-for="(q, qi) in questions" :key="q.id" class="quiz-question">
          <p class="quiz-prompt">{{ qi + 1 }}. {{ q.prompt }}</p>
          <ul class="quiz-options" role="radiogroup" :aria-label="q.prompt">
            <li
              v-for="(option, oi) in q.options"
              :key="oi"
              class="quiz-option"
              :class="optionClass(qi, oi)"
            >
              <label class="quiz-option-label">
                <input
                  type="radio"
                  :name="`q-${q.id}`"
                  :value="oi"
                  :disabled="submitted"
                  v-model="selected[qi]"
                  class="quiz-option-input"
                />
                <span class="quiz-option-text">{{ option }}</span>
              </label>
            </li>
          </ul>
        </li>
      </ol>

      <!-- Pre-submit -->
      <div v-if="!submitted" class="quiz-footer">
        <button
          class="quiz-submit-btn"
          type="button"
          :disabled="!allAnswered"
          @click="submit"
        >
          Submit answers
        </button>
      </div>

      <!-- Post-submit result -->
      <div
        v-else
        class="quiz-result"
        :class="passed ? 'quiz-result--pass' : 'quiz-result--fail'"
      >
        <template v-if="passed">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M3 10l5 5 9-9"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span
            >{{ score }}/{{ questions.length }} correct — +{{ xp }} XP
            earned!</span
          >
        </template>
        <template v-else>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M5 5l10 10M15 5L5 15"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
            />
          </svg>
          <span
            >{{ score }}/{{ questions.length }} correct — review the article and
            try again.</span
          >
        </template>
        <button class="quiz-done-btn" type="button" @click="handleDone">
          {{ passed ? "Collect XP" : "Close" }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.quiz-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 1rem;
}

.quiz-modal {
  background: var(--color-surface, #1a1a1a);
  border: 1px solid var(--color-border, #2a2a2a);
  border-radius: 12px;
  padding: 1.75rem 1.5rem 1.5rem;
  width: 100%;
  max-width: 560px;
  max-height: 90dvh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.quiz-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.quiz-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-text, #e8e8e8);
  flex: 1;
}

.quiz-xp-badge {
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  background: color-mix(in srgb, #facc15 15%, transparent);
  color: #facc15;
}

.quiz-close {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.3rem;
  background: transparent;
  border: none;
  color: var(--color-text-muted, #888);
  cursor: pointer;
  border-radius: 6px;
  transition: color 0.15s;
}

.quiz-close:hover {
  color: var(--color-text, #e8e8e8);
}

.quiz-intro {
  margin: 0;
  font-size: 0.875rem;
  color: var(--color-text-muted, #888);
}

.quiz-questions {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.quiz-prompt {
  margin: 0 0 0.75rem;
  font-size: 0.925rem;
  font-weight: 500;
  color: var(--color-text, #e8e8e8);
  line-height: 1.5;
}

.quiz-options {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.quiz-option {
  border: 1px solid var(--color-border, #2a2a2a);
  border-radius: 8px;
  transition:
    border-color 0.15s,
    background 0.15s;
}

.quiz-option:has(.quiz-option-input:checked):not(.option--correct):not(
    .option--wrong
  ) {
  border-color: var(--color-text-muted, #888);
}

.option--selected {
  border-color: var(--color-text-muted, #888);
}

.option--correct {
  border-color: #4ade80;
  background: color-mix(in srgb, #4ade80 10%, transparent);
}

.option--wrong {
  border-color: #f87171;
  background: color-mix(in srgb, #f87171 10%, transparent);
}

.quiz-option-label {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.6rem 0.85rem;
  cursor: pointer;
  width: 100%;
}

.quiz-option-input {
  flex-shrink: 0;
  accent-color: var(--color-text, #e8e8e8);
}

.quiz-option-text {
  font-size: 0.875rem;
  color: var(--color-text, #e8e8e8);
  line-height: 1.45;
}

.quiz-footer {
  display: flex;
  justify-content: flex-end;
}

.quiz-submit-btn {
  padding: 0.55rem 1.25rem;
  border: none;
  border-radius: 8px;
  background: var(--color-text, #e8e8e8);
  color: var(--color-bg, #0f0f0f);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
}

.quiz-submit-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.quiz-submit-btn:not(:disabled):hover {
  opacity: 0.85;
}

.quiz-result {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  flex-wrap: wrap;
}

.quiz-result--pass {
  background: color-mix(in srgb, #4ade80 12%, transparent);
  color: #4ade80;
  border: 1px solid color-mix(in srgb, #4ade80 30%, transparent);
}

.quiz-result--fail {
  background: color-mix(in srgb, #f87171 12%, transparent);
  color: #f87171;
  border: 1px solid color-mix(in srgb, #f87171 30%, transparent);
}

.quiz-result svg {
  flex-shrink: 0;
}

.quiz-result span {
  flex: 1;
}

.quiz-done-btn {
  padding: 0.35rem 0.85rem;
  border-radius: 6px;
  border: 1px solid currentColor;
  background: transparent;
  color: inherit;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
}

.quiz-done-btn:hover {
  opacity: 0.75;
}
</style>
