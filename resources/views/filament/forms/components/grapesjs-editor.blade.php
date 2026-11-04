<x-dynamic-component :component="$getFieldWrapperView()" :field="$field">
    @php
        $id = 'gjs_' . str_replace(['.', '-', '_'], '', $getId());
        $minHeight = $getMinHeight();
    @endphp

    <div
        wire:ignore
        x-data="{
            state: $wire.entangle('{{ $getStatePath() }}'),
            editor: null,
            isLoaded: false,
            init() {
                this.loadAssets(() => {
                    this.initGrapesJs();
                });
            },
            loadAssets(callback) {
                if (window.grapesjs) {
                    callback();
                    return;
                }

                // Load CSS
                if (!document.getElementById('grapesjs-css')) {
                    const link = document.createElement('link');
                    link.id = 'grapesjs-css';
                    link.rel = 'stylesheet';
                    link.href = 'https://unpkg.com/grapesjs/dist/css/grapes.min.css';
                    document.head.appendChild(link);
                }

                // Load JS
                if (!document.getElementById('grapesjs-js')) {
                    const script = document.createElement('script');
                    script.id = 'grapesjs-js';
                    script.src = 'https://unpkg.com/grapesjs/dist/grapes.min.js';
                    script.onload = () => {
                        // Load basic blocks plugin
                        const pluginScript = document.createElement('script');
                        pluginScript.src = 'https://unpkg.com/grapesjs-blocks-basic';
                        pluginScript.onload = () => {
                            callback();
                        };
                        document.head.appendChild(pluginScript);
                    };
                    document.head.appendChild(script);
                } else {
                    const interval = setInterval(() => {
                        if (window.grapesjs) {
                            clearInterval(interval);
                            callback();
                        }
                    }, 100);
                }
            },
            initGrapesJs() {
                if (this.editor) return;

                const container = document.getElementById('{{ $id }}');
                if (!container) return;

                this.editor = grapesjs.init({
                    container: '#{{ $id }}',
                    height: '{{ $minHeight }}px',
                    width: 'auto',
                    fromElement: false,
                    storageManager: false,
                    plugins: [
                        'gjs-blocks-basic'
                    ],
                    pluginsOpts: {
                        'gjs-blocks-basic': {
                            flexGrid: true
                        }
                    },
                    deviceManager: {
                        devices: [
                            { name: 'Desktop', width: '' },
                            { name: 'Tablet', width: '768px', widthMedia: '992px' },
                            { name: 'Mobile', width: '375px', widthMedia: '480px' }
                        ]
                    },
                    blockManager: {
                        appendTo: '#{{ $id }}-blocks',
                    },
                    styleManager: {
                        appendTo: '#{{ $id }}-styles',
                    },
                    layerManager: {
                        appendTo: '#{{ $id }}-layers'
                    }
                });

                // Set initial content if present
                if (this.state && typeof this.state === 'string' && this.state.trim().length > 0) {
                    this.editor.setComponents(this.state);
                }

                // Save back to Livewire on any change
                const syncContent = () => {
                    const html = this.editor.getHtml();
                    const css = this.editor.getCss();
                    const fullContent = (html || '') + (css ? '<style>' + css + '</style>' : '');
                    this.state = fullContent;
                };

                this.editor.on('update', syncContent);
                this.editor.on('component:add', syncContent);
                this.editor.on('component:remove', syncContent);
                this.editor.on('component:update', syncContent);
                this.editor.on('style:property:update', syncContent);

                this.isLoaded = true;
            },
            setDevice(name) {
                if (this.editor) {
                    this.editor.setDevice(name);
                }
            },
            togglePreview() {
                if (this.editor) {
                    const isPreview = this.editor.Commands.isActive('preview');
                    if (isPreview) {
                        this.editor.stopCommand('preview');
                    } else {
                        this.editor.runCommand('preview');
                    }
                }
            },
            viewCode() {
                if (this.editor) {
                    this.editor.runCommand('export-template');
                }
            }
        }"
        class="border border-gray-300 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm"
    >
        <!-- Editor Top Toolbar -->
        <div class="flex items-center justify-between px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-sm">
            <div class="flex items-center space-x-2">
                <span class="font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-1.5">
                    <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"/>
                    </svg>
                    GrapesJS Visual Builder
                </span>
                <span class="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-medium">Drag & Drop Ready</span>
            </div>

            <!-- Viewport Devices & Actions -->
            <div class="flex items-center space-x-1.5">
                <button
                    type="button"
                    @click="setDevice('Desktop')"
                    class="px-2.5 py-1 text-xs font-medium rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 text-gray-700 dark:text-gray-200"
                    title="Desktop View"
                >
                    🖥️ Desktop
                </button>
                <button
                    type="button"
                    @click="setDevice('Tablet')"
                    class="px-2.5 py-1 text-xs font-medium rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 text-gray-700 dark:text-gray-200"
                    title="Tablet View"
                >
                    📱 Tablet
                </button>
                <button
                    type="button"
                    @click="setDevice('Mobile')"
                    class="px-2.5 py-1 text-xs font-medium rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 text-gray-700 dark:text-gray-200"
                    title="Mobile View"
                >
                    📲 Mobile
                </button>
                <div class="h-4 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
                <button
                    type="button"
                    @click="togglePreview()"
                    class="px-2.5 py-1 text-xs font-medium rounded bg-emerald-600 hover:bg-emerald-700 text-white"
                    title="Preview Mode"
                >
                    👁️ Preview
                </button>
            </div>
        </div>

        <!-- Main Editor Body with Side Panels and Canvas -->
        <div class="flex flex-col lg:flex-row h-full">
            <!-- Left Side: Blocks Drawer -->
            <div class="w-full lg:w-64 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 max-h-[750px] overflow-y-auto">
                <div class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Elements & Blocks</div>
                <div id="{{ $id }}-blocks" class="gjs-custom-blocks"></div>
            </div>

            <!-- Center: Canvas Viewport -->
            <div class="flex-1 bg-white dark:bg-gray-900 relative min-h-[{{ $minHeight }}px]">
                <div id="{{ $id }}" class="w-full h-full"></div>
            </div>

            <!-- Right Side: Style & Layer Manager -->
            <div class="w-full lg:w-72 border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 max-h-[750px] overflow-y-auto">
                <div class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Style Manager</div>
                <div id="{{ $id }}-styles"></div>

                <div class="text-xs font-bold text-gray-500 uppercase tracking-wider mt-4 mb-2">Layers</div>
                <div id="{{ $id }}-layers"></div>
            </div>
        </div>
    </div>
</x-dynamic-component>
