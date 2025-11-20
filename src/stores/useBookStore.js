import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/utils/axios.js';

export const useBookStore = defineStore('book', () => {
  //state
  const books = ref([]);
  const currentBook = ref(null);
  const loading = ref(false);

  //actions

  // Hàm lấy tất cả sách
  async function fetchBooks(page = 1, limit = 5, search = '', genreId) {
    try {
      loading.value = true;
      const res = await api.get('/books', {
        params: {
          page,
          limit,
          search,
          genreId
        }
      });
      books.value = res.data.data;
      return res.data;
    } finally {
      loading.value = false;
    }
  }

  // Hàm lấy 1 cuốn sách
  async function fetchBook(bookId) {
    try {
      loading.value = true;
      const res = await api.get(`/books/${bookId}`);
      currentBook.value = res.data.data;
      return res.data;
    } finally {
      loading.value = false;
    }
  }

  return { books, currentBook, loading, fetchBooks, fetchBook };
}, {
  persist: {
    key: 'currentBook',
    storage: localStorage,
    pick: ['currentBook'] // Chỉ lưu state currentBook và localStorage
  }
});