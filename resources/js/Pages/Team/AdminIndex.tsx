import React, { useState, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Users,
    Briefcase,
    Headphones,
    Megaphone,
    Shield,
    Plus,
    Edit3,
    Trash2,
    ExternalLink,
    UserPlus,
    CheckCircle2,
    EyeOff,
    Check,
    Eye
} from 'lucide-react';
import { PageProps } from '@inertiajs/core';

interface TeamMember {
    id: number;
    name: string;
    role: string;
    section: 'management' | 'ceo_assistant' | 'digital_marketing' | 'call_center';
    image?: string;
    quote?: string;
    letter?: string[];
    photo_alt?: string;
    is_active?: boolean;
    sort_order?: number;
}

interface Props extends PageProps {
    data: TeamMember[];
}

const SECTION_CONFIG = {
    management: { label: 'Management Team', icon: Shield, desc: 'Clinic Directors, CEO & Chief Dental Officers' },
    ceo_assistant: { label: 'Assistant to CEO', icon: Briefcase, desc: 'Executive & Strategic Operations' },
    digital_marketing: { label: 'Digital Marketing Team', icon: Megaphone, desc: 'Brand, Content & Online Media' },
    call_center: { label: 'Call Center Team', icon: Headphones, desc: 'Patient Relations & 24/7 Telephone Support' },
};

export default function TeamAdminIndex({ data = [] }: Props) {
    const [activeSection, setActiveSection] = useState<'management' | 'ceo_assistant' | 'digital_marketing' | 'call_center'>('management');

    const currentSectionMembers = useMemo(() => {
        return data.filter(m => m.section === activeSection);
    }, [data, activeSection]);

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Are you sure you want to remove "${name}" from the team?`)) {
            router.delete(route('team.admin.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    const handleToggleStatus = (id: number) => {
        router.post(route('team.admin.toggle', id), {}, {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Corporate Team Admin - Tech Dental" />

            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#800038] to-rose-700 text-white flex items-center justify-center font-bold shadow-md shadow-rose-900/20">
                        <Users size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-extrabold text-gray-900">Corporate Team</h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <a
                        href="/team"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition shadow-2xs"
                    >
                        <ExternalLink size={14} />
                        View Public Team Page
                    </a>
                    <Link
                        href={route('team.admin.create', { section: activeSection })}
                        className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#800038] hover:bg-[#990044] rounded-xl shadow-sm transition"
                    >
                        <UserPlus size={16} />
                        Add Member (Full Page)
                    </Link>
                </div>
            </div>

            {/* Section Tabs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {(Object.entries(SECTION_CONFIG) as [keyof typeof SECTION_CONFIG, typeof SECTION_CONFIG.management][]).map(([key, cfg]) => {
                    const Icon = cfg.icon;
                    const membersInSection = data.filter(m => m.section === key);
                    const count = membersInSection.length;
                    const publishedCount = membersInSection.filter(m => m.is_active !== false).length;
                    const isActive = activeSection === key;
                    return (
                        <button
                            key={key}
                            type="button"
                            onClick={() => setActiveSection(key)}
                            className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                                isActive
                                    ? 'bg-[#800038] text-white border-rose-900 shadow-sm'
                                    : 'bg-white text-gray-700 border-gray-200 hover:border-rose-300'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <Icon size={20} className={isActive ? 'text-white' : 'text-[#800038]'} />
                                <div className="flex items-center gap-1.5">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'}`}>
                                        {count} total
                                    </span>
                                    {count > 0 && (
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? 'bg-emerald-500/30 text-emerald-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`} title={`${publishedCount} published`}>
                                            {publishedCount} live
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div>
                                <div className="font-bold text-sm leading-tight">{cfg.label}</div>
                                <div className={`text-[11px] mt-0.5 ${isActive ? 'text-rose-200' : 'text-gray-400'}`}>
                                    {cfg.desc}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Member Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentSectionMembers.length === 0 ? (
                    <div className="col-span-full bg-white p-12 rounded-2xl border border-gray-200 text-center text-gray-400">
                        <Users size={36} className="mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">No members added in this team section yet.</p>
                        <Link
                            href={route('team.admin.create', { section: activeSection })}
                            className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-rose-50 text-rose-700 rounded-xl text-xs font-bold hover:bg-rose-100 transition"
                        >
                            <Plus size={14} /> Add First Member (Full Page)
                        </Link>
                    </div>
                ) : (
                    currentSectionMembers.map((member) => {
                        const isPublished = member.is_active !== false;
                        const slug = (member.name || '').toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

                        return (
                            <div
                                key={member.id}
                                className={`bg-white rounded-2xl border transition-all flex flex-col justify-between p-5 space-y-4 hover:shadow-md ${
                                    isPublished ? 'border-gray-200 hover:border-rose-300' : 'border-amber-200/80 bg-amber-50/10'
                                }`}
                            >
                                <div className="space-y-3">
                                    {/* Top Row: Section & Publish Status */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                            {SECTION_CONFIG[member.section]?.label}
                                        </span>

                                        {/* Publish / Draft Indicator Badge */}
                                        <button
                                            type="button"
                                            onClick={() => handleToggleStatus(member.id)}
                                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold transition cursor-pointer border ${
                                                isPublished
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                                    : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                                            }`}
                                            title="Click to toggle publish status"
                                        >
                                            {isPublished ? (
                                                <>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                    <span>Published</span>
                                                </>
                                            ) : (
                                                <>
                                                    <EyeOff size={11} />
                                                    <span>Draft (Hidden)</span>
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    {/* Member Image & Details */}
                                    <div className="flex items-start gap-3.5">
                                        <div className="w-16 h-16 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden shrink-0 shadow-2xs">
                                            <img
                                                src={member.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                                                alt={member.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-gray-900 text-sm truncate">{member.name}</h3>
                                            <p className="text-xs text-[#800038] font-semibold">{member.role}</p>
                                            {member.quote && (
                                                <p className="text-[11px] text-gray-500 italic mt-1 line-clamp-2">
                                                    &ldquo;{member.quote}&rdquo;
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Action Buttons */}
                                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        {member.section === 'management' && slug && (
                                            <a
                                                href={`/team/${slug}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-[11px] font-semibold text-gray-500 hover:text-[#800038] flex items-center gap-1 transition"
                                                title="View Single Executive Page"
                                            >
                                                <ExternalLink size={12} />
                                                <span>Single Page</span>
                                            </a>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-1.5">
                                        <Link
                                            href={route('team.admin.edit', member.id)}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-50 hover:bg-[#800038] text-[#800038] hover:text-white rounded-lg text-xs font-bold transition shadow-2xs"
                                            title="Open full page editor"
                                        >
                                            <Edit3 size={13} />
                                            <span>Edit Page</span>
                                        </Link>

                                        <button
                                            type="button"
                                            onClick={() => handleDelete(member.id, member.name)}
                                            className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition"
                                            title="Delete Member"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </AdminLayout>
    );
}
