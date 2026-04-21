<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import ContentPane from "../components/ContentPane.vue";
import NavigationSidebar from "../components/NavigationSidebar.vue";
import { useCurriculum } from "../composables/useCurriculum";
import { renderMarkdown } from "../composables/useMarkdown";

const route = useRoute();
const router = useRouter();
const curriculum = useCurriculum();

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

const renderedHtml = ref("");

async function updateRenderedHtml(): Promise<void> {
  if (!activePage.value) {
    renderedHtml.value = "";
    return;
  }

  renderedHtml.value = await renderMarkdown(activePage.value.markdown);
}

onMounted(() => {
  if (!activeSlug.value && curriculum.firstSlug) {
    router.replace({
      name: "curriculum",
      params: { slug: curriculum.firstSlug },
    });
  }
});

watch(
  activePage,
  () => {
    void updateRenderedHtml();
  },
  { immediate: true },
);
</script>

<template>
  <div class="layout">
    <NavigationSidebar :categories="curriculum.categories" />
    <ContentPane :page="activePage" :html="renderedHtml" />
  </div>
</template>
