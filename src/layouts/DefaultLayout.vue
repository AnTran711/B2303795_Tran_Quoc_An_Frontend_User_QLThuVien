<script setup>
  import { onMounted } from 'vue';
  import Header from '@/components/Header.vue';
  import Footer from '@/components/Footer.vue';
  import { useBookStore } from '@/stores/useBookStore';

  const bookStore = useBookStore();

  // Fetch sách về khi layout được mounted
  onMounted(async () => {
    await bookStore.fetchBooks();
  })
</script>

<template>
  <v-app>
    <Header></Header>
    <v-main class="background">
      <router-view />
    </v-main>
    <Footer></Footer>
  </v-app>
</template>

<style scoped>
.background {
  background-color: rgb(var(--v-theme-primary));
}
</style>