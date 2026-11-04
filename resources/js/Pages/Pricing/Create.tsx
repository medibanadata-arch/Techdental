import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft, Save } from 'lucide-react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        category: '',
        title: '',
        desc: '',
        price: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('pricing.store'));
    };

    return (
        <AdminLayout>
            <Head title="Add Service" />

            <div className="mb-6">
                <Link href={route('pricing.index')} className="text-rose-600 hover:text-rose-700 flex items-center gap-2 mb-2 text-sm font-medium">
                    <ArrowLeft size={16} /> Back to Pricing
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Add New Service</h1>
                <p className="text-gray-500 text-sm mt-1">Create a new service with pricing.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <form onSubmit={handleSubmit} className="p-6 space-y-6 max-w-3xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Service Title
                            </label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={e => setData('title', e.target.value)}
                                className={`w-full border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors`}
                                placeholder="e.g. Root Canal Treatment"
                            />
                            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category
                            </label>
                            <input
                                type="text"
                                value={data.category}
                                onChange={e => setData('category', e.target.value)}
                                className={`w-full border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors`}
                                placeholder="e.g. General Dentistry"
                            />
                            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Price (BDT)
                            </label>
                            <input
                                type="number"
                                value={data.price}
                                onChange={e => setData('price', e.target.value)}
                                className={`w-full border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors`}
                                placeholder="e.g. 1500"
                            />
                            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                value={data.desc}
                                onChange={e => setData('desc', e.target.value)}
                                rows={3}
                                className={`w-full border ${errors.desc ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors`}
                                placeholder="Brief description of the service..."
                            />
                            {errors.desc && <p className="text-red-500 text-xs mt-1">{errors.desc}</p>}
                        </div>
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                        <Link
                            href={route('pricing.index')}
                            className="px-5 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-5 py-2 text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-70 rounded-lg font-medium transition-colors shadow-sm"
                        >
                            <Save size={18} />
                            {processing ? 'Saving...' : 'Save Service'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
