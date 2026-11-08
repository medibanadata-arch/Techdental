import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft, Save, MapPin, Home, Layers } from 'lucide-react';
import MediaImagePicker from '@/components/ImagePicker/MediaImagePicker';
import { PageProps } from '@inertiajs/core';

interface LocationItem {
    id: number;
    name: string;
    short_name?: string;
    slug?: string;
}

interface Props extends PageProps {
    locations?: LocationItem[];
    defaultBranch?: string;
}

export default function FeaturedImagesCreate({ locations = [], defaultBranch = 'homepage' }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        src: '',
        branch: defaultBranch || 'homepage',
        badge: defaultBranch === 'homepage' ? 'Homepage' : 'Branch',
        alt: '',
        type: 'half-size',
        sort_order: 1,
        view_count: 500,
        is_active: 1,
    });

    const handleBranchChange = (newBranch: string) => {
        setData((prev) => ({
            ...prev,
            branch: newBranch,
            badge: newBranch === 'homepage' ? 'Homepage' : (newBranch === 'all' ? 'All' : `${newBranch.replace('branch', '').trim()} Branch`),
        }));
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('featured-images.store'));
    };

    return (
        <AdminLayout>
            <Head title="Add Slider Image - Tech Dental" />

            <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('featured-images.index', data.branch ? { branch: data.branch } : {})}
                            className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                        >
                            <ArrowLeft size={16} />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Add Slider Image</h1>
                            <p className="text-xs text-gray-500">Assign this image to Homepage or a specific Branch</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs">
                    <form onSubmit={submit} className="space-y-4">
                        {/* Target Placement / Branch Selector */}
                        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                            <label className="block text-xs font-bold text-gray-800 mb-1.5 flex items-center gap-1.5">
                                <MapPin size={14} className="text-[#800038]" />
                                <span>Where will this slider appear? *</span>
                            </label>
                            <select
                                value={data.branch}
                                onChange={(e) => handleBranchChange(e.target.value)}
                                className="w-full text-xs font-semibold bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 focus:ring-1 focus:ring-[#800038] focus:border-[#800038] focus:outline-none"
                            >
                                <option value="homepage">🏠 Homepage Main Slider (Hero Banner)</option>
                                <option value="mirpur">📍 Mirpur Branch Slider</option>
                                <option value="uttara">📍 Uttara Branch Slider</option>
                                <option value="badda">📍 Badda Branch Slider</option>
                                <option value="jatrabari">📍 Jatrabari Branch Slider</option>
                                <option value="all">🌐 All Pages (Shared across Homepage &amp; Branches)</option>
                            </select>
                            {errors.branch && <span className="text-red-500 text-xs mt-1 block">{errors.branch}</span>}
                            <p className="text-[11px] text-gray-500 mt-1.5">
                                Images uploaded for Homepage will only appear on the main website. Branch sliders will only appear on that branch's page.
                            </p>
                        </div>

                        {/* Image picker */}
                        <MediaImagePicker
                            label="Slider Image *"
                            value={data.src}
                            onChange={(val) => setData('src', val)}
                            aspectRatio="16:9"
                            helperText="Recommended 16:9 ratio for responsive desktop & mobile display"
                        />
                        {errors.src && <span className="text-red-500 text-xs">{errors.src}</span>}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Title (optional)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Modern Operatory Room"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
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

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Alt Text</label>
                            <input
                                type="text"
                                placeholder="e.g. Modern dental clinic chair"
                                value={data.alt}
                                onChange={(e) => setData('alt', e.target.value)}
                                className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-rose-500 focus:outline-none"
                            />
                        </div>

                        {data.src && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                                <span className="text-[11px] font-bold text-gray-500 block mb-2">Live Preview:</span>
                                <img src={data.src} alt="Preview" className="h-40 rounded-lg object-cover" />
                            </div>
                        )}

                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 bg-[#800038] hover:bg-[#990044] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50"
                            >
                                <Save size={15} />
                                <span>{processing ? 'Saving...' : 'Save Slider Image'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
