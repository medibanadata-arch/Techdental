import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft, Save, Info, Eye } from 'lucide-react';
import MediaImagePicker from '@/components/ImagePicker/MediaImagePicker';

export default function FeaturedImagesCreate() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        src: '',
        branch: 'Mirpur',
        badge: 'Mirpur',
        alt: '',
        type: 'half-size',
        sort_order: 1,
        view_count: 500,
        is_active: 1,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('featured-images.store'));
    };

    return (
        <AdminLayout>
            <Head title="Add Featured Image - Tech Dental" />

            <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('featured-images.index')}
                            className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                        >
                            <ArrowLeft size={16} />
                        </Link>
                        <h1 className="text-xl font-bold text-gray-900">Add Featured Image</h1>
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
                                className="inline-flex items-center gap-2 bg-[#800038] hover:bg-[#990044] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all"
                            >
                                <Save size={15} />
                                <span>Save Featured Image</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
