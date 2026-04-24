<script setup lang="ts">
import { watchEffect } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../composables/useAuth";

const router = useRouter();
const { user, loading, signInWithGitHub } = useAuth();

// Redirect to home if already authenticated
watchEffect(() => {
  if (!loading.value && user.value) {
    void router.replace("/");
  }
});
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <h1 class="login-title">Computer Science 101</h1>
      <p class="login-subtitle">Sign in to track your progress</p>

      <button
        class="login-github-btn"
        type="button"
        :disabled="loading"
        @click="signInWithGitHub"
      >
        <svg
          class="login-github-icon"
          viewBox="0 0 24 24"
          width="20"
          height="20"
          aria-hidden="true"
          fill="currentColor"
        >
          <path
            d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58
               0-.28-.01-1.03-.02-2.03-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73
               1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93
               0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4
               c1.02.005 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22
               0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22 0 1.6-.01 2.9-.01 3.29 0 .32.21.7.82.58C20.56 21.8 24 17.3 24 12
               c0-6.63-5.37-12-12-12z"
          />
        </svg>
        Sign in with GitHub
      </button>

      <p class="login-note">
        All content is freely accessible. Sign in to track completed articles.
      </p>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100dvh;
  background: var(--color-bg, #0f0f0f);
}

.login-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  padding: 2.5rem 2rem;
  border: 1px solid var(--color-border, #2a2a2a);
  border-radius: 12px;
  background: var(--color-surface, #1a1a1a);
  max-width: 360px;
  width: 100%;
  text-align: center;
}

.login-title {
  margin: 0;
  font-size: 1.375rem;
  font-weight: 700;
  color: var(--color-text, #e8e8e8);
}

.login-subtitle {
  margin: 0;
  font-size: 0.9rem;
  color: var(--color-text-muted, #888);
}

.login-github-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.65rem 1.25rem;
  border: none;
  border-radius: 8px;
  background: var(--color-text, #e8e8e8);
  color: var(--color-bg, #0f0f0f);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
}

.login-github-btn:hover:not(:disabled) {
  opacity: 0.85;
}

.login-github-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.login-github-icon {
  flex-shrink: 0;
}

.login-note {
  margin: 0;
  font-size: 0.78rem;
  color: var(--color-text-muted, #666);
}
</style>
