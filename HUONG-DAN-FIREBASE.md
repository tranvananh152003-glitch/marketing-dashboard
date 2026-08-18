# Hướng dẫn Setup Firebase cho Dashboard Marketing

## 🎯 Mục đích
Để **tất cả mọi người** cùng xem và chỉnh sửa công việc trên cùng 1 dashboard (thay vì mỗi người 1 dữ liệu riêng)

---

## 📝 Bước 1: Tạo Firebase Project

1. **Mở Firebase Console**
   - Truy cập: https://console.firebase.google.com/
   - Đăng nhập bằng tài khoản Google của bạn

2. **Tạo project mới**
   - Click nút **"Add project"** (hoặc "Thêm dự án")
   - Nhập tên project: **marketing-dashboard** (hoặc tên bạn muốn)
   - Click **"Continue"** (Tiếp tục)

3. **Tắt Google Analytics** (không cần thiết)
   - Tắt toggle **"Enable Google Analytics for this project"**
   - Click **"Create project"** (Tạo dự án)
   - Đợi vài giây để Firebase tạo project

4. **Vào project**
   - Khi hiện thông báo "Your new project is ready"
   - Click **"Continue"**

---

## 📝 Bước 2: Bật Firestore Database

1. **Vào Firestore Database**
   - Ở menu bên trái, tìm và click **"Firestore Database"**
   - (Có icon giống 3 thanh ngang xếp chồng)

2. **Tạo database**
   - Click nút **"Create database"** (Tạo cơ sở dữ liệu)

3. **Chọn chế độ bảo mật**
   - Chọn **"Start in test mode"** (Bắt đầu ở chế độ thử nghiệm)
   - Click **"Next"**
   
   > ⚠️ Chế độ test cho phép đọc/ghi tự do. Sau 30 ngày sẽ cần cập nhật rules.

4. **Chọn vị trí server**
   - Chọn: **asia-southeast1** (Singapore - gần Việt Nam nhất)
   - Hoặc: **asia-east1** (Đài Loan)
   - Click **"Enable"** (Bật)
   - Đợi vài giây để tạo database

5. **Kiểm tra**
   - Bạn sẽ thấy màn hình Firestore Database trống
   - Có dòng "Start collection" ở giữa
   - ✅ Database đã sẵn sàng!

---

## 📝 Bước 3: Lấy Firebase Config

### 3.1. Vào Project Settings
1. Click vào icon **⚙️ (bánh răng)** ở góc trái trên
2. Click **"Project settings"** (Cài đặt dự án)

### 3.2. Thêm Web App
1. Scroll xuống phần **"Your apps"** (Ứng dụng của bạn)
2. Nếu chưa có app nào:
   - Click vào icon **"</>"** (Web icon)
3. Nếu đã có app:
   - Bỏ qua bước này, xuống 3.3

4. **Đăng ký app:**
   - Nhập tên: **dashboard** (hoặc tên bạn muốn)
   - **KHÔNG** tick vào "Also set up Firebase Hosting"
   - Click **"Register app"** (Đăng ký ứng dụng)
   - Click **"Continue to console"**

### 3.3. Copy Firebase Config

**Cách 1: Nếu vừa tạo app mới**
- Sau khi đăng ký, sẽ hiện đoạn code
- Copy toàn bộ đoạn `firebaseConfig`

**Cách 2: Nếu đã có app từ trước**
1. Vào **Project settings** (⚙️)
2. Scroll xuống phần **"Your apps"**
3. Tìm app có icon **"</>"**
4. Scroll xuống phần **"SDK setup and configuration"**
5. Chọn tab **"Config"** (không phải npm)
6. Copy đoạn code `const firebaseConfig = {...}`

**Đoạn config sẽ trông như này:**
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

### 3.4. Gửi Config
- **Copy toàn bộ** đoạn code trên
- Paste vào file text
- Gửi cho developer (qua chat, email...)
- Developer sẽ tích hợp vào dashboard

---

## 📝 Bước 4: Developer tích hợp (không cần làm gì)

Sau khi nhận được config, developer sẽ:
1. Thêm Firebase SDK vào dashboard
2. Kết nối với Firestore Database
3. Chuyển từ localStorage sang Firestore
4. Test và deploy lên GitHub Pages

---

## 🎉 Sau khi hoàn thành

✅ Dashboard sẽ lưu dữ liệu trên cloud
✅ Tất cả mọi người cùng xem chung
✅ Thay đổi tự động sync real-time
✅ Không mất dữ liệu khi clear cache
✅ Truy cập từ mọi thiết bị

---

## ⚠️ Lưu ý quan trọng

1. **Config an toàn**: Firebase config là PUBLIC, an toàn để chia sẻ
2. **Test mode 30 ngày**: Sau 30 ngày cần cập nhật Firestore Rules
3. **Không xóa project**: Nếu xóa Firebase project, mất hết dữ liệu

---

## 🆘 Nếu gặp vấn đề

**Không tìm thấy "Firestore Database"?**
- Thử refresh trang
- Hoặc search "Firestore" ở thanh tìm kiếm Firebase Console

**Không thấy icon "</>" để thêm app?**
- Scroll xuống phần "Your apps" trong Project Settings
- Click vào dòng chữ nhỏ "Add app"

**Không tìm thấy Config?**
- Vào Project Settings → Your apps
- Click vào app đã tạo
- Scroll xuống phần "SDK setup and configuration"

---

## 📧 Liên hệ

Nếu cần hỗ trợ, cung cấp:
- Screenshot màn hình bạn đang thấy
- Bước nào bạn đang gặp khó khăn
- Developer sẽ hỗ trợ ngay!
