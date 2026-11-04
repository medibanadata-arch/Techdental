import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft, Save } from 'lucide-react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        location_id: '',
        name: '',
        address: '',
        phone: '',
        map_url: '',
        review_url: '',
        whatsapp: '',
        booking_url: '/appointment',
        call_label: 'Call',
        directions_label: 'Directions',
        whatsapp_label: 'WhatsApp',
        book_label: 'Book',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('locations.store'));
    };

    return (
        <AdminLayout>
            <Head title="Add Location" />

            <div className="mb-6">
                <Link href={route('locations.index')} className="text-rose-600 hover:text-rose-700 flex items-center gap-2 mb-2 text-sm font-medium">
                    <ArrowLeft size={16} /> Back to Locations
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Add New Location</h1>
                <p className="text-gray-500 text-sm mt-1">Create a new clinic branch.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <form onSubmit={handleSubmit} className="p-6 space-y-6 max-w-3xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Location ID */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Location ID (Unique string)
                            </label>
                            <input
                                type="text"
                                value={data.location_id}
                                onChange={e => setData('location_id', e.target.value)}
                                className={`w-full border ${errors.location_id ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors`}
                                placeholder="e.g. mirpur, uttara"
                            />
                            {errors.location_id && <p className="text-red-500 text-xs mt-1">{errors.location_id}</p>}
                        </div>

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Branch Name
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors`}
                                placeholder="e.g. Mirpur Branch"
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number
                            </label>
                            <input
                                type="text"
                                value={data.phone}
                                onChange={e => setData('phone', e.target.value)}
                                className={`w-full border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors`}
                                placeholder="e.g. +880123456789"
                            />
                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                        </div>

                        {/* Address */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Address
                            </label>
                            <input
                                type="text"
                                value={data.address}
                                onChange={e => setData('address', e.target.value)}
                                className={`w-full border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors`}
                                placeholder="e.g. 123 Main St, Dhaka"
                            />
                            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                        </div>

                        {/* Map URL */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Google Map URL <span className="text-gray-400 font-normal text-xs">(Optional)</span>
                            </label>
                            <input
                                type="url"
                                value={data.map_url}
                                onChange={e => setData('map_url', e.target.value)}
                                className={`w-full border ${errors.map_url ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors`}
                                placeholder="https://maps.google.com/..."
                            />
                            {errors.map_url && <p className="text-red-500 text-xs mt-1">{errors.map_url}</p>}
                        </div>

                        {/* Review URL */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Google Reviews URL <span className="text-gray-400 font-normal text-xs">(Optional)</span>
                            </label>
                            <input
                                type="url"
                                value={data.review_url}
                                onChange={e => setData('review_url', e.target.value)}
                                className={`w-full border ${errors.review_url ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors`}
                                placeholder="https://g.page/review/..."
                            />
                            {errors.review_url && <p className="text-red-500 text-xs mt-1">{errors.review_url}</p>}
                        </div>

                        {/* Quick Action Buttons (Call, Directions, WhatsApp, Book) */}
                        <div className="md:col-span-2 bg-gradient-to-br from-rose-50/40 via-white to-slate-50 border border-rose-200/80 rounded-2xl p-5 shadow-xs">
                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-rose-100 flex-wrap gap-2">
                                <div>
                                    <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                                        <span>📱 Quick Action Buttons (Homepage &amp; Branch Page)</span>
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Customize the 4 circular action buttons displayed below the image slider for this branch.
                                    </p>
                                </div>
                                <div className="flex items-center gap-1.5 bg-white border border-rose-200/80 px-2.5 py-1 rounded-full shadow-2xs">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                    <span className="text-[11px] font-bold text-slate-700">4 Active Buttons</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* 1. Call Button */}
                                <div className="bg-white p-4 rounded-xl border border-slate-200/80 space-y-2.5">
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                                        <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-mono">1</span>
                                        <span>Call Button</span>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">Button Label</label>
                                        <input
                                            type="text"
                                            value={data.call_label}
                                            onChange={e => setData('call_label', e.target.value)}
                                            placeholder="Call"
                                            className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-rose-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">Phone Number (tel:)</label>
                                        <input
                                            type="text"
                                            value={data.phone}
                                            onChange={e => setData('phone', e.target.value)}
                                            placeholder="01400786162"
                                            className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-rose-500 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                {/* 2. Directions Button */}
                                <div className="bg-white p-4 rounded-xl border border-slate-200/80 space-y-2.5">
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                                        <span className="w-6 h-6 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center font-mono">2</span>
                                        <span>Directions Button</span>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">Button Label</label>
                                        <input
                                            type="text"
                                            value={data.directions_label}
                                            onChange={e => setData('directions_label', e.target.value)}
                                            placeholder="Directions"
                                            className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-rose-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">Google Maps Link</label>
                                        <input
                                            type="text"
                                            value={data.map_url}
                                            onChange={e => setData('map_url', e.target.value)}
                                            placeholder="https://maps.google.com/..."
                                            className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-rose-500 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                {/* 3. WhatsApp Button */}
                                <div className="bg-white p-4 rounded-xl border border-slate-200/80 space-y-2.5">
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                                        <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-mono">3</span>
                                        <span>WhatsApp Button</span>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">Button Label</label>
                                        <input
                                            type="text"
                                            value={data.whatsapp_label}
                                            onChange={e => setData('whatsapp_label', e.target.value)}
                                            placeholder="WhatsApp"
                                            className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-rose-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">WhatsApp Number</label>
                                        <input
                                            type="text"
                                            value={data.whatsapp}
                                            onChange={e => setData('whatsapp', e.target.value)}
                                            placeholder="01400786162 or +8801400786162"
                                            className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-rose-500 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                {/* 4. Book Button */}
                                <div className="bg-white p-4 rounded-xl border border-slate-200/80 space-y-2.5">
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                                        <span className="w-6 h-6 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center font-mono">4</span>
                                        <span>Book / Appointment Button</span>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">Button Label</label>
                                        <input
                                            type="text"
                                            value={data.book_label}
                                            onChange={e => setData('book_label', e.target.value)}
                                            placeholder="Book"
                                            className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-rose-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">Appointment URL</label>
                                        <input
                                            type="text"
                                            value={data.booking_url}
                                            onChange={e => setData('booking_url', e.target.value)}
                                            placeholder="/appointment"
                                            className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-rose-500 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                        <Link
                            href={route('locations.index')}
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
                            {processing ? 'Saving...' : 'Save Location'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
