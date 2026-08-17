# Dashboard Tiến Độ Marketing 2026

Dashboard web responsive để theo dõi tiến độ công việc Marketing, có thể xem trên mọi thiết bị.

## 🚀 Tính năng

- ✅ Hiển thị thống kê tổng quan (Hoàn thành, Đang làm, Chưa bắt đầu)
- 📊 Hiển thị tiến độ % hoàn thành
- 🔍 Lọc công việc theo trạng thái
- 📱 Responsive - xem tốt trên điện thoại
- 🎨 Giao diện đẹp, hiện đại

## 📋 Cách cập nhật dữ liệu từ Excel

### Phương pháp 1: Chuyển Excel sang JSON (Khuyến nghị)

1. Truy cập: https://www.convertcsv.com/excel-to-json.htm
2. Upload file `Bảng theo dõi tiến độ công việc Marketing 2026.xlsx`
3. Chọn định dạng JSON
4. Copy kết quả và paste vào file `data.js`
5. Cập nhật file `script.js` để đọc dữ liệu từ `data.js`

### Phương pháp 2: Sử dụng Google Sheets API

1. Upload file Excel lên Google Sheets
2. Publish as web
3. Sử dụng API để fetch dữ liệu trực tiếp

### Phương pháp 3: Thủ công

Chỉnh sửa mảng `tasksData` trong file `script.js` theo cấu trúc:

\`\`\`javascript
{
    id: 1,
    title: "Tên công việc",
    status: "completed" | "inprogress" | "pending",
    description: "Mô tả",
    deadline: "YYYY-MM-DD",
    assignee: "Người phụ trách"
}
\`\`\`

## 🌐 Cách deploy (Public lên internet)

### Option 1: GitHub Pages (Miễn phí, Dễ nhất)

1. Tạo repository mới trên GitHub
2. Upload các file: `index.html`, `styles.css`, `script.js`, `data.js`
3. Vào Settings → Pages
4. Chọn branch `main` → Save
5. Website sẽ có địa chỉ: `https://[username].github.io/[repo-name]`

### Option 2: Netlify (Miễn phí, Nhanh)

1. Truy cập: https://www.netlify.com
2. Đăng ký tài khoản miễn phí
3. Kéo thả folder chứa các file vào Netlify
4. Nhận link website ngay lập tức

### Option 3: Vercel (Miễn phí, Chuyên nghiệp)

1. Truy cập: https://vercel.com
2. Đăng ký tài khoản
3. Import project hoặc kéo thả folder
4. Deploy tự động

### Option 4: Firebase Hosting (Miễn phí)

\`\`\`bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
\`\`\`

## 📱 Test trên điện thoại

Sau khi deploy, bạn có thể:
- Mở link trên trình duyệt điện thoại
- Thêm vào màn hình chính (Add to Home Screen) để dùng như app
- Share link cho team

## 🛠️ Tùy chỉnh

### Thay đổi màu sắc
Chỉnh sửa file `styles.css`:
- Background gradient: dòng 9-10
- Màu status: dòng 76-86

### Thêm tính năng
- Thêm biểu đồ: Sử dụng Chart.js
- Thêm tìm kiếm: Thêm input search
- Thêm xuất báo cáo: Tích hợp PDF export

## 📞 Hỗ trợ

Nếu cần hỗ trợ thêm, hãy:
1. Kiểm tra Console trong trình duyệt (F12)
2. Đảm bảo dữ liệu trong `script.js` đúng định dạng
3. Test trên localhost trước khi deploy

## 📄 License

Free to use
