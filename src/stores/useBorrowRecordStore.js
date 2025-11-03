import { defineStore } from "pinia";
import api from "@/utils/axios.js";
import { ref } from "vue";

export const useBorrowRecordStore = defineStore('borrowRecord', () => {
  // state
  const borrowRecords = ref([]);
  const loading = ref(false);

  // action
  async function fetchBorrowRecords() {
    
  }
});