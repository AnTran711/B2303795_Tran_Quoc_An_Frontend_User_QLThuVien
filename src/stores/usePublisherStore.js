import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/utils/axios';

export const usePublisherStore = defineStore('publisher', () => {
  // state
  const publishers = ref([]);
  const loading = ref(false);

  // actions

  // Hàm lấy dữ liệu nhà xuất bản về từ backend
  async function fetchPublishers() {
    const res = await api.get('/publishers');
    publishers.value = res.data.data;
    return res.data;
  }

  // Hàm thêm nhà xuất bản (gửi dữ liệu nhà xuất bản cần thêm lên backend)
  async function addPublisher(publisher) {
    const res = await api.post('/publishers', publisher);
    publishers.value.push(res.data.data);
    return res.data;
  }

  // Hàm cập nhật nhà xuất bản
  async function updatePublisher(publisher) {
    const res = await api.put(`/publishers/${publisher.MANXB}`, publisher);
    publishers.value = publishers.value.map(
      p => p.MANXB === res.data.data.MANXB ? res.data.data : p
    );
    return res.data;
  }

  // Hàm xóa nhà xuất bản
  async function deletePublisher(id) {
    const res = await api.delete(`/publishers/${id}`);
    publishers.value = publishers.value.filter(p => p.MANXB !== id);
    return res.data;
  }

  return { publishers, loading, fetchPublishers, addPublisher, updatePublisher, deletePublisher };
});