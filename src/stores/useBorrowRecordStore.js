import { defineStore } from "pinia";
import api from "@/utils/axios.js";
import { ref } from "vue";

export const useBorrowRecordStore = defineStore('borrowRecord', () => {
  // state
  const borrowRecords = ref([]);
  const loading = ref(false);

  // action
  async function fetchBorrowRecords(filter = 'all', sort = 'desc', search = '', readerId) {
    const res = await api.get('/borrow-records', {
      params: {
        filter,
        sort,
        search,
        readerId
      }
    });
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

  async function cancelRequest(recordId) {
    const res = await api.delete(`/borrow-records/cancel-request/${recordId}`);
    borrowRecords.value = borrowRecords.value.filter(
      r => r._id !== res.data.data._id
    );
    return res.data;
  }

  return { borrowRecords, loading, fetchBorrowRecords, borrow, cancelRequest }
});