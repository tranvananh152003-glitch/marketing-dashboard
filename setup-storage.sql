-- CHẠY SQL NÀY ĐỂ SETUP STORAGE

-- Xóa policies cũ nếu có
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete" ON storage.objects;

-- Tạo policies mới
CREATE POLICY "Allow public uploads" ON storage.objects
    FOR INSERT
    TO public
    WITH CHECK (bucket_id = 'task-files');

CREATE POLICY "Allow public read" ON storage.objects
    FOR SELECT
    TO public
    USING (bucket_id = 'task-files');

CREATE POLICY "Allow public delete" ON storage.objects
    FOR DELETE
    TO public
    USING (bucket_id = 'task-files');

-- Kiểm tra
SELECT * FROM storage.buckets WHERE name = 'task-files';
