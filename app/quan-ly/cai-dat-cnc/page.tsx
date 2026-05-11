"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Loader2, Plus, Edit, Trash2, CheckCircle2, Activity, Settings as SettingsIcon } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

import { 
    cncHeroApi, cncAboutApi, cncStatsApi, cncPartnersApi 
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

export default function CncSettingsManagerPage() {
    const [activeTab, setActiveTab] = useState("hero")
    const [loading, setLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Data states for static objects
    const [hero, setHero] = useState<any>({})
    const [about, setAbout] = useState<any>({})

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
            const [hr, ab, st, pt] = await Promise.all([
                cncHeroApi.get(), cncAboutApi.get(),
                cncStatsApi.getAll(), cncPartnersApi.getAll()
            ])
            setHero(hr || {})
            setAbout(ab || {})
            setStats(st || [])
            setPartners(pt || [])
        } catch (error) {
            toast.error("Không thể tải cấu hình CNC")
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
            toast.success(`Đã lưu cấu hình ${name} cho CNC!`)
        } catch (error) {
            toast.error(`Lỗi khi lưu ${name}`)
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
                await cncStatsApi.update(statForm.id, statForm)
                toast.success("Đã cập nhật chỉ số CNC")
            } else {
                // For demo/json-server, create is usually same as update if we handle IDs
                // But let's assume we update existing ones from seeded db.json
                await cncStatsApi.update(statForm.id, statForm)
                toast.success("Đã cập nhật chỉ số CNC")
            }
            setIsStatDialogOpen(false)
            fetchData()
        } catch (error) {
            toast.error("Lỗi cập nhật chỉ số CNC")
        } finally {
            setIsSubmitting(false)
        }
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
                await cncPartnersApi.update(partnerForm.id, partnerForm)
                toast.success("Đã cập nhật đối tác CNC")
            } else {
                await cncPartnersApi.update(partnerForm.id, partnerForm)
                toast.success("Đã cập nhật đối tác CNC")
            }
            setIsPartnerDialogOpen(false)
            fetchData()
        } catch (error) {
            toast.error("Lỗi cập nhật đối tác CNC")
        } finally {
            setIsSubmitting(false)
        }
    }

    if(loading) {
        return <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center text-white"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
    }

    return (
        <main className="min-h-screen bg-[#0a0a0b] text-white p-6 lg:p-10 pb-24">
            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Header */}
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <SettingsIcon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black uppercase text-white tracking-tight">Cấu Hình CNC</h1>
                        <p className="text-white/40 text-sm">Quản lý nội dung chuyên biệt cho chủ đề Dầu Máy CNC</p>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="bg-white/5 border border-white/10 text-white/60 p-1 mb-6 flex-wrap h-auto">
                        <TabsTrigger value="hero" className="data-[state=active]:bg-primary data-[state=active]:text-black font-bold">Banner CNC (Hero)</TabsTrigger>
                        <TabsTrigger value="about" className="data-[state=active]:bg-primary data-[state=active]:text-black font-bold">Khối About CNC</TabsTrigger>
                        <TabsTrigger value="stats" className="data-[state=active]:bg-primary data-[state=active]:text-black font-bold">Chỉ số CNC (Stats)</TabsTrigger>
                        <TabsTrigger value="partners" className="data-[state=active]:bg-primary data-[state=active]:text-black font-bold">Đối tác CNC</TabsTrigger>
                    </TabsList>

                    {/* --- TAB: HERO --- */}
                    <TabsContent value="hero" className="space-y-4 m-0">
                        <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6">
                            <h2 className="text-lg font-bold mb-4 text-primary">Nội dung Banner CNC</h2>
                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-2">
                                    <Label>Tiêu đề chính (Title)</Label>
                                    <Input value={hero.title || ""} onChange={e => setHero({...hero, title: e.target.value})} className="bg-white/5 border-white/10 text-white text-primary font-black" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Tiêu đề phụ (Subtitle)</Label>
                                    <Input value={hero.subtitle || ""} onChange={e => setHero({...hero, subtitle: e.target.value})} className="bg-white/5 border-white/10 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Mô tả (Description)</Label>
                                    <Textarea value={hero.description || ""} onChange={e => setHero({...hero, description: e.target.value})} className="bg-white/5 border-white/10 text-white h-24" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Ảnh nền CNC (URL)</Label>
                                    <ImageUpload 
                                        value={hero.backgroundImage || ""} 
                                        onChange={(url: string) => setHero({...hero, backgroundImage: url})} 
                                    />
                                </div>
                            </div>
                            <Button className="mt-6 bg-primary font-bold text-black" onClick={() => handleSaveObject(cncHeroApi, hero, 'Hero CNC')} disabled={isSubmitting}>Lưu cấu hình Banner CNC</Button>
                        </div>
                    </TabsContent>

                    {/* --- TAB: ABOUT --- */}
                    <TabsContent value="about" className="space-y-4 m-0">
                        <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6">
                            <h2 className="text-lg font-bold mb-4 text-primary">Khối Giới thiệu CNC</h2>
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
                                    <Label>Mô tả 1</Label>
                                    <Textarea value={about.description1 || ""} onChange={e => setAbout({...about, description1: e.target.value})} className="bg-white/5 border-white/10 text-white h-20" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Mô tả 2</Label>
                                    <Textarea value={about.description2 || ""} onChange={e => setAbout({...about, description2: e.target.value})} className="bg-white/5 border-white/10 text-white h-24" />
                                </div>
                            </div>
                            <Button className="mt-6 bg-primary font-bold text-black" onClick={() => handleSaveObject(cncAboutApi, about, 'About CNC')} disabled={isSubmitting}>Lưu thông tin About CNC</Button>
                        </div>
                    </TabsContent>

                    {/* --- TAB: STATS --- */}
                    <TabsContent value="stats" className="space-y-4 m-0">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-primary">Chỉ số thống kê CNC</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            {stats.map(st => (
                                <div key={st.id} className="bg-white/[0.02] border border-white/10 p-5 rounded-xl flex border-b-4 border-b-primary relative group">
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                        <button onClick={() => openStatDialog(st)} className="p-1.5 bg-white/10 rounded text-white/60 hover:text-white"><Edit className="w-3 h-3" /></button>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-black text-white">{st.value}<span className="text-primary">{st.suffix}</span></div>
                                        <div className="text-sm text-white/60 mt-1">{st.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </TabsContent>

                    {/* --- TAB: PARTNERS --- */}
                    <TabsContent value="partners" className="space-y-4 m-0">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-primary">Đối tác CNC</h2>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                            {partners.map(pt => (
                                <div key={pt.id} className="bg-white h-24 rounded-xl flex items-center justify-center p-4 relative group">
                                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10 bg-black/50 p-1 rounded">
                                        <button onClick={() => openPartnerDialog(pt)} className="p-1 text-white hover:text-primary"><Edit className="w-3 h-3" /></button>
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
                        <DialogTitle className="text-xl font-black uppercase">Sửa Chỉ số CNC</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSaveStat} className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Giá trị (số)</Label><Input type="number" value={statForm.value} onChange={e => setStatForm({...statForm, value: e.target.value})} className="bg-white/5 border-white/10 text-white font-bold text-xl" required /></div>
                            <div className="space-y-2"><Label>Hậu tố</Label><Input value={statForm.suffix} onChange={e => setStatForm({...statForm, suffix: e.target.value})} className="bg-white/5 border-white/10 text-primary font-bold" /></div>
                        </div>
                        <div className="space-y-2"><Label>Nhãn</Label><Input value={statForm.label} onChange={e => setStatForm({...statForm, label: e.target.value})} className="bg-white/5 border-white/10 text-white" required /></div>
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
                        <DialogTitle className="text-xl font-black uppercase">Sửa Đối tác CNC</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSavePartner} className="p-6 space-y-4">
                        <div className="space-y-2"><Label>Tên đối tác</Label><Input value={partnerForm.name} onChange={e => setPartnerForm({...partnerForm, name: e.target.value})} className="bg-white/5 border-white/10 text-white" required /></div>
                        <div className="space-y-2">
                            <Label>Link ảnh logo (URL)</Label>
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
