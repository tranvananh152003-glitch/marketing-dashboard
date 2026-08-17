// Dữ liệu mẫu - Bạn sẽ cần thay thế bằng dữ liệu thực từ Excel
const tasksData = [
    {
        id: 1,
        title: "Lập kế hoạch chiến dịch Q1",
        status: "completed",
        description: "Hoàn thành kế hoạch marketing cho quý 1/2026",
        deadline: "2026-01-15",
        assignee: "Nguyễn Văn A"
    },
    {
        id: 2,
        title: "Thiết kế banner quảng cáo",
        status: "inprogress",
        description: "Thiết kế các banner cho chiến dịch social media",
        deadline: "2026-01-20",
        assignee: "Trần Thị B"
    },
    {
        id: 3,
        title: "Phân tích đối thủ cạnh tranh",
        status: "pending",
        description: "Nghiên cứu và phân tích chiến lược của đối thủ",
        deadline: "2026-01-25",
        assignee: "Lê Văn C"
    },
    {
        id: 4,
        title: "Viết content cho website",
        status: "inprogress",
        description: "Cập nhật nội dung trang chủ và landing page",
        deadline: "2026-01-18",
        assignee: "Phạm Thị D"
    },
    {
        id: 5,
        title: "Chuẩn bị báo cáo tháng 12",
        status: "completed",
        description: "Tổng hợp kết quả marketing tháng 12/2025",
        deadline: "2026-01-05",
        assignee: "Nguyễn Văn A"
    }
];

// Cập nhật thống kê
function updateStats() {
    const completed = tasksData.filter(t => t.status === 'completed').length;
    const inProgress = tasksData.filter(t => t.status === 'inprogress').length;
    const pending = tasksData.filter(t => t.status === 'pending').length;
    const total = tasksData.length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    document.getElementById('completedTasks').textContent = completed;
    document.getElementById('inProgressTasks').textContent = inProgress;
    document.getElementById('pendingTasks').textContent = pending;
    document.getElementById('progressPercent').textContent = percent + '%';
    document.getElementById('lastUpdate').textContent = new Date().toLocaleString('vi-VN');
}

// Hiển thị danh sách công việc
function renderTasks(filter = 'all') {
    const container = document.getElementById('tasksContainer');
    let filteredTasks = tasksData;

    if (filter !== 'all') {
        filteredTasks = tasksData.filter(task => task.status === filter);
    }

    container.innerHTML = filteredTasks.map(task => `
        <div class="task-card ${task.status}">
            <div class="task-header">
                <div class="task-title">${task.title}</div>
                <span class="task-status ${task.status}">
                    ${getStatusText(task.status)}
                </span>
            </div>
            <div class="task-info">${task.description}</div>
            <div class="task-meta">
                <span>📅 ${formatDate(task.deadline)}</span>
                <span>👤 ${task.assignee}</span>
            </div>
        </div>
    `).join('');
}

// Chuyển đổi trạng thái sang tiếng Việt
function getStatusText(status) {
    const statusMap = {
        'completed': 'Hoàn thành',
        'inprogress': 'Đang thực hiện',
        'pending': 'Chưa bắt đầu'
    };
    return statusMap[status] || status;
}

// Format ngày tháng
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
}

// Xử lý bộ lọc
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        const filter = e.target.dataset.filter;
        renderTasks(filter);
    });
});

// Khởi tạo
updateStats();
renderTasks();
