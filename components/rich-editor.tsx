"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import TiptapLink from "@tiptap/extension-link"
import TextAlign from "@tiptap/extension-text-align"
import Placeholder from "@tiptap/extension-placeholder"
import TiptapImage from "@tiptap/extension-image"
import { Table } from "@tiptap/extension-table"
import { TableRow } from "@tiptap/extension-table-row"
import { TableCell } from "@tiptap/extension-table-cell"
import { TableHeader } from "@tiptap/extension-table-header"
import {
    Bold, Italic, Underline as UnderlineIcon, Strikethrough,
    List, ListOrdered, Quote, Heading1, Heading2, Heading3,
    AlignLeft, AlignCenter, AlignRight, Link2, Image as ImageIcon,
    Code, Undo, Redo, Copy, FileCode,
    Table as TableIcon, Minus, Rows3, Columns3
} from "lucide-react"
import { useState, useEffect, useCallback, useRef } from "react"
import { uploadToCloudinary } from "@/lib/cloudinary"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

interface RichEditorProps {
    value: string
    onChange: (html: string) => void
    placeholder?: string
    simple?: boolean
    minimal?: boolean
}

export function RichTextEditor({ value, onChange, placeholder, simple, minimal }: RichEditorProps) {
    const [showSource, setShowSource] = useState(false)
    const [sourceCode, setSourceCode] = useState(value)
    const [uploading, setUploading] = useState(false)
    const [imageDialogOpen, setImageDialogOpen] = useState(false)
    const [imageUrl, setImageUrl] = useState("")
    const [imageWidth, setImageWidth] = useState("")
    const [imageHeight, setImageHeight] = useState("")
    const [imageAlign, setImageAlign] = useState("left")
    const [imageAlt, setImageAlt] = useState("")
    const fileInputRef = useRef<HTMLInputElement>(null)

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
            }),
            Underline,
            TiptapLink.configure({
                openOnClick: false,
                HTMLAttributes: { class: "text-primary underline" },
            }),
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            Placeholder.configure({ placeholder: placeholder || "Bắt đầu viết nội dung..." }),
            TiptapImage.configure({
                inline: true,
                HTMLAttributes: {
                    class: "rounded-lg max-w-full",
                },
                allowBase64: true,
            }).extend({
                addAttributes() {
                    return {
                        ...this.parent?.(),
                        dataAlign: {
                            default: 'left',
                            parseHTML: element => element.getAttribute('data-align') || 'left',
                            renderHTML: attributes => ({
                                'data-align': attributes.dataAlign,
                            }),
                        },
                    }
                },
            }),
            Table.configure({ resizable: true, HTMLAttributes: { class: "tiptap-table" } }),
            TableRow,
            TableCell,
            TableHeader,
        ],
        content: value,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML()
            onChange(html)
            setSourceCode(html)
        },
        editorProps: {
            attributes: {
                class: "prose prose-invert prose-sm max-w-none min-h-[200px] focus:outline-none px-4 py-3 prose-strong:text-primary prose-headings:text-white prose-p:text-white/60 prose-li:text-white/60 prose-blockquote:border-primary/30 prose-blockquote:text-white/50 prose-a:text-primary",
            },
        },
    })

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value)
            setSourceCode(value)
        }
    }, [value, editor])

    const addLink = useCallback(() => {
        const url = prompt("Nhập URL:")
        if (url && editor) {
            editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
        }
    }, [editor])

    const addImage = useCallback(() => {
        if (!editor) return
        fileInputRef.current?.click()
    }, [editor])

    const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !editor) return
        setUploading(true)
        try {
            const result = await uploadToCloudinary(file)
            setImageUrl(result.secure_url)
            setImageDialogOpen(true)
        } catch {
            const url = prompt("Upload thất bại. Nhập URL hình ảnh:")
            if (url) {
                setImageUrl(url)
                setImageDialogOpen(true)
            }
        }
        setUploading(false)
        if (fileInputRef.current) fileInputRef.current.value = ""
    }, [editor])

    const handleSourceChange = (newSource: string) => {
        setSourceCode(newSource)
        onChange(newSource)
        if (editor) {
            editor.commands.setContent(newSource)
        }
    }

    const copyHTML = () => {
        const html = editor?.getHTML() || sourceCode
        navigator.clipboard.writeText(html)
    }

    if (!editor) return null

    return (
        <>
            <div className="rounded-xl border border-white/10 overflow-hidden bg-white/[0.02] flex flex-col max-h-screen">
                {/* ── Toolbar (Sticky) ── */}
                <div className="sticky top-0 z-10 flex items-center flex-wrap gap-0.5 px-2 py-1.5 border-b border-white/10 bg-white/[0.03] flex-shrink-0">
                    {/* Minimal mode: Only Bold & Italic */}
                    {minimal ? (
                        <>
                            <ToolBtn active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} icon={Bold} tip="Đậm" />
                            <ToolBtn active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} icon={Italic} tip="Nghiêng" />
                        </>
                    ) : (
                        <>
                            {/* Text format */}
                            <ToolBtn active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} icon={Bold} tip="Đậm" />
                            <ToolBtn active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} icon={Italic} tip="Nghiêng" />
                            {!simple && <ToolBtn active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} icon={UnderlineIcon} tip="Gạch dưới" />}
                            {!simple && <ToolBtn active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()} icon={Strikethrough} tip="Gạch ngang" />}

                            {!simple && <>
                                <div className="w-px h-5 bg-white/10 mx-1" />
                                {/* Headings */}
                                <ToolBtn active={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} icon={Heading1} tip="H1" />
                                <ToolBtn active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} icon={Heading2} tip="H2" />
                                <ToolBtn active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} icon={Heading3} tip="H3" />
                                <div className="w-px h-5 bg-white/10 mx-1" />
                                {/* Lists */}
                                <ToolBtn active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} icon={List} tip="Danh sách" />
                                <ToolBtn active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} icon={ListOrdered} tip="Có thứ tự" />
                                <ToolBtn active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()} icon={Quote} tip="Trích dẫn" />
                                <ToolBtn active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()} icon={Code} tip="Code" />
                                <div className="w-px h-5 bg-white/10 mx-1" />
                                {/* Align */}
                                <ToolBtn active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()} icon={AlignLeft} tip="Trái" />
                                <ToolBtn active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()} icon={AlignCenter} tip="Giữa" />
                                <ToolBtn active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()} icon={AlignRight} tip="Phải" />
                                <div className="w-px h-5 bg-white/10 mx-1" />
                                {/* Insert */}
                                <ToolBtn active={editor.isActive("link")} onClick={addLink} icon={Link2} tip="Link" />
                                <ToolBtn active={false} onClick={addImage} icon={ImageIcon} tip="Hình ảnh" />
                                {uploading && <span className="text-[10px] text-primary animate-pulse font-bold ml-1">Đang tải ảnh...</span>}
                                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                <div className="w-px h-5 bg-white/10 mx-1" />
                                {/* Table */}
                                <TableDialogButton editor={editor} />
                                {editor.isActive("table") && <>
                                    <ToolBtn active={false} onClick={() => editor.chain().focus().addColumnAfter().run()} icon={Columns3} tip="Thêm cột" />
                                    <ToolBtn active={false} onClick={() => editor.chain().focus().addRowAfter().run()} icon={Rows3} tip="Thêm hàng" />
                                    <ToolBtn active={false} onClick={() => editor.chain().focus().deleteColumn().run()} icon={Minus} tip="Xóa cột" />
                                    <ToolBtn active={false} onClick={() => editor.chain().focus().deleteRow().run()} icon={Minus} tip="Xóa hàng" />
                                </>}
                                <div className="w-px h-5 bg-white/10 mx-1" />
                                {/* Undo/Redo */}
                                <ToolBtn active={false} onClick={() => editor.chain().focus().undo().run()} icon={Undo} tip="Hoàn tác" />
                                <ToolBtn active={false} onClick={() => editor.chain().focus().redo().run()} icon={Redo} tip="Làm lại" />
                            </>}
                        </>
                    )}

                    {/* Right side */}
                    <div className="ml-auto flex items-center gap-1">
                        <button
                            type="button"
                            onClick={() => setShowSource(!showSource)}
                            className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold uppercase transition-all ${showSource ? "bg-primary/20 text-primary" : "text-white/30 hover:text-white/60"}`}
                            title="Xem HTML"
                        >
                            <FileCode className="w-3 h-3" />
                            HTML
                        </button>
                        <button
                            type="button"
                            onClick={copyHTML}
                            className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold uppercase text-white/30 hover:text-primary transition-all"
                            title="Copy HTML"
                        >
                            <Copy className="w-3 h-3" />
                            Copy
                        </button>
                    </div>
                </div>

                {/* ── Editor / Source ── */}
                <div className="overflow-y-auto flex-1">
                {showSource ? (
                    <textarea
                        value={sourceCode}
                        onChange={e => handleSourceChange(e.target.value)}
                        className="w-full bg-transparent px-4 py-3 text-xs font-mono text-green-400/80 focus:outline-none resize-none min-h-full"
                        spellCheck={false}
                    />
                ) : (
                    <EditorContent editor={editor} />
                )}
                </div>
            </div>

            {/* Image Dialog */}
            <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
                <DialogContent className="sm:max-w-md bg-slate-950 border border-white/20 shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-white">Định dạng Hình ảnh</DialogTitle>
                        <DialogDescription className="text-white/60">
                            Chọn kích thước và canh lề cho hình ảnh
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        {imageUrl && (
                            <div className="p-3 bg-black/50 rounded border border-white/20 flex justify-center max-h-40 overflow-hidden">
                                <img src={imageUrl} alt="preview" className="max-w-full max-h-36 object-contain rounded" />
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="img-width" className="text-white">Chiều rộng (px hoặc %)</Label>
                            <Input
                                id="img-width"
                                placeholder="vd: 300 hoặc 100%"
                                value={imageWidth}
                                onChange={(e) => setImageWidth(e.target.value)}
                                className="bg-slate-900 border-white/30 text-white placeholder:text-white/40"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="img-height" className="text-white">Chiều cao (px hoặc %)</Label>
                            <Input
                                id="img-height"
                                placeholder="vd: 300 hoặc auto"
                                value={imageHeight}
                                onChange={(e) => setImageHeight(e.target.value)}
                                className="bg-slate-900 border-white/30 text-white placeholder:text-white/40"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="img-align" className="text-white">Canh lề</Label>
                            <select
                                id="img-align"
                                value={imageAlign}
                                onChange={(e) => setImageAlign(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-900 border border-white/30 text-white rounded placeholder:text-white/40"
                            >
                                <option value="left" className="bg-black">Trái</option>
                                <option value="center" className="bg-black">Giữa</option>
                                <option value="right" className="bg-black">Phải</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="img-alt" className="text-white">Alt Text (Mô tả)</Label>
                            <Input
                                id="img-alt"
                                placeholder="Mô tả hình ảnh cho trình duyệt"
                                value={imageAlt}
                                onChange={(e) => setImageAlt(e.target.value)}
                                className="bg-slate-900 border-white/30 text-white placeholder:text-white/40"
                            />
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            onClick={() => {
                                setImageDialogOpen(false)
                                setImageUrl("")
                                setImageWidth("")
                                setImageHeight("")
                                setImageAlign("left")
                                setImageAlt("")
                            }}
                            variant="outline"
                            className="border-white/40 text-white/80 hover:text-white hover:bg-white/10"
                        >
                            Hủy
                        </Button>
                        <Button
                            type="button"
                            onClick={() => {
                                if (imageUrl && editor) {
                                    const attrs: any = {
                                        src: imageUrl,
                                        alt: imageAlt,
                                        dataAlign: imageAlign
                                    }
                                    if (imageWidth) attrs.width = imageWidth
                                    if (imageHeight) attrs.height = imageHeight
                                    editor.chain().focus().setImage(attrs).run()
                                    setImageDialogOpen(false)
                                    setImageUrl("")
                                    setImageWidth("")
                                    setImageHeight("")
                                    setImageAlign("left")
                                    setImageAlt("")
                                }
                            }}
                            className="bg-primary text-black hover:bg-primary/90"
                        >
                            Chèn
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

/* ── Table Dialog Button ── */
function TableDialogButton({ editor }: { editor: any }) {
    const [open, setOpen] = useState(false)
    const [rows, setRows] = useState(2)
    const [cols, setCols] = useState(3)
    const [withHeader, setWithHeader] = useState(true)

    const handleInsert = () => {
        if (rows > 0 && cols > 0) {
            editor.chain().focus().insertTable({ rows, cols, withHeaderRow: withHeader }).run()
            setOpen(false)
        }
    }

    return (
        <>
            <ToolBtn
                active={false}
                onClick={() => setOpen(true)}
                icon={TableIcon}
                tip="Chèn bảng"
            />
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md bg-slate-950 border border-white/20 shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-white">Chèn Bảng</DialogTitle>
                        <DialogDescription className="text-white/60">
                            Chọn số hàng và cột cho bảng của bạn
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="rows" className="text-white">Số Hàng</Label>
                            <Input
                                id="rows"
                                type="number"
                                min="1"
                                max="20"
                                value={rows}
                                onChange={(e) => setRows(Math.min(20, Math.max(1, parseInt(e.target.value) || 1)))}
                                className="bg-slate-900 border-white/30 text-white placeholder:text-white/40"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cols" className="text-white">Số Cột</Label>
                            <Input
                                id="cols"
                                type="number"
                                min="1"
                                max="10"
                                value={cols}
                                onChange={(e) => setCols(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
                                className="bg-slate-900 border-white/30 text-white placeholder:text-white/40"
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="header"
                                checked={withHeader}
                                onCheckedChange={(checked) => setWithHeader(checked as boolean)}
                                className="border-white/30"
                            />
                            <Label htmlFor="header" className="text-white cursor-pointer">
                                Bao gồm hàng đầu
                            </Label>
                        </div>
                        <div className="p-3 bg-black/50 rounded border border-white/20">
                            <p className="text-xs text-white/60 mb-2">Xem trước:</p>
                            <div className="inline-block">
                                {Array.from({ length: rows }).map((_, r) => (
                                    <div key={r} className="flex">
                                        {Array.from({ length: cols }).map((_, c) => (
                                            <div
                                                key={c}
                                                className="w-8 h-8 border border-primary/50 flex items-center justify-center text-[8px] text-primary/60"
                                            >
                                                •
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            onClick={() => setOpen(false)}
                            variant="outline"
                            className="border-white/40 text-white/80 hover:text-white hover:bg-white/10"
                        >
                            Hủy
                        </Button>
                        <Button
                            type="button"
                            onClick={handleInsert}
                            className="bg-primary text-black hover:bg-primary/90"
                        >
                            Chèn
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

/* ── Toolbar Button ── */
function ToolBtn({ active, onClick, icon: Icon, tip }: { active: boolean; onClick: () => void; icon: any; tip: string }) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={tip}
            className={`p-1.5 rounded transition-all ${active ? "bg-primary/20 text-primary" : "text-white/30 hover:text-white/70 hover:bg-white/5"}`}
        >
            <Icon className="w-3.5 h-3.5" />
        </button>
    )
}
