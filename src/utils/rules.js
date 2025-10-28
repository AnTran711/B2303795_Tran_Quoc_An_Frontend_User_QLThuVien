export const rules = {
  // Bắt buộc nhập
  required: value => {
    if (value === null || value === undefined || value === '') {
      return 'Vui lòng chọn hoặc nhập thông tin';
    }
    return true;
  },

  // Độ dài tối thiểu
  min: min => value =>
    (value && value.length >= min) || `Phải có ít nhất ${min} ký tự`,

  // Độ dài tối đa
  max: max => value =>
    (value && value.length <= max) || `Không được vượt quá ${max} ký tự`,

  // Email hợp lệ
  email: value =>
    !value || /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) || 'Email không hợp lệ',

  // Số hợp lệ
  number: value =>
    !isNaN(value) || 'Trường này phải là số',

  // Kiểm tra số lớn hơn 0
  positiveNumber: value =>
    (!isNaN(value) && Number(value) > 0) || 'Giá trị phải lớn hơn 0',

  // Mật khẩu trùng khớp (xác nhận mật khẩu)
  confirm: compareValue => value =>
    value === compareValue || 'Mật khẩu không trùng khớp',
};