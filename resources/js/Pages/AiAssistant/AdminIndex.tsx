import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
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
    HelpCircle,
    GraduationCap,
    BookOpen,
    Zap,
    Send,
    Terminal,
    AlertCircle,
    Check,
    Loader2
} from 'lucide-react';

const DEFAULT_TRAINING_TEMPLATE = `[প্রতিষ্ঠান পরিচিতি]
প্রতিষ্ঠান: টেক ডেন্টাল কেয়ার (Tech Dental Care)
হটলাইন: 01400786162
ওয়েবসাইট: techdentalcare.com
রোগী দেখার সময়সূচী: প্রতিদিন সকাল ১০:০০ টা থেকে রাত ৯:০০ টা পর্যন্ত (শুক্রবার সাপ্তাহিক ছুটি)।

[শাখাসমূহ ও লোকেশন]
১. মিরপুর শাখা: ৮২৭ (২য় তলা), শেওড়াপাড়া, বেগম রোকেয়া সরণি, ঢাকা (মেট্রোরেল ৩১৮ নং পিলারের পূর্ব পাশে)। ফোন: 01400786162
২. উত্তরা শাখা: হাউস ১৮, রোড ১৪, সেক্টর ৩, উত্তরা, ঢাকা। ফোন: 01400786162
৩. বাড্ডা শাখা: হাজী আব্দুর রশিদ ম্যানশন (৩য় তলা), উত্তর বাড্ডা বাজার, ঢাকা। ফোন: 01400786162
৪. যাত্রাবাড়ী শাখা: শহীদ ফারুক রোড, দক্ষিণ যাত্রাবাড়ী, ঢাকা। ফোন: 01400786162

[চিকিৎসা সেবা ও আনুমানিক খরচ তালিকা]
• ডেন্টাল স্কেলিং ও পলিশিং (দাঁত পরিষ্কার): ১,০০০ - ২,০০০ টাকা
• রুট ক্যানেল ট্রিটমেন্ট (RCT): ৩,৫০০ - ৫,৫০০ টাকা (দাঁতের অবস্থা ভেদে)
• ডেন্টাল ক্যাপ / ক্রাউন (পোরসেলিন / জিরকোনিয়া): ৩,০০০ - ১০,০০০ টাকা
• দাঁত তোলা (Simple & Surgical Extraction): ১,০০০ - ৪,০০০ টাকা
• দাঁত ফিলিং (Composite / Laser Filling): ১,০০০ - ২,৫০০ টাকা
• ডেন্টাল ইমপ্ল্যান্ট (স্থায়ী কৃত্রিম দাঁত): ৩৫,০০০ - ৬০,০০০ টাকা
• অর্থোডন্টিক ব্রেসেস ও ক্লিয়ার অ্যালাইনার্স: ৬০,০০০ - ১,৫০,০০০ টাকা

[ক্লিনিকের বিশেষ সুবিধা ও পলিসি]
• আধুনিক ব্যথামুক্ত চিকিৎসা ও আন্তর্জাতিক মানের মাইক্রোস্কোপিক টেকনোলজি
• ওপিজি (OPG) ও আধুনিক ডিজিটাল এক্স-রে সুবিধা
• শতভাগ জীবাণুমুক্ত স্টেরিলাইজেশন প্রটোকল
• অনলাইনে অগ্রিম সিরিয়াল বুকিং ও ফ্রি ডেন্টাল চেকআপ পরামর্শ`;

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
    training_data?: string;
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
    const [activeTab, setActiveTab] = useState<'rules' | 'training' | 'gemini' | 'chips' | 'logs'>('rules');
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
    const initialModel = (!settings?.gemini_model || settings.gemini_model.includes('1.5') || settings.gemini_model.includes('2.0'))
        ? 'gemini-3.1-flash-lite'
        : settings.gemini_model;

    const [geminiForm, setGeminiForm] = useState({
        gemini_api_key: settings?.gemini_api_key || '',
        gemini_model: initialModel,
        gemini_enabled: Boolean(settings?.gemini_enabled),
        system_prompt: settings?.system_prompt || '',
        training_data: settings?.training_data || DEFAULT_TRAINING_TEMPLATE,
        fallback_reply: settings?.fallback_reply || '',
    });

    // Chips Form State
    const initialChips = useMemoChips(settings?.chips);
    const [chipsList, setChipsList] = useState<string[]>(initialChips);
    const [newChipInput, setNewChipInput] = useState('');

    // API Testing State
    const [testPrompt, setTestPrompt] = useState('Where are Tech Dental branches located and what is the cost of scaling?');
    const [isTesting, setIsTesting] = useState(false);
    const [dynamicModels, setDynamicModels] = useState<{ id: string; displayName: string }[]>([]);
    const [isFetchingModels, setIsFetchingModels] = useState(false);
    const [customModelMode, setCustomModelMode] = useState(false);
    const [testResult, setTestResult] = useState<{
        success: boolean;
        message: string;
        reply?: string;
        model?: string;
        latency_ms?: number;
        status_code?: number;
        raw_error?: any;
    } | null>(null);

    const handleFetchModels = async () => {
        const key = geminiForm.gemini_api_key.trim() || settings?.gemini_api_key?.trim();
        if (!key) {
            alert('Please enter your Google Gemini API Key first!');
            return;
        }

        setIsFetchingModels(true);
        try {
            const res = await axios.post('/ai-assistant/fetch-models', { gemini_api_key: key });
            if (res.data?.success && res.data.models?.length) {
                setDynamicModels(res.data.models);
                if (res.data.models[0]?.id) {
                    setGeminiForm((prev) => ({ ...prev, gemini_model: res.data.models[0].id }));
                }
                alert(`Successfully loaded ${res.data.models.length} active models from Google!`);
            } else {
                alert(res.data?.message || 'No models found.');
            }
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to load models from Google.');
        } finally {
            setIsFetchingModels(false);
        }
    };

    const handleRunApiTest = async () => {
        const keyToTest = geminiForm.gemini_api_key.trim() || settings?.gemini_api_key?.trim();
        if (!keyToTest) {
            alert('Please enter or save your Google Gemini API Key first!');
            return;
        }

        setIsTesting(true);
        setTestResult(null);

        try {
            const res = await axios.post('/ai-assistant/test-gemini', {
                gemini_api_key: keyToTest,
                gemini_model: geminiForm.gemini_model,
                prompt: testPrompt,
                training_data: geminiForm.training_data,
            });
            setTestResult(res.data);
            if (res.data?.model && res.data.model !== geminiForm.gemini_model) {
                setGeminiForm((prev) => ({ ...prev, gemini_model: res.data.model }));
            }
        } catch (err: any) {
            setTestResult({
                success: false,
                message: err.response?.data?.message || err.message || 'API test failed.',
                status_code: err.response?.status,
                raw_error: err.response?.data?.raw_error,
            });
        } finally {
            setIsTesting(false);
        }
    };

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
            action_label: 'Book Appointment',
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
        if (confirm(`Are you sure you want to delete the rule "${title}"?`)) {
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
                                Manage homepage chatbot keyword responses and Google Gemini AI API integration.
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
                            <span>View Live Homepage</span>
                            <ExternalLink size={14} />
                        </a>
                        <button
                            type="button"
                            onClick={openAddModal}
                            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-md flex items-center gap-1.5 cursor-pointer"
                        >
                            <Plus size={16} />
                            <span>New Keyword Rule</span>
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
                        <span>Keyword Rules ({rules.length})</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('training')}
                        className={`px-4 py-2.5 text-sm font-bold rounded-xl transition flex items-center gap-2 cursor-pointer ${
                            activeTab === 'training'
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                    >
                        <GraduationCap size={16} />
                        <span>Company Training Data (Knowledge Base)</span>
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
                        <span>Google Gemini API Settings</span>
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
                        <span>Suggested Questions ({chipsList.length})</span>
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
                        <span>Patient Search History ({logs.length})</span>
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
                                    placeholder="Search rules or keywords..."
                                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                                />
                            </div>

                            <div className="text-xs text-slate-500 font-medium">
                                Total <strong className="text-slate-900 font-bold">{filteredRules.length}</strong> keyword rules available (auto-replied when patient's query matches)
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
                                                        <span>Used: {rule.match_count} times</span>
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
                                                        title={rule.is_active ? 'Rule Active' : 'Rule Inactive'}
                                                    >
                                                        {rule.is_active ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditModal(rule)}
                                                        className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                                                        title="Edit Rule"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteRule(rule.id, rule.title)}
                                                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                                        title="Delete Rule"
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
                                                <span className="text-slate-500 font-medium">Action Button:</span>
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

                {/* TAB: COMPANY TRAINING DATA (KNOWLEDGE BASE) */}
                {activeTab === 'training' && (
                    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm max-w-4xl space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                            <div>
                                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                                    <GraduationCap className="text-blue-600" size={22} />
                                    <span>Company Training Data & Knowledge Base</span>
                                </h3>
                                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                                    Store all clinic information here (branches, doctors, services, fee schedule, discounts, rules). Gemini AI will automatically learn this data to accurately answer patient questions.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    if (confirm('Do you want to load the default Tech Dental clinic template?')) {
                                        setGeminiForm({ ...geminiForm, training_data: DEFAULT_TRAINING_TEMPLATE });
                                    }
                                }}
                                className="px-3.5 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer"
                            >
                                <Sparkles size={14} />
                                <span>Load Clinic Template</span>
                            </button>
                        </div>

                        <form onSubmit={handleSaveGemini} className="space-y-6">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
                                        <span>Detailed Training Text / Knowledge Base</span>
                                        <span className="text-[11px] font-normal text-slate-400">
                                            (You can write in Bengali or English)
                                        </span>
                                    </label>
                                    <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                                        {(geminiForm.training_data || '').length} characters
                                    </span>
                                </div>

                                <textarea
                                    rows={18}
                                    value={geminiForm.training_data}
                                    onChange={(e) => setGeminiForm({ ...geminiForm, training_data: e.target.value })}
                                    className="w-full p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-sans leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 transition shadow-inner"
                                    placeholder="Enter your detailed clinic information here, e.g.:
1. Branches and addresses
2. Treatments and estimated costs (scaling, root canal, crown, implants, etc.)
3. Doctor schedules and visit policies
4. Hotline & helpline numbers..."
                                />
                            </div>

                            <div className="bg-sky-50 border border-sky-200/70 rounded-xl p-4 text-xs text-sky-900 leading-relaxed flex items-start gap-3">
                                <Sparkles className="text-sky-600 shrink-0 mt-0.5" size={18} />
                                <div>
                                    <strong className="font-bold">Tip: </strong>
                                    The more clear and detailed information you provide (treatment costs, branch locations, doctor hours), the more precise and professional the AI's responses will be.
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    type="submit"
                                    className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer text-sm"
                                >
                                    <Save size={18} />
                                    <span>Save Training Data</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('gemini')}
                                    className="px-5 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer text-sm"
                                >
                                    <Zap size={16} className="text-yellow-400" />
                                    <span>Test Live AI</span>
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* TAB 2: GEMINI API SETTINGS & LIVE TEST CONSOLE */}
                {activeTab === 'gemini' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start max-w-6xl">
                        
                        {/* LEFT: SETTINGS FORM */}
                        <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-6">
                            <div className="border-b border-slate-100 pb-4">
                                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                                    <Sparkles className="text-blue-600" size={18} />
                                    <span>Google Gemini API Configuration</span>
                                </h3>
                                <p className="text-xs text-slate-500 mt-1">
                                    When Gemini AI is enabled, the chatbot provides intelligent answers for any queries beyond the preset keywords.
                                </p>
                            </div>

                            <form onSubmit={handleSaveGemini} className="space-y-5">
                                {/* Toggle Gemini */}
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-sm">Enable Google Gemini AI</h4>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            AI assistant will remain active for answering general patient queries.
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
                                            <span>Get Free API Key</span>
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
                                    <p className="text-[11px] text-slate-500 mt-1">
                                        Copy your free Gemini API Key from Google AI Studio (<a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-blue-600 underline font-semibold">aistudio.google.com/app/apikey</a>) and paste it here (usually starts with <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded font-mono">AIzaSy...</code>).
                                    </p>
                                </div>

                                {/* Gemini Model */}
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                            <span>Gemini Model</span>
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={handleFetchModels}
                                                disabled={isFetchingModels}
                                                className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition cursor-pointer"
                                                title="Fetch active models available in your Google account"
                                            >
                                                <Sparkles size={12} className={isFetchingModels ? 'animate-spin' : ''} />
                                                <span>{isFetchingModels ? 'Loading...' : 'Fetch Live Models'}</span>
                                            </button>
                                            <span className="text-slate-300">|</span>
                                            <button
                                                type="button"
                                                onClick={() => setCustomModelMode(!customModelMode)}
                                                className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 underline transition cursor-pointer"
                                            >
                                                {customModelMode ? 'Select from list' : 'Custom model name'}
                                            </button>
                                        </div>
                                    </div>

                                    {customModelMode ? (
                                        <input
                                            type="text"
                                            value={geminiForm.gemini_model}
                                            onChange={(e) => setGeminiForm({ ...geminiForm, gemini_model: e.target.value.trim() })}
                                            placeholder="e.g. gemini-3.5-flash-lite or gemini-3-flash"
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white font-mono"
                                        />
                                    ) : (
                                        <select
                                            value={geminiForm.gemini_model}
                                            onChange={(e) => setGeminiForm({ ...geminiForm, gemini_model: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white font-medium"
                                        >
                                            {dynamicModels.length > 0 && (
                                                <optgroup label="Active Google Account Models">
                                                    {dynamicModels.map((m) => (
                                                        <option key={m.id} value={m.id}>
                                                            {m.displayName} ({m.id})
                                                        </option>
                                                    ))}
                                                </optgroup>
                                            )}

                                            <option value="gemini-3.6-flash">Gemini 3.6 Flash (Fastest & Recommended)</option>
                                            <option value="gemini-3.5-flash">Gemini 3.5 Flash</option>
                                            <option value="gemini-3.5-flash-lite">Gemini 3.5 Flash-Lite</option>
                                            <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro Preview</option>
                                            <option value="gemini-3.1-flash-lite">Gemini 3.1 Flash-Lite</option>
                                            <option value="gemini-3-flash-preview">Gemini 3 Flash Preview</option>
                                            <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
                                            <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                                            <option value="gemini-2.5-flash-lite">Gemini 2.5 Flash-lite</option>
                                        </select>
                                    )}
                                    <p className="text-[11px] text-slate-400 mt-1">
                                        Select your preferred model as shown in Google AI Studio.
                                    </p>
                                </div>

                                {/* System Prompt / Context Instructions */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                                        System Instructions / Clinic Context
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={geminiForm.system_prompt}
                                        onChange={(e) => setGeminiForm({ ...geminiForm, system_prompt: e.target.value })}
                                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white leading-relaxed font-sans"
                                        placeholder="You are Tech Dental's friendly clinic assistant..."
                                    />
                                    <p className="text-[11px] text-slate-400 mt-1">
                                        Define instructions, tone, and clinic policies for Gemini to adhere to when answering.
                                    </p>
                                </div>

                                {/* Fallback Message */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                                        Default Fallback Response
                                    </label>
                                    <textarea
                                        rows={2}
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
                                    <span>Save Settings</span>
                                </button>
                            </form>
                        </div>

                        {/* RIGHT: LIVE TEST CONSOLE */}
                        <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 rounded-2xl p-6 text-white border border-slate-800 shadow-xl space-y-5">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                                        <Zap size={18} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm sm:text-base text-white">Live API Test Console</h3>
                                        <p className="text-[11px] text-slate-400">Verify if the API connects and responds properly</p>
                                    </div>
                                </div>
                                <span className={`w-2.5 h-2.5 rounded-full ${testResult?.success ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`}></span>
                            </div>

                            {/* Test Prompt Input */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                                    <span>Enter test prompt:</span>
                                    <span className="text-[10px] text-slate-400 font-mono">Model: {geminiForm.gemini_model}</span>
                                </label>
                                <div className="relative">
                                    <textarea
                                        rows={3}
                                        value={testPrompt}
                                        onChange={(e) => setTestPrompt(e.target.value)}
                                        placeholder="Type any test query here..."
                                        className="w-full p-3 bg-slate-800/90 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Sample Question Quick Chips */}
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    <span className="text-[10px] text-slate-400 self-center">Examples:</span>
                                    {[
                                        'Where are your branches located?',
                                        'What is the cost of dental scaling?',
                                        'How do I book an appointment?',
                                    ].map((q, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => setTestPrompt(q)}
                                            className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] rounded-md transition cursor-pointer border border-slate-700/60"
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Test Action Button */}
                            <button
                                type="button"
                                onClick={handleRunApiTest}
                                disabled={isTesting}
                                className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-md ${
                                    isTesting
                                        ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white hover:shadow-blue-500/25'
                                }`}
                            >
                                {isTesting ? (
                                    <>
                                        <Loader2 className="animate-spin" size={16} />
                                        <span>Testing Gemini API...</span>
                                    </>
                                ) : (
                                    <>
                                        <Zap size={16} />
                                        <span>Test API Connection (Test Now)</span>
                                    </>
                                )}
                            </button>

                            {/* Result Display Area */}
                            {testResult && (
                                <div
                                    className={`p-4 rounded-xl border text-xs transition-all space-y-2.5 ${
                                        testResult.success
                                            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-100'
                                            : 'bg-rose-950/40 border-rose-500/40 text-rose-100'
                                    }`}
                                >
                                    <div className="flex items-center justify-between font-bold">
                                        <div className="flex items-center gap-1.5">
                                            {testResult.success ? (
                                                <>
                                                    <CheckCircle2 size={16} className="text-emerald-400" />
                                                    <span className="text-emerald-400">Connection Successful!</span>
                                                </>
                                            ) : (
                                                <>
                                                    <AlertCircle size={16} className="text-rose-400" />
                                                    <span className="text-rose-400">Connection Failed</span>
                                                </>
                                            )}
                                        </div>

                                        {testResult.latency_ms && (
                                            <span className="text-[10px] font-mono bg-slate-900/80 px-2 py-0.5 rounded text-slate-300 border border-slate-700">
                                                ⚡ {testResult.latency_ms} ms
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-[11px] leading-relaxed opacity-90">
                                        {testResult.message}
                                    </p>

                                    {testResult.reply && (
                                        <div className="mt-2 p-3 bg-slate-900/90 rounded-lg border border-slate-700/80 font-sans text-xs text-slate-200 leading-relaxed max-h-48 overflow-y-auto">
                                            <div className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1">
                                                Gemini Live Response:
                                            </div>
                                            {testResult.reply}
                                        </div>
                                    )}

                                    {!testResult.success && testResult.raw_error && (
                                        <div className="mt-2 p-2.5 bg-rose-950/80 rounded border border-rose-800 text-[11px] font-mono text-rose-200 max-h-32 overflow-y-auto">
                                            {JSON.stringify(testResult.raw_error, null, 2)}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Help / Guidance Box */}
                            <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                                💡 <strong className="text-slate-300">Note:</strong> Clicking the test button sends a direct live request to Google servers using the form's API key and model. Any connection error details will be shown here.
                            </div>
                        </div>

                    </div>
                )}

                {/* TAB 3: SUGGESTED CHIPS */}
                {activeTab === 'chips' && (
                    <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm max-w-2xl space-y-6">
                        <div>
                            <h3 className="font-bold text-slate-900 text-base mb-1">
                                Suggested Questions Above Homepage Search Box
                            </h3>
                            <p className="text-xs text-slate-500">
                                Preset quick-action query chips shown above the homepage chatbot input for one-click answers:
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
                                        title="Remove"
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
                                placeholder="Enter new question (e.g. Cost of dental implants)..."
                                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                            />
                            <button
                                type="submit"
                                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition shadow-sm flex items-center gap-1.5 cursor-pointer shrink-0"
                            >
                                <Plus size={16} />
                                <span>Add Question</span>
                            </button>
                        </form>
                    </div>
                )}

                {/* TAB 4: VISITOR CHAT LOGS */}
                {activeTab === 'logs' && (
                    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="font-bold text-slate-900 text-base">
                                Recent Patient Queries
                            </h3>
                            <span className="text-xs text-slate-500">Last 50 searches stored</span>
                        </div>

                        <div className="divide-y divide-slate-100">
                            {logs.length === 0 ? (
                                <div className="p-8 text-center text-slate-400 text-sm">
                                    No patient queries recorded yet.
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
                                            <div>{log.created_at ? new Date(log.created_at).toLocaleString('en-US') : ''}</div>
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
                                {editingRule ? 'Edit Keyword Rule' : 'Add New Keyword Rule'}
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
                                    Rule Title
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={ruleForm.title}
                                    onChange={(e) => setRuleForm({ ...ruleForm, title: e.target.value })}
                                    placeholder="e.g. Tooth Gap Closing Treatment"
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-slate-800 mb-1">
                                    Trigger Keywords (Comma Separated)
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={ruleForm.keywords}
                                    onChange={(e) => setRuleForm({ ...ruleForm, keywords: e.target.value })}
                                    placeholder="gap, braces, alignment, clip, ফাঁকা"
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white font-mono text-xs"
                                />
                                <p className="text-[11px] text-slate-400 mt-1">
                                    If the patient mentions any of these keywords, this reply will be presented.
                                </p>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-800 mb-1">
                                    Reply Message
                                </label>
                                <textarea
                                    rows={5}
                                    required
                                    value={ruleForm.reply}
                                    onChange={(e) => setRuleForm({ ...ruleForm, reply: e.target.value })}
                                    placeholder="Write the response that will be shown to the patient..."
                                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white leading-relaxed"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-800 mb-1">
                                        Action Button Type
                                    </label>
                                    <select
                                        value={ruleForm.action_type}
                                        onChange={(e) => setRuleForm({ ...ruleForm, action_type: e.target.value })}
                                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                                    >
                                        <option value="none">No Button</option>
                                        <option value="appointment">Online Appointment Booking (/appointment)</option>
                                        <option value="directions">Branch Map / Directions</option>
                                        <option value="call">Direct Call (Hotline)</option>
                                        <option value="whatsapp">WhatsApp Chat</option>
                                        <option value="custom_link">Custom Link</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-800 mb-1">
                                        Button Label
                                    </label>
                                    <input
                                        type="text"
                                        value={ruleForm.action_label}
                                        onChange={(e) => setRuleForm({ ...ruleForm, action_label: e.target.value })}
                                        placeholder="Book Appointment"
                                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-800 mb-1">
                                    Priority (Higher number matches first)
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
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-sm cursor-pointer"
                                >
                                    {editingRule ? 'Update Rule' : 'Save Rule'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

