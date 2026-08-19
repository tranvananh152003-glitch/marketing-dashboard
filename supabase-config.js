// ============================================
// CẤU HÌNH SUPABASE
// ============================================
// Thay thế bằng thông tin project của bạn
// Lấy từ: Project Settings > API

const SUPABASE_URL = 'https://mtzkanuzjeaoejahwmmm.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10emthbnV6amVhb2VqYWh3bW1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwOTM1NjcsImV4cCI6MjEwMjY2OTU2N30.Darv0i4Tfabeqit_OERNxISrf9W-eqCYKABaFFitBBw'

// Khởi tạo Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
