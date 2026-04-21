<script setup lang="ts">
import type { CurriculumPage } from "../types/curriculum";

defineProps<{
  page: CurriculumPage | null;
  html: string;
}>();
</script>

<template>
  <main class="content" v-if="page">
    <div class="content-inner">
      <header class="content-header">
        <h1>{{ page.title }}</h1>
        <p class="description">{{ page.description }}</p>
      </header>
      <hr class="content-divider" />
      <article class="markdown" v-html="html" />
    </div>
  </main>

  <main class="content" v-else>
    <div class="content-inner">
      <div class="empty-state">
        <h1>Welcome</h1>
        <p>Select a topic from the sidebar to start learning.</p>
      </div>
    </div>
  </main>
</template>
