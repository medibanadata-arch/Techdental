import React, { useState } from 'react';
import {
    Image as ImageIcon,
    UploadCloud,
    Crop as CropIcon,
    Trash2,
    ExternalLink,
    FolderOpen
} from 'lucide-react';
import MediaLibraryModal from './MediaLibraryModal';
import ImageCropperModal, { AspectRatioPreset } from './ImageCropperModal';

interface Props {
    label?: string;
    value?: string;
    onChange: (url: string) => void;
    aspectRatio?: AspectRatioPreset;
    aspectHint?: string;
    placeholder?: string;
    previewHeightClass?: string;
    className?: string;
    required?: boolean;
}

export default function MediaImagePicker({
    label,
    value = '',
    onChange,
    aspectRatio = '16:9',
    aspectHint,
    placeholder = 'https://... or choose from media',
    previewHeightClass = 'h-32',
    className = '',
    required = false,
}: Props) {
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);
    const [isCropperOpen, setIsCropperOpen] = useState(false);
    const [fileForCrop, setFileForCrop] = useState<File | null>(null);

    const handleFileChosenForCrop = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFileForCrop(e.target.files[0]);
            setIsCropperOpen(true);
        }
    };

    const handleReCropExisting = () => {
        if (value) {
            setFileForCrop(null);
            setIsCropperOpen(true);
        }
    };

    const [imgError, setImgError] = useState(false);

    React.useEffect(() => {
        setImgError(false);
    }, [value]);

    return (
        <div className={`space-y-2 font-sans ${className}`}>
            {label && (
                <div className="flex items-center justify-between gap-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider truncate">
                        {label} {required && <span className="text-red-500">*</span>}
                    </label>
                    {aspectHint && (
                        <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-100 uppercase tracking-wider shrink-0">
                            {aspectHint}
                        </span>
                    )}
                </div>
            )}

            {/* Input & Action Buttons - Stacked to guarantee zero horizontal overflow in any grid */}
            <div className="space-y-1.5">
                {/* Row 1: URL Input with Clear Button */}
                <div className="relative flex items-center min-w-0">
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        required={required}
                        className="w-full pl-3 pr-8 py-2 text-xs border border-gray-300 rounded-xl outline-none focus:ring-1 focus:ring-[#8f163b] bg-white transition text-gray-700 min-w-0 font-mono text-[11px]"
                    />
                    {value && (
                        <button
                            type="button"
                            onClick={() => onChange('')}
                            className="absolute right-1.5 p-1 text-gray-400 hover:text-red-600 rounded-lg transition cursor-pointer"
                            title="Remove image URL"
                        >
                            <Trash2 size={13} />
                        </button>
                    )}
                </div>

                {/* Row 2: 2 Action Buttons Side-by-Side (50% each) */}
                <div className="grid grid-cols-2 gap-1.5">
                    <button
                        type="button"
                        onClick={() => setIsLibraryOpen(true)}
                        className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition cursor-pointer shadow-2xs min-w-0"
                        title="Choose from Media Library"
                    >
                        <FolderOpen size={13} className="text-[#8f163b] shrink-0" />
                        <span className="truncate">Media Library</span>
                    </button>

                    <label className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-white bg-[#8f163b] hover:bg-[#73102f] rounded-xl shadow-2xs transition cursor-pointer min-w-0">
                        <CropIcon size={13} className="shrink-0" />
                        <span className="truncate">Upload &amp; Crop</span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChosenForCrop}
                            className="hidden"
                        />
                    </label>
                </div>
            </div>

            {/* Image Preview Box */}
            <div className={`w-full ${previewHeightClass} rounded-xl overflow-hidden bg-gray-100 border border-gray-200 relative group flex items-center justify-center`}>
                {value && !imgError ? (
                    <>
                        <img
                            src={value}
                            alt="Preview"
                            className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                            onError={() => setImgError(true)}
                        />

                        {/* Hover Overlay with Quick Crop, Library Change & Clear */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1.5 p-2">
                            <button
                                type="button"
                                onClick={handleReCropExisting}
                                className="px-2.5 py-1.5 bg-white/95 hover:bg-white text-gray-800 rounded-lg text-xs font-bold shadow flex items-center gap-1 transition cursor-pointer"
                                title="Re-crop image"
                            >
                                <CropIcon size={12} />
                                <span>Re-crop</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsLibraryOpen(true)}
                                className="px-2.5 py-1.5 bg-white/95 hover:bg-white text-gray-800 rounded-lg text-xs font-bold shadow flex items-center gap-1 transition cursor-pointer"
                                title="Change from Media Library"
                            >
                                <FolderOpen size={12} className="text-[#8f163b]" />
                                <span>Change</span>
                            </button>
                            <a
                                href={value}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 bg-white/95 hover:bg-white text-gray-800 rounded-lg text-xs shadow transition"
                                title="Open in new tab"
                            >
                                <ExternalLink size={13} />
                            </a>
                        </div>
                    </>
                ) : imgError ? (
                    <div
                        onClick={() => setIsLibraryOpen(true)}
                        className="text-center p-3 text-rose-500 text-xs flex flex-col items-center justify-center cursor-pointer hover:bg-rose-50/50 transition w-full h-full"
                    >
                        <ImageIcon size={22} className="mb-1 text-rose-400" />
                        <span className="font-semibold text-[11px]">Image link invalid or failed to load</span>
                        <span className="text-[10px] text-gray-400">Click to choose a replacement</span>
                    </div>
                ) : (
                    <div
                        onClick={() => setIsLibraryOpen(true)}
                        className="text-center p-4 text-gray-400 text-xs flex flex-col items-center justify-center cursor-pointer hover:text-gray-600 hover:bg-gray-50 transition w-full h-full"
                    >
                        <ImageIcon size={24} className="mb-1 opacity-50 text-gray-400" />
                        <span className="font-semibold text-[11px]">No image selected</span>
                        <span className="text-[10px] text-gray-400">Click to choose from library or upload &amp; crop</span>
                    </div>
                )}
            </div>

            {/* Media Library Modal */}
            {isLibraryOpen && (
                <MediaLibraryModal
                    isOpen={isLibraryOpen}
                    onClose={() => setIsLibraryOpen(false)}
                    onSelectImage={(newUrl) => onChange(newUrl)}
                    defaultAspect={aspectRatio}
                    title={label ? `Select: ${label}` : 'Choose from Media Library'}
                />
            )}

            {/* Cropper Modal for Direct Upload / Re-crop */}
            {isCropperOpen && (
                <ImageCropperModal
                    isOpen={isCropperOpen}
                    onClose={() => {
                        setIsCropperOpen(false);
                        setFileForCrop(null);
                    }}
                    imageFile={fileForCrop}
                    imageSrc={!fileForCrop ? value : undefined}
                    defaultAspect={aspectRatio}
                    onCropComplete={(newUrl) => {
                        onChange(newUrl);
                        setIsCropperOpen(false);
                        setFileForCrop(null);
                    }}
                    title={label ? `Crop: ${label}` : 'Crop Image'}
                />
            )}
        </div>
    );
}
