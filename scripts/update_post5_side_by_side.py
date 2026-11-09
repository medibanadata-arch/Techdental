import sqlite3

conn = sqlite3.connect("database/database.sqlite")
cursor = conn.cursor()

# Update post 5 content
cursor.execute("SELECT content, content_bn FROM posts WHERE id = 5")
row = cursor.fetchone()
content, content_bn = row[0], row[1]

# In English content: replace the grid with image-row-3 wrapper with inline styles as fallback
old_en = '<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">'
new_en = '''<div class="image-row-3 grid grid-cols-1 sm:grid-cols-3 gap-4 my-6" style="display: flex; flex-direction: row; flex-wrap: wrap; gap: 16px; margin: 24px 0; justify-content: center; align-items: stretch;">
  <div style="flex: 1 1 calc(33.333% - 16px); min-width: 180px; max-width: 100%; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; background: #f8fafc; padding: 4px;">
    <img src="/uploads/posts/bracess-before-after-image.webp" alt="Orthodontist treatment Before after image 1" style="width: 100%; height: auto; max-height: 220px; object-fit: contain; display: block; border-radius: 8px;" />
  </div>
  <div style="flex: 1 1 calc(33.333% - 16px); min-width: 180px; max-width: 100%; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; background: #f8fafc; padding: 4px;">
    <img src="/uploads/posts/bracess-before-after-image-3.webp" alt="Orthodontist treatment Before after image 2" style="width: 100%; height: auto; max-height: 220px; object-fit: contain; display: block; border-radius: 8px;" />
  </div>
  <div style="flex: 1 1 calc(33.333% - 16px); min-width: 180px; max-width: 100%; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; background: #f8fafc; padding: 4px;">
    <img src="/uploads/posts/bracess-before-after-image-1.webp" alt="Orthodontist treatment Before after image 3" style="width: 100%; height: auto; max-height: 220px; object-fit: contain; display: block; border-radius: 8px;" />
  </div>
</div>'''

if old_en in content:
    # replace the entire old div block
    end_tag = '</div>\n</div>' if '</div>\n</div>' in content else '</div>\n<h3'
    # Let's cleanly replace
    import re
    content = re.sub(r'<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">[\s\S]*?</div>\s*</div>', new_en, content)

# In Bengali content:
# replace the 3 stacked <p dir="ltr"><img ...></p> with the side-by-side row
bn_images_pattern = r'<p dir="ltr"><img alt="আঁকাবাঁকা চিকিৎসার আগের এবং পরের ছবি"[\s\S]*?<p><img alt="আঁকাবাঁকা চিকিৎসার আগের এবং পরের ছবি"[\s\S]*?<p><img alt="আঁকাবাঁকা চিকিৎসার আগের এবং পরের ছবি"[\s\S]*?</noscript></p>'
bn_replacement = '''<div class="image-row-3 grid grid-cols-1 sm:grid-cols-3 gap-4 my-6" style="display: flex; flex-direction: row; flex-wrap: wrap; gap: 16px; margin: 24px 0; justify-content: center; align-items: stretch;">
  <div style="flex: 1 1 calc(33.333% - 16px); min-width: 180px; max-width: 100%; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; background: #f8fafc; padding: 4px;">
    <img src="/uploads/posts/bracess-before-after-image.webp" alt="আঁকাবাঁকা চিকিৎসার আগের এবং পরের ছবি ১" style="width: 100%; height: auto; max-height: 220px; object-fit: contain; display: block; border-radius: 8px;" />
  </div>
  <div style="flex: 1 1 calc(33.333% - 16px); min-width: 180px; max-width: 100%; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; background: #f8fafc; padding: 4px;">
    <img src="/uploads/posts/bracess-before-after-image-3.webp" alt="আঁকাবাঁকা চিকিৎসার আগের এবং পরের ছবি ২" style="width: 100%; height: auto; max-height: 220px; object-fit: contain; display: block; border-radius: 8px;" />
  </div>
  <div style="flex: 1 1 calc(33.333% - 16px); min-width: 180px; max-width: 100%; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; background: #f8fafc; padding: 4px;">
    <img src="/uploads/posts/bracess-before-after-image-1.webp" alt="আঁকাবাঁকা চিকিৎসার আগের এবং পরের ছবি ৩" style="width: 100%; height: auto; max-height: 220px; object-fit: contain; display: block; border-radius: 8px;" />
  </div>
</div>'''

if content_bn:
    import re
    content_bn = re.sub(bn_images_pattern, bn_replacement, content_bn)

cursor.execute("UPDATE posts SET content = ?, content_bn = ? WHERE id = 5", (content, content_bn))
conn.commit()
print("Post 5 updated with side-by-side images!")

