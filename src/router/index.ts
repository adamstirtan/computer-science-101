import { createRouter, createWebHistory } from "vue-router";
import CurriculumView from "../views/CurriculumView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/:slug?",
      name: "curriculum",
      component: CurriculumView,
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

export default router;
