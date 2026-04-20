export const EVENT_MAP: Record<string, { label: string, category: string }> = {
        'click_nut_lien_he_page': { label: 'Liên hệ từ /lien-he', category: 'conversion' },
        'contact': { label: 'Yêu cầu liên hệ', category: 'conversion' },
        'view_item': { label: 'Xem Sản phẩm/Tin tức', category: 'engagement' },
        'view_facebook': { label: 'Xem facebook', category: 'conversion' },
        'view_zalo': { label: 'Xem zalo', category: 'conversion' },
        'share': { label: 'Chia sẻ lên MXH 🚀', category: 'engagement' },
        'click': { label: 'Click liên kết', category: 'engagement' },
        'page_view': { label: 'Xem trang', category: 'engagement' },
        'scroll': { label: 'Cuộn trang (90%)', category: 'engagement' },
        'user_engagement': { label: 'Tương tác ý nghĩa', category: 'engagement' },
        'session_start': { label: 'Bắt đầu phiên', category: 'system' },
        'first_visit': { label: 'Lần đầu truy cập', category: 'system' },
        'form_start': { label: 'Bắt đầu gõ form', category: 'system' }
};