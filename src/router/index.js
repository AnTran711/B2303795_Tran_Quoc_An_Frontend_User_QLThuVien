import { createRouter, createWebHistory } from "vue-router";
import { useReaderStore } from "@/stores/useReaderStore";

import DefaultLayout from "@/layouts/DefaultLayout.vue";
import Auth from "@/views/Auth.vue";
import Login from "@/components/Login.vue";
import Register from "@/components/Register.vue";
import NotFound from "@/views/NotFound.vue";
import Home from "@/views/Home.vue";

const routes = [
  {
    path: '/',
    name: 'Home',
    component: DefaultLayout,
    children: [
      {
        path: '/',
        component: Home
      },
      // {
      //   path: '/history',
      //   component: 
      // }
    ]
  },
  {
    path: '/auth',
    component: Auth,
    children: [
      {
        path: '',
        redirect: '/auth/login'
      },
      {
        path: 'login',
        component: Login
      },
      {
        path: 'register',
        component: Register
      }
    ]
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Guard toàn cục
router.beforeEach((to, from, next) => {
  const readerStore = useReaderStore();
  if ((to.path === '/auth/login' || to.path === '/auth/register') && readerStore.reader) {
    next('/');
  } else {
    next();
  }
});

export default router;
