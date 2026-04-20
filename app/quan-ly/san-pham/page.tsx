"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Edit, Trash2, Search, Loader2 } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

import { productApi } from "@/lib/api"
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
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RichTextEditor } from "@/components/rich-editor"
import { MultiImageUpload } from "@/components/ui/multi-image-upload"

export default function ProductManagerPage() {
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<any>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form states
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        images: [] as string[],
        description: "",
        content: ""
    })

    const fetchData = async () => {
        setLoading(true)
        try {
            const data = await productApi.getAll()
            setProducts(data || [])
        } catch (error) {
            toast.error("Không thể tải danh sách sản phẩm")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleOpenDialog = (product?: any) => {
        if (product) {
            setEditingProduct(product)
            setFormData({
                name: product.name || "",
                code: product.code || "",
                images: product.images || (product.image ? [product.image] : []),
                description: product.description || "",
                content: product.content || ""
            })
        } else {
            setEditingProduct(null)
            setFormData({
                name: "",
                code: "",
                images: [],
                description: "",
                content: ""
            })
        }
        setIsDialogOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.name) {
            toast.error("Vui lòng nhập tên sản phẩm")
            return
        }

        setIsSubmitting(true)
        try {
            const payload = {
                ...formData,
                image: formData.images.length > 0 ? formData.images[0] : "",
                id: editingProduct ? editingProduct.id : `sp-${Date.now()}`,
            }

            if (editingProduct) {
                await productApi.update(editingProduct.id, payload)
                toast.success("Cập nhật sản phẩm thành công")
            } else {
                await productApi.create(payload)
                toast.success("Thêm mới sản phẩm thành công")
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
        if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return

        try {
            await productApi.delete(id)
            toast.success("Đã xóa sản phẩm")
            fetchData()
        } catch (error) {
            toast.error("Xóa thất bại")
        }
    }

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) || 
        (p.code && p.code.toLowerCase().includes(search.toLowerCase()))
    )

    return (
        <main className="min-h-screen bg-[#0a0a0b] text-white p-6 lg:p-10">
            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-black uppercase text-white tracking-tight">Quản lý Sản phẩm</h1>
                        <p className="text-white/40 text-sm">Thêm, sửa, xóa các sản phẩm hiển thị trên website</p>
                    </div>
                    
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                            <Input 
                                placeholder="Tìm kiếm sản phẩm..." 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-primary/20"
                            />
                        </div>
                        <Button onClick={() => handleOpenDialog()} className="bg-primary hover:bg-primary/90 text-black font-bold whitespace-nowrap">
                            <Plus className="w-4 h-4 mr-2" />
                            Thêm mới
                        </Button>
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
                    <Table>
                        <TableHeader className="bg-white/5 border-b border-white/10 hover:bg-white/5">
                            <TableRow className="border-white/10 hover:bg-transparent">
                                <TableHead className="text-white/60 font-bold uppercase text-xs">Ảnh</TableHead>
                                <TableHead className="text-white/60 font-bold uppercase text-xs min-w-[200px]">Tên SP / Mã</TableHead>
                                <TableHead className="text-white/60 font-bold uppercase text-xs">Mô tả ngắn</TableHead>
                                <TableHead className="text-white/60 font-bold uppercase text-xs text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow className="hover:bg-white/[0.02] border-white/10">
                                    <TableCell colSpan={4} className="h-32 text-center text-white/40">
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
                                        Đang tải dữ liệu...
                                    </TableCell>
                                </TableRow>
                            ) : filteredProducts.length === 0 ? (
                                <TableRow className="hover:bg-white/[0.02] border-white/10">
                                    <TableCell colSpan={4} className="h-32 text-center text-white/40">
                                        Không tìm thấy sản phẩm nào
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredProducts.map((product) => (
                                    <TableRow key={product.id} className="hover:bg-white/[0.04] border-white/10">
                                        <TableCell>
                                            <div className="w-12 h-12 rounded-lg border border-white/10 overflow-hidden relative bg-white/5">
                                                {product.image || (product.images && product.images.length > 0) ? (
                                                    <Image src={product.images?.[0] || product.image} alt={product.name} fill className="object-cover" />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-white/20 text-xs">No img</div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <p className="font-bold text-white text-sm">{product.name}</p>
                                            <p className="text-xs text-white/40 font-mono mt-0.5">{product.code || product.id}</p>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm text-white/60 line-clamp-2 max-w-sm prose-sm prose-invert" dangerouslySetInnerHTML={{ __html: product.description || "—" }} />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button size="icon" variant="ghost" onClick={() => handleOpenDialog(product)} className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" onClick={() => handleDelete(product.id)} className="h-8 w-8 text-red-500/70 hover:text-red-500 hover:bg-red-500/10">
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

            {/* Dialog Form */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-4xl max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black uppercase tracking-tight">
                            {editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
                        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 no-scrollbar scroll-smooth">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-white/60 text-xs uppercase font-bold tracking-wider">Tên sản phẩm *</Label>
                                <Input 
                                    id="name" 
                                    value={formData.name} 
                                    onChange={e => setFormData({...formData, name: e.target.value})} 
                                    className="bg-white/5 border-white/10 text-white focus:border-primary/50 transition-colors"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="code" className="text-white/60 text-xs uppercase font-bold tracking-wider">Mã sản phẩm (Code)</Label>
                                <Input 
                                    id="code" 
                                    value={formData.code} 
                                    onChange={e => setFormData({...formData, code: e.target.value})} 
                                    className="bg-white/5 border-white/10 text-white font-mono focus:border-primary/50 transition-colors"
                                />
                            </div>
                            <div className="space-y-3 md:col-span-2 bg-white/[0.02] p-4 rounded-xl border border-white/5">
                                <Label className="text-white/60 text-xs uppercase font-bold tracking-wider">Hình ảnh sản phẩm (Tối đa 5 ảnh)</Label>
                                <MultiImageUpload 
                                    images={formData.images} 
                                    onChange={imgs => setFormData({...formData, images: imgs})} 
                                    maxImages={5} 
                                />
                            </div>
                            
                            <div className="space-y-2 md:col-span-2">
                                <Label className="text-white/60 text-xs uppercase font-bold tracking-wider">Mô tả ngắn (Description)</Label>
                                <RichTextEditor 
                                    value={formData.description}
                                    onChange={val => setFormData({...formData, description: val})}
                                    placeholder="Nhập mô tả ngắn gọn..."
                                    simple={true}
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label className="text-white/60">Nội dung chi tiết (Content)</Label>
                                <RichTextEditor 
                                    value={formData.content}
                                    onChange={val => setFormData({...formData, content: val})}
                                    placeholder="Bài viết chi tiết sản phẩm..."
                                />
                            </div>
                        </div>
                    </div>

                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="text-white/40 hover:text-white">Hủy bỏ</Button>
                            <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-black font-black px-8">
                                {isSubmitting ? (
                                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Đang lưu...</>
                                ) : (
                                    "Lưu sản phẩm"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </main>
    )
}
