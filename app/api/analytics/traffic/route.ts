import { analyticsClient, propertyId } from '@/lib/ga4';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Lấy ngày từ URL (Ví dụ: ?startDate=2024-01-01&endDate=today)
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate') || '30daysAgo';
    const endDate = searchParams.get('endDate') || 'today';

    const [response] = await analyticsClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'date' }], // Lấy theo từng ngày
      metrics: [
        { name: 'sessions' }, // Lượt truy cập
        { name: 'screenPageViews' } // Lượt xem trang
      ],
    });

    // Format lại dữ liệu cho Frontend dễ dùng
    const data = response.rows?.map(row => {
      const rawDate = row.dimensionValues?.[0]?.value || "";
      return {
        date: `${rawDate.slice(6,8)}/${rawDate.slice(4,6)}/${rawDate.slice(0,4)}`,
        sessions: parseInt(row.metricValues?.[0]?.value || '0', 10),
        views: parseInt(row.metricValues?.[1]?.value || '0', 10)
      };
    }) || [];

    // Sắp xếp ngày từ cũ đến mới
    data.sort((a, b) => {
        const [d1, m1, y1] = a.date.split('/');
        const [d2, m2, y2] = b.date.split('/');
        return new Date(`${y1}-${m1}-${d1}`).getTime() - new Date(`${y2}-${m2}-${d2}`).getTime();
    });

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Lỗi API Traffic:", error);
    return NextResponse.json({ error: 'Lỗi tải dữ liệu' }, { status: 500 });
  }
}