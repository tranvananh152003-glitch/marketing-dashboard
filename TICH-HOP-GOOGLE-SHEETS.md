# Tích hợp Google Sheets - HOÀN TẤT NGAY

## ✅ Sheet đã sẵn sàng!
Sheet ID: `1CQcOkc79SiDEo7Z67kquadKD3Bc6NEAcPxtlQYFi6iw`

## 🔧 Cách 1: Tự tích hợp (10 phút)

### Bước 1: Mở file dashboard-v2.html
Tìm dòng có `<!-- Firebase SDK -->` (khoảng dòng 8-9)

### Bước 2: THAY THẾ toàn bộ từ dòng `<!-- Firebase SDK -->` đến dòng `</script>` tiếp theo bằng:

```html
<script>
const SHEET_ID = '1CQcOkc79SiDEo7Z67kquadKD3Bc6NEAcPxtlQYFi6iw';
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/gviz/tq?tqx=out:json';

window.sheetsAPI = {
    async loadFromSheets() {
        try {
            const response = await fetch(SHEET_URL);
            const text = await response.text();
            const json = JSON.parse(text.substring(47).slice(0, -2));
            const rows = json.table.rows;
            
            const data = [];
            rows.slice(1).forEach(row => {
                if (row.c && row.c[0] && row.c[0].v) {
                    data.push({
                        id: row.c[0]?.v || Date.now(),
                        group: row.c[1]?.v || '',
                        program: row.c[2]?.v || '',
                        title: row.c[3]?.v || '',
                        description: row.c[4]?.v || '',
                        coordinator: row.c[5]?.v || '',
                        assignee: row.c[6]?.v || '',
                        approver: row.c[7]?.v || '',
                        deadline: row.c[8]?.v || '',
                        frequency: row.c[9]?.v || '',
                        requiredOutput: row.c[10]?.v || '',
                        status: row.c[11]?.v || 'pending',
                        progress: parseInt(row.c[12]?.v || 0),
                        submissionLink: row.c[13]?.v || '',
                        submissionNote: row.c[14]?.v || ''
                    });
                }
            });
            return data;
        } catch (error) {
            console.error('Lỗi load:', error);
            return null;
        }
    }
};
</script>
```

### Bước 3: Tìm function `loadData()` (khoảng dòng 560-570)
THAY THẾ toàn bộ function bằng:

```javascript
async function loadData() {
    const data = await window.sheetsAPI.loadFromSheets();
    if (data && data.length > 0) {
        tasksData = data;
    } else {
        const saved = localStorage.getItem('marketingTasksV2');
        if (saved) {
            tasksData = JSON.parse(saved);
        } else {
            tasksData = defaultData;
        }
    }
    checkRecurringTasks();
    checkOverdueTasks();
}
```

### Bước 4: Lưu file, commit, push
```bash
git add dashboard-v2.html
git commit -m "Integrate Google Sheets API"
git push
```

---

## 🚀 Cách 2: Gửi file cho developer (NHANH NHẤT!)

Nếu bạn không muốn tự sửa:
1. Tải file `dashboard-v2.html` về máy
2. Gửi qua email/chat cho developer
3. Developer sẽ tích hợp và gửi lại trong 15 phút!

---

## ✅ Sau khi hoàn thành

Dashboard sẽ:
- ✅ Tự động đọc dữ liệu từ Google Sheet
- ✅ Mọi người cùng xem chung
- ✅ Cập nhật bằng cách edit Sheet hoặc Import Excel
- ✅ Dễ dàng backup (download Sheet)

---

## 📝 Cách sử dụng

**Xem dữ liệu:**
- Dashboard tự động load từ Sheet mỗi khi mở

**Thêm dữ liệu:**
- Dùng nút "Import Excel" trên dashboard
- Hoặc thêm trực tiếp vào Google Sheet

**Sửa dữ liệu:**
- Sửa trực tiếp trong Google Sheet
- Refresh dashboard (F5) để cập nhật

---

## ⚠️ Lưu ý

- Sheet phải có quyền "Editor" (đã setup rồi ✅)
- Dòng 1 phải là header (đã có rồi ✅)
- Dashboard chỉ ĐỌC từ Sheet (không ghi vào)
- Để thêm dữ liệu: dùng Import Excel hoặc edit Sheet trực tiếp

---

Bạn chọn Cách 1 hay Cách 2?
