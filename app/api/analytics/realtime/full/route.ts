import { analyticsClient, propertyId } from '@/lib/ga4';
import { NextResponse } from 'next/server';
import { EVENT_MAP } from '@/type';

export const dynamic = 'force-dynamic';

// Khai báo Type đầy đủ
type TimelineData = { minute: number; users: number };
type PageData = { path: string; users: number };
type DeviceData = { category: string; users: number };
type EventData = { name: string; originalName: string; count: number; category: string };

export async function GET() {
  if (!propertyId) {
    console.error("Missing GA4_PROPERTY_ID");
    return NextResponse.json({ error: 'Thiếu Property ID' }, { status: 500 });
  }

  try {
    const baseReq = { property: `properties/${propertyId}` };

    const [minutesReport, pagesReport, devicesReport, eventsReport] = await Promise.all([
      analyticsClient.runRealtimeReport({
        ...baseReq,
        dimensions: [{ name: 'minutesAgo' }],
        metrics: [{ name: 'activeUsers' }],
      }).catch(e => { console.error("GA4 Timeline Error:", e); return [null]; }),

      analyticsClient.runRealtimeReport({
        ...baseReq,
        dimensions: [{ name: 'unifiedScreenName' }],
        metrics: [{ name: 'activeUsers' }],
      }).catch(e => { console.error("GA4 Pages Error:", e); return [null]; }),

      analyticsClient.runRealtimeReport({
        ...baseReq,
        dimensions: [{ name: 'deviceCategory' }],
        metrics: [{ name: 'activeUsers' }],
      }).catch(e => { console.error("GA4 Devices Error:", e); return [null]; }),

      analyticsClient.runRealtimeReport({
        ...baseReq,
        dimensions: [{ name: 'eventName' }],
        metrics: [{ name: 'eventCount' }],
      }).catch(e => { console.error("GA4 Events Error:", e); return [null]; })
    ]);

    // 1. XỬ LÝ TIMELINE
    const timeline: TimelineData[] = Array.from({ length: 30 }, (_, i) => ({ minute: i, users: 0 }));
    if (minutesReport?.[0]?.rows) {
      minutesReport[0].rows.forEach(row => {
        const min = parseInt(row.dimensionValues?.[0]?.value || '0', 10);
        const val = parseInt(row.metricValues?.[0]?.value || '0', 10);
        if (min >= 0 && min < 30) timeline[min].users = val;
      });
    }

    // 2. XỬ LÝ PAGES (Top 5 trang)
    const pages: PageData[] = pagesReport?.[0]?.rows?.map(row => ({
      path: row.dimensionValues?.[0]?.value || "/",
      users: parseInt(row.metricValues?.[0]?.value || '0', 10)
    })).sort((a, b) => b.users - a.users).slice(0, 5) || [];

    // 3. XỬ LÝ DEVICES
    const devices: DeviceData[] = devicesReport?.[0]?.rows?.map(row => ({
      category: row.dimensionValues?.[0]?.value || "Unknown",
      users: parseInt(row.metricValues?.[0]?.value || '0', 10)
    })).sort((a, b) => b.users - a.users) || [];

    const totalActive = devices.reduce((sum, d) => sum + d.users, 0);

    // 4. XỬ LÝ EVENTS (Lọc & Dịch)

    let events: EventData[] = [];
    if (eventsReport?.[0]?.rows) {
      events = eventsReport[0].rows
        .map(row => {
          const name = row.dimensionValues?.[0]?.value || "Unknown";
          const count = parseInt(row.metricValues?.[0]?.value || '0', 10);

          let mapping = EVENT_MAP[name];

          if (name.startsWith("view_item")) {
            const productName = name.replace("view_item:", "").replace(/_/g, " ");
            mapping = {
              label: `Xem ${productName}`,
              category: "conversion"
            }
          }
          if (!mapping) return null;

          return {
            name: mapping.label,
            originalName: name,
            count,
            category: mapping.category
          };
        })
        // 1. Loại bỏ các giá trị null (những sự kiện không có trong EVENT_MAP)
        .filter((ev): ev is EventData => ev !== null)
        // 2. Loại bỏ thêm các sự kiện hệ thống nếu bạn muốn (tùy chọn)
        .filter(ev => ev.category !== 'system')
        .sort((a, b) => {
          // Ưu tiên xếp Conversion lên đầu
          if (a.category === 'conversion' && b.category !== 'conversion') return -1;
          if (a.category !== 'conversion' && b.category === 'conversion') return 1;
          return b.count - a.count;
        });
    }

    // 🎯 TRẢ VỀ TOÀN BỘ DATA CHO FRONTEND
    return NextResponse.json({
      totalActive,
      timeline: timeline.reverse(),
      pages,
      devices,
      events
    });

  } catch (error: any) {
    console.error("Lỗi API Realtime Toàn cục:", error);
    return NextResponse.json({ error: 'Lỗi tải dữ liệu GA4', details: error.message }, { status: 500 });
  }
}