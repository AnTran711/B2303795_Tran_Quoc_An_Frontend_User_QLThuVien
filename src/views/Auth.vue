<script setup>
</script>

<template>
  <v-app>
    <div class="app">
      <router-view class="zoom-in" />
    </div>
  </v-app>
</template>

<style scoped>
  .app {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url('/public/imgs/tu_sach.png');
    background-size: cover;
    background-position: center;
  }

  /* CSS zoom form đăng ký và đăng nhập */
  .zoom-in {
    animation: zoomIn 0.5s ease forwards;
  }

  @keyframes zoomIn {
    from {
      scale: 0.5;
      opacity: 0;
    }
    to {
      scale: 1;
      opacity: 1;
    }
  }
</style>