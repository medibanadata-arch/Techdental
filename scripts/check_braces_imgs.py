import os

for f in ['bracess-before-after-image.webp', 'bracess-before-after-image-3.webp', 'bracess-before-after-image-1.webp']:
    path = os.path.join('public/uploads/posts', f)
    print(f, "exists:", os.path.exists(path), "size:", os.path.getsize(path) if os.path.exists(path) else 0)

