<script setup lang="ts">
import { computed, watchEffect } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../composables/useAuth";
import { useCurriculum } from "../composables/useCurriculum";
import { useProgress } from "../composables/useProgress";
import { useXp } from "../composables/useXp";

const router = useRouter();
const { user, loading, signOut } = useAuth();
const { totalXp } = useXp();
const { completedSlugs } = useProgress();
const curriculum = useCurriculum();

watchEffect(() => {
  if (!loading.value && !user.value) {
    void router.replace("/login");
  }
});

const displayName = computed(
  () =>
    user.value?.user_metadata?.full_name ??
    user.value?.user_metadata?.user_name ??
    user.value?.email ??
    "Unknown",
);

const username = computed(() => user.value?.user_metadata?.user_name ?? null);

const avatarUrl = computed(() => user.value?.user_metadata?.avatar_url ?? null);

const email = computed(() => user.value?.email ?? null);

const joinedAt = computed(() => {
  const raw = user.value?.created_at;
  if (!raw) return null;
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(raw));
});

const totalArticles = computed(() => {
  return curriculum.categories.reduce((sum, cat) => sum + cat.pages.length, 0);
});

const completedPages = computed(() => {
  const pages: Array<{ title: string; category: string; slug: string }> = [];
  for (const cat of curriculum.categories) {
    for (const page of cat.pages) {
      if (completedSlugs.value.has(page.slug)) {
        pages.push({ title: page.title, category: cat.name, slug: page.slug });
      }
    }
  }
  return pages;
});

const completionPercent = computed(() => {
  if (totalArticles.value === 0) return 0;
  return Math.round((completedPages.value.length / totalArticles.value) * 100);
});

async function handleSignOut(): Promise<void> {
  await signOut();
  void router.replace("/");
}
</script>

<template>
  <div v-if="user" class="profile-page">
    <!-- Header card -->
    <div class="profile-header">
      <img
        v-if="avatarUrl"
        class="profile-avatar"
        :src="avatarUrl"
        :alt="displayName"
        referrerpolicy="no-referrer"
      />
      <div class="profile-identity">
        <h1 class="profile-name">{{ displayName }}</h1>
        <span v-if="username" class="profile-username">@{{ username }}</span>
        <span v-if="email" class="profile-email">{{ email }}</span>
        <span v-if="joinedAt" class="profile-joined"
          >Member since {{ joinedAt }}</span
        >
      </div>
    </div>

    <!-- Stats row -->
    <div class="profile-stats">
      <div class="stat-card">
        <span class="stat-value stat-value--xp">{{ totalXp }}</span>
        <span class="stat-label">XP earned</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">{{ completedPages.length }}</span>
        <span class="stat-label">Articles completed</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">{{ totalArticles }}</span>
        <span class="stat-label">Total articles</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">{{ completionPercent }}%</span>
        <span class="stat-label">Progress</span>
      </div>
    </div>

    <!-- Progress bar -->
    <div class="profile-section">
      <h2 class="section-title">Curriculum progress</h2>
      <div
        class="progress-track"
        role="progressbar"
        :aria-valuenow="completionPercent"
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div
          class="progress-fill"
          :style="{ width: `${completionPercent}%` }"
        />
      </div>
      <p class="progress-label">
        {{ completedPages.length }} of {{ totalArticles }} articles completed
      </p>
    </div>

    <!-- Completed articles list -->
    <div class="profile-section" v-if="completedPages.length > 0">
      <h2 class="section-title">Completed articles</h2>
      <ul class="completed-list">
        <li
          v-for="page in completedPages"
          :key="page.slug"
          class="completed-item"
        >
          <RouterLink :to="`/${page.slug}`" class="completed-link">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
              class="completed-check"
            >
              <path
                d="M2 7l3.5 3.5L12 4"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span class="completed-title">{{ page.title }}</span>
            <span class="completed-category">{{ page.category }}</span>
          </RouterLink>
        </li>
      </ul>
    </div>

    <div class="profile-section" v-else>
      <h2 class="section-title">Completed articles</h2>
      <p class="profile-empty">
        No articles completed yet. Head back to the
        <RouterLink to="/">curriculum</RouterLink> to get started.
      </p>
    </div>

    <!-- Actions -->
    <div class="profile-actions">
      <RouterLink to="/" class="profile-back-btn"
        >← Back to curriculum</RouterLink
      >
      <button class="profile-signout-btn" type="button" @click="handleSignOut">
        Sign out
      </button>
    </div>
  </div>
  <div v-else-if="loading" class="profile-loading">Loading profile…</div>
</template>

<style scoped>
.profile-loading {
  max-width: 720px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
  color: var(--muted, #858585);
}

.profile-page {
  max-width: 720px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem 4rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* ── Header ── */

.profile-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.75rem;
  background: var(--panel, #252526);
  border: 1px solid var(--line, #3e3e42);
  border-radius: 12px;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  border: 2px solid var(--line, #3e3e42);
}

.profile-identity {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
}

.profile-name {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--ink, #d4d4d4);
}

.profile-username,
.profile-email,
.profile-joined {
  font-size: 0.875rem;
  color: var(--muted, #858585);
}

/* ── Stats ── */

.profile-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 1rem;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  padding: 1.25rem 1rem;
  background: var(--panel, #252526);
  border: 1px solid var(--line, #3e3e42);
  border-radius: 10px;
  text-align: center;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--ink, #d4d4d4);
  line-height: 1;
}

.stat-value--xp {
  color: #facc15;
}

.stat-label {
  font-size: 0.78rem;
  color: var(--muted, #858585);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

/* ── Sections ── */

.profile-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.section-title {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--muted, #858585);
}

/* ── Progress bar ── */

.progress-track {
  height: 8px;
  background: var(--line, #3e3e42);
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #4ade80;
  border-radius: 999px;
  transition: width 0.4s ease;
}

.progress-label {
  margin: 0;
  font-size: 0.825rem;
  color: var(--muted, #858585);
}

/* ── Completed list ── */

.completed-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.completed-item {
  border-radius: 8px;
  overflow: hidden;
}

.completed-link {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.65rem 0.9rem;
  text-decoration: none;
  border: 1px solid var(--line, #3e3e42);
  border-radius: 8px;
  background: var(--panel, #252526);
  transition:
    background 0.12s,
    border-color 0.12s;
}

.completed-link:hover {
  background: var(--panel-hover, #2d2d30);
  border-color: #4ade80;
}

.completed-check {
  color: #4ade80;
  flex-shrink: 0;
}

.completed-title {
  font-size: 0.875rem;
  color: var(--ink, #d4d4d4);
  flex: 1;
}

.completed-category {
  font-size: 0.75rem;
  color: var(--muted, #858585);
  flex-shrink: 0;
}

/* ── Empty state ── */

.profile-empty {
  margin: 0;
  font-size: 0.875rem;
  color: var(--muted, #858585);
}

.profile-empty a {
  color: var(--accent, #4ec9b0);
  text-decoration: none;
}

.profile-empty a:hover {
  text-decoration: underline;
}

/* ── Actions ── */

.profile-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.5rem;
  border-top: 1px solid var(--line, #3e3e42);
}

.profile-back-btn {
  font-size: 0.875rem;
  color: var(--accent, #4ec9b0);
  text-decoration: none;
}

.profile-back-btn:hover {
  text-decoration: underline;
}

.profile-signout-btn {
  padding: 0.45rem 1rem;
  border: 1px solid var(--line, #3e3e42);
  border-radius: 8px;
  background: transparent;
  color: var(--muted, #858585);
  font-size: 0.875rem;
  cursor: pointer;
  transition:
    border-color 0.12s,
    color 0.12s;
}

.profile-signout-btn:hover {
  border-color: #f87171;
  color: #f87171;
}

@media (max-width: 480px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }

  .profile-identity {
    align-items: center;
  }
}
</style>
