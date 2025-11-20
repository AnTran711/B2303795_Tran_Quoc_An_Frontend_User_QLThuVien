<script setup>
const carouselItems = [
  {
    img: '/imgs/hinh_chong_sach.png',
    title: 'Khám Phá Tri Thức',
    subtitle: 'Hàng ngàn cuốn sách đang chờ bạn khám phá',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    img: '/imgs/non_tot_nghiep.png',
    title: 'Học Tập Mọi Lúc',
    subtitle: 'Mượn sách dễ dàng, trả sách tiện lợi',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  {
    img: '/imgs/ke_sach.png',
    title: 'Thế Giới Sách Số',
    subtitle: 'Truy cập kho tàng tri thức mọi lúc mọi nơi',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  },
  {
    img: '/imgs/doc_sach.png',
    title: 'Đọc Là Sống',
    subtitle: 'Nuôi dưỡng tâm hồn với từng trang sách',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  },
  {
    img: '/imgs/kho_tri_thuc.png',
    title: 'Kho Tri Thức Vô Tận',
    subtitle: 'Từ văn học đến khoa học, tất cả đều có tại đây',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  },
  {
    img: '/imgs/doc_sach_cung_nhau.png',
    title: 'Đọc Sách Cùng Nhau',
    subtitle: 'Chia sẻ niềm đam mê đọc sách với cộng đồng',
    gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
  },
  {
    img: '/imgs/mo_ra_tri_thuc.png',
    title: 'Kiến Thức Là Sức Mạnh',
    subtitle: 'Trang bị cho bản thân vũ khí mạnh nhất',
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  },
  {
    img: '/imgs/hanh_trinh_tri_thuc.png',
    title: 'Hành Trình Tri Thức',
    subtitle: 'Mỗi cuốn sách là một cuộc phiêu lưu mới',
    gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  },
];
</script>

<template>
  <v-carousel
    :height="'calc(100vh - 160px)'"
    class="main-carousel"
    cycle
    hide-delimiter-background
    delimiter-icon="mdi-minus"
  >
    <v-carousel-item v-for="(item, index) in carouselItems" :key="index">
      <v-sheet :style="{ background: item.gradient }" height="100%">
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
  0%,
  100% {
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
