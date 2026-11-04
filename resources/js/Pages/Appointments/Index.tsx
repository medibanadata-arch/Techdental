import React, { useState, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Calendar,
    Search,
    Phone,
    CheckCircle2,
    Clock,
    XCircle,
    Trash2,
    AlertCircle,
    MapPin,
    Filter
} from 'lucide-react';
import { PageProps } from '@inertiajs/core';

interface AppointmentItem {
    id: number;
    name: string;
    phone: string;
    service?: string;
    date: string;
    status: string;
    notes?: string;
    created_at?: string;
}

interface Props extends PageProps {
    appointments?: AppointmentItem[];
}

export default function AppointmentsIndex({ appointments = [] }: Props) {
    const [statusFilter, setStatusFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredAppointments = useMemo(() => {
        return appointments.filter(item => {
            const matchesStatus = statusFilter === 'All' || item.status.toLowerCase() === statusFilter.toLowerCase();
            const matchesSearch = !searchQuery || 
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.phone.includes(searchQuery) ||
                (item.service && item.service.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesStatus && matchesSearch;
        });
    }, [appointments, statusFilter, searchQuery]);

    const handleStatusChange = (id: number, newStatus: string) => {
        router.put(route('appointments.update', id), {
            status: newStatus,
        }, {
            preserveScroll: true,
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this appointment request?')) {
            router.delete(route('appointments.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'confirmed':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'completed':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'cancelled':
                return 'bg-rose-50 text-rose-700 border-rose-200';
            default:
                return 'bg-amber-50 text-amber-700 border-amber-200';
        }
    };

    return (
        <AdminLayout>
            <Head title="Appointments - Tech Dental" />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2.5">
                            <Calendar size={22} className="text-rose-600" />
                            Appointments
                        </h1>
                    </div>

                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-gray-200 text-xs text-gray-600 font-bold shadow-2xs">
                        <span>Total Requests:</span>
                        <span className="text-rose-600 font-mono text-sm">{appointments.length}</span>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white p-3.5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setStatusFilter(tab)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                                    statusFilter === tab
                                        ? 'bg-[#800038] text-white shadow-xs'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="relative flex-1 max-w-xs">
                        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, phone, or service..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-500 transition-all"
                        />
                    </div>
                </div>

                {/* Appointments Table */}
                <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-xs">
                    <table className="w-full text-left text-xs text-gray-600">
                        <thead className="bg-gray-50/80 text-gray-700 font-bold border-b border-gray-200 uppercase tracking-wider text-[11px]">
                            <tr>
                                <th className="p-4">Patient Info</th>
                                <th className="p-4">Contact Phone</th>
                                <th className="p-4">Service Requested</th>
                                <th className="p-4">Preferred Date</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredAppointments.map((apt) => (
                                <tr key={apt.id} className="hover:bg-gray-50/60 transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold text-gray-900 text-sm">{apt.name}</div>
                                        {apt.notes && (
                                            <div className="text-[11px] text-gray-400 mt-0.5">{apt.notes}</div>
                                        )}
                                    </td>
                                    <td className="p-4 font-mono font-medium">
                                        <a href={`tel:${apt.phone}`} className="inline-flex items-center gap-1 text-blue-600 hover:underline">
                                            <Phone size={12} />
                                            <span>{apt.phone}</span>
                                        </a>
                                    </td>
                                    <td className="p-4">
                                        <span className="font-semibold text-gray-800">{apt.service || 'Dental Checkup'}</span>
                                    </td>
                                    <td className="p-4 font-mono text-gray-600">
                                        <span className="bg-gray-100 px-2 py-0.5 rounded-md">{apt.date}</span>
                                    </td>
                                    <td className="p-4">
                                        <select
                                            value={apt.status}
                                            onChange={(e) => handleStatusChange(apt.id, e.target.value)}
                                            className={`text-[11px] font-bold border rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer ${getStatusBadge(apt.status)}`}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Confirmed">Confirmed</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => handleDelete(apt.id)}
                                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                            title="Delete request"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredAppointments.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-400">
                                        No appointments found matching the current filter.
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
