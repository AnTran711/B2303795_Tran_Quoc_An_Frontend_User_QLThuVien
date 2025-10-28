import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/utils/axios.js';

export const useReaderStore = defineStore('reader', () => {
  //state
  const reader = ref(null);
  const loading = ref(false);

  //actions
  async function register(readerRegister) {
    const res = await api.post('/auth/register', readerRegister);
    return res.data;
  }

  async function login(readerLogin) {
    const res = await api.post('/auth/login', readerLogin);
    reader.value = res.data.data;
    return res.data;
  }

  async function logout() {
    const res = await api.post('/auth/logout');
    reader.value = null;
    return res.data;
  }

  function getFullName() {
    if (!reader.value) return '';
    return reader.value.HOLOT + ' ' + reader.value.TEN;
  }

  function getName() {
    if (!reader.value) return '';
    return reader.value.TEN;
  }

  return { reader, loading, register, login, logout, getFullName, getName };
}, {
  persist: {
    key: 'reader',
    storage: localStorage,
    pick: ['reader'] // Chỉ lưu state reader và localStorage
  }
});