# 📊 HƯỚNG DẪN NHẬP DỮ LIỆU TỪ EXCEL

## ✅ Tính năng mới

Dashboard giờ có thể nhập dữ liệu trực tiếp từ file Excel (.xlsx, .xls)!

## 📋 Cấu trúc file Excel

File Excel của bạn cần có các cột sau (tên cột tiếng Việt hoặc tiếng Anh đều được):

### Các cột bắt buộc:

| Tiếng Việt | Tiếng Anh | Ví dụ |
|------------|-----------|-------|
| Tên công việc | Task / Title | Lập kế hoạch Q1 |
| Người phụ trách | Assignee / Owner | Nguyễn Văn A |
| Deadline / Ngày deadline | Deadline | 15/01/2026 |
| Trạng thái | Status | Hoàn thành |

### Các cột tùy chọn:

| Tên cột | Ví dụ |
|---------|-------|
| Mô tả / Description | Hoàn thành kế hoạch marketing chi tiết |
| Tiến độ % / Progress | 75 |
| Ghi chú | Cần review với team |

## 📝 Ví dụ cấu trúc Excel

```
| Tên công việc          | Người phụ trách | Deadline   | Trạng thái      | Mô tả                    | Tiến độ % |
|------------------------|-----------------|------------|-----------------|--------------------------|-----------|
| Lập kế hoạch Q1        | Nguyễn Văn A    | 15/01/2026 | Hoàn thành      | Kế hoạch chi tiết Q1     | 100       |
| Thiết kế banner        | Trần Thị B      | 20/01/2026 | Đang thực hiện  | 10 mẫu banner Facebook   | 60        |
| Phân tích đối thủ      | Lê Văn C        | 25/01/2026 | Chưa bắt đầu    | Phân tích 5 đối thủ      | 0         |
```

## 🔄 Cách nhập dữ liệu

### Bước 1: Chuẩn bị file Excel
1. Mở file Excel của bạn (`Bảng theo dõi tiến độ công việc Marketing 2026.xlsx`)
2. Đảm bảo có các cột như trên
3. Dữ liệu bắt đầu từ dòng 2 (dòng 1 là tiêu đề)

### Bước 2: Nhập vào Dashboard
1. Mở Dashboard: https://tranvananh152003-glitch.github.io/marketing-dashboard/dashboard.html
2. Click nút **"📊 Nhập Excel"**
3. Chọn file Excel của bạn
4. Xem preview và xác nhận
5. Xong!

## 📖 Quy tắc chuyển đổi

### Trạng thái:
- **"Hoàn thành", "Completed", "Done"** → Hoàn thành (100%)
- **"Đang thực hiện", "Đang làm", "Progress", "Doing"** → Đang thực hiện (50%)
- **Còn lại** → Chưa bắt đầu (0%)

### Ngày tháng:
- Hỗ trợ: DD/MM/YYYY, YYYY-MM-DD, Excel date number
- Nếu không có deadline → Dùng ngày hiện tại

### Tiến độ:
- Số từ 0-100
- Nếu không có → Tự động theo trạng thái

## 💡 Lưu ý

1. **Nhập Excel sẽ GHI ĐÈ** dữ liệu hiện tại
   - Nên xuất backup trước (nút "💾 Xuất dữ liệu")

2. **Sheet đầu tiên** sẽ được đọc
   - Nếu có nhiều sheet, đặt dữ liệu ở sheet đầu

3. **Tên cột linh hoạt**:
   - "Tên công việc" = "Công việc" = "Task" = "Title"
   - "Người phụ trách" = "Assignee" = "Owner"
   - Không phân biệt hoa thường

4. **Dòng trống** sẽ bị bỏ qua

## 🔧 Xử lý lỗi

### Lỗi "File Excel không có dữ liệu"
→ Kiểm tra sheet có dữ liệu từ dòng 2 trở đi

### Lỗi "Lỗi khi đọc file Excel"
→ Đảm bảo file đúng định dạng .xlsx hoặc .xls
→ Thử Save As → Excel Workbook (.xlsx)

### Dữ liệu nhập vào bị sai
→ Kiểm tra tên các cột có đúng không
→ Xem Console (F12) để debug

## 🎯 Ví dụ thực tế

Nếu file Excel của bạn có cấu trúc:
```
| STT | Công việc           | Phụ trách    | Hạn chót   | Tình trạng |
|-----|---------------------|--------------|------------|------------|
| 1   | Setup GA4           | Mai          | 20/1/2026  | Xong       |
| 2   | Viết content        | Hùng         | 25/1/2026  | Đang làm   |
```

Chỉ cần đổi tên cột:
- "Công việc" → OK (tự động nhận)
- "Phụ trách" → Đổi thành "Người phụ trách" hoặc "Assignee"
- "Hạn chót" → Đổi thành "Deadline"
- "Tình trạng" → Đổi thành "Trạng thái"

Hoặc giữ nguyên và app sẽ tự map!

## ✨ Hoàn thành!

Sau khi nhập xong, bạn có thể:
- ✏️ Sửa trực tiếp trên web
- 🔄 Chuyển đổi trạng thái nhanh
- 💾 Xuất lại thành JSON
- 📱 Xem trên điện thoại

---

**Link Dashboard:** https://tranvananh152003-glitch.github.io/marketing-dashboard/dashboard.html
