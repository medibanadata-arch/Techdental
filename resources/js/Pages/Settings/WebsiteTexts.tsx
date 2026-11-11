import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Save, Type, ExternalLink } from 'lucide-react';
import { PageProps } from '@inertiajs/core';
import { WEBSITE_TEXTS_DEFAULTS, WEBSITE_TEXT_FIELDS } from '@/data/websiteTexts';

interface Props extends PageProps {
    settings?: {
        website_texts?: Record<string, string>;
    };
}

export default function WebsiteTexts({ settings }: Props) {
    const page = usePage();
    const flash = (page.props as any)?.flash;

    const [form, setForm] = useState<Record<string, string>>(() => {
        const saved = settings?.website_texts || {};
        const merged: Record<string, string> = { ...WEBSITE_TEXTS_DEFAULTS };
        Object.keys(merged).forEach((key) => {
            const value = saved[key];
            if (typeof value === 'string' && value.trim() !== '') {
                merged[key] = value;
            }
        });
        return merged;
    });
    const [saved, setSaved] = useState(false);

    const groups = Array.from(new Set(WEBSITE_TEXT_FIELDS.map((f) => f.group)));

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(route('settings.website-texts.update'), { website_texts: form }, {
            preserveScroll: true,
            onSuccess: () => {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            },
        });
    };

    return (
        <AdminLayout>
            <Head title="Website Texts - Admin" />
            <div className="max-w-5xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Type className="text-[#800038]" size={22} />
                            Website Texts
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Headings, labels and SEO copy for public pages that don&apos;t have their own CMS screen.
                            Leave a field empty to use the default text.
                        </p>
                    </div>
                    <a
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-[#800038]"
                    >
                        <ExternalLink size={14} /> View Live Website
                    </a>
                </div>

                {flash?.success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium rounded-xl px-4 py-3">
                        {flash.success}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-6">
                    {groups.map((group) => (
                        <div key={group} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs space-y-4">
                            <h2 className="font-extrabold text-sm text-gray-900 border-b border-gray-100 pb-2">{group}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {WEBSITE_TEXT_FIELDS.filter((f) => f.group === group).map((field) => (
                                    <div key={field.key} className={field.multiline ? 'md:col-span-2' : ''}>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">{field.label}</label>
                                        {field.multiline ? (
                                            <textarea
                                                rows={3}
                                                value={form[field.key] ?? ''}
                                                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                                                className="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-xl bg-white"
                                            />
                                        ) : (
                                            <input
                                                type="text"
                                                value={form[field.key] ?? ''}
                                                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                                                className="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-xl bg-white"
                                            />
                                        )}
                                        {field.help && <p className="text-[10px] text-gray-400 mt-1">{field.help}</p>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="flex items-center justify-end gap-3 sticky bottom-3 bg-white/95 backdrop-blur border border-gray-200 rounded-2xl px-5 py-3 shadow-lg">
                        {saved && <span className="text-xs font-semibold text-emerald-700">Saved!</span>}
                        <button
                            type="submit"
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition cursor-pointer"
                        >
                            <Save size={16} /> Save Website Texts
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
