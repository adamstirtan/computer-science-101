<script setup lang="ts">
import type { CurriculumPage } from "../types/curriculum";

defineProps<{
  page: CurriculumPage | null;
  html: string;
}>();
</script>

<template>
  <main class="content" v-if="page">
    <h1>{{ page.title }}</h1>
    <p class="description">{{ page.description }}</p>
    <article class="markdown" v-html="html" />
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
