"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Edit, Trash2, Search, Loader2, Eye } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

import { newsApi, newsCategoryApi } from "@/lib/api"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { RichTextEditor } from "@/components/rich-editor"
import { ImageUpload } from "@/components/ui/image-upload"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function NewsManagerPage() {
    const [activeTab, setActiveTab] = useState("articles")

    // DATA STATES
    const [articles, setArticles] = useState<any[]>([])
    const [categories, setCategories] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")

    // DIALOG STATES
    const [isArticleDialogOpen, setIsArticleDialogOpen] = useState(false)
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<any>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // FORM STATES
    const [articleForm, setArticleForm] = useState({
        title: "",
        image: "",
        date: new Date().toLocaleDateString('vi-VN').replace(/\//g, '-'),
        category: "",
        featured: false,
        published: true,
        views: 0,
        excerpt: "",
        content: ""
    })

    const [categoryForm, setCategoryForm] = useState({
        name: ""
    })

    const fetchData = async () => {
        setLoading(true)
        try {
            const [newsData, catsData] = await Promise.all([
                newsApi.getAll(),
                newsCategoryApi.getAll()
            ])
            setArticles(newsData || [])
            setCategories(catsData || [])
        } catch (error) {
            toast.error("Không thể tải dữ liệu tin tức")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    // --- CATEGORY HANDLERS ---
    const handleOpenCategoryDialog = (cat?: any) => {
        if (cat) {
            setEditingItem(cat)
            setCategoryForm({ name: cat.name })
        } else {
            setEditingItem(null)
            setCategoryForm({ name: "" })
        }
        setIsCategoryDialogOpen(true)
    }

    const handleCategorySubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!categoryForm.name) return toast.error("Vui lòng nhập tên danh mục")

        setIsSubmitting(true)
        try {
            if (editingItem) {
                await newsCategoryApi.update(editingItem.id, { ...categoryForm, id: editingItem.id })
                toast.success("Cập nhật danh mục thành công")
            } else {
                await newsCategoryApi.create({ ...categoryForm, id: `cat-${Date.now()}` })
                toast.success("Thêm danh mục thành công")
            }
            setIsCategoryDialogOpen(false)
            fetchData()
        } catch (error) {
            toast.error("Lỗi khi lưu danh mục")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteCategory = async (id: string) => {
        if (!confirm("Xóa danh mục này? Các bài viết thuộc danh mục có thể bị ảnh hưởng.")) return
        try {
            await newsCategoryApi.delete(id)
            toast.success("Đã xóa danh mục")
            fetchData()
        } catch (error) {
            toast.error("Xóa thất bại")
        }
    }

    // --- ARTICLE HANDLERS ---
    const handleOpenArticleDialog = (article?: any) => {
        if (article) {
            setEditingItem(article)
            setArticleForm({
                title: article.title || "",
                image: article.image || "",
                date: article.date || new Date().toLocaleDateString('vi-VN').replace(/\//g, '-'),
                category: article.category || "",
                featured: article.featured || false,
                published: article.published !== undefined ? article.published : true,
                views: article.views || 0,
                excerpt: article.excerpt || "",
                content: article.content || ""
            })
        } else {
            setEditingItem(null)
            setArticleForm({
                title: "",
                image: "",
                date: new Date().toLocaleDateString('vi-VN').replace(/\//g, '-'),
                category: categories.length > 0 ? categories[0].name : "",
                featured: false,
                published: true,
                views: 0,
                excerpt: "",
                content: ""
            })
        }
        setIsArticleDialogOpen(true)
    }

    const handleArticleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!articleForm.title || !articleForm.category) {
            return toast.error("Vui lòng nhập tiêu đề và chọn danh mục")
        }

        setIsSubmitting(true)
        try {
            const payload = {
                ...articleForm,
                id: editingItem ? editingItem.id : `news-${Date.now()}`
            }

            if (editingItem) {
                await newsApi.update(editingItem.id, payload)
                toast.success("Cập nhật bài viết thành công")
            } else {
                await newsApi.create(payload)
                toast.success("Thêm mới bài viết thành công")
            }
            
            setIsArticleDialogOpen(false)
            fetchData()
        } catch (error) {
            toast.error("Có lỗi xảy ra, vui lòng thử lại")
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteArticle = async (id: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa bài viết này?")) return
        try {
            await newsApi.delete(id)
            toast.success("Đã xóa bài viết")
            fetchData()
        } catch (error) {
            toast.error("Xóa thất bại")
        }
    }

    const filteredArticles = articles.filter(a => a.title.toLowerCase().includes(search.toLowerCase()))

    return (
        <main className="min-h-screen bg-[#0a0a0b] text-white p-6 lg:p-10">
            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-black uppercase text-white tracking-tight">Quản lý Tin Tức</h1>
                        <p className="text-white/40 text-sm">Quản lý bài viết blog, tin tức và danh mục</p>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="bg-white/5 border border-white/10 text-white/60 p-1 mb-6">
                        <TabsTrigger value="articles" className="data-[state=active]:bg-primary data-[state=active]:text-black font-bold">Bài Viết</TabsTrigger>
                        <TabsTrigger value="categories" className="data-[state=active]:bg-primary data-[state=active]:text-black font-bold">Danh Mục</TabsTrigger>
                    </TabsList>

                    {/* --- TAB: ARTICLES --- */}
                    <TabsContent value="articles" className="space-y-4 m-0">
                        <div className="flex items-center gap-4 w-full justify-between">
                            <div className="relative flex-1 sm:max-w-xs">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                <Input 
                                    placeholder="Tìm kiếm bài viết..." 
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-primary/20"
                                />
                            </div>
                            <Button onClick={() => handleOpenArticleDialog()} className="bg-primary hover:bg-primary/90 text-black font-bold whitespace-nowrap">
                                <Plus className="w-4 h-4 mr-2" />
                                Viết bài mới
                            </Button>
                        </div>

                        <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
                            <Table>
                                <TableHeader className="bg-white/5 border-b border-white/10 hover:bg-white/5">
                                    <TableRow className="border-white/10 hover:bg-transparent">
                                        <TableHead className="text-white/60 font-bold uppercase text-xs w-[80px]">Ảnh</TableHead>
                                        <TableHead className="text-white/60 font-bold uppercase text-xs min-w-[200px]">Tiêu đề</TableHead>
                                        <TableHead className="text-white/60 font-bold uppercase text-xs w-[120px]">Danh mục</TableHead>
                                        <TableHead className="text-white/60 font-bold uppercase text-xs w-[100px] text-center">Lượt xem</TableHead>
                                        <TableHead className="text-white/60 font-bold uppercase text-xs w-[80px] text-center">Nổi bật</TableHead>
                                        <TableHead className="text-white/60 font-bold uppercase text-xs w-[100px] text-center">Trạng thái</TableHead>
                                        <TableHead className="text-white/60 font-bold uppercase text-xs text-right w-[100px]">Thao tác</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow className="hover:bg-transparent border-white/10">
                                            <TableCell colSpan={6} className="h-32 text-center text-white/40">
                                                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
                                            </TableCell>
                                        </TableRow>
                                    ) : filteredArticles.length === 0 ? (
                                        <TableRow className="hover:bg-transparent border-white/10">
                                            <TableCell colSpan={6} className="h-32 text-center text-white/40">Không tìm thấy bài viết nào</TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredArticles.map((article) => (
                                            <TableRow key={article.id} className="hover:bg-white/[0.04] border-white/10">
                                                <TableCell>
                                                    <div className="w-12 h-10 rounded overflow-hidden relative bg-white/5">
                                                        {article.image && <Image src={article.image} alt={article.title} fill className="object-cover" />}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <p className="font-bold text-white text-sm line-clamp-1">{article.title}</p>
                                                    <p className="text-[10px] text-white/40 mt-1">{article.date}</p>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="px-2 py-0.5 bg-white/5 rounded text-xs text-white/60 break-all line-clamp-1">{article.category}</span>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <span className="text-sm text-white/60 font-mono">{article.views?.toLocaleString() || 0}</span>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {article.featured ? <span className="text-primary text-xs font-bold">★ CÓ</span> : <span className="text-white/20">—</span>}
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
                                                        <Button size="icon" variant="ghost" onClick={() => handleOpenArticleDialog(article)} className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10">
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <Button size="icon" variant="ghost" onClick={() => handleDeleteArticle(article.id)} className="h-8 w-8 text-red-500/70 hover:text-red-500 hover:bg-red-500/10">
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
                    </TabsContent>

                    {/* --- TAB: CATEGORIES --- */}
                    <TabsContent value="categories" className="space-y-4 m-0">
                        <div className="flex items-center justify-end w-full">
                            <Button onClick={() => handleOpenCategoryDialog()} className="bg-primary hover:bg-primary/90 text-black font-bold whitespace-nowrap">
                                <Plus className="w-4 h-4 mr-2" />
                                Thêm danh mục
                            </Button>
                        </div>

                        <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden max-w-2xl">
                            <Table>
                                <TableHeader className="bg-white/5 border-b border-white/10 hover:bg-white/5">
                                    <TableRow className="border-white/10 hover:bg-transparent">
                                        <TableHead className="text-white/60 font-bold uppercase text-xs w-[100px]">ID</TableHead>
                                        <TableHead className="text-white/60 font-bold uppercase text-xs">Tên danh mục</TableHead>
                                        <TableHead className="text-white/60 font-bold uppercase text-xs text-right w-[100px]">Thao tác</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow className="hover:bg-transparent border-white/10">
                                            <TableCell colSpan={3} className="h-20 text-center"><Loader2 className="w-5 h-5 animate-spin text-primary mx-auto" /></TableCell>
                                        </TableRow>
                                    ) : categories.map((cat) => (
                                        <TableRow key={cat.id} className="hover:bg-white/[0.04] border-white/10">
                                            <TableCell className="text-white/40 font-mono text-xs">{cat.id.split('-')[1]?.substring(0,8) || cat.id}</TableCell>
                                            <TableCell className="font-bold">{cat.name}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button size="icon" variant="ghost" onClick={() => handleOpenCategoryDialog(cat)} className="h-8 w-8 text-white/60 mt-[2px] hover:text-white hover:bg-white/10">
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button size="icon" variant="ghost" onClick={() => handleDeleteCategory(cat.id)} className="h-8 w-8 text-red-500/70 hover:text-red-500 hover:bg-red-500/10">
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* --- DIALOG: ARTICLE --- */}
            <Dialog open={isArticleDialogOpen} onOpenChange={setIsArticleDialogOpen}>
                <DialogContent className="sm:max-w-4xl max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black uppercase tracking-tight">
                            {editingItem ? "Sửa bài viết" : "Thêm bài viết mới"}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleArticleSubmit} className="flex flex-col h-full overflow-hidden">
                        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 no-scrollbar scroll-smooth">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="space-y-2 md:col-span-2">
                                <Label className="text-white/60 text-xs uppercase font-bold tracking-wider">Tiêu đề *</Label>
                                <Input value={articleForm.title} onChange={e => setArticleForm({...articleForm, title: e.target.value})} className="bg-white/5 border-white/10 text-white focus:border-primary/50 transition-colors" required />
                            </div>
                            
                            <div className="space-y-2">
                                <Label className="text-white/60 text-xs uppercase font-bold tracking-wider">Danh mục *</Label>
                                <Select value={articleForm.category} onValueChange={v => setArticleForm({...articleForm, category: v})} required>
                                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                        <SelectValue placeholder="Chọn danh mục" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#1a1a1c] border-white/10 text-white">
                                        {categories.map(c => (
                                            <SelectItem key={c.id} value={c.name} className="focus:bg-white/10 focus:text-white">{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div className="space-y-2">
                                <Label className="text-white/60 text-xs uppercase font-bold tracking-wider">Ngày đăng</Label>
                                <Input value={articleForm.date} onChange={e => setArticleForm({...articleForm, date: e.target.value})} className="bg-white/5 border-white/10 text-white focus:border-primary/50 transition-colors" placeholder="DD-MM-YYYY" />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-white/60 text-xs uppercase font-bold tracking-wider">Lượt xem (Views)</Label>
                                <div className="relative group/input">
                                    <Eye className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within/input:text-primary transition-colors duration-300 pointer-events-none" />
                                    <Input 
                                        type="text" 
                                        value={articleForm.views === 0 ? "" : articleForm.views.toLocaleString('vi-VN')} 
                                        onChange={e => {
                                            const val = e.target.value.replace(/\./g, '');
                                            if (/^\d*$/.test(val)) {
                                                setArticleForm({...articleForm, views: val === '' ? 0 : parseInt(val)});
                                            }
                                        }} 
                                        className="bg-white/5 border-white/10 text-white focus:border-primary/50 transition-all font-mono pl-10 h-11" 
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 md:col-span-2 bg-white/[0.02] p-4 rounded-xl border border-white/5">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-3">
                                            <Switch id="published" checked={articleForm.published} onCheckedChange={c => setArticleForm({...articleForm, published: c})} />
                                            <Label htmlFor="published" className="text-[10px] uppercase font-bold cursor-pointer text-white/60">Hiển thị bài viết</Label>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Switch id="featured" checked={articleForm.featured} onCheckedChange={c => setArticleForm({...articleForm, featured: c})} />
                                            <Label htmlFor="featured" className="text-[10px] uppercase font-bold cursor-pointer text-primary">Bài viết nổi bật</Label>
                                        </div>
                                    </div>
                                    <Label className="text-white/60 text-xs uppercase font-bold tracking-wider">Ảnh bài viết</Label>
                                </div>
                                <ImageUpload
                                    value={articleForm.image} 
                                    onChange={(url: string) => setArticleForm({...articleForm, image: url})} 
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label className="text-white/60 text-xs uppercase font-bold tracking-wider">Trích dẫn (Excerpt)</Label>
                                <RichTextEditor value={articleForm.excerpt} onChange={v => setArticleForm({...articleForm, excerpt: v})} placeholder="Mô tả ngắn..." simple={true} />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label className="text-white/60 text-xs uppercase font-bold tracking-wider">Nội dung (Content)</Label>
                                <RichTextEditor value={articleForm.content} onChange={v => setArticleForm({...articleForm, content: v})} placeholder="Nội dung bài viết..." />
                            </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setIsArticleDialogOpen(false)} className="text-white/40 hover:text-white">Hủy</Button>
                            <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-black font-black px-8">Lưu bài viết</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* --- DIALOG: CATEGORY --- */}
            <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black uppercase tracking-tight">{editingItem ? "Sửa danh mục" : "Thêm danh mục"}</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleCategorySubmit} className="flex flex-col">
                        <div className="px-6 py-8 space-y-6">
                            <div className="space-y-2">
                                <Label className="text-white/60 text-xs uppercase font-bold tracking-wider">Tên danh mục *</Label>
                                <Input value={categoryForm.name} onChange={e => setCategoryForm({name: e.target.value})} className="bg-white/5 border-white/10 text-white focus:border-primary/50 transition-colors" required />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setIsCategoryDialogOpen(false)} className="text-white/40 hover:text-white">Hủy</Button>
                            <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-black font-black px-8">Lưu danh mục</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

        </main>
    )
}
