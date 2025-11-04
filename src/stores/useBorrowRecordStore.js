import { defineStore } from "pinia";
import api from "@/utils/axios.js";
import { ref } from "vue";

export const useBorrowRecordStore = defineStore('borrowRecord', () => {
  // state
  const borrowRecords = ref([]);
  const loading = ref(false);

  // action
  async function fetchBorrowRecords(filter = 'all', sort = 'desc', search = '', readerId) {
    const res = await api.get(`/borrow-records?filter=${filter}&sort=${sort}&search=${search}&readerId=${readerId}`);
    borrowRecords.value = res.data.data;
    return res.data;
  }

  async function borrow(readerId, bookId) {
    const res = await api.post('/borrow-records', {
      MADOCGIA: readerId,
      MASACH: bookId
    });
    return res.data;
  }

  return { borrowRecords, loading, fetchBorrowRecords, borrow }
});