<?php

namespace App\Http\Controllers;

use App\Models\Media;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;

class MediaController extends Controller
{
    private function convertToWebp(string $sourcePath, string $destPath, int $quality = 82): bool
    {
        if (!function_exists('imagewebp')) {
            return false;
        }

        $info = @getimagesize($sourcePath);
        if (!$info) {
            return false;
        }

        $mime = $info['mime'] ?? '';
        $image = null;

        switch ($mime) {
            case 'image/jpeg':
                $image = @imagecreatefromjpeg($sourcePath);
                break;
            case 'image/png':
                $image = @imagecreatefrompng($sourcePath);
                if ($image) {
                    imagepalettetotruecolor($image);
                    imagealphablending($image, true);
                    imagesavealpha($image, true);
                }
                break;
            case 'image/webp':
                return true;
            default:
                return false;
        }

        if (!$image) {
            return false;
        }

        $result = @imagewebp($image, $destPath, $quality);
        imagedestroy($image);
        return $result;
    }

    public function index()
    {
        $media = Media::latest()->get();
        return Inertia::render('Media/Index', ['media' => $media]);
    }

    public function apiIndex(Request $request)
    {
        $query = Media::latest();
        if ($request->filled('type') && $request->type === 'image') {
            $query->where(function ($q) {
                $q->whereIn('file_type', ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'])
                  ->orWhere('url', 'like', '%.jpg%')
                  ->orWhere('url', 'like', '%.jpeg%')
                  ->orWhere('url', 'like', '%.png%')
                  ->orWhere('url', 'like', '%.webp%')
                  ->orWhere('url', 'like', '%.gif%')
                  ->orWhere('url', 'like', '%.svg%')
                  ->orWhere('url', 'like', '/uploads/images/%');
            });
        }
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('file_name', 'like', "%{$search}%")
                  ->orWhere('alt_text', 'like', "%{$search}%");
            });
        }
        return response()->json($query->take(150)->get());
    }

    public function apiUpload(Request $request)
    {
        // 1. If uploaded as binary file(s)
        if ($request->hasFile('files') || $request->hasFile('file')) {
            $allFiles = [];
            if ($request->hasFile('files')) {
                $files = $request->file('files');
                $allFiles = is_array($files) ? $files : [$files];
            } elseif ($request->hasFile('file')) {
                $file = $request->file('file');
                $allFiles = is_array($file) ? $file : [$file];
            }

            $uploadedMedia = [];
            foreach ($allFiles as $file) {
                if ($file && $file->isValid()) {
                    $uploadedMedia[] = $this->processUploadedFile($file, $request);
                }
            }

            if (!empty($uploadedMedia)) {
                $first = $uploadedMedia[0];
                return response()->json([
                    'success' => true,
                    'count' => count($uploadedMedia),
                    'url' => $first->url,
                    'media' => $first,
                    'items' => $uploadedMedia,
                ]);
            }
        }

        // 2. If uploaded as base64 data URL
        if ($request->filled('data_url')) {
            $dataUrl = $request->input('data_url');
            $title = $request->input('title') ?: 'cropped_image';

            if (preg_match('/^data:image\/(\w+);base64,/', $dataUrl, $type)) {
                $data = substr($dataUrl, strpos($dataUrl, ',') + 1);
                $type = strtolower($type[1]);
                if (!in_array($type, ['jpg', 'jpeg', 'png', 'webp', 'gif'])) {
                    $type = 'webp';
                }

                $decoded = base64_decode($data);
                if ($decoded === false) {
                    return response()->json(['success' => false, 'message' => 'Base64 decode failed'], 400);
                }

                $uploadDir = public_path('uploads/images');
                if (!file_exists($uploadDir)) {
                    mkdir($uploadDir, 0755, true);
                }

                $cleanName = Str::slug($title);
                $filename = time() . '_' . ($cleanName ?: 'image') . '.' . $type;
                file_put_contents($uploadDir . '/' . $filename, $decoded);

                $sizeBytes = strlen($decoded);
                if ($sizeBytes >= 1048576) {
                    $filesize = round($sizeBytes / 1048576, 2) . ' MB';
                } else {
                    $filesize = round($sizeBytes / 1024, 1) . ' KB';
                }

                $dimensions = null;
                $imgInfo = @getimagesize($uploadDir . '/' . $filename);
                if ($imgInfo && isset($imgInfo[0]) && isset($imgInfo[1])) {
                    $dimensions = $imgInfo[0] . ' by ' . $imgInfo[1] . ' pixels';
                }

                $url = '/uploads/images/' . $filename;
                $media = Media::create([
                    'title' => $title,
                    'url' => $url,
                    'file_name' => $filename,
                    'file_type' => $type,
                    'file_size' => $filesize,
                    'dimensions' => $dimensions,
                    'alt_text' => $title,
                    'caption' => '',
                ]);

                return response()->json([
                    'success' => true,
                    'url' => $url,
                    'media' => $media,
                ]);
            }
        }

        return response()->json(['success' => false, 'message' => 'No file or valid data_url provided'], 400);
    }

    private function processUploadedFile($file, Request $request)
    {
        $originalName = $file->getClientOriginalName();
        $title = $request->input('title') ?: pathinfo($originalName, PATHINFO_FILENAME);
        $mimeType = $file->getClientMimeType() ?: 'application/octet-stream';
        $sizeBytes = $file->getSize();

        // Format size
        if ($sizeBytes >= 1048576) {
            $filesize = round($sizeBytes / 1048576, 2) . ' MB';
        } else {
            $filesize = round($sizeBytes / 1024, 1) . ' KB';
        }

        $extension = strtolower($file->getClientOriginalExtension() ?: 'dat');

        // Categorize directory by media type for shared hosting cleanliness
        $subFolder = 'files';
        if (str_starts_with($mimeType, 'image/') || in_array($extension, ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'])) {
            $subFolder = 'images';
        } elseif (str_starts_with($mimeType, 'video/') || in_array($extension, ['mp4', 'webm', 'mov', 'mkv', 'avi'])) {
            $subFolder = 'videos';
        } elseif (str_starts_with($mimeType, 'audio/') || in_array($extension, ['mp3', 'wav', 'ogg', 'm4a', 'aac'])) {
            $subFolder = 'audios';
        }

        $uploadDir = public_path('uploads/' . $subFolder);
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $cleanName = Str::slug($title);
        $uniqueSuffix = Str::lower(Str::random(6));
        $filename = time() . '_' . $uniqueSuffix . '_' . ($cleanName ?: 'media') . '.' . $extension;

        $file->move($uploadDir, $filename);
        $originalFilePath = $uploadDir . '/' . $filename;

        // Auto WebP Conversion & Compression for uploaded images
        if ($subFolder === 'images' && in_array($extension, ['jpg', 'jpeg', 'png'])) {
            $webpFilename = time() . '_' . $uniqueSuffix . '_' . ($cleanName ?: 'media') . '.webp';
            $webpPath = $uploadDir . '/' . $webpFilename;
            if ($this->convertToWebp($originalFilePath, $webpPath, 82)) {
                @unlink($originalFilePath);
                $filename = $webpFilename;
                $extension = 'webp';
            }
        }

        $url = '/uploads/' . $subFolder . '/' . $filename;

        $dimensions = null;
        if ($subFolder === 'images') {
            $imgInfo = @getimagesize($uploadDir . '/' . $filename);
            if ($imgInfo && isset($imgInfo[0]) && isset($imgInfo[1])) {
                $dimensions = $imgInfo[0] . ' by ' . $imgInfo[1] . ' pixels';
            }
            $finalSize = @filesize($uploadDir . '/' . $filename) ?: $sizeBytes;
            if ($finalSize >= 1048576) {
                $filesize = round($finalSize / 1048576, 2) . ' MB';
            } else {
                $filesize = round($finalSize / 1024, 1) . ' KB';
            }
        }

        return Media::create([
            'title' => $title,
            'url' => $url,
            'file_name' => $filename,
            'file_type' => $extension,
            'file_size' => $filesize,
            'dimensions' => $dimensions,
            'alt_text' => $request->input('alt_text') ?: $title,
            'caption' => $request->input('caption', ''),
        ]);
    }

    public function store(Request $request)
    {
        $allFiles = [];
        if ($request->hasFile('files')) {
            $files = $request->file('files');
            $allFiles = is_array($files) ? $files : [$files];
        } elseif ($request->hasFile('file')) {
            $file = $request->file('file');
            $allFiles = is_array($file) ? $file : [$file];
        }

        if (!empty($allFiles)) {
            $uploadedCount = 0;
            foreach ($allFiles as $file) {
                if ($file && $file->isValid()) {
                    $this->processUploadedFile($file, $request);
                    $uploadedCount++;
                }
            }

            if ($request->expectsJson() || $request->is('*/api/*') || $request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'count' => $uploadedCount,
                    'message' => "{$uploadedCount} file(s) uploaded successfully"
                ]);
            }

            $message = $uploadedCount > 1 
                ? "{$uploadedCount} files uploaded successfully to local storage"
                : 'File uploaded successfully to local storage';

            return redirect()->route('media.index')->with('success', $message);
        }

        $validated = $request->validate([
            'title' => 'required|string',
            'url' => 'required|string',
            'file_name' => 'nullable|string',
            'file_type' => 'nullable|string',
            'file_size' => 'nullable|string',
            'dimensions' => 'nullable|string',
            'alt_text' => 'nullable|string',
            'caption' => 'nullable|string',
        ]);

        Media::create($validated);

        return redirect()->route('media.index')->with('success', 'File uploaded successfully to local storage');
    }

    public function update(Request $request, $id)
    {
        $media = Media::findOrFail($id);

        $request->validate([
            'title' => 'nullable|string',
            'alt_text' => 'nullable|string',
            'caption' => 'nullable|string',
            'url' => 'nullable|string',
        ]);

        $media->update([
            'title' => $request->has('title') ? $request->input('title') : $media->title,
            'alt_text' => $request->has('alt_text') ? $request->input('alt_text') : $media->alt_text,
            'caption' => $request->has('caption') ? $request->input('caption') : $media->caption,
            'url' => $request->filled('url') ? $request->input('url') : $media->url,
        ]);

        return redirect()->route('media.index')->with('success', 'Media details updated successfully');
    }

    public function download($id)
    {
        $media = Media::findOrFail($id);

        if (str_starts_with($media->url, '/uploads/')) {
            $filePath = public_path(ltrim($media->url, '/'));
            if (File::exists($filePath)) {
                return response()->download($filePath, $media->file_name ?: basename($filePath));
            }
        }

        return redirect($media->url);
    }

    public function destroy($id)
    {
        $media = Media::findOrFail($id);

        // Delete physical file from public/uploads if local file exists
        if (str_starts_with($media->url, '/uploads/')) {
            $filePath = public_path(ltrim($media->url, '/'));
            if (File::exists($filePath)) {
                File::delete($filePath);
            }
        }

        $media->delete();

        return redirect()->route('media.index')->with('success', 'Media deleted successfully');
    }
}
