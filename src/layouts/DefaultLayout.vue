<script setup>
  import { onMounted } from 'vue';
  import Header from '@/components/Header.vue';
  import Footer from '@/components/Footer.vue';
  import { useBookStore } from '@/stores/useBookStore';
  import { useGenreStore } from '@/stores/useGenreStore';

  const bookStore = useBookStore();
  const genreStore = useGenreStore();

  // Fetch sách về khi layout được mounted
  onMounted(async () => {
    await bookStore.fetchBooks();
    await genreStore.fetchGenres();
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