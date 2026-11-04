import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Bot,
    Plus,
    Search,
    Edit2,
    Trash2,
    CheckCircle2,
    XCircle,
    Key,
    Sparkles,
    Settings,
    MessageSquare,
    Save,
    X,
    Eye,
    EyeOff,
    ExternalLink,
    Clock,
    Hash,
    HelpCircle
} from 'lucide-react';

interface RuleItem {
    id: number;
    title: string;
    keywords: string;
    reply: string;
    icon: string;
    icon_color: string;
    icon_bg: string;
    action_type: string;
    action_label?: string;
    action_url?: string;
    is_active: boolean;
    priority: number;
    match_count: number;
    created_at?: string;
}

interface ChatSettings {
    id?: number;
    gemini_api_key?: string;
    gemini_model?: string;
    gemini_enabled?: boolean;
    system_prompt?: string;
    chips?: string | string[];
    fallback_reply?: string;
}

interface ChatLogItem {
    id: number;
    user_query: string;
    reply?: string;
    matched_rule_id?: number;
    source: string;
    ip_address?: string;
    created_at: string;
}

interface Props {
    settings: ChatSettings;
    rules: RuleItem[];
    logs: ChatLogItem[];
}

export default function AiAssistantAdminIndex({ settings, rules = [], logs = [] }: Props) {
    const [activeTab, setActiveTab] = useState<'rules' | 'gemini' | 'chips' | 'logs'>('rules');
    const [searchQuery, setSearchQuery] = useState('');

    // Rule Modal State
    const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
    const [editingRule, setEditingRule] = useState<RuleItem | null>(null);
    const [ruleForm, setRuleForm] = useState({
        title: '',
        keywords: '',
        reply: '',
        action_type: 'none',
        action_label: '',
        action_url: '',
        priority: 0,
    });

    // Gemini Settings Form State
    const [showApiKey, setShowApiKey] = useState(false);
    const [geminiForm, setGeminiForm] = useState({
        gemini_api_key: settings?.gemini_api_key || '',
        gemini_model: settings?.gemini_model || 'gemini-1.5-flash',
        gemini_enabled: Boolean(settings?.gemini_enabled),
        system_prompt: settings?.system_prompt || '',
        fallback_reply: settings?.fallback_reply || '',
    });

    // Chips Form State
    const initialChips = useMemoChips(settings?.chips);
    const [chipsList, setChipsList] = useState<string[]>(initialChips);
    const [newChipInput, setNewChipInput] = useState('');

    function useMemoChips(raw: any): string[] {
        if (Array.isArray(raw)) return raw;
        if (typeof raw === 'string') {
            try {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) return parsed;
            } catch (e) {
                return raw.split(',').map((s) => s.trim()).filter(Boolean);
            }
        }
        return ['শাখার ঠিকানা কোথায়?', 'ফাঁকা দাঁতের চিকিৎসা', 'দাঁত ব্যথার চিকিৎসা'];
    }

    // Filter Rules
    const filteredRules = rules.filter((r) =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.keywords.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.reply.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Open Modal for Add
    const openAddModal = () => {
        setEditingRule(null);
        setRuleForm({
            title: '',
            keywords: '',
            reply: '',
            action_type: 'appointment',
            action_label: 'সিরিয়াল বুক করুন',
            action_url: '/appointment',
            priority: 0,
        });
        setIsRuleModalOpen(true);
    };

    // Open Modal for Edit
    const openEditModal = (rule: RuleItem) => {
        setEditingRule(rule);
        setRuleForm({
            title: rule.title,
            keywords: rule.keywords,
            reply: rule.reply,
            action_type: rule.action_type || 'none',
            action_label: rule.action_label || '',
            action_url: rule.action_url || '',
            priority: rule.priority || 0,
        });
        setIsRuleModalOpen(true);
    };

    // Save Rule Submit
    const handleRuleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingRule) {
            router.put(`/ai-assistant/rules/${editingRule.id}`, ruleForm, {
                onSuccess: () => setIsRuleModalOpen(false),
            });
        } else {
            router.post('/ai-assistant/rules', ruleForm, {
                onSuccess: () => setIsRuleModalOpen(false),
            });
        }
    };

    // Delete Rule
    const handleDeleteRule = (id: number, title: string) => {
        if (confirm(`আপনি কি "${title}" রুলটি মুছে ফেলতে চান?`)) {
            router.delete(`/ai-assistant/rules/${id}`);
        }
    };

    // Toggle Rule Status
    const handleToggleRule = (id: number) => {
        router.post(`/ai-assistant/rules/${id}/toggle`);
    };

    // Save Gemini Settings
    const handleSaveGemini = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/ai-assistant/settings', {
            ...geminiForm,
            chips: chipsList,
        });
    };

    // Add Chip
    const handleAddChip = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = newChipInput.trim();
        if (trimmed && !chipsList.includes(trimmed)) {
            const next = [...chipsList, trimmed];
            setChipsList(next);
            setNewChipInput('');
            router.post('/ai-assistant/settings', {
                ...geminiForm,
                chips: next,
            });
        }
    };

    // Remove Chip
    const handleRemoveChip = (indexToRemove: number) => {
        const next = chipsList.filter((_, idx) => idx !== indexToRemove);
        setChipsList(next);
        router.post('/ai-assistant/settings', {
            ...geminiForm,
            chips: next,
        });
    };

    return (
        <AdminLayout>
            <Head title="AI Chat Assistant - Admin Management" />

            <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6">
                
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-[#1e293b] via-[#0f172a] to-[#1e1b4b] rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-700/60">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                            <Bot size={28} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl md:text-2xl font-bold tracking-tight">AI Chat Assistant</h1>
                                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                                    settings?.gemini_enabled ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                }`}>
                                    {settings?.gemini_enabled ? '● Gemini AI Active' : '○ Keyword Match Only'}
                                </span>
                            </div>
                            <p className="text-sm text-slate-300 mt-1">
                                হোমপেজের চ্যাটবক্সের কিওয়ার্ড উত্তর ও Google Gemini AI API ইন্টিগ্রেশন ম্যানেজ করুন।
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 border border-white/15"
                        >
                            <span>লাইভ হোমপেজে দেখুন</span>
                            <ExternalLink size={14} />
                        </a>
                        <button
                            type="button"
                            onClick={openAddModal}
                            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-md flex items-center gap-1.5 cursor-pointer"
                        >
                            <Plus size={16} />
                            <span>নতুন কিওয়ার্ড রুল</span>
                        </button>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
                    <button
                        type="button"
                        onClick={() => setActiveTab('rules')}
                        className={`px-4 py-2.5 text-sm font-bold rounded-xl transition flex items-center gap-2 cursor-pointer ${
                            activeTab === 'rules'
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                    >
                        <Hash size={16} />
                        <span>কিওয়ার্ড রুলসমূহ ({rules.length})</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('gemini')}
                        className={`px-4 py-2.5 text-sm font-bold rounded-xl transition flex items-center gap-2 cursor-pointer ${
                            activeTab === 'gemini'
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                    >
                        <Sparkles size={16} />
                        <span>Google Gemini API সেটিংস</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('chips')}
                        className={`px-4 py-2.5 text-sm font-bold rounded-xl transition flex items-center gap-2 cursor-pointer ${
                            activeTab === 'chips'
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                    >
                        <HelpCircle size={16} />
                        <span>সাজেস্টেড প্রশ্নমালা ({chipsList.length})</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('logs')}
                        className={`px-4 py-2.5 text-sm font-bold rounded-xl transition flex items-center gap-2 cursor-pointer ${
                            activeTab === 'logs'
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                    >
                        <Clock size={16} />
                        <span>রোগীদের সার্চ হিস্ট্রি ({logs.length})</span>
                    </button>
                </div>

                {/* TAB 1: KEYWORD RULES */}
                {activeTab === 'rules' && (
                    <div className="space-y-4">
                        {/* Search Bar & Stats */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
                            <div className="relative w-full sm:w-80">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="রুল বা কিওয়ার্ড খুঁজুন..."
                                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                                />
                            </div>

                            <div className="text-xs text-slate-500 font-medium">
                                মোট <strong className="text-slate-900 font-bold">{filteredRules.length}</strong> টি কিওয়ার্ড রুল রয়েছে (রোগীর প্রশ্ন ম্যাচ করলে সরাসরি এই উত্তর দেখানো হবে)
                            </div>
                        </div>

                        {/* Rules List Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredRules.map((rule) => {
                                const kwArray = rule.keywords.split(',').map((k) => k.trim()).filter(Boolean);
                                return (
                                    <div
                                        key={rule.id}
                                        className={`bg-white rounded-2xl p-5 border transition-all shadow-sm hover:shadow-md flex flex-col justify-between ${
                                            rule.is_active ? 'border-slate-200' : 'border-slate-200/60 opacity-60 bg-slate-50'
                                        }`}
                                    >
                                        <div>
                                            {/* Top Row: Title & Action buttons */}
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <div>
                                                    <h3 className="font-bold text-slate-900 text-base leading-snug">
                                                        {rule.title}
                                                    </h3>
                                                    <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                                                        <span>Priority: {rule.priority}</span>
                                                        <span>•</span>
                                                        <span>ব্যবহার হয়েছে: {rule.match_count} বার</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-1.5 shrink-0">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleToggleRule(rule.id)}
                                                        className={`p-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                                                            rule.is_active
                                                                ? 'text-emerald-600 hover:bg-emerald-50'
                                                                : 'text-slate-400 hover:bg-slate-200'
                                                        }`}
                                                        title={rule.is_active ? 'রুল সক্রিয় (Active)' : 'রুল নিষ্ক্রিয় (Inactive)'}
                                                    >
                                                        {rule.is_active ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditModal(rule)}
                                                        className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                                                        title="সম্পাদনা করুন"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteRule(rule.id, rule.title)}
                                                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                                        title="মুছে ফেলুন"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Keywords Pills */}
                                            <div className="flex flex-wrap gap-1.5 my-3">
                                                {kwArray.map((kw, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/70"
                                                    >
                                                        {kw}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Reply Preview */}
                                            <div className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 whitespace-pre-line line-clamp-4">
                                                {rule.reply}
                                            </div>
                                        </div>

                                        {/* Bottom Action Button info */}
                                        {rule.action_label && (
                                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                                                <span className="text-slate-500 font-medium">অ্যাকশন বাটন:</span>
                                                <span className="font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                                                    {rule.action_label} ({rule.action_url || rule.action_type})
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* TAB 2: GEMINI API SETTINGS */}
                {activeTab === 'gemini' && (
                    <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm max-w-3xl">
                        <form onSubmit={handleSaveGemini} className="space-y-6">
                            
                            {/* Toggle Gemini */}
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm">Google Gemini AI সক্রিয় করুন</h4>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        যখন রোগীর প্রশ্ন কোনো কিওয়ার্ডের সাথে মিলবে না, তখন জেমিনি এআই বুদ্ধিমান উত্তর প্রদান করবে।
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={geminiForm.gemini_enabled}
                                        onChange={(e) => setGeminiForm({ ...geminiForm, gemini_enabled: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            {/* Gemini API Key */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                        <Key size={14} className="text-blue-600" />
                                        <span>Google Gemini API Key</span>
                                    </label>
                                    <a
                                        href="https://aistudio.google.com/app/apikey"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                                    >
                                        <span>ফ্রি API Key তৈরি করুন</span>
                                        <ExternalLink size={12} />
                                    </a>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showApiKey ? 'text' : 'password'}
                                        value={geminiForm.gemini_api_key}
                                        onChange={(e) => setGeminiForm({ ...geminiForm, gemini_api_key: e.target.value })}
                                        placeholder="AIzaSy..."
                                        className="w-full px-4 py-2.5 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white font-mono"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowApiKey(!showApiKey)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                <p className="text-[11px] text-slate-400 mt-1">
                                    গুগল এআই স্টুডিও থেকে ফ্রি Gemini API Key কপি করে এখানে বসিয়ে দিন।
                                </p>
                            </div>

                            {/* Gemini Model */}
                            <div>
                                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                                    Gemini Model
                                </label>
                                <select
                                    value={geminiForm.gemini_model}
                                    onChange={(e) => setGeminiForm({ ...geminiForm, gemini_model: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                                >
                                    <option value="gemini-1.5-flash">gemini-1.5-flash (সবচেয়ে দ্রুত এবং নির্ভুল - Recommended)</option>
                                    <option value="gemini-2.0-flash">gemini-2.0-flash (লেটেস্ট দ্রুত মডেল)</option>
                                    <option value="gemini-1.5-pro">gemini-1.5-pro (গভীর ও বিস্তারিত উত্তরের জন্য)</option>
                                </select>
                            </div>

                            {/* System Prompt / Context Instructions */}
                            <div>
                                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                                    এআই অ্যাসিস্ট্যান্টের নির্দেশিকা (System Instructions / Clinic Context)
                                </label>
                                <textarea
                                    rows={4}
                                    value={geminiForm.system_prompt}
                                    onChange={(e) => setGeminiForm({ ...geminiForm, system_prompt: e.target.value })}
                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white leading-relaxed font-sans"
                                    placeholder="You are Tech Dental's friendly clinic assistant..."
                                />
                                <p className="text-[11px] text-slate-400 mt-1">
                                    এখানে আপনি আপনার ক্লিনিকের ঠিকানা, বিশেষজ্ঞ ডাক্তারদের সময়সূচি ও নীতি লিখে দিলে জেমিনি সবসময় সেই তথ্য অনুযায়ী উত্তর দেবে।
                                </p>
                            </div>

                            {/* Fallback Message */}
                            <div>
                                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                                    ডিফল্ট ফলব্যাক উত্তর (Fallback Message)
                                </label>
                                <textarea
                                    rows={3}
                                    value={geminiForm.fallback_reply}
                                    onChange={(e) => setGeminiForm({ ...geminiForm, fallback_reply: e.target.value })}
                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white leading-relaxed"
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <Save size={18} />
                                <span>সেটিংস সংরক্ষণ করুন</span>
                            </button>
                        </form>
                    </div>
                )}

                {/* TAB 3: SUGGESTED CHIPS */}
                {activeTab === 'chips' && (
                    <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm max-w-2xl space-y-6">
                        <div>
                            <h3 className="font-bold text-slate-900 text-base mb-1">
                                হোমপেজ সার্চবক্সের উপরের সাজেস্টেড প্রশ্নমালা
                            </h3>
                            <p className="text-xs text-slate-500">
                                হোমপেজে সার্চ বক্সের ওপরে রোগীরা যে বাটনগুলোতে ক্লিক করে দ্রুত উত্তর দেখতে পায়:
                            </p>
                        </div>

                        {/* List */}
                        <div className="space-y-2">
                            {chipsList.map((chip, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">
                                            {idx + 1}
                                        </span>
                                        <span>{chip}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveChip(idx)}
                                        className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition cursor-pointer"
                                        title="মুছে ফেলুন"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Add Chip Form */}
                        <form onSubmit={handleAddChip} className="flex gap-2">
                            <input
                                type="text"
                                value={newChipInput}
                                onChange={(e) => setNewChipInput(e.target.value)}
                                placeholder="নতুন প্রশ্ন লিখুন (যেমন: দাঁত বাঁধানোর খরচ)..."
                                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                            />
                            <button
                                type="submit"
                                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition shadow-sm flex items-center gap-1.5 cursor-pointer shrink-0"
                            >
                                <Plus size={16} />
                                <span>যুক্ত করুন</span>
                            </button>
                        </form>
                    </div>
                )}

                {/* TAB 4: VISITOR CHAT LOGS */}
                {activeTab === 'logs' && (
                    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="font-bold text-slate-900 text-base">
                                রোগীদের সাম্প্রতিক প্রশ্নসমূহ
                            </h3>
                            <span className="text-xs text-slate-500">সর্বশেষ ৫০টি সার্চ সংরক্ষিত</span>
                        </div>

                        <div className="divide-y divide-slate-100">
                            {logs.length === 0 ? (
                                <div className="p-8 text-center text-slate-400 text-sm">
                                    এখনও কোনো রোগী প্রশ্ন সাবমিট করেননি।
                                </div>
                            ) : (
                                logs.map((log) => (
                                    <div key={log.id} className="p-4 hover:bg-slate-50/80 transition flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs">
                                        <div className="space-y-1 max-w-2xl">
                                            <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                                                <span>&quot;{log.user_query}&quot;</span>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                    log.source === 'keyword' ? 'bg-blue-100 text-blue-700' : log.source === 'gemini' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                    {log.source === 'keyword' ? 'Keyword Match' : log.source === 'gemini' ? 'Gemini AI' : 'Fallback'}
                                                </span>
                                            </div>
                                            <div className="text-slate-600 line-clamp-2 leading-relaxed">
                                                {log.reply}
                                            </div>
                                        </div>

                                        <div className="text-slate-400 font-medium shrink-0 text-right">
                                            <div>{log.created_at ? new Date(log.created_at).toLocaleString('bn-BD') : ''}</div>
                                            <div className="text-[10px] text-slate-400">{log.ip_address}</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

            </div>

            {/* ADD / EDIT RULE MODAL */}
            {isRuleModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="font-bold text-slate-900 text-lg">
                                {editingRule ? 'কিওয়ার্ড রুল সম্পাদনা' : 'নতুন কিওয়ার্ড রুল যোগ করুন'}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsRuleModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 p-1"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleRuleSubmit} className="space-y-4 text-xs sm:text-sm">
                            <div>
                                <label className="block font-bold text-slate-800 mb-1">
                                    রুলের শিরোনাম (Title)
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={ruleForm.title}
                                    onChange={(e) => setRuleForm({ ...ruleForm, title: e.target.value })}
                                    placeholder="যেমন: দাঁতের ফাঁকা পূরণ"
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-slate-800 mb-1">
                                    ট্রিগার কিওয়ার্ডসমূহ (কমা দিয়ে আলাদা করুন)
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={ruleForm.keywords}
                                    onChange={(e) => setRuleForm({ ...ruleForm, keywords: e.target.value })}
                                    placeholder="ফাঁকা, gap, braces, ব্রেসেস, ক্লিপ"
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white font-mono text-xs"
                                />
                                <p className="text-[11px] text-slate-400 mt-1">
                                    রোগী বক্সে লেখার সময় এর যেকোনো একটি শব্দ থাকলেই এই উত্তরটি আসবে।
                                </p>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-800 mb-1">
                                    উত্তরের বিবরণ (Reply Message)
                                </label>
                                <textarea
                                    rows={5}
                                    required
                                    value={ruleForm.reply}
                                    onChange={(e) => setRuleForm({ ...ruleForm, reply: e.target.value })}
                                    placeholder="রোগীকে যে উত্তর দেখানো হবে তা সুন্দরভাবে লিখুন..."
                                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white leading-relaxed"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-800 mb-1">
                                        অ্যাকশন টাইপ (Action Type)
                                    </label>
                                    <select
                                        value={ruleForm.action_type}
                                        onChange={(e) => setRuleForm({ ...ruleForm, action_type: e.target.value })}
                                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                                    >
                                        <option value="none">কোনো বাটন নেই</option>
                                        <option value="appointment">অনলাইন সিরিয়াল বুকিং (/appointment)</option>
                                        <option value="directions">শাখার ম্যাপ / ডিরেকশন</option>
                                        <option value="call">সরাসরি কল (হটলাইন)</option>
                                        <option value="whatsapp">হোয়াটসঅ্যাপ চ্যাট</option>
                                        <option value="custom_link">কাস্টম লিংক</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-800 mb-1">
                                        বাটনের লেখা (Label)
                                    </label>
                                    <input
                                        type="text"
                                        value={ruleForm.action_label}
                                        onChange={(e) => setRuleForm({ ...ruleForm, action_label: e.target.value })}
                                        placeholder="সিরিয়াল বুক করুন"
                                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-800 mb-1">
                                    অগ্রাধিকার (Priority - বড় সংখ্যা আগে ম্যাচ হবে)
                                </label>
                                <input
                                    type="number"
                                    value={ruleForm.priority}
                                    onChange={(e) => setRuleForm({ ...ruleForm, priority: parseInt(e.target.value) || 0 })}
                                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                                />
                            </div>

                            <div className="pt-2 flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsRuleModalOpen(false)}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
                                >
                                    বাতিল
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-sm"
                                >
                                    {editingRule ? 'আপডেট করুন' : 'সংরক্ষণ করুন'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
