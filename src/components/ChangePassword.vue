<script setup>
  import { nextTick, reactive, ref } from 'vue';
  import { toast } from 'vue3-toastify';
  import { rules } from '@/utils/rules.js';
  import { useRouter } from 'vue-router';
  import { useReaderStore } from '@/stores/useReaderStore';
  // Store
  const readerStore = useReaderStore();

  // Router
  const router = useRouter();

  // Xử lý gửi thông tin

  //Instance của form
  const formRef = ref(null);

  // Object chứa dữ liệu người dùng nhập
  const readerChangePassword = reactive({
    DIENTHOAI: null,
    MATKHAU: null,
    MATKHAUMOI: null
  });

  // Hàm xử lý gửi form
  const changePassword = async () => {
    // Kiểm tra dữ liệu có hợp lệ hay không
    const { valid } = await formRef.value.validate();

    if (!valid) {
      toast.error('Vui lòng kiểm tra lại thông tin nhập');
      return;
    }

    await readerStore.changePassword(readerChangePassword);

    await readerStore.logout();

    router.push(`/auth/login?changedPasswordPhone=${readerChangePassword.DIENTHOAI}`);
  }

  // Xử lý ẩn/hiện mật khẩu

  // Mật khẩu cũ
  const showOldPwd = ref(false);
  const oldPwdField = ref(null);

  // Mật khẩu mới
  const showNewPwd = ref(false);
  const newPwdField = ref(null);

  // Xác nhận mật khẩu mới
  const showNewPwdConfirm = ref(false);
  const newPwdConfirmField = ref(null);

  async function togglePwd(type) {
    // Xử lý xem input gọi hàm là trường nào
    let isShow;
    let fieldRef;
    switch (type) {
      case 'old-password':
        isShow = showOldPwd;
        fieldRef = oldPwdField;
        break;
      case 'new-password':
        isShow = showNewPwd;
        fieldRef = newPwdField;
        break;
      default:
        isShow = showNewPwdConfirm;
        fieldRef = newPwdConfirmField;
    }

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
</script>

<template>
  <v-container class="d-flex justify-center align-center">
    <!-- div bọc v-row để v-row không bung ra theo v-container -->
    <div style="width: 800px;">
      <v-row class="change-password-container rounded-xl" no-gutters>
        <!-- Phần hình ảnh trang trí -->
        <v-col cols="6" class="pa-8 image-panel">
          <v-img :width="400" src="/imgs/logo_ten.png"></v-img>
        </v-col>
    
        <!-- Phần form đổi mật khẩu -->
        <v-col cols="6" class="form-panel">
          <v-card
            class="pa-8 rounded-0"
            max-width="400"
            width="400"
            elevation="0"
          >
            <v-card-title class="text-center">
              <h1>Đổi mật khẩu</h1>
            </v-card-title>
            <v-card-text class="pt-4">
              <!-- form đổi mật khẩu -->
              <v-form ref="formRef" @keyup.enter="changePassword">
                <!-- Dùng số điện thoại để đổi mật khẩu -->
                <v-text-field
                  v-model="readerChangePassword.DIENTHOAI"
                  label="Số điện thoại"
                  variant="outlined"
                  prepend-inner-icon="mdi-phone"
                  density="comfortable"
                  clearable
                  :rules="[rules.required]"
                />
                <!-- Mật khẩu cũ -->
                <v-text-field
                  v-model="readerChangePassword.MATKHAU"
                  ref="oldPwdField"
                  class="mt-2"
                  label="Mật khẩu cũ"
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-lock-outline"
                  :append-inner-icon="showOldPwd ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showOldPwd ? 'text' : 'password'"
                  @click:append-inner="togglePwd('old-password')"
                  clearable
                  :rules="[rules.required]"
                />
                <!-- Mật khẩu mới -->
                <v-text-field
                  v-model="readerChangePassword.MATKHAUMOI"
                  ref="newPwdField"
                  class="mt-2"
                  label="Mật khẩu mới"
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-lock-outline"
                  :append-inner-icon="showNewPwd ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showNewPwd ? 'text' : 'password'"
                  @click:append-inner="togglePwd('new-password')"
                  clearable
                  :rules="[rules.required]"
                />

                <!-- Xác nhận mật khẩu -->
                <v-text-field
                  ref="newPwdConfirmField"
                  class="mt-2"
                  label="Nhập lại mật khẩu mới"
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-lock-outline"
                  :append-inner-icon="showNewPwdConfirm ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showNewPwdConfirm ? 'text' : 'password'"
                  @click:append-inner="togglePwd('confirm-new-password')"
                  clearable
                  :rules="[rules.required, rules.confirm(readerChangePassword.MATKHAUMOI)]"
                />
              </v-form>
            </v-card-text>
            <v-card-actions class="pa-4 pt-0 d-flex flex-column ga-8">
              <!-- Nút đổi mật khẩu -->
              <v-btn
                height="50"
                class="w-100"
                color="primary"
                variant="elevated"
                @click="changePassword"
              >
                Đổi mật khẩu
              </v-btn>
              <!-- Nút về trang chủ -->
              <v-btn
                to="/"
                height="50"
                class="w-100"
                color="primary"
                variant="elevated"
              >
                <v-icon class="mr-2">mdi-home</v-icon>
                Về trang chủ
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<style scoped>
  /* Phần bọc 2 panel hình ảnh và form */
  .change-password-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
    overflow: hidden;
  }

  /* Phần panel hình ảnh và form */
  .image-panel,
  .form-panel {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .image-panel {
    background-color: rgba(var(--v-theme-primary), 0.9);
  }

  .form-panel {
    background-color: #fff;
  }
</style>