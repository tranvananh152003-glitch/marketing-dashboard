# Hướng dẫn Setup Google Sheets làm Database

## 🎯 Mục đích
Dùng Google Sheets làm database để tất cả mọi người cùng xem và chỉnh sửa công việc

---

## 📝 Bước 1: Tạo Google Sheet

1. **Truy cập Google Sheets**
   - Mở: https://sheets.google.com/
   - Đăng nhập tài khoản Google của bạn

2. **Tạo Sheet mới**
   - Click vào **"Blank"** (Sheet trống) hoặc nút **"+"**
   - Đặt tên Sheet: **Marketing Dashboard 2026** (hoặc tên bạn muốn)

3. **Sheet sẽ tự động được tạo** ✅

---

## 📝 Bước 2: Cấu hình cột (Header)

Tại **dòng 1** (hàng đầu tiên), điền các cột theo thứ tự:

| A | B | C | D | E | F | G | H | I | J | K | L | M |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| id | group | program | title | description | coordinator | assignee | approver | deadline | frequency | requiredOutput | status | progress |

**Hoặc copy/paste dòng này vào dòng 1:**
```
id	group	program	title	description	coordinator	assignee	approver	deadline	frequency	requiredOutput	status	progress
```

**Lưu ý:** Các cột này BẮT BUỘC, đúng tên, đúng thứ tự!

---

## 📝 Bước 3: Share Sheet công khai

1. **Click nút "Share"** (Chia sẻ) ở góc phải trên

2. **Thay đổi quyền truy cập:**
   - Click vào **"Change to anyone with the link"** 
   - Hoặc click vào **"Restricted"** → chọn **"Anyone with the link"**

3. **Chọn quyền:**
   - Dropdown bên phải chọn: **"Editor"** (Người chỉnh sửa)
   - KHÔNG chọn "Viewer" (chỉ xem)

4. **Copy link**
   - Click nút **"Copy link"**
   - Click **"Done"**

5. **Kiểm tra link**
   - Link sẽ dạng: `https://docs.google.com/spreadsheets/d/ABCD1234xyz.../edit`
   - Phần `ABCD1234xyz...` là **Sheet ID** (cần phần này)

---

## 📝 Bước 4: Lấy Sheet ID

Từ link vừa copy, lấy phần giữa `/d/` và `/edit`:

**Ví dụ:**
```
https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
```
→ Sheet ID là: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

---

## 📝 Bước 5: Gửi thông tin cho Developer

Gửi cho developer:
1. **Link Google Sheet** (link đầy đủ)
2. **Sheet ID** (phần giữa /d/ và /edit)

**Ví dụ tin nhắn:**
```
Link Sheet: https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
Sheet ID: 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms
```

---

## 📝 Bước 6: Developer tích hợp (không cần làm gì)

Developer sẽ:
1. Thêm Google Sheets API vào dashboard
2. Kết nối với Sheet của bạn
3. Đọc/ghi dữ liệu tự động
4. Test và deploy

**Thời gian:** ~15 phút

---

## 🎉 Sau khi hoàn thành

✅ Dashboard tự động đọc/ghi vào Google Sheet
✅ Mọi người cùng xem chung
✅ Có thể edit trực tiếp trong Sheet nếu cần
✅ Dễ dàng export Excel từ Sheet
✅ Tự động backup (Google tự động lưu lịch sử)

---

## 💡 Tips

**Xem dữ liệu:**
- Mở Google Sheet → thấy tất cả công việc
- Dashboard và Sheet luôn đồng bộ

**Backup thủ công:**
- File → Download → Excel (.xlsx)
- Hoặc: File → Make a copy

**Khôi phục lỗi:**
- File → Version history → xem lại phiên bản cũ

**Thêm dữ liệu thủ công:**
- Thêm dòng mới vào Sheet
- Điền đầy đủ các cột
- Dashboard sẽ tự động load

---

## ⚠️ Lưu ý quan trọng

1. **KHÔNG xóa dòng 1** (header) - sẽ lỗi dashboard
2. **KHÔNG đổi tên cột** - phải đúng tên như hướng dẫn
3. **KHÔNG xóa Sheet** - mất hết dữ liệu
4. **Quyền "Editor"** - phải cho phép edit, không chỉ view
5. **Cột id** - để trống, dashboard tự tạo

---

## 🆘 Xử lý lỗi

**"You need access"**
→ Chưa share công khai, làm lại Bước 3

**Dashboard không load được**
→ Kiểm tra Sheet ID có đúng không

**Dữ liệu không đồng bộ**
→ Refresh lại dashboard (F5)

---

## 📧 Sẵn sàng?

Sau khi làm xong 5 bước trên, gửi cho developer:
- ✅ Link Google Sheet
- ✅ Sheet ID

Developer sẽ tích hợp ngay! 🚀
