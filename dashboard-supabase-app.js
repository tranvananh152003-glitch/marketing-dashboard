// Dashboard Marketing 2026 - Supabase App
console.log('🚀 Dashboard App Loading...');

// Wait for Supabase to load
async function initSupabase() {
    let retries = 0;
    while (!window.supabase && retries < 50) {
        console.log('⏳ Waiting for Supabase...');
        await new Promise(resolve => setTimeout(resolve, 100));
        retries++;
    }
    
    if (!window.supabase) {
        throw new Error('Supabase library failed to load');
    }
    
    return window.supabase.createClient(
        window.SUPABASE_CONFIG.url,
        window.SUPABASE_CONFIG.key
    );
}

// Initialize
let supabaseClient;
initSupabase().then(client => {
    supabaseClient = client;
    console.log('✅ Supabase ready');
    
    // Start app after Supabase is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startApp);
    } else {
        startApp();
    }
}).catch(error => {
    console.error('❌ Supabase init failed:', error);
    alert('Lỗi kết nối Supabase: ' + error.message);
});

// App State
const app = {
    tasks: [],
    currentView: 'all',
    currentGroup: null,
    currentPerson: null,
    currentStatus: null,
    editingId: null,
    selectedFiles: [], // Store selected files for upload

    // Load tasks from Supabase
    async loadTasks() {
        try {
            console.log('📥 Loading tasks from Supabase...');
            
            if (!supabaseClient) {
                throw new Error('Supabase not initialized');
            }
            
            const { data, error } = await supabaseClient
                .from('tasks')
                .select('*')
                .order('updated_at', { ascending: false }); // Mới nhất lên đầu
            
            if (error) {
                console.error('Supabase query error:', error);
                throw error;
            }
            
            console.log('Raw data from Supabase:', data);
            
            this.tasks = data || [];
            console.log(`✅ Loaded ${this.tasks.length} tasks`);
            
            this.checkOverdue();
            this.updateStats();
            this.renderView();
        } catch (error) {
            console.error('❌ Load error:', error);
            document.getElementById('tasksContainer').innerHTML = 
                `<div style="text-align:center;padding:40px;color:#ef4444;background:white;border-radius:15px;">
                    ❌ Lỗi tải dữ liệu<br><small>${error.message}</small><br><br>
                    <button class="btn btn-primary" onclick="app.loadTasks()">🔄 Thử lại</button>
                </div>`;
        }
    },

    // Check overdue tasks
    checkOverdue() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        this.tasks.forEach(task => {
            if (task.status !== 'completed') {
                const deadline = new Date(task.deadline);
                deadline.setHours(0, 0, 0, 0);
                
                if (deadline < today && task.status !== 'overdue') {
                    task.status = 'overdue';
                    // Update in Supabase async
                    supabaseClient.from('tasks').update({ status: 'overdue' }).eq('id', task.id);
                }
            }
        });
    },

    // Update statistics
    updateStats() {
        const completed = this.tasks.filter(t => t.status === 'completed').length;
        const inProgress = this.tasks.filter(t => t.status === 'inprogress').length;
        const pending = this.tasks.filter(t => t.status === 'pending').length;
        const overdue = this.tasks.filter(t => t.status === 'overdue').length;

        document.getElementById('completedTasks').textContent = completed;
        document.getElementById('inProgressTasks').textContent = inProgress;
        document.getElementById('pendingTasks').textContent = pending;
        document.getElementById('overdueTasks').textContent = overdue;
        document.getElementById('lastUpdate').textContent = new Date().toLocaleString('vi-VN');
    },

    // Switch view
    switchView(view) {
        this.currentView = view;
        this.currentGroup = null;
        this.currentPerson = null;
        this.currentStatus = null;
        
        // Update active tab
        document.querySelectorAll('.view-tab').forEach(tab => tab.classList.remove('active'));
        event?.target?.classList.add('active');
        
        // Remove active status from stat cards
        document.querySelectorAll('.stat-card').forEach(card => card.classList.remove('active-filter'));
        
        document.getElementById('groupTabs').style.display = 'none';
        document.getElementById('personTabs').style.display = 'none';
        
        if (view === 'all') {
            this.renderTasks(this.tasks);
        } else if (view === 'group') {
            this.renderGroupTabs();
        } else if (view === 'people') {
            this.renderPersonTabs();
        }
    },

    // Filter by status
    filterByStatus(status) {
        this.currentStatus = status;
        this.currentView = 'status';
        this.currentGroup = null;
        this.currentPerson = null;
        
        // Update UI
        document.querySelectorAll('.view-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.stat-card').forEach(card => card.classList.remove('active-filter'));
        document.getElementById('groupTabs').style.display = 'none';
        document.getElementById('personTabs').style.display = 'none';
        
        // Highlight selected stat card
        const statusMap = {
            'completed': 'completedCard',
            'inprogress': 'inprogressCard',
            'pending': 'pendingCard',
            'overdue': 'overdueCard'
        };
        const cardId = statusMap[status];
        if (cardId) {
            document.getElementById(cardId)?.classList.add('active-filter');
        }
        
        // Filter and render
        const filtered = this.tasks.filter(t => t.status === status);
        this.renderTasks(filtered);
    },

    // Render group tabs
    renderGroupTabs() {
        const groups = {};
        this.tasks.forEach(task => {
            groups[task.group] = (groups[task.group] || 0) + 1;
        });
        
        const groupNames = Object.keys(groups).sort();
        const container = document.getElementById('groupTabs');
        container.style.display = 'flex';
        
        if (groupNames.length === 0) {
            container.innerHTML = '<div style="padding:20px;color:#666;">Chưa có nhóm việc</div>';
            this.renderTasks([]);
            return;
        }
        
        container.innerHTML = groupNames.map((group, i) => `
            <button class="group-tab ${i === 0 ? 'active' : ''}" onclick="app.filterByGroup('${group.replace(/'/g, "\\'")}')">
                ${group}
                <span class="tab-count">${groups[group]}</span>
            </button>
        `).join('');
        
        this.filterByGroup(groupNames[0]);
    },

    // Render person tabs
    renderPersonTabs() {
        const people = {};
        this.tasks.forEach(task => {
            people[task.assignee] = (people[task.assignee] || 0) + 1;
        });
        
        const personNames = Object.keys(people).sort();
        const container = document.getElementById('personTabs');
        container.style.display = 'flex';
        
        if (personNames.length === 0) {
            container.innerHTML = '<div style="padding:20px;color:#666;">Chưa có người thực hiện</div>';
            this.renderTasks([]);
            return;
        }
        
        container.innerHTML = personNames.map((person, i) => `
            <button class="person-tab ${i === 0 ? 'active' : ''}" onclick="app.filterByPerson('${person.replace(/'/g, "\\'")}')">
                ${person}
                <span class="tab-count">${people[person]}</span>
            </button>
        `).join('');
        
        this.filterByPerson(personNames[0]);
    },

    // Filter by group
    filterByGroup(group) {
        this.currentGroup = group;
        document.querySelectorAll('.group-tab').forEach(tab => {
            tab.classList.toggle('active', tab.textContent.trim().startsWith(group));
        });
        this.renderTasks(this.tasks.filter(t => t.group === group));
    },

    // Filter by person
    filterByPerson(person) {
        this.currentPerson = person;
        document.querySelectorAll('.person-tab').forEach(tab => {
            tab.classList.toggle('active', tab.textContent.trim().startsWith(person));
        });
        this.renderTasks(this.tasks.filter(t => t.assignee === person));
    },

    // Render view
    renderView() {
        if (this.currentView === 'all') {
            this.renderTasks(this.tasks);
        } else if (this.currentView === 'status' && this.currentStatus) {
            this.renderTasks(this.tasks.filter(t => t.status === this.currentStatus));
        } else if (this.currentView === 'group' && this.currentGroup) {
            this.renderTasks(this.tasks.filter(t => t.group === this.currentGroup));
        } else if (this.currentView === 'people' && this.currentPerson) {
            this.renderTasks(this.tasks.filter(t => t.assignee === this.currentPerson));
        }
    },

    // Render tasks
    renderTasks(tasks) {
        const container = document.getElementById('tasksContainer');
        
        if (tasks.length === 0) {
            container.innerHTML = '<div style="text-align:center;padding:40px;color:#666;background:white;border-radius:15px;">Không có công việc</div>';
            return;
        }
        
        container.innerHTML = tasks.map(task => {
            const statusText = {
                'completed': 'Hoàn thành',
                'inprogress': 'Đang thực hiện',
                'pending': 'Chưa bắt đầu',
                'overdue': 'Quá hạn'
            }[task.status];
            
            const hasSubmission = task.submission_link || task.submission_note;
            
            return `
                <div class="task-card ${task.status}">
                    <div class="task-actions">
                        <div class="task-action-btns">
                            <button class="task-action-btn view" onclick="app.openViewModal(${task.id})">👁️ Xem</button>
                            <button class="task-action-btn edit" onclick="app.openEditModal(${task.id})">✏️ Sửa</button>
                            <button class="task-action-btn delete" onclick="app.deleteTask(${task.id})">🗑️ Xóa</button>
                        </div>
                    </div>
                    
                    <div class="task-status-badge ${task.status}" onclick="app.cycleStatus(${task.id})">
                        ${statusText}
                    </div>
                    
                    <div class="task-header">
                        <div class="task-group">📁 ${task.group}</div>
                        <div class="task-program">🎯 ${task.program}</div>
                        <div class="task-title">${task.title}</div>
                    </div>
                    
                    ${task.description ? `<div class="task-info">${task.description}</div>` : ''}
                    
                    <div class="task-meta">
                        <div class="meta-item">👤 ${task.assignee}</div>
                        <div class="meta-item">👥 ${task.coordinator}</div>
                        <div class="meta-item">✅ ${task.approver}</div>
                        <div class="meta-item">📅 ${task.deadline}</div>
                        <div class="meta-item">🔁 ${task.frequency}</div>
                        <div class="meta-item">📦 ${task.required_output}</div>
                    </div>
                    
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${task.progress || 0}%"></div>
                    </div>
                    
                    ${hasSubmission ? `
                        <div class="submission-section">
                            <div class="submission-label">
                                📤 Đã nộp bài
                                <button class="submission-edit-btn" onclick="app.editSubmission(${task.id})">✏️ Sửa</button>
                            </div>
                            <div class="submission-content">
                                ${task.submission_link ? `<a href="${task.submission_link}" target="_blank" class="submission-link">🔗 Link</a>` : ''}
                                ${task.submission_note ? `<div class="submission-note">${task.submission_note}</div>` : ''}
                            </div>
                        </div>
                    ` : `
                        <button class="submit-btn" onclick="app.openSubmitModal(${task.id})">📤 Nộp bài</button>
                    `}
                </div>
            `;
        }).join('');
    },

    // Cycle status
    async cycleStatus(id) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) return;
        
        const cycle = ['pending', 'inprogress', 'completed'];
        const currentIndex = cycle.indexOf(task.status === 'overdue' ? 'pending' : task.status);
        const newStatus = cycle[(currentIndex + 1) % cycle.length];
        
        try {
            await supabaseClient
                .from('tasks')
                .update({ 
                    status: newStatus, 
                    progress: newStatus === 'completed' ? 100 : task.progress,
                    updated_at: new Date().toISOString() 
                })
                .eq('id', id);
            
            await this.loadTasks();
        } catch (error) {
            console.error('Status update error:', error);
        }
    },

    // Open view modal
    openViewModal(id) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) return;
        
        const statusText = {
            'completed': 'Hoàn thành',
            'inprogress': 'Đang thực hiện',
            'pending': 'Chưa bắt đầu',
            'overdue': 'Quá hạn'
        }[task.status];
        
        const modalContent = `
            <div class="view-detail-grid">
                <div class="view-detail-item">
                    <span class="view-label">📁 Nhóm việc:</span>
                    <span class="view-value">${task.group}</span>
                </div>
                <div class="view-detail-item">
                    <span class="view-label">🎯 Chương trình:</span>
                    <span class="view-value">${task.program}</span>
                </div>
                <div class="view-detail-item full-width">
                    <span class="view-label">📝 Công việc:</span>
                    <span class="view-value">${task.title}</span>
                </div>
                ${task.description ? `
                <div class="view-detail-item full-width">
                    <span class="view-label">📄 Mô tả:</span>
                    <span class="view-value">${task.description}</span>
                </div>
                ` : ''}
                <div class="view-detail-item">
                    <span class="view-label">👥 Người điều phối:</span>
                    <span class="view-value">${task.coordinator}</span>
                </div>
                <div class="view-detail-item">
                    <span class="view-label">👤 Người thực hiện:</span>
                    <span class="view-value">${task.assignee}</span>
                </div>
                <div class="view-detail-item">
                    <span class="view-label">✅ Người duyệt:</span>
                    <span class="view-value">${task.approver}</span>
                </div>
                <div class="view-detail-item">
                    <span class="view-label">📅 Deadline:</span>
                    <span class="view-value">${task.deadline}</span>
                </div>
                <div class="view-detail-item">
                    <span class="view-label">🔁 Tần suất:</span>
                    <span class="view-value">${task.frequency}</span>
                </div>
                <div class="view-detail-item">
                    <span class="view-label">📊 Trạng thái:</span>
                    <span class="view-value"><span class="status-badge ${task.status}">${statusText}</span></span>
                </div>
                <div class="view-detail-item full-width">
                    <span class="view-label">📦 Đầu ra yêu cầu:</span>
                    <span class="view-value">${task.required_output}</span>
                </div>
                <div class="view-detail-item">
                    <span class="view-label">📈 Tiến độ:</span>
                    <span class="view-value">${task.progress || 0}%</span>
                </div>
                ${task.submission_link || task.submission_note ? `
                <div class="view-detail-item full-width submission-box">
                    <span class="view-label">📤 Nộp bài:</span>
                    <div class="submission-info">
                        ${task.submission_link ? `<div>🔗 <a href="${task.submission_link}" target="_blank">${task.submission_link}</a></div>` : ''}
                        ${task.submission_note ? `<div>📝 ${task.submission_note}</div>` : ''}
                    </div>
                </div>
                ` : ''}
            </div>
        `;
        
        document.getElementById('viewModalContent').innerHTML = modalContent;
        document.getElementById('viewModal').classList.add('active');
    },

    // Close view modal
    closeViewModal() {
        document.getElementById('viewModal').classList.remove('active');
    },

    // Open submit modal
    openSubmitModal(id) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) return;
        
        const form = document.getElementById('submitForm');
        form.taskId.value = id;
        form.submissionLink.value = '';
        form.submissionNote.value = '';
        document.getElementById('markCompleteCheck').checked = false;
        document.getElementById('submitModalTitle').textContent = '📤 Nộp bài';
        
        // Reset selected files
        this.selectedFiles = [];
        document.getElementById('selectedFiles').innerHTML = '';
        document.getElementById('fileInput').value = '';
        document.getElementById('existingFiles').innerHTML = '';
        document.getElementById('existingFiles').style.display = 'none';
        
        document.getElementById('submitModal').classList.add('active');
    },

    // Handle file selection
    handleFileSelect(event) {
        const newFiles = Array.from(event.target.files);
        
        // Add new files to selectedFiles array
        newFiles.forEach(file => {
            // Check if file already exists
            const exists = this.selectedFiles.some(f => f.name === file.name && f.size === file.size);
            if (!exists) {
                this.selectedFiles.push(file);
            }
        });
        
        // Clear file input
        event.target.value = '';
        
        // Display selected files
        this.displaySelectedFiles();
    },

    // Display selected files with remove buttons
    displaySelectedFiles() {
        const container = document.getElementById('selectedFiles');
        
        if (this.selectedFiles.length === 0) {
            container.innerHTML = '';
            return;
        }
        
        container.innerHTML = `
            <div style="font-weight:600;color:#666;margin:10px 0 8px 0;font-size:13px;">
                📎 File đã chọn (${this.selectedFiles.length}):
            </div>
            ${this.selectedFiles.map((file, index) => {
                const isExisting = file.isExisting;
                const fileName = file.name;
                const fileSize = isExisting ? '' : this.formatFileSize(file.size);
                
                return `
                    <div class="file-preview-item ${isExisting ? 'existing-file' : ''}">
                        <div class="file-info">
                            <span class="file-icon">${this.getFileIcon(fileName)}</span>
                            <div class="file-details">
                                <div class="file-name">
                                    ${isExisting ? `<a href="${file.url}" target="_blank" style="color:#0891b2;text-decoration:none;">${fileName}</a>` : fileName}
                                </div>
                                ${fileSize ? `<div class="file-size">${fileSize}</div>` : ''}
                                ${isExisting ? '<div class="file-size" style="color:#059669;">✓ Đã upload</div>' : ''}
                            </div>
                        </div>
                        <button type="button" class="remove-file-btn" onclick="app.removeSelectedFile(${index})">✕</button>
                    </div>
                `;
            }).join('')}
        `;
    },

    // Remove a file from selected files
    removeSelectedFile(index) {
        this.selectedFiles.splice(index, 1);
        this.displaySelectedFiles();
    },

    // Get file icon based on extension
    getFileIcon(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        const icons = {
            'pdf': '📄',
            'doc': '📝', 'docx': '📝',
            'xls': '📊', 'xlsx': '📊',
            'jpg': '🖼️', 'jpeg': '🖼️', 'png': '🖼️', 'gif': '🖼️',
            'zip': '📦', 'rar': '📦'
        };
        return icons[ext] || '📎';
    },

    // Format file size
    formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    },

    // Edit submission
    editSubmission(id) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) return;
        
        const form = document.getElementById('submitForm');
        form.taskId.value = id;
        form.submissionLink.value = task.submission_link || '';
        
        // Parse files from HTML note
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = task.submission_note || '';
        
        // Extract file links and add to selectedFiles as "existing"
        const fileLinks = Array.from(tempDiv.querySelectorAll('a'));
        this.selectedFiles = fileLinks.map(link => ({
            name: link.textContent.replace('📎 ', ''),
            url: link.href,
            isExisting: true // Mark as existing file
        }));
        
        // Extract plain text (excluding file links)
        const textContent = Array.from(tempDiv.childNodes)
            .filter(node => node.nodeType === Node.TEXT_NODE || (node.nodeName === 'BR'))
            .map(node => node.textContent)
            .join('')
            .trim();
        
        form.submissionNote.value = textContent;
        document.getElementById('markCompleteCheck').checked = task.status === 'completed';
        document.getElementById('fileInput').value = '';
        
        // Display files using same displaySelectedFiles
        this.displaySelectedFiles();
        
        document.getElementById('submitModalTitle').textContent = '✏️ Chỉnh sửa bài nộp';
        document.getElementById('submitModal').classList.add('active');
    },

    // Display existing files with delete buttons
    displayExistingFiles(taskId, files) {
        const container = document.getElementById('existingFiles');
        if (!container) return;
        
        if (files.length === 0) {
            container.innerHTML = '';
            container.style.display = 'none';
            return;
        }
        
        container.style.display = 'block';
        container.innerHTML = `
            <div style="font-weight:600;color:#666;margin-bottom:10px;font-size:13px;">📎 File đã upload:</div>
            ${files.map((file, index) => `
                <div class="existing-file-item">
                    <a href="${file.url}" target="_blank" class="existing-file-link">📄 ${file.name}</a>
                    <button type="button" class="delete-file-btn" onclick="app.deleteFile(${taskId}, '${file.url.replace(/'/g, "\\'")}', ${index})">✕</button>
                </div>
            `).join('')}
        `;
    },

    // Delete a specific file from submission
    async deleteFile(taskId, fileUrl, index) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;
        
        if (!confirm('Xóa file này?')) return;
        
        try {
            // Parse current note
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = task.submission_note || '';
            
            // Remove the specific link
            const links = tempDiv.querySelectorAll('a');
            if (links[index]) {
                const parent = links[index].parentNode;
                links[index].remove();
                
                // Clean up separators
                if (parent.textContent.trim() === '|') {
                    parent.textContent = '';
                }
            }
            
            // Get updated HTML
            let updatedNote = tempDiv.innerHTML.trim()
                .replace(/\|\s*\|/g, '|') // Remove double separators
                .replace(/^\s*\|\s*/g, '') // Remove leading separator
                .replace(/\s*\|\s*$/g, ''); // Remove trailing separator
            
            if (!updatedNote || updatedNote === '<br>') {
                updatedNote = null;
            }
            
            // Update database
            await supabaseClient.from('tasks').update({
                submission_note: updatedNote,
                updated_at: new Date().toISOString()
            }).eq('id', taskId);
            
            await this.loadTasks();
            
            // Refresh the edit modal
            this.editSubmission(taskId);
            
        } catch (error) {
            console.error('Delete file error:', error);
            alert('Lỗi xóa file: ' + error.message);
        }
    },

    // Delete submission
    async deleteSubmission(id) {
        if (!confirm('Xóa bài nộp này?\n\nFile đã upload sẽ không bị xóa (vẫn lưu trong Storage).')) return;
        
        try {
            await supabaseClient.from('tasks').update({
                submission_link: null,
                submission_note: null,
                updated_at: new Date().toISOString()
            }).eq('id', id);
            
            await this.loadTasks();
            alert('✅ Đã xóa bài nộp!');
        } catch (error) {
            console.error('Delete submission error:', error);
            alert('Lỗi xóa: ' + error.message);
        }
    },

    // Close submit modal
    closeSubmitModal() {
        document.getElementById('submitModal').classList.remove('active');
    },

    // Open add modal
    openAddModal() {
        this.editingId = null;
        document.getElementById('modalTitle').textContent = 'Thêm công việc mới';
        document.getElementById('taskForm').reset();
        document.getElementById('taskModal').classList.add('active');
    },

    // Open edit modal
    openEditModal(id) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) return;
        
        this.editingId = id;
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
    },

    // Close modal
    closeModal() {
        document.getElementById('taskModal').classList.remove('active');
        this.editingId = null;
    },

    // Delete task
    async deleteTask(id) {
        if (!confirm('Xóa công việc này?')) return;
        
        try {
            await supabaseClient.from('tasks').delete().eq('id', id);
            await this.loadTasks();
        } catch (error) {
            console.error('Delete error:', error);
            alert('Lỗi xóa: ' + error.message);
        }
    },

    // Export data
    exportData() {
        const dataStr = JSON.stringify(this.tasks, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `marketing-tasks-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
    },

    // Import Excel
    importExcel() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.xlsx,.xls';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    console.log('📊 Starting Excel import...');
                    const data = new Uint8Array(event.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const sheet = workbook.Sheets[workbook.SheetNames[0]];
                    const rows = XLSX.utils.sheet_to_json(sheet);
                    
                    console.log(`Found ${rows.length} rows in Excel`);
                    
                    const tasksToInsert = [];
                    
                    for (const row of rows) {
                        const taskData = {
                            group: String(row['Nhóm việc'] || '').trim(),
                            program: String(row['Chương trình'] || '').trim(),
                            title: String(row['Công việc'] || '').trim(),
                            description: String(row['Mô tả'] || '').trim(),
                            coordinator: String(row['Người điều phối'] || '').trim(),
                            assignee: String(row['Người thực hiện'] || '').trim(),
                            approver: String(row['Người duyệt'] || '').trim(),
                            deadline: String(row['Deadline'] || new Date().toISOString().split('T')[0]),
                            frequency: String(row['Tần suất'] || 'Một lần'),
                            status: 'pending',
                            required_output: String(row['Đầu ra'] || '').trim(),
                            progress: 0,
                            updated_at: new Date().toISOString()
                        };
                        
                        tasksToInsert.push(taskData);
                    }
                    
                    console.log('Inserting tasks to Supabase...');
                    
                    // Insert tất cả cùng lúc thay vì từng cái
                    const { data: insertedData, error } = await supabaseClient
                        .from('tasks')
                        .insert(tasksToInsert)
                        .select();
                    
                    if (error) {
                        console.error('Supabase insert error:', error);
                        throw error;
                    }
                    
                    console.log('✅ Inserted successfully:', insertedData);
                    
                    // Reload tasks
                    await this.loadTasks();
                    
                    alert(`✅ Đã import ${tasksToInsert.length} công việc!`);
                } catch (error) {
                    console.error('❌ Import error:', error);
                    alert('Lỗi import: ' + error.message);
                }
            };
            reader.readAsArrayBuffer(file);
        };
        input.click();
    }
};

// Setup form handlers
function startApp() {
    console.log('📱 Starting app...');
    
    // Task form
    document.getElementById('taskForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
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
            if (app.editingId) {
                await supabaseClient.from('tasks').update(taskData).eq('id', app.editingId);
            } else {
                await supabaseClient.from('tasks').insert([taskData]);
            }
            
            app.closeModal();
            await app.loadTasks();
        } catch (error) {
            console.error('Save error:', error);
            alert('Lỗi lưu: ' + error.message);
        }
    });
    
    // Submit form - QUAN TRỌNG!
    document.getElementById('submitForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('=== SUBMIT TRIGGERED ===');
        
        const formData = new FormData(e.target);
        const taskId = parseInt(formData.get('taskId'));
        const link = formData.get('submissionLink') || '';
        const note = formData.get('submissionNote') || '';
        const files = app.selectedFiles; // Use selectedFiles instead
        const complete = document.getElementById('markCompleteCheck').checked;
        
        console.log({taskId, link, note, filesCount: files.length, complete});
        
        if (!link && !note && files.length === 0) {
            alert('Vui lòng nhập link, ghi chú hoặc file!');
            return;
        }
        
        try {
            const task = app.tasks.find(t => t.id === taskId);
            let finalNote = note;
            let uploadedFileUrls = [];
            
            // Upload files to Supabase Storage
            if (files.length > 0) {
                console.log('📤 Processing files...');
                
                for (let file of files) {
                    // Skip existing files (already uploaded)
                    if (file.isExisting) {
                        uploadedFileUrls.push({
                            name: file.name,
                            url: file.url
                        });
                        continue;
                    }
                    
                    // Upload new files
                    // Sanitize filename: remove Vietnamese accents and special chars
                    let sanitizedName = file.name
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
                        .replace(/đ/g, 'd').replace(/Đ/g, 'D') // Replace đ
                        .replace(/[^a-zA-Z0-9._-]/g, '_'); // Replace special chars with underscore
                    
                    const fileName = `${Date.now()}_${sanitizedName}`;
                    const filePath = `submissions/${fileName}`;
                    
                    console.log('Original:', file.name, '→ Sanitized:', fileName);
                    
                    const { data: uploadData, error: uploadError } = await supabaseClient
                        .storage
                        .from('task-files')
                        .upload(filePath, file, {
                            cacheControl: '3600',
                            upsert: false
                        });
                    
                    if (uploadError) {
                        console.error('Upload error:', uploadError);
                        
                        // Nếu bucket không tồn tại, tạo bucket mới
                        if (uploadError.message.includes('not found')) {
                            alert('⚠️ Cần setup Storage trong Supabase:\n\n1. Vào Supabase Dashboard\n2. Storage → Create bucket\n3. Tên: task-files\n4. Public: Yes\n\nHoặc chỉ nhập link/ghi chú (không upload file)');
                            return;
                        }
                        throw uploadError;
                    }
                    
                    // Get public URL
                    const { data: urlData } = supabaseClient
                        .storage
                        .from('task-files')
                        .getPublicUrl(filePath);
                    
                    uploadedFileUrls.push({
                        name: file.name, // Keep original name for display
                        url: urlData.publicUrl
                    });
                }
                
                // Add file info to note
                const fileLinks = uploadedFileUrls.map(f => 
                    `<a href="${f.url}" target="_blank">📎 ${f.name}</a>`
                ).join(' | ');
                
                // Nếu đang edit và đã có note cũ, thêm file mới vào
                if (task.submission_note && task.submission_note.trim()) {
                    finalNote = task.submission_note + '<br>' + fileLinks;
                } else {
                    finalNote = (note ? note + '<br>' : '') + fileLinks;
                }
            }
            
            const updateData = {
                submission_link: link,
                submission_note: finalNote,
                updated_at: new Date().toISOString()
            };
            
            if (complete) {
                updateData.status = 'completed';
                updateData.progress = 100;
            }
            
            console.log('Updating...', updateData);
            
            await supabaseClient.from('tasks').update(updateData).eq('id', taskId);
            
            console.log('✅ Success');
            
            app.closeSubmitModal();
            await app.loadTasks();
            
            alert(complete ? '✅ Đã nộp & hoàn thành!' : '📤 Đã lưu bài nộp!');
        } catch (error) {
            console.error('❌ Submit error:', error);
            alert('Lỗi: ' + error.message);
        }
    });
    
    // Click outside to close modals
    document.getElementById('taskModal').addEventListener('click', (e) => {
        if (e.target.id === 'taskModal') app.closeModal();
    });
    
    document.getElementById('submitModal').addEventListener('click', (e) => {
        if (e.target.id === 'submitModal') app.closeSubmitModal();
    });
    
    document.getElementById('viewModal').addEventListener('click', (e) => {
        if (e.target.id === 'viewModal') app.closeViewModal();
    });
    
    // Realtime sync
    supabaseClient
        .channel('tasks-changes')
        .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'tasks' },
            () => {
                console.log('🔄 Realtime update');
                app.loadTasks();
            }
        )
        .subscribe();
    
    // Initial load
    app.loadTasks();
    console.log('✅ App Ready');
}

// Expose app globally
window.app = app;
