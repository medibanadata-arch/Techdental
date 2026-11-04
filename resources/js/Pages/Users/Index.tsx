import React, { useState, useMemo } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Users,
    UserPlus,
    Trash2,
    Shield,
    X,
    Save,
    Edit3,
    Search,
    CheckCircle2,
    ShieldAlert,
    Briefcase,
    PenTool,
    Key,
    Lock
} from 'lucide-react';
import { PageProps } from '@inertiajs/core';

interface UserItem {
    id: number;
    name: string;
    username?: string;
    email: string;
    role: string;
    avatar?: string;
    created_at?: string;
}

interface Props extends PageProps {
    users: UserItem[];
}

export default function UsersIndex({ users = [] }: Props) {
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserItem | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    // Add User Form
    const addForm = useForm({
        name: '',
        username: '',
        email: '',
        password: '',
        role: 'Manager',
    });

    // Edit User Form
    const editForm = useForm({
        name: '',
        username: '',
        email: '',
        password: '',
        role: 'Manager',
    });

    const handleOpenEdit = (user: UserItem) => {
        setEditingUser(user);
        editForm.setData({
            name: user.name || '',
            username: user.username || '',
            email: user.email || '',
            password: '',
            role: user.role || 'Manager',
        });
    };

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addForm.post(route('users.store'), {
            onSuccess: () => {
                setIsAddUserOpen(false);
                addForm.reset();
            },
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;
        editForm.put(route('users.update', editingUser.id), {
            onSuccess: () => {
                setEditingUser(null);
                editForm.reset();
            },
        });
    };

    const handleDelete = (id: number, email: string) => {
        if (email === 'info@techdentalcare.com') {
            alert('The primary super admin account cannot be deleted.');
            return;
        }
        if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            router.delete(route('users.destroy', id));
        }
    };

    const getRoleBadge = (role: string) => {
        const lower = (role || '').toLowerCase();
        if (lower.includes('admin')) {
            return {
                bg: 'bg-rose-50 text-rose-700 border-rose-200',
                icon: Shield,
                label: 'Admin'
            };
        }
        if (lower.includes('manager')) {
            return {
                bg: 'bg-purple-50 text-purple-700 border-purple-200',
                icon: Briefcase,
                label: 'Manager'
            };
        }
        if (lower.includes('editor')) {
            return {
                bg: 'bg-blue-50 text-blue-700 border-blue-200',
                icon: PenTool,
                label: 'Editor'
            };
        }
        return {
            bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            icon: Users,
            label: role || 'User'
        };
    };

    const filteredUsers = useMemo(() => {
        return users.filter(u => {
            const matchesRole = roleFilter === 'all' || (u.role || '').toLowerCase() === roleFilter.toLowerCase();
            const matchesSearch = !searchQuery ||
                u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.username?.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesRole && matchesSearch;
        });
    }, [users, roleFilter, searchQuery]);

    return (
        <AdminLayout>
            <Head title="User & Role Access Management - Tech Dental" />

            <div className="space-y-6 max-w-6xl mx-auto pb-16">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/80 pb-5">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2.5">
                            <Users size={24} className="text-rose-600" />
                            Users
                        </h1>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsAddUserOpen(true)}
                        className="inline-flex items-center gap-2 bg-[#800038] hover:bg-[#990044] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
                    >
                        <UserPlus size={16} />
                        <span>Add New User</span>
                    </button>
                </div>

                {/* Role Permissions Cards Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Admin Card */}
                    <div className="p-4 bg-white border border-rose-200/70 rounded-2xl shadow-2xs space-y-2">
                        <div className="flex items-center gap-2 text-rose-700 font-bold text-xs uppercase tracking-wider">
                            <Shield size={16} />
                            <span>Administrator (Admin)</span>
                        </div>
                        <p className="text-[11px] text-gray-600 leading-relaxed">
                            Full control over all features: Site Settings, User Accounts, Menus, Database, Bookings, and Content.
                        </p>
                        <div className="text-[10px] font-semibold text-rose-800 bg-rose-50 px-2 py-1 rounded-md w-fit">
                            Level: Full Access
                        </div>
                    </div>

                    {/* Manager Card */}
                    <div className="p-4 bg-white border border-purple-200/70 rounded-2xl shadow-2xs space-y-2">
                        <div className="flex items-center gap-2 text-purple-700 font-bold text-xs uppercase tracking-wider">
                            <Briefcase size={16} />
                            <span>Manager</span>
                        </div>
                        <p className="text-[11px] text-gray-600 leading-relaxed">
                            Operational control: Medicines, Services, Appointments, Custom Pages, Doctor profiles, and Media Library.
                        </p>
                        <div className="text-[10px] font-semibold text-purple-800 bg-purple-50 px-2 py-1 rounded-md w-fit">
                            Level: Operations & Content
                        </div>
                    </div>

                    {/* Editor Card */}
                    <div className="p-4 bg-white border border-blue-200/70 rounded-2xl shadow-2xs space-y-2">
                        <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase tracking-wider">
                            <PenTool size={16} />
                            <span>Editor</span>
                        </div>
                        <p className="text-[11px] text-gray-600 leading-relaxed">
                            Editorial control: Blog Posts & Guides, Medicine details & descriptions, and Media uploads.
                        </p>
                        <div className="text-[10px] font-semibold text-blue-800 bg-blue-50 px-2 py-1 rounded-md w-fit">
                            Level: Editorial Only
                        </div>
                    </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="flex flex-wrap gap-2 w-full md:w-auto">
                        {[
                            { key: 'all', label: 'All Users' },
                            { key: 'administrator', label: 'Admins' },
                            { key: 'manager', label: 'Managers' },
                            { key: 'editor', label: 'Editors' },
                        ].map(({ key, label }) => (
                            <button
                                key={key}
                                type="button"
                                onClick={() => setRoleFilter(key)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                                    roleFilter === key
                                        ? 'bg-rose-100 text-rose-800 border border-rose-300 font-bold'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-transparent'
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-72">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name, email, role..."
                            className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
                        />
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-xs">
                    <table className="w-full text-left text-xs text-gray-600">
                        <thead className="bg-gray-50/80 text-gray-700 font-bold border-b border-gray-200 uppercase tracking-wider text-[11px]">
                            <tr>
                                <th className="p-4 w-12">User</th>
                                <th className="p-4">Name / Username</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Role & Permissions</th>
                                <th className="p-4">Registered</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-400">
                                        No users found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((u) => {
                                    const badge = getRoleBadge(u.role);
                                    const BadgeIcon = badge.icon;

                                    return (
                                        <tr key={u.id} className="hover:bg-gray-50/60 transition-colors">
                                            <td className="p-4">
                                                <div className="w-10 h-10 rounded-full bg-rose-50 overflow-hidden border border-rose-200 flex items-center justify-center font-bold text-rose-900">
                                                    <img
                                                        src={u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=800038&color=fff`}
                                                        alt={u.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="font-bold text-gray-900 text-sm">{u.name}</div>
                                                <div className="text-[11px] text-gray-400 font-mono">@{u.username || 'user'}</div>
                                            </td>
                                            <td className="p-4 font-mono text-gray-600">{u.email}</td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${badge.bg}`}>
                                                    <BadgeIcon size={13} />
                                                    <span>{badge.label}</span>
                                                </span>
                                            </td>
                                            <td className="p-4 text-gray-400">
                                                {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'Active'}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="inline-flex items-center gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleOpenEdit(u)}
                                                        className="p-1.5 text-gray-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                                        title="Edit User & Permissions"
                                                    >
                                                        <Edit3 size={15} />
                                                    </button>

                                                    {u.email !== 'info@techdentalcare.com' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(u.id, u.email)}
                                                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                                                            title="Delete User"
                                                        >
                                                            <Trash2 size={15} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* MODAL 1: ADD USER */}
                {isAddUserOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
                        <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4 border border-gray-100">
                            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                                <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                                    <UserPlus size={18} className="text-rose-600" />
                                    <span>Create New User & Set Access</span>
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setIsAddUserOpen(false)}
                                    className="text-gray-400 hover:text-gray-700 cursor-pointer"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <form onSubmit={handleAddSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. Dr. Sabrina Khan"
                                            value={addForm.data.name}
                                            onChange={(e) => addForm.setData('name', e.target.value)}
                                            className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-rose-500 focus:outline-none"
                                        />
                                        {addForm.errors.name && <span className="text-red-500 text-[11px]">{addForm.errors.name}</span>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">Username</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. sabrina"
                                            value={addForm.data.username}
                                            onChange={(e) => addForm.setData('username', e.target.value)}
                                            className="w-full text-xs font-mono border border-gray-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-rose-500 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Email Address *</label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="sabrina@techdentalcare.com"
                                        value={addForm.data.email}
                                        onChange={(e) => addForm.setData('email', e.target.value)}
                                        className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-rose-500 focus:outline-none"
                                    />
                                    {addForm.errors.email && <span className="text-red-500 text-[11px]">{addForm.errors.email}</span>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Password *</label>
                                    <input
                                        type="password"
                                        required
                                        placeholder="At least 6 characters"
                                        value={addForm.data.password}
                                        onChange={(e) => addForm.setData('password', e.target.value)}
                                        className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-rose-500 focus:outline-none"
                                    />
                                    {addForm.errors.password && <span className="text-red-500 text-[11px]">{addForm.errors.password}</span>}
                                </div>

                                {/* Role Selection */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-2">
                                        Assign User Access Role *
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { role: 'Administrator', label: 'Admin', desc: 'Full System', color: 'rose' },
                                            { role: 'Manager', label: 'Manager', desc: 'Operations', color: 'purple' },
                                            { role: 'Editor', label: 'Editor', desc: 'Content Only', color: 'blue' },
                                        ].map(item => (
                                            <div
                                                key={item.role}
                                                onClick={() => addForm.setData('role', item.role)}
                                                className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                                                    addForm.data.role === item.role
                                                        ? 'bg-rose-50/80 border-rose-500 ring-2 ring-rose-500/20'
                                                        : 'border-gray-200 hover:bg-gray-50'
                                                }`}
                                            >
                                                <div className="font-bold text-xs text-gray-900">{item.label}</div>
                                                <div className="text-[10px] text-gray-500 mt-0.5">{item.desc}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddUserOpen(false)}
                                        className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={addForm.processing}
                                        className="bg-[#800038] hover:bg-[#990044] text-white px-5 py-2 rounded-xl text-xs font-bold transition cursor-pointer disabled:opacity-50"
                                    >
                                        {addForm.processing ? 'Creating...' : 'Create User'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* MODAL 2: EDIT USER */}
                {editingUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
                        <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4 border border-gray-100">
                            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                                <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                                    <Edit3 size={18} className="text-rose-600" />
                                    <span>Edit User: {editingUser.name}</span>
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setEditingUser(null)}
                                    className="text-gray-400 hover:text-gray-700 cursor-pointer"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <form onSubmit={handleEditSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={editForm.data.name}
                                            onChange={(e) => editForm.setData('name', e.target.value)}
                                            className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-rose-500 focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">Username</label>
                                        <input
                                            type="text"
                                            value={editForm.data.username}
                                            onChange={(e) => editForm.setData('username', e.target.value)}
                                            className="w-full text-xs font-mono border border-gray-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-rose-500 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Email Address *</label>
                                    <input
                                        type="email"
                                        required
                                        value={editForm.data.email}
                                        onChange={(e) => editForm.setData('email', e.target.value)}
                                        className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-rose-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">
                                        Reset Password (Optional)
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="Leave blank to keep existing password"
                                        value={editForm.data.password}
                                        onChange={(e) => editForm.setData('password', e.target.value)}
                                        className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-rose-500 focus:outline-none"
                                    />
                                    <p className="text-[10px] text-gray-400 mt-1">
                                        Enter a new password only if you wish to reset it for this user.
                                    </p>
                                </div>

                                {/* Role Selection */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-2">
                                        Change Access Role *
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { role: 'Administrator', label: 'Admin', desc: 'Full System' },
                                            { role: 'Manager', label: 'Manager', desc: 'Operations' },
                                            { role: 'Editor', label: 'Editor', desc: 'Content Only' },
                                        ].map(item => (
                                            <div
                                                key={item.role}
                                                onClick={() => editForm.setData('role', item.role)}
                                                className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                                                    editForm.data.role === item.role
                                                        ? 'bg-rose-50/80 border-rose-500 ring-2 ring-rose-500/20'
                                                        : 'border-gray-200 hover:bg-gray-50'
                                                }`}
                                            >
                                                <div className="font-bold text-xs text-gray-900">{item.label}</div>
                                                <div className="text-[10px] text-gray-500 mt-0.5">{item.desc}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setEditingUser(null)}
                                        className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={editForm.processing}
                                        className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2 rounded-xl text-xs font-bold transition cursor-pointer disabled:opacity-50"
                                    >
                                        {editForm.processing ? 'Saving...' : 'Save User Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
