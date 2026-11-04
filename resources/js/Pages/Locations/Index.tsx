import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus, Edit, Trash2, Search, MapPin } from 'lucide-react';
import { PageProps } from '@inertiajs/core';

interface Location {
    id: number;
    location_id: string;
    name: string;
    address: string;
    phone: string;
    map_url: string;
    review_url: string;
    whatsapp?: string;
    booking_url?: string;
    call_label?: string;
    directions_label?: string;
    whatsapp_label?: string;
    book_label?: string;
}

interface Props extends PageProps {
    data: Location[];
}

export default function Index({ data = [] }: Props) {
    const [search, setSearch] = React.useState('');

    const filtered = React.useMemo(() => {
        if (!search.trim()) return data;
        const q = search.toLowerCase();
        return data.filter((loc) =>
            loc.name?.toLowerCase().includes(q) ||
            loc.address?.toLowerCase().includes(q) ||
            loc.location_id?.toLowerCase().includes(q) ||
            loc.phone?.toLowerCase().includes(q)
        );
    }, [data, search]);

    return (
        <AdminLayout>
            <Head title="Locations & Branches" />

            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Locations & Branches</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage clinic branches, addresses, and map links.</p>
                </div>
                
                <Link
                    href={route('locations.create')}
                    className="inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
                >
                    <Plus size={18} />
                    <span>Add Location</span>
                </Link>
            </div>

            <div className="bg-white p-4 rounded-t-xl border-b border-gray-100 flex flex-col sm:flex-row justify-between gap-4 shadow-sm">
                <div className="relative max-w-md w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search locations..."
                        className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-rose-500 focus:border-rose-500 sm:text-sm transition-colors"
                    />
                </div>
            </div>

            <div className="bg-white rounded-b-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Branch Name
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Address & Contact
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Quick Action Buttons (4 Buttons)
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Links
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {filtered.map((location) => (
                                <tr key={location.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-bold text-gray-900">{location.name}</div>
                                        <div className="text-xs text-gray-500 mt-1">ID: {location.location_id}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900 line-clamp-2">{location.address}</div>
                                        <div className="text-xs text-gray-500 mt-1 font-medium">{location.phone}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-1.5 text-[11px]">
                                            <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold border border-blue-200">
                                                {location.call_label || 'Call'}
                                            </span>
                                            <span className="bg-sky-50 text-sky-700 px-2 py-0.5 rounded-full font-bold border border-sky-200">
                                                {location.directions_label || 'Directions'}
                                            </span>
                                            <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                                                {location.whatsapp_label || 'WhatsApp'}
                                            </span>
                                            <span className="bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full font-bold border border-rose-200">
                                                {location.book_label || 'Book'}
                                            </span>
                                        </div>
                                        <div className="mt-1 text-[11px] text-gray-400">
                                            WA: {location.whatsapp || location.phone || 'Default'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <div className="flex flex-col gap-2">
                                            <a href={location.map_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-xs flex items-center gap-1">
                                                <MapPin size={12} /> Google Maps
                                            </a>
                                            <a href={location.review_url} target="_blank" rel="noreferrer" className="text-orange-600 hover:underline text-xs flex items-center gap-1">
                                                ★ Google Reviews
                                            </a>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={route('locations.edit', location.id)}
                                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                            >
                                                <Edit size={16} />
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    if(confirm('Are you sure you want to delete this location?')) {
                                                        router.delete(route('locations.destroy', location.id))
                                                    }
                                                }}
                                                className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-500">
                                            <div className="bg-gray-100 p-3 rounded-full mb-3">
                                                <MapPin className="w-8 h-8 text-gray-400" />
                                            </div>
                                            <p className="text-base font-medium text-gray-900 mb-1">No locations found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
