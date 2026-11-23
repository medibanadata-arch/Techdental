import React, { useState } from 'react';
import {
    Sparkles, Grid, Users, MessageSquare, Phone, HelpCircle,
    Image as ImageIcon, FileText, ChevronUp, ChevronDown, Trash2, Copy,
    Plus, Eye, Code, ChevronRight, Layers, Check, Layout, Play,
    Sliders, AlertCircle, Quote, ArrowRight, CheckCircle2, SplitSquareVertical,
    BarChart3, MapPin, DollarSign, ListOrdered, Minus, Search, X
} from 'lucide-react';
import { HOTLINE, HOTLINE_DISPLAY } from '@/utils/contact';

export type BlockType = 
    | 'hero' 
    | 'image'
    | 'feature_split'
    | 'before_after'
    | 'services' 
    | 'pricing_table'
    | 'doctors' 
    | 'testimonials' 
    | 'stats'
    | 'cta' 
    | 'faq' 
    | 'gallery' 
    | 'video'
    | 'rich_text'
    | 'alert'
    | 'quote'
    | 'steps'
    | 'location_card'
    | 'spacer'
    | 'embed';

export interface BlockItem {
    id: string;
    type: BlockType;
    data: any;
    collapsed?: boolean;
}

interface Props {
    blocks: BlockItem[];
    onChange: (blocks: BlockItem[]) => void;
}

// Convert Blocks to Beautiful Clean Tailwind HTML
export function compileBlocksToHtml(blocks: BlockItem[]): string {
    return blocks.map(block => {
        switch (block.type) {
            case 'hero':
                return `<!-- Hero Banner Block -->
<div class="bg-gradient-to-r from-slate-900 via-sky-950 to-indigo-950 text-white p-8 sm:p-12 rounded-3xl space-y-5 border border-sky-500/30 shadow-xl my-6">
    ${block.data.badge ? `<span class="px-3.5 py-1.5 bg-sky-500/20 text-sky-300 border border-sky-400/30 rounded-full text-xs font-bold uppercase tracking-wider inline-block">${block.data.badge}</span>` : ''}
    <h2 class="text-2xl sm:text-4xl font-black leading-tight text-white">${block.data.headline || 'Advanced Dental Care'}</h2>
    <p class="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">${block.data.subheading || ''}</p>
    ${block.data.button_label ? `<div class="pt-2"><a href="${block.data.button_url || '#appointment-sec'}" class="inline-flex items-center gap-2 px-6 py-3 bg-[#800038] hover:bg-[#990044] text-white font-bold text-sm rounded-xl shadow-lg transition-all">${block.data.button_label} →</a></div>` : ''}
</div>`;

            case 'image':
                const imgAlign = block.data.align === 'center' ? 'mx-auto text-center' : block.data.align === 'right' ? 'ml-auto text-right' : 'mr-auto text-left';
                return `<!-- Single Image Block -->
<div class="my-6 ${imgAlign} max-w-4xl">
    <div class="overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-slate-50 inline-block w-full">
        ${block.data.link ? `<a href="${block.data.link}" target="_blank" rel="noreferrer">` : ''}
            <img src="${block.data.image_url || 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80'}" alt="${block.data.alt || 'Clinic image'}" class="w-full h-auto max-h-[480px] object-cover hover:scale-[1.01] transition-transform duration-300" />
        ${block.data.link ? `</a>` : ''}
    </div>
    ${block.data.caption ? `<p class="text-xs text-slate-500 mt-2 font-medium italic">${block.data.caption}</p>` : ''}
</div>`;

            case 'feature_split':
                const isReversed = block.data.layout === 'image_right';
                return `<!-- Feature Split 50-50 Block -->
<div class="my-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-50/80 p-6 sm:p-10 rounded-3xl border border-slate-200">
    <div class="${isReversed ? 'order-2 md:order-2' : 'order-2 md:order-1'} space-y-4">
        ${block.data.badge ? `<span class="px-3 py-1 bg-rose-100 text-rose-800 text-xs font-bold uppercase rounded-full tracking-wider inline-block">${block.data.badge}</span>` : ''}
        <h3 class="text-2xl font-black text-slate-900 leading-tight">${block.data.headline || 'World-Class Dental Technology'}</h3>
        <p class="text-sm text-slate-600 leading-relaxed">${block.data.description || 'Providing modern computer-guided oral healthcare with maximum patient comfort.'}</p>
        ${block.data.bullets ? `
        <ul class="space-y-2 text-xs text-slate-700">
            ${block.data.bullets.split('\n').filter((b: string) => b.trim()).map((b: string) => `
            <li class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                <span>${b.trim()}</span>
            </li>`).join('')}
        </ul>` : ''}
        ${block.data.button_label ? `
        <div class="pt-2">
            <a href="${block.data.button_url || '#appointment'}" class="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#800038] hover:bg-[#990044] text-white font-bold text-xs rounded-xl shadow-sm transition">
                <span>${block.data.button_label}</span> →
            </a>
        </div>` : ''}
    </div>
    <div class="${isReversed ? 'order-1 md:order-1' : 'order-1 md:order-2'}">
        <div class="overflow-hidden rounded-2xl border border-slate-200 shadow-md">
            <img src="${block.data.image_url || 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80'}" alt="${block.data.headline || 'Feature'}" class="w-full h-72 sm:h-80 object-cover" />
        </div>
    </div>
</div>`;

            case 'before_after':
                return `<!-- Before & After Dental Comparison Block -->
<div class="my-10 p-6 sm:p-8 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-6">
    <div class="text-center max-w-xl mx-auto space-y-1">
        <span class="px-3 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase rounded-full">Clinical Results</span>
        <h3 class="text-2xl font-black text-slate-900">${block.data.title || 'Before & After Smile Transformation'}</h3>
        <p class="text-xs text-slate-500">${block.data.description || 'Real results from our precision aesthetic dental treatments.'}</p>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-2">
            <div class="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                <span class="absolute top-3 left-3 px-3 py-1 bg-black/70 text-white text-[10px] font-bold uppercase rounded-lg backdrop-blur-xs">Before Treatment</span>
                <img src="${block.data.before_image || 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80'}" alt="Before" class="w-full h-64 object-cover" />
            </div>
            <div class="text-xs font-semibold text-slate-600 px-1">${block.data.before_label || 'Initial dental condition'}</div>
        </div>
        <div class="space-y-2">
            <div class="relative rounded-2xl overflow-hidden border border-emerald-200 bg-emerald-50">
                <span class="absolute top-3 left-3 px-3 py-1 bg-emerald-600 text-white text-[10px] font-bold uppercase rounded-lg shadow-sm">After Treatment</span>
                <img src="${block.data.after_image || 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80'}" alt="After" class="w-full h-64 object-cover" />
            </div>
            <div class="text-xs font-semibold text-emerald-800 px-1">${block.data.after_label || 'Restored natural aesthetics'}</div>
        </div>
    </div>
</div>`;

            case 'services':
                const cols = block.data.columns || '2';
                const gridClass = cols === '3' ? 'md:grid-cols-3' : cols === '4' ? 'md:grid-cols-4' : 'md:grid-cols-2';
                const itemsHtml = (block.data.items || []).map((item: any) => `
    <div class="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-rose-300 transition-all space-y-2">
        <div class="flex items-center justify-between">
            <h4 class="text-base font-bold text-slate-900">${item.name || 'Treatment Name'}</h4>
            ${item.price ? `<span class="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-extrabold text-xs rounded-lg border border-emerald-200">${item.price}</span>` : ''}
        </div>
        <p class="text-xs text-slate-600 leading-relaxed">${item.description || ''}</p>
    </div>`).join('\n');

                return `<!-- Services Grid Block -->
<div class="my-8 space-y-4">
    <div>
        <h3 class="text-xl font-extrabold text-slate-900">${block.data.heading || 'Our Dental Treatments'}</h3>
        ${block.data.subheading ? `<p class="text-xs text-slate-500 mt-1">${block.data.subheading}</p>` : ''}
    </div>
    <div class="grid grid-cols-1 ${gridClass} gap-4">
        ${itemsHtml}
    </div>
</div>`;

            case 'pricing_table':
                const plansHtml = (block.data.plans || []).map((plan: any) => `
    <div class="p-6 bg-white rounded-3xl border ${plan.is_popular ? 'border-[#800038] shadow-lg ring-2 ring-[#800038]/10' : 'border-slate-200 shadow-xs'} space-y-4 relative flex flex-col justify-between">
        ${plan.is_popular ? `<span class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#800038] text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-sm">Most Popular</span>` : ''}
        <div class="space-y-2">
            <h4 class="text-lg font-black text-slate-900">${plan.name || 'Plan Name'}</h4>
            <div class="flex items-baseline gap-1">
                <span class="text-2xl sm:text-3xl font-black text-slate-900">${plan.price || '৳ 0'}</span>
                ${plan.period ? `<span class="text-xs text-slate-400 font-medium">${plan.period}</span>` : ''}
            </div>
            <p class="text-xs text-slate-500 leading-relaxed">${plan.description || ''}</p>
            <ul class="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-700">
                ${(plan.features || '').split('\n').filter((f: string) => f.trim()).map((f: string) => `
                <li class="flex items-center gap-2">
                    <span class="text-emerald-500 font-bold">✓</span>
                    <span>${f.trim()}</span>
                </li>`).join('')}
            </ul>
        </div>
        <a href="${plan.button_url || '#appointment'}" class="w-full py-2.5 text-center block ${plan.is_popular ? 'bg-[#800038] hover:bg-[#990044] text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'} text-xs font-bold rounded-xl transition">
            ${plan.button_label || 'Select Plan'}
        </a>
    </div>`).join('\n');

                return `<!-- Pricing Table Block -->
<div class="my-10 space-y-6">
    <div class="text-center max-w-xl mx-auto space-y-1">
        <h3 class="text-2xl font-black text-slate-900">${block.data.heading || 'Transparent Pricing Plans'}</h3>
        <p class="text-xs text-slate-500">${block.data.subheading || 'No hidden costs. Comprehensive clinical dental packages.'}</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        ${plansHtml}
    </div>
</div>`;

            case 'doctors':
                return `<!-- Doctor Specialists Block -->
<div class="my-8 p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-4">
    <div class="flex items-center justify-between">
        <div>
            <h3 class="text-xl font-extrabold text-slate-900">${block.data.heading || 'Our Dental Specialists'}</h3>
            <p class="text-xs text-slate-500 mt-0.5">${block.data.subheading || 'BMDC Registered Specialist Dentists'}</p>
        </div>
        <span class="px-3 py-1 bg-white text-rose-700 font-bold text-xs rounded-full border border-rose-200">Branch: ${block.data.branch || 'All Branches'}</span>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="p-4 bg-white rounded-2xl border border-slate-200 flex items-center gap-4 shadow-2xs">
            <div class="w-12 h-12 rounded-full bg-rose-100 text-rose-700 font-black flex items-center justify-center text-base shrink-0">Dr</div>
            <div class="space-y-0.5 truncate">
                <div class="text-sm font-bold text-slate-900 truncate">${block.data.doctor_name || 'Dr. Aysha Siddika'}</div>
                <div class="text-xs text-slate-500 truncate">${block.data.degrees || 'BDS (DU), PGT (Aesthetic), FCPS'}</div>
            </div>
        </div>
    </div>
</div>`;

            case 'testimonials':
                const reviewsHtml = (block.data.items || []).map((rev: any) => `
    <div class="p-5 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-xs">
        <div class="text-amber-400 text-sm tracking-widest">${'★'.repeat(Number(rev.rating) || 5)}</div>
        <p class="text-xs text-slate-700 italic leading-relaxed">"${rev.comment || 'Excellent painless treatment!'}"</p>
        <div class="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 pt-2">
            <span class="font-bold text-slate-800">${rev.patient_name || 'Patient'}</span>
            <span>${rev.branch || 'Mirpur Branch'}</span>
        </div>
    </div>`).join('\n');

                return `<!-- Testimonials Block -->
<div class="my-8 space-y-4">
    <h3 class="text-xl font-extrabold text-slate-900">${block.data.heading || 'What Our Patients Say'}</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${reviewsHtml}
    </div>
</div>`;

            case 'stats':
                const statsHtml = (block.data.items || []).map((st: any) => `
    <div class="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-1">
        <div class="text-3xl font-black text-[#800038]">${st.number || '10,000+'}</div>
        <div class="text-xs font-bold text-slate-800">${st.label || 'Happy Smiles'}</div>
        ${st.subtitle ? `<div class="text-[10px] text-slate-500">${st.subtitle}</div>` : ''}
    </div>`).join('\n');

                return `<!-- Statistics Counter Block -->
<div class="my-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
    ${statsHtml}
</div>`;

            case 'cta':
                return `<!-- CTA Banner Block -->
<div class="my-8 p-8 bg-gradient-to-r from-[#800038] to-[#a30048] text-white rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-rose-500">
    <div class="space-y-2 text-center sm:text-left">
        <h3 class="text-xl sm:text-2xl font-black">${block.data.heading || 'Need Urgent Dental Relief?'}</h3>
        <p class="text-xs sm:text-sm text-rose-100 max-w-xl">${block.data.subheading || 'Call our direct dental helpline for immediate specialist support.'}</p>
    </div>
    <div class="flex items-center gap-3 shrink-0">
        <a href="tel:${(block.data.phone || HOTLINE).replace(/[^0-9+]/g, '')}" class="px-5 py-3 bg-white text-rose-900 hover:bg-rose-50 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2">
            📞 ${block.data.phone || HOTLINE_DISPLAY}
        </a>
        <a href="${block.data.button_url || '#appointment'}" class="px-5 py-3 bg-rose-950/60 hover:bg-rose-950 text-white font-extrabold text-xs rounded-xl border border-white/20 transition-all">
            ${block.data.button_label || 'Book Online'}
        </a>
    </div>
</div>`;

            case 'faq':
                const faqsHtml = (block.data.items || []).map((faq: any) => `
    <details class="bg-white border border-slate-200 rounded-2xl p-4 cursor-pointer hover:border-slate-300 transition-colors">
        <summary class="font-bold text-xs sm:text-sm text-slate-900">${faq.question || 'Frequently Asked Question?'}</summary>
        <p class="text-xs text-slate-600 mt-2 leading-relaxed pl-4 border-l-2 border-rose-400">${faq.answer || ''}</p>
    </details>`).join('\n');

                return `<!-- FAQ Block -->
<div class="my-8 space-y-3">
    <h3 class="text-xl font-extrabold text-slate-900">${block.data.heading || 'Frequently Asked Questions'}</h3>
    <div class="space-y-3">
        ${faqsHtml}
    </div>
</div>`;

            case 'gallery':
                const imgsHtml = (block.data.items || []).map((img: any) => `
    <div class="rounded-2xl overflow-hidden border border-slate-200 space-y-1.5 bg-slate-50 p-2">
        <img src="${img.image_url || 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80'}" alt="${img.caption || ''}" class="w-full h-36 object-cover rounded-xl" />
        ${img.caption ? `<div class="text-[11px] font-bold text-slate-700 px-1 truncate">${img.caption}</div>` : ''}
    </div>`).join('\n');

                return `<!-- Media Gallery Block -->
<div class="my-8 space-y-4">
    <h3 class="text-xl font-extrabold text-slate-900">${block.data.heading || 'Clinic Gallery & Technology'}</h3>
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
        ${imgsHtml}
    </div>
</div>`;

            case 'video':
                return `<!-- Video Embed Block -->
<div class="my-8 space-y-3">
    ${block.data.title ? `<h3 class="text-xl font-extrabold text-slate-900">${block.data.title}</h3>` : ''}
    <div class="relative w-full aspect-video rounded-3xl overflow-hidden border border-slate-200 shadow-md bg-black">
        <iframe src="${block.data.video_url || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}" title="${block.data.title || 'Video'}" class="w-full h-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>
    ${block.data.description ? `<p class="text-xs text-slate-500">${block.data.description}</p>` : ''}
</div>`;

            case 'rich_text':
                return `<!-- Rich Text Block -->
<div class="my-6 space-y-3 prose prose-slate max-w-none">
    ${block.data.title ? `<h3 class="text-xl font-extrabold text-slate-900">${block.data.title}</h3>` : ''}
    <div class="text-slate-700 text-sm leading-relaxed">${block.data.content || ''}</div>
</div>`;

            case 'alert':
                const alertColors = block.data.style === 'offer' 
                    ? 'bg-rose-50 border-rose-300 text-rose-900' 
                    : block.data.style === 'success' 
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
                    : block.data.style === 'warning'
                    ? 'bg-amber-50 border-amber-300 text-amber-900'
                    : 'bg-sky-50 border-sky-300 text-sky-900';
                return `<!-- Alert / Notice Block -->
<div class="my-6 p-5 rounded-2xl border ${alertColors} space-y-1 shadow-2xs">
    <div class="flex items-center gap-2 font-black text-sm">
        <span>📢</span>
        <span>${block.data.title || 'Notice'}</span>
    </div>
    <p class="text-xs leading-relaxed">${block.data.message || 'Important clinic announcement or notice.'}</p>
</div>`;

            case 'quote':
                return `<!-- Quote Block -->
<div class="my-8 p-6 sm:p-8 bg-slate-50 rounded-3xl border-l-4 border-[#800038] border-t border-r border-b border-slate-200 space-y-3">
    <p class="text-base sm:text-lg italic text-slate-800 leading-relaxed font-serif">"${block.data.quote || 'Pain-free digital dentistry is not just a procedure; it is a promise to our patients.'}"</p>
    <div class="flex items-center gap-3 pt-1">
        <div class="w-10 h-10 rounded-full bg-[#800038] text-white font-bold flex items-center justify-center text-xs">Dr</div>
        <div>
            <div class="text-xs font-bold text-slate-900">${block.data.author || 'Dr. Specialist'}</div>
            <div class="text-[10px] text-slate-500">${block.data.citation || 'Lead Dental Surgeon, Tech Dental'}</div>
        </div>
    </div>
</div>`;

            case 'steps':
                const stepsHtml = (block.data.items || []).map((step: any, idx: number) => `
    <div class="p-5 bg-white rounded-2xl border border-slate-200 space-y-2 relative shadow-2xs">
        <div class="w-8 h-8 rounded-full bg-[#800038] text-white font-black text-xs flex items-center justify-center">${idx + 1}</div>
        <h4 class="text-sm font-bold text-slate-900">${step.title || 'Step Title'}</h4>
        <p class="text-xs text-slate-500 leading-relaxed">${step.desc || 'Step description'}</p>
    </div>`).join('\n');

                return `<!-- Step-by-Step Process Block -->
<div class="my-8 space-y-4">
    <div class="space-y-1">
        <h3 class="text-xl font-extrabold text-slate-900">${block.data.heading || 'How Your Treatment Works'}</h3>
        <p class="text-xs text-slate-500">${block.data.subheading || 'Simple 3-step painless clinical journey.'}</p>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        ${stepsHtml}
    </div>
</div>`;

            case 'location_card':
                return `<!-- Clinic Branch Location Card Block -->
<div class="my-8 p-6 bg-slate-900 text-white rounded-3xl border border-slate-800 space-y-4 shadow-xl">
    <div class="flex items-center justify-between">
        <div class="flex items-center gap-2 text-rose-400 text-xs font-bold">
            <span>📍 Clinic Branch</span>
        </div>
        <span class="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded-full border border-emerald-500/30">Open Today</span>
    </div>
    <div>
        <h3 class="text-xl font-black">${block.data.branch_name || 'Mirpur Branch - Tech Dental'}</h3>
        <p class="text-xs text-slate-300 mt-1">${block.data.address || 'House 827 (2nd Floor), Shewrapara, Mirpur, Dhaka-1216'}</p>
    </div>
    <div class="grid grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-800">
        <div><strong>Hours:</strong> ${block.data.hours || '10:00 AM - 9:00 PM'}</div>
        <div><strong>Hotline:</strong> ${block.data.phone || '+880 1700-000000'}</div>
    </div>
    ${block.data.map_link ? `
    <div class="pt-1">
        <a href="${block.data.map_link}" target="_blank" rel="noreferrer" class="inline-block px-4 py-2 bg-white text-slate-900 text-xs font-bold rounded-xl hover:bg-slate-100 transition">Get Directions on Google Maps →</a>
    </div>` : ''}
</div>`;

            case 'spacer':
                const heightClass = block.data.height === 'large' ? 'h-16' : block.data.height === 'small' ? 'h-6' : 'h-10';
                return `<!-- Spacer & Divider Block -->
<div class="${heightClass} flex items-center justify-center">
    ${block.data.show_line ? `<div class="w-full border-t border-slate-200"></div>` : ''}
</div>`;

            case 'embed':
                return `<!-- Custom Code / Embed Block -->
<div class="my-6">
    ${block.data.html || ''}
</div>`;

            default:
                return '';
        }
    }).join('\n\n');
}

export default function CustomBlockBuilder({ blocks, onChange }: Props) {
    const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<'all' | 'media' | 'content' | 'dental'>('all');

    const availableBlockTypes = [
        // 1. Media & Visuals
        {
            type: 'hero' as const,
            category: 'media',
            name: 'Hero Banner',
            desc: 'Top high-converting banner with headline, badge & button',
            icon: Sparkles,
            color: 'text-amber-500 bg-amber-50 border-amber-200',
            defaultData: {
                badge: 'Tech Dental Care',
                headline: 'Advanced Digital Dentistry Solutions',
                subheading: 'Painless root canals, laser whitening, and dental implants with modern technology.',
                button_label: 'Make Appointment',
                button_url: '#appointment',
            }
        },
        {
            type: 'image' as const,
            category: 'media',
            name: 'Single Image / Photo',
            desc: 'Responsive standalone image with caption & custom alignment',
            icon: ImageIcon,
            color: 'text-sky-500 bg-sky-50 border-sky-200',
            defaultData: {
                image_url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80',
                caption: 'Modern German 3D Digital Dental Equipment',
                alt: 'Dental Clinic Equipment',
                align: 'center',
                link: ''
            }
        },
        {
            type: 'feature_split' as const,
            category: 'media',
            name: 'Image + Text Split (50-50)',
            desc: 'Side-by-side section with photo, bullet points & action button',
            icon: SplitSquareVertical,
            color: 'text-indigo-500 bg-indigo-50 border-indigo-200',
            defaultData: {
                badge: 'Why Choose Tech Dental',
                headline: 'Computer-Guided Millimeter Precision',
                description: 'We combine 3D intraoral scanners with low-radiation digital X-rays to deliver millimeter-precise dental care.',
                bullets: 'Painless computer-assisted local anesthesia\nSingle-session digital smile makeover\nCertified German sterilization standards',
                image_url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80',
                layout: 'image_right',
                button_label: 'Learn More',
                button_url: '#appointment'
            }
        },
        {
            type: 'before_after' as const,
            category: 'media',
            name: 'Before & After Transformation',
            desc: 'Side-by-side clinical comparison cards for teeth whitening or aligners',
            icon: Sliders,
            color: 'text-emerald-500 bg-emerald-50 border-emerald-200',
            defaultData: {
                title: 'Laser Teeth Whitening Case Study',
                description: 'Patient received 8 shades whiter teeth in one 45-minute painless clinic visit.',
                before_image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80',
                before_label: 'Before: Stained and discolored teeth',
                after_image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80',
                after_label: 'After: Radiant natural white smile'
            }
        },
        {
            type: 'gallery' as const,
            category: 'media',
            name: 'Clinic Media Gallery',
            desc: 'Multi-image grid of clinic operatory, branches and equipment',
            icon: Layers,
            color: 'text-teal-500 bg-teal-50 border-teal-200',
            defaultData: {
                heading: 'Clinic Tour & Modern Equipment',
                items: [
                    { image_url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80', caption: 'Modern Dental Operatory' },
                    { image_url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80', caption: 'Sterilization Room' },
                    { image_url: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=600&q=80', caption: 'Digital 3D X-Ray Lab' }
                ]
            }
        },
        {
            type: 'video' as const,
            category: 'media',
            name: 'Video Showcase',
            desc: 'Embed YouTube, Vimeo, or MP4 clinical demonstration video',
            icon: Play,
            color: 'text-rose-500 bg-rose-50 border-rose-200',
            defaultData: {
                title: 'Virtual Clinic Walkthrough & Patient Journey',
                description: 'See how our painless dental treatments are performed with German technology.',
                video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
            }
        },

        // 2. Content & Layout
        {
            type: 'rich_text' as const,
            category: 'content',
            name: 'Rich Text Article',
            desc: 'Formatted paragraph text, headings & detailed information',
            icon: FileText,
            color: 'text-slate-600 bg-slate-50 border-slate-200',
            defaultData: {
                title: 'Comprehensive Dental Care Solutions',
                content: '<p>At Tech Dental Care, we provide complete family dental healthcare with global standards.</p>'
            }
        },
        {
            type: 'steps' as const,
            category: 'content',
            name: 'How It Works (1-2-3 Steps)',
            desc: 'Patient treatment journey in easy sequential numbered cards',
            icon: ListOrdered,
            color: 'text-blue-500 bg-blue-50 border-blue-200',
            defaultData: {
                heading: 'Simple 3-Step Painless Treatment',
                subheading: 'From consultation to restored smile in easy steps',
                items: [
                    { title: 'Step 1: Consultation & 3D Scan', desc: 'Digital intraoral scan with zero radiation discomfort.' },
                    { title: 'Step 2: Custom Treatment Plan', desc: 'Computerized planning with transparent treatment estimate.' },
                    { title: 'Step 3: Painless Clinical Procedure', desc: 'Experience 100% comfort with computer-controlled anesthesia.' }
                ]
            }
        },
        {
            type: 'alert' as const,
            category: 'content',
            name: 'Announcement / Offer Banner',
            desc: 'Important clinic notice, discount offer, or holiday alert',
            icon: AlertCircle,
            color: 'text-rose-600 bg-rose-50 border-rose-200',
            defaultData: {
                title: 'Special Ramadan Smile Offer!',
                message: 'Get 25% off on Laser Teeth Whitening across all Tech Dental branches this month.',
                style: 'offer'
            }
        },
        {
            type: 'quote' as const,
            category: 'content',
            name: 'Quote / Doctor Statement',
            desc: 'Prominent quote box with doctor photo, credentials & statement',
            icon: Quote,
            color: 'text-purple-600 bg-purple-50 border-purple-200',
            defaultData: {
                quote: 'Our mission is to eliminate dental anxiety in Bangladesh through precision laser and digital technology.',
                author: 'Dr. Specialist Oral Surgeon',
                citation: 'Head of Clinical Services, Tech Dental Care'
            }
        },
        {
            type: 'spacer' as const,
            category: 'content',
            name: 'Spacer & Divider Line',
            desc: 'Control vertical spacing between sections with optional line',
            icon: Minus,
            color: 'text-gray-400 bg-gray-50 border-gray-200',
            defaultData: {
                height: 'medium',
                show_line: true
            }
        },
        {
            type: 'embed' as const,
            category: 'content',
            name: 'Custom Code / Iframe Embed',
            desc: 'Insert raw HTML, Google Map iframe, or custom widgets',
            icon: Code,
            color: 'text-slate-800 bg-slate-100 border-slate-300',
            defaultData: {
                html: '<div class="p-4 bg-slate-100 rounded-xl text-center text-xs text-slate-500 font-mono">Custom HTML / Iframe code here</div>'
            }
        },

        // 3. Dental & Business
        {
            type: 'services' as const,
            category: 'dental',
            name: 'Services & Pricing Grid',
            desc: 'Display treatment cards with prices & descriptions (2, 3, 4 cols)',
            icon: Grid,
            color: 'text-emerald-500 bg-emerald-50 border-emerald-200',
            defaultData: {
                heading: 'Specialized Dental Treatments',
                subheading: 'High-precision digital procedures backed by certified dental surgeons',
                columns: '2',
                items: [
                    { name: 'Laser Teeth Whitening', price: '৳ 6,000', description: 'Up to 8 shades whiter in 45-minute painless session.' },
                    { name: 'Digital Dental Implants', price: 'From ৳ 45,000', description: 'Computer-guided permanent titanium teeth implants.' },
                    { name: 'Microscopic Root Canal', price: '৳ 8,500', description: 'Single-visit painless therapy with 99.8% precision.' },
                    { name: 'Clear Aligners', price: 'From ৳ 55,000', description: 'Discreetly straighten smile with custom 3D aligners.' }
                ]
            }
        },
        {
            type: 'pricing_table' as const,
            category: 'dental',
            name: 'Pricing Packages Table',
            desc: 'Tiered packages (Basic, Premium, VIP) with feature checklist',
            icon: DollarSign,
            color: 'text-emerald-600 bg-emerald-50 border-emerald-300',
            defaultData: {
                heading: 'Dental Care Packages',
                subheading: 'Transparent clinical packages with no hidden costs',
                plans: [
                    { name: 'Basic Dental Checkup', price: '৳ 1,000', period: '/ visit', description: 'Comprehensive oral checkup & digital scan.', features: 'Digital Intraoral 3D Scan\nDoctor Consultation\nPersonalized Treatment Plan', button_label: 'Book Checkup', button_url: '#appointment', is_popular: false },
                    { name: 'Smile Makeover Pro', price: '৳ 8,500', period: '/ package', description: 'Complete teeth polishing and laser whitening.', features: 'Full Ultrasonic Scaling\nLaser Teeth Whitening\nEnamel Polish & Protection\nFree 6-Month Followup', button_label: 'Get Pro Smile', button_url: '#appointment', is_popular: true },
                    { name: 'Implant Consultation', price: '৳ 2,500', period: '/ plan', description: 'CBCT 3D bone scan and implant planning.', features: '3D Bone Density Analysis\nSurgical Guide Simulation\nWarranty Coverage Details', button_label: 'Book Implant Consultation', button_url: '#appointment', is_popular: false }
                ]
            }
        },
        {
            type: 'doctors' as const,
            category: 'dental',
            name: 'Doctors Showcase',
            desc: 'Specialist dentists profile and qualification strip',
            icon: Users,
            color: 'text-sky-500 bg-sky-50 border-sky-200',
            defaultData: {
                heading: 'Our Dental Specialists',
                subheading: 'BMDC Registered Specialist Dentists',
                branch: 'Mirpur, Badda, Uttara, Jatrabari',
                doctor_name: 'Dr. Aysha Siddika',
                degrees: 'BDS (DU), PGT (Aesthetic), FCPS'
            }
        },
        {
            type: 'testimonials' as const,
            category: 'dental',
            name: 'Patient Reviews & Ratings',
            desc: 'Patient ratings, 5-star testimonials, and branch feedback',
            icon: MessageSquare,
            color: 'text-purple-500 bg-purple-50 border-purple-200',
            defaultData: {
                heading: 'What Patients Say About Tech Dental',
                items: [
                    { patient_name: 'Tanvir Hossain', rating: '5', comment: 'Completely painless root canal treatment! Highly recommended.', branch: 'Mirpur Branch' },
                    { patient_name: 'Sabrina Islam', rating: '5', comment: 'Very clean clinic and modern equipment. Extremely caring doctors.', branch: 'Uttara Branch' }
                ]
            }
        },
        {
            type: 'stats' as const,
            category: 'dental',
            name: 'Statistics Counter',
            desc: 'Showcase happy patients, success rate, and branch numbers',
            icon: BarChart3,
            color: 'text-rose-500 bg-rose-50 border-rose-200',
            defaultData: {
                items: [
                    { number: '15,000+', label: 'Smiles Restored', subtitle: 'Across Dhaka' },
                    { number: '99.8%', label: 'Painless Accuracy', subtitle: 'Laser & 3D' },
                    { number: '4 Branches', label: 'Prime Locations', subtitle: 'Open 7 Days' },
                    { number: '12+', label: 'Dental Specialists', subtitle: 'BMDC Certified' }
                ]
            }
        },
        {
            type: 'cta' as const,
            category: 'dental',
            name: 'Call To Action Hotline Banner',
            desc: 'Emergency contact helpline and online booking button',
            icon: Phone,
            color: 'text-rose-600 bg-rose-50 border-rose-200',
            defaultData: {
                heading: 'Need Urgent Dental Relief?',
                subheading: 'Call our central dental helpline or book your consultation online.',
                phone: HOTLINE_DISPLAY,
                button_label: 'Book Online',
                button_url: '#appointment'
            }
        },
        {
            type: 'faq' as const,
            category: 'dental',
            name: 'FAQ Accordion',
            desc: 'Frequently asked patient questions and answers',
            icon: HelpCircle,
            color: 'text-indigo-500 bg-indigo-50 border-indigo-200',
            defaultData: {
                heading: 'Frequently Asked Questions',
                items: [
                    { question: 'Is dental treatment really painless at Tech Dental?', answer: 'Yes! We use computerized pain-free anesthesia and gentle laser techniques.' },
                    { question: 'What are your clinic visiting hours?', answer: 'Saturday to Thursday: 10:00 AM - 9:00 PM, and Friday: 3:00 PM - 9:00 PM.' }
                ]
            }
        },
        {
            type: 'location_card' as const,
            category: 'dental',
            name: 'Branch Location & Hours Card',
            desc: 'Clinic branch address, hours, phone, and Google Maps direction',
            icon: MapPin,
            color: 'text-purple-600 bg-purple-50 border-purple-200',
            defaultData: {
                branch_name: 'Tech Dental Center, Mirpur 10 Branch',
                address: 'House 827 (2nd Floor), Shewrapara, Mirpur, Dhaka-1216',
                hours: '10:00 AM – 9:00 PM (Daily)',
                phone: '+880 1700-000000',
                map_link: 'https://maps.google.com'
            }
        }
    ];

    const addBlock = (typeObj: typeof availableBlockTypes[0]) => {
        const newBlock: BlockItem = {
            id: 'block_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            type: typeObj.type,
            data: JSON.parse(JSON.stringify(typeObj.defaultData)),
            collapsed: false
        };
        onChange([...blocks, newBlock]);
        setIsAddMenuOpen(false);
    };

    const updateBlockData = (id: string, updatedData: any) => {
        onChange(blocks.map(b => b.id === id ? { ...b, data: { ...b.data, ...updatedData } } : b));
    };

    const toggleCollapse = (id: string) => {
        onChange(blocks.map(b => b.id === id ? { ...b, collapsed: !b.collapsed } : b));
    };

    const moveBlock = (index: number, direction: 'up' | 'down') => {
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= blocks.length) return;
        const newBlocks = [...blocks];
        const [moved] = newBlocks.splice(index, 1);
        newBlocks.splice(targetIndex, 0, moved);
        onChange(newBlocks);
    };

    const duplicateBlock = (index: number) => {
        const target = blocks[index];
        const cloned: BlockItem = {
            id: 'block_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            type: target.type,
            data: JSON.parse(JSON.stringify(target.data)),
            collapsed: false
        };
        const newBlocks = [...blocks];
        newBlocks.splice(index + 1, 0, cloned);
        onChange(newBlocks);
    };

    const deleteBlock = (index: number) => {
        if (confirm('Delete this block?')) {
            const newBlocks = [...blocks];
            newBlocks.splice(index, 1);
            onChange(newBlocks);
        }
    };

    // Filter available blocks
    const filteredBlockTypes = availableBlockTypes.filter(bt => {
        const matchesCat = selectedCategory === 'all' || bt.category === selectedCategory;
        const matchesQuery = !searchQuery.trim() || 
            bt.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            bt.desc.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCat && matchesQuery;
    });

    return (
        <div className="space-y-4 font-sans">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200/80 shadow-2xs">
                <div>
                    <h3 className="text-sm font-extrabold text-gray-900 flex items-center gap-2">
                        <Layers size={16} className="text-[#800038]" />
                        <span>Dynamic Page Blocks ({blocks.length})</span>
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                        Add, customize, and drag/reorder any block to build your page.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setIsAddMenuOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#800038] hover:bg-[#990044] text-white font-black text-xs rounded-xl shadow-sm transition-all cursor-pointer hover:shadow-md"
                >
                    <Plus size={15} />
                    <span>+ Add New Block</span>
                </button>
            </div>

            {/* Block List Render */}
            {blocks.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-3xl border-2 border-dashed border-gray-200 space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-rose-50 text-[#800038] flex items-center justify-center mx-auto shadow-xs">
                        <Layers size={24} />
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-base font-bold text-gray-800">Your page has no blocks yet</h4>
                        <p className="text-xs text-gray-500 max-w-sm mx-auto">
                            Click "+ Add New Block" above to insert heroes, images, service grids, before & after comparisons, and more.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsAddMenuOpen(true)}
                        className="px-5 py-2.5 bg-[#800038] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#990044] transition cursor-pointer"
                    >
                        Browse Block Library
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {blocks.map((block, index) => {
                        const blockDef = availableBlockTypes.find(t => t.type === block.type) || availableBlockTypes[0];
                        const IconComp = blockDef.icon;

                        return (
                            <div 
                                key={block.id} 
                                className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs overflow-hidden transition-all duration-200"
                            >
                                {/* Block Header Card */}
                                <div className="p-3.5 sm:p-4 bg-gray-50/80 border-b border-gray-200/80 flex items-center justify-between gap-3 select-none">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${blockDef.color}`}>
                                            <IconComp size={16} />
                                        </div>
                                        <div className="truncate">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-extrabold text-gray-900 truncate">
                                                    {blockDef.name}
                                                </span>
                                                <span className="text-[10px] text-gray-400 font-mono bg-white px-1.5 py-0.5 rounded border border-gray-200">
                                                    #{index + 1}
                                                </span>
                                            </div>
                                            <div className="text-[11px] text-gray-500 truncate max-w-md">
                                                {block.data.headline || block.data.heading || block.data.title || block.data.caption || blockDef.desc}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-1 shrink-0">
                                        <button
                                            type="button"
                                            disabled={index === 0}
                                            onClick={() => moveBlock(index, 'up')}
                                            className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition disabled:opacity-30 cursor-pointer"
                                            title="Move Up"
                                        >
                                            <ChevronUp size={15} />
                                        </button>

                                        <button
                                            type="button"
                                            disabled={index === blocks.length - 1}
                                            onClick={() => moveBlock(index, 'down')}
                                            className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition disabled:opacity-30 cursor-pointer"
                                            title="Move Down"
                                        >
                                            <ChevronDown size={15} />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => duplicateBlock(index)}
                                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                                            title="Duplicate Block"
                                        >
                                            <Copy size={15} />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => deleteBlock(index)}
                                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                                            title="Delete Block"
                                        >
                                            <Trash2 size={15} />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => toggleCollapse(block.id)}
                                            className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition cursor-pointer ml-1"
                                            title={block.collapsed ? "Expand Block" : "Collapse Block"}
                                        >
                                            {block.collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Block Body / Form Inputs */}
                                {!block.collapsed && (
                                    <div className="p-5 sm:p-6 space-y-4 bg-white">
                                        {/* 1. Hero */}
                                        {block.type === 'hero' && (
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-700 mb-1">Badge Text</label>
                                                        <input
                                                            type="text"
                                                            value={block.data.badge || ''}
                                                            onChange={e => updateBlockData(block.id, { badge: e.target.value })}
                                                            placeholder="e.g. Tech Dental Care"
                                                            className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-rose-500 focus:outline-none"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-700 mb-1">Main Headline *</label>
                                                        <input
                                                            type="text"
                                                            value={block.data.headline || ''}
                                                            onChange={e => updateBlockData(block.id, { headline: e.target.value })}
                                                            placeholder="e.g. World-Class Painless Dental Care"
                                                            className="w-full text-xs font-bold border border-gray-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-rose-500 focus:outline-none"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-700 mb-1">Subheading Paragraph</label>
                                                    <textarea
                                                        rows={2}
                                                        value={block.data.subheading || ''}
                                                        onChange={e => updateBlockData(block.id, { subheading: e.target.value })}
                                                        placeholder="Provide brief clinic details or specialty."
                                                        className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-rose-500 focus:outline-none"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-700 mb-1">Button Label</label>
                                                        <input
                                                            type="text"
                                                            value={block.data.button_label || ''}
                                                            onChange={e => updateBlockData(block.id, { button_label: e.target.value })}
                                                            placeholder="e.g. Book Consultation"
                                                            className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-rose-500 focus:outline-none"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-700 mb-1">Button URL / Link</label>
                                                        <input
                                                            type="text"
                                                            value={block.data.button_url || ''}
                                                            onChange={e => updateBlockData(block.id, { button_url: e.target.value })}
                                                            placeholder="#appointment or /page/about-us"
                                                            className="w-full text-xs font-mono border border-gray-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-rose-500 focus:outline-none"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* 2. Single Image */}
                                        {block.type === 'image' && (
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-700 mb-1">Image URL *</label>
                                                    <input
                                                        type="text"
                                                        value={block.data.image_url || ''}
                                                        onChange={e => updateBlockData(block.id, { image_url: e.target.value })}
                                                        placeholder="https://images.unsplash.com/... or /images/clinic.jpg"
                                                        className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-rose-500 focus:outline-none"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-700 mb-1">Caption</label>
                                                        <input
                                                            type="text"
                                                            value={block.data.caption || ''}
                                                            onChange={e => updateBlockData(block.id, { caption: e.target.value })}
                                                            placeholder="Caption below image"
                                                            className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-700 mb-1">Alt Text</label>
                                                        <input
                                                            type="text"
                                                            value={block.data.alt || ''}
                                                            onChange={e => updateBlockData(block.id, { alt: e.target.value })}
                                                            placeholder="Image description for SEO"
                                                            className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-700 mb-1">Alignment</label>
                                                        <select
                                                            value={block.data.align || 'center'}
                                                            onChange={e => updateBlockData(block.id, { align: e.target.value })}
                                                            className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 bg-white"
                                                        >
                                                            <option value="center">Center</option>
                                                            <option value="left">Left</option>
                                                            <option value="right">Right</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* 3. Feature Split (50-50) */}
                                        {block.type === 'feature_split' && (
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-700 mb-1">Section Badge</label>
                                                        <input
                                                            type="text"
                                                            value={block.data.badge || ''}
                                                            onChange={e => updateBlockData(block.id, { badge: e.target.value })}
                                                            placeholder="e.g. Why Choose Us"
                                                            className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-700 mb-1">Image Placement</label>
                                                        <select
                                                            value={block.data.layout || 'image_right'}
                                                            onChange={e => updateBlockData(block.id, { layout: e.target.value })}
                                                            className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 bg-white"
                                                        >
                                                            <option value="image_right">Image on Right / Text on Left</option>
                                                            <option value="image_left">Image on Left / Text on Right</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-700 mb-1">Headline *</label>
                                                    <input
                                                        type="text"
                                                        value={block.data.headline || ''}
                                                        onChange={e => updateBlockData(block.id, { headline: e.target.value })}
                                                        placeholder="Headline text"
                                                        className="w-full text-xs font-bold border border-gray-200 rounded-xl px-3 py-2"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-700 mb-1">Image URL *</label>
                                                    <input
                                                        type="text"
                                                        value={block.data.image_url || ''}
                                                        onChange={e => updateBlockData(block.id, { image_url: e.target.value })}
                                                        placeholder="https://..."
                                                        className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-700 mb-1">Description Paragraph</label>
                                                    <textarea
                                                        rows={2}
                                                        value={block.data.description || ''}
                                                        onChange={e => updateBlockData(block.id, { description: e.target.value })}
                                                        className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-700 mb-1">Bullet Points (1 per line)</label>
                                                    <textarea
                                                        rows={3}
                                                        value={block.data.bullets || ''}
                                                        onChange={e => updateBlockData(block.id, { bullets: e.target.value })}
                                                        placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                                                        className="w-full text-xs font-mono border border-gray-200 rounded-xl px-3 py-2"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* 4. Before & After */}
                                        {block.type === 'before_after' && (
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-700 mb-1">Case Title</label>
                                                        <input
                                                            type="text"
                                                            value={block.data.title || ''}
                                                            onChange={e => updateBlockData(block.id, { title: e.target.value })}
                                                            placeholder="e.g. Laser Teeth Whitening Case"
                                                            className="w-full text-xs font-bold border border-gray-200 rounded-xl px-3 py-2"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                                                        <input
                                                            type="text"
                                                            value={block.data.description || ''}
                                                            onChange={e => updateBlockData(block.id, { description: e.target.value })}
                                                            placeholder="e.g. 1-session whitening results"
                                                            className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                                                    <div className="space-y-2">
                                                        <label className="block text-xs font-extrabold text-slate-800">BEFORE Image URL</label>
                                                        <input
                                                            type="text"
                                                            value={block.data.before_image || ''}
                                                            onChange={e => updateBlockData(block.id, { before_image: e.target.value })}
                                                            placeholder="https://..."
                                                            className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 bg-white"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={block.data.before_label || ''}
                                                            onChange={e => updateBlockData(block.id, { before_label: e.target.value })}
                                                            placeholder="Before label"
                                                            className="w-full text-xs border border-gray-200 rounded-xl px-3 py-1.5 bg-white text-slate-600"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="block text-xs font-extrabold text-emerald-800">AFTER Image URL</label>
                                                        <input
                                                            type="text"
                                                            value={block.data.after_image || ''}
                                                            onChange={e => updateBlockData(block.id, { after_image: e.target.value })}
                                                            placeholder="https://..."
                                                            className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 bg-white"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={block.data.after_label || ''}
                                                            onChange={e => updateBlockData(block.id, { after_label: e.target.value })}
                                                            placeholder="After label"
                                                            className="w-full text-xs border border-gray-200 rounded-xl px-3 py-1.5 bg-white text-emerald-700 font-bold"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* 5. Services Grid */}
                                        {block.type === 'services' && (
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div className="md:col-span-2">
                                                        <label className="block text-xs font-bold text-gray-700 mb-1">Section Heading</label>
                                                        <input
                                                            type="text"
                                                            value={block.data.heading || ''}
                                                            onChange={e => updateBlockData(block.id, { heading: e.target.value })}
                                                            className="w-full text-xs font-bold border border-gray-200 rounded-xl px-3 py-2"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-700 mb-1">Grid Columns</label>
                                                        <select
                                                            value={block.data.columns || '2'}
                                                            onChange={e => updateBlockData(block.id, { columns: e.target.value })}
                                                            className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 bg-white"
                                                        >
                                                            <option value="2">2 Columns</option>
                                                            <option value="3">3 Columns</option>
                                                            <option value="4">4 Columns</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                {/* Treatment Items */}
                                                <div className="space-y-2">
                                                    <label className="block text-xs font-bold text-gray-700">Treatments & Pricing Items:</label>
                                                    {(block.data.items || []).map((item: any, iIdx: number) => (
                                                        <div key={iIdx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                                                            <div className="flex items-center gap-2">
                                                                <input
                                                                    type="text"
                                                                    value={item.name || ''}
                                                                    onChange={e => {
                                                                        const updated = [...block.data.items];
                                                                        updated[iIdx].name = e.target.value;
                                                                        updateBlockData(block.id, { items: updated });
                                                                    }}
                                                                    placeholder="Treatment Name"
                                                                    className="flex-1 text-xs font-bold border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white"
                                                                />
                                                                <input
                                                                    type="text"
                                                                    value={item.price || ''}
                                                                    onChange={e => {
                                                                        const updated = [...block.data.items];
                                                                        updated[iIdx].price = e.target.value;
                                                                        updateBlockData(block.id, { items: updated });
                                                                    }}
                                                                    placeholder="৳ 5,000"
                                                                    className="w-28 text-xs font-bold border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white text-emerald-700"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const updated = block.data.items.filter((_: any, idx: number) => idx !== iIdx);
                                                                        updateBlockData(block.id, { items: updated });
                                                                    }}
                                                                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg"
                                                                >
                                                                    <Trash2 size={13} />
                                                                </button>
                                                            </div>
                                                            <input
                                                                type="text"
                                                                value={item.description || ''}
                                                                onChange={e => {
                                                                    const updated = [...block.data.items];
                                                                    updated[iIdx].description = e.target.value;
                                                                    updateBlockData(block.id, { items: updated });
                                                                }}
                                                                placeholder="Short treatment description"
                                                                className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-1 bg-white text-slate-600"
                                                            />
                                                        </div>
                                                    ))}
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const updated = [...(block.data.items || []), { name: 'New Dental Treatment', price: '৳ 3,000', description: 'Treatment details here.' }];
                                                            updateBlockData(block.id, { items: updated });
                                                        }}
                                                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
                                                    >
                                                        + Add Treatment Item
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* 6. Pricing Table */}
                                        {block.type === 'pricing_table' && (
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-700 mb-1">Section Heading</label>
                                                    <input
                                                        type="text"
                                                        value={block.data.heading || ''}
                                                        onChange={e => updateBlockData(block.id, { heading: e.target.value })}
                                                        className="w-full text-xs font-bold border border-gray-200 rounded-xl px-3 py-2"
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    {(block.data.plans || []).map((plan: any, pIdx: number) => (
                                                        <div key={pIdx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                                                            <div className="flex items-center justify-between gap-2">
                                                                <input
                                                                    type="text"
                                                                    value={plan.name || ''}
                                                                    onChange={e => {
                                                                        const updated = [...block.data.plans];
                                                                        updated[pIdx].name = e.target.value;
                                                                        updateBlockData(block.id, { plans: updated });
                                                                    }}
                                                                    placeholder="Plan Name"
                                                                    className="flex-1 text-xs font-black border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white"
                                                                />
                                                                <input
                                                                    type="text"
                                                                    value={plan.price || ''}
                                                                    onChange={e => {
                                                                        const updated = [...block.data.plans];
                                                                        updated[pIdx].price = e.target.value;
                                                                        updateBlockData(block.id, { plans: updated });
                                                                    }}
                                                                    placeholder="৳ 5,000"
                                                                    className="w-28 text-xs font-black border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white text-emerald-700"
                                                                />
                                                                <label className="flex items-center gap-1 text-xs font-bold text-slate-700 cursor-pointer">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={Boolean(plan.is_popular)}
                                                                        onChange={e => {
                                                                            const updated = [...block.data.plans];
                                                                            updated[pIdx].is_popular = e.target.checked;
                                                                            updateBlockData(block.id, { plans: updated });
                                                                        }}
                                                                    />
                                                                    <span>Popular</span>
                                                                </label>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const updated = block.data.plans.filter((_: any, idx: number) => idx !== pIdx);
                                                                        updateBlockData(block.id, { plans: updated });
                                                                    }}
                                                                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg"
                                                                >
                                                                    <Trash2 size={13} />
                                                                </button>
                                                            </div>
                                                            <textarea
                                                                rows={3}
                                                                value={plan.features || ''}
                                                                onChange={e => {
                                                                    const updated = [...block.data.plans];
                                                                    updated[pIdx].features = e.target.value;
                                                                    updateBlockData(block.id, { plans: updated });
                                                                }}
                                                                placeholder="Features (1 per line)&#10;Feature A&#10;Feature B"
                                                                className="w-full text-xs font-mono border border-gray-200 rounded-lg p-2 bg-white"
                                                            />
                                                        </div>
                                                    ))}
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const updated = [...(block.data.plans || []), { name: 'VIP Dental Plan', price: '৳ 15,000', period: '/ package', features: 'Feature 1\nFeature 2', is_popular: false }];
                                                            updateBlockData(block.id, { plans: updated });
                                                        }}
                                                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
                                                    >
                                                        + Add Pricing Tier
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* 7. Doctors Showcase */}
                                        {block.type === 'doctors' && (
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-700 mb-1">Section Heading</label>
                                                        <input
                                                            type="text"
                                                            value={block.data.heading || ''}
                                                            onChange={e => updateBlockData(block.id, { heading: e.target.value })}
                                                            className="w-full text-xs font-bold border border-gray-200 rounded-xl px-3 py-2"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-700 mb-1">Branch Coverage</label>
                                                        <input
                                                            type="text"
                                                            value={block.data.branch || ''}
                                                            onChange={e => updateBlockData(block.id, { branch: e.target.value })}
                                                            className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-700 mb-1">Doctor Name</label>
                                                        <input
                                                            type="text"
                                                            value={block.data.doctor_name || ''}
                                                            onChange={e => updateBlockData(block.id, { doctor_name: e.target.value })}
                                                            className="w-full text-xs font-bold border border-gray-200 rounded-xl px-3 py-2"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-700 mb-1">Degrees & Certifications</label>
                                                        <input
                                                            type="text"
                                                            value={block.data.degrees || ''}
                                                            onChange={e => updateBlockData(block.id, { degrees: e.target.value })}
                                                            className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* 8. Testimonials */}
                                        {block.type === 'testimonials' && (
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-700 mb-1">Heading</label>
                                                    <input
                                                        type="text"
                                                        value={block.data.heading || ''}
                                                        onChange={e => updateBlockData(block.id, { heading: e.target.value })}
                                                        className="w-full text-xs font-bold border border-gray-200 rounded-xl px-3 py-2"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    {(block.data.items || []).map((rev: any, rIdx: number) => (
                                                        <div key={rIdx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                                                            <div className="flex items-center gap-2">
                                                                <input
                                                                    type="text"
                                                                    value={rev.patient_name || ''}
                                                                    onChange={e => {
                                                                        const updated = [...block.data.items];
                                                                        updated[rIdx].patient_name = e.target.value;
                                                                        updateBlockData(block.id, { items: updated });
                                                                    }}
                                                                    placeholder="Patient Name"
                                                                    className="flex-1 text-xs font-bold border border-gray-200 rounded-lg px-2.5 py-1 bg-white"
                                                                />
                                                                <input
                                                                    type="text"
                                                                    value={rev.branch || ''}
                                                                    onChange={e => {
                                                                        const updated = [...block.data.items];
                                                                        updated[rIdx].branch = e.target.value;
                                                                        updateBlockData(block.id, { items: updated });
                                                                    }}
                                                                    placeholder="Mirpur Branch"
                                                                    className="w-32 text-xs border border-gray-200 rounded-lg px-2.5 py-1 bg-white"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const updated = block.data.items.filter((_: any, idx: number) => idx !== rIdx);
                                                                        updateBlockData(block.id, { items: updated });
                                                                    }}
                                                                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg"
                                                                >
                                                                    <Trash2 size={13} />
                                                                </button>
                                                            </div>
                                                            <textarea
                                                                rows={2}
                                                                value={rev.comment || ''}
                                                                onChange={e => {
                                                                    const updated = [...block.data.items];
                                                                    updated[rIdx].comment = e.target.value;
                                                                    updateBlockData(block.id, { items: updated });
                                                                }}
                                                                placeholder="Patient review comment"
                                                                className="w-full text-xs border border-gray-200 rounded-lg p-2 bg-white"
                                                            />
                                                        </div>
                                                    ))}
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const updated = [...(block.data.items || []), { patient_name: 'Verified Patient', rating: '5', comment: 'Friendly staff and painless treatment!', branch: 'Mirpur Branch' }];
                                                            updateBlockData(block.id, { items: updated });
                                                        }}
                                                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
                                                    >
                                                        + Add Review
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* 9. Stats Counter */}
                                        {block.type === 'stats' && (
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="block text-xs font-bold text-gray-700">Statistics Counters (4 items):</label>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        {(block.data.items || []).map((st: any, sIdx: number) => (
                                                            <div key={sIdx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                                                                <input
                                                                    type="text"
                                                                    value={st.number || ''}
                                                                    onChange={e => {
                                                                        const updated = [...block.data.items];
                                                                        updated[sIdx].number = e.target.value;
                                                                        updateBlockData(block.id, { items: updated });
                                                                    }}
                                                                    placeholder="e.g. 15,000+"
                                                                    className="w-full text-xs font-black border border-gray-200 rounded-lg px-2.5 py-1 bg-white text-[#800038]"
                                                                />
                                                                <input
                                                                    type="text"
                                                                    value={st.label || ''}
                                                                    onChange={e => {
                                                                        const updated = [...block.data.items];
                                                                        updated[sIdx].label = e.target.value;
                                                                        updateBlockData(block.id, { items: updated });
                                                                    }}
                                                                    placeholder="e.g. Happy Smiles"
                                                                    className="w-full text-xs font-bold border border-gray-200 rounded-lg px-2.5 py-1 bg-white"
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* 10. CTA Banner */}
                                        {block.type === 'cta' && (
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-700 mb-1">Headline</label>
                                                        <input
                                                            type="text"
                                                            value={block.data.heading || ''}
                                                            onChange={e => updateBlockData(block.id, { heading: e.target.value })}
                                                            className="w-full text-xs font-bold border border-gray-200 rounded-xl px-3 py-2"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-700 mb-1">Helpline Phone</label>
                                                        <input
                                                            type="text"
                                                            value={block.data.phone || ''}
                                                            onChange={e => updateBlockData(block.id, { phone: e.target.value })}
                                                            className="w-full text-xs font-mono border border-gray-200 rounded-xl px-3 py-2"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-700 mb-1">Subheading</label>
                                                    <input
                                                        type="text"
                                                        value={block.data.subheading || ''}
                                                        onChange={e => updateBlockData(block.id, { subheading: e.target.value })}
                                                        className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* 11. FAQ */}
                                        {block.type === 'faq' && (
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-700 mb-1">Heading</label>
                                                    <input
                                                        type="text"
                                                        value={block.data.heading || ''}
                                                        onChange={e => updateBlockData(block.id, { heading: e.target.value })}
                                                        className="w-full text-xs font-bold border border-gray-200 rounded-xl px-3 py-2"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    {(block.data.items || []).map((faq: any, fIdx: number) => (
                                                        <div key={fIdx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                                                            <div className="flex items-center gap-2">
                                                                <input
                                                                    type="text"
                                                                    value={faq.question || ''}
                                                                    onChange={e => {
                                                                        const updated = [...block.data.items];
                                                                        updated[fIdx].question = e.target.value;
                                                                        updateBlockData(block.id, { items: updated });
                                                                    }}
                                                                    placeholder="Question"
                                                                    className="flex-1 text-xs font-bold border border-gray-200 rounded-lg px-2.5 py-1 bg-white"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const updated = block.data.items.filter((_: any, idx: number) => idx !== fIdx);
                                                                        updateBlockData(block.id, { items: updated });
                                                                    }}
                                                                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg"
                                                                >
                                                                    <Trash2 size={13} />
                                                                </button>
                                                            </div>
                                                            <textarea
                                                                rows={2}
                                                                value={faq.answer || ''}
                                                                onChange={e => {
                                                                    const updated = [...block.data.items];
                                                                    updated[fIdx].answer = e.target.value;
                                                                    updateBlockData(block.id, { items: updated });
                                                                }}
                                                                placeholder="Answer"
                                                                className="w-full text-xs border border-gray-200 rounded-lg p-2 bg-white"
                                                            />
                                                        </div>
                                                    ))}
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const updated = [...(block.data.items || []), { question: 'New Question?', answer: 'Answer here.' }];
                                                            updateBlockData(block.id, { items: updated });
                                                        }}
                                                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
                                                    >
                                                        + Add FAQ
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* 12. Gallery */}
                                        {block.type === 'gallery' && (
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-700 mb-1">Gallery Heading</label>
                                                    <input
                                                        type="text"
                                                        value={block.data.heading || ''}
                                                        onChange={e => updateBlockData(block.id, { heading: e.target.value })}
                                                        className="w-full text-xs font-bold border border-gray-200 rounded-xl px-3 py-2"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    {(block.data.items || []).map((img: any, gIdx: number) => (
                                                        <div key={gIdx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                                                            <input
                                                                type="text"
                                                                value={img.image_url || ''}
                                                                onChange={e => {
                                                                    const updated = [...block.data.items];
                                                                    updated[gIdx].image_url = e.target.value;
                                                                    updateBlockData(block.id, { items: updated });
                                                                }}
                                                                placeholder="https://..."
                                                                className="flex-1 text-xs border border-gray-200 rounded-lg px-2.5 py-1 bg-white font-mono"
                                                            />
                                                            <input
                                                                type="text"
                                                                value={img.caption || ''}
                                                                onChange={e => {
                                                                    const updated = [...block.data.items];
                                                                    updated[gIdx].caption = e.target.value;
                                                                    updateBlockData(block.id, { items: updated });
                                                                }}
                                                                placeholder="Caption"
                                                                className="w-36 text-xs border border-gray-200 rounded-lg px-2.5 py-1 bg-white"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const updated = block.data.items.filter((_: any, idx: number) => idx !== gIdx);
                                                                    updateBlockData(block.id, { items: updated });
                                                                }}
                                                                className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg"
                                                            >
                                                                <Trash2 size={13} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const updated = [...(block.data.items || []), { image_url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80', caption: 'Clinic view' }];
                                                            updateBlockData(block.id, { items: updated });
                                                        }}
                                                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
                                                    >
                                                        + Add Photo
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* 13. Video */}
                                        {block.type === 'video' && (
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-700 mb-1">Video Title</label>
                                                    <input
                                                        type="text"
                                                        value={block.data.title || ''}
                                                        onChange={e => updateBlockData(block.id, { title: e.target.value })}
                                                        className="w-full text-xs font-bold border border-gray-200 rounded-xl px-3 py-2"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-700 mb-1">Video Embed URL (YouTube/Vimeo)</label>
                                                    <input
                                                        type="text"
                                                        value={block.data.video_url || ''}
                                                        onChange={e => updateBlockData(block.id, { video_url: e.target.value })}
                                                        placeholder="https://www.youtube.com/embed/..."
                                                        className="w-full text-xs font-mono border border-gray-200 rounded-xl px-3 py-2"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* 14. Rich Text */}
                                        {block.type === 'rich_text' && (
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-700 mb-1">Article Heading</label>
                                                    <input
                                                        type="text"
                                                        value={block.data.title || ''}
                                                        onChange={e => updateBlockData(block.id, { title: e.target.value })}
                                                        className="w-full text-xs font-bold border border-gray-200 rounded-xl px-3 py-2"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-700 mb-1">HTML / Text Content *</label>
                                                    <textarea
                                                        rows={6}
                                                        value={block.data.content || ''}
                                                        onChange={e => updateBlockData(block.id, { content: e.target.value })}
                                                        className="w-full text-xs font-mono border border-gray-200 rounded-xl p-3 leading-relaxed"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* 15. Alert / Notice */}
                                        {block.type === 'alert' && (
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-700 mb-1">Notice Title</label>
                                                        <input
                                                            type="text"
                                                            value={block.data.title || ''}
                                                            onChange={e => updateBlockData(block.id, { title: e.target.value })}
                                                            className="w-full text-xs font-bold border border-gray-200 rounded-xl px-3 py-2"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-700 mb-1">Notice Style</label>
                                                        <select
                                                            value={block.data.style || 'offer'}
                                                            onChange={e => updateBlockData(block.id, { style: e.target.value })}
                                                            className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 bg-white"
                                                        >
                                                            <option value="offer">Special Offer / Promotion (Rose)</option>
                                                            <option value="success">Success / Verified (Emerald)</option>
                                                            <option value="warning">Warning / Alert (Amber)</option>
                                                            <option value="info">Info / General (Sky)</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-700 mb-1">Message Text</label>
                                                    <textarea
                                                        rows={2}
                                                        value={block.data.message || ''}
                                                        onChange={e => updateBlockData(block.id, { message: e.target.value })}
                                                        className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* 16. Quote */}
                                        {block.type === 'quote' && (
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-700 mb-1">Quote Statement *</label>
                                                    <textarea
                                                        rows={3}
                                                        value={block.data.quote || ''}
                                                        onChange={e => updateBlockData(block.id, { quote: e.target.value })}
                                                        className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 italic font-serif"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-700 mb-1">Author Name</label>
                                                        <input
                                                            type="text"
                                                            value={block.data.author || ''}
                                                            onChange={e => updateBlockData(block.id, { author: e.target.value })}
                                                            className="w-full text-xs font-bold border border-gray-200 rounded-xl px-3 py-2"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-700 mb-1">Designation / Citation</label>
                                                        <input
                                                            type="text"
                                                            value={block.data.citation || ''}
                                                            onChange={e => updateBlockData(block.id, { citation: e.target.value })}
                                                            className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* 17. Steps */}
                                        {block.type === 'steps' && (
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-700 mb-1">Heading</label>
                                                    <input
                                                        type="text"
                                                        value={block.data.heading || ''}
                                                        onChange={e => updateBlockData(block.id, { heading: e.target.value })}
                                                        className="w-full text-xs font-bold border border-gray-200 rounded-xl px-3 py-2"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    {(block.data.items || []).map((step: any, stIdx: number) => (
                                                        <div key={stIdx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                                                            <span className="w-6 h-6 rounded-full bg-[#800038] text-white text-[11px] font-bold flex items-center justify-center shrink-0">{stIdx + 1}</span>
                                                            <input
                                                                type="text"
                                                                value={step.title || ''}
                                                                onChange={e => {
                                                                    const updated = [...block.data.items];
                                                                    updated[stIdx].title = e.target.value;
                                                                    updateBlockData(block.id, { items: updated });
                                                                }}
                                                                placeholder="Step Title"
                                                                className="flex-1 text-xs font-bold border border-gray-200 rounded-lg px-2.5 py-1 bg-white"
                                                            />
                                                            <input
                                                                type="text"
                                                                value={step.desc || ''}
                                                                onChange={e => {
                                                                    const updated = [...block.data.items];
                                                                    updated[stIdx].desc = e.target.value;
                                                                    updateBlockData(block.id, { items: updated });
                                                                }}
                                                                placeholder="Brief explanation"
                                                                className="flex-1 text-xs border border-gray-200 rounded-lg px-2.5 py-1 bg-white text-slate-600"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* 18. Location Card */}
                                        {block.type === 'location_card' && (
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-700 mb-1">Branch Name</label>
                                                        <input
                                                            type="text"
                                                            value={block.data.branch_name || ''}
                                                            onChange={e => updateBlockData(block.id, { branch_name: e.target.value })}
                                                            className="w-full text-xs font-bold border border-gray-200 rounded-xl px-3 py-2"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-700 mb-1">Hotline Phone</label>
                                                        <input
                                                            type="text"
                                                            value={block.data.phone || ''}
                                                            onChange={e => updateBlockData(block.id, { phone: e.target.value })}
                                                            className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-700 mb-1">Branch Physical Address</label>
                                                    <input
                                                        type="text"
                                                        value={block.data.address || ''}
                                                        onChange={e => updateBlockData(block.id, { address: e.target.value })}
                                                        className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-700 mb-1">Working Hours</label>
                                                        <input
                                                            type="text"
                                                            value={block.data.hours || ''}
                                                            onChange={e => updateBlockData(block.id, { hours: e.target.value })}
                                                            className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-700 mb-1">Google Maps Direction URL</label>
                                                        <input
                                                            type="text"
                                                            value={block.data.map_link || ''}
                                                            onChange={e => updateBlockData(block.id, { map_link: e.target.value })}
                                                            className="w-full text-xs font-mono border border-gray-200 rounded-xl px-3 py-2"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* 19. Spacer */}
                                        {block.type === 'spacer' && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-700 mb-1">Spacing Height</label>
                                                    <select
                                                        value={block.data.height || 'medium'}
                                                        onChange={e => updateBlockData(block.id, { height: e.target.value })}
                                                        className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 bg-white"
                                                    >
                                                        <option value="small">Small (24px)</option>
                                                        <option value="medium">Medium (40px)</option>
                                                        <option value="large">Large (64px)</option>
                                                    </select>
                                                </div>
                                                <div className="flex items-center pt-5">
                                                    <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={Boolean(block.data.show_line)}
                                                            onChange={e => updateBlockData(block.id, { show_line: e.target.checked })}
                                                        />
                                                        <span>Show Horizontal Divider Line</span>
                                                    </label>
                                                </div>
                                            </div>
                                        )}

                                        {/* 20. Custom Embed */}
                                        {block.type === 'embed' && (
                                            <div>
                                                <label className="block text-xs font-bold text-gray-700 mb-1">Custom HTML / Iframe / Widget Code</label>
                                                <textarea
                                                    rows={4}
                                                    value={block.data.html || ''}
                                                    onChange={e => updateBlockData(block.id, { html: e.target.value })}
                                                    placeholder="<iframe ...></iframe> or <div>...</div>"
                                                    className="w-full text-xs font-mono border border-gray-200 rounded-xl p-3 bg-slate-900 text-emerald-400"
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Block Library Modal Picker */}
            {isAddMenuOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
                    <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                        {/* Modal Header */}
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                                    <Sparkles size={18} className="text-[#800038]" />
                                    <span>Select Content Block</span>
                                </h3>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Choose from 18+ rich visual blocks to add to your page.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsAddMenuOpen(false)}
                                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Search & Category Filter */}
                        <div className="p-4 bg-gray-50/80 border-b border-gray-100 space-y-3">
                            <div className="relative">
                                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="Search blocks... (e.g. image, split, doctor, pricing, video, stats)"
                                    className="w-full pl-10 pr-4 py-2 bg-white text-xs border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#800038] focus:outline-none"
                                />
                            </div>

                            <div className="flex items-center gap-2 flex-wrap text-xs">
                                <button
                                    type="button"
                                    onClick={() => setSelectedCategory('all')}
                                    className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                                        selectedCategory === 'all' ? 'bg-[#800038] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    All Blocks ({availableBlockTypes.length})
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSelectedCategory('media')}
                                    className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                                        selectedCategory === 'media' ? 'bg-[#800038] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    🎨 Media & Images
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSelectedCategory('dental')}
                                    className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                                        selectedCategory === 'dental' ? 'bg-[#800038] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    🏥 Dental & Pricing
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSelectedCategory('content')}
                                    className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                                        selectedCategory === 'content' ? 'bg-[#800038] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    📝 Text & Layout
                                </button>
                            </div>
                        </div>

                        {/* Block Cards Grid */}
                        <div className="p-4 overflow-y-auto max-h-[500px] grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {filteredBlockTypes.map((typeObj) => {
                                const IconComp = typeObj.icon;
                                return (
                                    <button
                                        key={typeObj.type}
                                        type="button"
                                        onClick={() => addBlock(typeObj)}
                                        className="text-left p-3.5 rounded-2xl border border-gray-200/90 hover:border-[#800038] hover:bg-rose-50/30 transition-all flex items-start gap-3 cursor-pointer group shadow-2xs"
                                    >
                                        <div className={`p-2.5 rounded-xl border ${typeObj.color} shrink-0 group-hover:scale-105 transition-transform`}>
                                            <IconComp size={18} />
                                        </div>
                                        <div className="space-y-0.5 min-w-0">
                                            <div className="text-xs font-black text-gray-900 group-hover:text-[#800038] transition-colors truncate">
                                                {typeObj.name}
                                            </div>
                                            <p className="text-[11px] text-gray-500 leading-snug line-clamp-2">
                                                {typeObj.desc}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
