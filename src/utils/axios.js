import axios from 'axios';
import { toast } from 'vue3-toastify';
import { useBookStore } from '@/stores/useBookStore';
import { usePublisherStore } from '@/stores/usePublisherStore';
import { useReaderStore } from '@/stores/useReaderStore';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 5000
});

api.defaults.withCredentials = true;

// Request Interceptors
api.interceptors.request.use(
  (config) => {
    // set trạng thái loading
    const bookStore = useBookStore();
    const publisherStore = usePublisherStore();

    bookStore.loading = true;
    publisherStore.loading = true;

    return config;
  },
  (error) => {
    // Do something with request error
    const bookStore = useBookStore();
    const publisherStore = usePublisherStore();

    bookStore.loading = false;
    publisherStore.loading = false;

    return Promise.reject(error);
  }
)


let refreshTokenPromise = null;

// Hàm call api refresh
const refreshTokenAPI = async () => {
  const res = await api.post('/auth/refresh');
  return res.data;
}

// Response Interceptors
api.interceptors.response.use(
  (response) => {
    const bookStore = useBookStore();
    const publisherStore = usePublisherStore();

    bookStore.loading = false;
    publisherStore.loading = false;

    return response;
  },
  (error) => {
    const bookStore = useBookStore();
    const publisherStore = usePublisherStore();
    const readerStore = useReaderStore();

    bookStore.loading = false;
    publisherStore.loading = false;
    
    // Lấy ra các request lỗi đang chờ refresh
    const originalRequest = error.config;

    if (error.response?.status === 410 && !originalRequest._retry && readerStore.reader) {
      // Cờ để các lỗi khác không lọt vào
      originalRequest._retry = true;

      // Trường hợp chưa có promise để refresh token
      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshTokenAPI()
          .then(data => {
            return data.data;
          })
          .catch (refreshTokenError => {
            readerStore.logout();
            return Promise.reject(refreshTokenError);
          })
          .finally (() => {
            refreshTokenPromise = null;
          })
      }

      return refreshTokenPromise
        .then(accessToken => {
          return api(originalRequest);
        });
    }

    // Nếu refresh token hết hạn, bắt buộc đăng xuất
    if (error.response?.status === 401) {
      readerStore.logout();
    }


    let errorMessage = error?.message;
    // Nếu có message trên server trả về thì gán lại message
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    
    // Nếu không phải lỗi 410 (hết token) thì toast message
    if (error.response?.status !== 410) {
      toast.error(errorMessage);
    }

    return Promise.reject(error);
  }
)

export default api;
