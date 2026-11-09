import sqlite3
import re

conn = sqlite3.connect('database/database.sqlite')
c = conn.cursor()

row = c.execute("SELECT id, content FROM posts WHERE slug = 'best-orthodontist-doctor-in-dhaka'").fetchone()
if row:
    post_id, content = row
    
    # Clean up the 3 before-after images
    pattern = r'<p data-path-to-node="19">.*?</noscript></p>'
    replacement = '''<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
  <div class="rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-slate-50">
    <img src="/uploads/posts/bracess-before-after-image.webp" alt="Orthodontist treatment Before after image 1" class="w-full h-auto object-cover rounded-xl" />
  </div>
  <div class="rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-slate-50">
    <img src="/uploads/posts/bracess-before-after-image-3.webp" alt="Orthodontist treatment Before after image 2" class="w-full h-auto object-cover rounded-xl" />
  </div>
  <div class="rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-slate-50">
    <img src="/uploads/posts/bracess-before-after-image-1.webp" alt="Orthodontist treatment Before after image 3" class="w-full h-auto object-cover rounded-xl" />
  </div>
</div>'''
    
    new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    
    # Also strip any remaining /public/ from image sources in content
    new_content = new_content.replace('/public/uploads/', '/uploads/')
    
    c.execute("UPDATE posts SET content = ? WHERE id = ?", (new_content, post_id))
    conn.commit()
    print("Successfully updated post best-orthodontist-doctor-in-dhaka with side-by-side images!")
