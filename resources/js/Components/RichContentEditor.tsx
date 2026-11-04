import React, { useState, useRef, useEffect } from 'react';
import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    List,
    ListOrdered,
    Quote,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Link as LinkIcon,
    Unlink,
    RotateCcw,
    RotateCw,
    Image as ImageIcon,
    Table as TableIcon,
    Palette,
    ExternalLink,
    CornerDownLeft,
    X,
    Check,
    Trash2,
    Edit3
} from 'lucide-react';
import MediaImagePicker from '@/Components/ImagePicker/MediaImagePicker';

interface RichContentEditorProps {
    label?: string;
    value: string;
    onChange: (content: string) => void;
    placeholder?: string;
    minHeight?: string;
}

export default function RichContentEditor({
    label = 'WRITE CONTENT',
    value = '',
    onChange,
    placeholder = 'Start writing your content here...',
    minHeight = '280px',
}: RichContentEditorProps) {
    const [editorMode, setEditorMode] = useState<'visual' | 'code'>('visual');
    const [selectedHeading, setSelectedHeading] = useState('p');
    const [isBlockquoteActive, setIsBlockquoteActive] = useState(false);
    const [isUlActive, setIsUlActive] = useState(false);
    const [isOlActive, setIsOlActive] = useState(false);

    // Link modal state
    const [isLinkPopupOpen, setIsLinkPopupOpen] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [linkOpenNewTab, setLinkOpenNewTab] = useState(false);

    // Color picker state
    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

    // Media modal state
    const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
    const [mediaUrlInput, setMediaUrlInput] = useState('');

    // Table modal state (Rows & Columns Selection)
    const [isTableModalOpen, setIsTableModalOpen] = useState(false);
    const [tableRows, setTableRows] = useState(3);
    const [tableCols, setTableCols] = useState(3);
    const [tableHasHeader, setTableHasHeader] = useState(true);

    // Image Selection & Resizing State (Matching WordPress-style Floating Toolbar)
    const [selectedImgNode, setSelectedImgNode] = useState<HTMLImageElement | null>(null);
    const [selectedImgRect, setSelectedImgRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
    const [imgWidthPx, setImgWidthPx] = useState<number>(500);

    // Image Details Modal State
    const [isImgDetailsModalOpen, setIsImgDetailsModalOpen] = useState(false);
    const [imgAltText, setImgAltText] = useState('');
    const [imgTitleText, setImgTitleText] = useState('');
    const [imgWidthInput, setImgWidthInput] = useState('');

    const containerRef = useRef<HTMLDivElement>(null);
    const editorRef = useRef<HTMLDivElement>(null);
    const savedSelectionRef = useRef<Range | null>(null);
    const resizeStartPos = useRef<{ x: number; initialWidth: number }>({ x: 0, initialWidth: 0 });

    // Save Selection
    const saveSelection = () => {
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
            savedSelectionRef.current = sel.getRangeAt(0).cloneRange();
        }
    };

    // Restore Selection
    const restoreSelection = () => {
        const sel = window.getSelection();
        if (sel && savedSelectionRef.current) {
            sel.removeAllRanges();
            sel.addRange(savedSelectionRef.current);
        }
    };

    // Synchronize visual editor HTML when value changes externally
    useEffect(() => {
        if (editorRef.current && editorMode === 'visual') {
            if (editorRef.current.innerHTML !== (value || '')) {
                if (document.activeElement !== editorRef.current) {
                    editorRef.current.innerHTML = value || '';
                }
            }
        }
    }, [value, editorMode]);

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
            saveSelection();
        }
    };

    const handleToggleMode = (mode: 'visual' | 'code') => {
        if (mode === editorMode) return;
        if (mode === 'code') {
            if (editorRef.current) {
                onChange(editorRef.current.innerHTML);
            }
            setSelectedImgNode(null);
            setSelectedImgRect(null);
        } else {
            if (editorRef.current) {
                editorRef.current.innerHTML = value || '';
            }
        }
        setEditorMode(mode);
    };

    const execCommand = (cmd: string, val: string | undefined = undefined) => {
        if (editorMode !== 'visual' || !editorRef.current) return;
        editorRef.current.focus();
        restoreSelection();
        document.execCommand(cmd, false, val);
        handleInput();
        saveSelection();
    };

    // Update current heading & formatting active states based on cursor position
    const updateFormattingStateFromSelection = () => {
        saveSelection();
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0 || !editorRef.current) return;

        let node: Node | null = sel.anchorNode;
        if (node && node.nodeType === 3) {
            node = node.parentNode;
        }

        let foundHeading = false;
        let insideBq = false;
        let insideUl = false;
        let insideOl = false;

        while (node && node !== editorRef.current) {
            if (node.nodeType === 1) {
                const tag = (node as HTMLElement).tagName.toLowerCase();
                if (!foundHeading && ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'].includes(tag)) {
                    setSelectedHeading(tag);
                    foundHeading = true;
                }
                if (tag === 'blockquote') insideBq = true;
                if (tag === 'ul') insideUl = true;
                if (tag === 'ol') insideOl = true;
            }
            node = node.parentNode;
        }

        if (!foundHeading) setSelectedHeading('p');
        setIsBlockquoteActive(insideBq);
        setIsUlActive(insideUl);
        setIsOlActive(insideOl);
    };

    // Toggle List (Unordered / Ordered)
    const toggleList = (type: 'insertUnorderedList' | 'insertOrderedList') => {
        if (editorMode !== 'visual' || !editorRef.current) return;
        editorRef.current.focus();
        restoreSelection();

        document.execCommand(type, false, undefined);

        handleInput();
        saveSelection();
        updateFormattingStateFromSelection();
    };

    // Toggle Blockquote
    const toggleBlockquote = () => {
        if (editorMode !== 'visual' || !editorRef.current) return;
        editorRef.current.focus();
        restoreSelection();

        const sel = window.getSelection();
        let isInsideQuote = false;
        let quoteNode: HTMLElement | null = null;

        if (sel && sel.rangeCount > 0) {
            let node: Node | null = sel.getRangeAt(0).commonAncestorContainer;
            if (node.nodeType === 3) node = node.parentNode;
            while (node && node !== editorRef.current) {
                if (node.nodeType === 1 && (node as HTMLElement).tagName.toLowerCase() === 'blockquote') {
                    isInsideQuote = true;
                    quoteNode = node as HTMLElement;
                    break;
                }
                node = node.parentNode;
            }
        }

        if (isInsideQuote && quoteNode) {
            try {
                document.execCommand('formatBlock', false, '<p>');
            } catch {
                const p = document.createElement('p');
                p.innerHTML = quoteNode.innerHTML;
                quoteNode.parentNode?.replaceChild(p, quoteNode);
            }
        } else {
            let success = false;
            try {
                success = document.execCommand('formatBlock', false, '<blockquote>');
            } catch {}
            if (!success) {
                try {
                    success = document.execCommand('formatBlock', false, 'blockquote');
                } catch {}
            }
            if (!success && sel && sel.rangeCount > 0) {
                const range = sel.getRangeAt(0);
                let container: Node | null = range.commonAncestorContainer;
                if (container.nodeType === 3) container = container.parentNode;
                while (container && container !== editorRef.current && !['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes((container as HTMLElement).tagName || '')) {
                    container = container.parentNode;
                }
                if (container && container !== editorRef.current) {
                    const bq = document.createElement('blockquote');
                    bq.innerHTML = (container as HTMLElement).innerHTML;
                    container.parentNode?.replaceChild(bq, container);
                }
            }
        }

        handleInput();
        saveSelection();
        updateFormattingStateFromSelection();
    };

    // Apply Heading (H1 - H6, Paragraph) with precise font-sizes
    const applyHeading = (tag: string) => {
        const targetTag = tag.toLowerCase();
        setSelectedHeading(targetTag);
        if (editorMode !== 'visual' || !editorRef.current) return;
        editorRef.current.focus();
        restoreSelection();

        let executed = false;
        try {
            executed = document.execCommand('formatBlock', false, `<${targetTag}>`);
        } catch {
            executed = false;
        }

        if (!executed) {
            try {
                executed = document.execCommand('formatBlock', false, targetTag);
            } catch {
                executed = false;
            }
        }

        if (!executed) {
            try {
                executed = document.execCommand('formatBlock', false, targetTag.toUpperCase());
            } catch {
                executed = false;
            }
        }

        // Direct DOM fallback if formatBlock did not transform the container block
        if (editorRef.current) {
            const sel = window.getSelection();
            if (sel && sel.rangeCount > 0) {
                const range = sel.getRangeAt(0);
                let container: Node | null = range.commonAncestorContainer;
                if (container.nodeType === 3) {
                    container = container.parentNode;
                }

                while (container && container !== editorRef.current && !['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'DIV', 'LI'].includes((container as HTMLElement).tagName || '')) {
                    container = container.parentNode;
                }

                if (container && container !== editorRef.current && (container as HTMLElement).tagName.toLowerCase() !== targetTag && (container as HTMLElement).tagName !== 'LI') {
                    const blockElem = container as HTMLElement;
                    const newElem = document.createElement(targetTag);
                    newElem.innerHTML = blockElem.innerHTML;
                    blockElem.parentNode?.replaceChild(newElem, blockElem);

                    const newRange = document.createRange();
                    newRange.selectNodeContents(newElem);
                    newRange.collapse(false);
                    sel.removeAllRanges();
                    sel.addRange(newRange);
                }
            }
        }

        handleInput();
        saveSelection();
    };

    const applyColor = (color: string) => {
        execCommand('foreColor', color);
        setIsColorPickerOpen(false);
    };

    const applyLink = () => {
        if (!linkUrl.trim() || !editorRef.current) return;
        editorRef.current.focus();
        restoreSelection();

        const url = linkUrl.trim().startsWith('http') || linkUrl.trim().startsWith('/')
            ? linkUrl.trim()
            : `https://${linkUrl.trim()}`;

        const sel = window.getSelection();
        const selectedText = sel ? sel.toString().trim() : '';
        const targetAttr = linkOpenNewTab ? ' target="_blank" rel="noopener noreferrer"' : '';

        if (selectedText) {
            const aHtml = `<a href="${url}"${targetAttr} class="text-sky-600 hover:underline">${selectedText}</a>`;
            document.execCommand('insertHTML', false, aHtml);
        } else {
            const aHtml = `<a href="${url}"${targetAttr} class="text-sky-600 hover:underline">${url}</a>`;
            document.execCommand('insertHTML', false, aHtml);
        }

        handleInput();
        saveSelection();
        setLinkUrl('');
        setIsLinkPopupOpen(false);
    };

    // Insert Custom Table with Specified Rows & Columns
    const handleInsertCustomTable = () => {
        if (editorMode !== 'visual' || !editorRef.current) return;
        editorRef.current.focus();
        restoreSelection();

        const rows = Math.max(1, Math.min(25, Number(tableRows) || 3));
        const cols = Math.max(1, Math.min(12, Number(tableCols) || 3));

        let headerHtml = '';
        if (tableHasHeader) {
            headerHtml = `
<thead>
  <tr style="background-color: #f8fafc;">
    ${Array.from({ length: cols }).map((_, c) => `<th style="border: 1px solid #cbd5e1; padding: 10px 14px; text-align: left; font-weight: 700; font-size: 14px; color: #0f172a;">Column ${c + 1}</th>`).join('')}
  </tr>
</thead>`;
        }

        const bodyRowsHtml = Array.from({ length: rows }).map((_, r) => `
  <tr>
    ${Array.from({ length: cols }).map((_, c) => `<td style="border: 1px solid #cbd5e1; padding: 10px 14px; font-weight: 400; font-size: 14px; color: #334155;">Cell ${r + 1}-${c + 1}</td>`).join('')}
  </tr>`).join('');

        const tableHtml = `
<div style="max-width: 100%; overflow-x: auto; margin: 16px 0;">
  <table style="width: 100%; border-collapse: collapse; font-size: 14px; border: 1px solid #cbd5e1;">
    ${headerHtml}
    <tbody>
      ${bodyRowsHtml}
    </tbody>
  </table>
</div><p><br></p>`;

        document.execCommand('insertHTML', false, tableHtml);
        handleInput();
        saveSelection();
        setIsTableModalOpen(false);
    };

    // Insert Media Image
    const insertMediaImage = (src: string) => {
        if (!src || !editorRef.current) return;
        editorRef.current.focus();
        restoreSelection();

        const imgId = `img_insert_${Date.now()}`;
        const imgHtml = `<p><img id="${imgId}" src="${src}" alt="Dental Image" style="width: 100%; max-width: 100%; height: auto; border-radius: 12px; margin: 14px 0; display: block;" /></p><p><br/></p>`;
        document.execCommand('insertHTML', false, imgHtml);
        handleInput();
        saveSelection();
        setIsMediaModalOpen(false);
        setMediaUrlInput('');

        // Automatically select the newly inserted image
        setTimeout(() => {
            const newImg = editorRef.current?.querySelector(`#${imgId}`) as HTMLImageElement;
            if (newImg) {
                newImg.removeAttribute('id');
                setSelectedImgNode(newImg);
                setImgWidthPx(Math.round(newImg.getBoundingClientRect().width));
                updateSelectedImgRect(newImg);
            }
        }, 80);
    };

    // Update Floating Rect for Selected Image
    const updateSelectedImgRect = (nodeToUse?: HTMLImageElement) => {
        const img = nodeToUse || selectedImgNode;
        if (img && containerRef.current) {
            const imgRect = img.getBoundingClientRect();
            const containerRect = containerRef.current.getBoundingClientRect();
            setSelectedImgRect({
                top: imgRect.top - containerRect.top + containerRef.current.scrollTop,
                left: imgRect.left - containerRect.left,
                width: imgRect.width,
                height: imgRect.height,
            });
            setImgWidthPx(Math.round(imgRect.width));
        }
    };

    // Click handler inside Editor for Image Selection
    const handleEditorClick = (e: React.MouseEvent<HTMLDivElement>) => {
        saveSelection();
        const target = e.target as HTMLElement;
        if (target.tagName === 'IMG') {
            const img = target as HTMLImageElement;
            setSelectedImgNode(img);
            setImgAltText(img.alt || '');
            setImgTitleText(img.title || '');
            setImgWidthInput(img.style.width || `${Math.round(img.getBoundingClientRect().width)}px`);
            setImgWidthPx(Math.round(img.getBoundingClientRect().width));
            updateSelectedImgRect(img);
        } else {
            if (!target.closest('.image-control-toolbar') && !target.closest('.image-details-modal')) {
                setSelectedImgNode(null);
                setSelectedImgRect(null);
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
            initialWidth: selectedImgNode.getBoundingClientRect().width,
        };

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const deltaX = moveEvent.clientX - resizeStartPos.current.x;
            const newWidth = Math.max(80, Math.round(resizeStartPos.current.initialWidth + deltaX));
            if (selectedImgNode) {
                selectedImgNode.style.width = `${newWidth}px`;
                selectedImgNode.style.maxWidth = '100%';
                selectedImgNode.style.height = 'auto';
                setImgWidthPx(newWidth);
                updateSelectedImgRect();
            }
        };

        const handleMouseUp = () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            handleInput();
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    // Preset Widths (100%, 50%, 25%)
    const handleSetImageWidthPercent = (pct: string) => {
        if (!selectedImgNode) return;
        selectedImgNode.style.width = pct;
        selectedImgNode.style.maxWidth = '100%';
        selectedImgNode.style.height = 'auto';
        handleInput();
        setTimeout(() => updateSelectedImgRect(), 50);
    };

    // Alignment for Selected Image
    const handleSetImageAlignment = (align: 'left' | 'center' | 'right') => {
        if (!selectedImgNode) return;
        selectedImgNode.style.display = 'block';
        if (align === 'center') {
            selectedImgNode.style.marginLeft = 'auto';
            selectedImgNode.style.marginRight = 'auto';
        } else if (align === 'right') {
            selectedImgNode.style.marginLeft = 'auto';
            selectedImgNode.style.marginRight = '0';
        } else {
            selectedImgNode.style.marginLeft = '0';
            selectedImgNode.style.marginRight = 'auto';
        }
        handleInput();
        setTimeout(() => updateSelectedImgRect(), 50);
    };

    // Delete Selected Image
    const handleDeleteSelectedImage = () => {
        if (!selectedImgNode) return;
        selectedImgNode.remove();
        setSelectedImgNode(null);
        setSelectedImgRect(null);
        handleInput();
    };

    // Save changes from Edit Image Details Modal
    const handleSaveImageDetails = () => {
        if (!selectedImgNode) return;
        selectedImgNode.alt = imgAltText;
        selectedImgNode.title = imgTitleText;
        if (imgWidthInput.trim()) {
            const formattedWidth = imgWidthInput.trim().endsWith('%') || imgWidthInput.trim().endsWith('px')
                ? imgWidthInput.trim()
                : `${imgWidthInput.trim()}px`;
            selectedImgNode.style.width = formattedWidth;
            selectedImgNode.style.maxWidth = '100%';
            selectedImgNode.style.height = 'auto';
        }
        handleInput();
        setIsImgDetailsModalOpen(false);
        setTimeout(() => updateSelectedImgRect(), 50);
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden relative font-sans text-slate-800">
            {/* Scoped CSS to guarantee exact visual font sizes for Headings H1 to H6 */}
            <style>{`
                .rich-editor-visual-area h1, .rich-editor-visual-area h1 * { font-size: 32px !important; font-weight: 700 !important; margin: 1.1rem 0 0.6rem !important; color: #0f172a !important; line-height: 1.25 !important; }
                .rich-editor-visual-area h2, .rich-editor-visual-area h2 * { font-size: 24px !important; font-weight: 700 !important; margin: 1rem 0 0.5rem !important; color: #0f172a !important; line-height: 1.3 !important; }
                .rich-editor-visual-area h3, .rich-editor-visual-area h3 * { font-size: 18.72px !important; font-weight: 700 !important; margin: 0.85rem 0 0.45rem !important; color: #0f172a !important; line-height: 1.35 !important; }
                .rich-editor-visual-area h4, .rich-editor-visual-area h4 * { font-size: 16px !important; font-weight: 700 !important; margin: 0.75rem 0 0.4rem !important; color: #0f172a !important; line-height: 1.4 !important; }
                .rich-editor-visual-area h5, .rich-editor-visual-area h5 * { font-size: 13.28px !important; font-weight: 700 !important; margin: 0.6rem 0 0.35rem !important; color: #0f172a !important; line-height: 1.4 !important; }
                .rich-editor-visual-area h6, .rich-editor-visual-area h6 * { font-size: 10.72px !important; font-weight: 700 !important; margin: 0.5rem 0 0.3rem !important; color: #475569 !important; line-height: 1.4 !important; }
                .rich-editor-visual-area p, .rich-editor-visual-area p * { font-size: 16px !important; font-weight: 400 !important; margin: 0.5rem 0 !important; line-height: 1.6 !important; }
                
                /* Lists: Bullet & Numbered */
                .rich-editor-visual-area ul { list-style-type: disc !important; padding-left: 2rem !important; margin: 0.75rem 0 !important; }
                .rich-editor-visual-area ol { list-style-type: decimal !important; padding-left: 2rem !important; margin: 0.75rem 0 !important; }
                .rich-editor-visual-area li { display: list-item !important; margin-bottom: 0.35rem !important; line-height: 1.6 !important; font-size: 16px !important; }
                
                /* Blockquote */
                .rich-editor-visual-area blockquote {
                    border-left: 4px solid #0284c7 !important;
                    background-color: #f8fafc !important;
                    padding: 0.65rem 1.15rem !important;
                    margin: 0.85rem 0 !important;
                    border-radius: 0 8px 8px 0 !important;
                    color: #334155 !important;
                    font-style: italic !important;
                    font-size: 15px !important;
                    line-height: 1.65 !important;
                }
                .rich-editor-visual-area table { width: 100% !important; border-collapse: collapse !important; margin: 1rem 0 !important; }
                .rich-editor-visual-area th { border: 1px solid #cbd5e1 !important; padding: 10px 12px !important; background: #f8fafc !important; font-weight: 700 !important; font-size: 14px !important; }
                .rich-editor-visual-area td { border: 1px solid #cbd5e1 !important; padding: 10px 12px !important; font-size: 14px !important; }
                .rich-editor-visual-area img { cursor: pointer; border-radius: 10px; transition: outline 0.15s ease; }
            `}</style>

            {/* Top Bar: Write Content Label + Visual/Code Toggle */}
            <div className="px-4 py-2.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                    {label}
                </span>

                <div className="flex items-center gap-1 bg-slate-200/80 p-0.5 rounded-lg text-xs">
                    <button
                        type="button"
                        onClick={() => handleToggleMode('visual')}
                        className={`px-3 py-1 font-bold rounded-md transition cursor-pointer ${
                            editorMode === 'visual'
                                ? 'bg-sky-600 text-white shadow-2xs'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        Visual
                    </button>
                    <button
                        type="button"
                        onClick={() => handleToggleMode('code')}
                        className={`px-3 py-1 font-bold rounded-md transition cursor-pointer ${
                            editorMode === 'code'
                                ? 'bg-sky-600 text-white shadow-2xs'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        Code
                    </button>
                </div>
            </div>

            {/* Formatting Toolbar (shown in Visual mode) */}
            {editorMode === 'visual' && (
                <div className="px-3 py-2 bg-white border-b border-slate-100 flex flex-wrap items-center gap-1 text-slate-600 relative select-none">
                    {/* Add Media Button */}
                    <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                            saveSelection();
                            setIsMediaModalOpen(true);
                        }}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1.5 transition cursor-pointer border border-slate-200"
                    >
                        <ImageIcon size={14} className="text-sky-600" />
                        <span>Add Media</span>
                    </button>

                    <div className="h-4 w-px bg-slate-200 mx-1" />

                    {/* Headings Dropdown with Visual Size Previews */}
                    <select
                        value={selectedHeading}
                        onMouseDown={() => saveSelection()}
                        onFocus={() => saveSelection()}
                        onChange={(e) => applyHeading(e.target.value)}
                        className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none bg-white font-bold text-slate-800 cursor-pointer shadow-2xs"
                        title="Headings & Typography"
                    >
                        <option value="p" style={{ fontSize: '14px', fontWeight: 'normal' }}>Paragraph</option>
                        <option value="h1" style={{ fontSize: '18px', fontWeight: 'bold' }}>H1</option>
                        <option value="h2" style={{ fontSize: '16px', fontWeight: 'bold' }}>H2</option>
                        <option value="h3" style={{ fontSize: '15px', fontWeight: 'bold' }}>H3</option>
                        <option value="h4" style={{ fontSize: '14px', fontWeight: 'bold' }}>H4</option>
                        <option value="h5" style={{ fontSize: '13px', fontWeight: 'bold' }}>H5</option>
                        <option value="h6" style={{ fontSize: '12px', fontWeight: 'bold' }}>H6</option>
                    </select>

                    <div className="h-4 w-px bg-slate-200 mx-1" />

                    {/* Basic Formatting */}
                    <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => execCommand('bold')}
                        className="p-1.5 hover:bg-slate-100 rounded text-slate-700 font-bold cursor-pointer transition"
                        title="Bold (Ctrl+B)"
                    >
                        <Bold size={14} />
                    </button>

                    <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => execCommand('italic')}
                        className="p-1.5 hover:bg-slate-100 rounded text-slate-700 italic cursor-pointer transition"
                        title="Italic (Ctrl+I)"
                    >
                        <Italic size={14} />
                    </button>

                    <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => execCommand('underline')}
                        className="p-1.5 hover:bg-slate-100 rounded text-slate-700 underline cursor-pointer transition"
                        title="Underline (Ctrl+U)"
                    >
                        <Underline size={14} />
                    </button>

                    <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => execCommand('strikeThrough')}
                        className="p-1.5 hover:bg-slate-100 rounded text-slate-700 line-through cursor-pointer transition"
                        title="Strikethrough"
                    >
                        <Strikethrough size={14} />
                    </button>

                    {/* Bullet List */}
                    <button
                        type="button"
                        onMouseDown={(e) => {
                            e.preventDefault();
                            saveSelection();
                        }}
                        onClick={() => toggleList('insertUnorderedList')}
                        className={`p-1.5 rounded cursor-pointer transition active:scale-95 ${
                            isUlActive ? 'bg-sky-100 text-sky-700 shadow-2xs font-bold' : 'hover:bg-slate-100 text-slate-700'
                        }`}
                        title="Bullet List"
                    >
                        <List size={14} />
                    </button>

                    {/* Numbered List */}
                    <button
                        type="button"
                        onMouseDown={(e) => {
                            e.preventDefault();
                            saveSelection();
                        }}
                        onClick={() => toggleList('insertOrderedList')}
                        className={`p-1.5 rounded cursor-pointer transition active:scale-95 ${
                            isOlActive ? 'bg-sky-100 text-sky-700 shadow-2xs font-bold' : 'hover:bg-slate-100 text-slate-700'
                        }`}
                        title="Numbered List"
                    >
                        <ListOrdered size={14} />
                    </button>

                    {/* Blockquote */}
                    <button
                        type="button"
                        onMouseDown={(e) => {
                            e.preventDefault();
                            saveSelection();
                        }}
                        onClick={toggleBlockquote}
                        className={`p-1.5 rounded cursor-pointer transition active:scale-95 ${
                            isBlockquoteActive ? 'bg-sky-100 text-sky-700 shadow-2xs font-bold' : 'hover:bg-slate-100 text-slate-700'
                        }`}
                        title="Quote / Blockquote"
                    >
                        <Quote size={14} />
                    </button>

                    {/* Insert Table Button -> Opens Rows & Columns Selection Modal */}
                    <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                            saveSelection();
                            setIsTableModalOpen(true);
                        }}
                        className="p-1.5 hover:bg-sky-50 text-slate-700 hover:text-sky-700 rounded cursor-pointer transition"
                        title="Insert Table (Select Rows & Columns)"
                    >
                        <TableIcon size={14} />
                    </button>

                    <div className="h-4 w-px bg-slate-200 mx-1" />

                    {/* Alignments */}
                    <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => execCommand('justifyLeft')}
                        className="p-1.5 hover:bg-slate-100 rounded text-slate-700 cursor-pointer transition"
                        title="Align Left"
                    >
                        <AlignLeft size={14} />
                    </button>
                    <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => execCommand('justifyCenter')}
                        className="p-1.5 hover:bg-slate-100 rounded text-slate-700 cursor-pointer transition"
                        title="Align Center"
                    >
                        <AlignCenter size={14} />
                    </button>
                    <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => execCommand('justifyRight')}
                        className="p-1.5 hover:bg-slate-100 rounded text-slate-700 cursor-pointer transition"
                        title="Align Right"
                    >
                        <AlignRight size={14} />
                    </button>
                    <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => execCommand('justifyFull')}
                        className="p-1.5 hover:bg-slate-100 rounded text-slate-700 cursor-pointer transition"
                        title="Justify"
                    >
                        <AlignJustify size={14} />
                    </button>

                    <div className="h-4 w-px bg-slate-200 mx-1" />

                    {/* Link */}
                    <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                            saveSelection();
                            setIsLinkPopupOpen(!isLinkPopupOpen);
                        }}
                        className={`p-1.5 rounded cursor-pointer transition ${
                            isLinkPopupOpen ? 'bg-sky-100 text-sky-700' : 'hover:bg-slate-100 text-slate-700'
                        }`}
                        title="Insert Link"
                    >
                        <LinkIcon size={14} />
                    </button>

                    <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => execCommand('unlink')}
                        className="p-1.5 hover:bg-slate-100 rounded text-slate-700 cursor-pointer transition"
                        title="Remove Link"
                    >
                        <Unlink size={14} />
                    </button>

                    {/* Text Color Picker */}
                    <div className="relative">
                        <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                            className="p-1.5 hover:bg-slate-100 rounded text-slate-700 flex items-center gap-0.5 cursor-pointer transition"
                            title="Text Color"
                        >
                            <Palette size={14} className="text-sky-600" />
                            <span className="text-[9px] font-bold text-slate-400">▼</span>
                        </button>

                        {isColorPickerOpen && (
                            <div className="absolute top-full left-0 mt-2 z-40 bg-white border border-slate-200 rounded-xl p-2 shadow-xl grid grid-cols-4 gap-1.5 w-32 animate-in fade-in">
                                {['#0f172a', '#800038', '#dc2626', '#2563eb', '#059669', '#d97706', '#7c3aed', '#475569'].map((c) => (
                                    <button
                                        key={c}
                                        type="button"
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => applyColor(c)}
                                        className="w-6 h-6 rounded-full border border-slate-200 cursor-pointer hover:scale-110 transition"
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="h-4 w-px bg-slate-200 mx-1" />

                    {/* Undo / Redo */}
                    <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => execCommand('undo')}
                        className="p-1.5 hover:bg-slate-100 rounded text-slate-700 cursor-pointer transition"
                        title="Undo"
                    >
                        <RotateCcw size={14} />
                    </button>

                    <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => execCommand('redo')}
                        className="p-1.5 hover:bg-slate-100 rounded text-slate-700 cursor-pointer transition"
                        title="Redo"
                    >
                        <RotateCw size={14} />
                    </button>

                    {/* Floating Link Popup with Internal Linking Tool */}
                    {isLinkPopupOpen && (
                        <div className="absolute top-full left-10 mt-2 z-40 bg-white border border-slate-200 rounded-2xl p-3 shadow-xl w-96 animate-in fade-in space-y-2">
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={linkUrl}
                                    onChange={(e) => setLinkUrl(e.target.value)}
                                    placeholder="Enter URL or pick internal link below..."
                                    className="w-full text-xs px-2.5 py-1.5 border border-sky-300 rounded-lg focus:outline-none bg-white text-slate-800"
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            applyLink();
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={applyLink}
                                    className="p-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg cursor-pointer shrink-0 font-bold text-xs flex items-center gap-1 shadow-2xs"
                                    title="Apply Link"
                                >
                                    <CornerDownLeft size={13} /> Link
                                </button>
                                <label className="flex items-center gap-1 text-[10px] text-slate-500 shrink-0 cursor-pointer" title="Open in new tab">
                                    <input
                                        type="checkbox"
                                        checked={linkOpenNewTab}
                                        onChange={(e) => setLinkOpenNewTab(e.target.checked)}
                                        className="rounded text-sky-600"
                                    />
                                    <ExternalLink size={11} />
                                </label>
                            </div>

                            {/* Internal Linking Quick Tool */}
                            <div className="pt-2 border-t border-slate-100">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                                    <span>🔗 Quick Internal Site Links</span>
                                </div>
                                <div className="flex flex-wrap gap-1 max-h-28 overflow-y-auto pr-1">
                                    {[
                                        { label: 'Services', path: '/services' },
                                        { label: 'Price List', path: '/price-list' },
                                        { label: 'Mirpur Branch', path: '/branch/mirpur' },
                                        { label: 'Uttara Branch', path: '/branch/uttara' },
                                        { label: 'Appointment', path: '/appointment' },
                                        { label: 'Doctors', path: '/doctors' },
                                        { label: 'About Us', path: '/about' },
                                        { label: 'Blog & Guides', path: '/blog' },
                                    ].map((item) => (
                                        <button
                                            key={item.path}
                                            type="button"
                                            onClick={() => setLinkUrl(item.path)}
                                            className={`text-[10px] px-2 py-0.5 rounded-md border transition cursor-pointer ${
                                                linkUrl === item.path
                                                    ? 'bg-sky-600 text-white border-sky-600'
                                                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                                            }`}
                                        >
                                            {item.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Container for Visual Editor & Image Selection Overlay */}
            <div
                ref={containerRef}
                className="relative overflow-y-auto"
                onScroll={() => updateSelectedImgRect()}
            >
                {/* Visual Editor (contentEditable div) */}
                {editorMode === 'visual' ? (
                    <div
                        ref={editorRef}
                        contentEditable
                        onInput={handleInput}
                        onBlur={handleInput}
                        onClick={(e) => {
                            handleEditorClick(e);
                            updateFormattingStateFromSelection();
                        }}
                        onMouseUp={(e) => {
                            handleEditorClick(e);
                            updateFormattingStateFromSelection();
                        }}
                        onKeyUp={() => {
                            saveSelection();
                            updateFormattingStateFromSelection();
                        }}
                        onSelect={() => {
                            saveSelection();
                            updateFormattingStateFromSelection();
                        }}
                        style={{ minHeight }}
                        className="rich-editor-visual-area p-4 sm:p-5 outline-none max-w-none text-slate-800 text-sm leading-relaxed overflow-y-auto focus:bg-white/80 transition"
                        data-placeholder={placeholder}
                    />
                ) : (
                    /* Code Editor (Textarea with raw HTML) */
                    <textarea
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        style={{ minHeight }}
                        placeholder="<p>Write your raw HTML here...</p>"
                        className="w-full p-4 font-mono text-xs text-slate-800 bg-slate-900 text-emerald-400 outline-none resize-y border-none focus:ring-0 leading-relaxed"
                    />
                )}

                {/* Floating Image Resizing & Alignment Toolbar (Exact match with user's uploaded image) */}
                {selectedImgNode && selectedImgRect && editorMode === 'visual' && (
                    <>
                        {/* Floating Dark Pill Toolbar directly above/inside image */}
                        <div
                            className="image-control-toolbar absolute z-30 bg-[#0f172a] text-white px-3 py-1.5 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-in fade-in select-none"
                            style={{
                                top: selectedImgRect.top > 48 ? selectedImgRect.top - 42 : selectedImgRect.top + 8,
                                left: Math.max(8, selectedImgRect.left + 4),
                            }}
                        >
                            {/* Little triangle arrow pointing down */}
                            {selectedImgRect.top > 48 && (
                                <div className="absolute -bottom-1 left-5 w-2.5 h-2.5 bg-[#0f172a] rotate-45" />
                            )}

                            {/* Edit Button */}
                            <button
                                type="button"
                                onClick={() => setIsImgDetailsModalOpen(true)}
                                className="px-2.5 py-1 bg-[#0284c7] hover:bg-[#0369a1] text-white rounded-lg flex items-center gap-1 text-[11px] font-bold cursor-pointer transition shadow-2xs"
                            >
                                <Edit3 size={12} />
                                <span>Edit</span>
                            </button>

                            {/* Dynamic px width */}
                            <span className="text-slate-300 font-mono text-[11px] px-1 border-r border-slate-700">
                                {imgWidthPx}px
                            </span>

                            {/* Alignment Controls (Left, Center, Right) */}
                            <div className="flex items-center gap-0.5 border-r border-slate-700 pr-1.5">
                                <button
                                    type="button"
                                    onClick={() => handleSetImageAlignment('left')}
                                    className="p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white cursor-pointer"
                                    title="Align Left"
                                >
                                    <AlignLeft size={13} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleSetImageAlignment('center')}
                                    className="p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white cursor-pointer"
                                    title="Align Center"
                                >
                                    <AlignCenter size={13} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleSetImageAlignment('right')}
                                    className="p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white cursor-pointer"
                                    title="Align Right"
                                >
                                    <AlignRight size={13} />
                                </button>
                            </div>

                            {/* Width Presets (100%, 50%, 25%) */}
                            <div className="flex items-center gap-1 border-r border-slate-700 pr-2 text-[11px] font-bold">
                                <button
                                    type="button"
                                    onClick={() => handleSetImageWidthPercent('100%')}
                                    className="px-1.5 py-0.5 hover:bg-slate-800 rounded text-slate-300 hover:text-white cursor-pointer transition"
                                >
                                    100%
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleSetImageWidthPercent('50%')}
                                    className="px-1.5 py-0.5 hover:bg-slate-800 rounded text-slate-300 hover:text-white cursor-pointer transition"
                                >
                                    50%
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleSetImageWidthPercent('25%')}
                                    className="px-1.5 py-0.5 hover:bg-slate-800 rounded text-slate-300 hover:text-white cursor-pointer transition"
                                >
                                    25%
                                </button>
                            </div>

                            {/* Delete Image */}
                            <button
                                type="button"
                                onClick={handleDeleteSelectedImage}
                                className="px-1.5 py-1 text-rose-400 hover:text-rose-300 font-bold text-[11px] cursor-pointer transition"
                                title="Delete Image"
                            >
                                Delete
                            </button>
                        </div>

                        {/* Interactive Drag Resizing Border & 4 Corner Handles (Exact match to screenshot) */}
                        <div
                            className="absolute z-20 pointer-events-none border border-rose-600 rounded-lg"
                            style={{
                                top: selectedImgRect.top,
                                left: selectedImgRect.left,
                                width: selectedImgRect.width,
                                height: selectedImgRect.height,
                            }}
                        >
                            {/* 4 Corner maroon dots */}
                            <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-[#800038] border-2 border-white rounded-full" />
                            <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-[#800038] border-2 border-white rounded-full" />
                            <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-[#800038] border-2 border-white rounded-full" />
                            
                            {/* Bottom-Right Handle (Draggable) */}
                            <div
                                onMouseDown={handleResizeMouseDown}
                                className="absolute -bottom-2 -right-2 w-4 h-4 bg-[#800038] border-2 border-white rounded-full cursor-nwse-resize pointer-events-auto shadow-md hover:scale-125 transition-transform"
                                title="Drag to Resize Image"
                            />
                        </div>
                    </>
                )}
            </div>

            {/* Image Details Edit Modal */}
            {isImgDetailsModalOpen && (
                <div className="image-details-modal fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                                <Edit3 size={14} className="text-sky-600" />
                                <span>Image Details &amp; Custom Width</span>
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsImgDetailsModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="p-5 space-y-3.5 text-xs">
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Custom Width (e.g. 500px, 80%, 300px)</label>
                                <input
                                    type="text"
                                    value={imgWidthInput}
                                    onChange={(e) => setImgWidthInput(e.target.value)}
                                    placeholder="500px or 75%"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-xs"
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Alternative Text (SEO Alt)</label>
                                <input
                                    type="text"
                                    value={imgAltText}
                                    onChange={(e) => setImgAltText(e.target.value)}
                                    placeholder="Describe image for search engines..."
                                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Image Title</label>
                                <input
                                    type="text"
                                    value={imgTitleText}
                                    onChange={(e) => setImgTitleText(e.target.value)}
                                    placeholder="Image title on hover..."
                                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                                />
                            </div>

                            <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsImgDetailsModalOpen(false)}
                                    className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-semibold hover:bg-slate-50 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSaveImageDetails}
                                    className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                                >
                                    <Check size={14} /> Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Table Modal (Select Rows & Columns) */}
            {isTableModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                                <TableIcon size={15} className="text-sky-600" />
                                <span>Insert Custom Table</span>
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsTableModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="p-5 space-y-4 text-xs">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Number of Rows</label>
                                    <input
                                        type="number"
                                        min={1}
                                        max={25}
                                        value={tableRows}
                                        onChange={(e) => setTableRows(Math.max(1, parseInt(e.target.value) || 1))}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-slate-800 text-center text-sm"
                                    />
                                    <p className="text-[10px] text-slate-400 mt-0.5">e.g. 3, 5, 10</p>
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Number of Columns</label>
                                    <input
                                        type="number"
                                        min={1}
                                        max={12}
                                        value={tableCols}
                                        onChange={(e) => setTableCols(Math.max(1, parseInt(e.target.value) || 1))}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-slate-800 text-center text-sm"
                                    />
                                    <p className="text-[10px] text-slate-400 mt-0.5">e.g. 2, 3, 4</p>
                                </div>
                            </div>

                            <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={tableHasHeader}
                                    onChange={(e) => setTableHasHeader(e.target.checked)}
                                    className="rounded text-sky-600 focus:ring-sky-500"
                                />
                                <span className="font-semibold text-slate-700 text-xs">Include Header Row (Heading 1, 2...)</span>
                            </label>

                            <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsTableModalOpen(false)}
                                    className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-semibold hover:bg-slate-50 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleInsertCustomTable}
                                    className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                                >
                                    <Check size={14} /> Insert Table
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Media Image Modal */}
            {isMediaModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                                <ImageIcon size={15} className="text-sky-600" />
                                <span>Insert Image into Content</span>
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsMediaModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="p-5 space-y-4 text-xs">
                            <MediaImagePicker
                                label="Choose or Upload Image"
                                value={mediaUrlInput}
                                onChange={(val) => setMediaUrlInput(val)}
                                helperText="Select from Media Library or upload a new photo"
                            />

                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Or Direct Image URL</label>
                                <input
                                    type="text"
                                    value={mediaUrlInput}
                                    onChange={(e) => setMediaUrlInput(e.target.value)}
                                    placeholder="https://images.unsplash.com/... or /uploads/..."
                                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                                />
                            </div>

                            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsMediaModalOpen(false)}
                                    className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-semibold hover:bg-slate-50 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    disabled={!mediaUrlInput.trim()}
                                    onClick={() => insertMediaImage(mediaUrlInput.trim())}
                                    className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer disabled:opacity-40 shadow-xs"
                                >
                                    <Check size={14} /> Insert Image
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
