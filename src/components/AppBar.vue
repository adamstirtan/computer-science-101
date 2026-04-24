<script setup lang="ts">
import type { User } from "@supabase/supabase-js";
import { useRouter } from "vue-router";

defineProps<{ sidebarOpen: boolean; user: User | null; totalXp: number }>();
const emit = defineEmits<{ toggle: []; signOut: [] }>();

const router = useRouter();
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
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          aria-hidden="true"
        >
          <rect y="2" width="18" height="2" rx="1" fill="currentColor" />
          <rect y="8" width="18" height="2" rx="1" fill="currentColor" />
          <rect y="14" width="18" height="2" rx="1" fill="currentColor" />
        </svg>
      </button>
      <span class="app-bar-title">Computer Science 101</span>
    </div>

    <div class="app-bar-right">
      <template v-if="user">
        <RouterLink
          class="app-bar-profile-link"
          to="/profile"
          :title="`${user.user_metadata?.user_name ?? user.email}'s profile`"
        >
          <img
            v-if="user.user_metadata?.avatar_url"
            class="app-bar-avatar"
            :src="user.user_metadata.avatar_url"
            :alt="user.user_metadata?.user_name ?? 'User avatar'"
            width="28"
            height="28"
            referrerpolicy="no-referrer"
          />
          <span class="app-bar-username">{{
            user.user_metadata?.user_name ?? user.email
          }}</span>
        </RouterLink>
        <span class="app-bar-xp" title="Total XP earned">{{ totalXp }} XP</span>
        <button class="app-bar-login" type="button" @click="emit('signOut')">
          Log out
        </button>
      </template>
      <template v-else>
        <button
          class="app-bar-login"
          type="button"
          @click="router.push('/login')"
        >
          Log in
        </button>
      </template>
    </div>
  </header>
</template>

<style scoped>
.app-bar-right {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.app-bar-profile-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  border-radius: 6px;
  padding: 0.2rem 0.4rem;
  transition: background 120ms ease;
}

.app-bar-profile-link:hover {
  background: var(--panel-hover, rgba(255, 255, 255, 0.06));
}

.app-bar-avatar {
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.app-bar-username {
  font-size: 0.85rem;
  color: var(--color-text-muted, #888);
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.app-bar-xp {
  font-size: 0.78rem;
  font-weight: 600;
  padding: 0.18rem 0.55rem;
  border-radius: 999px;
  background: color-mix(in srgb, #facc15 15%, transparent);
  color: #facc15;
  white-space: nowrap;
}
</style>
