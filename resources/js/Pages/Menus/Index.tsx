import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Compass, Plus, Trash2, ArrowUp, ArrowDown, ExternalLink, 
    Check, Edit2, Link as LinkIcon, Move, Save, Layout, Globe,
    CornerDownRight, CornerDownLeft, GripVertical
} from 'lucide-react';
import { PageProps } from '@inertiajs/core';

interface MenuItem {
    id: string;
    title: string;
    url: string;
    type?: string;
    target?: string;
    level?: number; // 0 = main, 1 = sub-menu, 2 = sub-sub-menu
    page_id?: number;
}

interface NavMenu {
    id: number;
    name: string;
    slug: string;
    location: string;
    items_json?: string;
}

interface Props extends PageProps {
    menus: NavMenu[];
    postsList?: any[];
    customPages?: { id: number; title: string; url: string }[];
}

export default function Index({ menus = [], postsList = [], customPages = [] }: Props) {
    const [activeMenuId, setActiveMenuId] = useState<number>(menus[0]?.id || 0);
    const activeMenu = menus.find(m => m.id === activeMenuId) || menus[0];

    // Drag & Drop State
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    // Menu Item Builder State
    const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
        if (activeMenu?.items_json) {
            try {
                return JSON.parse(activeMenu.items_json);
            } catch (e) {
                return [];
            }
        }
        return [
            { id: '1', title: 'Home', url: '/', level: 0 },
            { id: '2', title: 'About Tech Dental', url: '/page/about-us', level: 0 },
            { id: '3', title: 'Branches & Schedules', url: '/page/branches-schedule', level: 0 },
        ];
    });

    // Custom Link Form State
    const [customLinkTitle, setCustomLinkTitle] = useState('');
    const [customLinkUrl, setCustomLinkUrl] = useState('');
    
    // New Menu Modal
    const [isNewMenuModalOpen, setIsNewMenuModalOpen] = useState(false);
    const [newMenuName, setNewMenuName] = useState('');
    const [newMenuLocation, setNewMenuLocation] = useState('header');

    // Inertia Form
    const { data, setData, put, post, delete: destroy, processing } = useForm({
        name: activeMenu?.name || 'Primary Header Navigation',
        location: activeMenu?.location || 'header',
        items_json: JSON.stringify(menuItems),
    });

    // Drag & Drop Reordering Handlers
    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', index.toString());
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (dragOverIndex !== index) {
            setDragOverIndex(index);
        }
    };

    const handleDragLeave = () => {
        setDragOverIndex(null);
    };

    const handleDrop = (e: React.DragEvent, targetIndex: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === targetIndex) {
            setDraggedIndex(null);
            setDragOverIndex(null);
            return;
        }

        const updated = [...menuItems];
        const [movedItem] = updated.splice(draggedIndex, 1);
        updated.splice(targetIndex, 0, movedItem);

        setMenuItems(updated);
        setData('items_json', JSON.stringify(updated));
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    // Sync menu selection
    const handleSelectMenu = (m: NavMenu) => {
        setActiveMenuId(m.id);
        let parsed: MenuItem[] = [];
        if (m.items_json) {
            try { parsed = JSON.parse(m.items_json); } catch (e) {}
        }
        setMenuItems(parsed);
        setData({
            name: m.name,
            location: m.location,
            items_json: m.items_json || '[]',
        });
    };

    // Add Custom Link
    const handleAddCustomLink = (e: React.FormEvent) => {
        e.preventDefault();
        if (!customLinkTitle.trim() || !customLinkUrl.trim()) return;
        const newItem: MenuItem = {
            id: Date.now().toString(),
            title: customLinkTitle.trim(),
            url: customLinkUrl.trim(),
            type: 'custom',
            level: 0
        };
        const updated = [...menuItems, newItem];
        setMenuItems(updated);
        setData('items_json', JSON.stringify(updated));
        setCustomLinkTitle('');
        setCustomLinkUrl('');
    };

    // Add Quick Page Link
    const handleAddQuickPage = (title: string, url: string, pageId?: number) => {
        const newItem: MenuItem = {
            id: Date.now().toString(),
            title,
            url,
            type: 'page',
            level: 0,
            page_id: pageId,
        };
        const updated = [...menuItems, newItem];
        setMenuItems(updated);
        setData('items_json', JSON.stringify(updated));
    };

    // Remove Item
    const handleRemoveItem = (id: string) => {
        const updated = menuItems.filter(item => item.id !== id);
        setMenuItems(updated);
        setData('items_json', JSON.stringify(updated));
    };

    // Move Item Up / Down
    const handleMoveItem = (index: number, direction: 'up' | 'down') => {
        if ((direction === 'up' && index === 0) || (direction === 'down' && index === menuItems.length - 1)) return;
        const updated = [...menuItems];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        const temp = updated[index];
        updated[index] = updated[targetIndex];
        updated[targetIndex] = temp;
        setMenuItems(updated);
        setData('items_json', JSON.stringify(updated));
    };

    // Indent Item (Make Sub-menu / Sub-sub-menu)
    const handleIndentItem = (index: number) => {
        if (index === 0) return;
        const updated = [...menuItems];
        const currentLevel = updated[index].level || 0;
        const prevLevel = updated[index - 1].level || 0;
        if (currentLevel <= prevLevel && currentLevel < 2) {
            updated[index].level = currentLevel + 1;
            setMenuItems(updated);
            setData('items_json', JSON.stringify(updated));
        }
    };

    // Outdent Item (Make Parent)
    const handleOutdentItem = (index: number) => {
        const updated = [...menuItems];
        const currentLevel = updated[index].level || 0;
        if (currentLevel > 0) {
            updated[index].level = currentLevel - 1;
            setMenuItems(updated);
            setData('items_json', JSON.stringify(updated));
        }
    };

    // Save Menu
    const handleSaveMenu = (e: React.FormEvent) => {
        e.preventDefault();
        if (activeMenu?.id) {
            put(route('menus.update', activeMenu.id));
        } else {
            post(route('menus.store'));
        }
    };

    // Delete Active Menu
    const handleDeleteActiveMenu = () => {
        if (!activeMenu?.id) return;
        if (confirm(`Are you sure you want to delete menu "${activeMenu.name}"?`)) {
            destroy(route('menus.destroy', activeMenu.id));
        }
    };

    // Create New Menu
    const handleCreateNewMenu = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMenuName.trim()) return;
        router.post(route('menus.store'), {
            name: newMenuName.trim(),
            location: newMenuLocation,
            items_json: JSON.stringify([
                { id: '1', title: 'Home', url: '/', level: 0 }
            ])
        }, {
            onSuccess: () => {
                setIsNewMenuModalOpen(false);
                setNewMenuName('');
            }
        });
    };

    const getIndentClass = (level: number = 0) => {
        switch (level) {
            case 1: return 'ml-6 sm:ml-8 bg-sky-50/70 border-l-4 border-l-sky-500 border-sky-200';
            case 2: return 'ml-12 sm:ml-16 bg-purple-50/70 border-l-4 border-l-purple-500 border-purple-200';
            default: return 'ml-0 bg-slate-50 border-slate-200';
        }
    };

    const getLevelBadge = (level: number = 0) => {
        switch (level) {
            case 1: return <span className="px-2 py-0.5 bg-sky-100 text-sky-800 font-bold text-[10px] rounded border border-sky-200">Sub-Menu</span>;
            case 2: return <span className="px-2 py-0.5 bg-purple-100 text-purple-800 font-bold text-[10px] rounded border border-purple-200">Sub-Sub-Menu</span>;
            default: return <span className="px-2 py-0.5 bg-slate-200 text-slate-700 font-bold text-[10px] rounded">Main</span>;
        }
    };

    return (
        <AdminLayout>
            <Head title="Menu & Navigation Builder" />

            <div className="space-y-6 font-sans text-slate-800 pb-12">
                {/* 1. Top Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white px-6 py-4 rounded-xl border border-slate-200 shadow-2xs gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-sky-50 text-sky-600 rounded-xl">
                            <Compass size={22} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Navigation Menus</h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setIsNewMenuModalOpen(true)}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
                        >
                            <Plus size={14} />
                            <span>Create New Menu</span>
                        </button>
                        <button
                            type="button"
                            onClick={handleSaveMenu}
                            disabled={processing}
                            className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                            <Save size={14} />
                            <span>Save Menu</span>
                        </button>
                    </div>
                </div>

                {/* 2. Top SELECT MENU Dropdown Selector Bar */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
                    <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider shrink-0">SELECT MENU:</span>
                        <select
                            value={activeMenuId}
                            onChange={e => {
                                const selectedId = Number(e.target.value);
                                const targetMenu = menus.find(m => m.id === selectedId);
                                if (targetMenu) handleSelectMenu(targetMenu);
                            }}
                            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30 cursor-pointer shadow-sm min-w-[260px] transition-colors"
                        >
                            {menus.map(m => (
                                <option key={m.id} value={m.id} className="bg-white text-slate-900 font-bold py-1">
                                    {m.name} ({m.location || 'custom'})
                                </option>
                            ))}
                        </select>
                    </div>

                    {activeMenu && menus.length > 1 && (
                        <button
                            type="button"
                            onClick={handleDeleteActiveMenu}
                            className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 border border-rose-200 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                        >
                            <Trash2 size={14} /> Delete Menu
                        </button>
                    )}
                </div>

                {/* Main 2-Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Left Column: Available Pages & Add Custom Link (4 cols) */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* Quick Add Site Pages Card - Only Real Custom Pages */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xs">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                                    <Layout size={14} className="text-[#800038]" />
                                    <span>Add Site Pages</span>
                                </h3>
                                <span className="text-[10px] bg-rose-50 text-rose-800 font-bold px-2 py-0.5 rounded-full border border-rose-200">
                                    {customPages.length} Pages
                                </span>
                            </div>

                            <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-0.5">
                                {customPages && customPages.length > 0 ? (
                                    customPages.map((pg) => (
                                        <div key={pg.id} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100/80 transition-colors">
                                            <div className="leading-tight truncate pr-2">
                                                <div className="text-xs font-bold text-slate-800 truncate">{pg.title}</div>
                                                <div className="text-[10px] text-slate-400 font-mono truncate">{pg.url}</div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleAddQuickPage(pg.title, pg.url, pg.id)}
                                                className="px-2.5 py-1 bg-[#800038]/10 hover:bg-[#800038]/20 text-[#800038] text-[11px] font-bold rounded-lg transition-colors cursor-pointer shrink-0"
                                            >
                                                + Add
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-xs text-slate-400 italic bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                        No custom pages created yet.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Custom Link Builder Card */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xs">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                                <Globe size={14} className="text-sky-600" />
                                <span>Add Custom URL Link</span>
                            </h3>

                            <form onSubmit={handleAddCustomLink} className="space-y-3">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-700">Link Text</label>
                                    <input
                                        type="text"
                                        value={customLinkTitle}
                                        onChange={e => setCustomLinkTitle(e.target.value)}
                                        placeholder="Example: Special Offers"
                                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-700">URL</label>
                                    <input
                                        type="text"
                                        value={customLinkUrl}
                                        onChange={e => setCustomLinkUrl(e.target.value)}
                                        placeholder="https://example.com or /offers"
                                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                                >
                                    Add to Menu Structure
                                </button>
                            </form>
                        </div>

                    </div>

                    {/* Right Column: Menu Structure & Settings (8 cols) */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* Menu Structure Container */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-2xs">
                            
                            {/* Menu Name Field */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-slate-200">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700">Menu Name</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 font-semibold text-slate-900"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700">Display Location</label>
                                    <select
                                        value={data.location}
                                        onChange={e => setData('location', e.target.value)}
                                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 bg-white font-semibold text-slate-900"
                                    >
                                        <option value="header">Primary Header Navigation</option>
                                        <option value="footer">Footer Navigation Links</option>
                                        <option value="mobile">Mobile Drawer Navigation</option>
                                    </select>
                                </div>
                            </div>

                            {/* Menu Structure Header */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">Menu Structure</h3>
                                    <p className="text-xs text-slate-500">Drag with mouse to reorder up & down, or use arrows & indent buttons to create sub-menus.</p>
                                </div>
                                <span className="text-xs font-bold text-slate-400">{menuItems.length} items</span>
                            </div>

                            {/* Menu Items List with Multi-Level Submenu Indentation */}
                            <div className="space-y-2.5">
                                {menuItems.length === 0 ? (
                                    <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 space-y-1">
                                        <Compass size={32} className="mx-auto text-slate-300" />
                                        <p className="text-xs font-semibold">No menu items added yet.</p>
                                        <p className="text-[11px]">Add pages from the left sidebar to build your navigation.</p>
                                    </div>
                                ) : (
                                    menuItems.map((item, index) => (
                                        <div
                                            key={item.id}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, index)}
                                            onDragOver={(e) => handleDragOver(e, index)}
                                            onDragLeave={handleDragLeave}
                                            onDrop={(e) => handleDrop(e, index)}
                                            onDragEnd={handleDragEnd}
                                            className={`p-3 border rounded-xl flex items-center justify-between gap-3 shadow-2xs group transition-all cursor-move select-none ${getIndentClass(item.level)} ${
                                                draggedIndex === index ? 'opacity-40 border-dashed border-sky-500 scale-[0.98]' : ''
                                            } ${
                                                dragOverIndex === index && draggedIndex !== index ? 'ring-2 ring-sky-500 border-sky-400 bg-sky-50/90 shadow-md scale-[1.01]' : ''
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                {/* Drag Handle Icon */}
                                                <div 
                                                    className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-sky-600 p-1 rounded hover:bg-slate-200/50" 
                                                    title="Drag with mouse up/down to reorder"
                                                >
                                                    <GripVertical size={16} />
                                                </div>

                                                {/* Up/Down & Indent/Outdent Controls */}
                                                <div className="flex items-center gap-1 text-slate-400">
                                                    <div className="flex flex-col gap-0.5">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleMoveItem(index, 'up')}
                                                            disabled={index === 0}
                                                            className="p-0.5 hover:text-sky-600 disabled:opacity-30 cursor-pointer"
                                                            title="Move Up"
                                                        >
                                                            <ArrowUp size={12} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleMoveItem(index, 'down')}
                                                            disabled={index === menuItems.length - 1}
                                                            className="p-0.5 hover:text-sky-600 disabled:opacity-30 cursor-pointer"
                                                            title="Move Down"
                                                        >
                                                            <ArrowDown size={12} />
                                                        </button>
                                                    </div>

                                                    {/* Outdent (Shift Left / Parent) */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleOutdentItem(index)}
                                                        disabled={!item.level || item.level === 0}
                                                        className="p-1 hover:text-sky-600 disabled:opacity-20 cursor-pointer rounded hover:bg-slate-200/50"
                                                        title="Outdent (Make Parent)"
                                                    >
                                                        <CornerDownLeft size={13} />
                                                    </button>

                                                    {/* Indent (Shift Right / Submenu) */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleIndentItem(index)}
                                                        disabled={index === 0 || (item.level || 0) >= 2}
                                                        className="p-1 hover:text-sky-600 disabled:opacity-20 cursor-pointer rounded hover:bg-slate-200/50"
                                                        title="Indent (Make Sub-menu)"
                                                    >
                                                        <CornerDownRight size={13} />
                                                    </button>
                                                </div>

                                                <div className="leading-tight">
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="text"
                                                            value={item.title}
                                                            onChange={e => {
                                                                const updated = [...menuItems];
                                                                updated[index].title = e.target.value;
                                                                setMenuItems(updated);
                                                                setData('items_json', JSON.stringify(updated));
                                                            }}
                                                            className="font-bold text-xs text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-sky-500 focus:outline-none bg-transparent px-1 py-0.5"
                                                        />
                                                        {getLevelBadge(item.level)}
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={item.url}
                                                        onChange={e => {
                                                            const updated = [...menuItems];
                                                            updated[index].url = e.target.value;
                                                            setMenuItems(updated);
                                                            setData('items_json', JSON.stringify(updated));
                                                        }}
                                                        className="text-[11px] font-mono text-slate-500 border-b border-transparent hover:border-slate-300 focus:border-sky-500 focus:outline-none bg-transparent px-1 py-0.5 block w-48 sm:w-64"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveItem(item.id)}
                                                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                                    title="Remove Item"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Bottom Checkmark Location Options (Exact Match to User Screenshot Red Box) */}
                            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center gap-6 bg-slate-50/70 p-4 rounded-xl border border-slate-100">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Display Location Options:</span>
                                
                                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800 hover:text-sky-600 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={data.location === 'header'}
                                        onChange={e => {
                                            const isChecked = e.target.checked;
                                            setData('location', isChecked ? 'header' : '');
                                        }}
                                        className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300 cursor-pointer"
                                    />
                                    <span>Make a Main Menu</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800 hover:text-sky-600 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={data.location === 'footer'}
                                        onChange={e => {
                                            const isChecked = e.target.checked;
                                            setData('location', isChecked ? 'footer' : '');
                                        }}
                                        className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300 cursor-pointer"
                                    />
                                    <span>Make a Footer Menu</span>
                                </label>
                            </div>

                        </div>

                    </div>
                </div>
            </div>

            {/* Create New Menu Modal */}
            {isNewMenuModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
                    <form onSubmit={handleCreateNewMenu} className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                            <h3 className="text-sm font-bold text-slate-900">Create New Navigation Menu</h3>
                            <button type="button" onClick={() => setIsNewMenuModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                                ✕
                            </button>
                        </div>

                        <div className="space-y-3">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700">Menu Name</label>
                                <input
                                    type="text"
                                    value={newMenuName}
                                    onChange={e => setNewMenuName(e.target.value)}
                                    placeholder="Example: Footer Quick Links"
                                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700">Display Location</label>
                                <select
                                    value={newMenuLocation}
                                    onChange={e => setNewMenuLocation(e.target.value)}
                                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 bg-white font-semibold text-slate-800"
                                >
                                    <option value="header">Main Header Navigation</option>
                                    <option value="footer">Footer Navigation Links</option>
                                    <option value="mobile">Mobile Navigation Drawer</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 border-t border-slate-200 pt-3">
                            <button
                                type="button"
                                onClick={() => setIsNewMenuModalOpen(false)}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                            >
                                Create Menu
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </AdminLayout>
    );
}

