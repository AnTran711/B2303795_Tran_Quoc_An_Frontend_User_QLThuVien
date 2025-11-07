<script setup>
  import { useRoute, useRouter } from 'vue-router';
  import { useBookStore } from '@/stores/useBookStore';
  import { onMounted, ref } from 'vue';
  import { useReaderStore } from '@/stores/useReaderStore';
  import { toast } from 'vue3-toastify';
  import { useBorrowRecordStore } from '@/stores/useBorrowRecordStore';

  const route = useRoute();
  const router = useRouter();
  const bookStore = useBookStore();
  const readerStore = useReaderStore();
  const borrowRecordStore = useBorrowRecordStore();

  onMounted(async () => {
    try {
      await bookStore.fetchBook(route.params.bookId);
    } catch (error) {
      router.push('/book-not-found');
    }
  });

  // Mượn sách
  const showBorrowConfirm = ref(false);
  const showLoginNotification = ref(false);

  // Bật xác nhận mượn sách hoặc xác nhận chuyển sang trang đăng nhập nếu người dùng chưa đăng nhập
  const openConfirm = () => {
    if (!readerStore.reader) {
      showLoginNotification.value = true;
    } else {
      showBorrowConfirm.value = true;
    }
  }

  // Hàm xử lý mượn sách
  const borrowBook = async () => {
    showBorrowConfirm.value = false;

    // Logic mượn sách
    if (readerStore.reader && bookStore.currentBook) {
      const res = await borrowRecordStore.borrow(
        readerStore.reader?.MADOCGIA,
        bookStore.currentBook?.MASACH
      );
      toast.success(res.message);
    }
  };

  // Hàm bỏ qua hành động mượn sách
  const cancelBorrow = () => {
    showBorrowConfirm.value = false;
  }

  // Hàm từ chối chuyển hướng sang trang đăng nhập
  const cancelDirect = () => {
    showLoginNotification.value = false;
  }

</script>

<template>
  <v-container fluid class="py-16 px-4 px-md-16">
    <!-- Skeleton Loader -->
    <v-row v-if="bookStore.loading" class="main-section">
      <!-- Bìa sách loading -->
      <v-col cols="12" md="4" lg="3">
        <v-skeleton-loader
          type="image"
          height="500"
        />
      </v-col>

      <!-- Phần chi tiết sách -->
      <v-col cols="12" md="8" lg="9">
        <div class="book-details">
          <!-- Trạng thái -->
          <v-skeleton-loader
            type="chip"
            width="150"
            class="mb-4"
          />

          <!-- Tên sách -->
          <v-skeleton-loader
            type="heading"
            class="mb-3"
          />

          <!-- Tác giả -->
          <v-skeleton-loader
            type="list-item-avatar"
            class="mb-4"
          />

          <!-- Thể loại -->
          <v-skeleton-loader
            type="chip"
            width="100"
            class="mb-2"
          />
          <div class="d-flex gap-2 mb-4">
            <v-skeleton-loader
              v-for="n in 3"
              :key="n"
              type="chip"
              width="80"
            />
          </div>

          <!-- Divider -->
          <v-divider class="my-6" />

          <!-- Thông tin nhà xuất bản, năm xuất bản... -->
          <v-row class="mb-6">
            <v-col cols="12" sm="6">
              <v-skeleton-loader
                type="list-item-two-line"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-skeleton-loader
                type="list-item-two-line"
              />
            </v-col>
          </v-row>

          <!-- Mô tả sách -->
          <v-skeleton-loader
            type="heading"
            class="mb-3"
          />
          <v-skeleton-loader
            type="paragraph"
            class="mb-6"
          />

          <!-- Nút mượn sách -->
          <div class="action-section">
            <v-skeleton-loader
              type="button"
              width="150"
            />
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Main Content -->
    <v-row v-else class="main-section">
      <!-- Book Cover -->
      <v-col cols="12" md="4" lg="3">
        <v-img
          class="book-cover elevation-8"
          :src="bookStore.currentBook?.ANHBIA || '/imgs/no-cover.png'"
          aspect-ratio="2/3"
          cover
        >
          <template v-slot:error>
            <v-img
              aspect-ratio="2/3"
              cover
              src="/imgs/no-cover.png"
            />
          </template>
        </v-img>
      </v-col>

      <!-- Book Details -->
      <v-col cols="12" md="8" lg="9">
        <div class="book-details">
          <!-- Trạng thái sách còn hay hết -->
          <v-chip
            :color="bookStore.currentBook?.SACHCONLAI > 0 ? 'success' : 'error'"
            variant="flat"
            size="large"
            class="mb-4"
            prepend-icon="mdi-bookshelf"
          >
            <span class="font-weight-bold">
              {{ bookStore.currentBook?.SACHCONLAI > 0 
                ? `Còn ${bookStore.currentBook.SACHCONLAI} quyển` 
                : 'Hết sách' 
              }}
            </span>
          </v-chip>

          <!-- Tên sách -->
          <h1 class="book-title mb-3">
            {{ bookStore.currentBook?.TENSACH }}
          </h1>

          <!-- Tác giả -->
          <div class="book-author mb-4 d-flex align-center">
            <v-avatar size="32" color="primary" class="mr-2">
              <v-icon size="20" color="white">mdi-account-edit</v-icon>
            </v-avatar>
            <div>
              <p class="text-caption text-grey mb-0">Tác giả</p>
              <p class="text-body-1 font-weight-medium mb-0">
                {{ bookStore.currentBook?.TENTACGIA }}
              </p>
            </div>
          </div>

          <!-- Thể loại -->
          <div class="mb-4">
            <p class="text-subtitle-2 text-grey mb-2">Thể loại</p>
            <v-chip-group>
              <v-chip
                v-for="genre in bookStore.currentBook?.DSTHELOAI"
                :key="genre.MATHELOAI"
                variant="tonal"
                size="default"
                class="genre-chip"
              >
                <v-icon size="18" class="mr-1">mdi-tag</v-icon>
                {{ genre.TENTHELOAI }}
              </v-chip>
            </v-chip-group>
          </div>

          <!-- Divider -->
          <v-divider class="my-6" />

          <!-- Thông tin sách -->
          <v-row class="mb-6">
            <v-col cols="12" sm="6">
              <div class="info-item">
                <v-icon class="mr-2" color="primary">mdi-domain</v-icon>
                <div>
                  <p class="text-caption text-grey mb-0">Nhà xuất bản</p>
                  <p class="text-body-1 font-weight-medium mb-0">
                    {{ bookStore.currentBook?.NHAXUATBAN?.TENNXB }}
                  </p>
                </div>
              </div>
            </v-col>
            <v-col cols="12" sm="6">
              <div class="info-item">
                <v-icon class="mr-2" color="primary">mdi-calendar</v-icon>
                <div>
                  <p class="text-caption text-grey mb-0">Năm xuất bản</p>
                  <p class="text-body-1 font-weight-medium mb-0">
                    {{ bookStore.currentBook?.NAMXUATBAN }}
                  </p>
                </div>
              </div>
            </v-col>
          </v-row>

          <!-- Mô tả sách -->
          <div class="description-section mb-6">
            <h3 class="text-h6 mb-3 d-flex align-center">
              <v-icon class="mr-2" color="primary">mdi-text-box-outline</v-icon>
              Mô tả
            </h3>
            <v-card variant="tonal" class="pa-4">
              <p class="text-body-1 description-text">
                {{ bookStore.currentBook?.MOTA || 'Không có mô tả' }}
              </p>
            </v-card>
          </div>

          <!-- Actions -->
          <div class="action-section">
            <v-btn
              color="primary"
              variant="flat"
              size="x-large"
              rounded="lg"
              class="borrow-btn"
              prepend-icon="mdi-book-open-variant"
              @click="openConfirm"
              :disabled="bookStore.currentBook?.SACHCONLAI <= 0"
            >
              {{ bookStore.currentBook?.SACHCONLAI > 0 ? 'Mượn sách' : 'Hết sách' }}
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>

  <!-- Phần xác nhận mượn sách -->
  <v-overlay
    v-model="showBorrowConfirm"
    class="align-center justify-center"
    @update:model-value="(val) => { if(!val) cancelBorrow() }"
  >
    <v-card>
      <v-card-title>Xác nhận mượn sách</v-card-title>
      <v-card-text>
        Bạn có chắc chắn muốn mượn cuốn sách này không?
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn
          variant="elevated"
          color="primary"
          @click="borrowBook"
        >
          Mượn sách
        </v-btn>
        <v-btn variant="tonal" @click="cancelBorrow">Hủy</v-btn>
      </v-card-actions>
    </v-card>
  </v-overlay>

  <!-- Phần xác nhận chuyển hướng -->
  <v-overlay
    v-model="showLoginNotification"
    class="align-center justify-center"
    @update:model-value="(val) => { if(!val) cancelDirect() }"
  >
    <v-card>
      <v-card-title>Bạn chưa đăng nhập</v-card-title>
      <v-card-text>
        Vui lòng đăng nhập để mượn sách
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn
          variant="elevated"
          color="primary"
          to="/auth/login"
        >
          Đăng nhập
        </v-btn>
        <v-btn variant="tonal" @click="cancelDirect">Hủy</v-btn>
      </v-card-actions>
    </v-card>
  </v-overlay>
  
</template>

<style scoped>
/* Main section */
.main-section {
  background: #fdfdfd;
  border-radius: 24px;
  padding: 48px 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

/* Ảnh bìa */
.book-cover {
  border-radius: 16px;
  transition: transform 0.3s ease;
}

.book-cover:hover {
  transform: scale(1.02);
}

/* Book Details */
.book-details {
  padding: 0 16px;
}

.book-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #2c3e50;
  line-height: 1.2;
}

.book-author {
  font-size: 1.2rem;
  color: #6c757d;
}

/* Genre chips */
.genre-chip {
  font-weight: 600;
  text-transform: none;
  transition: all 0.3s ease;
}

.genre-chip:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.06);
}

/* Phần thông tin về nhà xuất bản, thể loại... */
.info-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.info-item:hover {
  border-color: rgb(var(--v-theme-primary));
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.1);
}

/* Description */
.description-section {
  margin-top: 24px;
}

.description-text {
  line-height: 1.8;
  color: #495057;
  text-align: justify;
}

/* Actions */
.action-section {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 36px;
}

.borrow-btn {
  text-transform: none;
  font-weight: 700;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.3);
}

.borrow-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(var(--v-theme-primary), 0.4);
}
</style>