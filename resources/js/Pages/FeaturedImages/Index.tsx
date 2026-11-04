import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus, Edit2, Trash2, Eye, Image as ImageIcon, MapPin } from 'lucide-react';
import { PageProps } from '@inertiajs/core';

interface FeaturedImageItem {
    id: number;
    title: string;
    src: string;
    badge?: string;
    branch?: string;
    alt?: string;
    sort_order?: number;
    view_count?: number;
    real_views?: number;
    is_active?: boolean;
}

interface Props extends PageProps {
    images: FeaturedImageItem[];
}

export default function FeaturedImagesIndex({ images }: Props) {
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to remove this featured image?')) {
            router.delete(route('featured-images.destroy', id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Featured Images - Tech Dental" />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2.5">
                            <ImageIcon size={22} className="text-rose-600" />
                            Featured Images
                        </h1>
                    </div>

                    <Link
                        href={route('featured-images.create')}
                        className="inline-flex items-center gap-2 bg-[#800038] hover:bg-[#990044] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all"
                    >
                        <Plus size={16} />
                        <span>Add Featured Image</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((img, idx) => (
                        <div key={img.id} className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                            <div className="relative aspect-video bg-gray-100 overflow-hidden">
                                <img
                                    src={img.src}
                                    alt={img.alt || img.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                    <MapPin size={11} className="text-rose-400" />
                                    <span>{img.branch || img.badge || 'Mirpur'}</span>
                                </div>
                                <div className="absolute top-2.5 right-2.5 bg-white/90 text-gray-800 text-[11px] font-mono font-bold px-2 py-0.5 rounded-md shadow-xs">
                                    #{img.sort_order || idx + 1}
                                </div>
                                <div className="absolute bottom-2.5 right-2.5 bg-black/75 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs" title="Frontend Public View">
                                    <Eye size={11} className="text-amber-300" />
                                    <span>{(img.view_count || 1000).toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="p-4 flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="font-bold text-gray-900 text-sm truncate">{img.title || 'Branch Photo'}</h3>
                                    <p className="text-[11px] text-gray-400 font-mono mt-0.5 truncate">{img.src}</p>
                                    
                                    {/* View Metrics: Frontend Manual View & Actual Real Visitor View */}
                                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                                        <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-2">
                                            <span className="text-[10px] font-semibold text-amber-800 flex items-center gap-1">
                                                <Eye size={10} className="text-amber-600" /> Frontend
                                            </span>
                                            <strong className="text-xs font-black text-amber-900 block mt-0.5">
                                                {(img.view_count || 1000).toLocaleString()}
                                            </strong>
                                        </div>
                                        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-2">
                                            <span className="text-[10px] font-semibold text-emerald-800 flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Real
                                            </span>
                                            <strong className="text-xs font-black text-emerald-900 block mt-0.5">
                                                {(img.real_views || 0).toLocaleString()}
                                            </strong>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between">
                                    <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Active</span>
                                    <div className="flex items-center gap-1">
                                        <Link
                                            href={route('featured-images.edit', img.id)}
                                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                            title="Edit"
                                        >
                                            <Edit2 size={14} />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(img.id)}
                                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                            title="Delete"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
