# 🚀 HƯỚNG DẪN DEPLOY DASHBOARD LÊN INTERNET

## ✅ CÁCH 1: GitHub Pages (Miễn phí mãi mãi)

### Bước 1: Tạo tài khoản GitHub
1. Truy cập: https://github.com/signup
2. Đăng ký tài khoản miễn phí (nếu chưa có)
3. Xác nhận email

### Bước 2: Tạo Repository mới
1. Sau khi đăng nhập, click nút **"+"** ở góc phải trên → chọn **"New repository"**
2. Hoặc truy cập: https://github.com/new
3. Điền thông tin:
   - Repository name: `marketing-dashboard` (hoặc tên bạn thích)
   - Description: `Dashboard theo dõi tiến độ Marketing 2026`
   - Chọn **Public**
   - ✅ KHÔNG tick vào "Add a README file"
4. Click **"Create repository"**

### Bước 3: Upload code lên GitHub

**Mở Git Bash hoặc Terminal trong folder hiện tại** (`E:\Quản lý kỳ thi\Marketing`)

Copy và paste từng lệnh sau (nhấn Enter sau mỗi lệnh):

```bash
# 1. Khởi tạo Git
git init

# 2. Thêm các file
git add dashboard.html index.html styles.css script.js data.js README.md .gitignore

# 3. Commit
git commit -m "First commit: Marketing Dashboard 2026"

# 4. Đổi tên branch thành main
git branch -M main

# 5. Kết nối với GitHub (THAY [YOUR-USERNAME] bằng tên GitHub của bạn)
git remote add origin https://github.com/[YOUR-USERNAME]/marketing-dashboard.git

# 6. Push code lên GitHub
git push -u origin main
```

**Lưu ý:** 
- Khi push, GitHub sẽ yêu cầu đăng nhập
- Dùng **Personal Access Token** thay vì password (hướng dẫn bên dưới nếu cần)

### Bước 4: Bật GitHub Pages

1. Vào repository vừa tạo trên GitHub: `https://github.com/[YOUR-USERNAME]/marketing-dashboard`
2. Click tab **"Settings"** (ở menu trên)
3. Tìm **"Pages"** ở menu bên trái
4. Tại mục **"Source"**:
   - Branch: chọn **main**
   - Folder: chọn **/ (root)**
5. Click **"Save"**

### Bước 5: Đợi và lấy link

- Đợi 1-2 phút
- Refresh lại trang
- Link sẽ xuất hiện: `https://[YOUR-USERNAME].github.io/marketing-dashboard/dashboard.html`

🎉 **XONG! Bạn có thể mở link này trên bất kỳ thiết bị nào!**

---

## ✅ CÁCH 2: Netlify (Nhanh hơn, không cần Git)

### Bước 1: Tạo tài khoản Netlify
1. Truy cập: https://www.netlify.com
2. Click **"Sign up"**
3. Đăng ký bằng Email hoặc GitHub

### Bước 2: Deploy

**Option A: Kéo thả (Drag & Drop)**
1. Sau khi đăng nhập, kéo thả folder `E:\Quản lý kỳ thi\Marketing` vào trang
2. Đợi 30 giây
3. Nhận link ngay: `https://random-name.netlify.app`

**Option B: Deploy từ GitHub**
1. Click **"Add new site"** → **"Import an existing project"**
2. Chọn **"Deploy with GitHub"**
3. Chọn repository `marketing-dashboard`
4. Click **"Deploy site"**

### Bước 3: Đổi tên link (Tùy chọn)
1. Vào Site settings → Site details
2. Click **"Change site name"**
3. Đổi thành tên dễ nhớ: `marketing-dashboard-2026`
4. Link mới: `https://marketing-dashboard-2026.netlify.app`

---

## ✅ CÁCH 3: Vercel (Giống Netlify)

1. Truy cập: https://vercel.com/new
2. Đăng nhập bằng GitHub
3. Import repository `marketing-dashboard`
4. Click **"Deploy"**
5. Nhận link: `https://marketing-dashboard.vercel.app`

---

## 🔑 Tạo GitHub Personal Access Token (Nếu cần)

Nếu Git yêu cầu token khi push:

1. Vào: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Điền:
   - Note: `Marketing Dashboard`
   - Expiration: `No expiration` hoặc `90 days`
   - Tick: ✅ **repo** (tất cả các ô trong repo)
4. Click **"Generate token"**
5. **COPY TOKEN NGAY** (chỉ hiện 1 lần!)
6. Khi Git hỏi password, dán token vào

---

## 📱 Sử dụng trên điện thoại

Sau khi có link:
1. Mở link trên trình duyệt điện thoại
2. **Thêm vào màn hình chính** (Add to Home Screen):
   - iPhone: Safari → Share → Add to Home Screen
   - Android: Chrome → Menu (3 chấm) → Add to Home screen
3. Dùng như một app!

---

## 🔄 Cập nhật Dashboard sau này

Khi muốn cập nhật nội dung:

```bash
# 1. Sửa file dashboard.html
# 2. Mở Git Bash và chạy:
git add .
git commit -m "Cập nhật dữ liệu"
git push

# Website sẽ tự động cập nhật sau 1-2 phút
```

---

## ❓ Gặp vấn đề?

### Lỗi: "git not found"
- Tải Git tại: https://git-scm.com/downloads
- Cài đặt và khởi động lại máy

### Lỗi: "Permission denied"
- Dùng Personal Access Token thay vì password
- Xem hướng dẫn tạo token ở trên

### Lỗi: "Repository not found"
- Kiểm tra lại tên repository
- Đảm bảo đã thay [YOUR-USERNAME] bằng username GitHub của bạn

---

## 💡 Khuyến nghị

**Nếu bạn:**
- Chưa quen Git → Dùng **Netlify Drag & Drop** (Cách 2)
- Muốn miễn phí mãi mãi → Dùng **GitHub Pages** (Cách 1)
- Muốn nhanh nhất → Dùng **Netlify** hoặc **Vercel**

**TỐT NHẤT:** Làm theo Cách 1 (GitHub Pages) để học thêm Git và có thể tự update sau này!
