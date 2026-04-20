"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Search, Loader2 } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

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
import { RichTextEditor } from "@/components/rich-editor"
import { MultiImageUpload } from "@/components/ui/multi-image-upload"

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002"

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  })
  if (!res.ok) throw new Error(`API Error: ${res.status}`)
  return res.json()
}

const dauMayApi = {
  getAll: () => request<any[]>(`${API}/dauMay`),
  create: (data: any) => request<any>(`${API}/dauMay`, { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => request<any>(`${API}/dauMay/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => request<void>(`${API}/dauMay/${id}`, { method: "DELETE" }),
}

export default function DauMayManagerPage() {
    const [items, setItems] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<any>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({ name: "", code: "", images: [] as string[], description: "", content: "" })

    const fetchData = async () => {
        setLoading(true)
        try {
            const data = await dauMayApi.getAll()
            setItems(data || [])
        } catch (error) {
            toast.error("Không thể tải danh sách")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchData() }, [])

    const handleOpenDialog = (item?: any) => {
        if (item) {
            setEditingItem(item)
            setFormData({ name: item.name || "", code: item.code || "", images: item.images || (item.image ? [item.image] : []), description: item.description || "", content: item.content || "" })
        } else {
            setEditingItem(null)
            setFormData({ name: "", code: "", images: [], description: "", content: "" })
        }
        setIsDialogOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.name) return toast.error("Vui lòng nhập tên sản phẩm")
        setIsSubmitting(true)
        try {
            const payload = { ...formData, image: formData.images.length > 0 ? formData.images[0] : "", id: editingItem ? editingItem.id : `dm-${Date.now()}` }
            if (editingItem) { await dauMayApi.update(editingItem.id, payload); toast.success("Cập nhật thành công") }
            else { await dauMayApi.create(payload); toast.success("Thêm mới thành công") }
            setIsDialogOpen(false)
            fetchData()
        } catch { toast.error("Có lỗi xảy ra") } finally { setIsSubmitting(false) }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Xóa sản phẩm này?")) return
        try { await dauMayApi.delete(id); toast.success("Đã xóa"); fetchData() } catch { toast.error("Xóa thất bại") }
    }

    const filtered = items.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || (p.code && p.code.toLowerCase().includes(search.toLowerCase())))

    return (
        <main className="min-h-screen bg-[#0a0a0b] text-white p-6 lg:p-10">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-black uppercase text-white tracking-tight">Quản lý Dầu Máy</h1>
                        <p className="text-white/40 text-sm">Thêm, sửa, xóa sản phẩm dầu máy</p>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                            <Input placeholder="Tìm kiếm..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/40" />
                        </div>
                        <Button onClick={() => handleOpenDialog()} className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold whitespace-nowrap">
                            <Plus className="w-4 h-4 mr-2" /> Thêm mới
                        </Button>
                    </div>
                </div>

                <div className="rounded-xl border border-cyan-500/10 bg-white/[0.02] overflow-hidden">
                    <Table>
                        <TableHeader className="bg-white/5 border-b border-cyan-500/10">
                            <TableRow className="border-cyan-500/10 hover:bg-transparent">
                                <TableHead className="text-cyan-400/60 font-bold uppercase text-xs">Ảnh</TableHead>
                                <TableHead className="text-cyan-400/60 font-bold uppercase text-xs min-w-[200px]">Tên / Mã</TableHead>
                                <TableHead className="text-cyan-400/60 font-bold uppercase text-xs">Mô tả</TableHead>
                                <TableHead className="text-cyan-400/60 font-bold uppercase text-xs text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={4} className="h-32 text-center text-white/40"><Loader2 className="w-6 h-6 animate-spin mx-auto text-cyan-500" /></TableCell></TableRow>
                            ) : filtered.length === 0 ? (
                                <TableRow><TableCell colSpan={4} className="h-32 text-center text-white/40">Không tìm thấy</TableCell></TableRow>
                            ) : filtered.map(item => (
                                <TableRow key={item.id} className="hover:bg-cyan-500/5 border-cyan-500/10">
                                    <TableCell>
                                        <div className="w-12 h-12 rounded-lg border border-cyan-500/10 overflow-hidden relative bg-white/5">
                                            {item.image ? <Image src={item.image} alt={item.name} fill className="object-cover" /> : <div className="flex items-center justify-center h-full text-white/20 text-xs">No img</div>}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <p className="font-bold text-white text-sm">{item.name}</p>
                                        <p className="text-xs text-white/40 font-mono mt-0.5">{item.code || item.id}</p>
                                    </TableCell>
                                    <TableCell><div className="text-sm text-white/60 line-clamp-2 max-w-sm prose-sm prose-invert" dangerouslySetInnerHTML={{ __html: item.description || "—" }} /></TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button size="icon" variant="ghost" onClick={() => handleOpenDialog(item)} className="h-8 w-8 text-cyan-400/60 hover:text-cyan-400 hover:bg-cyan-500/10"><Edit className="w-4 h-4" /></Button>
                                            <Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)} className="h-8 w-8 text-red-500/70 hover:text-red-500 hover:bg-red-500/10"><Trash2 className="w-4 h-4" /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-4xl max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black uppercase tracking-tight">{editingItem ? "Chỉnh sửa dầu máy" : "Thêm dầu máy mới"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
                        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 no-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-white/60 text-xs uppercase font-bold tracking-wider">Tên sản phẩm *</Label>
                                    <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-white/5 border-cyan-500/20 text-white focus:border-cyan-500/50" required />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-white/60 text-xs uppercase font-bold tracking-wider">Mã sản phẩm</Label>
                                    <Input value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="bg-white/5 border-cyan-500/20 text-white font-mono focus:border-cyan-500/50" />
                                </div>
                            </div>
                            <div className="space-y-3 bg-cyan-500/5 p-4 rounded-xl border border-cyan-500/10">
                                <Label className="text-cyan-400/60 text-xs uppercase font-bold tracking-wider">Hình ảnh (Tối đa 5)</Label>
                                <MultiImageUpload images={formData.images} onChange={imgs => setFormData({...formData, images: imgs})} maxImages={5} />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-white/60 text-xs uppercase font-bold tracking-wider">Mô tả ngắn</Label>
                                <RichTextEditor value={formData.description} onChange={val => setFormData({...formData, description: val})} placeholder="..." simple={true} />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-white/60 text-xs uppercase font-bold tracking-wider">Nội dung chi tiết</Label>
                                <RichTextEditor value={formData.content} onChange={val => setFormData({...formData, content: val})} placeholder="..." />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="text-white/40 hover:text-white">Hủy bỏ</Button>
                            <Button type="submit" disabled={isSubmitting} className="bg-cyan-600 hover:bg-cyan-500 text-white font-black">
                                {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Đang lưu...</> : "Lưu sản phẩm"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </main>
    )
}
