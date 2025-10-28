<script setup>
  import Carousel from '@/components/Carousel.vue';
  import { useBookStore } from '@/stores/useBookStore';

  const bookStore = useBookStore();

  const genres = [
    { name: 'Văn học', icon: 'mdi-book-open-variant', color: '#667eea' },
    { name: 'Trinh thám', icon: 'mdi-magnify', color: '#f093fb' },
    { name: 'Tình cảm', icon: 'mdi-heart', color: '#f5576c' },
    { name: 'Kinh dị', icon: 'mdi-ghost', color: '#764ba2' },
    { name: 'Hài hước', icon: 'mdi-emoticon-happy', color: '#feca57' },
    { name: 'Học đường', icon: 'mdi-school', color: '#48dbfb' },
    { name: 'Sinh học', icon: 'mdi-leaf', color: '#26de81' },
    { name: 'Vật lý', icon: 'mdi-atom', color: '#4b6584' },
    { name: 'Hóa học', icon: 'mdi-flask', color: '#fd79a8' },
    { name: 'Toán học', icon: 'mdi-calculator', color: '#a29bfe' },
  ];
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
              variant="outlined"
              rounded="xl"
              label="Tìm kiếm sách"
              prepend-inner-icon="mdi-magnify"
              clearable
              hide-details
            />
          </v-col>
        </v-row>

        <!-- Thể loại -->
        <v-row class="mb-8" no-gutters>
          <v-col cols="12">
            <h2 class="section-title mb-4">
              <v-icon size="28" class="mr-2">mdi-filter-variant</v-icon>
              Thể Loại
            </h2>
            <v-chip-group
              column
            >
              <v-chip
                v-for="genre in genres"
                :key="genre.name"
                :value="genre.name"
                variant="outlined"
                size="large"
                class="elevation-0 mx-2 genre-chip"
                :style="{ '--chip-color': genre.color }"
              >
                {{ genre.name }}
              </v-chip>
            </v-chip-group>
          </v-col>
        </v-row>

        <!-- Section sách -->
        <v-row no-gutters>
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
                v-for="book in bookStore.books"
                :key="book.MASACH"
                cols="6"
                sm="4"
                md="3"
              >
                <v-card
                  rounded="xl"
                  class="book-card d-flex flex-column justify-space-between"
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
                    <v-chip class="mt-4"
                      :color="book.SACHCONLAI > 0 ? 'success' : 'error'"
                    >
                      Còn {{ book.SACHCONLAI }} quyển
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
                    >
                      Xem sách
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
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
  border: 2px solid var(--chip-color);
}

.genre-chip:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  background: var(--chip-color);
  color: white;
  border-color: var(--chip-color);
}

.genre-chip.v-chip--selected {
  background: var(--chip-color);
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