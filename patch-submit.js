// Patch for saveSubmission function
// Copy paste this into browser console after page loads

window.saveSubmission = async function(e) {
    e.preventDefault();
    console.log('=== saveSubmission PATCHED ===');
    
    const form = e.target;
    const formData = new FormData(form);
    const taskId = parseInt(formData.get('taskId'));
    const submissionLink = formData.get('submissionLink') || '';
    const submissionNote = formData.get('submissionNote') || '';
    const markComplete = document.getElementById('markCompleteCheck').checked;
    const files = form.submissionFile ? form.submissionFile.files : [];
    
    console.log('Task ID:', taskId);
    console.log('Link:', submissionLink);
    console.log('Note:', submissionNote);
    console.log('Files:', files.length);

    // Validation
    if (!submissionLink && !submissionNote && files.length === 0) {
        alert('Vui lòng nhập link, ghi chú hoặc đính kèm file!');
        return;
    }
    
    // Prepare update data
    let finalNote = submissionNote;
    
    // Nếu có file, thêm thông tin vào note
    if (files.length > 0) {
        const fileNames = Array.from(files).map(f => f.name).join(', ');
        finalNote = (submissionNote ? submissionNote + ' | ' : '') + `📎 ${fileNames}`;
    }
    
    const updateData = {
        submission_link: submissionLink,
        submission_note: finalNote,
        updated_at: new Date().toISOString()
    };

    // Nếu tick hoàn thành
    if (markComplete) {
        updateData.status = 'completed';
        updateData.progress = 100;
    }
    
    try {
        if (window.supabase) {
            // Sử dụng Supabase
            const { data, error } = await window.supabase
                .from('tasks')
                .update(updateData)
                .eq('id', taskId)
                .select();
            
            if (error) throw error;
            
            console.log('✅ Supabase update success');
            
            // Đóng modal TRƯỚC
            closeSubmitModal();
            
            // Reload data
            await loadData();
            updateStats();
            switchView(currentView);
            
            if (markComplete) {
                alert('✅ Đã nộp bài và đánh dấu hoàn thành!');
            } else {
                alert('📤 Đã nộp bài thành công!');
            }
        }
    } catch (error) {
        console.error('❌ Submit error:', error);
        alert('❌ Lỗi nộp bài: ' + error.message);
    }
};

console.log('✅ saveSubmission patched!');
