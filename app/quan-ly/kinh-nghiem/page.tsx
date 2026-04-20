"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Edit, Trash2, Search, Loader2, Eye } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

import { experienceApi } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { RichTextEditor } from "@/components/rich-editor"
import { ImageUpload } from "@/components/ui/image-upload"

export default function ExperienceManagerPage() {
    const [articles, setArticles] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<any>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form states
    const [formData, setFormData] = useState({
        title: "",
        image: "",
        date: new Date().toLocaleDateString('vi-VN').replace(/\//g, '-'),
        published: true,
        views: 0,
        excerpt: "",
        content: ""
    })

    const fetchData = async () => {
        setLoading(true)
        try {
            const data = await experienceApi.getAll()
            setArticles(data || [])
        } catch (error) {
            toast.error("Không thể tải danh sách bài viết")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleOpenDialog = (article?: any) => {
        if (article) {
            setEditingItem(article)
            setFormData({
                title: article.title || "",
                image: article.image || "",
                date: article.date || new Date().toLocaleDateString('vi-VN').replace(/\//g, '-'),
                views: article.views || 0,
                published: article.published !== undefined ? article.published : true,
                excerpt: article.excerpt || "",
                content: article.content || ""
            })
        } else {
            setEditingItem(null)
            setFormData({
                title: "",
                image: "",
                date: new Date().toLocaleDateString('vi-VN').replace(/\//g, '-'),
                views: 0,
                published: true,
                excerpt: "",
                content: ""
            })
        }
        setIsDialogOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.title) {
            toast.error("Vui lòng nhập tiêu đề bài viết")
            return
        }

        setIsSubmitting(true)
        try {
            const payload = {
                ...formData,
                id: editingItem ? editingItem.id : `exp-${Date.now()}`,
            }

            if (editingItem) {
                await experienceApi.update(editingItem.id, payload)
                toast.success("Cập nhật bài viết thành công")
            } else {
                await experienceApi.create(payload)
                toast.success("Thêm mới bài viết thành công")
            }
            
            setIsDialogOpen(false)
            fetchData()
        } catch (error) {
            toast.error("Có lỗi xảy ra, vui lòng thử lại")
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa bài viết này?")) return

        try {
            await experienceApi.delete(id)
            toast.success("Đã xóa bài viết")
            fetchData()
        } catch (error) {
            toast.error("Xóa thất bại")
        }
    }

    const filteredArticles = articles.filter(p => 
        p.title.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <main className="min-h-screen bg-[#0a0a0b] text-white p-6 lg:p-10">
            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-black uppercase text-white tracking-tight">Kinh nghiệm & Mẹo</h1>
                        <p className="text-white/40 text-sm">Quản lý các bài viết chia sẻ kinh nghiệm sử dụng xe, máy móc</p>
                    </div>
                    
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                            <Input 
                                placeholder="Tìm kiếm bài viết..." 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-primary/20"
                            />
                        </div>
                        <Button onClick={() => handleOpenDialog()} className="bg-primary hover:bg-primary/90 text-black font-bold whitespace-nowrap">
                            <Plus className="w-4 h-4 mr-2" />
                            Bài viết mới
                        </Button>
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
                    <Table>
                        <TableHeader className="bg-white/5 border-b border-white/10 hover:bg-white/5">
                            <TableRow className="border-white/10 hover:bg-transparent">
                                <TableHead className="text-white/60 font-bold uppercase text-xs w-[80px]">Ảnh</TableHead>
                                <TableHead className="text-white/60 font-bold uppercase text-xs min-w-[200px]">Tiêu đề / Ngày đăng</TableHead>
                                <TableHead className="text-white/60 font-bold uppercase text-xs w-[100px] text-center">Lượt xem</TableHead>
                                <TableHead className="text-white/60 font-bold uppercase text-xs">Trích dẫn</TableHead>
                                <TableHead className="text-white/60 font-bold uppercase text-xs w-[120px] text-center">Trạng thái</TableHead>
                                <TableHead className="text-white/60 font-bold uppercase text-xs text-right w-[100px]">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow className="hover:bg-white/[0.02] border-white/10">
                                    <TableCell colSpan={5} className="h-32 text-center text-white/40">
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
                                        Đang tải dữ liệu...
                                    </TableCell>
                                </TableRow>
                            ) : filteredArticles.length === 0 ? (
                                <TableRow className="hover:bg-white/[0.02] border-white/10">
                                    <TableCell colSpan={5} className="h-32 text-center text-white/40">
                                        Không tìm thấy bài viết nào
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredArticles.map((article) => (
                                    <TableRow key={article.id} className="hover:bg-white/[0.04] border-white/10">
                                        <TableCell>
                                            <div className="w-12 h-10 rounded-lg border border-white/10 overflow-hidden relative bg-white/5">
                                                {article.image ? (
                                                    <Image src={article.image} alt={article.title} fill className="object-cover" />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-white/20 text-xs">Trống</div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <p className="font-bold text-white text-sm line-clamp-1">{article.title}</p>
                                            <p className="text-[10px] text-white/40 mt-1">{article.date}</p>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span className="text-sm text-white/60 font-mono">{article.views?.toLocaleString() || 0}</span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm text-white/60 line-clamp-2 max-w-sm prose-sm prose-invert" dangerouslySetInnerHTML={{ __html: article.excerpt || "—" }} />
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {article.published !== false ? (
                                                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-wider">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                                    Hiển thị
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-wider">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                                    Ẩn
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button size="icon" variant="ghost" onClick={() => handleOpenDialog(article)} className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" onClick={() => handleDelete(article.id)} className="h-8 w-8 text-red-500/70 hover:text-red-500 hover:bg-red-500/10">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-4xl max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black uppercase tracking-tight">
                            {editingItem ? "Sửa bài viết" : "Thêm bài viết mới"}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
                        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 no-scrollbar scroll-smooth">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="title" className="text-white/60 text-xs uppercase font-bold tracking-wider">Tiêu đề bài viết *</Label>
                                <Input 
                                    id="title" 
                                    value={formData.title} 
                                    onChange={e => setFormData({...formData, title: e.target.value})} 
                                    className="bg-white/5 border-white/10 text-white focus:border-primary/50 transition-colors"
                                    required
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="date" className="text-white/60 text-xs uppercase font-bold tracking-wider">Ngày đăng</Label>
                                <Input 
                                    id="date" 
                                    value={formData.date} 
                                    onChange={e => setFormData({...formData, date: e.target.value})} 
                                    className="bg-white/5 border-white/10 text-white focus:border-primary/50 transition-colors"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-white/60 text-xs uppercase font-bold tracking-wider">Lượt xem (Views)</Label>
                                <div className="relative group/input">
                                    <Eye className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within/input:text-primary transition-colors duration-300 pointer-events-none" />
                                    <Input 
                                        type="text" 
                                        value={formData.views === 0 ? "" : formData.views.toLocaleString('vi-VN')} 
                                        onChange={e => {
                                            const val = e.target.value.replace(/\./g, '');
                                            if (/^\d*$/.test(val)) {
                                                setFormData({...formData, views: val === '' ? 0 : parseInt(val)});
                                            }
                                        }} 
                                        className="bg-white/5 border-white/10 text-white focus:border-primary/50 transition-all font-mono pl-10 h-11" 
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 md:col-span-2 bg-white/[0.02] p-4 rounded-xl border border-white/5">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
                                    <div className="flex items-center gap-3">
                                        <Switch id="published" checked={formData.published} onCheckedChange={c => setFormData({...formData, published: c})} />
                                        <Label htmlFor="published" className="text-[10px] uppercase font-bold cursor-pointer text-white/60">Hiển thị bài viết</Label>
                                    </div>
                                    <Label className="text-white/60 text-xs uppercase font-bold tracking-wider">Ảnh đại diện</Label>
                                </div>
                                <ImageUpload
                                    value={formData.image} 
                                    onChange={(url: string) => setFormData({...formData, image: url})} 
                                />
                            </div>
                            
                            <div className="space-y-2 md:col-span-2">
                                <Label className="text-white/60 text-xs uppercase font-bold tracking-wider">Trích dẫn tóm tắt (Excerpt)</Label>
                                <RichTextEditor 
                                    value={formData.excerpt}
                                    onChange={val => setFormData({...formData, excerpt: val})}
                                    placeholder="Đoạn văn ngắn giới thiệu..."
                                    simple={true}
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label className="text-white/60 text-xs uppercase font-bold tracking-wider">Nội dung chi tiết (Content)</Label>
                                <RichTextEditor 
                                    value={formData.content}
                                    onChange={val => setFormData({...formData, content: val})}
                                    placeholder="Viết nội dung bài chia sẻ..."
                                />
                            </div>
                        </div>
                    </div>

                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="text-white/40 hover:text-white">
                                Hủy bỏ
                            </Button>
                            <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-black font-black px-8">
                                {isSubmitting ? (
                                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Đang lưu...</>
                                ) : (
                                    "Lưu bài viết"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </main>
    )
}
