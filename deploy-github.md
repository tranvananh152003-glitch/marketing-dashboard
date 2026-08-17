# Hướng dẫn deploy lên GitHub Pages

## Bước 1: Tạo repository trên GitHub
1. Truy cập: https://github.com/new
2. Đặt tên repo (ví dụ: `marketing-dashboard`)
3. Chọn "Public"
4. Click "Create repository"

## Bước 2: Upload code lên GitHub

Mở terminal/Git Bash trong folder này và chạy:

```bash
git init
git add index.html styles.css script.js data.js README.md
git commit -m "Initial dashboard"
git branch -M main
git remote add origin https://github.com/[YOUR-USERNAME]/marketing-dashboard.git
git push -u origin main
```

## Bước 3: Bật GitHub Pages
1. Vào repository trên GitHub
2. Click "Settings"
3. Scroll xuống "Pages" (menu bên trái)
4. Chọn Source: "Deploy from a branch"
5. Chọn Branch: "main" và folder: "/ (root)"
6. Click "Save"

## Bước 4: Đợi 1-2 phút
Link sẽ xuất hiện: `https://[YOUR-USERNAME].github.io/marketing-dashboard`

---

Nếu chưa cài Git, tải tại: https://git-scm.com/downloads
