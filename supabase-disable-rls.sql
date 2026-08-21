-- TẮT RLS hoàn toàn (cho phép mọi người truy cập không hạn chế)
-- CẢNH BÁO: Điều này có nghĩa là KHÔNG CÓ BẢO MẬT!
-- Chỉ dùng cho dự án internal/test

ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;

-- Kiểm tra
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'tasks';
