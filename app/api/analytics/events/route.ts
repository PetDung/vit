import { analyticsClient, propertyId } from '@/lib/ga4';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate') || '30daysAgo';
    const endDate = searchParams.get('endDate') || 'today';

    const [response] = await analyticsClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'eventName' }],
      metrics: [{ name: 'eventCount' }],
    });

    const EVENT_MAP: Record<string, { label: string, category: string }> = {
        'generate_lead': { label: 'Gửi Form liên hệ 🌟', category: 'conversion' },
        'click_nut_lien_he': { label: 'Click Nút liên hệ 🌟', category: 'conversion' },
        'contact': { label: 'Liên hệ 🌟', category: 'conversion' },
        'lead': { label: 'Khách tiềm năng 🌟', category: 'conversion' },
        'page_view': { label: 'Xem trang', category: 'engagement' },
        'scroll': { label: 'Cuộn trang (90%)', category: 'engagement' },
        'user_engagement': { label: 'Tương tác ý nghĩa', category: 'engagement' },
        'click': { label: 'Click chuột', category: 'engagement' },
        'view_item': { label: 'Xem sản phẩm', category: 'engagement' },
        'session_start': { label: 'Bắt đầu phiên', category: 'system' },
        'first_visit': { label: 'Lần đầu truy cập', category: 'system' },
        'form_start': { label: 'Bắt đầu gõ form', category: 'system' }
    };

    const events = response.rows?.map(row => {
      const name = row.dimensionValues?.[0]?.value || "Unknown";
      const count = parseInt(row.metricValues?.[0]?.value || '0', 10);
      
      const mapping = EVENT_MAP[name] || { label: name, category: 'other' };
      
      return { eventName: mapping.label, originalName: name, count, category: mapping.category };
    }).filter(ev => ev.category !== 'system')
    .sort((a, b) => {
        if (a.category === 'conversion' && b.category !== 'conversion') return -1;
        if (a.category !== 'conversion' && b.category === 'conversion') return 1;
        return b.count - a.count;
    }) || [];

    return NextResponse.json({ events });
  } catch (error) {
    console.error("Lỗi API Events:", error);
    return NextResponse.json({ error: 'Lỗi tải dữ liệu' }, { status: 500 });
  }
}