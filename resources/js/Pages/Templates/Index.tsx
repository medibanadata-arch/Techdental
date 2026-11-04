import React, { useState } from 'react';
import { Head, useForm, put } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    LayoutTemplate, Plus, Trash2, CheckCircle, XCircle, Edit3, Eye,
    Layers, Layout, FileText, Check, Settings, Sparkles, Filter, Move,
    GripVertical, ArrowUp, ArrowDown, EyeOff, Save, CheckSquare, Square
} from 'lucide-react';
import { PageProps } from '@inertiajs/core';

interface Template {
    id: number;
    name: string;
    slug: string;
    type: string;
    is_active: boolean;
    conditions?: string;
    layout_config?: string;
}

interface Props extends PageProps {
    templates: Template[];
}

interface BlockItem {
    id: string;
    name: string;
    category: string;
    visible: boolean;
}

export default function Index({ templates = [] }: Props) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [filterType, setFilterType] = useState<string>('all');

    // Customize Modal State
    const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
    const [blocks, setBlocks] = useState<BlockItem[]>([]);
    const [sidebarPosition, setSidebarPosition] = useState<'right' | 'left' | 'none'>('right');
    const [themeStyle, setThemeStyle] = useState<'modern' | 'glassmorphism' | 'clean'>('modern');

    // Inertia Form
    const { data, setData, post, put: updateForm, delete: destroy, processing } = useForm({
        name: '',
        type: 'single_post',
        conditions: 'All Blog Posts',
        is_active: true,
        layout_config: JSON.stringify({})
    });

    const handleCreateTemplate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.name.trim()) return;
        post(route('templates.store'), {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                setData({
                    name: '',
                    type: 'single_post',
                    conditions: 'All Blog Posts',
                    is_active: true,
                    layout_config: JSON.stringify({})
                });
            }
        });
    };

    const handleToggleActive = (tpl: Template) => {
        updateForm(route('templates.update', tpl.id), {
            data: {
                ...tpl,
                is_active: !tpl.is_active
            }
        });
    };

    const handleDeleteTemplate = (id: number) => {
        if (confirm('Are you sure you want to delete this template?')) {
            destroy(route('templates.destroy', id));
        }
    };

    // Open Drag & Drop Customizer Modal
    const handleOpenCustomizer = (tpl: Template) => {
        setEditingTemplate(tpl);

        // Parse existing layout config or set default drag-and-drop block presets
        let parsedConfig: any = {};
        if (tpl.layout_config) {
            try {
                parsedConfig = typeof tpl.layout_config === 'string' ? JSON.parse(tpl.layout_config) : tpl.layout_config;
            } catch (e) {}
        }

        const defaultBlocks: BlockItem[] = [
            { id: 'b1', name: 'Header & Breadcrumbs Navigation Bar', category: 'Header', visible: parsedConfig.header !== false },
            { id: 'b2', name: 'Post / Page Title & Meta Badges', category: 'Main', visible: true },
            { id: 'b3', name: 'Featured Banner Image Box', category: 'Main', visible: parsedConfig.showImage !== false },
            { id: 'b4', name: 'Executive Summary Callout Box', category: 'Main', visible: true },
            { id: 'b5', name: 'Main HTML Article & Page Content Body', category: 'Main', visible: true },
            { id: 'b6', name: 'Author Profile & Certification Card', category: 'Footer', visible: parsedConfig.showAuthor !== false },
            { id: 'b7', name: 'Appointment Consultation Sidebar Widget', category: 'Sidebar', visible: parsedConfig.showSidebar !== false },
            { id: 'b8', name: 'Clinic Operating Hours & Location Overview', category: 'Sidebar', visible: true },
        ];

        setBlocks(parsedConfig.blocks || defaultBlocks);
        setSidebarPosition(parsedConfig.sidebarPosition || 'right');
        setThemeStyle(parsedConfig.themeStyle || 'modern');
    };

    // Move Block Up / Down
    const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
        if ((direction === 'up' && index === 0) || (direction === 'down' && index === blocks.length - 1)) return;
        const updated = [...blocks];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        const temp = updated[index];
        updated[index] = updated[targetIndex];
        updated[targetIndex] = temp;
        setBlocks(updated);
    };

    // Toggle Block Visibility
    const handleToggleBlockVisibility = (index: number) => {
        const updated = [...blocks];
        updated[index].visible = !updated[index].visible;
        setBlocks(updated);
    };

    // Save Customized Layout Config
    const handleSaveCustomizedLayout = () => {
        if (!editingTemplate) return;
        const newConfig = {
            blocks,
            sidebarPosition,
            themeStyle,
            header: blocks.find(b => b.id === 'b1')?.visible ?? true,
            showAuthor: blocks.find(b => b.id === 'b6')?.visible ?? true,
            showSidebar: sidebarPosition !== 'none',
        };

        updateForm(route('templates.update', editingTemplate.id), {
            data: {
                name: editingTemplate.name,
                type: editingTemplate.type,
                conditions: editingTemplate.conditions,
                is_active: editingTemplate.is_active,
                layout_config: JSON.stringify(newConfig),
            },
            onSuccess: () => {
                setEditingTemplate(null);
            }
        });
    };

    const filteredTemplates = templates.filter(t => {
        if (filterType === 'all') return true;
        return t.type === filterType;
    });

    const getTypeBadgeColor = (type: string) => {
        switch (type) {
            case 'single_post': return 'bg-sky-100 text-sky-800 border-sky-200';
            case 'single_page': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'service_page': return 'bg-teal-100 text-teal-800 border-teal-200';
            case 'header': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'footer': return 'bg-purple-100 text-purple-800 border-purple-200';
            default: return 'bg-slate-100 text-slate-800 border-slate-200';
        }
    };

    return (
        <AdminLayout>
            <Head title="Custom Template Builder" />

            <div className="space-y-6 font-sans text-slate-800 pb-12">
                {/* 1. Top Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white px-6 py-4 rounded-xl border border-slate-200 shadow-2xs gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                            <LayoutTemplate size={22} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Custom Template Builder</h1>
                            <p className="text-xs text-slate-500">Design custom layout templates with interactive drag & drop block customizer.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setIsCreateModalOpen(true)}
                            className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                            <Plus size={14} />
                            <span>Create New Template</span>
                        </button>
                    </div>
                </div>

                {/* 2. Filter Bar */}
                <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-2 overflow-x-auto shadow-2xs">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 shrink-0 flex items-center gap-1">
                        <Filter size={12} />
                        <span>Filter Type:</span>
                    </span>
                    {[
                        { label: 'All Templates', value: 'all' },
                        { label: 'Single Post', value: 'single_post' },
                        { label: 'Single Page', value: 'single_page' },
                        { label: 'Service Page', value: 'service_page' },
                        { label: 'Header Layout', value: 'header' },
                        { label: 'Footer Layout', value: 'footer' },
                    ].map(f => (
                        <button
                            key={f.value}
                            type="button"
                            onClick={() => setFilterType(f.value)}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                                filterType === f.value
                                    ? 'bg-slate-900 text-white shadow-2xs'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* Templates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTemplates.map(tpl => (
                        <div
                            key={tpl.id}
                            className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xs flex flex-col justify-between hover:border-sky-300 transition-all group"
                        >
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${getTypeBadgeColor(tpl.type)}`}>
                                        {tpl.type.replace('_', ' ')}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => handleToggleActive(tpl)}
                                        className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                                            tpl.is_active
                                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                        }`}
                                    >
                                        {tpl.is_active ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                        <span>{tpl.is_active ? 'Active' : 'Inactive'}</span>
                                    </button>
                                </div>

                                <div>
                                    <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                                        {tpl.name}
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-mono">
                                        <span>Conditions:</span>
                                        <span className="font-semibold text-slate-700">{tpl.conditions || 'Global'}</span>
                                    </p>
                                </div>
                            </div>

                            {/* Card Footer Actions - Includes Customize & Drag-and-Drop */}
                            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs flex-wrap gap-2">
                                <span className="text-[11px] text-slate-400 font-mono">/{tpl.slug}</span>
                                <div className="flex items-center gap-1.5">
                                    <button
                                        type="button"
                                        onClick={() => handleOpenCustomizer(tpl)}
                                        className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-[11px] border border-purple-200 shadow-2xs"
                                        title="Drag & Drop Customize Layout"
                                    >
                                        <Move size={12} />
                                        <span>Customize</span>
                                    </button>

                                    {tpl.type === 'single_post' && (
                                        <a
                                            href="/posts/4"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-[11px] border border-sky-200"
                                            title="Preview Post Page with this Template"
                                        >
                                            <Eye size={12} />
                                            <span>View Live</span>
                                        </a>
                                    )}
                                    {tpl.type === 'single_page' && (
                                        <a
                                            href="/pages/1"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-[11px] border border-emerald-200"
                                            title="Preview Page with this Template"
                                        >
                                            <Eye size={12} />
                                            <span>View Live</span>
                                        </a>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteTemplate(tpl.id)}
                                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                        title="Delete Template"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. Drag & Drop Visual Template Customizer Modal */}
            {editingTemplate && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl border border-slate-200 max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Modal Top Header */}
                        <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-500/20 text-purple-300 rounded-xl border border-purple-500/30">
                                    <Move size={20} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-base font-extrabold text-white">Drag & Drop Layout Customizer</h3>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getTypeBadgeColor(editingTemplate.type)}`}>
                                            {editingTemplate.type}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-0.5">Customize layout blocks order, sidebar position, and section visibility for "{editingTemplate.name}".</p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setEditingTemplate(null)}
                                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Modal Content Columns: Left Drag Controls, Right Live Canvas */}
                        <div className="grid grid-cols-1 md:grid-cols-12 overflow-y-auto divide-y md:divide-y-0 md:divide-x divide-slate-100 flex-1">
                            
                            {/* Left Column: Drag & Drop Block Reordering List (7 Cols) */}
                            <div className="md:col-span-7 p-6 space-y-6">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                            <Layers size={14} className="text-purple-600" />
                                            <span>Reorder & Toggle Layout Blocks</span>
                                        </h4>
                                        <span className="text-[11px] text-slate-400 font-mono">Use arrows to move up/down</span>
                                    </div>

                                    <div className="space-y-2">
                                        {blocks.map((block, idx) => (
                                            <div
                                                key={block.id}
                                                className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                                                    block.visible
                                                        ? 'bg-white border-slate-200 shadow-2xs hover:border-purple-300'
                                                        : 'bg-slate-50/70 border-slate-200/60 opacity-60'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    <div className="p-1.5 text-slate-400 hover:text-slate-600 cursor-grab">
                                                        <GripVertical size={16} />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="text-xs font-bold text-slate-900 truncate">
                                                            {block.name}
                                                        </div>
                                                        <div className="text-[10px] text-slate-400 font-mono capitalize">
                                                            Section: {block.category}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-1 shrink-0">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleMoveBlock(idx, 'up')}
                                                        disabled={idx === 0}
                                                        className="p-1 text-slate-400 hover:text-purple-600 hover:bg-purple-50 disabled:opacity-30 rounded-lg transition"
                                                        title="Move Block Up"
                                                    >
                                                        <ArrowUp size={14} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleMoveBlock(idx, 'down')}
                                                        disabled={idx === blocks.length - 1}
                                                        className="p-1 text-slate-400 hover:text-purple-600 hover:bg-purple-50 disabled:opacity-30 rounded-lg transition"
                                                        title="Move Block Down"
                                                    >
                                                        <ArrowDown size={14} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleToggleBlockVisibility(idx)}
                                                        className={`p-1.5 rounded-lg text-xs font-bold transition ml-1 ${
                                                            block.visible
                                                                ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                                                                : 'text-slate-400 bg-slate-100 hover:bg-slate-200'
                                                        }`}
                                                        title={block.visible ? 'Hide Block' : 'Show Block'}
                                                    >
                                                        {block.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Sidebar & Style Controls */}
                                <div className="space-y-4 pt-4 border-t border-slate-100">
                                    <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                                        Layout Settings
                                    </h4>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-700">Sidebar Position</label>
                                            <select
                                                value={sidebarPosition}
                                                onChange={(e: any) => setSidebarPosition(e.target.value)}
                                                className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-white"
                                            >
                                                <option value="right">Right Sidebar</option>
                                                <option value="left">Left Sidebar</option>
                                                <option value="none">No Sidebar (Full Width)</option>
                                            </select>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-700">Theme Styling</label>
                                            <select
                                                value={themeStyle}
                                                onChange={(e: any) => setThemeStyle(e.target.value)}
                                                className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-white"
                                            >
                                                <option value="modern">Modern Light</option>
                                                <option value="glassmorphism">Glassmorphism Overlay</option>
                                                <option value="clean">Clean Minimal</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Real-Time Live Preview Canvas (5 Cols) */}
                            <div className="md:col-span-5 p-6 bg-slate-50 space-y-4 flex flex-col justify-between">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                            <Eye size={14} className="text-sky-600" />
                                            <span>Real-Time Layout Preview</span>
                                        </h4>
                                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                                            Live Canvas
                                        </span>
                                    </div>

                                    {/* Wireframe Preview Canvas */}
                                    <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xs min-h-[300px]">
                                        {blocks.filter(b => b.visible).map((b, i) => (
                                            <div
                                                key={b.id}
                                                className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                                                    b.category === 'Sidebar'
                                                        ? 'bg-purple-50/80 text-purple-900 border-purple-200'
                                                        : b.category === 'Header'
                                                        ? 'bg-sky-50/80 text-sky-900 border-sky-200'
                                                        : 'bg-slate-50 text-slate-800 border-slate-200'
                                                }`}
                                            >
                                                <span className="flex items-center gap-2">
                                                    <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-600 text-[10px] flex items-center justify-center">
                                                        {i + 1}
                                                    </span>
                                                    <span className="truncate">{b.name}</span>
                                                </span>
                                                <span className="text-[9px] font-mono uppercase opacity-60">
                                                    {b.category}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setEditingTemplate(null)}
                                        className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl cursor-pointer transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSaveCustomizedLayout}
                                        className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl cursor-pointer transition flex items-center gap-1.5 shadow-sm"
                                    >
                                        <Save size={14} />
                                        <span>Save Layout Config</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Template Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
                    <form onSubmit={handleCreateTemplate} className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                            <h3 className="text-sm font-bold text-slate-900">+ Create Custom Template</h3>
                            <button type="button" onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                                ✕
                            </button>
                        </div>

                        <div className="space-y-3">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700">Template Name</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="Example: Single Post Grid Layout"
                                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700">Template Type</label>
                                <select
                                    value={data.type}
                                    onChange={e => setData('type', e.target.value)}
                                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 bg-white"
                                >
                                    <option value="single_post">Single Post Layout</option>
                                    <option value="single_page">Single Custom Page</option>
                                    <option value="service_page">Dental Service Page</option>
                                    <option value="archive">Blog Archive Layout</option>
                                    <option value="header">Site Header Template</option>
                                    <option value="footer">Site Footer Template</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700">Display Conditions</label>
                                <input
                                    type="text"
                                    value={data.conditions}
                                    onChange={e => setData('conditions', e.target.value)}
                                    placeholder="Example: All Blog Posts, Category: Dental Care"
                                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 border-t border-slate-200 pt-3">
                            <button
                                type="button"
                                onClick={() => setIsCreateModalOpen(false)}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                            >
                                Create Template
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </AdminLayout>
    );
}
