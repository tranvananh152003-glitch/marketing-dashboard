// File này chứa dữ liệu từ Excel
// Bạn có thể chuyển đổi file Excel sang JSON và cập nhật vào đây

// Hướng dẫn chuyển đổi Excel sang JSON:
// 1. Mở file Excel online tại: https://www.convertcsv.com/excel-to-json.htm
// 2. Upload file Excel của bạn
// 3. Convert sang JSON
// 4. Copy dữ liệu JSON và paste vào đây

// Ví dụ cấu trúc dữ liệu:
const marketingTasks = [
    {
        "STT": 1,
        "Tên công việc": "Lập kế hoạch chiến dịch Q1",
        "Mô tả": "Hoàn thành kế hoạch marketing cho quý 1/2026",
        "Người phụ trách": "Nguyễn Văn A",
        "Ngày bắt đầu": "2026-01-01",
        "Deadline": "2026-01-15",
        "Trạng thái": "Hoàn thành",
        "Tiến độ %": 100,
        "Ghi chú": ""
    },
    // Thêm các task khác...
];

// Export để sử dụng trong script.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = marketingTasks;
}
