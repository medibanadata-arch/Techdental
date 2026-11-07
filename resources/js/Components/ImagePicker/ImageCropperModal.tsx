import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    X,
    Check,
    RotateCw,
    ZoomIn,
    ZoomOut,
    Crop as CropIcon,
    Maximize2,
    UploadCloud,
    Loader2,
    Sparkles,
    Image as ImageIcon
} from 'lucide-react';

export type AspectRatioPreset = 'free' | '16:9' | '1:1' | '4:3' | '3:2';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    imageSrc?: string;
    imageFile?: File | null;
    defaultAspect?: AspectRatioPreset;
    onCropComplete?: (uploadedUrl: string) => void;
    onSelectImage?: (uploadedUrl: string) => void;
    onSelect?: (uploadedUrl: string) => void;
    title?: string;
}

export default function ImageCropperModal({
    isOpen,
    onClose,
    imageSrc,
    imageFile,
    defaultAspect = '16:9',
    onCropComplete,
    onSelectImage,
    onSelect,
    title = 'Crop & Upload Image',
}: Props) {
    const [aspect, setAspect] = useState<AspectRatioPreset>(defaultAspect);
    const [rawImageSrc, setRawImageSrc] = useState<string>('');
    const [rotation, setRotation] = useState<number>(0);
    const [zoom, setZoom] = useState<number>(1);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string>('');

    // Canvas & Image refs
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);

    // Crop box coordinates (relative to displayed container)
    const [cropBox, setCropBox] = useState({ x: 10, y: 10, w: 200, h: 150 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragMode, setDragMode] = useState<'move' | 'se' | null>(null);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0, boxX: 0, boxY: 0, boxW: 0, boxH: 0 });

    const containerRef = useRef<HTMLDivElement | null>(null);

    // Load image from file or src
    useEffect(() => {
        if (!isOpen) return;
        setErrorMsg('');
        setRotation(0);
        setZoom(1);

        if (imageFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setRawImageSrc(e.target?.result as string);
            };
            reader.readAsDataURL(imageFile);
        } else if (imageSrc) {
            setRawImageSrc(imageSrc);
        }
    }, [isOpen, imageFile, imageSrc]);

    // Aspect ratio ratio numbers
    const getRatioValue = useCallback((preset: AspectRatioPreset): number | null => {
        switch (preset) {
            case '16:9': return 16 / 9;
            case '1:1': return 1;
            case '4:3': return 4 / 3;
            case '3:2': return 3 / 2;
            case 'free':
            default:
                return null;
        }
    }, []);

    // Accurately compute rendered image dimensions and letterbox offsets within object-contain container
    const getImageRenderBounds = useCallback(() => {
        if (!imgRef.current || !containerRef.current) return null;
        const cWidth = containerRef.current.clientWidth || 1;
        const cHeight = containerRef.current.clientHeight || 1;
        const nw = imgRef.current.naturalWidth || 1;
        const nh = imgRef.current.naturalHeight || 1;

        const containerRatio = cWidth / cHeight;
        const imgRatio = nw / nh;

        let renderedW = cWidth;
        let renderedH = cHeight;
        let offsetX = 0;
        let offsetY = 0;

        if (imgRatio > containerRatio) {
            renderedW = cWidth;
            renderedH = cWidth / imgRatio;
            offsetY = (cHeight - renderedH) / 2;
        } else {
            renderedH = cHeight;
            renderedW = cHeight * imgRatio;
            offsetX = (cWidth - renderedW) / 2;
        }

        const scale = nw / renderedW;
        return { cWidth, cHeight, nw, nh, renderedW, renderedH, offsetX, offsetY, scale };
    }, []);

    // Initialize or adjust crop box when aspect changes or image loads
    const resetCropBox = useCallback((preset: AspectRatioPreset) => {
        if (!containerRef.current) return;
        const bounds = getImageRenderBounds();
        const cWidth = containerRef.current.clientWidth || 400;
        const cHeight = containerRef.current.clientHeight || 300;

        const renderedW = bounds?.renderedW || cWidth;
        const renderedH = bounds?.renderedH || cHeight;
        const offsetX = bounds?.offsetX || 0;
        const offsetY = bounds?.offsetY || 0;

        const ratio = getRatioValue(preset);
        let w = renderedW * 0.9;
        let h = renderedH * 0.9;

        if (ratio) {
            if (w / h > ratio) {
                w = h * ratio;
            } else {
                h = w / ratio;
            }
        }

        const x = offsetX + Math.max(0, (renderedW - w) / 2);
        const y = offsetY + Math.max(0, (renderedH - h) / 2);
        setCropBox({ x, y, w, h });
    }, [getRatioValue, getImageRenderBounds]);

    useEffect(() => {
        if (rawImageSrc) {
            const timer = setTimeout(() => resetCropBox(aspect), 150);
            return () => clearTimeout(timer);
        }
    }, [rawImageSrc, aspect, resetCropBox]);

    // Mouse handlers for dragging & resizing crop rectangle
    const handleMouseDown = (e: React.MouseEvent, mode: 'move' | 'se') => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
        setDragMode(mode);
        setDragStart({
            x: e.clientX,
            y: e.clientY,
            boxX: cropBox.x,
            boxY: cropBox.y,
            boxW: cropBox.w,
            boxH: cropBox.h,
        });
    };

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging || !containerRef.current) return;

        const dx = e.clientX - dragStart.x;
        const dy = e.clientY - dragStart.y;
        const cWidth = containerRef.current.clientWidth;
        const cHeight = containerRef.current.clientHeight;

        if (dragMode === 'move') {
            let nextX = dragStart.boxX + dx;
            let nextY = dragStart.boxY + dy;

            nextX = Math.max(0, Math.min(nextX, cWidth - dragStart.boxW));
            nextY = Math.max(0, Math.min(nextY, cHeight - dragStart.boxH));

            setCropBox(prev => ({ ...prev, x: nextX, y: nextY }));
        } else if (dragMode === 'se') {
            const ratio = getRatioValue(aspect);
            let nextW = Math.max(50, dragStart.boxW + dx);
            let nextH = Math.max(50, dragStart.boxH + dy);

            if (ratio) {
                // Lock aspect ratio
                nextH = nextW / ratio;
            }

            if (dragStart.boxX + nextW > cWidth) {
                nextW = cWidth - dragStart.boxX;
                if (ratio) nextH = nextW / ratio;
            }
            if (dragStart.boxY + nextH > cHeight) {
                nextH = cHeight - dragStart.boxY;
                if (ratio) nextW = nextH * ratio;
            }

            setCropBox(prev => ({ ...prev, w: nextW, h: nextH }));
        }
    }, [isDragging, dragMode, dragStart, aspect, getRatioValue]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        setDragMode(null);
    }, []);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    // Live preview update
    useEffect(() => {
        if (!imgRef.current || !containerRef.current || !previewCanvasRef.current) return;

        const img = imgRef.current;
        const previewCanvas = previewCanvasRef.current;
        const pCtx = previewCanvas.getContext('2d');
        if (!pCtx) return;

        const bounds = getImageRenderBounds();
        if (!bounds) return;
        const { nw, nh, offsetX, offsetY, scale } = bounds;

        const relX = cropBox.x - offsetX;
        const relY = cropBox.y - offsetY;
        const rawSx = relX * scale;
        const rawSy = relY * scale;
        const rawSw = cropBox.w * scale;
        const rawSh = cropBox.h * scale;

        const sourceX = Math.max(0, Math.min(nw - 1, rawSx));
        const sourceY = Math.max(0, Math.min(nh - 1, rawSy));
        const sourceW = Math.max(1, Math.min(nw - sourceX, rawSw - Math.max(0, -rawSx)));
        const sourceH = Math.max(1, Math.min(nh - sourceY, rawSh - Math.max(0, -rawSy)));

        previewCanvas.width = 160;
        previewCanvas.height = 160 / (cropBox.w / cropBox.h);

        pCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
        try {
            pCtx.drawImage(
                img,
                sourceX,
                sourceY,
                sourceW,
                sourceH,
                0,
                0,
                previewCanvas.width,
                previewCanvas.height
            );
        } catch {
            // Ignore cross-origin error in preview if any
        }
    }, [cropBox, rawImageSrc, rotation, zoom, getImageRenderBounds]);

    // Upload original file directly without cropping
    const handleUploadOriginal = async () => {
        if (!imageFile) {
            if (rawImageSrc) {
                if (typeof onCropComplete === 'function') onCropComplete(rawImageSrc);
                if (typeof onSelectImage === 'function') onSelectImage(rawImageSrc);
                if (typeof onSelect === 'function') onSelect(rawImageSrc);
                onClose();
            }
            return;
        }

        setIsUploading(true);
        setErrorMsg('');

        try {
            const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
            const formData = new FormData();
            formData.append('file', imageFile);
            formData.append('title', imageFile.name.replace(/\.[^/.]+$/, ''));

            const res = await fetch('/admin-api/media/upload', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': token,
                    'Accept': 'application/json',
                },
                body: formData,
            });

            const data = await res.json();
            if (data.success && data.url) {
                if (typeof onCropComplete === 'function') onCropComplete(data.url);
                if (typeof onSelectImage === 'function') onSelectImage(data.url);
                if (typeof onSelect === 'function') onSelect(data.url);
                onClose();
            } else {
                throw new Error(data.message || 'Upload failed');
            }
        } catch (err: any) {
            console.error('Direct upload error:', err);
            setErrorMsg(err.message || 'Failed to upload original image. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    // Execute Crop & Upload
    const handleCropAndUpload = async () => {
        if (!imgRef.current || !containerRef.current) return;
        setIsUploading(true);
        setErrorMsg('');

        try {
            const img = imgRef.current;
            const bounds = getImageRenderBounds();
            if (!bounds) throw new Error('Could not calculate image render bounds');
            const { nw, nh, offsetX, offsetY, scale } = bounds;

            const relX = cropBox.x - offsetX;
            const relY = cropBox.y - offsetY;
            const rawSx = relX * scale;
            const rawSy = relY * scale;
            const rawSw = cropBox.w * scale;
            const rawSh = cropBox.h * scale;

            const sourceX = Math.max(0, Math.min(nw - 1, rawSx));
            const sourceY = Math.max(0, Math.min(nh - 1, rawSy));
            const sourceW = Math.max(1, Math.min(nw - sourceX, rawSw - Math.max(0, -rawSx)));
            const sourceH = Math.max(1, Math.min(nh - sourceY, rawSh - Math.max(0, -rawSy)));

            // Target canvas for output
            const outCanvas = document.createElement('canvas');
            outCanvas.width = Math.round(sourceW);
            outCanvas.height = Math.round(sourceH);
            const ctx = outCanvas.getContext('2d');

            if (!ctx) throw new Error('Canvas context could not be created');

            ctx.drawImage(
                img,
                sourceX,
                sourceY,
                sourceW,
                sourceH,
                0,
                0,
                outCanvas.width,
                outCanvas.height
            );

            // Convert to blob
            const blob = await new Promise<Blob | null>((resolve) => {
                outCanvas.toBlob((b) => resolve(b), 'image/webp', 0.92);
            });

            if (!blob) throw new Error('Failed to generate cropped image blob');

            const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
            const formData = new FormData();
            const fileName = (imageFile?.name ? imageFile.name.replace(/\.[^/.]+$/, '') : 'cropped_image') + '.webp';
            formData.append('file', blob, fileName);
            formData.append('title', fileName.replace('.webp', ''));

            const res = await fetch('/admin-api/media/upload', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': token,
                    'Accept': 'application/json',
                },
                body: formData,
            });

            const data = await res.json();
            if (data.success && data.url) {
                if (typeof onCropComplete === 'function') {
                    onCropComplete(data.url);
                }
                if (typeof onSelectImage === 'function') {
                    onSelectImage(data.url);
                }
                if (typeof onSelect === 'function') {
                    onSelect(data.url);
                }
                onClose();
            } else {
                throw new Error(data.message || 'Upload failed');
            }
        } catch (err: any) {
            console.error('Cropper upload error:', err);
            setErrorMsg(err.message || 'Failed to crop and upload. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
                
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-rose-50 text-[#8f163b] flex items-center justify-center">
                            <CropIcon size={18} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-sm">{title}</h3>
                            <p className="text-xs text-gray-500">Drag or resize the crop frame, then click Crop & Save</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Main Cropper Body */}
                <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 md:grid-cols-12 gap-5">
                    
                    {/* Left: Interactive Canvas Box */}
                    <div className="md:col-span-8 flex flex-col items-center justify-center">
                        <div
                            ref={containerRef}
                            className="relative w-full h-[360px] bg-slate-900/95 rounded-2xl overflow-hidden select-none flex items-center justify-center shadow-inner"
                        >
                            {rawImageSrc ? (
                                <>
                                    <img
                                        ref={imgRef}
                                        src={rawImageSrc}
                                        alt="To crop"
                                        crossOrigin="anonymous"
                                        onLoad={() => resetCropBox(aspect)}
                                        className="w-full h-full object-contain pointer-events-none"
                                        style={{
                                            transform: `rotate(${rotation}deg) scale(${zoom})`,
                                            transition: isDragging ? 'none' : 'transform 0.15s ease',
                                        }}
                                    />

                                    {/* Semi-transparent dark overlay */}
                                    <div className="absolute inset-0 bg-black/40 pointer-events-none" />

                                    {/* Crop Rectangle Box */}
                                    <div
                                        style={{
                                            left: `${cropBox.x}px`,
                                            top: `${cropBox.y}px`,
                                            width: `${cropBox.w}px`,
                                            height: `${cropBox.h}px`,
                                        }}
                                        onMouseDown={(e) => handleMouseDown(e, 'move')}
                                        className="absolute border-2 border-white/90 shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] cursor-move z-10 flex items-center justify-center group"
                                    >
                                        {/* Grid lines inside crop */}
                                        <div className="w-full h-full grid grid-cols-3 grid-rows-3 pointer-events-none opacity-40 group-hover:opacity-75 transition">
                                            <div className="border-r border-b border-white/50" />
                                            <div className="border-r border-b border-white/50" />
                                            <div className="border-b border-white/50" />
                                            <div className="border-r border-b border-white/50" />
                                            <div className="border-r border-b border-white/50" />
                                            <div className="border-b border-white/50" />
                                            <div className="border-r border-white/50" />
                                            <div className="border-r border-white/50" />
                                            <div />
                                        </div>

                                        {/* Center helper badge */}
                                        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded pointer-events-none uppercase tracking-wider">
                                            {aspect}
                                        </div>

                                        {/* Bottom-right resize handle */}
                                        <div
                                            onMouseDown={(e) => handleMouseDown(e, 'se')}
                                            className="absolute -bottom-2 -right-2 w-5 h-5 bg-white border-2 border-[#8f163b] rounded-full shadow cursor-se-resize z-20 flex items-center justify-center hover:scale-125 transition"
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="text-center p-6 text-gray-400 text-xs">
                                    <ImageIcon size={32} className="mx-auto mb-2 opacity-50" />
                                    <span>No image loaded</span>
                                </div>
                            )}
                        </div>

                        {/* Controls Toolbar: Zoom, Rotate */}
                        <div className="w-full flex items-center justify-between gap-4 mt-3 px-2 text-xs text-gray-600">
                            <div className="flex items-center gap-2">
                                <ZoomOut size={14} className="text-gray-400" />
                                <input
                                    type="range"
                                    min="1"
                                    max="2.5"
                                    step="0.05"
                                    value={zoom}
                                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                                    className="w-28 accent-[#8f163b] cursor-pointer"
                                />
                                <ZoomIn size={14} className="text-gray-400" />
                                <span className="text-[11px] font-bold w-10 text-gray-700">{(zoom).toFixed(1)}x</span>
                            </div>

                            <button
                                type="button"
                                onClick={() => setRotation((r) => (r + 90) % 360)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold transition cursor-pointer"
                            >
                                <RotateCw size={13} />
                                <span>Rotate 90°</span>
                            </button>
                        </div>
                    </div>

                    {/* Right: Aspect Presets & Live Preview */}
                    <div className="md:col-span-4 flex flex-col justify-between border-t md:border-t-0 md:border-l border-gray-100 md:pl-5 space-y-4">
                        
                        {/* Aspect Ratio Buttons */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                Aspect Ratio Preset
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {(
                                    [
                                        { key: '16:9', label: '16:9 Cover' },
                                        { key: '1:1', label: '1:1 Square' },
                                        { key: '4:3', label: '4:3 Standard' },
                                        { key: '3:2', label: '3:2 Photo' },
                                        { key: 'free', label: 'Freeform' },
                                    ] as { key: AspectRatioPreset; label: string }[]
                                ).map((item) => (
                                    <button
                                        key={item.key}
                                        type="button"
                                        onClick={() => {
                                            setAspect(item.key);
                                            resetCropBox(item.key);
                                        }}
                                        className={`px-2.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer text-center ${
                                            aspect === item.key
                                                ? 'bg-[#8f163b] text-white shadow-xs'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Live Crop Preview Box */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                Cropped Preview
                            </label>
                            <div className="w-full h-36 bg-gray-100 rounded-2xl border border-gray-200 overflow-hidden flex items-center justify-center p-2 shadow-2xs">
                                <canvas
                                    ref={previewCanvasRef}
                                    className="max-h-full max-w-full rounded-lg shadow-sm object-contain"
                                />
                            </div>
                        </div>

                        {errorMsg && (
                            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-medium border border-red-100">
                                {errorMsg}
                            </div>
                        )}

                        {/* Action buttons */}
                        <div className="pt-2 flex flex-col gap-2">
                            <button
                                type="button"
                                onClick={handleCropAndUpload}
                                disabled={isUploading || !rawImageSrc}
                                className="w-full py-3 bg-[#8f163b] hover:bg-[#73102f] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        <span>Uploading to Media Library...</span>
                                    </>
                                ) : (
                                    <>
                                        <Check size={16} />
                                        <span>Crop &amp; Apply Image</span>
                                    </>
                                )}
                            </button>

                            {imageFile && (
                                <button
                                    type="button"
                                    onClick={handleUploadOriginal}
                                    disabled={isUploading}
                                    className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
                                    title="Upload original file without cropping"
                                >
                                    <UploadCloud size={14} />
                                    <span>Use Full Image (No Crop)</span>
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isUploading}
                                className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
