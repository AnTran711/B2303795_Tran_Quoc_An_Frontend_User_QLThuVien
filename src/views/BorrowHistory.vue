<script setup>
  import { onMounted, ref } from 'vue';
  import { useBookStore } from '@/stores/useBookStore';
  import { useBorrowRecordStore } from '@/stores/useBorrowRecordStore';
  import { useReaderStore } from '@/stores/useReaderStore';
  import { useRoute, useRouter } from 'vue-router';
  

  const bookStore = useBookStore();
  const readerStore = useReaderStore();
  const borrowRecordStore = useBorrowRecordStore();

  const route = useRoute();
  const router = useRouter();

  onMounted(async () => {
    // Nếu URL có query thì đồng bộ lại
    if (route.query.filter) selectedFilter.value = route.query.filter;
    if (route.query.sort) selectedSort.value = route.query.sort;
    if (route.query.search) searchQuery.value = route.query.search;

    // Gọi API lần đầu
    await borrowRecordStore.fetchBorrowRecords(
      selectedFilter.value,
      selectedSort.value,
      searchQuery.value,
      readerStore.reader?.MADOCGIA
    );
  })

  // Lọc
  const filterItems = [
    {
      title: 'Tất cả',
      value: 'all'
    },
    {
      title: 'Chờ duyệt',
      value: 'pending'
    },
    {
      title: 'Đang mượn',
      value: 'borrowed'
    },
    {
      title: 'Đã trả',
      value: 'returned'
    },
    {
      title: 'Từ chối',
      value: 'rejected'
    }
  ];
  const selectedFilter = ref('all');

  // Sắp xếp
  const sortItems = [
    {
      title: 'Cũ nhất',
      value: 'asc'
    },
    {
      title: 'Mới nhất',
      value: 'desc'
    }
  ];
  const selectedSort = ref('desc');

  // Tìm kiếm
  const searchQuery = ref('');

  // Hàm lấy ra trạng thái
  const getStatusText = (value) => {
    return filterItems.find(i => i.value === value).title;
  }

  // Hàm chuẩn hóa ngày
  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString('vi-VN') : '--/--/----'
  }

  // Hàm chuyển qua trang xem chi tiết sách
  const showBook = (bookId) => {
    router.push(`/book/${bookId}`);
  }
</script>

<template>
  <v-container fluid class="py-8 px-4 px-md-12 px-lg-16 bg-grey-lighten-4">
    <!-- Header -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="d-flex align-center mb-2">
          <v-icon size="40" color="primary" class="mr-4">mdi-history</v-icon>
          <h1 class="text-h4 text-primary font-weight-bold">Lịch sử mượn sách</h1>
        </div>
        <p class="text-body-1 text-grey-darken-1 ml-14">Quản lý và theo dõi các sách bạn đã mượn</p>
      </v-col>
    </v-row>

    <!-- Toolbar -->
    <v-card class="mb-6" elevation="2" rounded="lg">
      <v-card-text class="pa-6">
        <v-row align="center">
          <v-col cols="12" sm="6" md="3" class="pa-4">
            <v-select
              v-model="selectedFilter"
              label="Trạng thái"
              :items="filterItems"
              item-title="title"
              item-value="value"
              variant="outlined"
              density="comfortable"
              hide-details
              color="primary"
            />
          </v-col>

          <v-col cols="12" sm="6" md="3" class="pa-4">
            <v-select
              v-model="selectedSort"
              label="Sắp xếp theo"
              :items="sortItems"
              item-title="title"
              item-value="value"
              variant="outlined"
              density="comfortable"
              hide-details
              color="primary"
            />
          </v-col>

          <v-col cols="12" md="6" class="pa-4">
            <v-text-field
              v-model="searchQuery"
              label="Tìm kiếm sách"
              variant="outlined"
              density="comfortable"
              hide-details
              color="primary"
              prepend-inner-icon="mdi-magnify"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Loading -->
    <v-row v-if="borrowRecordStore.loading">
      <v-col cols="12" class="text-center py-12">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
          width="6"
        />
        <p class="text-h6 mt-4 text-grey-darken-1">Đang tải dữ liệu...</p>
      </v-col>
    </v-row>

    <!-- Không có lịch sử -->
    <v-row v-else-if="borrowRecordStore.borrowRecords.length === 0">
      <v-col cols="12">
        <v-card class="text-center py-16" elevation="2" rounded="lg">
          <v-icon size="120" color="grey-lighten-1">mdi-book-remove-outline</v-icon>
          <h3 class="text-h5 mt-6 mb-2 text-grey-darken-1">
            {{ searchQuery ? 'Không tìm thấy kết quả' : 'Chưa có lịch sử mượn sách' }}
          </h3>
          <p class="text-body-1 text-grey">
            {{ searchQuery ? 'Thử tìm kiếm với từ khóa khác' : 'Hãy bắt đầu mượn sách để xem lịch sử tại đây' }}
          </p>
          <v-btn
            v-if="!searchQuery"
            to="/"
            color="primary"
            size="large"
            rounded="lg"
            class="mt-6"
            prepend-icon="mdi-home"
          >
            Về trang chủ
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- Danh sách lịch sử mượn -->
    <v-row v-else>
      <v-col cols="12">
        <v-card elevation="2" rounded="lg">
          <v-card-title class="pa-6 bg-primary">
            <h3 class="text-h6 text-white">
              Danh sách lịch sử
              <v-chip color="white" variant="flat" size="small" class="ml-2">
                {{ borrowRecordStore.borrowRecords.length }}
              </v-chip>
            </h3>
          </v-card-title>

          <v-divider/>

          <v-card-text class="pa-0">
            <v-list lines="two" class="pa-0">
              <template v-for="(record, index) in borrowRecordStore.borrowRecords" :key="record._id">
                <v-list-item class="py-6 record-item">
                  <template v-slot:prepend>
                    <v-avatar size="80" rounded="lg" class="mr-4">
                      <v-img
                        :src="record.SACH.ANHBIA || '/no-cover.png'"
                        cover
                      >
                        <template v-slot:error>
                          <v-img
                            cover
                            src="/imgs/no-cover.png"
                          />
                        </template>
                      </v-img> 
                    </v-avatar>
                  </template>

                  <v-list-item-title class="text-h6 font-weight-bold mb-2">
                    {{ record.SACH.TENSACH }}
                  </v-list-item-title>

                  <v-list-item-subtitle>
                    <div class="d-flex flex-wrap flex-row ga-4 mt-2">
                      <v-chip
                        :color="record.TRANGTHAI === 'pending' ? 'warning' 
                              : record.TRANGTHAI === 'borrowed' ? 'success' 
                              : record.TRANGTHAI === 'returned' ? 'primary'
                              : 'error'"
                        variant="flat"
                      >
                        {{ getStatusText(record.TRANGTHAI) }}
                      </v-chip>

                      <div class="d-flex align-center">
                        <v-icon size="small" class="mr-1">mdi-calendar-arrow-right</v-icon>
                        <span class="text-caption">
                          Ngày yêu cầu: <strong>{{ formatDate(record.NGAYYEUCAU) }}</strong>
                        </span>
                      </div>

                      <div class="d-flex align-center">
                        <v-icon size="small" class="mr-1">mdi-calendar-clock</v-icon>
                        <span class="text-caption">
                          Hạn trả: <strong>{{ formatDate(record.HANTRA) }}</strong>
                        </span>
                      </div>
  
                      <div class="d-flex align-center">
                        <v-icon size="small" class="mr-1">mdi-calendar-check</v-icon>
                        <span class="text-caption">
                          Ngày trả: <strong>{{ formatDate(record.NGAYTRA) }}</strong>
                        </span>
                      </div>
                    </div>
                  </v-list-item-subtitle>

                  <template v-slot:append>
                    <div class="d-flex flex-column ga-4" style="min-width: 133px;">
                      <v-btn
                        @click="showBook(record.MASACH)"
                        variant="outlined"
                        color="primary"
                        size="small"
                        rounded="lg"
                        prepend-icon="mdi-eye"
                      >
                        Xem sách
                      </v-btn>

                      <v-btn

                        v-if="record.TRANGTHAI === 'returned' || record.TRANGTHAI === 'rejected'"
                        variant="outlined"
                        color="primary"
                        size="small"
                        rounded="lg"
                        prepend-icon="mdi-repeat"
                      >
                        Mượn lại
                      </v-btn>

                      <v-btn

                        v-if="record.TRANGTHAI === 'pending'"
                        variant="outlined"
                        color="primary"
                        size="small"
                        rounded="lg"
                        prepend-icon="mdi-cancel"
                      >
                        Hủy yêu cầu
                      </v-btn>
                    </div>
                  </template>
                </v-list-item>
                <v-divider v-if="index < borrowRecordStore.borrowRecords.length - 1"></v-divider>
              </template>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.record-item {
  position: relative;
  transition: all 0.3s ease;
  overflow: hidden;
}

.record-item::before {
  content: '';
  position: absolute;
  height: 100%;
  width: 4px;
  left: 0;
  top: 0;
  background: rgb(var(--v-theme-primary));
  transform: scaleY(0);
  transition: transform 0.3s ease;
}

.record-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.03);
}

.record-item:hover::before {
  transform: scaleY(1);
}
</style>