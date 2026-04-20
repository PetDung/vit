"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Loader2, Plus, Edit, Trash2, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

import { 
    companyApi, heroApi, aboutApi, settingsApi, 
    statsApi, partnersApi 
} from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { ImageUpload } from "@/components/ui/image-upload"
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

export default function SettingsManagerPage() {
    const [activeTab, setActiveTab] = useState("company")
    const [loading, setLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [logoVersion, setLogoVersion] = useState(Date.now())

    // Data states for static objects
    const [company, setCompany] = useState<any>({})
    const [hero, setHero] = useState<any>({})
    const [about, setAbout] = useState<any>({})
    const [appSettings, setAppSettings] = useState<any>({})

    // Data states for arrays
    const [stats, setStats] = useState<any[]>([])
    const [partners, setPartners] = useState<any[]>([])

    // Dialog states for Arrays
    const [isStatDialogOpen, setIsStatDialogOpen] = useState(false)
    const [statForm, setStatForm] = useState({ id: "", value: "", suffix: "", label: "", icon: "" })

    const [isPartnerDialogOpen, setIsPartnerDialogOpen] = useState(false)
    const [partnerForm, setPartnerForm] = useState({ id: "", name: "", src: "" })

    const fetchData = async () => {
        setLoading(true)
        try {
            const [comp, hr, ab, sett, st, pt] = await Promise.all([
                companyApi.get(), heroApi.get(), aboutApi.get(),
                settingsApi.get(), statsApi.getAll(), partnersApi.getAll()
            ])
            setCompany(comp || {})
            setHero(hr || {})
            setAbout(ab || {})
            setAppSettings(sett || {})
            setStats(st || [])
            setPartners(pt || [])
        } catch (error) {
            toast.error("Không thể tải cấu hình")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    // --- Object Savers ---
    const handleSaveObject = async (api: any, data: any, name: string) => {
        setIsSubmitting(true)
        try {
            await api.update(data)
            toast.success(`Đã lưu cấu hình ${name}!`)
        } catch (error) {
            toast.error(`Lỗi khi lưu ${name}`)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if(!file) return
        
        const formData = new FormData()
        formData.append("file", file)
        
        setIsSubmitting(true)
        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData
            })
            const data = await res.json()
            if(data.success) {
                setLogoVersion(Date.now())
                toast.success("Đã ghi đè logo lên máy chủ (public/logo.png)")
            } else {
                toast.error("Lỗi: " + data.error)
            }
        } catch (error) {
            toast.error("Không thể tải ảnh lên")
        } finally {
            setIsSubmitting(false)
        }
    }

    // --- Array CRUD ---
    // STATS
    const openStatDialog = (item?: any) => {
        if(item) setStatForm(item)
        else setStatForm({ id: "", value: "", suffix: "", label: "", icon: "" })
        setIsStatDialogOpen(true)
    }
    const handleSaveStat = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            if(statForm.id) {
                await statsApi.update(statForm.id, statForm)
                toast.success("Đã cập nhật chỉ số")
            } else {
                await statsApi.create({ ...statForm, id: `stat-${Date.now()}` })
                toast.success("Đã thêm chỉ số mới")
            }
            setIsStatDialogOpen(false)
            fetchData()
        } catch (error) {
            toast.error("Lỗi cập nhật chỉ số")
        } finally {
            setIsSubmitting(false)
        }
    }
    const handleDeleteStat = async (id: string) => {
        if(!confirm("Xóa chỉ số này?")) return
        await statsApi.delete(id)
        toast.success("Đã xóa")
        fetchData()
    }

    // PARTNERS
    const openPartnerDialog = (item?: any) => {
        if(item) setPartnerForm(item)
        else setPartnerForm({ id: "", name: "", src: "" })
        setIsPartnerDialogOpen(true)
    }
    const handleSavePartner = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            if(partnerForm.id) {
                await partnersApi.update(partnerForm.id, partnerForm)
                toast.success("Đã cập nhật đối tác")
            } else {
                await partnersApi.create({ ...partnerForm, id: `partner-${Date.now()}` })
                toast.success("Đã thêm đối tác mới")
            }
            setIsPartnerDialogOpen(false)
            fetchData()
        } catch (error) {
            toast.error("Lỗi cập nhật đối tác")
        } finally {
            setIsSubmitting(false)
        }
    }
    const handleDeletePartner = async (id: string) => {
        if(!confirm("Xóa đối tác này?")) return
        await partnersApi.delete(id)
        toast.success("Đã xóa")
        fetchData()
    }

    if(loading) {
        return <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center text-white"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
    }

    return (
        <main className="min-h-screen bg-[#0a0a0b] text-white p-6 lg:p-10 pb-24">
            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-black uppercase text-white tracking-tight">Cấu Hình Website</h1>
                    <p className="text-white/40 text-sm">Quản lý thông tin công ty, nội dung trang chủ và chỉ số thống kê</p>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="bg-white/5 border border-white/10 text-white/60 p-1 mb-6 flex-wrap h-auto">
                        <TabsTrigger value="company" className="data-[state=active]:bg-primary data-[state=active]:text-black font-bold">Thông tin Công ty</TabsTrigger>
                        <TabsTrigger value="hero" className="data-[state=active]:bg-primary data-[state=active]:text-black font-bold">Trang chủ (Hero)</TabsTrigger>
                        <TabsTrigger value="about" className="data-[state=active]:bg-primary data-[state=active]:text-black font-bold">Khối About Us</TabsTrigger>
                        <TabsTrigger value="stats" className="data-[state=active]:bg-primary data-[state=active]:text-black font-bold">Chỉ số (Stats)</TabsTrigger>
                        <TabsTrigger value="partners" className="data-[state=active]:bg-primary data-[state=active]:text-black font-bold">Đối tác</TabsTrigger>
                        <TabsTrigger value="settings" className="data-[state=active]:bg-primary data-[state=active]:text-black font-bold">Cài đặt khác (Map, Social)</TabsTrigger>
                    </TabsList>

                    {/* --- TAB: COMPANY --- */}
                    <TabsContent value="company" className="space-y-4 m-0">
                        <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6">
                            <h2 className="text-lg font-bold mb-4 text-primary">Thông tin hiển thị Footer & Header</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4 md:col-span-2 bg-black/40 p-5 border border-white/5 rounded-xl shadow-inner">
                                    <Label className="text-primary font-black uppercase tracking-wider text-sm flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-primary" />
                                        Logo Công ty & Màu nền
                                    </Label>
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 mt-2">
                                        {/* Preview Box */}
                                        <div 
                                            className="w-48 h-16 rounded-lg flex items-center justify-center border-2 border-dashed border-white/20 overflow-hidden shadow-lg transition-colors" 
                                            style={{ backgroundColor: company.logoBg || '#ffcb05' }}
                                        >
                                            <img src={`/logo.png?v=${logoVersion}`} alt="Logo" className="max-h-full max-w-full object-contain p-2" />
                                        </div>

                                        <div className="flex flex-col gap-4 flex-1">
                                            {/* File Upload */}
                                            <div className="space-y-1.5">
                                                <Label className="text-white/70 text-xs uppercase tracking-widest font-bold">1. Tải ảnh lên (Ghi đè trực tiếp)</Label>
                                                <Input 
                                                    type="file" 
                                                    accept="image/*" 
                                                    onChange={handleLogoUpload} 
                                                    className="bg-white/5 text-xs text-white file:bg-primary file:text-black file:border-none file:mr-4 file:px-4 file:py-1 file:rounded-md file:font-bold cursor-pointer hover:file:bg-primary/80" 
                                                    disabled={isSubmitting}
                                                />
                                            </div>

                                            {/* Color Picker */}
                                            <div className="space-y-1.5">
                                                <Label className="text-white/70 text-xs uppercase tracking-widest font-bold">2. Tùy chỉnh Màu nền</Label>
                                                <div className="flex items-center gap-3">
                                                    <Input 
                                                        type="color" 
                                                        value={company.logoBg || "#ffcb05"} 
                                                        onChange={e => setCompany({...company, logoBg: e.target.value})} 
                                                        className="w-10 h-10 p-1 bg-white/5 border-white/10 cursor-pointer rounded-md" 
                                                    />
                                                    <Input 
                                                        type="text"
                                                        value={company.logoBg || "#ffcb05"} 
                                                        onChange={e => setCompany({...company, logoBg: e.target.value})} 
                                                        className="bg-white/5 border-white/10 text-white w-28 font-mono text-center uppercase" 
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-white/30 pt-2 border-t border-white/5 mt-4">
                                        * Logo sẽ được ghi đè trực tiếp để tải nhanh. Màu nền sẽ được áp dụng cho cả Header và Footer trên toàn website. Đừng quên bấm "Lưu thông tin Công ty" ở dưới cùng trang sau khi chọn màu.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Tên Công Ty</Label>
                                    <Input value={company.name || ""} onChange={e => setCompany({...company, name: e.target.value})} className="bg-white/5 border-white/10 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Slogan / Tên đầy đủ</Label>
                                    <Input value={company.slogan || ""} onChange={e => setCompany({...company, slogan: e.target.value})} className="bg-white/5 border-white/10 text-white" />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label>Địa chỉ</Label>
                                    <Input value={company.address || ""} onChange={e => setCompany({...company, address: e.target.value})} className="bg-white/5 border-white/10 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Số điện thoại</Label>
                                    <Input value={company.phone || ""} onChange={e => setCompany({...company, phone: e.target.value})} className="bg-white/5 border-white/10 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Hotline</Label>
                                    <Input value={company.hotline || ""} onChange={e => setCompany({...company, hotline: e.target.value})} className="bg-white/5 border-white/10 text-white font-bold text-primary" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input value={company.email || ""} onChange={e => setCompany({...company, email: e.target.value})} className="bg-white/5 border-white/10 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Giờ làm việc</Label>
                                    <Input value={company.workingHours || ""} onChange={e => setCompany({...company, workingHours: e.target.value})} className="bg-white/5 border-white/10 text-white" />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label>Website</Label>
                                    <Input value={company.website || ""} onChange={e => setCompany({...company, website: e.target.value})} className="bg-white/5 border-white/10 text-white" />
                                </div>
                            </div>
                            <Button className="mt-6 bg-primary font-bold text-black" onClick={() => handleSaveObject(companyApi, company, 'Công ty')} disabled={isSubmitting}>Lưu thông tin Công ty</Button>
                        </div>
                    </TabsContent>

                    {/* --- TAB: HERO --- */}
                    <TabsContent value="hero" className="space-y-4 m-0">
                        <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6">
                            <h2 className="text-lg font-bold mb-4 text-primary">Nội dung Banner Trang chủ</h2>
                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-2">
                                    <Label>Title 1 (Dòng 1)</Label>
                                    <Input value={hero.title1 || ""} onChange={e => setHero({...hero, title1: e.target.value})} className="bg-white/5 border-white/10 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Title 2 (Chữ bự / Highlight)</Label>
                                    <Input value={hero.title2 || ""} onChange={e => setHero({...hero, title2: e.target.value})} className="bg-white/5 border-white/10 text-white text-primary font-black" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Title 3 (Dòng 3)</Label>
                                    <Input value={hero.title3 || ""} onChange={e => setHero({...hero, title3: e.target.value})} className="bg-white/5 border-white/10 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Chữ nhỏ hiển thị góc trên</Label>
                                    <Input value={hero.experience || ""} onChange={e => setHero({...hero, experience: e.target.value})} className="bg-white/5 border-white/10 text-white" placeholder="+ 15 Năm Kinh Nghiệm" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Mô tả ngắn ở dưới</Label>
                                    <Textarea value={hero.description || ""} onChange={e => setHero({...hero, description: e.target.value})} className="bg-white/5 border-white/10 text-white h-24" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Ảnh/Video nền (Tối đa 50MB)</Label>
                                    <ImageUpload 
                                        value={hero.videoUrl || ""} 
                                        onChange={(url: string) => setHero({...hero, videoUrl: url})} 
                                        acceptVideo={true} 
                                    />
                                </div>
                            </div>
                            <Button className="mt-6 bg-primary font-bold text-black" onClick={() => handleSaveObject(heroApi, hero, 'Hero Banner')} disabled={isSubmitting}>Lưu cấu hình Hero</Button>
                        </div>
                    </TabsContent>

                    {/* --- TAB: ABOUT --- */}
                    <TabsContent value="about" className="space-y-4 m-0">
                        <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6">
                            <h2 className="text-lg font-bold mb-4 text-primary">Nội dung Khối Giới thiệu (Homepage)</h2>
                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-2">
                                    <Label>Tiêu đề 1</Label>
                                    <Input value={about.title1 || ""} onChange={e => setAbout({...about, title1: e.target.value})} className="bg-white/5 border-white/10 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Tiêu đề 2 (Highlight)</Label>
                                    <Input value={about.title2 || ""} onChange={e => setAbout({...about, title2: e.target.value})} className="bg-white/5 border-white/10 text-white text-primary font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Mô tả đoạn 1</Label>
                                    <Textarea value={about.description1 || ""} onChange={e => setAbout({...about, description1: e.target.value})} className="bg-white/5 border-white/10 text-white h-20" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Mô tả đoạn 2</Label>
                                    <Textarea value={about.description2 || ""} onChange={e => setAbout({...about, description2: e.target.value})} className="bg-white/5 border-white/10 text-white h-24" />
                                </div>
                            </div>
                            <Button className="mt-6 bg-primary font-bold text-black" onClick={() => handleSaveObject(aboutApi, about, 'Khối Giới Thiệu')} disabled={isSubmitting}>Lưu thông tin About</Button>
                            <p className="text-white/40 text-xs mt-3">* Các features bên trong "About" đang được code cứng giao diện vì cấu trúc icon phức tạp. Nếu cần sửa vui lòng edit trực tiếp trong mã nguồn.</p>
                        </div>
                    </TabsContent>

                    {/* --- TAB: SETTINGS --- */}
                    <TabsContent value="settings" className="space-y-4 m-0">
                        <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6">
                            <h2 className="text-lg font-bold mb-4 text-primary">Cấu hình Bản đồ & Mạng xã hội</h2>
                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-2">
                                    <Label>Google Maps Embed URL (Src iframe bản đồ trang Liên hệ)</Label>
                                    <Input value={appSettings.mapUrl || ""} onChange={e => setAppSettings({...appSettings, mapUrl: e.target.value})} className="bg-white/5 border-white/10 text-white font-mono text-xs" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Link Facebook Công ty</Label>
                                    <Input value={appSettings.facebook || ""} onChange={e => setAppSettings({...appSettings, facebook: e.target.value})} className="bg-white/5 border-white/10 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Link Zalo OA / Zalo cá nhân</Label>
                                    <Input value={appSettings.zalo || ""} onChange={e => setAppSettings({...appSettings, zalo: e.target.value})} className="bg-white/5 border-white/10 text-white" />
                                </div>
                            </div>
                            <Button className="mt-6 bg-primary font-bold text-black" onClick={() => handleSaveObject(settingsApi, appSettings, 'Cài đặt chung')} disabled={isSubmitting}>Lưu cấu hình chung</Button>
                        </div>
                    </TabsContent>

                    {/* --- TAB: STATS --- */}
                    <TabsContent value="stats" className="space-y-4 m-0">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-primary">Chỉ số thống kê ấn tượng</h2>
                            <Button onClick={() => openStatDialog()} className="bg-primary hover:bg-primary/90 text-black font-bold h-8"><Plus className="w-4 h-4 mr-2" /> Thêm chỉ số</Button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            {stats.map(st => (
                                <div key={st.id} className="bg-white/[0.02] border border-white/10 p-5 rounded-xl flex border-b-4 border-b-primary relative group">
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                        <button onClick={() => openStatDialog(st)} className="p-1.5 bg-white/10 rounded text-white/60 hover:text-white"><Edit className="w-3 h-3" /></button>
                                        <button onClick={() => handleDeleteStat(st.id)} className="p-1.5 bg-red-500/20 rounded text-red-500/80 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-black text-white">{st.value}<span className="text-primary">{st.suffix}</span></div>
                                        <div className="text-sm text-white/60 mt-1">{st.label}</div>
                                        <div className="text-[10px] text-white/30 font-mono mt-2">Icon: {st.icon}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </TabsContent>

                    {/* --- TAB: PARTNERS --- */}
                    <TabsContent value="partners" className="space-y-4 m-0">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-primary">Đối tác tiêu biểu</h2>
                            <Button onClick={() => openPartnerDialog()} className="bg-primary hover:bg-primary/90 text-black font-bold h-8"><Plus className="w-4 h-4 mr-2" /> Thêm đối tác</Button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                            {partners.map(pt => (
                                <div key={pt.id} className="bg-white h-24 rounded-xl flex items-center justify-center p-4 relative group">
                                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10 bg-black/50 p-1 rounded">
                                        <button onClick={() => openPartnerDialog(pt)} className="p-1 text-white hover:text-primary"><Edit className="w-3 h-3" /></button>
                                        <button onClick={() => handleDeletePartner(pt.id)} className="p-1 text-red-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                                    </div>
                                    <img src={pt.src} alt={pt.name} className="max-w-full max-h-full object-contain grayscale hover:grayscale-0 transition-all" />
                                    <div className="absolute bottom-1 left-0 right-0 text-center text-[8px] text-black/40 font-bold opacity-0 group-hover:opacity-100 uppercase">{pt.name}</div>
                                </div>
                            ))}
                        </div>
                    </TabsContent>

                </Tabs>
            </div>

            {/* --- DIALOGS FOR ARRAYS --- */}
            <Dialog open={isStatDialogOpen} onOpenChange={setIsStatDialogOpen}>
                <DialogContent className="sm:max-w-[425px] bg-[#111113] border border-white/10 text-white p-0 overflow-hidden">
                    <DialogHeader className="p-6 pb-4 border-b border-white/5">
                        <DialogTitle className="text-xl font-black uppercase">{statForm.id ? "Sửa Chỉ số" : "Thêm Chỉ số"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSaveStat} className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Giá trị (số)</Label><Input type="number" value={statForm.value} onChange={e => setStatForm({...statForm, value: e.target.value})} className="bg-white/5 border-white/10 text-white font-bold text-xl" required /></div>
                            <div className="space-y-2"><Label>Hậu tố (%, +, M)</Label><Input value={statForm.suffix} onChange={e => setStatForm({...statForm, suffix: e.target.value})} className="bg-white/5 border-white/10 text-primary font-bold" /></div>
                        </div>
                        <div className="space-y-2"><Label>Nhãn</Label><Input value={statForm.label} onChange={e => setStatForm({...statForm, label: e.target.value})} className="bg-white/5 border-white/10 text-white" placeholder="Năm kinh nghiệm..." required /></div>
                        <div className="space-y-2"><Label>Tên Icon</Label><Input value={statForm.icon} onChange={e => setStatForm({...statForm, icon: e.target.value})} className="bg-white/5 border-white/10 text-white font-mono" placeholder="YRS, KH, NK..." /></div>
                        <DialogFooter className="pt-4 border-t border-white/10 mt-6">
                            <Button type="button" variant="ghost" onClick={() => setIsStatDialogOpen(false)} className="text-white/60">Hủy</Button>
                            <Button type="submit" disabled={isSubmitting} className="bg-primary text-black font-bold">Lưu</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isPartnerDialogOpen} onOpenChange={setIsPartnerDialogOpen}>
                <DialogContent className="sm:max-w-[425px] bg-[#111113] border border-white/10 text-white p-0 overflow-hidden">
                    <DialogHeader className="p-6 pb-4 border-b border-white/5">
                        <DialogTitle className="text-xl font-black uppercase">{partnerForm.id ? "Sửa Đối tác" : "Thêm Đối tác"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSavePartner} className="p-6 space-y-4">
                        <div className="space-y-2"><Label>Tên đối tác</Label><Input value={partnerForm.name} onChange={e => setPartnerForm({...partnerForm, name: e.target.value})} className="bg-white/5 border-white/10 text-white" required /></div>
                        <div className="space-y-2">
                            <Label>Link ảnh logo (URL trong suốt PNG)</Label>
                            <ImageUpload 
                                value={partnerForm.src} 
                                onChange={(url: string) => setPartnerForm({...partnerForm, src: url})} 
                            />
                        </div>
                        <DialogFooter className="pt-4 border-t border-white/10 mt-6">
                            <Button type="button" variant="ghost" onClick={() => setIsPartnerDialogOpen(false)} className="text-white/60">Hủy</Button>
                            <Button type="submit" disabled={isSubmitting} className="bg-primary text-black font-bold">Lưu đối tác</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </main>
    )
}
