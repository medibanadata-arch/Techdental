import React, { useEffect, useRef, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { 
    ArrowLeft, Plus, X, Monitor, Tablet, Smartphone, Eye, EyeOff, Code, 
    Undo, Redo, Trash2, Save, Sparkles, CheckCircle2, Globe, 
    Search, Sliders, Box, HelpCircle, Layers, ChevronDown, ChevronUp,
    Maximize2, Minimize2, Grid, Square, FileCode, Check, RefreshCw,
    Info, ExternalLink, RotateCcw, Download, Settings, Tag, Target,
    MousePointer, Lock, ChevronRight, FileText, MoreVertical,
    Image as ImageIcon, Link2
} from 'lucide-react';
import { PageProps } from '@inertiajs/core';

declare global {
    interface Window {
        grapesjs: any;
    }
}

interface PageItem {
    id: number;
    title: string;
    slug: string;
    content: string;
}

interface Props extends PageProps {
    page: PageItem;
}

interface LayerItem {
    cid: string;
    id: string;
    name: string;
    tag: string;
    iconType: 'H' | 'T' | 'box' | 'img' | 'link';
    model: any;
    children: LayerItem[];
}

export default function CustomPagesBuilder({ page }: Props) {
    const editorRef = useRef<any>(null);
    const containerId = useRef(`gjs-studio-sdk-${page.id}`);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    
    // GrapesJS Studio SDK Navigation & Drawer states
    // Default to Pages & Layers view (matching user's latest screenshot!)
    const [isBlocksOpen, setIsBlocksOpen] = useState(false);
    const [activeBlockTab, setActiveBlockTab] = useState<'regular' | 'symbols'>('regular');
    const [activeRightTab, setActiveRightTab] = useState<'styles' | 'properties'>('styles');
    const [currentDevice, setCurrentDevice] = useState<'Desktop' | 'Tablet' | 'Mobile'>('Desktop');
    const [deviceDropdownOpen, setDeviceDropdownOpen] = useState(false);
    const [showOutlines, setShowOutlines] = useState(true);
    const [isPreview, setIsPreview] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    
    // Pages & Layers tree state
    const [pagesCollapse, setPagesCollapse] = useState(false);
    const [pageMenuOpen, setPageMenuOpen] = useState(false);
    const [treeData, setTreeData] = useState<LayerItem[]>([]);
    const [selectedCid, setSelectedCid] = useState<string>('');
    const [collapsedNodes, setCollapsedNodes] = useState<{ [key: string]: boolean }>({});

    // Selection state
    const [selectedTag, setSelectedTag] = useState<string>('Body');
    const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
    const [activeState, setActiveState] = useState<string>('Normal');
    const [searchQuery, setSearchQuery] = useState('');
    const contentRef = useRef<string>(page.content || '');

    // Helper: Parse GrapesJS component hierarchy into layer tree
    const buildLayerTree = (model: any): LayerItem => {
        if (!model) return { cid: '', id: '', name: '', tag: '', iconType: 'box', model: null, children: [] };
        const tag = (model.get('tagName') || 'div').toLowerCase();
        const type = model.get('type') || '';
        let name = model.getName?.() || model.get('name') || '';

        let iconType: 'H' | 'T' | 'box' | 'img' | 'link' = 'box';
        if (/^h[1-6]$/i.test(tag) || type === 'heading') {
            name = 'Heading';
            iconType = 'H';
        } else if (tag === 'p' || tag === 'span' || type === 'text') {
            name = 'Text';
            iconType = 'T';
        } else if (tag === 'img' || type === 'image') {
            name = 'Image';
            iconType = 'img';
        } else if (tag === 'header') {
            name = 'Header';
            iconType = 'box';
        } else if (tag === 'section') {
            name = 'Section';
            iconType = 'box';
        } else if (tag === 'body' || model.is?.('wrapper')) {
            name = 'Body';
            iconType = 'box';
        } else if (tag === 'a' || tag === 'button') {
            name = tag === 'button' ? 'Button' : 'Link';
            iconType = 'link';
        } else if (tag === 'div') {
            name = 'Div';
            iconType = 'box';
        } else if (!name) {
            name = tag.charAt(0).toUpperCase() + tag.slice(1);
        }

        const componentsCollection = model.components ? model.components() : [];
        const children: LayerItem[] = [];
        if (componentsCollection && componentsCollection.models) {
            componentsCollection.models.forEach((child: any) => {
                // In GrapesJS Studio Layers, plain text nodes are not elements in the tree
                if (child.get('type') === 'textnode' || !child.get('tagName')) {
                    return;
                }
                children.push(buildLayerTree(child));
            });
        }

        return {
            cid: model.cid,
            id: model.getId?.() || model.cid,
            name,
            tag,
            iconType,
            model,
            children
        };
    };

    useEffect(() => {
        let isMounted = true;

        const loadScript = (src: string): Promise<void> => {
            return new Promise((resolve, reject) => {
                if (document.querySelector(`script[src="${src}"]`)) {
                    resolve();
                    return;
                }
                const script = document.createElement('script');
                script.src = src;
                script.async = true;
                script.onload = () => resolve();
                script.onerror = (e) => reject(e);
                document.head.appendChild(script);
            });
        };

        const loadStylesheet = (href: string) => {
            if (!document.querySelector(`link[href="${href}"]`)) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = href;
                document.head.appendChild(link);
            }
        };

        const initEditor = async () => {
            try {
                loadStylesheet('https://unpkg.com/grapesjs/dist/css/grapes.min.css');

                if (!window.grapesjs) {
                    await loadScript('https://unpkg.com/grapesjs/dist/grapes.min.js');
                }
                await loadScript('https://unpkg.com/grapesjs-blocks-basic');

                if (!isMounted) return;

                const cId = containerId.current;
                const containerEl = document.getElementById(cId);
                if (!containerEl) return;

                if (editorRef.current) {
                    try {
                        editorRef.current.destroy();
                    } catch (e) {
                        // ignore
                    }
                }

                const initialHtml = (page.content && page.content.trim().length > 0 && !page.content.includes('linear-gradient(135deg, #700030') && !page.content.includes('Tech Dental Care Dhaka'))
                    ? page.content 
                    : `
<header style="padding: 20px 24px; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between;">
    <div style="font-weight: 700; font-size: 18px; color: #1e293b; letter-spacing: -0.5px;">GrapesJS</div>
</header>
<div style="max-width: 600px; margin: 40px auto; padding: 32px 24px; text-align: center; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
    <h1 style="font-size: 26px; font-weight: 800; color: #db2777; margin-bottom: 14px; line-height: 1.2;">Welcome to GrapesJS Studio SDK!</h1>
    <p style="font-size: 14px; color: #64748b; margin-bottom: 18px; line-height: 1.5;">You're currently viewing the default fallback project for web.</p>
    <p style="font-size: 13px; color: #334155; margin-bottom: 8px; line-height: 1.5;">This appears because no storage has been configured yet. To set up your own storage, follow the guide here:</p>
    <p style="font-size: 13px; color: #db2777; margin-bottom: 18px; line-height: 1.5;"><a href="https://app.grapesjs.com/docs-sdk/configuration/projects#self-hosted-storage" style="color: #db2777; text-decoration: underline;">👉 https://app.grapesjs.com/docs-sdk/configuration/projects#self-hosted-storage</a></p>
    <p style="font-size: 13px; color: #334155; margin-bottom: 8px; line-height: 1.5;">Want to customize the fallback project? You can do so by setting options.project.default. Learn more here:</p>
    <p style="font-size: 13px; color: #db2777; margin-bottom: 24px; line-height: 1.5;"><a href="https://app.grapesjs.com/docs-sdk/configuration/projects#setup" style="color: #db2777; text-decoration: underline;">👉 https://app.grapesjs.com/docs-sdk/configuration/projects#setup</a></p>
    <p style="font-size: 14px; font-weight: 600; color: #1e293b; margin-top: 16px;">Happy building! 🚀</p>
</div>
`;

                const editor = window.grapesjs.init({
                    container: `#${cId}`,
                    height: '100%',
                    width: '100%',
                    fromElement: false,
                    storageManager: false,
                    // Completely disable default floating overlays
                    panels: { defaults: [] },
                    components: initialHtml,
                    plugins: ['gjs-blocks-basic'],
                    pluginsOpts: {
                        'gjs-blocks-basic': {
                            flexGrid: true,
                        }
                    },
                    canvas: {
                        styles: [
                            'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css'
                        ]
                    },
                    deviceManager: {
                        devices: [
                            { name: 'Desktop', width: '' },
                            { name: 'Tablet', width: '768px', widthMedia: '992px' },
                            { name: 'Mobile', width: '375px', widthMedia: '480px' }
                        ]
                    },
                    blockManager: {
                        appendTo: `#${cId}-blocks`,
                    },
                    styleManager: {
                        appendTo: `#${cId}-styles`,
                        sectors: [
                            {
                                name: 'Space',
                                open: true,
                                buildProps: ['padding', 'margin'],
                            },
                            {
                                name: 'Typography',
                                open: true,
                                buildProps: ['font-family', 'font-size', 'font-weight', 'color', 'line-height', 'letter-spacing', 'text-align', 'text-decoration'],
                            },
                            {
                                name: 'Background',
                                open: true,
                                buildProps: ['background-color', 'background', 'background-image'],
                            },
                            {
                                name: 'Borders',
                                open: false,
                                buildProps: ['border-radius', 'border', 'box-shadow'],
                            },
                            {
                                name: 'Effects',
                                open: false,
                                buildProps: ['opacity', 'transition', 'transform'],
                            }
                        ]
                    },
                    traitManager: {
                        appendTo: `#${cId}-traits`,
                    }
                });

                const bm = editor.BlockManager;

                // 1. BASIC CATEGORY (Clean Studio Icons matching Screenshot 2 & 3)
                bm.add('section-block', {
                    label: 'Section',
                    category: 'Basic',
                    media: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 6h18M3 18h18"/><rect x="5" y="9" width="14" height="6" rx="1" fill="currentColor" fill-opacity="0.15"/></svg>`,
                    content: `<div style="padding: 50px 24px; margin: 15px 0; background-color: #ffffff; border: 2px dashed #cbd5e1; border-radius: 12px; text-align: center;"><h3 style="font-size: 20px; font-weight: 700; color: #1e293b; margin-bottom: 6px;">New Section</h3><p style="color: #64748b; font-size: 14px;">Drop components inside this container.</p></div>`,
                });

                bm.add('divider-block', {
                    label: 'Divider',
                    category: 'Basic',
                    media: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M12 4v4m0 8v4M9 6l3-3 3 3M9 18l3 3 3-3"/></svg>`,
                    content: `<hr style="margin: 28px 0; border: 0; border-top: 1.5px solid #e2e8f0;" />`,
                });

                bm.add('heading-block', {
                    label: 'Heading',
                    category: 'Basic',
                    media: `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M5 4h3.5v6.5h7V4H19v16h-3.5v-6.5h-7V20H5V4z"/></svg>`,
                    content: `<h2 style="font-size: 30px; font-weight: 800; color: #0f172a; margin: 16px 0 10px;">Specialized Dental Headline</h2>`,
                });

                bm.add('text-block', {
                    label: 'Text',
                    category: 'Basic',
                    media: `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M4 5h16v3.5h-6.2v11.5h-3.6V8.5H4V5z"/></svg>`,
                    content: `<p style="font-size: 15px; color: #475569; line-height: 1.6; margin: 8px 0;">Insert your comprehensive text description or paragraph details here.</p>`,
                });

                bm.add('link-block', {
                    label: 'Link',
                    category: 'Basic',
                    media: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
                    content: `<a href="#" style="color: #7c3aed; font-weight: 600; text-decoration: underline;">Clickable Text Link</a>`,
                });

                bm.add('link-box-block', {
                    label: 'Link Box',
                    category: 'Basic',
                    media: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 12a3 3 0 0 0 4 2.8M16 12a3 3 0 0 0-4-2.8"/></svg>`,
                    content: `<a href="#" style="display: block; padding: 22px; border: 1px solid #e2e8f0; border-radius: 12px; text-decoration: none; color: #700030; background: #ffffff; font-weight: 700; box-shadow: 0 4px 12px rgba(0,0,0,0.04);">Clickable Feature Box &rarr;</a>`,
                });

                bm.add('image-block', {
                    label: 'Image',
                    category: 'Basic',
                    media: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/><path d="M21 15l-5-5L5 21"/></svg>`,
                    content: `<img src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&auto=format&fit=crop" style="width: 100%; max-width: 600px; height: auto; border-radius: 10px; margin: 10px 0;" alt="Dental Image" />`,
                });

                bm.add('image-box-block', {
                    label: 'Image Box',
                    category: 'Basic',
                    media: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2" stroke-dasharray="2 2"/><rect x="5.5" y="5.5" width="13" height="13" rx="1.5"/><circle cx="9.5" cy="9.5" r="1.2" fill="currentColor"/><path d="M18.5 14.5l-4-4-5 5"/></svg>`,
                    content: `
                        <div style="text-align: center; padding: 16px; border: 1px solid #e2e8f0; border-radius: 14px; background: #ffffff; box-shadow: 0 4px 14px rgba(0,0,0,0.03);">
                            <img src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&auto=format&fit=crop" style="width: 100%; height: 200px; object-fit: cover; border-radius: 10px; margin-bottom: 12px;" alt="Dental Care" />
                            <h4 style="font-weight: 800; color: #0f172a; margin: 6px 0; font-size: 16px;">State of the Art Equipment</h4>
                            <p style="font-size: 13px; color: #64748b; line-height: 1.5;">Safe, sterile, and computer-guided dental operations.</p>
                        </div>
                    `,
                });

                bm.add('video-block', {
                    label: 'Video',
                    category: 'Basic',
                    media: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2.5" y="4.5" width="19" height="15" rx="3"/><polygon points="10 8.5 16 12 10 15.5" fill="currentColor"/></svg>`,
                    content: `<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 12px; margin: 15px 0;"><iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" style="position: absolute; top:0; left: 0; width: 100%; height: 100%; border:0;" allowfullscreen></iframe></div>`,
                });

                bm.add('map-block', {
                    label: 'Map',
                    category: 'Basic',
                    media: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>`,
                    content: `<iframe src="https://maps.google.com/maps?q=Dhaka&t=&z=13&ie=UTF8&iwloc=&output=embed" style="width: 100%; height: 260px; border: 0; border-radius: 12px; margin: 15px 0;"></iframe>`,
                });

                bm.add('icon-block', {
                    label: 'Icon',
                    category: 'Basic',
                    media: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="6 3 18 3 22 9 12 22 2 9"/><line x1="2" y1="9" x2="22" y2="9"/><line x1="12" y1="22" x2="6" y2="3"/><line x1="12" y1="22" x2="18" y2="3"/></svg>`,
                    content: `<div style="display: inline-block; font-size: 32px; color: #7c3aed; padding: 8px;">💎</div>`,
                });

                // 2. FORMS CATEGORY (Matching Screenshot 3)
                bm.add('form-block', {
                    label: 'Form',
                    category: 'Forms',
                    media: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="14" y2="12"/><line x1="7" y1="16" x2="11" y2="16"/></svg>`,
                    content: `<form style="padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;"></form>`,
                });

                bm.add('input-block', {
                    label: 'Input',
                    category: 'Forms',
                    media: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="7" width="18" height="10" rx="3"/><line x1="7" y1="10" x2="7" y2="14"/></svg>`,
                    content: `<input type="text" placeholder="Enter text..." style="width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 6px; margin: 8px 0; font-size: 14px;" />`,
                });

                bm.add('textarea-block', {
                    label: 'Textarea',
                    category: 'Forms',
                    media: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><line x1="6" y1="9" x2="14" y2="9"/><line x1="6" y1="12" x2="16" y2="12"/><line x1="6" y1="15" x2="10" y2="15"/></svg>`,
                    content: `<textarea rows="4" placeholder="Enter details..." style="width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 6px; margin: 8px 0; font-size: 14px;"></textarea>`,
                });

                bm.add('select-block', {
                    label: 'Select',
                    category: 'Forms',
                    media: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="7" width="18" height="10" rx="2"/><path d="M16 11l-2 2-2-2"/></svg>`,
                    content: `<select style="width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 6px; margin: 8px 0; font-size: 14px; background: #fff;"><option>Option 1</option><option>Option 2</option></select>`,
                });

                bm.add('button-block', {
                    label: 'Button',
                    category: 'Forms',
                    media: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="8" width="16" height="8" rx="2"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`,
                    content: `<button type="button" style="background: #7c3aed; color: #ffffff; font-weight: 700; padding: 11px 24px; border-radius: 6px; border: none; cursor: pointer; font-size: 14px;">Button</button>`,
                });

                bm.add('label-block', {
                    label: 'Label',
                    category: 'Forms',
                    media: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 6h16M4 12h10"/><rect x="3" y="4" width="18" height="16" rx="2" stroke-dasharray="2 2"/></svg>`,
                    content: `<label style="font-size: 13px; font-weight: 600; color: #374151; display: block; margin-bottom: 4px;">Form Label</label>`,
                });

                bm.add('checkbox-block', {
                    label: 'Checkbox',
                    category: 'Forms',
                    media: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M9 12l2 2 4-4" stroke-width="2.2"/></svg>`,
                    content: `<label style="display: flex; align-items: center; gap: 8px; font-size: 14px; cursor: pointer;"><input type="checkbox" style="width: 16px; height: 16px;" /> I agree to the terms</label>`,
                });

                bm.add('radio-block', {
                    label: 'Radio',
                    category: 'Forms',
                    media: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4" fill="currentColor"/></svg>`,
                    content: `<label style="display: flex; align-items: center; gap: 8px; font-size: 14px; cursor: pointer;"><input type="radio" name="opt" style="width: 16px; height: 16px;" /> Select option</label>`,
                });

                // 3. EXTRA CATEGORY (Matching Screenshot 3)
                bm.add('navbar-block', {
                    label: 'Navbar',
                    category: 'Extra',
                    media: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="6" cy="12" r="1.5" fill="currentColor"/><line x1="12" y1="12" x2="14" y2="12"/><line x1="16" y1="12" x2="18" y2="12"/></svg>`,
                    content: `
                        <nav style="display: flex; align-items: center; justify-content: space-between; padding: 16px 24px; background: #ffffff; border-bottom: 1px solid #e2e8f0;">
                            <strong style="font-size: 18px; color: #700030;">Tech Dental</strong>
                            <div style="display: flex; gap: 18px; font-size: 14px; font-weight: 600;">
                                <a href="#" style="color: #334155; text-decoration: none;">Home</a>
                                <a href="#" style="color: #334155; text-decoration: none;">Services</a>
                                <a href="#" style="color: #334155; text-decoration: none;">Doctors</a>
                                <a href="#" style="color: #334155; text-decoration: none;">Contact</a>
                            </div>
                        </nav>
                    `,
                });

                // 4. SPECIALIZED DENTAL COMPONENTS (Clinic Presets)
                bm.add('dental-hero', {
                    label: 'Hero Banner',
                    category: 'Dental Components',
                    media: `<span style="font-size: 20px;">🦷</span>`,
                    content: `
                        <section style="padding: 60px 24px; background: linear-gradient(135deg, #700030 0%, #2A0845 100%); color: #ffffff; text-align: center; border-radius: 16px; margin: 15px 0; box-shadow: 0 10px 30px rgba(112,0,48,0.25);">
                            <span style="background: rgba(255,255,255,0.2); backdrop-filter: blur(8px); padding: 7px 16px; border-radius: 30px; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; border: 1px solid rgba(255,255,255,0.3);">Tech Dental Care</span>
                            <h1 style="font-size: 38px; margin: 18px 0 12px; font-weight: 800; line-height: 1.2;">Advanced Digital Dentistry in Dhaka</h1>
                            <p style="font-size: 16px; max-width: 620px; margin: 0 auto 24px; color: #fce7f3; line-height: 1.6;">Painless root canals, single-visit laser teeth whitening, and precision dental implants backed by certified specialists.</p>
                            <div>
                                <a href="/appointment" style="background: #ffffff; color: #700030; font-weight: 800; padding: 13px 32px; border-radius: 30px; text-decoration: none; display: inline-block; box-shadow: 0 4px 18px rgba(0,0,0,0.18); font-size: 15px;">Book Appointment Now &rarr;</a>
                            </div>
                        </section>
                    `,
                });

                bm.add('dental-services-grid', {
                    label: 'Treatments Grid',
                    category: 'Dental Components',
                    media: `<span style="font-size: 20px;">💎</span>`,
                    content: `
                        <div style="padding: 30px 10px; margin: 15px 0; font-family: sans-serif;">
                            <h2 style="text-align: center; font-size: 28px; color: #0f172a; margin-bottom: 24px; font-weight: 800;">Our Specialized Treatments</h2>
                            <div style="display: flex; gap: 18px; flex-wrap: wrap; justify-content: center;">
                                <div style="flex: 1; min-width: 240px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 22px; box-shadow: 0 4px 14px rgba(0,0,0,0.04); text-align: left;">
                                    <div style="font-size: 30px; margin-bottom: 10px;">🦷</div>
                                    <h3 style="font-size: 18px; font-weight: 800; color: #700030; margin-bottom: 6px;">Single-Sitting RCT</h3>
                                    <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin-bottom: 12px;">Rotary pain-free root canal treatment with apex locator precision.</p>
                                    <span style="font-weight: 800; color: #059669; font-size: 14px;">From ৳ 4,500</span>
                                </div>
                                <div style="flex: 1; min-width: 240px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 22px; box-shadow: 0 4px 14px rgba(0,0,0,0.04); text-align: left;">
                                    <div style="font-size: 30px; margin-bottom: 10px;">💎</div>
                                    <h3 style="font-size: 18px; font-weight: 800; color: #700030; margin-bottom: 6px;">Laser Teeth Whitening</h3>
                                    <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin-bottom: 12px;">Get 6-8 shades whiter smile in a single 45-minute clinic session.</p>
                                    <span style="font-weight: 800; color: #059669; font-size: 14px;">৳ 6,000</span>
                                </div>
                                <div style="flex: 1; min-width: 240px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 22px; box-shadow: 0 4px 14px rgba(0,0,0,0.04); text-align: left;">
                                    <div style="font-size: 30px; margin-bottom: 10px;">📐</div>
                                    <h3 style="font-size: 18px; font-weight: 800; color: #700030; margin-bottom: 6px;">Invisible Aligners</h3>
                                    <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin-bottom: 12px;">Clear orthodontic aligners for teeth straightening without metal wires.</p>
                                    <span style="font-weight: 800; color: #059669; font-size: 14px;">From ৳ 50,000</span>
                                </div>
                            </div>
                        </div>
                    `,
                });

                // Function to rebuild React Layer Tree from GrapesJS DOM
                const updateTree = () => {
                    const wrapper = editor.getWrapper();
                    if (wrapper) {
                        setTreeData([buildLayerTree(wrapper)]);
                    }
                };

                editor.on('load', () => {
                    try {
                        editor.runCommand('sw-visibility');
                    } catch (e) {
                        // ignore
                    }

                    updateTree();

                    // Auto-select heading element to match user's screenshot
                    try {
                        const wrapper = editor.getWrapper();
                        const headingComp = wrapper.find('h1')[0] || wrapper.find('h2')[0];
                        if (headingComp) {
                            editor.select(headingComp);
                            setSelectedCid(headingComp.cid);
                            setSelectedTag(headingComp.get('tagName')?.toUpperCase() || 'Heading');
                        }
                    } catch (e) {
                        // ignore
                    }

                    // Click-to-insert block
                    const blocksContainer = document.getElementById(`${cId}-blocks`);
                    if (blocksContainer) {
                        blocksContainer.addEventListener('click', (e) => {
                            const blockEl = (e.target as HTMLElement).closest('.gjs-block');
                            if (blockEl) {
                                const blockId = blockEl.getAttribute('title') || blockEl.textContent?.trim();
                                if (blockId) {
                                    const block = editor.BlockManager.get(blockId) || 
                                                  editor.BlockManager.getAll().find((b: any) => b.get('label') === blockId || b.getId() === blockId);
                                    if (block) {
                                        editor.addComponents(block.get('content'));
                                    }
                                }
                            }
                        });
                    }
                });

                editor.on('component:selected', (model: any) => {
                    if (model) {
                        setSelectedCid(model.cid);
                        const tag = model.get('tagName') || model.getName() || 'Element';
                        const classes = model.getClasses() || [];
                        setSelectedTag(tag);
                        setSelectedClasses(classes);
                    } else {
                        setSelectedCid('');
                        setSelectedTag('Body');
                        setSelectedClasses([]);
                    }
                    setActiveRightTab('styles');
                });

                const syncContent = () => {
                    const html = editor.getHtml();
                    const css = editor.getCss();
                    contentRef.current = (html || '') + (css ? `\n<style>\n${css}\n</style>` : '');
                    updateTree();
                };

                editor.on('update', syncContent);
                editor.on('component:add', syncContent);
                editor.on('component:remove', syncContent);
                editor.on('component:update', syncContent);
                editor.on('style:property:update', syncContent);

                editorRef.current = editor;
                setIsLoading(false);
            } catch (err) {
                console.error('Failed to initialize GrapesJS:', err);
                setIsLoading(false);
            }
        };

        initEditor();

        return () => {
            isMounted = false;
            if (editorRef.current) {
                try {
                    editorRef.current.destroy();
                } catch (e) {
                    // ignore
                }
            }
        };
    }, []);

    // Filter widgets by search query
    useEffect(() => {
        const blocksContainer = document.getElementById(`${containerId.current}-blocks`);
        if (!blocksContainer) return;

        const blocks = blocksContainer.querySelectorAll('.gjs-block');
        blocks.forEach((el: any) => {
            const text = (el.textContent || '').toLowerCase();
            const matches = searchQuery.trim() === '' || text.includes(searchQuery.toLowerCase());
            el.style.display = matches ? 'flex' : 'none';
        });
    }, [searchQuery]);

    const changeDevice = (device: 'Desktop' | 'Tablet' | 'Mobile') => {
        if (!editorRef.current) return;
        setCurrentDevice(device);
        editorRef.current.setDevice(device);
        setDeviceDropdownOpen(false);
    };

    const toggleOutlines = () => {
        if (!editorRef.current) return;
        const newState = !showOutlines;
        setShowOutlines(newState);
        if (newState) {
            editorRef.current.runCommand('sw-visibility');
        } else {
            editorRef.current.stopCommand('sw-visibility');
        }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
        } else {
            document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
        }
    };

    const togglePreview = () => {
        if (!editorRef.current) return;
        const active = editorRef.current.Commands.isActive('preview');
        if (active) {
            editorRef.current.stopCommand('preview');
            setIsPreview(false);
        } else {
            editorRef.current.runCommand('preview');
            setIsPreview(true);
        }
    };

    const handleDeleteSelected = () => {
        if (editorRef.current) {
            const selected = editorRef.current.getSelected();
            if (selected) {
                selected.remove();
            }
        }
    };

    const handleClearCanvas = () => {
        if (!editorRef.current) return;
        if (confirm('Are you sure you want to clear the entire canvas?')) {
            editorRef.current.setComponents('');
            contentRef.current = '';
        }
    };

    const handleSave = () => {
        if (!editorRef.current) return;
        setIsSaving(true);
        
        const html = editorRef.current.getHtml();
        const css = editorRef.current.getCss();
        const fullContent = (html || '') + (css ? `\n<style>\n${css}\n</style>` : '');

        router.put(route('pages.update', page.id), {
            title: page.title,
            slug: page.slug,
            content: fullContent,
        }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setIsSaving(false);
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 3000);
            },
            onError: () => {
                setIsSaving(false);
                alert('Failed to save page changes.');
            }
        });
    };

    // Recursive Layer Item Renderer matching user's exact screenshot!
    const renderLayerNode = (node: LayerItem, level: number = 0) => {
        const isSelected = selectedCid === node.cid;
        const hasChildren = node.children && node.children.length > 0;
        const isCollapsed = collapsedNodes[node.cid] !== undefined 
            ? collapsedNodes[node.cid] 
            : (node.name === 'Header' || (node.name === 'Text' && hasChildren));

        const handleSelect = (e: React.MouseEvent) => {
            e.stopPropagation();
            if (editorRef.current && node.model) {
                editorRef.current.select(node.model);
                setSelectedCid(node.cid);
            }
        };

        const toggleCollapse = (e: React.MouseEvent) => {
            e.stopPropagation();
            setCollapsedNodes(prev => ({ ...prev, [node.cid]: !isCollapsed }));
        };

        return (
            <div key={node.cid} className="flex flex-col">
                <div
                    onClick={handleSelect}
                    className={`group flex items-center h-6 text-xs cursor-pointer select-none transition-colors pr-2 ${
                        isSelected 
                            ? 'bg-[#e0f2fe] text-[#0284c7] font-medium' 
                            : 'text-gray-800 hover:bg-gray-50'
                    }`}
                    style={{ paddingLeft: `${Math.max(8, level * 10 + 8)}px` }}
                >
                    {/* Arrow toggle or placeholder */}
                    <div 
                        onClick={hasChildren ? toggleCollapse : undefined}
                        className="w-3.5 h-3.5 flex items-center justify-center mr-0.5 text-gray-500 hover:text-gray-800 cursor-pointer"
                    >
                        {hasChildren ? (
                            isCollapsed ? (
                                <span className="text-[8px] leading-none text-gray-600">▸</span>
                            ) : (
                                <span className="text-[8px] leading-none text-gray-600">▾</span>
                            )
                        ) : (
                            <span className="w-1.5" />
                        )}
                    </div>

                    {/* Node Type Icon: Square / H / T / Img / Link */}
                    <div className="w-3.5 h-3.5 flex items-center justify-center mr-1 shrink-0">
                        {node.iconType === 'box' && (
                            <div className={`w-2.5 h-2.5 border rounded-xs ${isSelected ? 'border-[#0284c7]' : 'border-gray-600'}`} />
                        )}
                        {node.iconType === 'H' && (
                            <span className={`font-serif font-bold text-xs leading-none ${isSelected ? 'text-[#0284c7]' : 'text-gray-800'}`}>H</span>
                        )}
                        {node.iconType === 'T' && (
                            <span className={`font-sans font-bold text-xs leading-none ${isSelected ? 'text-[#0284c7]' : 'text-gray-800'}`}>T</span>
                        )}
                        {node.iconType === 'img' && (
                            <ImageIcon size={11} className={isSelected ? 'text-[#0284c7]' : 'text-gray-500'} />
                        )}
                        {node.iconType === 'link' && (
                            <Link2 size={11} className={isSelected ? 'text-[#0284c7]' : 'text-gray-500'} />
                        )}
                    </div>

                    {/* Node Name (e.g. Body, Header, Div, Heading, Text) */}
                    <span className="truncate flex-1 text-[11.5px]">
                        {node.name}
                    </span>

                    {/* Hover Action: Eye (Toggle visibility) */}
                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-gray-400 transition-opacity">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (node.model) {
                                    const style = node.model.getStyle();
                                    const isHidden = style.display === 'none';
                                    node.model.setStyle({ ...style, display: isHidden ? '' : 'none' });
                                    editorRef.current?.trigger('change:canvasOffset');
                                }
                            }}
                            className="p-0.5 hover:text-gray-700"
                            title="Toggle Visibility"
                        >
                            <Eye size={11} />
                        </button>
                    </div>
                </div>

                {/* Recursive Children */}
                {hasChildren && !isCollapsed && (
                    <div className="flex flex-col">
                        {node.children.map(child => renderLayerNode(child, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 w-screen h-screen z-50 flex flex-col bg-white overflow-hidden select-none font-sans text-slate-800 antialiased">
            <Head title={`Visual Builder — ${page.title}`} />

            {/* ========================================================
                TOP CONTINUOUS HEADER BAR: EXACT HUBUHU GRAPESJS STUDIO SDK
                - Left (240px): Pages + ^ (or Blocks x)
                - Center (flex-1): Purple '+' Button, Back Link, Desktop Dropdown, Action Icons, Update
                - Right (270px): Styles | Properties Tabs
            ======================================================== */}
            <header className="h-[42px] bg-white border-b border-gray-200 flex items-center z-30 select-none">
                
                {/* 1. LEFT HEADER (Width: 240px matching left sidebar, bordered right) */}
                <div className="w-[240px] h-full border-r border-gray-200 px-3 flex items-center justify-between shrink-0 bg-white">
                    {!isBlocksOpen ? (
                        <>
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-800">
                                <FileText size={14} className="text-gray-700" />
                                <span>Pages</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => alert(`Active Page: ${page.title}`)}
                                    className="text-gray-500 hover:text-gray-800 p-0.5 cursor-pointer"
                                    title="Add Page"
                                >
                                    <Plus size={13} className="stroke-[2.5]" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPagesCollapse(!pagesCollapse)}
                                    className="text-gray-500 hover:text-gray-800 p-0.5 cursor-pointer"
                                    title="Toggle Pages"
                                >
                                    <ChevronUp size={13} className={`transition-transform duration-200 ${pagesCollapse ? 'rotate-180' : ''}`} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <span className="text-xs font-bold text-gray-800">Blocks</span>
                            <button
                                type="button"
                                onClick={() => setIsBlocksOpen(false)}
                                className="text-gray-400 hover:text-gray-700 p-0.5 cursor-pointer"
                                title="Close Blocks"
                            >
                                <X size={14} />
                            </button>
                        </>
                    )}
                </div>

                {/* 2. CENTER HEADER (Flex-1 across canvas) */}
                <div className="flex-1 h-full px-3 flex items-center justify-between bg-white">
                    {/* Left: The Purple Square Button (Directly adjacent to left sidebar divider - EXACT user screenshot!) */}
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setIsBlocksOpen(!isBlocksOpen)}
                            className="w-7 h-7 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-md flex items-center justify-center transition shadow-xs cursor-pointer"
                            title={isBlocksOpen ? "Close Blocks" : "Add Blocks"}
                        >
                            {isBlocksOpen ? <X size={15} /> : <Plus size={16} className="stroke-[2.5]" />}
                        </button>

                        <Link
                            href={route('pages.edit', page.id)}
                            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 px-2 py-1 rounded hover:bg-gray-100 transition"
                            title="Back to Pages"
                        >
                            <ArrowLeft size={13} />
                            <span className="hidden sm:inline font-medium text-[11px]">Pages</span>
                        </Link>
                    </div>

                    {/* Center: Device Dropdown (Desktop v) */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setDeviceDropdownOpen(!deviceDropdownOpen)}
                            className="flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded text-xs font-semibold text-gray-700 hover:border-gray-300 shadow-2xs cursor-pointer"
                        >
                            {currentDevice === 'Desktop' && <Monitor size={13} />}
                            {currentDevice === 'Tablet' && <Tablet size={13} />}
                            {currentDevice === 'Mobile' && <Smartphone size={13} />}
                            <span>{currentDevice}</span>
                            <ChevronDown size={12} className="text-gray-400 ml-0.5" />
                        </button>

                        {deviceDropdownOpen && (
                            <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 w-36 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50 text-xs">
                                <button
                                    type="button"
                                    onClick={() => changeDevice('Desktop')}
                                    className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-purple-50 hover:text-[#7c3aed] text-left font-medium"
                                >
                                    <Monitor size={13} />
                                    <span>Desktop (100%)</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => changeDevice('Tablet')}
                                    className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-purple-50 hover:text-[#7c3aed] text-left font-medium"
                                >
                                    <Tablet size={13} />
                                    <span>Tablet (768px)</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => changeDevice('Mobile')}
                                    className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-purple-50 hover:text-[#7c3aed] text-left font-medium"
                                >
                                    <Smartphone size={13} />
                                    <span>Mobile (375px)</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right: Action Icons */}
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={toggleOutlines}
                            className={`p-1.5 rounded transition cursor-pointer ${
                                showOutlines ? 'text-[#7c3aed] bg-purple-50' : 'text-gray-600 hover:bg-gray-100'
                            }`}
                            title="Component Outlines"
                        >
                            <Square size={14} className="stroke-[2]" />
                        </button>

                        <button
                            type="button"
                            onClick={togglePreview}
                            className={`p-1.5 rounded transition cursor-pointer ${
                                isPreview ? 'text-amber-600 bg-amber-50' : 'text-gray-600 hover:bg-gray-100'
                            }`}
                            title="Preview Mode"
                        >
                            {isPreview ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>

                        <button
                            type="button"
                            onClick={toggleFullscreen}
                            className="p-1.5 rounded text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                            title="Fullscreen"
                        >
                            <Maximize2 size={14} />
                        </button>

                        <button
                            type="button"
                            onClick={() => editorRef.current?.runCommand('export-template')}
                            className="p-1.5 rounded text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                            title="View Code"
                        >
                            <Code size={14} />
                        </button>

                        <button
                            type="button"
                            onClick={() => editorRef.current?.runCommand('export-template')}
                            className="p-1.5 rounded text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                            title="Export Template"
                        >
                            <Download size={14} />
                        </button>

                        <button
                            type="button"
                            onClick={handleDeleteSelected}
                            className="p-1.5 rounded text-gray-600 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                            title="Delete Selected"
                        >
                            <Trash2 size={14} />
                        </button>

                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={isSaving}
                            className="p-1.5 rounded text-[#7c3aed] hover:bg-purple-50 transition cursor-pointer"
                            title="Save Changes"
                        >
                            {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                        </button>

                        <button
                            type="button"
                            onClick={() => editorRef.current?.runCommand('core:undo')}
                            className="p-1.5 rounded text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                            title="Undo"
                        >
                            <Undo size={14} />
                        </button>

                        <button
                            type="button"
                            onClick={() => editorRef.current?.runCommand('core:redo')}
                            className="p-1.5 rounded text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                            title="Redo"
                        >
                            <Redo size={14} />
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveRightTab(activeRightTab === 'properties' ? 'styles' : 'properties')}
                            className="p-1.5 rounded text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                            title="Settings"
                        >
                            <Settings size={14} />
                        </button>

                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={isSaving}
                            className="ml-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-3 py-1 rounded text-xs font-semibold shadow-xs transition cursor-pointer flex items-center gap-1.5"
                        >
                            {saveSuccess ? (
                                <>
                                    <Check size={13} className="text-white" />
                                    <span>Saved</span>
                                </>
                            ) : isSaving ? (
                                <span>Saving...</span>
                            ) : (
                                <span>Update</span>
                            )}
                        </button>
                    </div>
                </div>

                {/* 3. RIGHT HEADER (Width: 270px matching right inspector, bordered left) */}
                <div className="w-[270px] h-full border-l border-gray-200 flex items-center bg-white shrink-0">
                    <button
                        type="button"
                        onClick={() => setActiveRightTab('styles')}
                        className={`flex-1 h-full flex items-center justify-center text-xs font-semibold transition border-b-2 cursor-pointer ${
                            activeRightTab === 'styles'
                                ? 'text-[#7c3aed] border-[#7c3aed] font-bold'
                                : 'text-gray-500 border-transparent hover:text-gray-800'
                        }`}
                    >
                        Styles
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveRightTab('properties')}
                        className={`flex-1 h-full flex items-center justify-center text-xs font-semibold transition border-b-2 cursor-pointer ${
                            activeRightTab === 'properties'
                                ? 'text-[#7c3aed] border-[#7c3aed] font-bold'
                                : 'text-gray-500 border-transparent hover:text-gray-800'
                        }`}
                    >
                        Properties
                    </button>
                </div>
            </header>

            {/* ========================================================
                MAIN 3-COLUMN WORKSPACE:
                - Left: Exact Pages & Layers Sidebar (Latest Screenshot) + Blocks Drawer on Purple '+' Toggle!
                - Center: Centered Canvas with Soft Neutral Gray Background (#ececec)
                - Right: Exact GrapesJS Studio Styles / Properties Inspector (Screenshot 5)
            ======================================================== */}
            <div className="flex-1 flex overflow-hidden relative bg-[#ececec]">
                
                {/* 1. LEFT SIDEBAR: EXACT PAGES & LAYERS (Latest Screenshot) */}
                <aside className={`w-[240px] bg-white border-r border-gray-200 flex flex-col h-full z-20 select-none shadow-2xs transition-all duration-200 shrink-0 ${
                    isPreview ? '-ml-[240px]' : 'ml-0'
                }`}>
                    
                    {/* CONTAINER A: BLOCKS DRAWER */}
                    <div className={`flex flex-col h-full bg-white ${isBlocksOpen ? 'flex' : 'hidden'}`}>
                        {/* Pill Tabs: Regular | Symbols */}
                        <div className="p-3 border-b border-gray-100">
                            <div className="flex items-center bg-gray-100 p-0.5 rounded-full text-[11px] font-semibold mb-2">
                                <button
                                    type="button"
                                    onClick={() => setActiveBlockTab('regular')}
                                    className={`flex-1 py-0.5 rounded-full text-center transition cursor-pointer ${
                                        activeBlockTab === 'regular'
                                            ? 'bg-white text-[#7c3aed] shadow-2xs font-bold'
                                            : 'text-gray-500 hover:text-gray-800'
                                    }`}
                                >
                                    Regular
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveBlockTab('symbols')}
                                    className={`flex-1 py-0.5 rounded-full text-center transition cursor-pointer ${
                                        activeBlockTab === 'symbols'
                                            ? 'bg-white text-[#7c3aed] shadow-2xs font-bold'
                                            : 'text-gray-500 hover:text-gray-800'
                                    }`}
                                >
                                    Symbols
                                </button>
                            </div>

                            {/* Search Input */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full text-xs px-2.5 py-1 bg-white border border-gray-200 rounded focus:ring-1 focus:ring-[#7c3aed] focus:border-[#7c3aed] focus:outline-none placeholder:text-gray-400 font-normal"
                                />
                            </div>
                        </div>

                        {/* GrapesJS Blocks Container (2-Column Grid) */}
                        <div className="flex-1 overflow-y-auto p-2.5 bg-white custom-scrollbar">
                            <div id={`${containerId.current}-blocks`} className="gjs-studio-blocks-grid" />
                        </div>
                    </div>

                    {/* CONTAINER B: PAGES & LAYERS TREE (Latest User Screenshot!) */}
                    <div className={`flex flex-col h-full bg-white ${!isBlocksOpen ? 'flex' : 'hidden'}`}>
                        
                        {/* Active Page Row (Web with ⋮ menu - EXACT latest user screenshot!) */}
                        {!pagesCollapse && (
                            <div className="px-2 py-1.5 border-b border-gray-100">
                                <div className="relative group flex items-center justify-between px-2.5 py-1.5 bg-[#f3f4f6] rounded text-xs font-semibold text-gray-800">
                                    <span className="truncate max-w-[160px]">{page.title && page.title !== 'New Untitled Page' ? page.title : 'Web'}</span>
                                    <button
                                        type="button"
                                        onClick={() => setPageMenuOpen(!pageMenuOpen)}
                                        className="text-gray-400 hover:text-gray-700 p-0.5 rounded hover:bg-gray-200/60 cursor-pointer"
                                        title="Page Options"
                                    >
                                        <MoreVertical size={13} />
                                    </button>

                                    {pageMenuOpen && (
                                        <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-gray-200 rounded shadow-md py-1 z-30 text-xs">
                                            <a
                                                href={`/page/${page.slug}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="block px-3 py-1.5 hover:bg-gray-50 text-gray-700 font-medium"
                                            >
                                                View Live Page
                                            </a>
                                            <Link
                                                href={route('pages.edit', page.id)}
                                                className="block px-3 py-1.5 hover:bg-gray-50 text-gray-700 font-medium"
                                            >
                                                Page Settings
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* 2. Layers Section Header with Diamond Layers Icon (EXACT latest user screenshot!) */}
                        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-gray-100 text-xs font-bold text-gray-800 bg-white">
                            <Layers size={13} className="text-gray-600" />
                            <span>Layers</span>
                        </div>

                        {/* 3. Component Tree (Body > Header > Div > Heading (Active Blue) > Text - EXACT latest user screenshot!) */}
                        <div className="flex-1 overflow-y-auto py-1 custom-scrollbar bg-white">
                            {treeData.length > 0 ? (
                                treeData.map(node => renderLayerNode(node, 0))
                            ) : (
                                <div className="p-3 text-xs text-gray-400 text-center">
                                    Loading layers...
                                </div>
                            )}
                        </div>
                    </div>

                </aside>

                {/* 2. CENTER: CANVAS WITH SOFT GRAY WORKSPACE (#ececec) */}
                <main className="flex-1 relative h-full overflow-hidden flex flex-col items-center justify-center p-3 bg-[#ececec]">
                    {isLoading && (
                        <div className="absolute inset-0 bg-white/90 z-40 flex flex-col items-center justify-center gap-2">
                            <div className="w-8 h-8 border-2 border-[#7c3aed] border-t-transparent rounded-full animate-spin" />
                            <span className="text-xs font-semibold text-gray-600">Loading GrapesJS Studio...</span>
                        </div>
                    )}

                    {/* Resizable Canvas Card Centered in Workspace */}
                    <div className={`relative h-full flex flex-col items-center transition-all duration-200 ${
                        currentDevice === 'Desktop' ? 'w-full' : currentDevice === 'Tablet' ? 'w-[768px]' : 'w-[375px]'
                    }`}>
                        <div 
                            id={containerId.current} 
                            className="w-full flex-1 bg-white rounded-lg shadow-sm overflow-hidden relative border border-gray-300/70"
                        />
                    </div>
                </main>

                {/* 3. RIGHT SIDEBAR: EXACT GRAPESJS STUDIO STYLES & PROPERTIES (Screenshot 5) */}
                <aside className={`w-[270px] bg-white border-l border-gray-200 flex flex-col h-full z-20 select-none shadow-2xs transition-all duration-200 shrink-0 ${
                    isPreview ? '-mr-[270px]' : 'mr-0'
                }`}>

                    {/* TAB 1: STYLES MANAGER (Screenshot 5) */}
                    <div className={`flex-1 overflow-y-auto p-2.5 text-xs bg-white custom-scrollbar ${activeRightTab === 'styles' ? 'block' : 'hidden'}`}>
                        
                        {/* SELECTION BOX (Exact Screenshot 5 layout) */}
                        <div className="pb-2.5 border-b border-gray-200 mb-2.5 space-y-2">
                            {/* Line 1: Selection label + State dropdown */}
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-semibold text-gray-700 flex items-center gap-1">
                                    <MousePointer size={12} className="text-gray-500" />
                                    <span>Selection</span>
                                </span>
                                <select 
                                    value={activeState}
                                    onChange={(e) => setActiveState(e.target.value)}
                                    className="text-[11px] text-gray-600 bg-white border border-gray-200 rounded px-1.5 py-0.5 focus:outline-none"
                                >
                                    <option>- State -</option>
                                    <option>:hover</option>
                                    <option>:active</option>
                                    <option>:focus</option>
                                </select>
                            </div>

                            {/* Line 2: Tag icon + [+] class button */}
                            <div className="flex items-center gap-1.5 border border-gray-200 rounded p-1 bg-white">
                                <Tag size={12} className="text-gray-400 ml-0.5" />
                                <button type="button" className="text-[#7c3aed] text-xs font-bold px-1 hover:bg-purple-50 rounded">
                                    +
                                </button>
                                {selectedClasses.length > 0 ? (
                                    selectedClasses.map((cls, idx) => (
                                        <span key={idx} className="bg-pink-50 text-pink-700 border border-pink-200 px-1.5 py-0.2 rounded text-[10px] font-medium">
                                            {cls}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-[10px] text-pink-600 bg-pink-50 border border-pink-200 px-1.5 py-0.2 rounded">
                                        + title
                                    </span>
                                )}
                            </div>

                            {/* Line 3: Active Element Badge: Purple Box + Blue Pill */}
                            <div className="flex items-center gap-1.5 border border-purple-200/60 rounded p-1 bg-purple-50/20">
                                <div className="w-5 h-5 bg-[#7c3aed] text-white rounded flex items-center justify-center">
                                    <Box size={11} />
                                </div>
                                <span className="bg-[#3b82f6] text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-2xs">
                                    {selectedTag}
                                </span>
                            </div>

                            {/* Line 4: Sub-tool icons: Target [+], Box [::], Code {} */}
                            <div className="flex items-center justify-between text-gray-400 px-1 pt-0.5">
                                <Target size={13} className="hover:text-gray-700 cursor-pointer" />
                                <Square size={13} className="hover:text-gray-700 cursor-pointer" />
                                <Code size={13} className="hover:text-gray-700 cursor-pointer" />
                            </div>
                        </div>

                        {/* GrapesJS Styles Mount Target (Space, Typography, Background, Borders, Effects) */}
                        <div id={`${containerId.current}-styles`} className="gjs-studio-styles" />
                    </div>

                    {/* TAB 2: PROPERTIES & SETTINGS */}
                    <div className={`flex-1 overflow-y-auto p-2.5 text-xs bg-white custom-scrollbar ${activeRightTab === 'properties' ? 'block' : 'hidden'}`}>
                        <div className="pb-2 border-b border-gray-200 mb-2 font-bold text-gray-700 text-xs">
                            Component Attributes
                        </div>
                        <div id={`${containerId.current}-traits`} className="gjs-studio-traits" />
                    </div>
                </aside>

            </div>

            {/* ========================================================
                EXACT CSS STYLING MATCHING GRAPESJS STUDIO SDK (WHITE THEME)
            ======================================================== */}
            <style dangerouslySetInnerHTML={{ __html: `
                /* 1. COMPLETELY HIDE ALL DEFAULT FLOATING OVERLAYS */
                .gjs-pn-panels,
                .gjs-pn-views-container,
                .gjs-pn-commands,
                .gjs-pn-devices-c,
                .gjs-pn-options,
                .gjs-pn-views {
                    display: none !important;
                }

                #${containerId.current} .gjs-editor {
                    height: 100% !important;
                    width: 100% !important;
                    position: absolute !important;
                    inset: 0 !important;
                }
                #${containerId.current} .gjs-cv-canvas {
                    height: 100% !important;
                    width: 100% !important;
                    top: 0 !important;
                    left: 0 !important;
                    position: absolute !important;
                }
                #${containerId.current} .gjs-frame-wrapper {
                    height: 100% !important;
                }
                #${containerId.current} iframe.gjs-frame {
                    height: 100% !important;
                    width: 100% !important;
                    border: none !important;
                }

                /* 2. BLOCKS DRAWER (Screenshot 2 & 3: 2-column white square tiles) */
                #${containerId.current}-blocks .gjs-block-categories,
                #${containerId.current}-blocks .gjs-block-category,
                #${containerId.current}-blocks .gjs-category {
                    background: transparent !important;
                    border: none !important;
                    margin-bottom: 8px !important;
                }
                #${containerId.current}-blocks .gjs-blocks-c {
                    display: grid !important;
                    grid-template-columns: repeat(2, 1fr) !important;
                    gap: 6px !important;
                    padding: 4px 0 !important;
                    background: transparent !important;
                }
                #${containerId.current}-blocks .gjs-block {
                    width: 100% !important;
                    min-height: 64px !important;
                    background: #ffffff !important;
                    border: 1px solid #e2e8f0 !important;
                    border-radius: 6px !important;
                    padding: 8px 4px !important;
                    margin: 0 !important;
                    color: #1e293b !important;
                    font-size: 11px !important;
                    font-weight: 500 !important;
                    text-align: center !important;
                    display: flex !important;
                    flex-direction: column !important;
                    align-items: center !important;
                    justify-content: center !important;
                    cursor: pointer !important;
                    transition: all 0.15s ease !important;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.02) !important;
                }
                #${containerId.current}-blocks .gjs-block:hover {
                    border-color: #7c3aed !important;
                    color: #7c3aed !important;
                    box-shadow: 0 2px 8px rgba(124, 58, 237, 0.1) !important;
                }
                #${containerId.current}-blocks .gjs-block-label {
                    margin-top: 5px !important;
                    font-size: 11px !important;
                    line-height: 1.2 !important;
                }
                #${containerId.current}-blocks .gjs-block svg {
                    stroke: currentColor !important;
                }
                #${containerId.current}-blocks .gjs-title {
                    font-size: 11px !important;
                    font-weight: 700 !important;
                    color: #374151 !important;
                    background: #ffffff !important;
                    border: none !important;
                    border-bottom: 1px solid #f1f5f9 !important;
                    padding: 8px 2px 4px !important;
                    margin: 8px 0 2px !important;
                    cursor: pointer !important;
                    display: flex !important;
                    justify-content: space-between !important;
                    align-items: center !important;
                }

                /* 3. STYLE MANAGER: FORCE PURE WHITE THEME (Screenshot 5) */
                #${containerId.current}-styles {
                    background: #ffffff !important;
                }
                #${containerId.current}-styles .gjs-sm-sector {
                    background-color: #ffffff !important;
                    border-bottom: 1px solid #f1f5f9 !important;
                    margin-bottom: 2px !important;
                }
                #${containerId.current}-styles .gjs-sm-sector-title {
                    background: #ffffff !important;
                    color: #1e293b !important;
                    font-size: 11.5px !important;
                    font-weight: 600 !important;
                    padding: 8px 4px !important;
                    cursor: pointer !important;
                    display: flex !important;
                    justify-content: space-between !important;
                    align-items: center !important;
                    border-bottom: none !important;
                }
                #${containerId.current}-styles .gjs-sm-sector-title::after {
                    content: "•";
                    color: #f59e0b;
                    font-size: 14px;
                    margin-left: auto;
                    margin-right: 6px;
                }
                #${containerId.current}-styles .gjs-sm-properties {
                    background-color: #ffffff !important;
                    padding: 4px 2px 10px !important;
                }
                #${containerId.current}-styles .gjs-sm-property {
                    background-color: #ffffff !important;
                    margin-bottom: 8px !important;
                }
                #${containerId.current}-styles .gjs-sm-label {
                    font-size: 10.5px !important;
                    color: #64748b !important;
                    font-weight: 600 !important;
                    margin-bottom: 3px !important;
                }
                #${containerId.current}-styles .gjs-fields {
                    background-color: transparent !important;
                }
                #${containerId.current}-styles .gjs-field {
                    background-color: #ffffff !important;
                    border: 1px solid #d1d5db !important;
                    border-radius: 4px !important;
                    color: #1e293b !important;
                    font-size: 11px !important;
                }
                #${containerId.current}-styles .gjs-field input,
                #${containerId.current}-styles .gjs-field select,
                #${containerId.current}-styles input, 
                #${containerId.current}-styles select {
                    background: #ffffff !important;
                    border: 1px solid #d1d5db !important;
                    border-radius: 4px !important;
                    color: #1e293b !important;
                    font-size: 11px !important;
                    padding: 4px 6px !important;
                }
                #${containerId.current}-styles .gjs-radio-item {
                    background: #ffffff !important;
                    border: 1px solid #d1d5db !important;
                    color: #374151 !important;
                }
                #${containerId.current}-styles .gjs-radio-item.gjs-radio-item-active {
                    background: #7c3aed !important;
                    color: #ffffff !important;
                }
                #${containerId.current}-styles input:focus, 
                #${containerId.current}-styles select:focus {
                    border-color: #7c3aed !important;
                    outline: none !important;
                }

                /* Thin clean scrollbars */
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 4px;
                }
            ` }} />
        </div>
    );
}
