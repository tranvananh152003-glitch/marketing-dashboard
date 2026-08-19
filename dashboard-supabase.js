let tasksData = [];
let currentView = 'all';
let currentGroup = null;
let currentPerson = null;
let editingId = null;
let selectedTasks = new Set();
let selectionMode = false;

// Load dữ liệu từ Supabase
async function loadTasks() {
    try {
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .order('updated_at', { ascending: false });
        
        if (error) throw error;
        
        tasksData = data || [];
        checkOverdueTasks();
        updateStats();
        switchView(currentView);
    } catch (error) {
        console.error('Lỗi load dữ liệu:', error);
        alert('Không thể tải dữ liệu từ Supabase. Kiểm tra kết nối!');
    }
}

// Kiểm tra quá hạn
function checkOverdueTasks() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    tasksData.forEach(task => {
        if (task.status !== 'completed') {
            const deadline = new Date(task.deadline);
            deadline.setHours(0, 0, 0, 0);
            
            if (deadline < today && task.status !== 'overdue') {
                task.status = 'overdue';
                updateTaskStatus(task.id, 'overdue');
            }
        }
    });
}

// Cập nhật trạng thái task
async function updateTaskStatus(id, status) {
    try {
        const { error } = await supabase
            .from('tasks')
            .update({ status: status, updated_at: new Date().toISOString() })
            .eq('id', id);
        
        if (error) throw error;
    } catch (error) {
        console.error('Lỗi cập nhật trạng thái:', error);
    }
}

// Cập nhật thống kê
function updateStats() {
    const completed = tasksData.filter(t => t.status === 'completed').length;
    const inProgress = tasksData.filter(t => t.status === 'inprogress').length;
    const pending = tasksData.filter(t => t.status === 'pending').length;
    const overdue = tasksData.filter(t => t.status === 'overdue').length;

    document.getElementById('completedTasks').textContent = completed;
    document.getElementById('inProgressTasks').textContent = inProgress;
    document.getElementById('pendingTasks').textContent = pending;
    document.getElementById('overdueTasks').textContent = overdue;
    document.getElementById('lastUpdate').textContent = new Date().toLocaleString('vi-VN');
}

// Chuyển view
function switchView(view) {
    currentView = view;
    currentGroup = null;
    currentPerson = null;
    
    document.querySelectorAll('.view-tab').forEach(tab => tab.classList.remove('active'));
    event?.target?.classList.add('active');
    
    const groupTabs = document.getElementById('groupTabs');
    const personTabs = document.getElementById('personTabs');
    
    groupTabs.style.display = 'none';
    personTabs.style.display = 'none';
    
    if (view === 'all') {
        renderTasks(tasksData);
    } else if (view === 'group') {
        renderGroupTabs();
        groupTabs.style.display = 'flex';
    } else if (view === 'people') {
        renderPersonTabs();
        personTabs.style.display = 'flex';
    }
}

// Render nhóm tabs
function renderGroupTabs() {
    const groups = {};
    tasksData.forEach(task => {
        groups[task.group] = (groups[task.group] || 0) + 1;
    });
    
    const groupNames = Object.keys(groups).sort();
    const groupTabs = document.getElementById('groupTabs');
    
    if (groupNames.length === 0) {
        groupTabs.innerHTML = '<div style="padding:20px;color:#666;">Chưa có nhóm việc</div>';
        renderTasks([]);
        return;
    }
    
    groupTabs.innerHTML = groupNames.map((group, index) => `
        <button class="group-tab ${index === 0 ? 'active' : ''}" onclick="switchGroup('${group.replace(/'/g, "\\'")}')">
            ${group}
            <span class="tab-count">${groups[group]}</span>
        </button>
    `).join('');
    
    if (groupNames.length > 0) {
        switchGroup(groupNames[0]);
    }
}

// Render người tabs
function renderPersonTabs() {
    const people = {};
    tasksData.forEach(task => {
        people[task.assignee] = (people[task.assignee] || 0) + 1;
    });
    
    const personNames = Object.keys(people).sort();
    const personTabs = document.getElementById('personTabs');
    
    if (personNames.length === 0) {
        personTabs.innerHTML = '<div style="padding:20px;color:#666;">Chưa có người thực hiện</div>';
        renderTasks([]);
        return;
    }
    
    personTabs.innerHTML = personNames.map((person, index) => `
        <button class="person-tab ${index === 0 ? 'active' : ''}" onclick="switchPerson('${person.replace(/'/g, "\\'")}')">
            ${person}
            <span class="tab-count">${people[person]}</span>
        </button>
    `).join('');
    
    if (personNames.length > 0) {
        switchPerson(personNames[0]);
    }
}

// Chuyển nhóm
function switchGroup(group) {
    currentGroup = group;
    
    document.querySelectorAll('.group-tab').forEach(tab => {
        tab.classList.toggle('active', tab.textContent.trim().startsWith(group));
    });
    
    const filtered = tasksData.filter(t => t.group === group);
    renderTasks(filtered);
}

// Chuyển người
function switchPerson(person) {
    currentPerson = person;
    
    document.querySelectorAll('.person-tab').forEach(tab => {
        tab.classList.toggle('active', tab.textContent.trim().startsWith(person));
    });
    
    const filtered = tasksData.filter(t => t.assignee === person);
    renderTasks(filtered);
}

// Render tasks
function renderTasks(tasks) {
    const container = document.getElementById('tasksContainer');
    
    if (tasks.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:40px;color:#666;background:white;border-radius:15px;">Không có công việc nào</div>';
        return;
    }
    
    container.innerHTML = tasks.map(task => {
        const statusText = {
            'completed': 'Hoàn thành',
            'inprogress': 'Đang thực hiện',
            'pending': 'Chưa bắt đầu',
            'overdue': 'Quá hạn'
        }[task.status] || task.status;
        
        const hasSubmission = task.submission_link || task.submission_note;
        
        return `
            <div class="task-card ${task.status}">
                <div class="task-actions">
                    <div class="selection-area ${selectionMode ? 'show' : ''}">
                        <input type="checkbox" class="task-checkbox" 
                            ${selectedTasks.has(task.id) ? 'checked' : ''}
                            onchange="toggleTaskSelection(${task.id})">
                    </div>
                    <div class="task-action-btns">
                        <button class="task-action-btn edit" onclick="openEditModal(${task.id})">✏️ Sửa</button>
                        <button class="task-action-btn delete" onclick="deleteTask(${task.id})">🗑️ Xóa</button>
                    </div>
                </div>
                
                <div class="task-status-badge ${task.status}" onclick="cycleStatus(${task.id})">
                    ${statusText}
                </div>
                
                <div class="task-header">
                    <div class="task-group">📁 ${task.group}</div>
                    <div class="task-program">🎯 ${task.program}</div>
                    <div class="task-title">${task.title}</div>
                </div>
                
                ${task.description ? `<div class="task-info">${task.description}</div>` : ''}
                
                <div class="task-meta">
                    <div class="meta-item">👤 Người thực hiện: ${task.assignee}</div>
                    <div class="meta-item">👥 Điều phối: ${task.coordinator}</div>
                    <div class="meta-item">✅ Người duyệt: ${task.approver}</div>
                    <div class="meta-item">📅 Deadline: ${task.deadline}</div>
                    <div class="meta-item">🔁 Tần suất: ${task.frequency}</div>
                    <div class="meta-item">📦 Đầu ra: ${task.required_output}</div>
                </div>
                
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${task.progress || 0}%"></div>
                </div>
                
                ${hasSubmission ? `
                    <div class="submission-section">
                        <div class="submission-label">📤 Đã nộp bài</div>
                        <div class="submission-content">
                            ${task.submission_link ? `<a href="${task.submission_link}" target="_blank" class="submission-link">🔗 ${task.submission_link}</a>` : ''}
                            ${task.submission_note ? `<span class="submission-file">📄 ${task.submission_note}</span>` : ''}
                        </div>
                    </div>
                ` : `
                    <button class="submit-btn" onclick="openSubmitModal(${task.id})">📤 Nộp bài</button>
                `}
            </div>
        `;
    }).join('');
}

// Toggle selection mode
function toggleSelectionMode() {
    selectionMode = !selectionMode;
    const btn = document.getElementById('selectModeBtn');
    
    if (selectionMode) {
        btn.textContent = '✕ Hủy chọn';
        btn.style.background = '#6b7280';
        updateBulkActionsBar();
    } else {
        btn.textContent = '☑️ Chọn nhiều';
        btn.style.background = '#667eea';
        selectedTasks.clear();
        document.getElementById('bulkActionsBar').classList.remove('show');
    }
    
    switchView(currentView);
}

// Exit selection mode
function exitSelectionMode() {
    selectionMode = false;
    selectedTasks.clear();
    const btn = document.getElementById('selectModeBtn');
    btn.textContent = '☑️ Chọn nhiều';
    btn.style.background = '#667eea';
    document.getElementById('bulkActionsBar').classList.remove('show');
    switchView(currentView);
}

// Toggle task selection
function toggleTaskSelection(id) {
    if (selectedTasks.has(id)) {
        selectedTasks.delete(id);
    } else {
        selectedTasks.add(id);
    }
    updateBulkActionsBar();
}

// Update bulk actions bar
function updateBulkActionsBar() {
    const bar = document.getElementById('bulkActionsBar');
    document.getElementById('selectedCount').textContent = selectedTasks.size;
    
    if (selectedTasks.size > 0) {
        bar.classList.add('show');
    } else {
        bar.classList.remove('show');
    }
}

// Select all tasks
function selectAll() {
    const currentTasks = currentView === 'all' ? tasksData :
                        currentView === 'group' ? tasksData.filter(t => t.group === currentGroup) :
                        tasksData.filter(t => t.assignee === currentPerson);
    
    currentTasks.forEach(task => selectedTasks.add(task.id));
    updateBulkActionsBar();
    switchView(currentView);
}

// Bulk complete
async function bulkComplete() {
    if (!confirm(`Đánh dấu hoàn thành ${selectedTasks.size} công việc?`)) return;
    
    try {
        for (const id of selectedTasks) {
            await supabase
                .from('tasks')
                .update({ status: 'completed', progress: 100, updated_at: new Date().toISOString() })
                .eq('id', id);
        }
        
        await loadTasks();
        exitSelectionMode();
    } catch (error) {
        console.error('Lỗi bulk complete:', error);
        alert('Có lỗi xảy ra khi cập nhật!');
    }
}

// Bulk delete
async function bulkDelete() {
    if (!confirm(`Xóa ${selectedTasks.size} công việc?`)) return;
    
    try {
        for (const id of selectedTasks) {
            await supabase
                .from('tasks')
                .delete()
                .eq('id', id);
        }
        
        await loadTasks();
        exitSelectionMode();
    } catch (error) {
        console.error('Lỗi bulk delete:', error);
        alert('Có lỗi xảy ra khi xóa!');
    }
}

// Cycle status
async function cycleStatus(id) {
    const task = tasksData.find(t => t.id === id);
    if (!task) return;
    
    const statusCycle = ['pending', 'inprogress', 'completed'];
    const currentIndex = statusCycle.indexOf(task.status === 'overdue' ? 'pending' : task.status);
    const newStatus = statusCycle[(currentIndex + 1) % statusCycle.length];
    
    try {
        await supabase
            .from('tasks')
            .update({ 
                status: newStatus, 
                progress: newStatus === 'completed' ? 100 : task.progress,
                updated_at: new Date().toISOString() 
            })
            .eq('id', id);
        
        await loadTasks();
    } catch (error) {
        console.error('Lỗi cập nhật trạng thái:', error);
        alert('Không thể cập nhật trạng thái!');
    }
}

// Open add modal
function openAddModal() {
    editingId = null;
    document.getElementById('modalTitle').textContent = 'Thêm công việc mới';
    document.getElementById('taskForm').reset();
    document.getElementById('taskModal').classList.add('active');
}

// Open edit modal
function openEditModal(id) {
    const task = tasksData.find(t => t.id === id);
    if (!task) return;
    
    editingId = id;
    document.getElementById('modalTitle').textContent = 'Sửa công việc';
    
    const form = document.getElementById('taskForm');
    form.group.value = task.group;
    form.program.value = task.program;
    form.title.value = task.title;
    form.description.value = task.description || '';
    form.coordinator.value = task.coordinator;
    form.assignee.value = task.assignee;
    form.approver.value = task.approver;
    form.deadline.value = task.deadline;
    form.frequency.value = task.frequency;
    form.status.value = task.status;
    form.requiredOutput.value = task.required_output;
    form.progress.value = task.progress || 0;
    
    document.getElementById('taskModal').classList.add('active');
}

// Close modal
function closeModal() {
    document.getElementById('taskModal').classList.remove('active');
    editingId = null;
}

// Save task
async function saveTask(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    
    const taskData = {
        group: formData.get('group'),
        program: formData.get('program'),
        title: formData.get('title'),
        description: formData.get('description'),
        coordinator: formData.get('coordinator'),
        assignee: formData.get('assignee'),
        approver: formData.get('approver'),
        deadline: formData.get('deadline'),
        frequency: formData.get('frequency'),
        status: formData.get('status'),
        required_output: formData.get('requiredOutput'),
        progress: parseInt(formData.get('progress')) || 0,
        updated_at: new Date().toISOString()
    };
    
    try {
        if (editingId) {
            await supabase
                .from('tasks')
                .update(taskData)
                .eq('id', editingId);
        } else {
            await supabase
                .from('tasks')
                .insert([taskData]);
        }
        
        await loadTasks();
        closeModal();
    } catch (error) {
        console.error('Lỗi lưu task:', error);
        alert('Không thể lưu công việc!');
    }
}

// Delete task
async function deleteTask(id) {
    if (!confirm('Bạn có chắc muốn xóa công việc này?')) return;
    
    try {
        await supabase
            .from('tasks')
            .delete()
            .eq('id', id);
        
        await loadTasks();
    } catch (error) {
        console.error('Lỗi xóa task:', error);
        alert('Không thể xóa công việc!');
    }
}

// Open submit modal
function openSubmitModal(id) {
    console.log('Opening submit modal for task ID:', id);
    const task = tasksData.find(t => t.id === id);
    console.log('Task found:', task);
    
    const form = document.getElementById('submitForm');
    form.taskId.value = id;
    form.submissionLink.value = '';
    form.submissionNote.value = '';
    document.getElementById('markCompleteCheck').checked = false;
    document.getElementById('submitModal').classList.add('active');
}

// Close submit modal
function closeSubmitModal() {
    document.getElementById('submitModal').classList.remove('active');
}

// Save submission
async function saveSubmission(e) {
    e.preventDefault();
    console.log('saveSubmission called');
    
    const form = e.target;
    const formData = new FormData(form);
    const taskId = parseInt(formData.get('taskId'));
    const markComplete = document.getElementById('markCompleteCheck').checked;
    
    console.log('Task ID:', taskId);
    console.log('Mark Complete:', markComplete);
    console.log('Submission Link:', formData.get('submissionLink'));
    console.log('Submission Note:', formData.get('submissionNote'));
    
    const updateData = {
        submission_link: formData.get('submissionLink'),
        submission_note: formData.get('submissionNote'),
        updated_at: new Date().toISOString()
    };
    
    if (markComplete) {
        updateData.status = 'completed';
        updateData.progress = 100;
    }
    
    console.log('Update data:', updateData);
    
    try {
        const { data, error } = await supabase
            .from('tasks')
            .update(updateData)
            .eq('id', taskId)
            .select();
        
        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }
        
        console.log('Update successful:', data);
        await loadTasks();
        closeSubmitModal();
        alert('Nộp bài thành công!');
    } catch (error) {
        console.error('Lỗi nộp bài:', error);
        alert('Không thể nộp bài! Chi tiết: ' + error.message);
    }
}

// Export data
function exportData() {
    const dataStr = JSON.stringify(tasksData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `marketing-tasks-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
}

// Import Excel
function importExcel() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls';
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const rows = XLSX.utils.sheet_to_json(firstSheet);
                
                for (const row of rows) {
                    const taskData = {
                        group: row['Nhóm việc'] || '',
                        program: row['Chương trình'] || '',
                        title: row['Công việc'] || '',
                        description: row['Mô tả'] || '',
                        coordinator: row['Người điều phối'] || '',
                        assignee: row['Người thực hiện'] || '',
                        approver: row['Người duyệt'] || '',
                        deadline: row['Deadline'] || new Date().toISOString().split('T')[0],
                        frequency: row['Tần suất'] || 'Một lần',
                        status: 'pending',
                        required_output: row['Đầu ra'] || '',
                        progress: 0
                    };
                    
                    await supabase
                        .from('tasks')
                        .insert([taskData]);
                }
                
                await loadTasks();
                alert(`Đã import ${rows.length} công việc!`);
            } catch (error) {
                console.error('Lỗi import Excel:', error);
                alert('Không thể import file Excel!');
            }
        };
        reader.readAsArrayBuffer(file);
    };
    input.click();
}

// Setup realtime subscription
function setupRealtimeSync() {
    supabase
        .channel('tasks-changes')
        .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'tasks' },
            (payload) => {
                console.log('Realtime update:', payload);
                loadTasks();
            }
        )
        .subscribe();
}

// Setup form listeners
function setupFormListeners() {
    // Submit form
    const submitForm = document.getElementById('submitForm');
    if (submitForm) {
        submitForm.addEventListener('submit', saveSubmission);
    }
    
    // Task form
    const taskForm = document.getElementById('taskForm');
    if (taskForm) {
        taskForm.addEventListener('submit', saveTask);
    }
}

// Initialize
loadTasks();
setupRealtimeSync();
setupFormListeners();
