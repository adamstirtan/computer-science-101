<script setup lang="ts">
defineProps<{ sidebarOpen: boolean }>();
const emit = defineEmits<{ toggle: [] }>();
</script>

<template>
  <header class="app-bar">
    <div class="app-bar-left">
      <button
        class="app-bar-hamburger"
        type="button"
        :aria-expanded="sidebarOpen"
        aria-label="Toggle navigation"
        @click="emit('toggle')"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <rect y="2" width="18" height="2" rx="1" fill="currentColor" />
          <rect y="8" width="18" height="2" rx="1" fill="currentColor" />
          <rect y="14" width="18" height="2" rx="1" fill="currentColor" />
        </svg>
      </button>
      <span class="app-bar-title">Computer Science 101</span>
    </div>
    <button class="app-bar-login" type="button">Log in</button>
  </header>
</template>
