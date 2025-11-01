import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/utils/axios';

export const useGenreStore = defineStore('genre', () => {
  // state
  const genres = ref([]);
  const loading = ref(false);

  // actions

  // Hàm lấy dữ liệu nhà xuất bản về từ backend
  async function fetchGenres() {
    const res = await api.get('/genres');
    genres.value = res.data.data;
    return res.data;
  }

  return { genres, loading, fetchGenres };
});