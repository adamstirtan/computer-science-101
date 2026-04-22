<script setup lang="ts">
import type { CurriculumCategory } from "../types/curriculum";

defineProps<{
  categories: CurriculumCategory[];
}>();
</script>

<template>
  <aside class="sidebar">
    <section
      v-for="category in categories"
      :key="category.name"
      class="category"
    >
      <h2>{{ category.name }}</h2>
      <RouterLink
        v-for="page in category.pages"
        :key="page.slug"
        class="page-link"
        :to="`/${page.slug}`"
      >
        <span class="page-link-title">{{ page.title }}</span>
        <span class="page-link-description">{{ page.description }}</span>
      </RouterLink>
    </section>
  </aside>
</template>
