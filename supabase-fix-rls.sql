-- =====================================================
-- FIX SUPABASE RLS - CHO PHÉP MỌI NGƯỜI TRUY CẬP
-- =====================================================
-- Chạy script này trong Supabase SQL Editor
-- để cho phép mọi người xem và chỉnh sửa dữ liệu

-- Bật RLS cho bảng tasks
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Xóa tất cả policy cũ
DROP POLICY IF EXISTS "Allow public read access" ON tasks;
DROP POLICY IF EXISTS "Allow public insert access" ON tasks;
DROP POLICY IF EXISTS "Allow public update access" ON tasks;
DROP POLICY IF EXISTS "Allow public delete access" ON tasks;
DROP POLICY IF EXISTS "Enable read access for all users" ON tasks;
DROP POLICY IF EXISTS "Enable insert access for all users" ON tasks;
DROP POLICY IF EXISTS "Enable update access for all users" ON tasks;
DROP POLICY IF EXISTS "Enable delete access for all users" ON tasks;

-- Tạo policy MỚI cho phép truy cập công khai
CREATE POLICY "Enable read access for all users" 
ON tasks FOR SELECT 
USING (true);

CREATE POLICY "Enable insert access for all users" 
ON tasks FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Enable update access for all users" 
ON tasks FOR UPDATE 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Enable delete access for all users" 
ON tasks FOR DELETE 
USING (true);

-- Kiểm tra policies đã tạo
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'tasks';

-- Test query (nên trả về dữ liệu)
SELECT COUNT(*) as total_tasks FROM tasks;
