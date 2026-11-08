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
                                <div className="absolute top-2.5 right-2.5 bg-white/90 text-gray-800 text-[11px] font-mono font-bold px-2 py-0.5 rounded-md shadow-xs">
                                    #{img.sort_order || idx + 1}
                                </div>
                            </div>

                            <div className="p-4 flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="font-bold text-gray-900 text-sm truncate">{img.title || 'Featured Photo'}</h3>
                                    <p className="text-[11px] text-gray-400 font-mono mt-0.5 truncate">{img.src}</p>
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
