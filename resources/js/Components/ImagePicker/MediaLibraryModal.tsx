import React, { useState, useEffect } from 'react';
import {
    X,
    Search,
    Image as ImageIcon,
    Check,
    UploadCloud,
    Link as LinkIcon,
    RefreshCw,
    Plus,
    Crop as CropIcon,
    FileText
} from 'lucide-react';
import ImageCropperModal, { AspectRatioPreset } from './ImageCropperModal';

export interface MediaItem {
    id: number;
    title: string;
    url: string;
    file_name?: string;
    file_type?: string;
    file_size?: string;
    dimensions?: string;
    alt_text?: string;
    caption?: string;
    created_at?: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSelectImage?: (url: string) => void;
    onSelect?: (url: string) => void;
    currentImage?: string;
    defaultAspect?: AspectRatioPreset;
    title?: string;
}

export default function MediaLibraryModal({
    isOpen,
    onClose,
    onSelectImage,
    onSelect,
    currentImage,
    defaultAspect = '16:9',
    title = 'Choose or Upload Image',
}: Props) {
    const [activeTab, setActiveTab] = useState<'library' | 'upload' | 'url'>('library');
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedUrl, setSelectedUrl] = useState<string>(currentImage || '');
    const [manualUrl, setManualUrl] = useState<string>('');

    // Cropper state
    const [cropperOpen, setCropperOpen] = useState(false);
    const [selectedFileForCrop, setSelectedFileForCrop] = useState<File | null>(null);

    const triggerSelect = (url: string) => {
        if (typeof onSelectImage === 'function') {
            onSelectImage(url);
        }
        if (typeof onSelect === 'function') {
            onSelect(url);
        }
    };

    // Fetch media items from server
    const fetchMedia = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/admin-api/media?type=image&search=${encodeURIComponent(search)}`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setMediaItems(data);
            }
        } catch (err) {
            console.error('Failed to fetch media:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            if (currentImage) {
                setSelectedUrl(currentImage);
            }
            fetchMedia();
        }
    }, [isOpen, currentImage]);

    // Handle file selected for crop
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFileForCrop(e.target.files[0]);
            setCropperOpen(true);
        }
    };

    const handleConfirmSelection = () => {
        if (selectedUrl) {
            triggerSelect(selectedUrl);
            onClose();
        }
    };

    const handleApplyManualUrl = (e: React.FormEvent) => {
        e.preventDefault();
        if (manualUrl.trim()) {
            triggerSelect(manualUrl.trim());
            onClose();
        }
    };

    const handleCroppedComplete = (newUrl: string) => {
        setSelectedUrl(newUrl);
        triggerSelect(newUrl);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-40 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
                <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl h-[88vh] flex flex-col overflow-hidden font-sans">
                    
                    {/* Modal Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/70">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-rose-50 text-[#8f163b] flex items-center justify-center">
                                <ImageIcon size={18} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-sm">{title}</h3>
                                <p className="text-xs text-gray-500">Pick from existing media, upload &amp; crop, or paste image link</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Tabs */}
                            <div className="flex items-center bg-gray-200/70 p-1 rounded-xl text-xs font-semibold mr-2">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('library')}
                                    className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                                        activeTab === 'library'
                                            ? 'bg-white text-gray-900 shadow-xs'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    Media Library
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('upload')}
                                    className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                                        activeTab === 'upload'
                                            ? 'bg-white text-gray-900 shadow-xs'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    <CropIcon size={12} />
                                    <span>Upload &amp; Crop</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('url')}
                                    className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                                        activeTab === 'url'
                                            ? 'bg-white text-gray-900 shadow-xs'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    Paste URL
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={onClose}
                                className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Modal Content */}
                    <div className="flex-1 overflow-y-auto p-5">
                        
                        {/* TAB 1: Media Library */}
                        {activeTab === 'library' && (
                            <div className="h-full flex flex-col space-y-4">
                                {/* Search & Refresh Bar */}
                                <div className="flex items-center justify-between gap-3">
                                    <div className="relative flex-1 max-w-md">
                                        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && fetchMedia()}
                                            placeholder="Search media by title or filename..."
                                            className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:ring-1 focus:ring-[#8f163b]"
                                        />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={fetchMedia}
                                            className="p-2 text-gray-500 hover:text-gray-800 bg-gray-50 border border-gray-200 rounded-xl transition cursor-pointer"
                                            title="Refresh"
                                        >
                                            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                                        </button>

                                        <label className="inline-flex items-center gap-1.5 px-3 py-2 bg-rose-50 text-[#8f163b] hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-bold transition cursor-pointer">
                                            <UploadCloud size={14} />
                                            <span>Upload &amp; Crop New</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileSelect}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                </div>

                                {/* Media Grid */}
                                <div className="flex-1 overflow-y-auto min-h-[300px] border border-gray-100 rounded-2xl p-3 bg-gray-50/50">
                                    {loading ? (
                                        <div className="h-64 flex flex-col items-center justify-center text-gray-400 text-xs">
                                            <RefreshCw size={24} className="animate-spin mb-2 text-[#8f163b]" />
                                            <span>Loading media items...</span>
                                        </div>
                                    ) : mediaItems.length === 0 ? (
                                        <div className="h-64 flex flex-col items-center justify-center text-gray-400 text-xs text-center p-6">
                                            <ImageIcon size={36} className="mb-2 opacity-40 text-gray-400" />
                                            <p className="font-semibold text-gray-600 mb-1">No images found</p>
                                            <p className="text-[11px] text-gray-400 mb-3">Upload your first image or use a direct URL.</p>
                                            <label className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#8f163b] text-white rounded-xl text-xs font-bold transition cursor-pointer">
                                                <UploadCloud size={14} />
                                                <span>Upload &amp; Crop Image</span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFileSelect}
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                                            {mediaItems.map((item) => {
                                                const isSelected = selectedUrl === item.url;
                                                return (
                                                    <div
                                                        key={item.id}
                                                        onClick={() => setSelectedUrl(item.url)}
                                                        onDoubleClick={() => {
                                                            triggerSelect(item.url);
                                                            onClose();
                                                        }}
                                                        className={`group relative rounded-xl overflow-hidden border-2 cursor-pointer bg-white transition shadow-2xs hover:shadow-md ${
                                                            isSelected
                                                                ? 'border-[#8f163b] ring-2 ring-rose-200'
                                                                : 'border-transparent hover:border-gray-300'
                                                        }`}
                                                    >
                                                        <div className="aspect-square w-full overflow-hidden bg-gray-100 relative">
                                                            <img
                                                                src={item.url}
                                                                alt={item.title || ''}
                                                                loading="lazy"
                                                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                                                onError={(e) => {
                                                                    // Fallback placeholder icon
                                                                    (e.target as HTMLElement).style.display = 'none';
                                                                }}
                                                            />
                                                            {isSelected && (
                                                                <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-[#8f163b] text-white flex items-center justify-center shadow">
                                                                    <Check size={14} />
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="p-2 bg-white">
                                                            <p className="text-[11px] font-semibold text-gray-800 truncate" title={item.title}>
                                                                {item.title || item.file_name || 'Image'}
                                                            </p>
                                                            {item.file_size && (
                                                                <p className="text-[10px] text-gray-400">{item.file_size}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* TAB 2: Direct Upload & Crop */}
                        {activeTab === 'upload' && (
                            <div className="h-full flex flex-col items-center justify-center p-8">
                                <div className="max-w-md w-full border-2 border-dashed border-gray-300 hover:border-[#8f163b] rounded-3xl p-8 text-center bg-gray-50/50 hover:bg-rose-50/20 transition flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-2xl bg-rose-50 text-[#8f163b] flex items-center justify-center mb-4 shadow-xs">
                                        <CropIcon size={30} />
                                    </div>
                                    <h4 className="font-bold text-gray-900 text-base mb-1">Select Local Image to Crop</h4>
                                    <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                                        Choose an image from your computer to open the interactive cropper. Preset aspect ratio is <strong>{defaultAspect}</strong>.
                                    </p>

                                    <label className="inline-flex items-center gap-2 px-6 py-3 bg-[#8f163b] hover:bg-[#73102f] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition cursor-pointer">
                                        <UploadCloud size={16} />
                                        <span>Browse &amp; Crop File</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileSelect}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* TAB 3: Paste Direct URL */}
                        {activeTab === 'url' && (
                            <div className="h-full flex flex-col items-center justify-center p-8">
                                <form onSubmit={handleApplyManualUrl} className="max-w-md w-full bg-gray-50 border border-gray-200 rounded-3xl p-6 space-y-4 shadow-xs">
                                    <div className="flex items-center gap-2.5 mb-2">
                                        <div className="w-8 h-8 rounded-lg bg-rose-100 text-[#8f163b] flex items-center justify-center">
                                            <LinkIcon size={16} />
                                        </div>
                                        <h4 className="font-bold text-gray-900 text-sm">Direct Image URL</h4>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Web Image Link</label>
                                        <input
                                            type="url"
                                            required
                                            value={manualUrl}
                                            onChange={(e) => setManualUrl(e.target.value)}
                                            placeholder="https://images.unsplash.com/... or https://..."
                                            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl outline-none focus:ring-1 focus:ring-[#8f163b] bg-white"
                                        />
                                    </div>

                                    {manualUrl && (
                                        <div className="w-full h-36 rounded-xl overflow-hidden bg-white border border-gray-200">
                                            <img
                                                src={manualUrl}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                                onError={(e) => ((e.target as HTMLElement).style.display = 'none')}
                                            />
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={!manualUrl.trim()}
                                        className="w-full py-2.5 bg-[#8f163b] hover:bg-[#73102f] text-white rounded-xl text-xs font-bold transition cursor-pointer disabled:opacity-50"
                                    >
                                        Apply Image URL
                                    </button>
                                </form>
                            </div>
                        )}

                    </div>

                    {/* Modal Footer */}
                    <div className="flex items-center justify-between px-6 py-3.5 border-t border-gray-100 bg-gray-50/70">
                        <div className="text-xs text-gray-500 truncate max-w-md">
                            {selectedUrl ? (
                                <span className="flex items-center gap-1.5">
                                    <span className="font-semibold text-gray-700">Selected:</span>
                                    <span className="text-gray-500 truncate">{selectedUrl}</span>
                                </span>
                            ) : (
                                <span>No image selected yet</span>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition cursor-pointer"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleConfirmSelection}
                                disabled={!selectedUrl}
                                className="px-5 py-2 text-xs font-bold text-white bg-[#8f163b] hover:bg-[#73102f] rounded-xl shadow-xs transition cursor-pointer disabled:opacity-50"
                            >
                                Use Selected Image
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            {/* Nested Interactive Cropper Modal */}
            {cropperOpen && (
                <ImageCropperModal
                    isOpen={cropperOpen}
                    onClose={() => setCropperOpen(false)}
                    imageFile={selectedFileForCrop}
                    defaultAspect={defaultAspect}
                    onCropComplete={handleCroppedComplete}
                    onSelectImage={handleCroppedComplete}
                    onSelect={handleCroppedComplete}
                />
            )}
        </>
    );
}
