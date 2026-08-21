# HƯỚNG DẪN SETUP SUPABASE STORAGE

Để có thể upload file khi nộp bài, cần tạo bucket trong Supabase Storage.

## Bước 1: Tạo Storage Bucket

1. Vào Supabase Dashboard: https://supabase.com/dashboard/project/mtzkanuzjeaoejahwmmm

2. Chọn **Storage** ở menu bên trái

3. Bấm **New bucket**

4. Điền thông tin:
   - **Name:** `task-files`
   - **Public bucket:** ✅ BẬT (để có thể tải file xuống)
   - **File size limit:** 50MB (hoặc tùy chọn)
   - **Allowed MIME types:** Để trống (cho phép mọi file)

5. Bấm **Create bucket**

## Bước 2: Setup Storage Policy (cho phép upload)

Chạy SQL này trong SQL Editor:

```sql
-- Cho phép mọi người upload file
CREATE POLICY "Allow public uploads" ON storage.objects
    FOR INSERT
    WITH CHECK (bucket_id = 'task-files');

-- Cho phép mọi người xem file
CREATE POLICY "Allow public read" ON storage.objects
    FOR SELECT
    USING (bucket_id = 'task-files');

-- Cho phép mọi người xóa file (tùy chọn)
CREATE POLICY "Allow public delete" ON storage.objects
    FOR DELETE
    USING (bucket_id = 'task-files');
```

## Bước 3: Test

1. Vào dashboard: https://tranvananh152003-glitch.github.io/marketing-dashboard/
2. Thử nộp bài với file đính kèm
3. File sẽ được upload và có link tải xuống

## Nếu không muốn dùng Storage

Chỉ nhập **Link** hoặc **Ghi chú**, không upload file.

Ví dụ:
- Link: https://drive.google.com/file/d/xxx
- Ghi chú: "Đã gửi qua email"
