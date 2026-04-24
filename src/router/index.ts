import { createRouter, createWebHistory } from "vue-router";
import CurriculumView from "../views/CurriculumView.vue";
import LoginView from "../views/LoginView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
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
