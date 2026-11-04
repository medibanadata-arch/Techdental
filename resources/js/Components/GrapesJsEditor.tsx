import React, { useEffect, useRef, useState } from 'react';
import { 
    Monitor, Tablet, Smartphone, Eye, EyeOff, Code, 
    Undo, Redo, Trash2, Maximize2, Minimize2, Sparkles, 
    Layers, Sliders, Box, HelpCircle, Check, ArrowRight
} from 'lucide-react';

declare global {
    interface Window {
        grapesjs: any;
    }
}

interface GrapesJsEditorProps {
    initialContent?: string;
    onChange: (content: string) => void;
    minHeight?: number;
}

export default function GrapesJsEditor({
    initialContent = '',
    onChange,
    minHeight = 750
}: GrapesJsEditorProps) {
    const editorRef = useRef<any>(null);
    const containerId = useRef(`gjs-canvas-${Math.random().toString(36).substring(2, 9)}`);
    const [isLoading, setIsLoading] = useState(true);
    const [currentDevice, setCurrentDevice] = useState<'Desktop' | 'Tablet' | 'Mobile'>('Desktop');
    const [isPreview, setIsPreview] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    
    // Left Sidebar Navigation Tab (Widgets, Styles, Settings, Layers)
    const [activeTab, setActiveTab] = useState<'widgets' | 'styles' | 'traits' | 'layers'>('widgets');

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

                const editor = window.grapesjs.init({
                    container: `#${cId}`,
                    height: '100%',
                    width: '100%',
                    fromElement: false,
                    storageManager: false,
                    components: initialContent && initialContent.trim().length > 0 ? initialContent : undefined,
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
                    },
                    layerManager: {
                        appendTo: `#${cId}-layers`,
                    },
                    traitManager: {
                        appendTo: `#${cId}-traits`,
                    }
                });

                // Add Custom Pre-Designed Dental Clinic Blocks
                const bm = editor.BlockManager;

                // 1. Dental Hero Section
                bm.add('dental-hero', {
                    label: '🦷 Dental Hero Banner',
                    category: 'Dental Components',
                    content: `
                        <section style="padding: 50px 20px; background: linear-gradient(135deg, #800038 0%, #2A0845 100%); color: #ffffff; text-align: center; border-radius: 16px; margin: 15px 0;">
                            <span style="background: rgba(255,255,255,0.2); padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Tech Dental Care</span>
                            <h1 style="font-size: 34px; margin: 14px 0 10px; font-weight: 800; line-height: 1.2;">Advanced Digital Dentistry in Dhaka</h1>
                            <p style="font-size: 15px; max-width: 600px; margin: 0 auto 20px; color: #fce7f3; line-height: 1.6;">Painless root canals, single-visit laser teeth whitening, and precision dental implants backed by certified specialists.</p>
                            <div>
                                <a href="/appointment" style="background: #ffffff; color: #800038; font-weight: bold; padding: 12px 26px; border-radius: 30px; text-decoration: none; display: inline-block; box-shadow: 0 4px 14px rgba(0,0,0,0.15);">Book Appointment Now</a>
                            </div>
                        </section>
                    `,
                    attributes: { class: 'gjs-block-section' }
                });

                // 2. Dental Services 3-Column Grid
                bm.add('dental-services-grid', {
                    label: '✨ Dental Treatments (3 Cards)',
                    category: 'Dental Components',
                    content: `
                        <div style="padding: 30px 10px; margin: 15px 0; font-family: sans-serif;">
                            <h2 style="text-align: center; font-size: 26px; color: #111827; margin-bottom: 20px; font-weight: bold;">Our Specialized Treatments</h2>
                            <div style="display: flex; gap: 16px; flex-wrap: wrap; justify-content: center;">
                                <div style="flex: 1; min-width: 240px; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 14px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); text-align: left;">
                                    <div style="font-size: 30px; margin-bottom: 10px;">🦷</div>
                                    <h3 style="font-size: 17px; font-weight: 700; color: #800038; margin-bottom: 6px;">Single-Sitting RCT</h3>
                                    <p style="font-size: 13px; color: #6b7280; line-height: 1.5; margin-bottom: 12px;">Rotary pain-free root canal treatment with apex locator precision.</p>
                                    <span style="font-weight: bold; color: #047857; font-size: 13px;">From ৳ 4,500</span>
                                </div>
                                <div style="flex: 1; min-width: 240px; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 14px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); text-align: left;">
                                    <div style="font-size: 30px; margin-bottom: 10px;">💎</div>
                                    <h3 style="font-size: 17px; font-weight: 700; color: #800038; margin-bottom: 6px;">Laser Teeth Whitening</h3>
                                    <p style="font-size: 13px; color: #6b7280; line-height: 1.5; margin-bottom: 12px;">Get 6-8 shades whiter smile in a single 45-minute clinic session.</p>
                                    <span style="font-weight: bold; color: #047857; font-size: 13px;">৳ 6,000</span>
                                </div>
                                <div style="flex: 1; min-width: 240px; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 14px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); text-align: left;">
                                    <div style="font-size: 30px; margin-bottom: 10px;">📐</div>
                                    <h3 style="font-size: 17px; font-weight: 700; color: #800038; margin-bottom: 6px;">Invisible Aligners</h3>
                                    <p style="font-size: 13px; color: #6b7280; line-height: 1.5; margin-bottom: 12px;">Clear orthodontic aligners for teeth straightening without metal wires.</p>
                                    <span style="font-weight: bold; color: #047857; font-size: 13px;">From ৳ 50,000</span>
                                </div>
                            </div>
                        </div>
                    `,
                });

                // 3. Branches Info Strip
                bm.add('dental-branches-card', {
                    label: '📍 4 Dhaka Branches Strip',
                    category: 'Dental Components',
                    content: `
                        <div style="background: #fdf2f8; border: 1px solid #fbcfe8; border-radius: 14px; padding: 20px; margin: 15px 0; font-family: sans-serif;">
                            <h3 style="color: #9d174d; font-size: 17px; font-weight: 800; margin-bottom: 12px;">Our Dhaka Clinic Branches</h3>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; font-size: 12px; color: #374151;">
                                <div style="background: #ffffff; padding: 12px; border-radius: 8px; border: 1px solid #fce7f3;">
                                    <strong>Shewrapara, Mirpur:</strong><br/>827 (2nd Floor), 10 AM - 9 PM
                                </div>
                                <div style="background: #ffffff; padding: 12px; border-radius: 8px; border: 1px solid #fce7f3;">
                                    <strong>Middle Badda:</strong><br/>Cha-68/1 Pragati Sarani, 3 PM - 9 PM
                                </div>
                                <div style="background: #ffffff; padding: 12px; border-radius: 8px; border: 1px solid #fce7f3;">
                                    <strong>Uttara (Sector 3):</strong><br/>House 18, Road 14, 3 PM - 9 PM
                                </div>
                                <div style="background: #ffffff; padding: 12px; border-radius: 8px; border: 1px solid #fce7f3;">
                                    <strong>South Jatrabari:</strong><br/>Shahid Faruk Road, 3 PM - 9 PM
                                </div>
                            </div>
                        </div>
                    `,
                });

                // 4. Emergency Call Banner
                bm.add('dental-emergency-cta', {
                    label: '🚨 Urgent Helpline Banner',
                    category: 'Dental Components',
                    content: `
                        <div style="background: #800038; color: #ffffff; padding: 20px; border-radius: 14px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px; margin: 15px 0;">
                            <div>
                                <h3 style="font-size: 18px; font-weight: bold; margin: 0 0 4px;">Severe Toothache or Dental Emergency?</h3>
                                <p style="font-size: 13px; margin: 0; color: #fbcfe8;">Call our central consultation hotline for immediate doctor assistance.</p>
                            </div>
                            <a href="tel:01400786162" style="background: #ffffff; color: #800038; font-weight: 800; padding: 10px 20px; border-radius: 20px; text-decoration: none; font-size: 14px;">📞 01400786162</a>
                        </div>
                    `,
                });

                // Set components when editor is loaded and ensure component visibility
                editor.on('load', () => {
                    // Turn on component outlines so user clearly sees what they are editing
                    try {
                        editor.runCommand('sw-visibility');
                    } catch (e) {
                        // ignore
                    }

                    // Enable Click-to-add for all blocks in the blocks container
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

                // When user selects a component in the canvas, auto-switch to Style Manager
                editor.on('component:selected', () => {
                    setActiveTab('styles');
                });

                // Sync content to parent form
                const sync = () => {
                    const html = editor.getHtml();
                    const css = editor.getCss();
                    const fullContent = (html || '') + (css ? `\n<style>\n${css}\n</style>` : '');
                    onChange(fullContent);
                };

                editor.on('update', sync);
                editor.on('component:add', sync);
                editor.on('component:remove', sync);
                editor.on('component:update', sync);
                editor.on('style:property:update', sync);

                editorRef.current = editor;
                setIsLoading(false);
            } catch (err) {
                console.error('Failed to initialize GrapesJS in React:', err);
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

    // Toolbar actions
    const changeDevice = (device: 'Desktop' | 'Tablet' | 'Mobile') => {
        if (!editorRef.current) return;
        setCurrentDevice(device);
        editorRef.current.setDevice(device);
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

    const handleUndo = () => {
        if (editorRef.current) {
            editorRef.current.runCommand('core:undo');
        }
    };

    const handleRedo = () => {
        if (editorRef.current) {
            editorRef.current.runCommand('core:redo');
        }
    };

    const handleClear = () => {
        if (!editorRef.current) return;
        if (confirm('Are you sure you want to clear the entire canvas?')) {
            editorRef.current.setComponents('');
            onChange('');
        }
    };

    const handleViewCode = () => {
        if (editorRef.current) {
            editorRef.current.runCommand('export-template');
        }
    };

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    return (
        <div className={`border border-gray-300 rounded-2xl overflow-hidden bg-white shadow-sm flex flex-col transition-all duration-200 ${
            isFullscreen ? 'fixed inset-3 z-50 shadow-2xl' : 'relative w-full'
        }`}>
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-200 text-xs select-none">
                {/* Brand & Badge */}
                <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800 flex items-center gap-1.5">
                        <Sparkles size={16} className="text-[#800038]" />
                        <span>Visual Page Builder</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-[10px]">
                        Drag or Click to Add
                    </span>
                </div>

                {/* Viewport Devices */}
                <div className="flex items-center bg-gray-200/80 p-0.5 rounded-lg border border-gray-300">
                    <button
                        type="button"
                        onClick={() => changeDevice('Desktop')}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold transition ${
                            currentDevice === 'Desktop'
                                ? 'bg-white text-gray-900 shadow-xs'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                        title="Desktop Canvas"
                    >
                        <Monitor size={13} />
                        <span>Desktop</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => changeDevice('Tablet')}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold transition ${
                            currentDevice === 'Tablet'
                                ? 'bg-white text-gray-900 shadow-xs'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                        title="Tablet Canvas (768px)"
                    >
                        <Tablet size={13} />
                        <span>Tablet</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => changeDevice('Mobile')}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold transition ${
                            currentDevice === 'Mobile'
                                ? 'bg-white text-gray-900 shadow-xs'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                        title="Mobile Canvas (375px)"
                    >
                        <Smartphone size={13} />
                        <span>Mobile</span>
                    </button>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex items-center gap-1.5">
                    <button
                        type="button"
                        onClick={handleUndo}
                        className="p-1.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition cursor-pointer"
                        title="Undo"
                    >
                        <Undo size={14} />
                    </button>
                    <button
                        type="button"
                        onClick={handleRedo}
                        className="p-1.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition cursor-pointer"
                        title="Redo"
                    >
                        <Redo size={14} />
                    </button>
                    <div className="h-4 w-px bg-gray-300 mx-0.5" />
                    <button
                        type="button"
                        onClick={handleViewCode}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 font-medium transition cursor-pointer"
                        title="View & Export HTML/CSS"
                    >
                        <Code size={13} />
                        <span className="hidden sm:inline">Export Code</span>
                    </button>
                    <button
                        type="button"
                        onClick={togglePreview}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                            isPreview 
                                ? 'bg-amber-600 text-white hover:bg-amber-700' 
                                : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                        title="Toggle Live Preview"
                    >
                        {isPreview ? <EyeOff size={13} /> : <Eye size={13} />}
                        <span>{isPreview ? 'Exit Preview' : 'Preview'}</span>
                    </button>
                    <button
                        type="button"
                        onClick={handleClear}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                        title="Clear Canvas"
                    >
                        <Trash2 size={14} />
                    </button>
                    <button
                        type="button"
                        onClick={toggleFullscreen}
                        className="p-1.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition cursor-pointer"
                        title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Canvas'}
                    >
                        {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                    </button>
                </div>
            </div>

            {/* UNIFIED WORKSPACE: Left Sidebar (Widgets + Styles + Settings + Layers) & Center-to-Right Full Canvas */}
            <div 
                className="flex flex-col lg:flex-row w-full overflow-hidden relative" 
                style={{ height: isFullscreen ? 'calc(100vh - 100px)' : `${minHeight}px` }}
            >
                {/* Unified Left Sidebar with 4 Tabs */}
                <div className="w-full lg:w-80 border-r border-gray-200 bg-gray-50 flex flex-col h-full z-10 select-none shadow-xs">
                    
                    {/* Navigation Tabs Header */}
                    <div className="grid grid-cols-4 p-1.5 bg-gray-200/70 border-b border-gray-200 gap-1 text-[11px] font-bold">
                        <button
                            type="button"
                            onClick={() => setActiveTab('widgets')}
                            className={`py-1.5 px-1 rounded-md transition flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                                activeTab === 'widgets'
                                    ? 'bg-white text-[#800038] shadow-xs border border-gray-200'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
                            }`}
                            title="Blocks and Components"
                        >
                            <Box size={14} />
                            <span>Widgets</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('styles')}
                            className={`py-1.5 px-1 rounded-md transition flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                                activeTab === 'styles'
                                    ? 'bg-white text-[#800038] shadow-xs border border-gray-200'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
                            }`}
                            title="Style Manager"
                        >
                            <Sliders size={14} />
                            <span>Styles</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('traits')}
                            className={`py-1.5 px-1 rounded-md transition flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                                activeTab === 'traits'
                                    ? 'bg-white text-[#800038] shadow-xs border border-gray-200'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
                            }`}
                            title="Element Settings"
                        >
                            <HelpCircle size={14} />
                            <span>Settings</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('layers')}
                            className={`py-1.5 px-1 rounded-md transition flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                                activeTab === 'layers'
                                    ? 'bg-white text-[#800038] shadow-xs border border-gray-200'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
                            }`}
                            title="Layer DOM Tree"
                        >
                            <Layers size={14} />
                            <span>Layers</span>
                        </button>
                    </div>

                    {/* Tab 1: Widgets / Blocks Drawer */}
                    <div className={`flex-1 overflow-y-auto p-3 ${activeTab === 'widgets' ? 'block' : 'hidden'}`}>
                        <div className="flex items-center justify-between pb-2 border-b border-gray-200 mb-2">
                            <span className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                                <Box size={13} className="text-[#800038]" />
                                Elements & Dental Blocks
                            </span>
                            <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                Click or Drag
                            </span>
                        </div>
                        <p className="text-[11px] text-gray-400 mb-3">
                            Drag any widget onto canvas or click to append automatically.
                        </p>
                        <div id={`${containerId.current}-blocks`} className="gjs-custom-blocks text-xs space-y-1" />
                    </div>

                    {/* Tab 2: Style Manager */}
                    <div className={`flex-1 overflow-y-auto p-3 ${activeTab === 'styles' ? 'block' : 'hidden'}`}>
                        <div className="flex items-center justify-between pb-2 border-b border-gray-200 mb-3">
                            <span className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                                <Sliders size={13} className="text-[#800038]" />
                                Style Manager
                            </span>
                            <span className="text-[10px] text-gray-400">Select element to style</span>
                        </div>
                        <div id={`${containerId.current}-styles`} className="text-xs" />
                    </div>

                    {/* Tab 3: Settings / Traits */}
                    <div className={`flex-1 overflow-y-auto p-3 ${activeTab === 'traits' ? 'block' : 'hidden'}`}>
                        <div className="flex items-center justify-between pb-2 border-b border-gray-200 mb-3">
                            <span className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                                <HelpCircle size={13} className="text-[#800038]" />
                                Element Settings
                            </span>
                            <span className="text-[10px] text-gray-400">Links, IDs & Attributes</span>
                        </div>
                        <div id={`${containerId.current}-traits`} className="text-xs" />
                    </div>

                    {/* Tab 4: Layers Tree */}
                    <div className={`flex-1 overflow-y-auto p-3 ${activeTab === 'layers' ? 'block' : 'hidden'}`}>
                        <div className="flex items-center justify-between pb-2 border-b border-gray-200 mb-3">
                            <span className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                                <Layers size={13} className="text-[#800038]" />
                                Document Layers
                            </span>
                            <span className="text-[10px] text-gray-400">DOM Tree</span>
                        </div>
                        <div id={`${containerId.current}-layers`} className="text-xs" />
                    </div>

                </div>

                {/* Center-to-Right: Full-Width Canvas Viewport */}
                <div className="flex-1 bg-slate-100 relative h-full overflow-hidden flex flex-col">
                    {isLoading && (
                        <div className="absolute inset-0 bg-white/95 z-30 flex flex-col items-center justify-center gap-2">
                            <div className="w-8 h-8 border-3 border-[#800038] border-t-transparent rounded-full animate-spin" />
                            <span className="text-xs font-semibold text-gray-600">Loading Canvas Viewport...</span>
                        </div>
                    )}
                    
                    {/* GrapesJS Canvas Mount Target */}
                    <div 
                        id={containerId.current} 
                        className="w-full h-full absolute inset-0 bg-white" 
                        style={{ height: '100%', width: '100%' }}
                    />
                </div>

            </div>

            {/* Custom Inline CSS to ensure GrapesJS canvas stretches perfectly and blocks look beautiful */}
            <style dangerouslySetInnerHTML={{ __html: `
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
                /* Blocks styling in the left sidebar */
                .gjs-block {
                    user-select: none;
                    cursor: pointer !important;
                    transition: transform 0.15s ease, box-shadow 0.15s ease;
                }
                .gjs-block:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
                }
                .gjs-block:active {
                    transform: scale(0.97);
                }
                .gjs-title {
                    font-weight: 700 !important;
                    color: #4b5563 !important;
                    background: #e5e7eb !important;
                    border-radius: 6px !important;
                    padding: 6px 10px !important;
                    margin-top: 10px !important;
                }
            ` }} />
        </div>
    );
}
