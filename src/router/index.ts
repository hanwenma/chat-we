import { createRouter, createWebHistory } from "vue-router";
import Register from "@/views/Register.vue";
import { useUser } from "@/stores/user";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/register",
    },
    {
      path: "/register",
      component: Register,
    },
    {
      path: "/chat",
      name: "about",
      component: () => import("@/views/ChatView.vue"),
    },
  ],
});

router.beforeEach((to, from, next) => {
  const state = useUser();
  if (!state.user.uuid && to.path === "/chat") {
    next("/");
  } else {
    next();
  }
});

export default router;
