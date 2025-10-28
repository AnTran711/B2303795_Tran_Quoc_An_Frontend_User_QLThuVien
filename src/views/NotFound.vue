<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
  router.push('/');
};
</script>

<template>
  <v-container style="min-height: 80vh;" class="mt-16">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" class="text-center">
        <v-icon size="150" color="primary">mdi-alert-circle-outline</v-icon>
        
        <h1 class="text-h2 font-weight-bold mt-6 mb-4">404</h1>
        
        <h2 class="text-h5 mb-4">Trang không tồn tại</h2>
        
        <p class="text-body-1 text-medium-emphasis mb-8">
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
        
        <v-btn
          color="primary"
          size="large"
          prepend-icon="mdi-home"
          @click="goHome"
        >
          Về trang chủ
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
</style>