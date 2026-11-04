import React from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Tag, Plus, Trash2 } from 'lucide-react';
import { PageProps } from '@inertiajs/core';

interface TagItem {
    id: number;
    name: string;
    slug: string;
    description?: string;
    count?: number;
}

interface Props extends PageProps {
    tags?: TagItem[];
}

export default function TagsIndex({ tags = [] }: Props) {
    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        slug: '',
        description: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('posts.tags.store'), {
            onSuccess: () => reset(),
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this tag?')) {
            router.delete(route('posts.tags.destroy', id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Tags - Tech Dental" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2.5">
                        <Tag size={22} className="text-rose-600" />
                        Post Tags
                    </h1>
                    <p className="text-xs text-gray-500 mt-1">Manage keywords and tags associated with articles and patient guides.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Form: Add Tag */}
                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
                            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-1.5">
                                <Plus size={16} className="text-rose-600" />
                                <span>Add New Tag</span>
                            </h3>

                            <form onSubmit={submit} className="space-y-3.5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Name *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. root-canal"
                                        value={data.name}
                                        onChange={(e) => {
                                            setData('name', e.target.value);
                                            if (!data.slug) {
                                                setData('slug', e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                                            }
                                        }}
                                        className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-rose-500 focus:outline-none"
                                    />
                                    {errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Slug</label>
                                    <input
                                        type="text"
                                        placeholder="root-canal"
                                        value={data.slug}
                                        onChange={(e) => setData('slug', e.target.value)}
                                        className="w-full text-xs font-mono border border-gray-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-rose-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                                    <textarea
                                        rows={3}
                                        placeholder="Tag summary..."
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className="w-full text-xs border border-gray-200 rounded-xl p-3 focus:ring-1 focus:ring-rose-500 focus:outline-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-[#800038] hover:bg-[#990044] text-white py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all"
                                >
                                    Add Tag
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right Table: Tags List */}
                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-xs">
                            <table className="w-full text-left text-xs text-gray-600">
                                <thead className="bg-gray-50/80 text-gray-700 font-bold border-b border-gray-200 uppercase tracking-wider text-[11px]">
                                    <tr>
                                        <th className="p-3.5">Name</th>
                                        <th className="p-3.5">Description</th>
                                        <th className="p-3.5">Slug</th>
                                        <th className="p-3.5 text-center">Count</th>
                                        <th className="p-3.5 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {tags.map((t) => (
                                        <tr key={t.id} className="hover:bg-gray-50/60 transition-colors">
                                            <td className="p-3.5 font-bold text-gray-900">{t.name}</td>
                                            <td className="p-3.5 text-gray-500 max-w-xs truncate">{t.description || '—'}</td>
                                            <td className="p-3.5 font-mono text-gray-500">#{t.slug}</td>
                                            <td className="p-3.5 text-center font-bold text-rose-600">{t.count || 0}</td>
                                            <td className="p-3.5 text-right">
                                                <button
                                                    onClick={() => handleDelete(t.id)}
                                                    className="p-1 text-gray-400 hover:text-red-600 rounded transition"
                                                    title="Delete tag"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
