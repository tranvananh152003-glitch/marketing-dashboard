# HƯỚNG DẪN TẮT RLS (Row Level Security)

## Cách 1: Dùng SQL (Nhanh nhất)

1. Vào: https://supabase.com/dashboard/project/mtzkanuzjeaoejahwmmm/sql/new

2. Copy paste đoạn này:
```sql
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
```

3. Bấm nút **RUN** (màu xanh)

4. Xong! Giờ có thể import Excel

---

## Cách 2: Dùng giao diện

1. Vào: https://supabase.com/dashboard/project/mtzkanuzjeaoejahwmmm/auth/policies

2. Tìm bảng **tasks** trong danh sách

3. Nhìn cột "RLS enabled" → nếu có dấu ✓ thì RLS đang BẬT

4. Bấm vào hàng **tasks**

5. Tìm toggle switch **"Enable RLS"** → TẮT nó đi

6. Xong!

---

## Sau khi tắt RLS xong:

Quay lại dashboard và import Excel:
https://tranvananh152003-glitch.github.io/marketing-dashboard/dashboard-supabase-clean.html

Bấm nút **"📊 Nhập Excel"** → Chọn file Excel → Đợi upload

---

## Kiểm tra đã tắt RLS chưa:

Chạy SQL này để kiểm tra:
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'tasks';
```

Nếu `rowsecurity = false` → RLS đã tắt ✅
Nếu `rowsecurity = true` → RLS vẫn còn bật ❌
