import { createRouter, createWebHistory } from "vue-router";
import { useReaderStore } from "@/stores/useReaderStore";

import DefaultLayout from "@/layouts/DefaultLayout.vue";
import Auth from "@/views/Auth.vue";
import Login from "@/components/Login.vue";
import Register from "@/components/Register.vue";
import NotFound from "@/views/NotFound.vue";
import Home from "@/views/Home.vue";
import DetailBook from "@/views/DetailBook.vue";
import BookNotFound from "@/views/BookNotFound.vue";
import BorrowHistory from "@/views/BorrowHistory.vue";
import ChangePassword from "@/components/ChangePassword.vue";

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: Home
      },
      {
        path: 'book/:bookId',
        component: DetailBook
      },
      {
        path: 'history',
        component: BorrowHistory
      }
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
      },
      {
        path: 'change-password',
        component: ChangePassword
      }
    ]
  },
  {
    path: '/book-not-found',
    component: BookNotFound
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Nếu người dùng Back/Forward → trả về vị trí cũ
    if (savedPosition) {
      // Đợi nextTick để đảm bảo DOM đã render
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(savedPosition);
        }, 100);
      });
    }

    // Nếu chỉ thay đổi query → KHÔNG scroll-top
    if (to.path === from.path && to.fullPath !== from.fullPath) {
      return false;
    }

    // Nếu đổi trang thật sự (home -> detail chẳng hạn)
    return { top: 0 };
  }
});

// Guard toàn cục
router.beforeEach((to, from, next) => {
  const readerStore = useReaderStore();
  if ((to.path === '/auth/login' || to.path === '/auth/register') && readerStore.reader) {
    next('/');
  } else if (to.path === '/history' && !readerStore.reader) {
    next('/auth/login');
  } else {
    next();
  }
});

export default router;
