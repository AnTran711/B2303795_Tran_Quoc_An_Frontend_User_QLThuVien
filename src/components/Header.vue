<script setup>
import { useRoute, useRouter } from 'vue-router';
import { useReaderStore } from '@/stores/useReaderStore.js';

const readerStore = useReaderStore();

const route = useRoute();
const router = useRouter();

// Kiểm tra đường dẫn hiện tại có trùng với đường dẫn không
const isActive = (path) => route.path === path;

// Danh sách navigator
const menuItems = [
  { title: 'Trang chủ', path: '/', icon: 'mdi-home' },
  { title: 'Lịch sử mượn sách', path: '/history', icon: 'mdi-history' },
];

// Hàm đăng xuất
const logout = async () => {
  if (readerStore.reader) {
    await readerStore.logout();
    router.push('/');
  }
};
</script>

<template>
  <v-app-bar flat color="white" height="80" class="px-16" elevation="2">
    <v-container fluid class="pa-0">
      <v-row no-gutters>
        <v-col cols="4" class="d-flex align-center">
          <!-- Logo và tên -->
          <router-link to="/" class="logo-link">
            <v-sheet class="d-flex align-center">
              <v-img src="/imgs/logo.png" width="80" contain />
              <span class="font-weight-bold text-primary text-h5">AnLib</span>
            </v-sheet>
          </router-link>
        </v-col>

        <v-col cols="4" class="d-flex align-center">
          <!-- Navigation -->
          <div class="d-flex align-center ga-1">
            <v-btn
              v-for="item in menuItems"
              :key="item.path"
              :to="item.path"
              :class="{ 'nav-active': isActive(item.path) }"
              class="nav-item"
              variant="text"
              rounded="lg"
              exact
            >
              <v-icon :icon="item.icon" size="small" class="mr-2"></v-icon>
              {{ item.title }}
            </v-btn>
          </div>
        </v-col>

        <v-col cols="4" class="d-flex align-center justify-end">
          <!-- Nút đăng nhập / đăng ký hoặc User Menu -->
          <div v-if="!readerStore.reader" class="d-flex align-center ga-3">
            <v-btn
              to="/auth/login"
              variant="outlined"
              color="primary"
              rounded="xl"
              class="btn-hover px-6"
              prepend-icon="mdi-login"
            >
              Đăng nhập
            </v-btn>
            <v-btn
              to="/auth/register"
              variant="flat"
              color="primary"
              rounded="xl"
              class="btn-hover px-6"
              prepend-icon="mdi-account-plus"
            >
              Đăng ký
            </v-btn>
          </div>

          <!-- User Menu -->
          <div v-else class="d-flex align-center">
            <v-menu offset-y>
              <!-- Kích hoạt menu user -->
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  variant="text"
                  rounded="xl"
                  class="pa-0 user-menu-btn"
                >
                  <v-avatar size="36" color="primary" class="mr-2">
                    <span class="text-white">{{
                      readerStore.getName()?.charAt(0)
                    }}</span>
                  </v-avatar>
                  <span class="mr-2">{{ readerStore.getFullName() }}</span>
                  <v-icon>mdi-chevron-down</v-icon>
                </v-btn>
              </template>

              <!-- Danh sách chức năng -->
              <v-list>
                <v-list-item
                  to="/auth/change-password"
                  prepend-icon="mdi-lock-reset"
                  title="Đổi mật khẩu"
                />
                <v-divider></v-divider>
                <v-list-item
                  @click="logout"
                  prepend-icon="mdi-logout"
                  title="Đăng xuất"
                />
              </v-list>
            </v-menu>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<style scoped>
/* logo */
.logo-link {
  text-decoration: none;
  transition: tranform 0.3s ease;
}

.logo-link:hover {
  transform: scale(1.05);
}

/* Navigation */
.nav-item {
  text-transform: none;
  font-weight: 500;
  letter-spacing: 0.3px;
  transition: all 0.3s ease;
  border-bottom: 3px solid transparent;
}

.nav-item:hover {
  border-bottom-color: rgb(var(--v-theme-primary));
}

.nav-item.nav-active {
  color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.08);
  border-bottom-color: rgb(var(--v-theme-primary));
}

/* Hiệu ứng lúc hover vào nút đăng nhập đăng ký */
.btn-hover {
  transition: all 0.3s ease;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.btn-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

/* User menu */
.user-menu-btn {
  text-transform: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.user-menu-btn:hover {
  background: rgba(var(--v-theme-primary), 0.08);
}
</style>
