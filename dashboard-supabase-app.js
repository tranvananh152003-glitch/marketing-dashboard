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
    editingId: null,

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
                .order('updated_at', { ascending: false });
            
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
        
        // Update active tab
        document.querySelectorAll('.view-tab').forEach(tab => tab.classList.remove('active'));
        event?.target?.classList.add('active');
        
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
                            <div class="submission-label">📤 Đã nộp bài</div>
                            <div class="submission-content">
                                ${task.submission_link ? `<a href="${task.submission_link}" target="_blank" class="submission-link">🔗 ${task.submission_link}</a>` : ''}
                                ${task.submission_note ? `<span class="submission-file">📄 ${task.submission_note}</span>` : ''}
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

    // Open submit modal
    openSubmitModal(id) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) return;
        
        const form = document.getElementById('submitForm');
        form.taskId.value = id;
        form.submissionLink.value = '';
        form.submissionNote.value = '';
        if (form.submissionFile) form.submissionFile.value = '';
        document.getElementById('markCompleteCheck').checked = false;
        document.getElementById('submitModal').classList.add('active');
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
        const files = e.target.submissionFile?.files || [];
        const complete = document.getElementById('markCompleteCheck').checked;
        
        console.log({taskId, link, note, filesCount: files.length, complete});
        
        if (!link && !note && files.length === 0) {
            alert('Vui lòng nhập link, ghi chú hoặc file!');
            return;
        }
        
        try {
            let finalNote = note;
            if (files.length > 0) {
                const fileNames = Array.from(files).map(f => f.name).join(', ');
                finalNote = (note ? note + ' | ' : '') + `📎 ${fileNames}`;
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
            
            alert(complete ? '✅ Đã nộp & hoàn thành!' : '📤 Đã nộp bài!');
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
