import { BetaAnalyticsDataClient } from '@google-analytics/data';
import dotenv from 'dotenv';
dotenv.config({ path: './.env.local' });

const client = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
});

const propertyId = process.env.GA4_PROPERTY_ID;

async function test() {
  console.log("Property ID:", propertyId);
  try {
    const [response] = await client.runRealtimeReport({
      property: `properties/${propertyId}`,
      metrics: [{ name: 'activeUsers' }],
    });
    console.log("Success:", response.rows);
  } catch (error: any) {
    console.log("Error Status:", error.code);
    console.log("Error Details:", error.details);
    console.log("Full Error:", error);
  }
}

test();
