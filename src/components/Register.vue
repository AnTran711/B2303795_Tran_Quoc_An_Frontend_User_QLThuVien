<script setup>
  import { nextTick, ref, watch } from 'vue';

  // Xử lý ẩn/hiện mật khẩu

  // Mật khẩu
  const showPwd = ref(false);
  const pwdField = ref(null);

  // Xác nhận mật khẩu
  const showConfirmPwd = ref(false);
  const pwdConfirmField = ref(null);

  async function togglePwd(type) {
    // Xử lý xem input gọi hàm là password hay confirm password
    const isShow = (type === 'password') ? showPwd : showConfirmPwd;
    const fieldRef = (type === 'password') ? pwdField : pwdConfirmField;

    // Lấy thẻ input
    const input = fieldRef.value?.$el?.querySelector('input');
    if(!input) return;

    // Lưu vị trí con trỏ hiện tại
    const pos = (typeof input.selectionStart === 'number') ? input.selectionStart : input.value.length;

    // Toggle trạng thái của password
    isShow.value = !isShow.value;

    // Đợi vue cập nhật lại DOM sau ghi toggle trạng thái
    await nextTick();

    // Lấy thẻ input sau khi DOM cập nhật lại
    const newInput = fieldRef.value?.$el?.querySelector('input');
    if(!newInput) return;

    // Đợi thêm 1 frame để DOM render ổn định, đảm bảo browser đã vẽ xong input mới
    requestAnimationFrame(() => {
      // Focus vào thẻ input
      newInput.focus({ preventScroll: true })
      // Đặt con trỏ lại vị trí cũ
      const newPos = Math.min(pos, newInput.value.length);
      newInput.setSelectionRange(newPos, newPos);
    })
  }

  // Phần của thẻ input ngày sinh
  const menu = ref(false);
  const birthDateRaw = ref(null);
  const birthDateFormatted = ref('');

  watch(birthDateRaw, (newBirthDate) => {
    if (newBirthDate) {
      const date = new Date(newBirthDate);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = String(date.getFullYear());
      birthDateFormatted.value = `${day}/${month}/${year}`;
    }
  });

  // Phần của input giới tính
  const gender = ref(null);
</script>

<template>
  <v-card width="800" class="rounded-xl">
    <!-- Phần title đăng ký -->
    <v-card-title class="pa-4 pb-0 text-center">
      <v-sheet class="d-flex justify-space-between align-center">
        <router-link to="/">
          <v-img src="/imgs/logo_ten.png" width="150" contain></v-img>
        </router-link>
        <v-btn
          to="/"
          color="primary"
          variant="elevated"
        >
          <v-icon class="mr-2">mdi-home</v-icon>
          Về trang chủ
        </v-btn>
      </v-sheet>
      <h1>Đăng ký</h1>
    </v-card-title>
    <v-card-text class="pb-0">
      <v-form>
        <v-container>
          <v-row  class="register-container">
            <v-col cols="6">
              <!-- v-sheet để bọc họ lót và tên nằm trên 1 hàng -->
              <v-sheet class="d-flex ga-4">
                <v-text-field 
                  label="Họ lót"
                  variant="outlined"
                  prepend-inner-icon="mdi-account"
                  density="comfortable"
                  clearable
                />
                <v-text-field 
                  label="Tên"
                  variant="outlined"
                  prepend-inner-icon="mdi-account"
                  density="comfortable"
                  clearable
                />
              </v-sheet class="d-flex ga-4">

              <!-- Ngày sinh -->
              <!-- v-menu để hiện popup ngày tháng năm -->
              <v-menu
                v-model="menu"
                :close-on-content-click="false"
                transition="scale-transition"
              >
                <!-- Thẻ input để kích hoạt v-menu -->
                <template #activator="{ props }">
                  <v-text-field
                    class="mt-2"
                    v-bind="props"
                    prepend-inner-icon="mdi-calendar"
                    v-model="birthDateFormatted"
                    readonly
                    variant="outlined"
                    density="comfortable"
                    label="Ngày sinh"
                  />
                </template>
                <!-- phần date picker để chọn ngày -->
                <v-date-picker
                  color="primary"
                  v-model="birthDateRaw"
                  @update:model-value="menu = false" 
                />
              </v-menu>

              <!-- Giới tính -->
              <v-radio-group v-model="gender" inline>
                <v-radio class="ml-16 mr-auto" label="Nam" :value="true" color="primary" />
                <v-radio class="mr-16" label="Nữ" :value="false" color="primary" />
              </v-radio-group>

              <!-- Địa chỉ -->
              <v-text-field
                class="mt-2"
                label="Địa chỉ"
                variant="outlined"
                prepend-inner-icon="mdi-map-marker"
                density="comfortable"
                clearable
              />
            </v-col>

            <v-col cols="6">
              <!-- Dùng số điện thoại để đăng nhập thay cho username -->
              <v-text-field
                label="Số điện thoại"
                variant="outlined"
                prepend-inner-icon="mdi-phone"
                density="comfortable"
                clearable
              />

              <!-- Mật khẩu cho user -->
              <v-text-field
                ref="pwdField"
                class="mt-2"
                label="Mật khẩu"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-lock-outline"
                :append-inner-icon="showPwd ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPwd ? 'text' : 'password'"
                @click:append-inner="togglePwd('password')"
                clearable
              />

              <!-- Xác nhận mật khẩu -->
              <v-text-field
                ref="pwdConfirmField"
                class="mt-2"
                label="Nhập lại mật khẩu"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-lock-outline"
                :append-inner-icon="showConfirmPwd ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showConfirmPwd ? 'text' : 'password'"
                @click:append-inner="togglePwd('confirm-password')"
                clearable
              />
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card-text>
    <!-- phần actions hiện hành động -->
    <v-card-actions class="pa-4 pt-0 d-flex flex-column ga-4">
      <!-- Nút đăng ký -->
      <v-btn
        height="50"
        width="150"
        color="primary"
        variant="elevated"
      >
        Đăng ký
      </v-btn>
      <!-- Phần này để chuyển qua trang đăng ký -->
      <div>
        Bạn đã có tài khoản?
        <router-link to="/auth/login" style="text-decoration: none;">
          Đăng nhập ngay
        </router-link>
      </div>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
  /* Phần bọc 2 panel form */
  .register-container {
    display: flex;
    justify-content: center;
  }
</style>