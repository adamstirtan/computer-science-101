<script setup lang="ts">
import { computed, ref, watch } from "vue";

const sidebarOpen = ref(true);
import { useRoute, useRouter } from "vue-router";
import AppBar from "../components/AppBar.vue";
import ContentPane from "../components/ContentPane.vue";
import NavigationSidebar from "../components/NavigationSidebar.vue";
import QuizModal from "../components/QuizModal.vue";
import { useAuth } from "../composables/useAuth";
import { useCurriculum } from "../composables/useCurriculum";
import { renderMarkdown } from "../composables/useMarkdown";
import { useProgress } from "../composables/useProgress";
import { useXp } from "../composables/useXp";

const route = useRoute();
const router = useRouter();
const curriculum = useCurriculum();
const { user, loading, signOut } = useAuth();
const { completedSlugs, markComplete } = useProgress();
const { totalXp, awardXp, recordAnswers } = useXp();

const quizOpen = ref(false);

const activeSlug = computed(() => {
  const param = route.params.slug;
  return typeof param === "string" && param.length > 0 ? param : null;
});

const activePage = computed(() => {
  if (!activeSlug.value) {
    return null;
  }

  return curriculum.pagesBySlug.get(activeSlug.value) ?? null;
});

const isLoggedIn = computed(() => user.value !== null);

const isCompleted = computed(() =>
  activeSlug.value ? completedSlugs.value.has(activeSlug.value) : false,
);

async function handleMarkComplete(): Promise<void> {
  if (activeSlug.value) {
    await markComplete(activeSlug.value);
  }
}

async function handleQuizPassed(
  answers: Array<{ questionId: string; correct: boolean }>,
): Promise<void> {
  quizOpen.value = false;

  if (!activeSlug.value || !activePage.value) return;

  await Promise.all([
    recordAnswers(activeSlug.value, answers),
    awardXp(activePage.value.xp),
    markComplete(activeSlug.value),
  ]);
}

const renderedHtml = ref("");

async function updateRenderedHtml(): Promise<void> {
  if (!activePage.value) {
    renderedHtml.value = "";
    return;
  }

  renderedHtml.value = await renderMarkdown(activePage.value.markdown);
}

watch(
  [activeSlug, loading],
  ([currentSlug, authLoading]) => {
    if (!currentSlug && curriculum.firstSlug && !authLoading) {
      router.replace({
        name: "curriculum",
        params: { slug: curriculum.firstSlug },
      });
    }
  },
  { immediate: true },
);

watch(
  activePage,
  () => {
    quizOpen.value = false;
    void updateRenderedHtml();
  },
  { immediate: true },
);
</script>

<template>
  <div class="layout" :class="{ 'sidebar-collapsed': !sidebarOpen }">
    <AppBar
      :sidebar-open="sidebarOpen"
      :user="user"
      :total-xp="totalXp"
      @toggle="sidebarOpen = !sidebarOpen"
      @sign-out="signOut"
    />
    <NavigationSidebar
      :categories="curriculum.categories"
      :completed-slugs="completedSlugs"
    />
    <ContentPane
      :page="activePage"
      :html="renderedHtml"
      :is-logged-in="isLoggedIn"
      :is-completed="isCompleted"
      @mark-complete="handleMarkComplete"
      @open-quiz="quizOpen = true"
    />
  </div>

  <QuizModal
    v-if="quizOpen && activePage"
    :questions="activePage.questions"
    :xp="activePage.xp"
    :article-slug="activePage.slug"
    @close="quizOpen = false"
    @passed="handleQuizPassed"
  />
</template>
