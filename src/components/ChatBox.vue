<script setup>
import { nextTick, ref } from 'vue';
import api from '@/utils/axios';

const isOpen = ref(false);
const inputMessage = ref('');
const messages = ref([]);
const isTyping = ref(false);
const messagesContainer = ref(null);
const textField = ref(null);

// Hàm tắt/mở chatbox
const toggleChatBox = () => {
  isOpen.value = !isOpen.value;
};

// Hàm format lại câu trả lời của AI
const formatMessage = (text) => {
  // Chuyển đổi markdown đơn giản sang HTML
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
    .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
    .replace(/\n/g, '<br>') // Line breaks
    .replace(/`(.*?)`/g, '<code>$1</code>'); // Code
};

// Hàm mỗi khi gửi tin nhắn thì sẽ tự động scroll xuống dưới tin nhắn mới
const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    const scrollElement =
      messagesContainer.value.$el || messagesContainer.value;
    scrollElement.scrollTop = scrollElement.scrollHeight;
  }
};

// Hàm lấy ra giờ phút hiện tại
const getCurrentTime = () => {
  const now = new Date();
  return now.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Hàm gửi tin nhắn cho AI
const sendMessage = async () => {
  if (!inputMessage.value.trim() || isTyping.value) return;

  // Tạo tin nhắn của user
  const userMessage = {
    role: 'user',
    text: inputMessage.value.trim(),
    time: getCurrentTime(),
  };

  // Lưu tin nhắn vào mảng các tin nhắn
  messages.value.push(userMessage);

  // Tạo biến lưu prompt để reset lại ô input
  const userPrompt = inputMessage.value.trim();

  // Reset ô input
  inputMessage.value = '';

  // Hiển thị tin nhắn '...' chờ phản hồi
  isTyping.value = true;

  // Kéo ô chat xuống tin nhắn mới
  await scrollToBottom();

  try {
    const res = await api.post('/assistant/generate-response', {
      prompt: userPrompt,
    });

    isTyping.value = false;

    const botMessage = {
      role: 'bot',
      text: res.data.data,
      time: getCurrentTime(),
    };

    messages.value.push(botMessage);
  } catch (error) {
    isTyping.value = false;

    const errorMessage = {
      role: 'bot',
      text: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.',
      time: getCurrentTime(),
    };

    messages.value.push(errorMessage);
  }

  await scrollToBottom();

  // Tự focus thẻ input sau khi gửi tin nhắn
  const input = textField.value?.$el?.querySelector('input');
  input.focus();
};
</script>

<template>
  <div class="chatbox-container">
    <!-- Nút mở chat -->
    <v-tooltip v-if="!isOpen" location="top">
      <template v-slot:activator="{ props }">
        <v-btn
          class="chat-toggle-btn"
          icon
          v-bind="props"
          variant="text"
          @click="toggleChatBox"
        >
          <v-icon size="36">mdi-robot-happy</v-icon>
        </v-btn>
      </template>
      <span>Chat với AI</span>
    </v-tooltip>

    <!-- Chat box -->
    <v-card v-if="isOpen" class="chatbox">
      <!-- Phần header -->
      <v-card-title class="chatbox-header">
        <div class="header-info">
          <div class="avatar">
            <v-img src="/imgs/logo.png" width="20" contain />
          </div>
          <div class="header-text">
            <h3>Trợ lý AnLib</h3>
            <span class="status">● Trực tuyến</span>
          </div>
        </div>
        <!-- Nút close -->
        <v-tooltip location="top">
          <template v-slot:activator="{ props }">
            <v-btn
              icon
              class="close-btn"
              v-bind="props"
              variant="flat"
              @click="toggleChatBox"
            >
              <v-icon>mdi-window-close</v-icon>
            </v-btn>
          </template>
          <span>Đóng chat</span>
        </v-tooltip>
      </v-card-title>

      <!-- Phần tin nhắn -->
      <v-card-text class="chatbox-messages" ref="messagesContainer">
        <!-- Tin nhắn chào mặc định từ bot -->
        <div v-if="messages.length === 0" class="welcome-message">
          <div class="welcome-icon">👋</div>
          <h4>Xin chào!</h4>
          <p>Tôi là trợ lý ảo của thư viện AnLib. Tôi có thể giúp bạn về:</p>
          <ul>
            <li>Quy định mượn sách</li>
            <li>Quy trình mượn/trả sách</li>
            <li>Phí phạt quá hạn</li>
          </ul>
        </div>

        <!-- Tin nhắn -->
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="[
            'message',
            message.role === 'user' ? 'user-message' : 'bot-message',
          ]"
        >
          <!-- Avatar của bot -->
          <div class="message-avatar" v-if="message.role === 'bot'">
            <v-img src="/imgs/logo.png" width="20" contain />
          </div>
          <!-- Nội dung tin nhắn -->
          <div class="message-content">
            <div
              class="message-text"
              v-html="formatMessage(message.text)"
            ></div>
            <div class="message-time">{{ message.time }}</div>
          </div>
        </div>

        <!-- Phần chờ phản hồi, là 1 tin nhắn ... -->
        <div v-if="isTyping" class="message bot-message">
          <div class="message-avatar">
            <v-img src="/imgs/logo.png" width="20" contain />
          </div>
          <div class="message-content">
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </v-card-text>

      <v-divider />
      <v-card-actions class="d-flex align-center justify-center pa-4">
        <!-- Ô soạn tin nhắn -->
        <v-text-field
          class="input-text"
          ref="textField"
          v-model="inputMessage"
          placeholder="Nhập tin nhắn..."
          :disabled="isTyping"
          variant="outlined"
          density="comfortable"
          rounded="xl"
          hide-details
          color="primary"
          @keyup.enter="sendMessage"
        />
        <!-- Nút gửi -->
        <v-tooltip location="top">
          <template v-slot:activator="{ props }">
            <v-btn
              icon
              class="pa-0 send-btn"
              v-bind="props"
              variant="flat"
              :disabled="!inputMessage.trim() || isTyping"
              @click="sendMessage"
            >
              <v-icon size="20">mdi-send</v-icon>
            </v-btn>
          </template>
          <span>Gửi</span>
        </v-tooltip>
      </v-card-actions>
    </v-card>
  </div>
</template>

<style scoped>
.chatbox-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

/* Nút toggle chat */
.chat-toggle-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: 1px solid #fff;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
}

.chat-toggle-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
}

/* Chat box */
.chatbox {
  width: 380px;
  height: 550px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Header */
.chatbox-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 8px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-text h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.status {
  font-size: 12px;
  opacity: 0.9;
}

.close-btn {
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s;
}

.close-btn:hover {
  background: rgb(var(--v-theme-error));
}

/* Messages */
.chatbox-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #f7f8fc;
}

.chatbox-messages::-webkit-scrollbar {
  width: 6px;
}

.chatbox-messages::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

/* Welcome message */
.welcome-message {
  text-align: center;
  padding: 20px;
  color: #6b7280;
}

.welcome-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.welcome-message h4 {
  color: #374151;
  margin: 0 0 8px 0;
  font-size: 18px;
}

.welcome-message p {
  margin: 8px 0;
  font-size: 14px;
}

.welcome-message ul {
  text-align: left;
  display: inline-block;
  margin: 12px 0;
  padding-left: 20px;
}

.welcome-message li {
  margin: 6px 0;
  font-size: 14px;
}

/* Message */
.message {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.user-message {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.message-content {
  max-width: 70%;
}

.user-message .message-content {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.message-text {
  background: white;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.5;
  color: #374151;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.user-message .message-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.message-text :deep(strong) {
  font-weight: 600;
}

.message-text :deep(code) {
  background: rgba(0, 0, 0, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 13px;
}

.message-time {
  font-size: 11px;
  color: #9ca3af;
  margin-top: 4px;
  padding: 0 4px;
}

/* Typing indicator */
.typing-indicator {
  background: white;
  padding: 12px 16px;
  border-radius: 12px;
  display: flex;
  gap: 4px;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #9ca3af;
  animation: typing 1.4s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.7;
  }

  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

/* Input */
.input-text {
  flex: 1;
  overflow: hidden;
}

.input-text:disabled {
  background: #f3f4f6;
  cursor: not-allowed;
}

.send-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.send-btn:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 480px) {
  .chatbox {
    width: calc(100vw - 40px);
    height: calc(100vh - 40px);
    max-height: 600px;
  }

  .chat-toggle-btn {
    width: 56px;
    height: 56px;
  }
}
</style>
