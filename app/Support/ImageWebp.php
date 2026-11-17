<?php

namespace App\Support;

/**
 * Converts uploaded images to WebP and keeps them within a sane size.
 *
 * Every image the site stores must be WebP: JPEG/PNG/AVIF uploads are re-encoded,
 * and images larger than MAX_DIMENSION on their longest side are scaled down.
 */
class ImageWebp
{
    public const MAX_DIMENSION = 1600;

    public const QUALITY = 82;

    /** Load a file into a GD image using its real mime type (client extensions can lie). */
    public static function load(string $path)
    {
        $info = @getimagesize($path);
        if (!$info) {
            return null;
        }

        $image = null;
        switch ($info['mime'] ?? '') {
            case 'image/jpeg':
                $image = @imagecreatefromjpeg($path);
                break;
            case 'image/png':
                $image = @imagecreatefrompng($path);
                break;
            case 'image/webp':
                $image = @imagecreatefromwebp($path);
                break;
            case 'image/gif':
                $image = @imagecreatefromgif($path);
                break;
            case 'image/avif':
                if (function_exists('imagecreatefromavif')) {
                    $image = @imagecreatefromavif($path);
                }
                break;
            case 'image/bmp':
                if (function_exists('imagecreatefrombmp')) {
                    $image = @imagecreatefrombmp($path);
                }
                break;
            default:
                return null;
        }

        if (!$image) {
            return null;
        }

        imagepalettetotruecolor($image);
        imagealphablending($image, true);
        imagesavealpha($image, true);

        return $image;
    }

    /** Write a GD image as WebP, shrinking it to MAX_DIMENSION when needed (never upscales). */
    public static function write($image, string $destinationPath, int $quality = self::QUALITY): bool
    {
        if (!function_exists('imagewebp')) {
            return false;
        }

        $width = imagesx($image);
        $height = imagesy($image);
        $max = self::MAX_DIMENSION;

        if (max($width, $height) <= $max) {
            return (bool) @imagewebp($image, $destinationPath, $quality);
        }

        $scale = $max / max($width, $height);
        $newWidth = max(1, (int) round($width * $scale));
        $newHeight = max(1, (int) round($height * $scale));

        $resized = imagecreatetruecolor($newWidth, $newHeight);
        imagealphablending($resized, false);
        imagesavealpha($resized, true);
        imagecopyresampled($resized, $image, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);

        $result = (bool) @imagewebp($resized, $destinationPath, $quality);
        imagedestroy($resized);

        return $result;
    }

    /**
     * Convert an image file to WebP at $webpPath and return that path.
     * Returns null when the source is not a supported image.
     * When the source and destination are the same file the write goes through a
     * temp file first, so a failed conversion never destroys the original.
     */
    public static function convert(string $sourcePath, string $webpPath): ?string
    {
        $image = self::load($sourcePath);
        if (!$image) {
            return null;
        }

        $inPlace = $sourcePath === $webpPath;
        $writePath = $inPlace ? $webpPath . '.tmp' : $webpPath;

        $ok = self::write($image, $writePath);
        imagedestroy($image);

        if (!$ok) {
            @unlink($writePath);

            return null;
        }

        if ($inPlace) {
            @unlink($webpPath);
            if (!@rename($writePath, $webpPath)) {
                @unlink($writePath);

                return null;
            }
        }

        return $webpPath;
    }
}
