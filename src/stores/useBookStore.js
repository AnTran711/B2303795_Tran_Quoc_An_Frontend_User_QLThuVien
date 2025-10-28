import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/utils/axios.js';

export const useBookStore = defineStore('book', () => {
  //state
  const books = ref([]);
  const loading = ref(false);

  //actions
  async function fetchBooks() {
    const res = await api.get('/books');
    books.value = res.data.data;
    return res.data;
  }

  return { books, loading, fetchBooks };
});