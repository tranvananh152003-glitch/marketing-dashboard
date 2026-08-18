# Hướng dẫn lấy Firebase Config (Bước 3)

## Sau khi đã tạo Firebase project và bật Firestore Database:

### Bước 3.1: Vào Project Settings
1. Mở Firebase Console: https://console.firebase.google.com/
2. Chọn project "marketing-dashboard" của bạn
3. Click vào icon **⚙️ (bánh răng)** ở góc trái trên
4. Click **"Project settings"** (Cài đặt dự án)

### Bước 3.2: Thêm Web App
1. Scroll xuống phần **"Your apps"** (Ứng dụng của bạn)
2. Nếu chưa có app nào, click vào icon **"</>"** (Web)
3. Nhập tên app: **dashboard**
4. **KHÔNG** tick vào "Also set up Firebase Hosting"
5. Click **"Register app"** (Đăng ký ứng dụng)

### Bước 3.3: Copy Firebase Config
Sau khi đăng ký, bạn sẽ thấy đoạn code như này:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC-xxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "marketing-dashboard-xxxxx.firebaseapp.com",
  projectId: "marketing-dashboard-xxxxx",
  storageBucket: "marketing-dashboard-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:xxxxxxxxxxxx"
};
```

### Bước 3.4: Gửi config cho developer
1. **Copy toàn bộ** đoạn code trên
2. Paste vào file text hoặc gửi trực tiếp
3. Developer sẽ tích hợp vào dashboard

**LÚU Ý:** 
- Config này là PUBLIC, an toàn để chia sẻ
- Nhưng cần setup Firebase Rules để bảo mật database
- Sau khi có config, dashboard sẽ tự động sync real-time!

---

## Nếu đã có app từ trước:
1. Vào **Project settings** → **Your apps**
2. Tìm app có tên **dashboard** (hoặc bất kỳ app web nào)
3. Scroll xuống phần **"SDK setup and configuration"**
4. Chọn tab **"Config"**
5. Copy đoạn `firebaseConfig`

---

## Sau khi có config:
Gửi cho developer, họ sẽ:
- Tích hợp Firebase vào dashboard
- Setup auto-sync mọi thay đổi
- Tất cả người dùng sẽ thấy cùng dữ liệu real-time!
