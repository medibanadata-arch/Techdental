import React, { useState, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Grid,
    List as ListIcon,
    Search,
    Upload,
    X,
    Trash2,
    Copy,
    Check,
    Calendar,
    ExternalLink,
    Image as ImageIcon,
    Video,
    Music,
    FileText,
    Play,
    Volume2,
    HardDrive,
    Layers,
    Download,
    Save,
    RotateCw,
    Crop
} from 'lucide-react';
import ImageCropperModal from '@/Components/ImagePicker/ImageCropperModal';
import { PageProps } from '@inertiajs/core';

interface MediaItem {
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

interface Props extends PageProps {
    media: MediaItem[];
}

export default function MediaIndex({ media }: Props) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [filterType, setFilterType] = useState('all');
    const [filterDate, setFilterDate] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
    const [copied, setCopied] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatusText, setUploadStatusText] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [saving, setSaving] = useState(false);
    const [isRotating, setIsRotating] = useState(false);
    const [isCropperOpen, setIsCropperOpen] = useState(false);

    const handleRotateImage = async (id: number, degrees: number = 90) => {
        setIsRotating(true);
        try {
            const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
            const res = await fetch(`/admin-api/media/${id}/rotate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': token,
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ degrees }),
            });
            const data = await res.json();
            if (data.success && data.url) {
                setEditForm(prev => ({ ...prev, url: data.url }));
                if (selectedMedia) {
                    selectedMedia.url = data.url;
                    if (data.dimensions) selectedMedia.dimensions = data.dimensions;
                    if (data.file_size) selectedMedia.file_size = data.file_size;
                }
            } else {
                alert(data.message || 'Failed to rotate image');
            }
        } catch (e: any) {
            console.error('Rotate error:', e);
            alert('Failed to rotate image. Please try again.');
        } finally {
            setIsRotating(false);
        }
    };

    const handleCroppedComplete = (newUrl: string) => {
        setEditForm(prev => ({ ...prev, url: newUrl }));
        if (selectedMedia) {
            selectedMedia.url = newUrl;
        }
        setIsCropperOpen(false);
    };

    const [editForm, setEditForm] = useState({
        title: '',
        alt_text: '',
        caption: '',
        url: '',
    });

    const openMediaDetails = (item: MediaItem) => {
        setSelectedMedia(item);
        setEditForm({
            title: item.title || '',
            alt_text: item.alt_text || item.title || '',
            caption: item.caption || '',
            url: item.url || '',
        });
        setCopied(false);
    };

    const handleSave = () => {
        if (!selectedMedia) return;
        setSaving(true);
        router.put(route('media.update', selectedMedia.id), {
            title: editForm.title,
            alt_text: editForm.alt_text,
            caption: editForm.caption,
            url: editForm.url,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setSaving(false);
                setSelectedMedia(prev => prev ? {
                    ...prev,
                    title: editForm.title,
                    alt_text: editForm.alt_text,
                    caption: editForm.caption,
                    url: editForm.url,
                } : null);
            },
            onError: () => {
                setSaving(false);
                alert('Failed to save changes. Please try again.');
            }
        });
    };

    // Helper to determine media classification
    const getMediaType = (item: MediaItem): 'image' | 'video' | 'audio' | 'document' => {
        const type = item.file_type?.toLowerCase() || '';
        const url = item.url?.toLowerCase() || '';
        if (type.startsWith('image') || url.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i)) return 'image';
        if (type.startsWith('video') || url.match(/\.(mp4|webm|mov|mkv|avi)$/i)) return 'video';
        if (type.startsWith('audio') || url.match(/\.(mp3|wav|ogg|m4a|aac)$/i)) return 'audio';
        return 'document';
    };

    const filteredMedia = useMemo(() => {
        return media.filter(item => {
            const itemType = getMediaType(item);
            if (filterType === 'images' && itemType !== 'image') return false;
            if (filterType === 'video' && itemType !== 'video') return false;
            if (filterType === 'audio' && itemType !== 'audio') return false;
            if (filterType === 'documents' && itemType !== 'document') return false;

            const matchesSearch = !searchQuery || 
                (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (item.file_name && item.file_name.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesSearch;
        });
    }, [media, filterType, searchQuery]);

    const handleCopy = (url: string) => {
        const fullUrl = url.startsWith('http') ? url : window.location.origin + url;
        navigator.clipboard.writeText(fullUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this file from local storage?')) {
            router.delete(route('media.destroy', id), {
                onSuccess: () => setSelectedMedia(null),
            });
        }
    };

    const uploadFiles = (files: File[]) => {
        if (!files || files.length === 0) return;

        setIsUploading(true);
        const count = files.length;
        setUploadStatusText(`Uploading ${count} file${count > 1 ? 's' : ''}...`);

        if (count <= 15) {
            const formData = new FormData();
            files.forEach((file) => {
                formData.append('files[]', file);
            });
            formData.append('file', files[0]);

            router.post(route('media.store'), formData, {
                forceFormData: true,
                onSuccess: () => {
                    setIsUploadModalOpen(false);
                    setIsUploading(false);
                    setUploadStatusText('');
                },
                onError: () => {
                    setIsUploading(false);
                    setUploadStatusText('');
                    alert('Upload failed. Please check file sizes and formats.');
                }
            });
        } else {
            uploadInBatches(files);
        }
    };

    const uploadInBatches = async (files: File[]) => {
        setIsUploading(true);
        const total = files.length;
        const batchSize = 10;
        const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';

        for (let i = 0; i < total; i += batchSize) {
            const chunk = files.slice(i, i + batchSize);
            const formData = new FormData();
            chunk.forEach(f => formData.append('files[]', f));
            formData.append('file', chunk[0]);

            const currentCount = Math.min(i + chunk.length, total);
            setUploadStatusText(`Uploading ${currentCount} of ${total} files (${Math.round((currentCount / total) * 100)}%)...`);

            try {
                await fetch('/admin-api/media/upload', {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': csrfToken,
                        'Accept': 'application/json',
                    },
                    body: formData,
                });
            } catch (err) {
                console.error('Batch upload error:', err);
            }
        }

        setIsUploading(false);
        setUploadStatusText('');
        setIsUploadModalOpen(false);
        router.reload();
    };

    return (
        <AdminLayout>
            <Head title="Media Library - Tech Dental" />

            <div className="space-y-5">
                {/* Top Action Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2.5">
                            <span className="w-3 h-3 rounded-full bg-rose-600"></span>
                            Media Library
                        </h1>
                    </div>

                    <button
                        onClick={() => setIsUploadModalOpen(true)}
                        className="inline-flex items-center gap-2 bg-[#800038] hover:bg-[#990044] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
                    >
                        <Upload size={15} />
                        <span>Upload File</span>
                    </button>
                </div>

                {/* Filter and Search Bar */}
                <div className="bg-white p-3.5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                        {/* View Mode Switcher */}
                        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50 p-0.5">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-400 hover:text-gray-700'}`}
                                title="Grid View"
                            >
                                <Grid size={16} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-400 hover:text-gray-700'}`}
                                title="List View"
                            >
                                <ListIcon size={16} />
                            </button>
                        </div>

                        {/* Media Type Dropdown Filter */}
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-rose-500 cursor-pointer"
                        >
                            <option value="all">All media types</option>
                            <option value="images">Images</option>
                            <option value="video">Videos</option>
                            <option value="audio">Audios</option>
                            <option value="documents">Documents</option>
                        </select>

                        <select
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            className="text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-rose-500 cursor-pointer"
                        >
                            <option value="all">All dates</option>
                            <option value="recent">Recent uploads</option>
                        </select>
                    </div>

                    {/* Search Field */}
                    <div className="relative flex-1 max-w-xs">
                        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search media..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-500 transition-all"
                        />
                    </div>
                </div>

                {/* Main Content Area */}
                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">
                        {filteredMedia.map((item) => {
                            const mediaType = getMediaType(item);

                            return (
                                <div
                                    key={item.id}
                                    onClick={() => openMediaDetails(item)}
                                    className={`relative aspect-square rounded-2xl overflow-hidden bg-slate-900 border transition-all cursor-pointer group hover:shadow-md flex items-center justify-center ${
                                        selectedMedia?.id === item.id ? 'ring-3 ring-rose-500 border-transparent' : 'border-gray-200/80 hover:border-gray-300'
                                    }`}
                                >
                                    {mediaType === 'image' && (
                                        <img
                                            src={item.url}
                                            alt={item.title || 'Media'}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            loading="lazy"
                                        />
                                    )}

                                    {mediaType === 'video' && (
                                        <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center p-3 text-white">
                                            <div className="w-12 h-12 rounded-full bg-rose-600/80 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                                <Play size={20} className="fill-white translate-x-0.5" />
                                            </div>
                                            <span className="text-[10px] font-mono text-gray-300 mt-2 truncate w-full text-center">VIDEO</span>
                                        </div>
                                    )}

                                    {mediaType === 'audio' && (
                                        <div className="w-full h-full bg-gradient-to-br from-indigo-950 to-slate-900 flex flex-col items-center justify-center p-3 text-white">
                                            <div className="w-12 h-12 rounded-full bg-indigo-600/80 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                                <Music size={22} className="text-white" />
                                            </div>
                                            <span className="text-[10px] font-mono text-indigo-300 mt-2 truncate w-full text-center">AUDIO</span>
                                        </div>
                                    )}

                                    {mediaType === 'document' && (
                                        <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center p-3 text-gray-700">
                                            <FileText size={32} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                                            <span className="text-[10px] font-mono text-gray-500 mt-2 truncate w-full text-center">{item.file_name || 'DOC'}</span>
                                        </div>
                                    )}

                                    {/* Overlay Caption */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                                        <span className="text-[11px] font-medium text-white truncate w-full">
                                            {item.title || item.file_name}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-xs">
                        <table className="w-full text-left text-xs text-gray-600">
                            <thead className="bg-gray-50/80 text-gray-700 font-bold border-b border-gray-200 uppercase tracking-wider text-[11px]">
                                <tr>
                                    <th className="p-3 w-16">Preview</th>
                                    <th className="p-3">Title / File</th>
                                    <th className="p-3">Type</th>
                                    <th className="p-3">Size</th>
                                    <th className="p-3">Date</th>
                                    <th className="p-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredMedia.map((item) => {
                                    const mediaType = getMediaType(item);

                                    return (
                                        <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                                            <td className="p-3">
                                                {mediaType === 'image' && (
                                                    <img
                                                        src={item.url}
                                                        alt={item.title}
                                                        className="w-12 h-12 rounded-xl object-cover border border-gray-200 cursor-pointer"
                                                        onClick={() => openMediaDetails(item)}
                                                    />
                                                )}
                                                {mediaType === 'video' && (
                                                    <div
                                                        onClick={() => openMediaDetails(item)}
                                                        className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white cursor-pointer"
                                                    >
                                                        <Video size={18} className="text-rose-400" />
                                                    </div>
                                                )}
                                                {mediaType === 'audio' && (
                                                    <div
                                                        onClick={() => openMediaDetails(item)}
                                                        className="w-12 h-12 rounded-xl bg-indigo-900 flex items-center justify-center text-white cursor-pointer"
                                                    >
                                                        <Volume2 size={18} className="text-indigo-300" />
                                                    </div>
                                                )}
                                                {mediaType === 'document' && (
                                                    <div
                                                        onClick={() => openMediaDetails(item)}
                                                        className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 cursor-pointer"
                                                    >
                                                        <FileText size={18} />
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-3">
                                                <div className="font-bold text-gray-900 cursor-pointer" onClick={() => openMediaDetails(item)}>{item.title}</div>
                                                <div className="text-gray-400 font-mono text-[10px]">{item.file_name}</div>
                                            </td>
                                            <td className="p-3 font-mono capitalize">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                    mediaType === 'video' ? 'bg-rose-50 text-rose-700' :
                                                    mediaType === 'audio' ? 'bg-indigo-50 text-indigo-700' :
                                                    mediaType === 'image' ? 'bg-emerald-50 text-emerald-700' :
                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {mediaType}
                                                </span>
                                            </td>
                                            <td className="p-3">{item.file_size || '—'}</td>
                                            <td className="p-3 text-gray-400">{item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recent'}</td>
                                            <td className="p-3 text-right">
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition cursor-pointer"
                                                    title="Delete permanently"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Details / Edit Modal (Attachment Details) */}
                {selectedMedia && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
                        <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col border border-gray-100">
                            
                            {/* Modal Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
                                <div className="flex items-center gap-2.5">
                                    <Layers className="text-[#800020] w-5 h-5" />
                                    <h3 className="font-bold text-gray-900 text-sm tracking-tight">Attachment Details</h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSelectedMedia(null)}
                                    className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Column: Media Preview & Specs */}
                                <div className="flex flex-col">
                                    <div className="border border-gray-200/80 rounded-2xl bg-[#f8fafc] p-4 flex flex-col items-center justify-center min-h-[280px] max-h-[380px] overflow-hidden">
                                        {getMediaType(selectedMedia) === 'image' && (
                                            <img
                                                src={editForm.url || selectedMedia.url}
                                                alt={editForm.alt_text || editForm.title}
                                                className="max-h-[320px] max-w-full object-contain rounded-lg shadow-xs"
                                            />
                                        )}

                                        {getMediaType(selectedMedia) === 'video' && (
                                            <video
                                                controls
                                                src={editForm.url || selectedMedia.url}
                                                className="max-h-[320px] w-full rounded-lg shadow-xs bg-black"
                                            />
                                        )}

                                        {getMediaType(selectedMedia) === 'audio' && (
                                            <div className="w-full py-8 flex flex-col items-center justify-center">
                                                <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
                                                    <Volume2 size={32} />
                                                </div>
                                                <audio
                                                    controls
                                                    src={editForm.url || selectedMedia.url}
                                                    className="w-full"
                                                />
                                            </div>
                                        )}

                                        {getMediaType(selectedMedia) === 'document' && (
                                            <div className="w-full py-8 flex flex-col items-center justify-center text-gray-700">
                                                <FileText size={56} className="text-gray-400 mb-2" />
                                                <span className="text-xs font-mono text-gray-600">{selectedMedia.file_name}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Image Rotate & Crop Action Bar */}
                                    {getMediaType(selectedMedia) === 'image' && (
                                        <div className="flex items-center gap-2 mt-3">
                                            <button
                                                type="button"
                                                onClick={() => handleRotateImage(selectedMedia.id, 90)}
                                                disabled={isRotating}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 shadow-2xs transition cursor-pointer disabled:opacity-50"
                                                title="Rotate 90° Clockwise"
                                            >
                                                <RotateCw size={13} className={isRotating ? 'animate-spin text-[#800038]' : 'text-gray-600'} />
                                                <span>{isRotating ? 'Rotating...' : 'Rotate 90°'}</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setIsCropperOpen(true)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 shadow-2xs transition cursor-pointer"
                                                title="Crop & Resize image"
                                            >
                                                <Crop size={13} className="text-[#800038]" />
                                                <span>Crop &amp; Edit</span>
                                            </button>
                                        </div>
                                    )}

                                    {/* File Specs Details Box */}
                                    <div className="bg-[#f0f4f9]/80 border border-[#e2e8f0] rounded-xl p-4 mt-4 space-y-1.5 text-xs text-[#334155]">
                                        <div>
                                            <span className="font-bold text-[#1e293b]">File name:</span>{' '}
                                            <span className="text-[#334155] break-all">{selectedMedia.file_name || (editForm.url.split('/').pop()?.split('?')[0]) || 'media_file'}</span>
                                        </div>
                                        <div>
                                            <span className="font-bold text-[#1e293b]">File type:</span>{' '}
                                            <span className="text-[#334155]">{selectedMedia.file_type || (editForm.url.split('.').pop()?.split('?')[0]) || 'image'}</span>
                                        </div>
                                        <div>
                                            <span className="font-bold text-[#1e293b]">File size:</span>{' '}
                                            <span className="text-[#334155]">{selectedMedia.file_size || '246 KB'}</span>
                                        </div>
                                        <div>
                                            <span className="font-bold text-[#1e293b]">Dimensions:</span>{' '}
                                            <span className="text-[#334155]">{selectedMedia.dimensions || '1200 by 1600 pixels'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Edit Controls */}
                                <div className="flex flex-col justify-between space-y-4">
                                    <div className="space-y-4">
                                        {/* Alternative Text */}
                                        <div>
                                            <label className="block text-xs font-bold text-[#1e293b] mb-1.5">
                                                Alternative Text
                                            </label>
                                            <textarea
                                                rows={2}
                                                value={editForm.alt_text}
                                                onChange={(e) => setEditForm({ ...editForm, alt_text: e.target.value })}
                                                className="w-full text-xs text-gray-800 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:border-[#800020] focus:ring-1 focus:ring-[#800020] focus:outline-none transition resize-y"
                                            />
                                        </div>

                                        {/* Title */}
                                        <div>
                                            <label className="block text-xs font-bold text-[#1e293b] mb-1.5">
                                                Title
                                            </label>
                                            <input
                                                type="text"
                                                value={editForm.title}
                                                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                                className="w-full text-xs text-gray-800 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:border-[#800020] focus:ring-1 focus:ring-[#800020] focus:outline-none transition"
                                            />
                                        </div>

                                        {/* Image Caption */}
                                        <div>
                                            <label className="block text-xs font-bold text-[#1e293b] mb-1.5">
                                                Image Caption
                                            </label>
                                            <textarea
                                                rows={2}
                                                value={editForm.caption}
                                                onChange={(e) => setEditForm({ ...editForm, caption: e.target.value })}
                                                placeholder="Caption displayed below the image"
                                                className="w-full text-xs text-gray-800 border border-gray-200 rounded-xl px-3.5 py-2.5 placeholder-gray-400 focus:border-[#800020] focus:ring-1 focus:ring-[#800020] focus:outline-none transition resize-y"
                                            />
                                        </div>

                                        {/* File URL (Editable as requested) */}
                                        <div>
                                            <label className="block text-xs font-bold text-[#1e293b] mb-1.5">
                                                File URL:
                                            </label>
                                            <input
                                                type="text"
                                                value={editForm.url}
                                                onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
                                                className="w-full text-xs font-mono text-gray-700 bg-gray-50/70 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020] focus:outline-none transition"
                                            />
                                        </div>

                                        {/* Copy URL to clipboard */}
                                        <div>
                                            <button
                                                type="button"
                                                onClick={() => handleCopy(editForm.url)}
                                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-blue-600 text-xs font-semibold transition cursor-pointer"
                                            >
                                                {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                                                <span>{copied ? 'Copied to clipboard' : 'Copy URL to clipboard'}</span>
                                            </button>
                                        </div>

                                        {/* Action links */}
                                        <div className="flex items-center gap-3 pt-3 border-t border-gray-100 text-xs">
                                            <a
                                                href={editForm.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-blue-600 hover:text-blue-800 font-semibold hover:underline"
                                            >
                                                View media file
                                            </a>
                                            <span className="text-gray-300">|</span>
                                            <a
                                                href={route('media.download', selectedMedia.id)}
                                                download={selectedMedia.file_name || true}
                                                className="text-gray-700 hover:text-gray-900 font-semibold flex items-center gap-1.5 hover:underline cursor-pointer"
                                            >
                                                <Download size={14} />
                                                <span>Download file</span>
                                            </a>
                                            <span className="text-gray-300">|</span>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(selectedMedia.id)}
                                                className="text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1.5 hover:underline cursor-pointer"
                                            >
                                                <Trash2 size={14} />
                                                <span>Delete permanently</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="border-t border-gray-100 px-6 py-3.5 flex items-center justify-end gap-3 bg-white">
                                <button
                                    type="button"
                                    onClick={() => setSelectedMedia(null)}
                                    className="px-5 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 transition cursor-pointer"
                                >
                                    Close
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="px-5 py-2.5 bg-[#800020] hover:bg-[#960026] text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                                >
                                    <Save size={14} />
                                    <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                                </button>
                            </div>

                        </div>
                    </div>
                )}

                {/* Upload Modal (For Local Shared Hosting Storage) */}
                {isUploadModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
                        <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5 border border-gray-100">
                            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                                <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                                    <Upload size={16} className="text-rose-600" />
                                    <span>Upload Media to Local Storage</span>
                                </h3>
                                <button 
                                    onClick={() => !isUploading && setIsUploadModalOpen(false)} 
                                    disabled={isUploading}
                                    className="text-gray-400 hover:text-gray-700 cursor-pointer disabled:opacity-50"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="block text-xs font-bold text-gray-700">
                                            Select Images or Media Files
                                        </label>
                                        <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                                            Multiple Allowed
                                        </span>
                                    </div>
                                    <label 
                                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                        onDragLeave={() => setIsDragging(false)}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            setIsDragging(false);
                                            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                                                uploadFiles(Array.from(e.dataTransfer.files));
                                            }
                                        }}
                                        className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-2.5 text-center cursor-pointer transition-all ${
                                            isDragging 
                                                ? 'border-rose-500 bg-rose-50/50 ring-2 ring-rose-200 scale-[1.01]' 
                                                : 'border-gray-200 hover:border-rose-400 bg-gray-50/50 hover:bg-rose-50/20'
                                        } ${isUploading ? 'opacity-70 pointer-events-none' : ''}`}
                                    >
                                        <div className="flex items-center gap-2 text-rose-600">
                                            <ImageIcon size={24} />
                                            <Video size={22} />
                                            <Music size={22} />
                                        </div>
                                        <span className="text-xs font-bold text-gray-800">
                                            {isUploading 
                                                ? (uploadStatusText || 'Uploading to server...') 
                                                : isDragging 
                                                    ? 'Drop files here to upload' 
                                                    : 'Click to browse or Drag & Drop multiple files'}
                                        </span>
                                        <span className="text-[11px] text-gray-400">
                                            Supports JPG, PNG, WEBP, MP4, WebM, MP3, WAV, PDF
                                        </span>
                                        <span className="text-[10px] text-emerald-600 font-medium">
                                            ✓ You can select multiple images at once
                                        </span>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                                            disabled={isUploading}
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files.length > 0) {
                                                    uploadFiles(Array.from(e.target.files));
                                                }
                                            }}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Nested Interactive Image Cropper / Editor */}
                {isCropperOpen && (
                    <ImageCropperModal
                        isOpen={isCropperOpen}
                        onClose={() => setIsCropperOpen(false)}
                        imageSrc={editForm.url || selectedMedia?.url}
                        onCropComplete={handleCroppedComplete}
                        title="Crop & Edit Media Photo"
                    />
                )}
            </div>
        </AdminLayout>
    );
}
