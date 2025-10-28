<script setup>
  const carouselItems = [
    {
      img: '/imgs/hinh_chong_sach.png',
      title: 'Khám Phá Tri Thức',
      subtitle: 'Hàng ngàn cuốn sách đang chờ bạn khám phá',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      img: '/imgs/non_tot_nghiep.png',
      title: 'Học Tập Mọi Lúc',
      subtitle: 'Mượn sách dễ dàng, trả sách tiện lợi',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      img: '/imgs/hinh_chong_sach.png',
      title: 'Nâng Tầm Kiến Thức',
      subtitle: 'Đọc sách mỗi ngày, thành công mỗi giờ',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    }
  ]
</script>

<template>
  <v-carousel
    :height="'calc(100vh - 160px)'"
    class="main-carousel"
    cycle
    hide-delimiter-background
    delimiter-icon="mdi-minus"
  >
    <v-carousel-item
      v-for="(item, index) in carouselItems"
      :key="index"
    >
      <v-sheet
        :style="{ background: item.gradient }"
        height="100%"
      >
        <v-container class="fill-height">
          <v-row class="pa-16" align="center" justify="center">
            <v-col cols="6" class="text-center">
              <div>
                <h1 class="carousel-title text-white mb-4">
                  {{ item.title }}
                </h1>
                <p class="carousel-subtitle text-white mb-8">
                  {{ item.subtitle }}
                </p>
              </div>
            </v-col>
            <v-col cols="6" class="text-center">
              <div class="carousel-image-wrapper">
                <v-img 
                  :src="item.img" 
                  max-width="300"
                  class="carousel-image mx-auto"
                />
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-sheet>
    </v-carousel-item>
  </v-carousel>
</template>

<style scoped>
/* Main Carousel Styles */
.main-carousel {
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  margin: 40px 0;
}

.carousel-title {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.2;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.carousel-subtitle {
  font-size: 1.5rem;
  font-weight: 400;
  opacity: 0.95;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
}

.carousel-image-wrapper {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px); 
  }
}

.carousel-image {
  filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.3));
}
</style>