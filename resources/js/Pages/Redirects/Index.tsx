import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    CornerDownRight,
    Plus,
    Trash2,
    Edit2,
    Search,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    ToggleLeft,
    ToggleRight,
    ExternalLink,
    Filter,
    HelpCircle
} from 'lucide-react';
import { PageProps } from '@inertiajs/core';

interface RedirectItem {
    id: number;
    source_url: string;
    target_url: string;
    status_code: number;
    is_active: boolean;
    hits: number;
    created_at: string;
}

interface Props extends PageProps {
    redirects: {
        data: RedirectItem[];
        links: any[];
        total: number;
    };
    filters: {
        search?: string;
    };
}

export default function RedirectsIndex({ redirects, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<RedirectItem | null>(null);

    const [form, setForm] = useState({
        source_url: '',
        target_url: '',
        status_code: 301,
        is_active: true,
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('redirects.index'), { search }, { preserveState: true });
    };

    const openCreateModal = () => {
        setEditingItem(null);
        setForm({
            source_url: '',
            target_url: '',
            status_code: 301,
            is_active: true,
        });
        setIsModalOpen(true);
    };

    const openEditModal = (item: RedirectItem) => {
        setEditingItem(item);
        setForm({
            source_url: item.source_url,
            target_url: item.target_url,
            status_code: item.status_code || 301,
            is_active: item.is_active,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingItem) {
            router.put(route('redirects.update', editingItem.id), form, {
                onSuccess: () => setIsModalOpen(false),
            });
        } else {
            router.post(route('redirects.store'), form, {
                onSuccess: () => setIsModalOpen(false),
            });
        }
    };

    const handleDelete = (id: number, source: string) => {
        if (confirm(`Are you sure you want to delete redirect rule for "${source}"?`)) {
            router.delete(route('redirects.destroy', id));
        }
    };

    const handleToggle = (id: number) => {
        router.post(route('redirects.toggle', id));
    };

    return (
        <AdminLayout>
            <Head title="301 / 302 Redirect Manager - Tech Dental" />

            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-sky-900/20">
                        <CornerDownRight size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-extrabold text-gray-900">URL Redirects (301 / 302)</h1>
                    </div>
                </div>

                <button
                    onClick={openCreateModal}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#800038] hover:bg-[#600028] text-white rounded-xl text-xs font-bold shadow-sm transition cursor-pointer self-start sm:self-auto"
                >
                    <Plus size={16} /> Add Redirect Rule
                </button>
            </div>

            {/* SEO Guide Note */}
            <div className="bg-sky-50/70 border border-sky-200/80 rounded-2xl p-4 mb-6 flex items-start gap-3 text-xs text-sky-900">
                <HelpCircle size={18} className="text-sky-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                    <span className="font-bold">SEO Best Practice:</span>
                    <p className="text-[11px] text-sky-800">
                        • <strong>301 Moved Permanently</strong> transfers 95-99% of page ranking authority (link equity). Use when pages or clinic branches are renamed or moved permanently.<br />
                        • <strong>302 Found (Temporary)</strong> is used when relocating traffic temporarily without altering search engine index rankings.<br />
                        • <strong>Trailing Slash Consistency:</strong> Any incoming request with an unnecessary trailing slash (e.g. <code className="bg-sky-100 px-1 rounded">/services/</code>) is automatically 301-redirected to the canonical clean path (<code className="bg-sky-100 px-1 rounded">/services</code>).
                    </p>
                </div>
            </div>

            {/* Table & Filter Bar */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-50/50">
                    <form onSubmit={handleSearch} className="relative w-full sm:w-80">
                        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search source or target URL..."
                            className="w-full pl-9 pr-4 py-1.5 text-xs bg-white border border-gray-200 rounded-xl focus:border-[#800038] focus:ring-1 focus:ring-[#800038]"
                        />
                    </form>

                    <div className="text-xs text-gray-500 font-medium">
                        Total Rules: <span className="font-bold text-gray-900">{redirects.total}</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/80 text-gray-600 font-bold">
                                <th className="p-3.5 pl-5">Source URL (Old)</th>
                                <th className="p-3.5">Target Destination</th>
                                <th className="p-3.5 text-center">Status</th>
                                <th className="p-3.5 text-center">Hits</th>
                                <th className="p-3.5 text-center">Active</th>
                                <th className="p-3.5 pr-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {redirects.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-gray-400 font-medium">
                                        No redirection rules configured yet. Click "Add Redirect Rule" to create one.
                                    </td>
                                </tr>
                            ) : (
                                redirects.data.map((r) => (
                                    <tr key={r.id} className="hover:bg-gray-50/80 transition">
                                        <td className="p-3.5 pl-5 font-mono text-gray-900 font-semibold">
                                            {r.source_url}
                                        </td>
                                        <td className="p-3.5 font-mono text-indigo-700 font-semibold flex items-center gap-1.5">
                                            <ArrowRight size={13} className="text-gray-400 shrink-0" />
                                            <a href={r.target_url} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
                                                {r.target_url}
                                                <ExternalLink size={10} className="text-gray-400" />
                                            </a>
                                        </td>
                                        <td className="p-3.5 text-center">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                                                r.status_code === 301
                                                    ? 'bg-emerald-100 text-emerald-800'
                                                    : 'bg-amber-100 text-amber-800'
                                            }`}>
                                                {r.status_code} {r.status_code === 301 ? 'Permanent' : 'Temporary'}
                                            </span>
                                        </td>
                                        <td className="p-3.5 text-center font-bold text-gray-700">
                                            {r.hits || 0}
                                        </td>
                                        <td className="p-3.5 text-center">
                                            <button
                                                type="button"
                                                onClick={() => handleToggle(r.id)}
                                                className={`cursor-pointer inline-flex items-center text-xs font-bold transition ${
                                                    r.is_active ? 'text-emerald-600' : 'text-gray-300'
                                                }`}
                                                title={r.is_active ? 'Click to deactivate' : 'Click to activate'}
                                            >
                                                {r.is_active ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                                            </button>
                                        </td>
                                        <td className="p-3.5 pr-5 text-right space-x-2">
                                            <button
                                                onClick={() => openEditModal(r)}
                                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                                                title="Edit rule"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(r.id, r.source_url)}
                                                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                                title="Delete rule"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal for Creating / Editing Redirect */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-gray-200 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
                            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                                <CornerDownRight size={16} className="text-[#800038]" />
                                {editingItem ? 'Edit Redirection Rule' : 'New Redirection Rule'}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 text-lg font-bold cursor-pointer"
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
                            <div>
                                <label className="block font-bold text-gray-700 mb-1">Source URL (Old Path) *</label>
                                <input
                                    type="text"
                                    required
                                    value={form.source_url}
                                    onChange={(e) => setForm({ ...form, source_url: e.target.value })}
                                    placeholder="/old-branch or /dental-braces"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl font-mono text-xs"
                                />
                                <p className="text-[10px] text-gray-400 mt-1">When users or Google bots visit this path, they will be redirected.</p>
                            </div>

                            <div>
                                <label className="block font-bold text-gray-700 mb-1">Target Destination URL *</label>
                                <input
                                    type="text"
                                    required
                                    value={form.target_url}
                                    onChange={(e) => setForm({ ...form, target_url: e.target.value })}
                                    placeholder="/branch/mirpur or https://..."
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl font-mono text-xs"
                                />
                                <p className="text-[10px] text-gray-400 mt-1">New canonical page destination or external URL.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-gray-700 mb-1">HTTP Status Code</label>
                                    <select
                                        value={form.status_code}
                                        onChange={(e) => setForm({ ...form, status_code: parseInt(e.target.value) })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl font-semibold bg-white cursor-pointer"
                                    >
                                        <option value={301}>301 Permanent Redirect</option>
                                        <option value={302}>302 Temporary Redirect</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block font-bold text-gray-700 mb-1">Rule Status</label>
                                    <select
                                        value={form.is_active ? '1' : '0'}
                                        onChange={(e) => setForm({ ...form, is_active: e.target.value === '1' })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl font-semibold bg-white cursor-pointer"
                                    >
                                        <option value="1">Active / Enabled</option>
                                        <option value="0">Disabled / Paused</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-[#800038] hover:bg-[#600028] text-white rounded-xl font-bold transition cursor-pointer"
                                >
                                    {editingItem ? 'Update Rule' : 'Save Rule'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
