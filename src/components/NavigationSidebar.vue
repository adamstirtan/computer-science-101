<script setup lang="ts">
import type { CurriculumCategory } from "../types/curriculum";

defineProps<{
  categories: CurriculumCategory[];
  completedSlugs: Set<string>;
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
        :class="{ 'page-link--completed': completedSlugs.has(page.slug) }"
        :to="`/${page.slug}`"
      >
        <span class="page-link-title">
          {{ page.title }}
          <svg
            v-if="completedSlugs.has(page.slug)"
            class="page-link-check"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            aria-label="Completed"
          >
            <path
              d="M1.5 6l3 3 6-6"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
        <span class="page-link-description">{{ page.description }}</span>
      </RouterLink>
    </section>
  </aside>
</template>

<style scoped>
.page-link--completed .page-link-title {
  color: #4ade80;
}

.page-link-check {
  display: inline-block;
  vertical-align: middle;
  margin-left: 0.3rem;
  color: #4ade80;
  flex-shrink: 0;
}
</style>
