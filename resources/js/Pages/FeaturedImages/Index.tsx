import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus, Edit2, Trash2, Image as ImageIcon, MapPin, Home, Layers } from 'lucide-react';
import { PageProps } from '@inertiajs/core';

interface LocationItem {
    id: number;
    name: string;
    short_name?: string;
    slug?: string;
}

interface FeaturedImageItem {
    id: number;
    title: string;
    src: string;
    badge?: string;
    branch?: string;
    alt?: string;
    sort_order?: number;
    is_active?: boolean;
}

interface Props extends PageProps {
    images: FeaturedImageItem[];
    locations?: LocationItem[];
    selectedBranch?: string;
}

export default function FeaturedImagesIndex({ images = [], locations = [], selectedBranch = 'all' }: Props) {
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to remove this slider image?')) {
            router.delete(route('featured-images.destroy', id));
        }
    };

    const handleTabChange = (branchKey: string) => {
        router.get(route('featured-images.index'), { branch: branchKey }, { preserveState: true });
    };

    const getLocationBadge = (branch?: string) => {
        const b = (branch || '').toLowerCase();
        if (b === 'homepage' || !b) {
            return (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                    <Home size={10} />
                    <span>Homepage Slider</span>
                </span>
            );
        }
        if (b === 'all') {
            return (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                    <Layers size={10} />
                    <span>All Pages (Shared)</span>
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                <MapPin size={10} />
                <span className="capitalize">{b.replace('branch', '').trim()} Branch</span>
            </span>
        );
    };

    // Filter tabs definition
    const filterTabs = [
        { key: 'all', label: 'All Sliders' },
        { key: 'homepage', label: '🏠 Homepage Slider' },
        { key: 'mirpur', label: '📍 Mirpur Branch' },
        { key: 'uttara', label: '📍 Uttara Branch' },
        { key: 'badda', label: '📍 Badda Branch' },
        { key: 'jatrabari', label: '📍 Jatrabari Branch' },
    ];

    return (
        <AdminLayout>
            <Head title="Featured Sliders Management - Tech Dental" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2.5">
                            <ImageIcon size={22} className="text-[#800038]" />
                            <span>Featured Sliders &amp; Showcase</span>
                        </h1>
                        <p className="text-xs text-gray-500 mt-1">
                            Separately upload and manage sliders for Homepage and each clinic branch.
                        </p>
                    </div>

                    <Link
                        href={route('featured-images.create', selectedBranch !== 'all' ? { branch: selectedBranch } : {})}
                        className="inline-flex items-center gap-2 bg-[#800038] hover:bg-[#990044] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all"
                    >
                        <Plus size={16} />
                        <span>Add Slider Image</span>
                    </Link>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-3">
                    {filterTabs.map((tab) => {
                        const isActive = selectedBranch === tab.key;
                        return (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => handleTabChange(tab.key)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                    isActive
                                        ? 'bg-[#800038] text-white shadow-xs'
                                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Grid */}
                {images.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
                        <ImageIcon size={40} className="mx-auto text-gray-300 mb-3" />
                        <h3 className="text-sm font-bold text-gray-700">No slider images found for this category</h3>
                        <p className="text-xs text-gray-500 mt-1 mb-4">
                            Upload photos specifically for this slider location.
                        </p>
                        <Link
                            href={route('featured-images.create', selectedBranch !== 'all' ? { branch: selectedBranch } : {})}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#800038] text-white text-xs font-bold hover:bg-[#990044] transition"
                        >
                            <Plus size={14} />
                            <span>Add Slider Image</span>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {images.map((img, idx) => (
                            <div
                                key={img.id}
                                className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                            >
                                <div className="relative aspect-video bg-gray-100 overflow-hidden">
                                    <img
                                        src={img.src}
                                        alt={img.alt || img.title || 'Slider image'}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-xs text-white text-[11px] font-mono font-bold px-2 py-0.5 rounded-md shadow-xs">
                                        #{img.sort_order || idx + 1}
                                    </div>
                                    <div className="absolute top-2.5 left-2.5">
                                        {getLocationBadge(img.branch)}
                                    </div>
                                </div>

                                <div className="p-4 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-sm truncate">
                                            {img.title || 'Slider Image'}
                                        </h3>
                                        <p className="text-[11px] text-gray-400 font-mono mt-0.5 truncate">{img.src}</p>
                                    </div>

                                    <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between">
                                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                                            img.is_active !== false ? 'text-emerald-700 bg-emerald-50' : 'text-gray-500 bg-gray-100'
                                        }`}>
                                            {img.is_active !== false ? 'Active' : 'Inactive'}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <Link
                                                href={route('featured-images.edit', img.id)}
                                                className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                title="Edit slider"
                                            >
                                                <Edit2 size={14} />
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(img.id)}
                                                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                                                title="Delete permanently"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
