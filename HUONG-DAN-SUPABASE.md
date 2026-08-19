# 🚀 HƯỚNG DẪN TÍCH HỢP SUPABASE

## Bước 1: Tạo tài khoản và project Supabase

1. Truy cập https://supabase.com
2. Đăng ký tài khoản miễn phí (có thể dùng GitHub)
3. Tạo project mới:
   - Click "New Project"
   - Điền tên project: `marketing-dashboard`
   - Tạo mật khẩu database (lưu lại)
   - Chọn region gần nhất (Singapore)
   - Click "Create new project"

## Bước 2: Tạo bảng dữ liệu

### Vào SQL Editor và chạy câu lệnh sau:

```sql
-- Xóa bảng cũ nếu đã tồn tại (cẩn thận: sẽ mất dữ liệu!)
DROP TABLE IF EXISTS tasks CASCADE;

-- Tạo bảng tasks
CREATE TABLE tasks (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  deadline DATE,
  assignee TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Thêm dữ liệu mẫu
INSERT INTO tasks (title, description, status, deadline, assignee) VALUES
('Lập kế hoạch chiến dịch Q1', 'Hoàn thành kế hoạch marketing cho quý 1/2026', 'completed', '2026-01-15', 'Nguyễn Văn A'),
('Thiết kế banner quảng cáo', 'Thiết kế các banner cho chiến dịch social media', 'inprogress', '2026-01-20', 'Trần Thị B'),
('Phân tích đối thủ cạnh tranh', 'Nghiên cứu và phân tích chiến lược của đối thủ', 'pending', '2026-01-25', 'Lê Văn C'),
('Viết content cho website', 'Cập nhật nội dung trang chủ và landing page', 'inprogress', '2026-01-18', 'Phạm Thị D'),
('Chuẩn bị báo cáo tháng 12', 'Tổng hợp kết quả marketing tháng 12/2025', 'completed', '2026-01-05', 'Nguyễn Văn A');

-- Tạo function tự động cập nhật updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Xóa trigger cũ nếu tồn tại
DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;

-- Tạo trigger
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Bước 3: Cấu hình Row Level Security (RLS)

```sql
-- Bật RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Xóa các policy cũ nếu đã tồn tại (tránh lỗi khi chạy lại)
DROP POLICY IF EXISTS "Allow public read access" ON tasks;
DROP POLICY IF EXISTS "Allow public insert access" ON tasks;
DROP POLICY IF EXISTS "Allow public update access" ON tasks;
DROP POLICY IF EXISTS "Allow public delete access" ON tasks;

-- Tạo policy cho phép đọc công khai
CREATE POLICY "Allow public read access" ON tasks
FOR SELECT USING (true);

-- Tạo policy cho phép ghi công khai (chỉ dùng cho demo, nên hạn chế trong production)
CREATE POLICY "Allow public insert access" ON tasks
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access" ON tasks
FOR UPDATE USING (true);

CREATE POLICY "Allow public delete access" ON tasks
FOR DELETE USING (true);
```

**⚠️ Lưu ý bảo mật:** Các policy trên cho phép truy cập công khai. Trong môi trường thực tế, nên thêm authentication.

## Bước 4: Lấy API Keys

1. Vào **Project Settings** (biểu tượng bánh răng)
2. Chọn **API**
3. Copy 2 giá trị:
   - **Project URL** (URL)
   - **anon public** key

## Bước 5: Cập nhật code

Tạo file `supabase-config.js`:

```javascript
// Thay thế bằng URL và key của bạn
const SUPABASE_URL = 'https://your-project.supabase.co'
const SUPABASE_KEY = 'your-anon-key-here'
```

## Bước 6: Chạy website

1. Mở file `dashboard-supabase.html` trong trình duyệt
2. Dữ liệu sẽ tự động load từ Supabase
3. Có thể thêm, sửa, xóa công việc trực tiếp

## Tính năng của Supabase

✅ **Realtime**: Tự động cập nhật khi có thay đổi  
✅ **Miễn phí**: 500MB database, 1GB bandwidth/ngày  
✅ **PostgreSQL**: Database mạnh mẽ  
✅ **REST API**: Tự động tạo API  
✅ **Authentication**: Có sẵn hệ thống đăng nhập  

## Cấu trúc trạng thái

- `pending`: Chưa bắt đầu
- `inprogress`: Đang thực hiện  
- `completed`: Hoàn thành

## Import dữ liệu từ Excel

### Cách 1: Qua SQL Editor
```sql
INSERT INTO tasks (title, description, status, deadline, assignee)
VALUES
('Tên công việc', 'Mô tả', 'pending', '2026-02-01', 'Người làm'),
('Công việc 2', 'Mô tả 2', 'inprogress', '2026-02-05', 'Người 2');
```

### Cách 2: Qua Dashboard
1. Vào Table Editor
2. Click "Insert row"
3. Điền thông tin
4. Save

## Troubleshooting

**Lỗi: Failed to fetch**
- Kiểm tra URL và API key
- Kiểm tra RLS policies
- Mở Console (F12) xem lỗi chi tiết

**Không thấy dữ liệu**
- Kiểm tra bảng đã có dữ liệu chưa
- Kiểm tra RLS policy cho phép đọc

**Không thêm được dữ liệu**
- Kiểm tra RLS policy cho phép insert/update
- Kiểm tra required fields

## Nâng cao

### Thêm authentication
```javascript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password'
})
```

### Realtime subscription
```javascript
supabase
  .channel('tasks')
  .on('postgres_changes', { 
    event: '*', 
    schema: 'public', 
    table: 'tasks' 
  }, payload => {
    console.log('Change received!', payload)
    loadTasks() // Reload dữ liệu
  
## Liên kết hữu ích

- 📚 Docs: https://supabase.com/docs
- 🎓 Tutorials: https://supabase.com/docs/guides
- 💬 Discord: https://discord.supabase.com
