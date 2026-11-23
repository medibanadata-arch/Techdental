import fs from 'node:fs';
import path from 'node:path';
import { randomBytes } from 'node:crypto';
import sharp from 'sharp';
import {
  all,
  deleteRow,
  get,
  insertRow,
  jsonResponse,
  model,
  nowSql,
  optionalStr,
  readBody,
  str,
  successRedirect,
  updateRow,
  validationError,
  type Body,
} from '../http';

/**
 * Media library, ported from MediaController. Images are normalised to WebP
 * (max 1600px, quality 82) with sharp, matching App\Support\ImageWebp.
 */

const MAX_DIMENSION = 1600;
const WEBP_QUALITY = 82;
const CONVERTIBLE = new Set(['jpeg', 'png', 'webp', 'gif', 'avif']);
const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif', 'svg'];

function publicRoot(): string {
  const candidates = [
    path.resolve(process.cwd(), '..', 'public'),
    path.resolve(process.cwd(), 'public'),
    path.resolve(process.cwd(), '..', '..', 'public'),
  ];
  for (const candidate of candidates) {
    try {
      if (fs.existsSync(path.join(candidate, 'uploads'))) return candidate;
    } catch {
      // ignore
    }
  }
  return candidates[0];
}

const PUBLIC_ROOT = publicRoot();

function publicFilePath(url: string): string | null {
  if (!url || !url.startsWith('/uploads/')) return null;
  const clean = url.split('?')[0].split('#')[0];
  return path.join(PUBLIC_ROOT, clean.replace(/^\/+/, ''));
}

function slugify(value: string): string {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}

function formatSize(bytes: number): string {
  if (bytes >= 1048576) return `${Math.round((bytes / 1048576) * 100) / 100} MB`;
  return `${Math.round((bytes / 1024) * 10) / 10} KB`;
}

function randomSuffix(): string {
  return randomBytes(4).toString('hex').slice(0, 6);
}

function extensionOf(name: string): string {
  const index = name.lastIndexOf('.');
  return index >= 0 ? name.slice(index + 1).toLowerCase() : 'dat';
}

function subFolderFor(mime: string, extension: string): string {
  if (mime.startsWith('image/') || IMAGE_EXTENSIONS.includes(extension)) return 'images';
  if (mime.startsWith('video/') || ['mp4', 'webm', 'mov', 'mkv', 'avi'].includes(extension)) return 'videos';
  if (mime.startsWith('audio/') || ['mp3', 'wav', 'ogg', 'm4a', 'aac'].includes(extension)) return 'audios';
  return 'files';
}

function mediaRow(id: number): any {
  const row = get('SELECT * FROM media WHERE id = ?', [id]);
  return row ? model('media', row) : null;
}

/** Persist one uploaded File, converting images to WebP like Laravel did. */
async function processUploadedFile(file: File, body: Body): Promise<any> {
  const originalName = file.name || 'upload';
  const title = str(body.title) || originalName.replace(/\.[^.]+$/, '');
  const mime = file.type || 'application/octet-stream';
  const sizeBytes = file.size || 0;
  const extension = extensionOf(originalName) || 'dat';
  const subFolder = subFolderFor(mime, extension);

  const dir = path.join(PUBLIC_ROOT, 'uploads', subFolder);
  fs.mkdirSync(dir, { recursive: true });

  const stamp = Math.floor(Date.now() / 1000);
  const suffix = randomSuffix();
  const cleanName = slugify(title) || 'media';
  let filename = `${stamp}_${suffix}_${cleanName}.${extension}`;
  let finalPath = path.join(dir, filename);

  fs.writeFileSync(finalPath, Buffer.from(await file.arrayBuffer()));

  let filesize = formatSize(sizeBytes);
  let dimensions: string | null = null;

  if (subFolder === 'images') {
    let converted = false;
    try {
      // Only real raster images are convertible (SVG stays as-is). Reading into a
      // Buffer avoids libvips keeping the file handle open on Windows.
      const originalBuffer = fs.readFileSync(finalPath);
      const metadata = await sharp(originalBuffer).metadata();
      if (metadata.format && CONVERTIBLE.has(metadata.format)) {
        const webpName = `${stamp}_${suffix}_${cleanName}.webp`;
        const webpPath = path.join(dir, webpName);
        const webpBuffer = await sharp(originalBuffer)
          .resize(MAX_DIMENSION, MAX_DIMENSION, { fit: 'inside', withoutEnlargement: true })
          .webp({ quality: WEBP_QUALITY })
          .toBuffer();
        fs.writeFileSync(webpPath, webpBuffer);
        fs.unlinkSync(finalPath);
        filename = webpName;
        finalPath = webpPath;
        converted = true;
      }
    } catch {
      // Not an image / conversion failed: keep the original upload.
    }

    try {
      const meta = await sharp(fs.readFileSync(finalPath)).metadata();
      if (meta.width && meta.height) dimensions = `${meta.width} by ${meta.height} pixels`;
    } catch {
      // ignore
    }
    const finalSize = fs.existsSync(finalPath) ? fs.statSync(finalPath).size : sizeBytes;
    filesize = formatSize(finalSize);
    if (!converted && extension === 'webp') {
      // already WebP; sharp read above validates the file
    }
  }

  const url = `/uploads/${subFolder}/${filename}`;
  const id = insertRow('media', {
    title,
    url,
    file_name: filename,
    file_type: extension === 'jpeg' ? 'jpeg' : filename.split('.').pop()?.toLowerCase() || extension,
    file_size: filesize,
    dimensions,
    alt_text: str(body.alt_text) || title,
    caption: str(body.caption),
    created_at: nowSql(),
    updated_at: nowSql(),
  });

  return mediaRow(id);
}

async function uploadedFiles(body: Body): Promise<File[]> {
  const files: File[] = [];
  const push = (value: any) => {
    if (value instanceof File) files.push(value);
    else if (Array.isArray(value)) value.forEach(push);
  };
  push(body.files);
  if (!files.length) push(body.file);
  return files;
}

/** Save a base64 data URL (cropper output). */
async function storeDataUrl(body: Body): Promise<Response> {
  const dataUrl = str(body.data_url);
  const match = dataUrl.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.*)$/s);
  if (!match) return jsonResponse({ success: false, message: 'Base64 decode failed' }, 400);

  let type = match[1].toLowerCase();
  if (!['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(type)) type = 'webp';

  const decoded = Buffer.from(match[2], 'base64');
  const title = str(body.title) || 'cropped_image';
  const dir = path.join(PUBLIC_ROOT, 'uploads', 'images');
  fs.mkdirSync(dir, { recursive: true });

  const stamp = Math.floor(Date.now() / 1000);
  const cleanName = slugify(title) || 'image';
  const baseName = `${stamp}_${cleanName}`;
  const tempPath = path.join(dir, `${baseName}.${type}`);
  fs.writeFileSync(tempPath, decoded);

  let finalName = `${baseName}.${type}`;
  let finalPath = tempPath;
  let extension = type;

  try {
    const webpPath = path.join(dir, `${baseName}.webp`);
    const sourceBuffer = fs.readFileSync(tempPath);
    const meta = await sharp(sourceBuffer).metadata();
    if (meta.format && CONVERTIBLE.has(meta.format)) {
      const webpBuffer = await sharp(sourceBuffer)
        .resize(MAX_DIMENSION, MAX_DIMENSION, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY })
        .toBuffer();
      fs.writeFileSync(webpPath, webpBuffer);
      if (tempPath !== webpPath) fs.unlinkSync(tempPath);
      finalName = `${baseName}.webp`;
      finalPath = webpPath;
      extension = 'webp';
    }
  } catch {
    // keep the decoded original
  }

  const sizeBytes = fs.statSync(finalPath).size;
  let dimensions: string | null = null;
  try {
    const meta = await sharp(fs.readFileSync(finalPath)).metadata();
    if (meta.width && meta.height) dimensions = `${meta.width} by ${meta.height} pixels`;
  } catch {
    // ignore
  }

  const url = `/uploads/images/${finalName}`;
  const id = insertRow('media', {
    title,
    url,
    file_name: finalName,
    file_type: extension,
    file_size: formatSize(sizeBytes),
    dimensions,
    alt_text: title,
    caption: '',
    created_at: nowSql(),
    updated_at: nowSql(),
  });

  return jsonResponse({ success: true, url, media: mediaRow(id) });
}

export async function handleMediaStore(request: Request): Promise<Response> {
  const body = await readBody(request);
  const files = await uploadedFiles(body);

  if (files.length) {
    for (const file of files) await processUploadedFile(file, body);
    const message = files.length > 1
      ? `${files.length} files uploaded successfully to local storage`
      : 'File uploaded successfully to local storage';
    return successRedirect('/media', { message });
  }

  const errors: Record<string, string[]> = {};
  if (!str(body.title)) errors.title = ['The title field is required.'];
  if (!str(body.url)) errors.url = ['The url field is required.'];
  if (Object.keys(errors).length) return validationError(errors);

  insertRow('media', {
    title: str(body.title),
    url: str(body.url),
    file_name: optionalStr(body.file_name),
    file_type: optionalStr(body.file_type),
    file_size: optionalStr(body.file_size),
    dimensions: optionalStr(body.dimensions),
    alt_text: optionalStr(body.alt_text),
    caption: optionalStr(body.caption),
    created_at: nowSql(),
    updated_at: nowSql(),
  });

  return successRedirect('/media', { message: 'File uploaded successfully to local storage' });
}

/** GET /admin-api/media (JSON list used by editors). */
export function handleMediaApiIndex(request: Request): Response {
  const url = new URL(request.url);
  const type = url.searchParams.get('type');
  const search = url.searchParams.get('search');
  const where: string[] = [];
  const params: any[] = [];

  if (type === 'image') {
    where.push(
      `(file_type IN ('jpg','jpeg','png','webp','gif','svg')
        OR url LIKE '%.jpg%' OR url LIKE '%.jpeg%' OR url LIKE '%.png%'
        OR url LIKE '%.webp%' OR url LIKE '%.gif%' OR url LIKE '%.svg%'
        OR url LIKE '/uploads/images/%')`
    );
  }
  if (search) {
    where.push('(title LIKE ? OR file_name LIKE ? OR alt_text LIKE ?)');
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  const sql = `SELECT * FROM media ${where.length ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY created_at DESC LIMIT 150`;
  return jsonResponse(all(sql, params).map((row) => model('media', row)));
}

export async function handleMediaApiUpload(request: Request): Promise<Response> {
  const body = await readBody(request);
  const files = await uploadedFiles(body);

  if (files.length) {
    const items: any[] = [];
    for (const file of files) items.push(await processUploadedFile(file, body));
    const first = items[0];
    return jsonResponse({ success: true, count: items.length, url: first?.url, media: first, items });
  }

  if (str(body.data_url)) return storeDataUrl(body);
  return jsonResponse({ success: false, message: 'No file or valid data_url provided' }, 400);
}

export async function handleMediaUpdate(request: Request, id: number): Promise<Response> {
  const media = get<any>('SELECT * FROM media WHERE id = ?', [id]);
  if (!media) return new Response('Not Found', { status: 404 });
  const body = await readBody(request);

  updateRow('media', id, {
    title: 'title' in body ? str(body.title) : media.title,
    alt_text: 'alt_text' in body ? str(body.alt_text) : media.alt_text,
    caption: 'caption' in body ? str(body.caption) : media.caption,
    url: str(body.url) ? str(body.url) : media.url,
    updated_at: nowSql(),
  });

  return successRedirect('/media', { message: 'Media details updated successfully' });
}

export async function handleMediaRotate(request: Request, id: number): Promise<Response> {
  const media = get<any>('SELECT * FROM media WHERE id = ?', [id]);
  if (!media) return new Response('Not Found', { status: 404 });
  const body = await readBody(request);
  const degrees = Number(body.degrees ?? 90) || 0;
  const filePath = publicFilePath(String(media.url));

  if (!filePath || !fs.existsSync(filePath)) {
    return jsonResponse(
      { success: false, message: 'Unable to rotate image. File might be remote or unsupported format.' },
      422
    );
  }

  try {
    const source = fs.readFileSync(filePath);
    const buffer = await sharp(source).rotate(degrees).toBuffer();

    let activePath = filePath;
    let activeUrl = String(media.url).split('?')[0];
    try {
      fs.writeFileSync(filePath, buffer);
    } catch {
      // Windows can keep the original file locked; write a fresh file instead.
      const extension = extensionOf(filePath);
      const base = path.basename(filePath, `.${extension}`);
      const newName = `${base}_r${Date.now()}.${extension}`;
      activePath = path.join(path.dirname(filePath), newName);
      fs.writeFileSync(activePath, buffer);
      activeUrl = activeUrl.replace(/[^/]+$/, newName);
      try {
        fs.unlinkSync(filePath);
      } catch {
        // best effort
      }
    }

    let dimensions = media.dimensions;
    try {
      const meta = await sharp(fs.readFileSync(activePath)).metadata();
      if (meta.width && meta.height) dimensions = `${meta.width} by ${meta.height} pixels`;
    } catch {
      // ignore
    }
    const fileSize = formatSize(fs.statSync(activePath).size);
    const data: Record<string, any> = { dimensions, file_size: fileSize, updated_at: nowSql() };
    if (activeUrl !== String(media.url).split('?')[0]) data.url = activeUrl;
    updateRow('media', id, data);

    return jsonResponse({
      success: true,
      message: 'Image rotated successfully',
      url: `${activeUrl}?t=${Math.floor(Date.now() / 1000)}`,
      dimensions,
      file_size: fileSize,
    });
  } catch {
    return jsonResponse(
      { success: false, message: 'Unable to rotate image. File might be remote or unsupported format.' },
      422
    );
  }
}

export async function handleMediaDestroy(_request: Request, id: number): Promise<Response> {
  const media = get<any>('SELECT * FROM media WHERE id = ?', [id]);
  if (!media) return new Response('Not Found', { status: 404 });
  deleteFile(media);
  deleteRow('media', id);
  return successRedirect('/media', { message: 'Media deleted successfully' });
}

function deleteFile(media: any): void {
  const filePath = publicFilePath(String(media.url || ''));
  if (filePath && fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch {
      // best effort
    }
  }
}

export async function handleMediaBulkDestroy(request: Request): Promise<Response> {
  const body = await readBody(request);
  const ids = Array.isArray(body.ids) ? body.ids.map((value: any) => Number(value)).filter((n: number) => Number.isInteger(n)) : [];

  if (!ids.length) {
    return validationError({
      ids: ['The ids field is required.'],
      'ids.0': ['The ids.0 field is required.'],
    });
  }

  let deleted = 0;
  for (const id of ids) {
    const media = get<any>('SELECT * FROM media WHERE id = ?', [id]);
    if (!media) continue;
    deleteFile(media);
    deleteRow('media', id);
    deleted++;
  }

  const message = deleted === 1
    ? '1 media file deleted successfully'
    : `${deleted} media files deleted successfully`;
  return successRedirect('/media', { message });
}

const MIME_BY_EXTENSION: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  avif: 'image/avif',
  mp4: 'video/mp4',
  webm: 'video/webm',
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  pdf: 'application/pdf',
};

export function handleMediaDownload(id: number): Response {
  const media = get<any>('SELECT * FROM media WHERE id = ?', [id]);
  if (!media) return new Response('Not Found', { status: 404 });

  const filePath = publicFilePath(String(media.url || ''));
  if (filePath && fs.existsSync(filePath)) {
    const name = String(media.file_name || path.basename(filePath));
    const extension = extensionOf(name);
    const type = MIME_BY_EXTENSION[extension] || 'application/octet-stream';
    const data = fs.readFileSync(filePath);
    return new Response(data, {
      status: 200,
      headers: {
        'Content-Type': type,
        'Content-Disposition': `attachment; filename="${name.replace(/"/g, '')}"`,
        'Content-Length': String(data.length),
      },
    });
  }

  return new Response(null, { status: 302, headers: { Location: String(media.url || '/') } });
}
