"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Trash2, Search, Loader2, CheckCircle2, MessageSquare, Mail, Phone, Clock } from "lucide-react"
import { toast } from "sonner"

import { contactsApi } from "@/lib/api"
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
} from "@/components/ui/dialog"

export default function ContactsManagerPage() {
    const [contacts, setContacts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")

    const [viewingContact, setViewingContact] = useState<any>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const fetchData = async () => {
        setLoading(true)
        try {
            const data = await contactsApi.getAll()
            // Sắp xếp mới nhất lên đầu nếu có ID timestamp
            const sorted = (data || []).sort((a: any, b: any) => {
                if(a.id > b.id) return -1
                if(a.id < b.id) return 1
                return 0
            })
            setContacts(sorted)
        } catch (error) {
            toast.error("Không thể tải danh sách liên hệ")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleDelete = async (id: string, e?: React.MouseEvent) => {
        if(e) e.stopPropagation()
        if (!confirm("Bạn có chắc chắn muốn xóa liên hệ này? Thao tác không thể hoàn tác.")) return

        try {
            await contactsApi.delete(id)
            toast.success("Đã xóa liên hệ")
            fetchData()
            if(viewingContact?.id === id) setIsDialogOpen(false)
        } catch (error) {
            toast.error("Xóa thất bại")
        }
    }

    const handleToggleStatus = async (contact: any, e?: React.MouseEvent) => {
        if(e) e.stopPropagation()
        const newStatus = contact.status === "read" ? "unread" : "read"
        try {
            await contactsApi.update(contact.id, { ...contact, status: newStatus })
            toast.success(newStatus === "read" ? "Đã đánh dấu đã xem" : "Đã chuyển thành chưa xem")
            fetchData()
            if(viewingContact?.id === contact.id) {
                setViewingContact({ ...contact, status: newStatus })
            }
        } catch (error) {
            toast.error("Cập nhật thất bại")
        }
    }

    const handleUpdateNote = async () => {
        if (!viewingContact) return
        try {
            await contactsApi.update(viewingContact.id, viewingContact)
            toast.success("Đã lưu ghi chú nội bộ")
            fetchData()
        } catch (error) {
            toast.error("Không thể lưu ghi chú")
        }
    }

    const handleViewDetails = (contact: any) => {
        setViewingContact(contact)
        setIsDialogOpen(true)
    }

    const filteredContacts = contacts.filter(c => 
        (c.name && c.name.toLowerCase().includes(search.toLowerCase())) ||
        (c.email && c.email.toLowerCase().includes(search.toLowerCase())) ||
        (c.phone && c.phone.includes(search))
    )

    return (
        <main className="min-h-screen bg-[#0a0a0b] text-white p-6 lg:p-10">
            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-black uppercase text-white tracking-tight">Khách Hàng Liên Hệ</h1>
                        <p className="text-white/40 text-sm">Danh sách khách hàng để lại thông tin yêu cầu tư vấn</p>
                    </div>
                    
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                            <Input 
                                placeholder="Tìm theo tên, SĐT, Email..." 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-primary/20"
                            />
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
                    <Table>
                        <TableHeader className="bg-white/5 border-b border-white/10 hover:bg-white/5">
                            <TableRow className="border-white/10 hover:bg-transparent">
                                <TableHead className="text-white/60 font-bold uppercase text-xs w-[180px]">Khách hàng</TableHead>
                                <TableHead className="text-white/60 font-bold uppercase text-xs">Liên hệ</TableHead>
                                <TableHead className="text-white/60 font-bold uppercase text-xs min-w-[200px]">Nội dung</TableHead>
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
                            ) : filteredContacts.length === 0 ? (
                                <TableRow className="hover:bg-white/[0.02] border-white/10">
                                    <TableCell colSpan={5} className="h-32 text-center text-white/40 flex-col items-center justify-center">
                                        <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-20" />
                                        Chưa có liên hệ nào hoặc không tìm thấy
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredContacts.map((contact) => (
                                    <TableRow 
                                        key={contact.id} 
                                        className="hover:bg-white/[0.04] border-white/10 cursor-pointer transition-colors"
                                        onClick={() => handleViewDetails(contact)}
                                    >
                                        <TableCell>
                                            <p className="font-bold text-white text-sm line-clamp-1">{contact.name || "Không tên"}</p>
                                            <p className="text-[10px] text-white/40 mt-1 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {contact.createdAt || "N/A"}
                                            </p>
                                        </TableCell>
                                        <TableCell>
                                            {contact.phone && <p className="text-xs text-white/80 font-mono mb-1 flex items-center gap-1.5"><Phone className="w-3 h-3 text-white/40" /> {contact.phone}</p>}
                                            {contact.email && <p className="text-xs text-white/60 flex items-center gap-1.5"><Mail className="w-3 h-3 text-white/40" /> {contact.email}</p>}
                                        </TableCell>
                                        <TableCell>
                                            <p className="text-sm text-white/60 line-clamp-2">{contact.message || "—"}</p>
                                            {contact.note && (
                                                <div className="mt-2 p-2 bg-primary/10 border border-primary/20 rounded text-[11px] text-primary italic flex items-start gap-1.5">
                                                    <div className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
                                                    <span className="line-clamp-1">Ghi chú: {contact.note}</span>
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {contact.status === "read" ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-500/10 text-green-500 text-[10px] font-bold uppercase">
                                                    Đã xem
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase">
                                                    Mới
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button 
                                                    size="icon" 
                                                    variant="ghost" 
                                                    title={contact.status === "read" ? "Đánh dấu chưa xem" : "Đánh dấu đã xem"} 
                                                    onClick={(e) => handleToggleStatus(contact, e)} 
                                                    className={`h-8 w-8 ${contact.status === "read" ? "text-green-500 hover:bg-green-500/10" : "text-white/60 hover:text-green-500 hover:bg-green-500/10"}`}
                                                >
                                                    <CheckCircle2 className="w-4 h-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" title="Xóa liên hệ" onClick={(e) => handleDelete(contact.id, e)} className="h-8 w-8 text-red-500/70 hover:text-red-500 hover:bg-red-500/10">
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

            {/* Dialog Chi Tiết */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px] bg-[#111113] border border-white/10 text-white max-h-[90vh] overflow-y-auto no-scrollbar scroll-smooth p-0">
                    <DialogHeader className="sticky top-0 z-10 bg-[#111113] p-6 pb-4 border-b border-white/5">
                        <DialogTitle className="text-xl font-black uppercase text-white flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-primary" />
                            Chi tiết liên hệ
                        </DialogTitle>
                    </DialogHeader>

                    <div className="p-6 pt-0">
                        {viewingContact && (
                            <div className="space-y-6 mt-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                    <p className="text-xs text-white/40 uppercase font-bold mb-1">Khách hàng</p>
                                    <p className="text-base font-medium">{viewingContact.name || "Không rõ"}</p>
                                </div>
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                    <p className="text-xs text-white/40 uppercase font-bold mb-1">Thời gian gửi</p>
                                    <p className="text-base font-medium text-white/80">{viewingContact.createdAt || "Không rõ"}</p>
                                </div>
                            </div>
                            
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-3">
                                <div>
                                    <p className="text-xs text-white/40 uppercase font-bold mb-1">Số điện thoại</p>
                                    <p className="text-base font-mono font-medium text-white/90">{viewingContact.phone || "—"}</p>
                                </div>
                                <div className="h-px w-full bg-white/10" />
                                <div>
                                    <p className="text-xs text-white/40 uppercase font-bold mb-1">Email</p>
                                    <p className="text-base font-medium text-white/90">{viewingContact.email || "—"}</p>
                                </div>
                            </div>

                             <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                <p className="text-xs text-white/40 uppercase font-bold mb-2">Lời nhắn</p>
                                <div className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap rounded bg-black/40 p-4 border border-white/5">
                                    {viewingContact.message || "Khách hàng không để lại lời nhắn."}
                                </div>
                            </div>

                            <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 space-y-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs text-primary uppercase font-bold">Ghi chú nội bộ</p>
                                    <Button 
                                        size="sm" 
                                        onClick={handleUpdateNote}
                                        className="h-7 bg-primary hover:bg-primary/90 text-black font-bold text-[10px] px-3"
                                    >
                                        Lưu ghi chú
                                    </Button>
                                </div>
                                <textarea 
                                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-primary/50 min-h-[80px]"
                                    placeholder="Nhập ghi chú quan trọng về khách hàng này..."
                                    value={viewingContact.note || ""}
                                    onChange={(e) => setViewingContact({...viewingContact, note: e.target.value})}
                                />
                            </div>

                             <div className="sticky bottom-0 z-10 bg-[#111113] flex items-center justify-end gap-3 pt-4 pb-6 mt-6 border-t border-white/10">
                                <Button 
                                    onClick={() => handleToggleStatus(viewingContact)} 
                                    variant="outline"
                                    className={`font-bold border-white/10 ${viewingContact.status === "read" ? "text-green-500 bg-green-500/5 border-green-500/20" : "text-white hover:bg-white/5"}`}
                                >
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    {viewingContact.status === "read" ? "Đã xem" : "Đánh dấu đã xem"}
                                </Button>
                                <Button onClick={() => handleDelete(viewingContact.id)} variant="destructive" className="font-bold">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Xóa
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
                </DialogContent>
            </Dialog>

        </main>
    )
}
