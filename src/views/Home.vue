<script setup>
  import Carousel from '@/components/Carousel.vue';
  import Pagination from '@/components/Pagination.vue';
  import { useBookStore } from '@/stores/useBookStore';
  import { useGenreStore } from '@/stores/useGenreStore';
  import { computed, ref, watch } from 'vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();

  const bookStore = useBookStore();
  const genreStore = useGenreStore();

  // Hàm xóa dấu
  function removeVietnameseTones(str) {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  }

  // Tìm kiếm + lọc
  const searchQuery = ref('');
  const selectedGenre = ref(null);

  // paging
  const bookInPage = 4;
  let currentPage = ref(1);

  const filterBooks = computed(() => {
    let books = bookStore.books;

    // Lọc theo thể loại
    if (selectedGenre.value) {
      books = books.filter(b => Array.isArray(b?.THELOAI) && b?.THELOAI.includes(selectedGenre.value));
    }

    // Tìm kiếm theo tên
    if (searchQuery.value?.trim()) {
      const q = removeVietnameseTones(searchQuery.value.trim().toLowerCase());
      books = books.filter(b => removeVietnameseTones(b.TENSACH.toLowerCase()).includes(q));
    }

    return books;
  });

  // Tính tổng số trang
  const totalPage = computed(() => Math.ceil(filterBooks.value.length / bookInPage));

  const showBooks = computed(() => {
    // Đảm bảo currentPage không lớn hơn totalPage
    if (currentPage.value > totalPage.value && totalPage.value > 0) {
      currentPage.value = totalPage.value;
    }
    const start = bookInPage * (currentPage.value - 1);

    return filterBooks.value.slice(start, start + bookInPage);
  })

  // Hàm chuyển qua trang xem chi tiết sách
  const showBook = (bookId) => {
    router.push(`/book/${bookId}`);
  }
</script>

<template>
  <v-container fluid class="py-0 px-16">
    <!-- Carousel -->
    <v-row no-gutters>
      <v-col cols="12">
        <Carousel />
      </v-col>
    </v-row>

    <!-- Main -->
    <v-row class="main-section" no-gutters>
      <v-col cols="12">
        <!-- Header Section -->
        <v-row class="mb-6 align-center" no-gutters>
          <v-col cols="12" md="6" class="mb-4 mb-md-0">
            <h1 class="main-title">
              <v-icon size="40" color="primary" class="mr-3">mdi-bookshelf</v-icon>
              Khám Phá Sách
            </h1>
            <p class="main-subtitle text-grey mt-2">
              Tìm kiếm và khám phá hàng ngàn cuốn sách yêu thích của bạn
            </p>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="searchQuery"
              variant="outlined"
              rounded="xl"
              label="Tìm kiếm sách"
              prepend-inner-icon="mdi-magnify"
              clearable
              hide-details
            />
          </v-col>
        </v-row>

        <!-- Skeleton thể loại -->
        <v-row v-if="genreStore.loading" class="mb-8" no-gutters>
          <v-col cols="12">
            <h2 class="section-title mb-4">
              <v-icon size="28" class="mr-2">mdi-filter-variant</v-icon>
              Thể Loại
            </h2>
            <v-sheet class="d-flex">
              <v-skeleton-loader
                v-for="n in 6"
                :key="n"
                type="chip"
                width="150"
              />
            </v-sheet>
          </v-col>
        </v-row>

        <!-- Thể loại -->
        <v-row v-else class="mb-8" no-gutters>
          <v-col cols="12">
            <h2 class="section-title mb-4">
              <v-icon size="28" class="mr-2">mdi-filter-variant</v-icon>
              Thể Loại
            </h2>
            <v-chip-group
              v-model="selectedGenre"
              column
            >
              <v-chip
                v-for="genre in genreStore.genres"
                :key="genre.MATHELOAI"
                :value="genre.MATHELOAI"
                variant="outlined"
                size="large"
                class="elevation-0 mx-2 genre-chip"
              >
                {{ genre.TENTHELOAI }}
              </v-chip>
            </v-chip-group>
          </v-col>
        </v-row>

        <!-- Skeleton sách -->
        <v-row v-if="bookStore.loading" no-gutters>
          <v-col cols="12">
            <!-- Section title -->
            <v-row class="mb-4" no-gutters>
              <v-col cols="12">
                <h2 class="section-title">
                  <v-icon size="28" class="mr-2">mdi-star</v-icon>
                  Sách Nổi Bật
                </h2>
              </v-col>
            </v-row>

            <!-- Card sách -->
            <v-row>
              <v-col
                v-for="n in 12"
                :key="n"
                cols="6"
                sm="4"
                md="3"
              >
                <v-skeleton-loader
                  type="image, article"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <!-- Section sách -->
        <v-row v-else no-gutters>
          <v-col cols="12">
            <!-- Section title -->
            <v-row class="mb-4" no-gutters>
              <v-col cols="12">
                <h2 class="section-title">
                  <v-icon size="28" class="mr-2">mdi-star</v-icon>
                  Sách Nổi Bật
                </h2>
              </v-col>
            </v-row>

            <!-- Card sách -->
            <v-row>
              <v-col
                v-for="book in showBooks"
                :key="book.MASACH"
                cols="6"
                sm="4"
                md="3"
              >
                <v-card
                  rounded="xl"
                  class="book-card d-flex flex-column justify-space-between"
                  @click="showBook(book.MASACH)"
                >
                  <!-- Ảnh bìa -->
                  <v-img
                    class="elevation-1 book-card-img"
                    :src="book.ANHBIA || '/imgs/no-cover.png'"
                    aspect-ratio="2/3"
                    cover
                    rounded="xl"
                  >
                    <template v-slot:error>
                      <v-img
                        aspect-ratio="2/3"
                        cover
                        rounded="xl"
                        src="/imgs/no-cover.png"
                      ></v-img>
                    </template>
                  </v-img>

                  <!-- Phần thông tin -->
                  <v-card-text>
                    <h3 class="book-title">{{ book.TENSACH }}</h3>
                    <p class="book-author">{{ book.TENTACGIA }}</p>
                    <v-chip
                      class="mt-4"
                      :color="book.SACHCONLAI > 0 ? 'success' : 'error'"
                      variant="flat"
                    >
                      <span class="font-weight-bold">
                        {{ book.SACHCONLAI > 0 
                          ? `Còn ${book.SACHCONLAI} quyển` 
                          : 'Hết sách' 
                        }}
                      </span>
                    </v-chip>
                  </v-card-text>

                  <v-spacer></v-spacer>

                  <!-- Phần xem chi tiết -->
                  <v-card-actions class="d-flex justify-center">
                    <!-- Nút xem chi tiết sách -->
                    <v-btn
                      class="show-book-btn"
                      variant="elevated"
                      color="primary"
                      @click="showBook(book.MASACH)"
                    >
                      Xem sách
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <!-- Pagination -->
        <Pagination v-model="currentPage" :length="totalPage"></Pagination>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
/* Body dưới carousel */
.main-section {
  background: #fdfdfd;
  border-radius: 24px;
  padding: 48px 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
}

/* Title của main */
.main-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #2c3e50;
  display: flex;
  align-items: center;
}

.main-subtitle {
  font-size: 1.1rem;
  margin-left: 52px;
}

/* Title của từng section nhỏ trong main */
.section-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #34495e;
  display: flex;
  align-items: center;
}

/* Chip thể loại */
.genre-chip {
  font-weight: 600;
  text-transform: none;
  transition: all 0.3s ease;
  background: white;
  border: 2px solid rgb(var(--v-theme-primary));
}

.genre-chip:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  background: rgb(var(--v-theme-primary));
  color: white;
  border-color: rgb(var(--v-theme-primary));
}

.genre-chip.v-chip--selected {
  background: rgb(var(--v-theme-primary));
  color: white;
  transform: scale(1.1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

/* Card book */
.book-card {
  transition: all 0.3s ease;
  cursor: pointer;
  background: #fff;
  border: 1px solid #e9ecef;
  overflow: hidden;
  padding: 16px;
  height: 100%;
}

.book-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  border: 1px solid rgb(var(--v-theme-primary));
}

.book-card:hover .book-card-img {
  transform: scale(1.05);
}

/* Tên sách trong thẻ */
.book-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
}

/* Tên tác giả trong thẻ */
.book-author {
  font-size: 1rem;
}

/* Nút xem chi tiết sách */
.show-book-btn {
  transition: all 0.3s ease;
}

.show-book-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
}
</style>