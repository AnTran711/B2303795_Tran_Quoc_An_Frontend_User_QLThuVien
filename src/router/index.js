import { createRouter, createWebHistory } from "vue-router";

import DefaultLayout from "@/layouts/DefaultLayout.vue";
import Auth from "@/views/Auth.vue";
import Login from "@/components/Login.vue";
import Register from "@/components/Register.vue";

const routes = [
  {
    path: '/',
    component: DefaultLayout 
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
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
