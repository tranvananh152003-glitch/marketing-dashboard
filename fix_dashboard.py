import re

# Đọc file
with open('dashboard-v2.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Thay title
content = content.replace(
    '<title>Marketing Dashboard 2026</title>',
    '<title>Marketing Dashboard 2026 - Supabase</title>'
)

# Thay Firebase script bằng Supabase
firebase_pattern = r"<!-- Firebase SDK -->.*?window\.firestoreFunctions = \{ collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot \};.*?</script>"
supabase_replacement = '''<!-- Supabase SDK -->
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="supabase-config.js"></script>'''

content = re.sub(firebase_pattern, supabase_replacement, content, flags=re.DOTALL)

# Lưu file mới
with open('dashboard-supabase.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done! Created dashboard-supabase.html")
