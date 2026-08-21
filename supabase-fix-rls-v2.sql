-- FIX RLS cho public access
-- Chạy script này trong Supabase SQL Editor

-- 1. Xóa tất cả policies cũ
DROP POLICY IF EXISTS "Enable read access for all users" ON tasks;
DROP POLICY IF EXISTS "Enable insert access for all users" ON tasks;
DROP POLICY IF EXISTS "Enable update access for all users" ON tasks;
DROP POLICY IF EXISTS "Enable delete access for all users" ON tasks;
DROP POLICY IF EXISTS "Allow public read" ON tasks;
DROP POLICY IF EXISTS "Allow public insert" ON tasks;
DROP POLICY IF EXISTS "Allow public update" ON tasks;
DROP POLICY IF EXISTS "Allow public delete" ON tasks;

-- 2. Tạo policies mới cho phép TẤT CẢ operations
CREATE POLICY "Allow all read" ON tasks
    FOR SELECT
    USING (true);

CREATE POLICY "Allow all insert" ON tasks
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow all update" ON tasks
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow all delete" ON tasks
    FOR DELETE
    USING (true);

-- 3. Đảm bảo RLS được bật
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- 4. Kiểm tra policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'tasks';
