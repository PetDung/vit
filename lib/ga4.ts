import { BetaAnalyticsDataClient } from '@google-analytics/data';

// Khởi tạo Client duy nhất
export const analyticsClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
});

export const propertyId = process.env.GA4_PROPERTY_ID;