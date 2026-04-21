<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import type { CurriculumCategory } from "../types/curriculum";

defineProps<{
  categories: CurriculumCategory[];
}>();

const isOpen = ref(false);
const route = useRoute();

watch(
  () => route.path,
  () => {
    isOpen.value = false;
  },
);

function toggle() {
  isOpen.value = !isOpen.value;
}
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <h1>Computer Science 101</h1>
      <p class="subtitle">An open curriculum for math &amp; CS</p>
      <button
        class="mobile-menu-btn"
        type="button"
        :aria-expanded="isOpen"
        aria-controls="sidebar-nav"
        @click="toggle"
      >
        <svg
          v-if="!isOpen"
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          aria-hidden="true"
        >
          <path d="M1 3.5h13M1 7.5h13M1 11.5h13" />
        </svg>
        <svg
          v-else
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          aria-hidden="true"
        >
          <path d="M2 2l11 11M13 2L2 13" />
        </svg>
        {{ isOpen ? "Close" : "Browse Topics" }}
      </button>
    </div>

    <nav id="sidebar-nav" class="sidebar-nav" :class="{ open: isOpen }">
      <div
        v-for="category in categories"
        :key="category.name"
        class="category"
      >
        <h2 class="category-heading">{{ category.name }}</h2>
        <RouterLink
          v-for="page in category.pages"
          :key="page.slug"
          class="page-link"
          :to="`/${page.slug}`"
        >
          <span class="page-link-title">{{ page.title }}</span>
        </RouterLink>
      </div>
    </nav>
  </aside>
</template>
