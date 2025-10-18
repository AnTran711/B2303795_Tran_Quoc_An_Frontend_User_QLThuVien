<script setup>
</script>

<template>
  <v-app>
    <div class="app">
      <router-view />
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
</style>