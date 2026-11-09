import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Image, Upload, Plus, Code, Eye, Bold, Italic, List, ListOrdered, 
    Quote, AlignLeft, AlignCenter, AlignRight, Link as LinkIcon, Unlink, 
    RotateCcw, RotateCw, Sparkles, CheckCircle, AlertCircle, Edit3, X, Trash2, Check,
    Palette, ExternalLink, CornerDownLeft, ArrowLeft, Table, Layers, Copy
} from 'lucide-react';
import { PageProps } from '@inertiajs/core';
import MediaImagePicker from '@/components/ImagePicker/MediaImagePicker';

interface SchemaItem {
    id: string;
    type: string;
    name: string;
    active: boolean;
    json: string;
}

interface FaqItem {
    q: string;
    q_bn?: string;
    a: string;
    a_bn?: string;
}

interface Post {
    id: number;
    slug: string;
    title: string;
    title_bn?: string;
    excerpt?: string;
    excerpt_bn?: string;
    content?: string;
    content_bn?: string;
    img?: string;
    thumb_url?: string;
    author_name?: string;
    author_name_bn?: string;
    author_avatar?: string;
    author_bio?: string;
    author_bio_bn?: string;
    category?: string;
    category_bn?: string;
    tags?: string;
    status?: string;
    focus_keyword?: string;
    seo_title?: string;
    meta_desc?: string;
    canonical_url?: string;
    breadcrumb_title?: string;
    robots_index?: boolean;
    robots_follow?: boolean;
    is_redirect?: boolean;
    redirect_url?: string;
    schema_json?: string;
    faqs?: FaqItem[];
}

interface Props extends PageProps {
    post: Post;
    mediaList?: any[];
}

export default function Edit({ post: postData, mediaList = [] }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        title: postData.title || '',
        title_bn: postData.title_bn || '',
        slug: postData.slug || 'post-slug',
        content: postData.content || '<p>Start writing your content here...</p>',
        content_bn: postData.content_bn || '',
        excerpt: postData.excerpt || '',
        excerpt_bn: postData.excerpt_bn || '',
        img: postData.img || '',
        thumb_url: postData.thumb_url || postData.img || '',
        author_name: postData.author_name || 'Dr. Farhana Ahmed, BDS',
        author_name_bn: postData.author_name_bn || '',
        author_avatar: postData.author_avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=250&q=80',
        author_bio: postData.author_bio || '',
        author_bio_bn: postData.author_bio_bn || '',
        category: postData.category || 'Dental Care',
        category_bn: postData.category_bn || '',
        tags: postData.tags || 'dental, health',
        status: postData.status || 'published',
        faqs: (postData.faqs as FaqItem[]) || [],
        section_titles: postData.section_titles || {
            toc: '',
            toc_bn: '',
            faq: '',
            faq_bn: '',
            cta: '',
            cta_bn: '',
            author: '',
            author_bn: '',
            related: '',
            related_bn: '',
        },
        cta_box: postData.cta_box || {
            desc: '',
            desc_bn: '',
            banner_title: '',
            banner_title_bn: '',
            banner_subtitle: '',
            banner_subtitle_bn: '',
            address: '',
            address_bn: '',
            branches: '',
            branches_bn: '',
            website: '',
            phone: '',
        },
        
        // Real SEO Meta Fields
        focus_keyword: postData.focus_keyword || '',
        seo_title: postData.seo_title || '',
        meta_desc: postData.meta_desc || '',
        canonical_url: postData.canonical_url || '',
        breadcrumb_title: postData.breadcrumb_title || '',
        robots_index: postData.robots_index !== undefined ? Boolean(postData.robots_index) : true,
        robots_follow: postData.robots_follow !== undefined ? Boolean(postData.robots_follow) : true,
        is_redirect: postData.is_redirect !== undefined ? Boolean(postData.is_redirect) : false,
        redirect_url: postData.redirect_url || '',
        schema_json: postData.schema_json || '',
    });

    // Editor & UI States
    const [contentLang, setContentLang] = useState<'en' | 'bn'>('en');
    const [editorMode, setEditorMode] = useState<'visual' | 'code'>('visual');
    const [seoTab, setSeoTab] = useState<'general' | 'advanced'>('general');
    const [isEditingSlug, setIsEditingSlug] = useState(false);
    
    // Modals & Popups
    const [isSnippetModalOpen, setIsSnippetModalOpen] = useState(false);
    const [isSchemaModalOpen, setIsSchemaModalOpen] = useState(false);
    const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
    const [mediaTarget, setMediaTarget] = useState<'editor' | 'featured'>('editor');
    const [selectedMediaUrl, setSelectedMediaUrl] = useState('');

    // Insert Custom Table Modal State
    const [isTableModalOpen, setIsTableModalOpen] = useState(false);
    const [tableRows, setTableRows] = useState(3);
    const [tableCols, setTableCols] = useState(3);
    const [tableHasHeader, setTableHasHeader] = useState(true);
    
    // Floating WordPress-style Link Popup
    const [isLinkPopupOpen, setIsLinkPopupOpen] = useState(false);
    const [selectedLinkNode, setSelectedLinkNode] = useState<HTMLAnchorElement | null>(null);
    const [linkUrl, setLinkUrl] = useState('');
    const [linkOpenNewTab, setLinkOpenNewTab] = useState(false);

    // Color Picker Popup
    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

    // Interactive Image Selection & Resizing State
    const [selectedImgNode, setSelectedImgNode] = useState<HTMLImageElement | null>(null);
    const [selectedImgRect, setSelectedImgRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
    const [isImgDetailsModalOpen, setIsImgDetailsModalOpen] = useState(false);
    const [imgAltText, setImgAltText] = useState('');
    const [imgTitleText, setImgTitleText] = useState('');
    const [imgCaptionText, setImgCaptionText] = useState('');
    const [imgFileUrl, setImgFileUrl] = useState('');
    const [imgFileName, setImgFileName] = useState('');
    const [imgDimensions, setImgDimensions] = useState('600 x 400');
    const [imgFileSize, setImgFileSize] = useState('125 KB');
    const [imgWidthPx, setImgWidthPx] = useState<number>(300);
    const [isCopiedUrl, setIsCopiedUrl] = useState(false);

    // Interactive Table Selection, Resizing & Dragging State
    const [selectedTableWrapperNode, setSelectedTableWrapperNode] = useState<HTMLDivElement | null>(null);
    const [selectedTableNode, setSelectedTableNode] = useState<HTMLTableElement | null>(null);
    const [selectedTableRect, setSelectedTableRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

    // Schema Generator State
    const [schemaType, setSchemaType] = useState('Article');
    const [schemaName, setSchemaName] = useState('Article Schema');
    const [schemasList, setSchemasList] = useState<SchemaItem[]>(() => {
        if (postData.schema_json) {
            try {
                return JSON.parse(postData.schema_json);
            } catch (e) {
                // fallback
            }
        }
        return [
            {
                id: '1',
                type: 'Article',
                name: 'Article Schema',
                active: true,
                json: JSON.stringify({ "@context": "https://schema.org", "@type": "Article", "headline": postData.title || "Post Title" })
            }
        ];
    });

    // Categories
    const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [categoriesList, setCategoriesList] = useState([
        'Dental Care', 'Tooth Care', 'Root Canal', 'Orthodontics', 'General'
    ]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([postData.category || 'Dental Care']);

    // Visual ContentEditable Ref & Cursor Position Saving
    const visualRef = useRef<HTMLDivElement>(null);
    const savedRangeRef = useRef<Range | null>(null);
    const resizeStartPos = useRef<{ x: number; initialWidth: number }>({ x: 0, initialWidth: 0 });

    // Save Selection/Cursor Position
    const saveSelection = () => {
        if (window.getSelection) {
            const sel = window.getSelection();
            if (sel && sel.rangeCount > 0 && visualRef.current && visualRef.current.contains(sel.anchorNode)) {
                savedRangeRef.current = sel.getRangeAt(0).cloneRange();
            }
        }
    };

    // Restore Selection/Cursor Position
    const restoreSelection = () => {
        if (savedRangeRef.current && window.getSelection) {
            const sel = window.getSelection();
            if (sel) {
                sel.removeAllRanges();
                sel.addRange(savedRangeRef.current);
            }
        }
    };

    // Sync Visual Editor HTML to Form Content
    const handleVisualInput = () => {
        if (visualRef.current) {
            if (contentLang === 'en') {
                setData('content', visualRef.current.innerHTML);
            } else {
                setData('content_bn', visualRef.current.innerHTML);
            }
            updateOverlaysRect();
        }
    };

    // Keep Visual Ref Synced when switching tabs or language
    useEffect(() => {
        if (editorMode === 'visual' && visualRef.current) {
            visualRef.current.innerHTML = contentLang === 'en' ? (data.content || '') : (data.content_bn || '');
        }
    }, [editorMode, contentLang]);

    // Update Floating Rect for Selected Image
    const updateSelectedImgRect = () => {
        if (selectedImgNode) {
            setSelectedImgRect({
                top: selectedImgNode.offsetTop,
                left: selectedImgNode.offsetLeft,
                width: selectedImgNode.offsetWidth,
                height: selectedImgNode.offsetHeight
            });
            setImgWidthPx(Math.round(selectedImgNode.offsetWidth));
        } else {
            setSelectedImgRect(null);
        }
    };

    // Update Floating Rect for Selected Table
    const updateSelectedTableRect = () => {
        if (selectedTableWrapperNode) {
            setSelectedTableRect({
                top: selectedTableWrapperNode.offsetTop,
                left: selectedTableWrapperNode.offsetLeft,
                width: selectedTableWrapperNode.offsetWidth,
                height: selectedTableWrapperNode.offsetHeight
            });
        } else {
            setSelectedTableRect(null);
        }
    };

    // Combined Overlay Rect Updater on Scroll / Input
    const updateOverlaysRect = () => {
        updateSelectedImgRect();
        updateSelectedTableRect();
    };

    useEffect(() => {
        updateSelectedImgRect();
    }, [selectedImgNode]);

    useEffect(() => {
        updateSelectedTableRect();
    }, [selectedTableWrapperNode]);

    // Click handler inside Editor for Link, Image & Table Selection
    const handleEditorClick = (e: React.MouseEvent<HTMLDivElement>) => {
        saveSelection();
        const target = e.target as HTMLElement;

        // Check Link selection first
        const linkNode = target.closest('a') as HTMLAnchorElement | null;
        if (linkNode && visualRef.current?.contains(linkNode)) {
            setSelectedLinkNode(linkNode);
            setLinkUrl(linkNode.getAttribute('href') || '');
            setLinkOpenNewTab(linkNode.target === '_blank');
            setIsLinkPopupOpen(true);
            setSelectedImgNode(null);
            setSelectedTableWrapperNode(null);
            setSelectedTableNode(null);
            return;
        } else {
            if (!target.closest('.link-toolbar-overlay') && !target.closest('.link-popup-box')) {
                setSelectedLinkNode(null);
            }
        }

        // Check Table selection second
        let tableNode = target.closest('table') as HTMLTableElement | null;
        let tableWrapper = target.closest('.table-wrapper') as HTMLDivElement | null;

        if (tableNode) {
            if (!tableWrapper) {
                const wrapper = document.createElement('div');
                wrapper.className = 'table-wrapper group my-4 border border-slate-200 rounded-xl overflow-hidden shadow-xs cursor-move';
                wrapper.setAttribute('draggable', 'true');
                wrapper.style.cssText = 'resize: both; overflow: auto; max-width: 100%; min-width: 240px; display: block; margin: 16px 0; border: 1px solid #cbd5e1; padding: 6px; border-radius: 12px; position: relative;';
                tableNode.parentNode?.insertBefore(wrapper, tableNode);
                wrapper.appendChild(tableNode);
                tableWrapper = wrapper;
            }
            setSelectedTableWrapperNode(tableWrapper);
            setSelectedTableNode(tableNode);
            setSelectedImgNode(null);
            return;
        }

        if (target.tagName === 'IMG') {
            const img = target as HTMLImageElement;
            setSelectedImgNode(img);
            setImgAltText(img.alt || '');
            setImgTitleText(img.title || '');
            setImgFileUrl(img.src || '');
            const filename = img.src.split('/').pop()?.split('?')[0] || 'image.jpg';
            setImgFileName(filename);
            setImgDimensions(`${img.naturalWidth || 600} x ${img.naturalHeight || 400}`);
            setSelectedTableWrapperNode(null);
            setSelectedTableNode(null);
        } else {
            if (!target.closest('.table-toolbar-overlay')) {
                setSelectedImgNode(null);
                setSelectedTableWrapperNode(null);
                setSelectedTableNode(null);
            }
        }
    };

    const handleEditorKeyUp = () => {
        saveSelection();
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
            let node: Node | null = sel.getRangeAt(0).commonAncestorContainer;
            if (node.nodeType === 3) node = node.parentNode;
            const linkNode = (node as HTMLElement)?.closest('a') as HTMLAnchorElement | null;
            if (linkNode && visualRef.current?.contains(linkNode)) {
                setSelectedLinkNode(linkNode);
                setLinkUrl(linkNode.getAttribute('href') || '');
                setLinkOpenNewTab(linkNode.target === '_blank');
            }
        }
    };

    // Interactive Drag Resizing on Corner Handle
    const handleResizeMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!selectedImgNode) return;
        
        resizeStartPos.current = {
            x: e.clientX,
            initialWidth: selectedImgNode.getBoundingClientRect().width
        };

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const deltaX = moveEvent.clientX - resizeStartPos.current.x;
            const newWidth = Math.max(80, Math.round(resizeStartPos.current.initialWidth + deltaX));
            if (selectedImgNode) {
                selectedImgNode.style.width = `${newWidth}px`;
                setImgWidthPx(newWidth);
                updateSelectedImgRect();
            }
        };

        const handleMouseUp = () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            handleVisualInput();
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    // Classic Editor Format Execution Commands
    const execCommand = (command: string, value: string | undefined = undefined) => {
        if (editorMode === 'visual' && visualRef.current) {
            visualRef.current.focus();
            restoreSelection();
            document.execCommand(command, false, value);
            handleVisualInput();
            saveSelection();
        }
    };

    // Apply Heading with clean block flattening (no corrupted nested headings)
    const applyHeading = (headingTag: string) => {
        if (editorMode === 'visual' && visualRef.current) {
            visualRef.current.focus();
            restoreSelection();

            const sel = window.getSelection();
            if (sel && sel.rangeCount > 0) {
                const range = sel.getRangeAt(0);
                let node: Node | null = range.commonAncestorContainer;
                if (node.nodeType === 3) node = node.parentNode;

                let block = (node as HTMLElement)?.closest('h1, h2, h3, h4, h5, h6, p, div') as HTMLElement | null;

                if (block && visualRef.current.contains(block)) {
                    // Ascend to the topmost heading parent if nested
                    while (
                        block.parentElement &&
                        ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(block.parentElement.tagName) &&
                        visualRef.current.contains(block.parentElement)
                    ) {
                        block = block.parentElement;
                    }

                    const targetTag = headingTag.toLowerCase();
                    const newBlock = document.createElement(targetTag);

                    // Strip any nested h1-h6 tags from the inside to keep DOM clean
                    const cleanHtml = block.innerHTML.replace(/<\/?h[1-6][^>]*>/gi, '');
                    newBlock.innerHTML = cleanHtml;

                    block.parentNode?.replaceChild(newBlock, block);
                    handleVisualInput();
                    saveSelection();
                    return;
                }
            }

            execCommand('formatBlock', `<${headingTag}>`);
        }
    };

    // Apply Text Color
    const applyColor = (colorHex: string) => {
        execCommand('foreColor', colorHex);
        setIsColorPickerOpen(false);
    };

    // Open Link Toolbar with active link detection
    const handleOpenLinkToolbar = () => {
        saveSelection();
        const sel = window.getSelection();
        let anchor: HTMLAnchorElement | null = null;
        if (sel && sel.rangeCount > 0) {
            let node: Node | null = sel.getRangeAt(0).commonAncestorContainer;
            if (node.nodeType === 3) node = node.parentNode;
            anchor = (node as HTMLElement)?.closest('a') as HTMLAnchorElement | null;
        }

        if (anchor && visualRef.current?.contains(anchor)) {
            setSelectedLinkNode(anchor);
            setLinkUrl(anchor.getAttribute('href') || '');
            setLinkOpenNewTab(anchor.target === '_blank');
        } else if (!selectedLinkNode) {
            setLinkUrl('');
            setLinkOpenNewTab(false);
        }
        setIsLinkPopupOpen(!isLinkPopupOpen);
    };

    // Apply or update WordPress-style Link
    const applyLink = () => {
        if (!linkUrl.trim()) {
            if (selectedLinkNode && visualRef.current?.contains(selectedLinkNode)) {
                const parent = selectedLinkNode.parentNode;
                while (selectedLinkNode.firstChild) {
                    parent?.insertBefore(selectedLinkNode.firstChild, selectedLinkNode);
                }
                parent?.removeChild(selectedLinkNode);
                handleVisualInput();
                setSelectedLinkNode(null);
            }
            setIsLinkPopupOpen(false);
            return;
        }

        // If updating an existing selected link
        if (selectedLinkNode && visualRef.current?.contains(selectedLinkNode)) {
            selectedLinkNode.setAttribute('href', linkUrl.trim());
            if (linkOpenNewTab) {
                selectedLinkNode.setAttribute('target', '_blank');
                selectedLinkNode.setAttribute('rel', 'noopener noreferrer');
            } else {
                selectedLinkNode.removeAttribute('target');
                selectedLinkNode.removeAttribute('rel');
            }
            handleVisualInput();
            setIsLinkPopupOpen(false);
            return;
        }

        if (editorMode === 'visual' && visualRef.current) {
            visualRef.current.focus();
            restoreSelection();
            const selection = window.getSelection();
            const targetAttr = linkOpenNewTab ? ' target="_blank" rel="noopener noreferrer"' : '';
            const displayText = (selection && selection.toString().trim()) ? selection.toString() : linkUrl.trim();
            const aHtml = `<a href="${linkUrl.trim()}"${targetAttr} class="text-sky-600 hover:underline">${displayText}</a>`;
            execCommand('insertHTML', aHtml);
        }
        setIsLinkPopupOpen(false);
        setLinkUrl('');
    };

    // Remove / Unlink
    const removeLink = () => {
        if (selectedLinkNode && visualRef.current?.contains(selectedLinkNode)) {
            const parent = selectedLinkNode.parentNode;
            while (selectedLinkNode.firstChild) {
                parent?.insertBefore(selectedLinkNode.firstChild, selectedLinkNode);
            }
            parent?.removeChild(selectedLinkNode);
            handleVisualInput();
            setSelectedLinkNode(null);
            setIsLinkPopupOpen(false);
            setLinkUrl('');
        } else {
            execCommand('unlink');
            setIsLinkPopupOpen(false);
            setLinkUrl('');
        }
    };

    // Open Media Library Modal & Save Cursor Position
    const handleOpenMedia = (target: 'editor' | 'featured') => {
        if (target === 'editor') {
            saveSelection();
        }
        setMediaTarget(target);
        setIsMediaModalOpen(true);
    };

    // Insert Image from Media Modal AT EXACT CURSOR POSITION
    const handleInsertMedia = () => {
        if (!selectedMediaUrl) return;
        if (mediaTarget === 'featured') {
            setData('img', selectedMediaUrl);
        } else {
            const imgHtml = `<img src="${selectedMediaUrl}" alt="${data.focus_keyword || data.title || 'Blog Image'}" style="width: 100%; max-width: 500px; display: block; margin: 16px 0;" class="my-4 rounded-xl shadow-xs" />`;
            if (editorMode === 'visual' && visualRef.current) {
                visualRef.current.focus();
                restoreSelection();
                execCommand('insertHTML', imgHtml);
            } else {
                setData('content', data.content + '\n' + imgHtml);
            }
        }
        setIsMediaModalOpen(false);
        setSelectedMediaUrl('');
    };

    // Open Table Modal
    const handleOpenTableModal = () => {
        saveSelection();
        setIsTableModalOpen(true);
    };

    // Insert Custom Resizable Table with chosen Rows/Cols & normal 14px font
    const handleConfirmInsertTable = () => {
        const rows = Math.max(1, Math.min(20, tableRows));
        const cols = Math.max(1, Math.min(10, tableCols));

        let headerHtml = '';
        if (tableHasHeader) {
            headerHtml = `
  <thead>
    <tr style="background-color: #f8fafc;">
      ${Array.from({ length: cols }).map((_, c) => `<th style="border: 1px solid #cbd5e1; padding: 10px 12px; text-align: left; font-weight: 700; font-size: 14px; color: #0f172a; line-height: 1.4;">Header ${c + 1}</th>`).join('')}
    </tr>
  </thead>`;
        }

        const bodyRowsHtml = Array.from({ length: rows }).map((_, r) => `
    <tr>
      ${Array.from({ length: cols }).map((_, c) => `<td style="border: 1px solid #cbd5e1; padding: 10px 12px; font-weight: 400; font-size: 14px; color: #334155; line-height: 1.4;">Cell ${r + 1}-${c + 1}</td>`).join('')}
    </tr>`).join('');

        const tableHtml = `
<div draggable="true" style="resize: both; overflow: auto; max-width: 100%; min-width: 240px; display: block; margin: 16px 0; border: 1px solid #cbd5e1; padding: 6px; border-radius: 12px; position: relative;" class="table-wrapper group my-4 border border-slate-200 rounded-xl overflow-hidden shadow-xs cursor-move">
  <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin: 0;" class="w-full border-collapse">
    ${headerHtml}
    <tbody>
      ${bodyRowsHtml}
    </tbody>
  </table>
</div><p><br></p>`;

        if (editorMode === 'visual' && visualRef.current) {
            visualRef.current.focus();
            restoreSelection();
            execCommand('insertHTML', tableHtml);
        } else {
            setData('content', data.content + '\n' + tableHtml);
        }
        setIsTableModalOpen(false);
    };

    // Table Manipulation Actions (Row / Col / Move / Delete)
    const handleAddRowToTable = () => {
        if (!selectedTableNode) return;
        const tbody = selectedTableNode.querySelector('tbody') || selectedTableNode;
        const firstRow = tbody.querySelector('tr');
        const colCount = firstRow ? firstRow.children.length : 3;
        const rowCount = tbody.querySelectorAll('tr').length + 1;

        const newTr = document.createElement('tr');
        for (let c = 0; c < colCount; c++) {
            const td = document.createElement('td');
            td.style.border = '1px solid #cbd5e1';
            td.style.padding = '10px 12px';
            td.style.fontSize = '14px';
            td.style.color = '#334155';
            td.style.lineHeight = '1.4';
            td.innerText = `Cell ${rowCount}-${c + 1}`;
            newTr.appendChild(td);
        }
        tbody.appendChild(newTr);
        handleVisualInput();
        setTimeout(updateSelectedTableRect, 50);
    };

    const handleAddColToTable = () => {
        if (!selectedTableNode) return;
        const theadTr = selectedTableNode.querySelector('thead tr');
        if (theadTr) {
            const th = document.createElement('th');
            th.style.border = '1px solid #cbd5e1';
            th.style.padding = '10px 12px';
            th.style.textAlign = 'left';
            th.style.fontWeight = '700';
            th.style.fontSize = '14px';
            th.style.color = '#0f172a';
            th.style.lineHeight = '1.4';
            th.innerText = `Header ${theadTr.children.length + 1}`;
            theadTr.appendChild(th);
        }

        const rows = selectedTableNode.querySelectorAll('tbody tr');
        rows.forEach((tr, rIdx) => {
            const td = document.createElement('td');
            td.style.border = '1px solid #cbd5e1';
            td.style.padding = '10px 12px';
            td.style.fontSize = '14px';
            td.style.color = '#334155';
            td.style.lineHeight = '1.4';
            td.innerText = `Cell ${rIdx + 1}-${tr.children.length + 1}`;
            tr.appendChild(td);
        });
        handleVisualInput();
        setTimeout(updateSelectedTableRect, 50);
    };

    const handleDeleteSelectedTable = () => {
        if (selectedTableWrapperNode) {
            selectedTableWrapperNode.remove();
            setSelectedTableWrapperNode(null);
            setSelectedTableNode(null);
            setSelectedTableRect(null);
            handleVisualInput();
        }
    };

    const handleMoveTableUp = () => {
        if (!selectedTableWrapperNode) return;
        const prev = selectedTableWrapperNode.previousElementSibling;
        if (prev && prev.parentNode) {
            prev.parentNode.insertBefore(selectedTableWrapperNode, prev);
            handleVisualInput();
            setTimeout(updateSelectedTableRect, 50);
        }
    };

    const handleMoveTableDown = () => {
        if (!selectedTableWrapperNode) return;
        const next = selectedTableWrapperNode.nextElementSibling;
        if (next && next.parentNode) {
            next.parentNode.insertBefore(next, selectedTableWrapperNode);
            handleVisualInput();
            setTimeout(updateSelectedTableRect, 50);
        }
    };

    // Image Floating Toolbar Actions
    const handleSetImageAlignment = (align: 'left' | 'center' | 'right') => {
        if (selectedImgNode) {
            if (align === 'left') {
                selectedImgNode.style.float = 'left';
                selectedImgNode.style.margin = '0 16px 16px 0';
                selectedImgNode.style.display = 'inline-block';
            } else if (align === 'center') {
                selectedImgNode.style.float = 'none';
                selectedImgNode.style.margin = '16px auto';
                selectedImgNode.style.display = 'block';
            } else if (align === 'right') {
                selectedImgNode.style.float = 'right';
                selectedImgNode.style.margin = '0 0 16px 16px';
                selectedImgNode.style.display = 'inline-block';
            }
            handleVisualInput();
        }
    };

    const handleSetImageWidthPercent = (percent: string) => {
        if (selectedImgNode) {
            selectedImgNode.style.width = percent;
            selectedImgNode.style.maxWidth = '100%';
            handleVisualInput();
        }
    };

    const handleDeleteSelectedImage = () => {
        if (selectedImgNode) {
            selectedImgNode.remove();
            setSelectedImgNode(null);
            handleVisualInput();
        }
    };

    const handleSaveImageDetails = () => {
        if (selectedImgNode) {
            selectedImgNode.alt = imgAltText;
            selectedImgNode.title = imgTitleText;
            selectedImgNode.style.width = `${imgWidthPx}px`;
            handleVisualInput();
        }
        setIsImgDetailsModalOpen(false);
    };

    const handleCopyUrl = () => {
        if (imgFileUrl) {
            navigator.clipboard.writeText(imgFileUrl);
            setIsCopiedUrl(true);
            setTimeout(() => setIsCopiedUrl(false), 2000);
        }
    };

    // Combined default & user uploaded media
    const allMedia = useMemo(() => {
        const defaults = [
            { id: 'd1', url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600', title: 'Dental Care' },
            { id: 'd2', url: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600', title: 'Clinic Room' },
            { id: 'd3', url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600', title: 'Dentist Team' },
        ];
        if (Array.isArray(mediaList) && mediaList.length > 0) {
            return [...mediaList, ...defaults];
        }
        return defaults;
    }, [mediaList]);

    // Rank Math SEO Dynamic Scoring Logic
    const seoMetrics = useMemo(() => {
        const titleLower = data.title.toLowerCase();
        const kwLower = data.focus_keyword.toLowerCase().trim();
        const contentLower = data.content.toLowerCase();
        const slugLower = data.slug.toLowerCase();
        const descLower = data.meta_desc.toLowerCase();

        let score = 5;
        const checks = {
            kwInTitle: false,
            kwInDesc: false,
            kwInUrl: false,
            kwInBeginning: false,
            kwInContent: false,
            kwInSubheading: contentLower.includes('<h2') || contentLower.includes('<h3') || contentLower.includes('<h1'),
            hasAltImage: contentLower.includes('alt='),
            densityOk: contentLower.length > 300,
            urlLengthOk: data.slug.length < 50 && data.slug.length > 2,
            hasExternalLinks: contentLower.includes('http://') || contentLower.includes('https://'),
            hasDoFollow: contentLower.includes('<a') && !contentLower.includes('nofollow'),
            hasInternalLinks: contentLower.includes('techdentalcare.com') || contentLower.includes('/'),
            hasKeywordSet: kwLower.length > 0,
            kwInTitleStart: false,
        };

        if (kwLower) {
            score += 15;
            if (titleLower.includes(kwLower)) { checks.kwInTitle = true; score += 20; }
            if (titleLower.startsWith(kwLower)) { checks.kwInTitleStart = true; score += 10; }
            if (slugLower.includes(kwLower.replace(/\s+/g, '-'))) { checks.kwInUrl = true; score += 15; }
            if (descLower.includes(kwLower)) { checks.kwInDesc = true; score += 15; }
            if (contentLower.includes(kwLower)) { checks.kwInContent = true; score += 10; }
            if (contentLower.startsWith(kwLower) || contentLower.includes(`<p>${kwLower}`)) { checks.kwInBeginning = true; score += 10; }
        }

        if (checks.urlLengthOk) score += 5;
        if (checks.hasAltImage) score += 5;

        return { score: Math.min(100, score), checks };
    }, [data.title, data.focus_keyword, data.content, data.slug, data.meta_desc]);

    // Handle Category Toggle
    const toggleCategory = (cat: string) => {
        if (selectedCategories.includes(cat)) {
            const next = selectedCategories.filter(c => c !== cat);
            setSelectedCategories(next);
            setData('category', next[0] || 'General');
        } else {
            const next = [...selectedCategories, cat];
            setSelectedCategories(next);
            setData('category', cat);
        }
    };

    // Add Category
    const handleAddCategory = () => {
        if (newCategoryName.trim() && !categoriesList.includes(newCategoryName.trim())) {
            setCategoriesList([...categoriesList, newCategoryName.trim()]);
            setSelectedCategories([...selectedCategories, newCategoryName.trim()]);
            setData('category', newCategoryName.trim());
            setNewCategoryName('');
            setIsAddCategoryOpen(false);
        }
    };

    // FAQ Handlers
    const handleAddFaq = () => {
        setData('faqs', [...(data.faqs || []), { q: '', q_bn: '', a: '', a_bn: '' }]);
    };

    const handleRemoveFaq = (index: number) => {
        setData('faqs', (data.faqs || []).filter((_, i) => i !== index));
    };

    const handleUpdateFaq = (index: number, field: keyof FaqItem, value: string) => {
        const next = [...(data.faqs || [])];
        next[index] = { ...next[index], [field]: value };
        setData('faqs', next);
    };

    // Submit Actions
    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('posts.update', postData.id));
    };

    return (
        <AdminLayout>
            <Head title={`Edit Post: ${postData.title}`} />

            <div className="space-y-6 font-sans text-slate-800 pb-12">
                {/* 1. Top Header Bar */}
                <div className="flex items-center justify-between bg-white px-6 py-4 rounded-xl border border-slate-200 shadow-2xs">
                    <div className="flex items-center gap-3">
                        <Link href={route('posts.index')} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
                            <ArrowLeft size={18} />
                        </Link>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Edit Post</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={handleUpdate}
                            disabled={processing}
                            className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
                        >
                            Update Post
                        </button>
                    </div>
                </div>

                {/* Main 2-Column Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Left Column (Main Editor & SEO - 8 cols) */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* Title Input Card */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-2xs">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Content Language:
                                </span>
                                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                                    <button
                                        type="button"
                                        onClick={() => setContentLang('en')}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                                            contentLang === 'en'
                                                ? 'bg-white text-rose-700 shadow-xs'
                                                : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                    >
                                        <span>🇬🇧</span> English
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setContentLang('bn')}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                                            contentLang === 'bn'
                                                ? 'bg-rose-700 text-white shadow-xs'
                                                : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                    >
                                        <span>🇧🇩</span> বাংলা (Bangla)
                                    </button>
                                </div>
                            </div>

                            {contentLang === 'en' ? (
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={e => {
                                        setData('title', e.target.value);
                                        if (!isEditingSlug) {
                                            setData('slug', e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
                                        }
                                    }}
                                    placeholder="Post Title (English)..."
                                    className="w-full text-2xl font-bold text-slate-900 border-b border-slate-200 pb-3 focus:outline-none focus:border-sky-600 placeholder:text-slate-300"
                                />
                            ) : (
                                <div className="space-y-1">
                                    <input
                                        type="text"
                                        value={data.title_bn}
                                        onChange={e => setData('title_bn', e.target.value)}
                                        placeholder="পোস্টের বাংলা শিরোনাম (Bangla Title)..."
                                        className="w-full text-2xl font-bold text-rose-950 border-b border-rose-300 pb-3 focus:outline-none focus:border-rose-600 placeholder:text-rose-300 bg-rose-50/20 px-2 rounded-t-lg"
                                    />
                                    <div className="text-[11px] text-rose-600 italic">
                                        * বাংলা মোড সক্রিয়: নিচে ব্লগ আর্টিকেলের বাংলা কনটেন্ট লিখুন বা পেস্ট করুন।
                                    </div>
                                </div>
                            )}

                            {/* Permalink / Slug Display */}
                            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono pt-1">
                                <span>Permalink:</span>
                                <span className="text-slate-400">https://techdentalcare.com/blog/</span>
                                {isEditingSlug ? (
                                    <div className="flex items-center gap-1">
                                        <input
                                            type="text"
                                            value={data.slug}
                                            onChange={e => setData('slug', e.target.value)}
                                            className="px-2 py-0.5 border border-sky-400 rounded text-xs text-slate-800 font-mono focus:outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setIsEditingSlug(false)}
                                            className="px-2 py-0.5 bg-sky-600 text-white rounded text-[10px] font-bold cursor-pointer"
                                        >
                                            OK
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-slate-700">{data.slug}</span>
                                        <button
                                            type="button"
                                            onClick={() => setIsEditingSlug(true)}
                                            className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-[10px] font-bold cursor-pointer"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Classic WordPress Content Editor */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs relative">

                            {/* FULL STICKY HEADER & TOOLBAR WRAPPER (Solid bg-white, 100% opaque to block scrolled text) */}
                            <div className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-md rounded-t-2xl overflow-hidden">
                                
                                {/* 1. Editor Top Bar (WRITE CONTENT + Visual/Code toggle) */}
                                <div className="px-6 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-100 rounded-t-2xl">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">WRITE CONTENT</span>
                                    <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-lg">
                                        <button
                                            type="button"
                                            onClick={() => setEditorMode('visual')}
                                            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                                                editorMode === 'visual' ? 'bg-sky-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                                            }`}
                                        >
                                            Visual
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setEditorMode('code')}
                                            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                                                editorMode === 'code' ? 'bg-sky-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                                            }`}
                                        >
                                            Code
                                        </button>
                                    </div>
                                </div>

                                {/* 2. Classic Formatting Toolbar */}
                                <div className="px-4 py-2.5 bg-white flex flex-wrap items-center gap-1.5 text-slate-600 relative">
                                    
                                    {/* Add Media Button */}
                                    <button
                                        type="button"
                                        onClick={() => handleOpenMedia('editor')}
                                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
                                    >
                                        <Image size={14} className="text-sky-600" />
                                        <span>Add Media</span>
                                    </button>

                                    <div className="h-4 w-px bg-slate-200 mx-1" />

                                    {/* Heading Selector */}
                                    <select
                                        onChange={e => applyHeading(e.target.value)}
                                        className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none bg-white font-medium cursor-pointer"
                                    >
                                        <option value="p">Paragraph</option>
                                        <option value="h1">Heading 1</option>
                                        <option value="h2">Heading 2</option>
                                        <option value="h3">Heading 3</option>
                                        <option value="h4">Heading 4</option>
                                        <option value="h5">Heading 5</option>
                                        <option value="h6">Heading 6</option>
                                    </select>

                                    <div className="h-4 w-px bg-slate-200 mx-1" />

                                    {/* Basic Styling */}
                                    <button type="button" onClick={() => execCommand('bold')} className="p-1.5 hover:bg-slate-100 rounded text-slate-700 font-bold cursor-pointer" title="Bold">B</button>
                                    <button type="button" onClick={() => execCommand('italic')} className="p-1.5 hover:bg-slate-100 rounded text-slate-700 italic font-serif cursor-pointer" title="Italic">I</button>
                                    
                                    {/* Lists */}
                                    <button type="button" onClick={() => execCommand('insertUnorderedList')} className="p-1.5 hover:bg-slate-100 rounded text-slate-700 cursor-pointer" title="Unordered List"><List size={14} /></button>
                                    <button type="button" onClick={() => execCommand('insertOrderedList')} className="p-1.5 hover:bg-slate-100 rounded text-slate-700 cursor-pointer" title="Ordered List"><ListOrdered size={14} /></button>
                                    
                                    <button type="button" onClick={() => execCommand('formatBlock', '<blockquote>')} className="p-1.5 hover:bg-slate-100 rounded text-slate-700 cursor-pointer" title="Quote"><Quote size={14} /></button>

                                    {/* Insert Custom Table Button */}
                                    <button type="button" onClick={handleOpenTableModal} className="p-1.5 hover:bg-slate-100 rounded text-slate-700 cursor-pointer" title="Insert Custom Table"><Table size={14} /></button>

                                    <div className="h-4 w-px bg-slate-200 mx-1" />

                                    {/* Alignments */}
                                    <button type="button" onClick={() => execCommand('justifyLeft')} className="p-1.5 hover:bg-slate-100 rounded text-slate-700 cursor-pointer" title="Align Left"><AlignLeft size={14} /></button>
                                    <button type="button" onClick={() => execCommand('justifyCenter')} className="p-1.5 hover:bg-slate-100 rounded text-slate-700 cursor-pointer" title="Align Center"><AlignCenter size={14} /></button>
                                    <button type="button" onClick={() => execCommand('justifyRight')} className="p-1.5 hover:bg-slate-100 rounded text-slate-700 cursor-pointer" title="Align Right"><AlignRight size={14} /></button>

                                    <div className="h-4 w-px bg-slate-200 mx-1" />

                                    {/* Link Trigger */}
                                    <button 
                                        type="button" 
                                        onClick={handleOpenLinkToolbar} 
                                        className={`link-trigger-btn p-1.5 rounded cursor-pointer transition-colors ${isLinkPopupOpen ? 'bg-sky-100 text-sky-700' : 'hover:bg-slate-100 text-slate-700'}`} 
                                        title={selectedLinkNode ? "Edit Active Link" : "Insert Link"}
                                    >
                                        <LinkIcon size={14} />
                                    </button>
                                    
                                    <button type="button" onClick={removeLink} className="p-1.5 hover:bg-slate-100 rounded text-slate-700 cursor-pointer" title="Remove Link"><Unlink size={14} /></button>

                                    {/* Text Color Picker Trigger */}
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                                            className="p-1.5 hover:bg-slate-100 rounded text-slate-700 flex items-center gap-0.5 cursor-pointer"
                                            title="Text Color"
                                        >
                                            <Palette size={14} className="text-sky-600" />
                                            <span className="text-[10px] font-bold text-slate-400">▼</span>
                                        </button>

                                        {/* Color Swatch Popup */}
                                        {isColorPickerOpen && (
                                            <div className="absolute top-full left-0 mt-2 z-40 bg-white border border-slate-200 rounded-xl p-2 shadow-lg grid grid-cols-4 gap-1.5 w-32">
                                                {['#0f172a', '#dc2626', '#2563eb', '#059669', '#d97706', '#7c3aed', '#800038', '#475569'].map(color => (
                                                    <button
                                                        key={color}
                                                        type="button"
                                                        onClick={() => applyColor(color)}
                                                        className="w-6 h-6 rounded-full border border-slate-200 cursor-pointer hover:scale-110 transition-transform"
                                                        style={{ backgroundColor: color }}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="h-4 w-px bg-slate-200 mx-1" />

                                    <button type="button" onClick={() => execCommand('undo')} className="p-1.5 hover:bg-slate-100 rounded text-slate-700 cursor-pointer" title="Undo"><RotateCcw size={14} /></button>
                                    <button type="button" onClick={() => execCommand('redo')} className="p-1.5 hover:bg-slate-100 rounded text-slate-700 cursor-pointer" title="Redo"><RotateCw size={14} /></button>

                                    {/* Floating WordPress-style Link Popup & URL Inspector */}
                                    {isLinkPopupOpen && (
                                        <div className="link-popup-box absolute top-full left-4 sm:left-12 mt-2 z-40 bg-white border border-slate-200 rounded-2xl p-3 shadow-2xl flex flex-col gap-2.5 w-80 sm:w-96 animate-in fade-in duration-150">
                                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                                    <LinkIcon size={13} className="text-sky-600" />
                                                    <span>{selectedLinkNode ? 'Edit Link' : 'Insert Link'}</span>
                                                </span>
                                                {selectedLinkNode && (
                                                    <span className="text-[10px] font-semibold bg-sky-50 text-sky-700 border border-sky-100 px-2 py-0.5 rounded-full">
                                                        Active Link Selected
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-1.5">
                                                <input
                                                    type="url"
                                                    value={linkUrl}
                                                    onChange={e => setLinkUrl(e.target.value)}
                                                    placeholder="Paste URL or type (e.g. https://...)"
                                                    className="w-full text-xs px-3 py-2 border border-sky-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 bg-slate-50 focus:bg-white text-slate-800"
                                                    autoFocus
                                                    onKeyDown={e => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            applyLink();
                                                        }
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={applyLink}
                                                    className="px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl cursor-pointer shrink-0 transition flex items-center gap-1 shadow-xs"
                                                    title="Save Link"
                                                >
                                                    <CornerDownLeft size={13} />
                                                    <span>Save</span>
                                                </button>
                                            </div>

                                            {/* Link options & preview */}
                                            <div className="flex items-center justify-between pt-0.5 text-xs">
                                                <label className="flex items-center gap-1.5 text-[11px] text-slate-600 cursor-pointer select-none" title="Open link in a new browser tab">
                                                    <input
                                                        type="checkbox"
                                                        checked={linkOpenNewTab}
                                                        onChange={e => setLinkOpenNewTab(e.target.checked)}
                                                        className="rounded text-sky-600 focus:ring-sky-500"
                                                    />
                                                    <span>Open in new tab</span>
                                                </label>

                                                <div className="flex items-center gap-2">
                                                    {linkUrl && (
                                                        <a
                                                            href={linkUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 text-[11px] font-medium text-sky-600 hover:text-sky-800 hover:underline"
                                                            title="Test link in new window"
                                                        >
                                                            <span>Visit</span>
                                                            <ExternalLink size={11} />
                                                        </a>
                                                    )}
                                                    {(selectedLinkNode || linkUrl) && (
                                                        <button
                                                            type="button"
                                                            onClick={removeLink}
                                                            className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
                                                            title="Remove link from text"
                                                        >
                                                            <Unlink size={11} />
                                                            <span>Unlink</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Visible URL Box */}
                                            {linkUrl && (
                                                <div className="bg-slate-50 rounded-lg p-2 border border-slate-200/80 text-[10px] text-slate-600 break-all select-all flex items-start gap-1.5">
                                                    <span className="font-bold text-slate-400 shrink-0 uppercase tracking-wider text-[9px] mt-0.5">URL:</span>
                                                    <span className="font-mono text-slate-700">{linkUrl}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Relative Container for Visual Editor & Exact Image Selection Overlay (Inner Scroll Container to clip scrolled text completely) */}
                            <div className="relative max-h-[calc(100vh-250px)] overflow-y-auto custom-scrollbar rounded-b-2xl bg-white" onScroll={updateSelectedImgRect}>
                                
                                {/* Floating Overlay Toolbar & Resizing Handles */}
                                {selectedImgNode && selectedImgRect && (
                                    <>
                                        {/* Floating Dark Toolbar directly above image (or inside top edge if at top) */}
                                        <div 
                                            className="absolute z-30 bg-slate-900 text-white px-3 py-1.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-in fade-in duration-150"
                                            style={{
                                                top: selectedImgRect.top > 50 ? selectedImgRect.top - 46 : selectedImgRect.top + 8,
                                                left: Math.max(10, selectedImgRect.left)
                                            }}
                                        >
                                            <button
                                                type="button"
                                                onClick={() => setIsImgDetailsModalOpen(true)}
                                                className="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded-lg flex items-center gap-1 text-[11px] font-bold cursor-pointer"
                                            >
                                                <Edit3 size={12} />
                                                <span>Edit</span>
                                            </button>

                                            <span className="text-slate-400 font-mono text-[11px] px-1 border-r border-slate-700">
                                                {imgWidthPx}px
                                            </span>

                                            {/* Alignment Controls */}
                                            <div className="flex items-center gap-1 border-r border-slate-700 pr-2">
                                                <button type="button" onClick={() => handleSetImageAlignment('left')} className="p-1 hover:bg-slate-800 rounded text-slate-300" title="Align Left"><AlignLeft size={12} /></button>
                                                <button type="button" onClick={() => handleSetImageAlignment('center')} className="p-1 hover:bg-slate-800 rounded text-slate-300" title="Align Center"><AlignCenter size={12} /></button>
                                                <button type="button" onClick={() => handleSetImageAlignment('right')} className="p-1 hover:bg-slate-800 rounded text-slate-300" title="Align Right"><AlignRight size={12} /></button>
                                            </div>

                                            {/* Width Presets */}
                                            <div className="flex items-center gap-1 border-r border-slate-700 pr-2 text-[10px]">
                                                <button type="button" onClick={() => handleSetImageWidthPercent('100%')} className="px-1.5 py-0.5 hover:bg-slate-800 rounded text-slate-300">100%</button>
                                                <button type="button" onClick={() => handleSetImageWidthPercent('50%')} className="px-1.5 py-0.5 hover:bg-slate-800 rounded text-slate-300">50%</button>
                                                <button type="button" onClick={() => handleSetImageWidthPercent('25%')} className="px-1.5 py-0.5 hover:bg-slate-800 rounded text-slate-300">25%</button>
                                            </div>

                                            {/* Delete Button */}
                                            <button
                                                type="button"
                                                onClick={handleDeleteSelectedImage}
                                                className="px-2 py-1 text-rose-400 hover:text-rose-300 font-bold text-[11px] cursor-pointer"
                                            >
                                                Delete
                                            </button>
                                        </div>

                                        {/* 4 Interactive Corner Drag Resizing Handles (Exact Match around Image) */}
                                        <div 
                                            className="absolute z-20 pointer-events-none border-2 border-rose-500 rounded-lg"
                                            style={{
                                                top: selectedImgRect.top,
                                                left: selectedImgRect.left,
                                                width: selectedImgRect.width,
                                                height: selectedImgRect.height
                                            }}
                                        >
                                            {/* Bottom-Right Handle (Draggable) */}
                                            <div
                                                onMouseDown={handleResizeMouseDown}
                                                className="absolute -bottom-2 -right-2 w-4 h-4 bg-rose-800 border-2 border-white rounded-full cursor-nwse-resize pointer-events-auto shadow-md hover:scale-125 transition-transform"
                                            />
                                            <div className="absolute -top-2 -left-2 w-3 h-3 bg-rose-800 border-2 border-white rounded-full" />
                                            <div className="absolute -top-2 -right-2 w-3 h-3 bg-rose-800 border-2 border-white rounded-full" />
                                            <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-rose-800 border-2 border-white rounded-full" />
                                        </div>
                                    </>
                                )}

                                {/* Floating Table Toolbar & Bottom-Right + Plus Icon Overlay */}
                                {selectedTableWrapperNode && selectedTableRect && (
                                    <>
                                        {/* Floating Table Toolbar directly above table */}
                                        <div 
                                            className="table-toolbar-overlay absolute z-30 bg-slate-900 text-white px-3 py-1.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-in fade-in duration-150"
                                            style={{
                                                top: selectedTableRect.top > 45 ? selectedTableRect.top - 42 : selectedTableRect.top + 8,
                                                left: Math.max(10, selectedTableRect.left)
                                            }}
                                        >
                                            <span className="text-sky-400 font-bold flex items-center gap-1 text-[11px] border-r border-slate-700 pr-2">
                                                <Table size={12} /> Table
                                            </span>
                                            <button type="button" onClick={handleMoveTableUp} className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 text-[11px] flex items-center gap-1 cursor-pointer" title="Move Table Up">▲ Up</button>
                                            <button type="button" onClick={handleMoveTableDown} className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 text-[11px] flex items-center gap-1 cursor-pointer" title="Move Table Down">▼ Down</button>
                                            <div className="h-3 w-px bg-slate-700" />
                                            <button type="button" onClick={handleAddRowToTable} className="px-2 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer">+ Row</button>
                                            <button type="button" onClick={handleAddColToTable} className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer">+ Column</button>
                                            <button type="button" onClick={handleDeleteSelectedTable} className="px-2 py-1 text-rose-400 hover:text-rose-300 text-[11px] font-bold cursor-pointer">Delete</button>
                                        </div>

                                        {/* Bottom-Right Corner Plus Button Overlay (Exact Red Box match from user screenshot) */}
                                        <div
                                            className="table-toolbar-overlay absolute z-30 flex items-center gap-1.5 animate-in zoom-in-95 duration-150"
                                            style={{
                                                top: selectedTableRect.top + selectedTableRect.height - 38,
                                                left: selectedTableRect.left + selectedTableRect.width - 80,
                                            }}
                                        >
                                            <button
                                                type="button"
                                                onClick={handleAddRowToTable}
                                                className="w-8 h-8 bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-lg flex items-center justify-center cursor-pointer font-bold border-2 border-white hover:scale-110 transition-transform"
                                                title="Add New Row (+)"
                                            >
                                                <Plus size={18} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleAddColToTable}
                                                className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg shadow-lg text-[10px] font-bold border border-slate-700 cursor-pointer hover:scale-105 transition-transform"
                                                title="Add New Column"
                                            >
                                                + Col
                                            </button>
                                        </div>
                                    </>
                                )}

                                {/* Live Dual Editor (Visual vs Code View) */}
                                {editorMode === 'visual' ? (
                                    <div
                                        ref={visualRef}
                                        contentEditable
                                        onInput={handleVisualInput}
                                        onKeyUp={handleEditorKeyUp}
                                        onMouseUp={handleEditorClick}
                                        onFocus={saveSelection}
                                        className="w-full min-h-[420px] p-6 text-sm text-slate-800 leading-relaxed focus:outline-none prose max-w-none [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:my-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:my-3 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:my-2 [&_h4]:text-lg [&_h4]:font-bold [&_h5]:text-base [&_h5]:font-bold [&_h6]:text-sm [&_h6]:font-bold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_blockquote]:border-l-4 [&_blockquote]:border-sky-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_img]:cursor-pointer [&_img]:transition-shadow [&_img]:hover:outline-2 [&_img]:hover:outline-sky-500"
                                    />
                                ) : (
                                    <textarea
                                        value={contentLang === 'en' ? data.content : data.content_bn}
                                        onChange={e => setData(contentLang === 'en' ? 'content' : 'content_bn', e.target.value)}
                                        rows={18}
                                        placeholder={contentLang === 'bn' ? "HTML কোড বাংলায় লিখুন..." : "HTML Code..."}
                                        className="w-full p-6 text-xs text-slate-800 leading-relaxed font-mono border-none focus:outline-none bg-slate-900 text-emerald-400 rounded-b-2xl"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Rank Math Real SEO Box */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                            {/* Header */}
                            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                                <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                                    <Sparkles className="w-4 h-4 text-amber-500" />
                                    <span>SEO</span>
                                </div>

                                <div className="flex items-center gap-1 bg-slate-200/60 p-1 rounded-lg">
                                    <button
                                        type="button"
                                        onClick={() => setSeoTab('general')}
                                        className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                                            seoTab === 'general' ? 'bg-sky-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                    >
                                        General
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSeoTab('advanced')}
                                        className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                                            seoTab === 'advanced' ? 'bg-sky-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                    >
                                        Advanced
                                    </button>
                                </div>
                            </div>

                            {seoTab === 'general' ? (
                                <div className="p-6 space-y-6">
                                    {/* PREVIEW Card */}
                                    <div className="border border-slate-200 rounded-xl p-4 space-y-3 bg-white">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">PREVIEW</span>
                                            <button
                                                type="button"
                                                onClick={() => setIsSnippetModalOpen(true)}
                                                className="px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                                            >
                                                Edit Snippet
                                            </button>
                                        </div>

                                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                                            <div className="text-sky-700 font-semibold text-base hover:underline cursor-pointer">
                                                {data.seo_title || `${data.title || 'Post Title'} | Tech Dental`}
                                            </div>
                                            <div className="text-emerald-700 text-xs font-mono">
                                                https://techdentalcare.com/blog/{data.slug || 'post-slug'}
                                            </div>
                                            <div className="text-slate-500 text-xs">
                                                {data.meta_desc || data.excerpt || 'Write an excerpt or meta description for Google preview...'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Focus Keyword Input */}
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                                            <span>Focus Keyword</span>
                                            <span className="text-slate-400 font-mono">{data.focus_keyword.length} / 100</span>
                                        </div>
                                        <input
                                            type="text"
                                            value={data.focus_keyword}
                                            onChange={e => setData('focus_keyword', e.target.value)}
                                            placeholder="Example: Rank Math SEO"
                                            className="w-full border border-slate-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-medium"
                                        />
                                    </div>

                                    {/* Score Indicator Banner */}
                                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between text-xs font-semibold text-amber-900">
                                        <span>Read here to <strong>Score 100/100</strong></span>
                                        <span className={`px-3 py-1 rounded-full font-bold text-xs shadow-xs text-white ${
                                            seoMetrics.score > 70 ? 'bg-emerald-600' : seoMetrics.score > 40 ? 'bg-amber-600' : 'bg-rose-500'
                                        }`}>
                                            {seoMetrics.score} / 100
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                /* Advanced Tab */
                                <div className="p-6 space-y-6">
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                                            <span>Canonical URL</span>
                                            <span className="text-slate-400 text-[10px]">Cross-domain or canonical URL</span>
                                        </div>
                                        <input
                                            type="text"
                                            value={data.canonical_url}
                                            onChange={e => setData('canonical_url', e.target.value)}
                                            placeholder="https://techdentalcare.com/blog/example-canonical"
                                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-medium"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                                            <span>Breadcrumb Title</span>
                                            <span className="text-slate-400 text-[10px]">Custom title for navigation breadcrumbs</span>
                                        </div>
                                        <input
                                            type="text"
                                            value={data.breadcrumb_title}
                                            onChange={e => setData('breadcrumb_title', e.target.value)}
                                            placeholder="Enter custom breadcrumb title..."
                                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-medium"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Excerpt Card (English & Bangla) */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xs">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                                    Post Excerpt & Short Summary (English & বাংলা)
                                </h3>
                                <span className="text-[11px] text-slate-400">Used for blog cards and article intro</span>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Excerpt (English)</label>
                                    <textarea
                                        rows={3}
                                        value={data.excerpt}
                                        onChange={e => setData('excerpt', e.target.value)}
                                        placeholder="Brief summary in English..."
                                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-rose-800 mb-1">সংক্ষিপ্ত বিবরণ / ভূমিকা (বাংলা)</label>
                                    <textarea
                                        rows={3}
                                        value={data.excerpt_bn}
                                        onChange={e => setData('excerpt_bn', e.target.value)}
                                        placeholder="পোস্টের বাংলা সংক্ষিপ্ত ভূমিকা লিখুন..."
                                        className="w-full border border-rose-200 rounded-xl px-3 py-2 text-xs bg-rose-50/20 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* FAQ Section Card (English & Bangla) */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xs">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-rose-700" />
                                        <span>Post FAQs (English & Bangla)</span>
                                    </h3>
                                    <p className="text-[11px] text-slate-400 mt-0.5">Add frequently asked questions and answers for this article</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleAddFaq}
                                    className="px-3 py-1.5 bg-[#800038] hover:bg-[#9a0044] text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                                >
                                    <Plus size={14} /> Add FAQ
                                </button>
                            </div>

                            <div className="space-y-4">
                                {(data.faqs || []).map((faq, i) => (
                                    <div key={i} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-rose-800">FAQ #{i + 1}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveFaq(i)}
                                                className="text-xs text-rose-500 hover:text-rose-700 font-semibold cursor-pointer flex items-center gap-1"
                                            >
                                                <Trash2 size={13} /> Delete
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-[11px] font-bold text-slate-700 mb-1">Question (English)</label>
                                                <input
                                                    type="text"
                                                    value={faq.q}
                                                    onChange={e => handleUpdateFaq(i, 'q', e.target.value)}
                                                    placeholder="Question in English..."
                                                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold text-rose-800 mb-1">প্রশ্ন (বাংলা)</label>
                                                <input
                                                    type="text"
                                                    value={faq.q_bn || ''}
                                                    onChange={e => handleUpdateFaq(i, 'q_bn', e.target.value)}
                                                    placeholder="প্রশ্ন বাংলায় লিখুন..."
                                                    className="w-full px-3 py-2 text-xs bg-rose-50/30 border border-rose-200 rounded-lg"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-[11px] font-bold text-slate-700 mb-1">Answer (English)</label>
                                                <textarea
                                                    rows={2}
                                                    value={faq.a}
                                                    onChange={e => handleUpdateFaq(i, 'a', e.target.value)}
                                                    placeholder="Answer in English..."
                                                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold text-rose-800 mb-1">উত্তর (বাংলা)</label>
                                                <textarea
                                                    rows={2}
                                                    value={faq.a_bn || ''}
                                                    onChange={e => handleUpdateFaq(i, 'a_bn', e.target.value)}
                                                    placeholder="উত্তর বাংলায় লিখুন..."
                                                    className="w-full px-3 py-2 text-xs bg-rose-50/30 border border-rose-200 rounded-lg"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {(!data.faqs || data.faqs.length === 0) && (
                                    <div className="p-4 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-400">
                                        No FAQs added yet. Click "+ Add FAQ" to add questions & answers.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* SECTION RENAMING & TITLES CARD */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-2xs">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-rose-700" />
                                        <span>Blog Section Titles & Renaming (সেকশনের শিরোনাম পরিবর্তন)</span>
                                    </h3>
                                    <p className="text-[11px] text-slate-400 mt-0.5">
                                        Rename any section heading on this blog single page in English & বাংলা
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* TOC Title */}
                                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                                    <span className="text-xs font-bold text-slate-800">1. Table of Contents (TOC) Title</span>
                                    <div>
                                        <label className="text-[10px] text-slate-500 font-bold block mb-0.5">English</label>
                                        <input
                                            type="text"
                                            value={data.section_titles?.toc || ''}
                                            onChange={e => setData('section_titles', { ...data.section_titles, toc: e.target.value })}
                                            placeholder="e.g. Table of Contents"
                                            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-rose-700 font-bold block mb-0.5">বাংলা</label>
                                        <input
                                            type="text"
                                            value={data.section_titles?.toc_bn || ''}
                                            onChange={e => setData('section_titles', { ...data.section_titles, toc_bn: e.target.value })}
                                            placeholder="যেমন: সূচিপত্র (TOC)"
                                            className="w-full px-3 py-1.5 text-xs bg-rose-50/20 border border-rose-200 rounded-lg"
                                        />
                                    </div>
                                </div>

                                {/* FAQ Section Title */}
                                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                                    <span className="text-xs font-bold text-slate-800">2. FAQ Section Title</span>
                                    <div>
                                        <label className="text-[10px] text-slate-500 font-bold block mb-0.5">English</label>
                                        <input
                                            type="text"
                                            value={data.section_titles?.faq || ''}
                                            onChange={e => setData('section_titles', { ...data.section_titles, faq: e.target.value })}
                                            placeholder="e.g. Frequently Asked Questions"
                                            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-rose-700 font-bold block mb-0.5">বাংলা</label>
                                        <input
                                            type="text"
                                            value={data.section_titles?.faq_bn || ''}
                                            onChange={e => setData('section_titles', { ...data.section_titles, faq_bn: e.target.value })}
                                            placeholder="যেমন: সাধারণ প্রশ্নোত্তর (FAQ)"
                                            className="w-full px-3 py-1.5 text-xs bg-rose-50/20 border border-rose-200 rounded-lg"
                                        />
                                    </div>
                                </div>

                                {/* Why Choose Us Section Title */}
                                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                                    <span className="text-xs font-bold text-slate-800">3. Why Choose Us / CTA Title</span>
                                    <div>
                                        <label className="text-[10px] text-slate-500 font-bold block mb-0.5">English</label>
                                        <input
                                            type="text"
                                            value={data.section_titles?.cta || ''}
                                            onChange={e => setData('section_titles', { ...data.section_titles, cta: e.target.value })}
                                            placeholder="e.g. Why Choose Tech Dental for Your Treatment?"
                                            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-rose-700 font-bold block mb-0.5">বাংলা</label>
                                        <input
                                            type="text"
                                            value={data.section_titles?.cta_bn || ''}
                                            onChange={e => setData('section_titles', { ...data.section_titles, cta_bn: e.target.value })}
                                            placeholder="যেমন: আপনার চিকিৎসার জন্য টেক ডেন্টাল কেন বেছে নেবেন?"
                                            className="w-full px-3 py-1.5 text-xs bg-rose-50/20 border border-rose-200 rounded-lg"
                                        />
                                    </div>
                                </div>

                                {/* Author Section Title */}
                                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                                    <span className="text-xs font-bold text-slate-800">4. Author Profile Title</span>
                                    <div>
                                        <label className="text-[10px] text-slate-500 font-bold block mb-0.5">English</label>
                                        <input
                                            type="text"
                                            value={data.section_titles?.author || ''}
                                            onChange={e => setData('section_titles', { ...data.section_titles, author: e.target.value })}
                                            placeholder="e.g. About the Author"
                                            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-rose-700 font-bold block mb-0.5">বাংলা</label>
                                        <input
                                            type="text"
                                            value={data.section_titles?.author_bn || ''}
                                            onChange={e => setData('section_titles', { ...data.section_titles, author_bn: e.target.value })}
                                            placeholder="যেমন: লেখক ও বিশেষজ্ঞ পরিচিতি"
                                            className="w-full px-3 py-1.5 text-xs bg-rose-50/20 border border-rose-200 rounded-lg"
                                        />
                                    </div>
                                </div>

                                {/* Related Articles Title */}
                                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 md:col-span-2">
                                    <span className="text-xs font-bold text-slate-800">5. Related Articles Title</span>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-[10px] text-slate-500 font-bold block mb-0.5">English</label>
                                            <input
                                                type="text"
                                                value={data.section_titles?.related || ''}
                                                onChange={e => setData('section_titles', { ...data.section_titles, related: e.target.value })}
                                                placeholder="e.g. Related Articles"
                                                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-rose-700 font-bold block mb-0.5">বাংলা</label>
                                            <input
                                                type="text"
                                                value={data.section_titles?.related_bn || ''}
                                                onChange={e => setData('section_titles', { ...data.section_titles, related_bn: e.target.value })}
                                                placeholder="যেমন: সম্পর্কিত অন্যান্য ব্লগ ও গাইড"
                                                className="w-full px-3 py-1.5 text-xs bg-rose-50/20 border border-rose-200 rounded-lg"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* WHY CHOOSE TECH DENTAL / CONTACT CTA BANNER CUSTOMIZATION */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-2xs">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-[#881337]" />
                                        <span>Why Choose Us / Contact Banner Details (ক্লিনিক ও কল-টু-অ্যাকশন ব্যানার)</span>
                                    </h3>
                                    <p className="text-[11px] text-slate-400 mt-0.5">
                                        Customize the clinic info, hotline, addresses, and callout banner displayed at the bottom of the article
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-700 block mb-1">Clinic Description (English)</label>
                                        <textarea
                                            rows={3}
                                            value={data.cta_box?.desc || ''}
                                            onChange={e => setData('cta_box', { ...data.cta_box, desc: e.target.value })}
                                            placeholder="For any gum problem, an accurate diagnosis using modern technology is vital..."
                                            className="w-full border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-sky-500/20"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-rose-800 block mb-1">ক্লিনিক বিবরণ (বাংলা)</label>
                                        <textarea
                                            rows={3}
                                            value={data.cta_box?.desc_bn || ''}
                                            onChange={e => setData('cta_box', { ...data.cta_box, desc_bn: e.target.value })}
                                            placeholder="যেকোনো দাঁত ও মাড়ির সমস্যার সঠিক ও আধুনিক রোগ নির্ণয় অত্যন্ত গুরুত্বপূর্ণ..."
                                            className="w-full border border-rose-200 bg-rose-50/20 rounded-xl p-3 text-xs focus:ring-2 focus:ring-rose-500/20 font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-700 block mb-1">Banner Title (English)</label>
                                        <input
                                            type="text"
                                            value={data.cta_box?.banner_title || ''}
                                            onChange={e => setData('cta_box', { ...data.cta_box, banner_title: e.target.value })}
                                            placeholder="Ready to smile again?"
                                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-rose-800 block mb-1">ব্যানার শিরোনাম (বাংলা)</label>
                                        <input
                                            type="text"
                                            value={data.cta_box?.banner_title_bn || ''}
                                            onChange={e => setData('cta_box', { ...data.cta_box, banner_title_bn: e.target.value })}
                                            placeholder="আবারও প্রাণবন্ত হাসতে প্রস্তুত?"
                                            className="w-full border border-rose-200 bg-rose-50/20 rounded-xl px-3 py-2 text-xs font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-700 block mb-1">Banner Subtitle (English)</label>
                                        <input
                                            type="text"
                                            value={data.cta_box?.banner_subtitle || ''}
                                            onChange={e => setData('cta_box', { ...data.cta_box, banner_subtitle: e.target.value })}
                                            placeholder="Don't delay your dental health! Book your appointment today."
                                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-rose-800 block mb-1">ব্যানার সাবটাইটেল (বাংলা)</label>
                                        <input
                                            type="text"
                                            value={data.cta_box?.banner_subtitle_bn || ''}
                                            onChange={e => setData('cta_box', { ...data.cta_box, banner_subtitle_bn: e.target.value })}
                                            placeholder="দাঁতের চিকিৎসায় আর অবহেলা নয়! আজই আপনার অ্যাপয়েন্টমেন্ট নিশ্চিত করুন।"
                                            className="w-full border border-rose-200 bg-rose-50/20 rounded-xl px-3 py-2 text-xs font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-700 block mb-1">Address / Main Branch (English)</label>
                                        <input
                                            type="text"
                                            value={data.cta_box?.address || ''}
                                            onChange={e => setData('cta_box', { ...data.cta_box, address: e.target.value })}
                                            placeholder="827 (2nd Floor), Shewrapara, Mirpur, Dhaka 1216"
                                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-rose-800 block mb-1">প্রধান শাখার ঠিকানা (বাংলা)</label>
                                        <input
                                            type="text"
                                            value={data.cta_box?.address_bn || ''}
                                            onChange={e => setData('cta_box', { ...data.cta_box, address_bn: e.target.value })}
                                            placeholder="৮২৭ (২য় তলা), শেওড়াপাড়া, বেগম রোকেয়া সরণি, মিরপুর, ঢাকা"
                                            className="w-full border border-rose-200 bg-rose-50/20 rounded-xl px-3 py-2 text-xs font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-700 block mb-1">Other Branches</label>
                                        <input
                                            type="text"
                                            value={data.cta_box?.branches || ''}
                                            onChange={e => setData('cta_box', { ...data.cta_box, branches: e.target.value })}
                                            placeholder="Uttara, Badda, Jatrabari"
                                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-700 block mb-1">Website URL</label>
                                        <input
                                            type="text"
                                            value={data.cta_box?.website || ''}
                                            onChange={e => setData('cta_box', { ...data.cta_box, website: e.target.value })}
                                            placeholder="www.techdental.com"
                                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-700 block mb-1">Hotline / Phone</label>
                                        <input
                                            type="text"
                                            value={data.cta_box?.phone || ''}
                                            onChange={e => setData('cta_box', { ...data.cta_box, phone: e.target.value })}
                                            placeholder="09638-000505"
                                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-[#881337]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Column (Sidebar Cards - 4 cols) */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* 01. FEATURED IMAGE */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-2xs">
                            <MediaImagePicker
                                label="01. Featured Image"
                                value={data.img}
                                onChange={(val) => {
                                    setData('img', val);
                                    setData('thumb_url', val);
                                }}
                                aspectRatio="16:9"
                                helperText="Recommended 16:9 cover image for the blog post"
                            />
                        </div>

                        {/* AUTHOR / DOCTOR INFO */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-2xs">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Author & Doctor</h3>
                            
                            <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-200">
                                <img
                                    src={data.author_avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&q=80'}
                                    alt={data.author_name}
                                    className="w-10 h-10 rounded-full object-cover border border-slate-300 shadow-xs shrink-0"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&q=80';
                                    }}
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs font-bold text-slate-900 truncate">{data.author_name || 'Dr. Farhana Ahmed, BDS'}</div>
                                    <div className="text-[10px] text-slate-500 truncate">{data.category || 'Dental Specialist'}</div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-slate-700">Doctor / Author Name (English)</label>
                                <input
                                    type="text"
                                    value={data.author_name}
                                    onChange={e => setData('author_name', e.target.value)}
                                    placeholder="e.g. Dr. Farhana Ahmed, BDS"
                                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-rose-800">ডাক্তারের নাম (বাংলা)</label>
                                <input
                                    type="text"
                                    value={data.author_name_bn}
                                    onChange={e => setData('author_name_bn', e.target.value)}
                                    placeholder="যেমন: ডা. ফারহানা আহমেদ, বিডিএস"
                                    className="w-full border border-rose-200 bg-rose-50/20 rounded-xl px-3 py-2 text-xs focus:outline-none"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-slate-700">Doctor Bio (English)</label>
                                <textarea
                                    rows={2}
                                    value={data.author_bio}
                                    onChange={e => setData('author_bio', e.target.value)}
                                    placeholder="Doctor short biography in English..."
                                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-rose-800">ডাক্তার পরিচিতি (বাংলা)</label>
                                <textarea
                                    rows={2}
                                    value={data.author_bio_bn}
                                    onChange={e => setData('author_bio_bn', e.target.value)}
                                    placeholder="ডাক্তারের বাংলা পরিচিতি ও ক্লিনিক্যাল অভিজ্ঞতা..."
                                    className="w-full border border-rose-200 bg-rose-50/20 rounded-xl px-3 py-2 text-xs focus:outline-none"
                                />
                            </div>

                            <div className="pt-2">
                                <MediaImagePicker
                                    label="Doctor Avatar / Photo"
                                    value={data.author_avatar}
                                    onChange={(val) => setData('author_avatar', val)}
                                    aspectRatio="1:1"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-slate-700">Doctor Avatar Image URL</label>
                                <input
                                    type="text"
                                    value={data.author_avatar}
                                    onChange={e => setData('author_avatar', e.target.value)}
                                    placeholder="https://... photo url"
                                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-mono text-[11px]"
                                />
                            </div>

                            {/* Quick Doctor Presets */}
                            <div className="pt-1">
                                <span className="text-[10px] text-slate-400 font-bold block mb-1.5 uppercase">Quick Doctor Presets:</span>
                                <div className="flex flex-wrap gap-1">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setData('author_name', 'Dr. Farhana Ahmed, BDS');
                                            setData('author_avatar', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=250&q=80');
                                        }}
                                        className="text-[10px] bg-slate-100 hover:bg-sky-50 hover:text-sky-700 font-bold px-2 py-1 rounded-md text-slate-700 border border-slate-200 transition-colors"
                                    >
                                        Dr. Farhana
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setData('author_name', 'Dr. Tanvir Rahman, BDS');
                                            setData('author_avatar', 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=250&q=80');
                                        }}
                                        className="text-[10px] bg-slate-100 hover:bg-sky-50 hover:text-sky-700 font-bold px-2 py-1 rounded-md text-slate-700 border border-slate-200 transition-colors"
                                    >
                                        Dr. Tanvir
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setData('author_name', 'Dr. Nusrat Jahan, BDS');
                                            setData('author_avatar', 'https://images.unsplash.com/photo-1594824813571-638f0263613a?auto=format&fit=crop&w=250&q=80');
                                        }}
                                        className="text-[10px] bg-slate-100 hover:bg-sky-50 hover:text-sky-700 font-bold px-2 py-1 rounded-md text-slate-700 border border-slate-200 transition-colors"
                                    >
                                        Dr. Nusrat
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* 02. Categories */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xs">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">02. Categories</h3>
                                <button
                                    type="button"
                                    onClick={() => setIsAddCategoryOpen(true)}
                                    className="text-sky-600 hover:text-sky-800 text-xs font-bold cursor-pointer"
                                >
                                    + Add Category
                                </button>
                            </div>

                            {/* Category Checkboxes List */}
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                {categoriesList.map(cat => (
                                    <label key={cat} className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer hover:text-slate-900">
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.includes(cat)}
                                            onChange={() => toggleCategory(cat)}
                                            className="rounded text-sky-600 focus:ring-sky-500"
                                        />
                                        <span>{cat}</span>
                                    </label>
                                ))}
                            </div>

                            <div className="space-y-1 pt-2 border-t border-slate-100">
                                <label className="text-[11px] font-bold text-rose-800">ক্যাটাগরির বাংলা নাম</label>
                                <input
                                    type="text"
                                    value={data.category_bn}
                                    onChange={e => setData('category_bn', e.target.value)}
                                    placeholder="যেমন: ডেন্টাল কেয়ার / দাঁতের যত্ন"
                                    className="w-full border border-rose-200 bg-rose-50/20 rounded-xl px-3 py-2 text-xs focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* 03. Tags */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-2xs">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">03. Tags</h3>
                            <input
                                type="text"
                                value={data.tags}
                                onChange={e => setData('tags', e.target.value)}
                                placeholder="dental, health, smile"
                                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-medium"
                            />
                            <p className="text-[10px] text-slate-400">Separate tags with commas.</p>
                        </div>

                    </div>
                </div>
            </div>

            {/* --- MODALS & POPUPS --- */}

            {/* Full WordPress Attachment Details Modal */}
            {isImgDetailsModalOpen && selectedImgNode && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl border border-slate-200 max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                            <div className="flex items-center gap-2">
                                <Layers className="w-5 h-5 text-rose-800" />
                                <h3 className="text-base font-bold text-slate-900">Attachment Details</h3>
                            </div>
                            <button type="button" onClick={() => setIsImgDetailsModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 overflow-y-auto flex-1">
                            
                            {/* Left Column: Image Preview + Metadata Card */}
                            <div className="md:col-span-6 space-y-4">
                                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 p-2">
                                    <img src={imgFileUrl} alt={imgAltText || 'Preview'} className="w-full h-auto max-h-72 object-contain rounded-xl" />
                                </div>

                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1 text-xs font-medium text-slate-600">
                                    <div><strong className="text-slate-800 font-bold">File name:</strong> {imgFileName}</div>
                                    <div><strong className="text-slate-800 font-bold">File type:</strong> image/jpeg</div>
                                    <div><strong className="text-slate-800 font-bold">File size:</strong> {imgFileSize}</div>
                                    <div><strong className="text-slate-800 font-bold">Dimensions:</strong> {imgDimensions}</div>
                                </div>
                            </div>

                            {/* Right Column: Editable Fields */}
                            <div className="md:col-span-6 space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-800">Alternative Text</label>
                                    <textarea
                                        value={imgAltText}
                                        onChange={e => setImgAltText(e.target.value)}
                                        rows={2}
                                        placeholder="Describe image for SEO..."
                                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-800">Title</label>
                                    <input
                                        type="text"
                                        value={imgTitleText}
                                        onChange={e => setImgTitleText(e.target.value)}
                                        placeholder="Image title..."
                                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-800">Image Caption</label>
                                    <textarea
                                        value={imgCaptionText}
                                        onChange={e => setImgCaptionText(e.target.value)}
                                        rows={2}
                                        placeholder="Caption displayed below the image"
                                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-800">File URL:</label>
                                    <input
                                        type="text"
                                        readOnly
                                        value={imgFileUrl}
                                        className="w-full border border-slate-200 bg-slate-50 rounded-xl px-3 py-2 text-xs font-mono text-slate-600 focus:outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleCopyUrl}
                                        className="mt-2 px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold rounded-xl flex items-center gap-1.5 border border-sky-200 transition-colors cursor-pointer"
                                    >
                                        <Copy size={12} />
                                        <span>{isCopiedUrl ? 'Copied!' : 'Copy URL to clipboard'}</span>
                                    </button>
                                </div>

                                <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold">
                                    <a href={imgFileUrl} target="_blank" rel="noreferrer" className="text-sky-600 hover:underline">View media file</a>
                                    <a href={imgFileUrl} download className="text-sky-600 hover:underline">Download file</a>
                                    <button type="button" onClick={handleDeleteSelectedImage} className="text-rose-600 hover:underline">Delete permanently</button>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3 bg-slate-50">
                            <button
                                type="button"
                                onClick={() => setIsImgDetailsModalOpen(false)}
                                className="px-4 py-2 text-slate-600 hover:text-slate-800 text-xs font-bold cursor-pointer"
                            >
                                Close
                            </button>
                            <button
                                type="button"
                                onClick={handleSaveImageDetails}
                                className="px-5 py-2 bg-[#800038] hover:bg-[#600028] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Media Gallery Modal */}
            {isMediaModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-3xl w-full shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                            <h3 className="text-sm font-bold text-slate-900">
                                {mediaTarget === 'featured' ? 'Select Featured Image' : 'Insert Image from Media Library'}
                            </h3>
                            <button type="button" onClick={() => setIsMediaModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                                <X size={16} />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 overflow-y-auto p-3 flex-1 min-h-[280px] max-h-[60vh] bg-slate-50/60 rounded-xl border border-slate-200">
                            {allMedia.map((m: any, index: number) => {
                                const mediaUrl = m.url || m.thumb_url || '';
                                if (!mediaUrl) return null;
                                const isSelected = selectedMediaUrl === mediaUrl;
                                return (
                                    <div
                                        key={m.id || index}
                                        onClick={() => setSelectedMediaUrl(mediaUrl)}
                                        className={`relative aspect-square rounded-2xl overflow-hidden border-2 cursor-pointer transition-all group bg-slate-900 shadow-2xs flex items-center justify-center ${
                                            isSelected
                                                ? 'border-sky-600 ring-4 ring-sky-500/30 scale-[1.02]'
                                                : 'border-slate-200 hover:border-sky-400 hover:shadow-md'
                                        }`}
                                    >
                                        <img
                                            src={mediaUrl}
                                            alt={m.title || m.alt_text || 'Media'}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 block"
                                            loading="lazy"
                                        />

                                        {/* Title overlay on hover */}
                                        <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                            <p className="text-[10px] font-semibold text-white truncate">
                                                {m.title || m.file_name || 'Media Image'}
                                            </p>
                                        </div>

                                        {/* Selected Checkmark Badge */}
                                        {isSelected && (
                                            <div className="absolute top-2.5 right-2.5 bg-sky-600 text-white rounded-full p-1 shadow-md z-10">
                                                <Check size={14} className="stroke-[3]" />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex justify-end gap-2 border-t border-slate-200 pt-3">
                            <button
                                type="button"
                                onClick={() => setIsMediaModalOpen(false)}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleInsertMedia}
                                disabled={!selectedMediaUrl}
                                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl cursor-pointer"
                            >
                                Insert Selected
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Insert Custom Table Modal */}
            {isTableModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                            <div className="flex items-center gap-2">
                                <Table size={18} className="text-sky-600" />
                                <h3 className="text-sm font-bold text-slate-900">Insert Table</h3>
                            </div>
                            <button type="button" onClick={() => setIsTableModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                                <X size={16} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700">Rows</label>
                                    <input
                                        type="number"
                                        min={1}
                                        max={20}
                                        value={tableRows}
                                        onChange={e => setTableRows(parseInt(e.target.value) || 1)}
                                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700">Columns</label>
                                    <input
                                        type="number"
                                        min={1}
                                        max={10}
                                        value={tableCols}
                                        onChange={e => setTableCols(parseInt(e.target.value) || 1)}
                                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                                    />
                                </div>
                            </div>

                            <label className="flex items-center gap-2.5 text-xs text-slate-700 font-medium cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={tableHasHeader}
                                    onChange={e => setTableHasHeader(e.target.checked)}
                                    className="rounded text-sky-600 focus:ring-sky-500"
                                />
                                <span>Include Table Header Row</span>
                            </label>
                        </div>

                        <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
                            <button
                                type="button"
                                onClick={() => setIsTableModalOpen(false)}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmInsertTable}
                                className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                            >
                                Insert Table
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
