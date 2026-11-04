import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft, Save, Eye, ExternalLink } from 'lucide-react';
import MediaImagePicker from '@/components/ImagePicker/MediaImagePicker';
import { PageProps } from '@inertiajs/core';

interface ImageItem {
    id: number;
    title: string;
    src: string;
    branch: string;
    badge: string;
    alt: string;
    sort_order: number;
    view_count: number;
    real_views?: number;
}

interface Props extends PageProps {
    image: ImageItem;
}

export default function FeaturedImagesEdit({ image }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        title: image.title || '',
        src: image.src || '',
        branch: image.branch || image.badge || 'Mirpur',
        badge: image.branch || image.badge || 'Mirpur',
        alt: image.alt || '',
        type: 'half-size',
        sort_order: image.sort_order || 1,
        view_count: image.view_count || 500,
        is_active: 1,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('featured-images.update', image.id));
    };

    return (
        <AdminLayout>
            <Head title={`Edit Image #${image.id} - Tech Dental`} />

            <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('featured-images.index')}
                            className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                        >
                            <ArrowLeft size={16} />
                        </Link>
                        <h1 className="text-xl font-bold text-gray-900">Edit Featured Image</h1>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs">
                    <form onSubmit={submit} className="space-y-4">
                        <MediaImagePicker
                            label="Featured Image *"
                            value={data.src}
                            onChange={(val) => setData('src', val)}
                            aspectRatio="16:9"
                            helperText="Recommended 16:9 or 4:3 for branch / clinic showcase"
                        />
                        {errors.src && <span className="text-red-500 text-xs">{errors.src}</span>}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-rose-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Branch Badge</label>
                                <select
                                    value={data.branch}
                                    onChange={(e) => {
                                        setData('branch', e.target.value);
                                        setData('badge', e.target.value);
                                    }}
                                    className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-rose-500 focus:outline-none bg-white"
                                >
                                    <option value="Mirpur">Mirpur</option>
                                    <option value="Uttara">Uttara</option>
                                    <option value="Badda">Badda</option>
                                    <option value="Jatrabari">Jatrabari</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Alt Text</label>
                                <input
                                    type="text"
                                    value={data.alt}
                                    onChange={(e) => setData('alt', e.target.value)}
                                    className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-rose-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Display Serial / Sort Order</label>
                                <input
                                    type="number"
                                    value={data.sort_order}
                                    onChange={(e) => setData('sort_order', parseInt(e.target.value) || 1)}
                                    className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-rose-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* View Counters Section: Real Visitor Views & Manual Frontend Display View */}
                        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4.5 space-y-4">
                            <h3 className="text-xs font-bold text-gray-900 flex items-center gap-2">
                                <Eye size={15} className="text-rose-600" />
                                <span>Image View Counters</span>
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* 1. Real Visitor View (Read-Only) */}
                                <div className="bg-white border border-emerald-200/90 rounded-xl p-3.5 flex flex-col justify-between shadow-2xs">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-xs font-bold text-gray-800">Real Visitor Views</span>
                                        </div>
                                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                                            Real-time Tracked
                                        </span>
                                    </div>
                                    <div className="mt-2.5 flex items-baseline gap-2">
                                        <span className="text-2xl font-black text-emerald-700 font-mono">
                                            {(image.real_views || 0).toLocaleString()}
                                        </span>
                                        <span className="text-xs text-gray-500 font-medium">real views</span>
                                    </div>
                                </div>

                                {/* 2. Manual Frontend Display View (Editable) */}
                                <div className="bg-white border border-amber-200/90 rounded-xl p-3.5 flex flex-col justify-between shadow-2xs">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Eye size={13} className="text-amber-600" />
                                            <label htmlFor="view_count_input" className="text-xs font-bold text-gray-800">
                                                Frontend Display View
                                            </label>
                                        </div>
                                        <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                                            Editable
                                        </span>
                                    </div>
                                    <div className="mt-2">
                                        <input
                                            id="view_count_input"
                                            type="number"
                                            value={data.view_count}
                                            onChange={(e) => setData('view_count', parseInt(e.target.value) || 0)}
                                            placeholder="e.g. 1240"
                                            className="w-full text-sm font-bold text-gray-900 border border-gray-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-amber-500 focus:outline-none font-mono"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {data.src && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                                <span className="text-[11px] font-bold text-gray-500 block mb-2">Current Image:</span>
                                <img src={data.src} alt="Preview" className="h-40 rounded-lg object-cover" />
                            </div>
                        )}

                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 bg-[#800038] hover:bg-[#990044] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all"
                            >
                                <Save size={15} />
                                <span>Update Featured Image</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
