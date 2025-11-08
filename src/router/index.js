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
    // Khi có savedPosition (ví dụ: bấm nút Back/Forward), Vue sẽ cuộn lại đúng vị trí cũ
    if (savedPosition) {
      return savedPosition
    } else {
      // Mặc định cuộn lên đầu trang
      return { top: 0 }
    }
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
