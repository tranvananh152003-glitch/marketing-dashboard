# 📊 FILE MẪU EXCEL ĐỂ IMPORT

## 🎯 Cấu trúc bảng Excel

Tạo file Excel với các cột sau (dòng 1 là tiêu đề):

| Nhóm việc | Chương trình | Công việc cụ thể | Người điều phối | Người thực hiện | Người duyệt | Deadline | Tần suất | Đầu ra bắt buộc | Trạng thái | Mô tả |
|-----------|--------------|------------------|-----------------|-----------------|-------------|----------|----------|-----------------|-----------|-------|
| Marketing Online | Social Media | Đăng bài Facebook | Nguyễn Văn A | Trần Thị B | Lê Văn C | 15/01/2026 | Hàng ngày | 1 bài post + 3 ảnh | Hoàn thành | Đăng bài quảng cáo sản phẩm mới |
| Marketing Online | Social Media | Đăng bài Instagram | Nguyễn Văn A | Trần Thị B | Lê Văn C | 15/01/2026 | Hàng ngày | 1 ảnh + caption | Đang thực hiện | Stories và feed |
| Marketing Online | Email Marketing | Gửi newsletter | Phạm Thị D | Hoàng Văn E | Nguyễn Văn A | 20/01/2026 | Hàng tuần | Email template + danh sách | Chưa bắt đầu | Newsletter tuần này |
| Marketing Offline | Sự kiện | Chuẩn bị booth triển lãm | Lê Văn C | Trần Thị B | Nguyễn Văn A | 25/01/2026 | Một lần | Booth hoàn chỉnh + catalog | Đang thực hiện | Triển lãm tháng 2 |
| Content | Blog | Viết bài blog SEO | Hoàng Văn E | Phạm Thị D | Lê Văn C | 18/01/2026 | Hàng tuần | 1 bài 1500 từ | Chưa bắt đầu | Bài về sản phẩm mới |
| Design | Thiết kế | Thiết kế banner quảng cáo | Trần Thị B | Hoàng Văn E | Nguyễn Văn A | 22/01/2026 | Một lần | 10 banner formats khác nhau | Đang thực hiện | Banner cho Facebook Ads |

## 📝 Chi tiết từng cột

### 1. Nhóm việc (Bắt buộc)
- Phân loại công việc theo nhóm lớn
- VD: Marketing Online, Marketing Offline, Content, Design, SEO, Event

### 2. Chương trình (Tùy chọn)
- Tên chương trình/dự án cụ thể
- VD: Social Media, Email Marketing, Facebook Ads, Google Ads

### 3. Công việc cụ thể (Bắt buộc)
- Tên nhiệm vụ chi tiết
- VD: Đăng bài Facebook, Viết blog, Thiết kế banner

### 4. Người điều phối (Bắt buộc)
- Người quản lý/theo dõi công việc
- VD: Nguyễn Văn A

### 5. Người thực hiện (Bắt buộc)
- Người làm công việc
- VD: Trần Thị B

### 6. Người duyệt (Bắt buộc)
- Người phê duyệt kết quả
- VD: Lê Văn C

### 7. Deadline (Bắt buộc)
- Định dạng: DD/MM/YYYY hoặc YYYY-MM-DD
- VD: 15/01/2026 hoặc 2026-01-15

### 8. Tần suất (Bắt buộc)
- Chọn 1 trong 4 giá trị:
  - **Hàng ngày** - Tự động tạo task mới mỗi ngày
  - **Hàng tuần** - Lặp lại hàng tuần
  - **Hàng tháng** - Lặp lại hàng tháng
  - **Một lần** - Chỉ làm 1 lần

### 9. Đầu ra bắt buộc (Bắt buộc)
- Mô tả kết quả cần có
- VD: 1 bài post + 3 ảnh, File PDF báo cáo, 10 banner

### 10. Trạng thái (Tùy chọn)
- Nếu không điền → Mặc định "Chưa bắt đầu"
- Các giá trị hợp lệ:
  - Chưa bắt đầu / Pending
  - Đang thực hiện / In Progress
  - Hoàn thành / Completed

### 11. Mô tả (Tùy chọn)
- Mô tả chi tiết công việc
- Ghi chú thêm

## ✅ Lưu ý quan trọng

### Tên cột linh hoạt:
Dashboard hỗ trợ nhiều tên cột:
- "Nhóm việc" = "Group" = "Nhom viec"
- "Chương trình" = "Program" = "Chuong trinh"
- "Công việc cụ thể" = "Công việc" = "Task" = "Title"
- "Người điều phối" = "Coordinator" = "Điều phối"
- "Người thực hiện" = "Assignee" = "Thực hiện"
- "Người duyệt" = "Approver" = "Duyệt"
- "Đầu ra bắt buộc" = "Required Output" = "Đầu ra"
- "Tần suất" = "Frequency"

### Thêm cột khác:
- Bạn có thể thêm cột khác trong Excel (VD: STT, Ghi chú thêm, Budget...)
- Dashboard chỉ lấy các cột cần thiết, bỏ qua cột thừa
- Không ảnh hưởng đến việc import

### Dòng trống:
- Dòng nào không có "Công việc cụ thể" sẽ bị bỏ qua
- Có thể để dòng trống giữa các nhóm để dễ nhìn

## 🎨 Ví dụ file Excel có thêm cột

| STT | Nhóm việc | Chương trình | Công việc cụ thể | Người điều phối | Người thực hiện | Người duyệt | Deadline | Tần suất | Đầu ra bắt buộc | Budget | Ghi chú thêm |
|-----|-----------|--------------|------------------|-----------------|-----------------|-------------|----------|----------|-----------------|--------|--------------|
| 1 | Marketing Online | Social Media | Đăng bài Facebook | Nguyễn Văn A | Trần Thị B | Lê Văn C | 15/01/2026 | Hàng ngày | 1 bài post | 500k | Chạy ads |
| 2 | Marketing Offline | Sự kiện | Chuẩn bị booth | Lê Văn C | Trần Thị B | Nguyễn Văn A | 25/01/2026 | Một lần | Booth + catalog | 5tr | Triển lãm lớn |

→ Cột STT, Budget, Ghi chú thêm sẽ bị bỏ qua khi import, không ảnh hưởng!

## 📥 Cách import

1. Tạo file Excel theo cấu trúc trên
2. Lưu file (.xlsx hoặc .xls)
3. Vào Dashboard → Click "📊 Nhập Excel"
4. Chọn file vừa tạo
5. Xác nhận import

## 🔄 Công việc lặp lại tự động

Nếu "Tần suất" = "Hàng ngày":
- Dashboard tự động tạo task mới mỗi ngày
- Task cũ vẫn giữ nguyên
- Task mới có deadline = ngày hiện tại
- Trạng thái task mới = "Chưa bắt đầu"

## 💡 Tips

1. **Sử dụng Excel template**: Copy bảng mẫu trên vào Excel
2. **Điền từng dòng**: Mỗi công việc là 1 dòng
3. **Kiểm tra deadline**: Đảm bảo định dạng ngày đúng
4. **Test nhỏ trước**: Import 2-3 dòng test trước khi import hết

## ❓ Troubleshooting

**Lỗi: "File Excel không có dữ liệu"**
→ Kiểm tra dòng 2 trở đi có dữ liệu không

**Lỗi: "Lỗi khi đọc file Excel"**
→ Đảm bảo file đúng định dạng .xlsx hoặc .xls

**Import được nhưng thiếu dữ liệu**
→ Kiểm tra tên cột có đúng không (xem danh sách tên hợp lệ ở trên)

**Deadline hiển thị sai**
→ Dùng định dạng DD/MM/YYYY hoặc YYYY-MM-DD

## 📄 Download file mẫu

Bạn có thể tạo file Excel mới và copy bảng mẫu ở trên, hoặc:

1. Mở Excel
2. Tạo sheet mới
3. Copy các cột tiêu đề từ bảng trên
4. Điền dữ liệu mẫu vào
5. Lưu file: "Danh-sach-cong-viec-marketing.xlsx"

---

**Link Dashboard:** https://tranvananh152003-glitch.github.io/marketing-dashboard/dashboard-v2.html
