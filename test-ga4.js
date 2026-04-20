const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const fs = require('fs');

const env = fs.readFileSync('./.env.local', 'utf8')
  .split('\n')
  .reduce((acc, line) => {
    const [key, ...val] = line.split('=');
    if (key && val) acc[key.trim()] = val.join('=').trim().replace(/^"(.*)"$/, '$1');
    return acc;
  }, {});

const client = new BetaAnalyticsDataClient({
  credentials: {
    client_email: env.GOOGLE_CLIENT_EMAIL,
    private_key: env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
});
const propertyId = env.GA4_PROPERTY_ID;

async function runTest() {
  const dims = ['country', 'city', 'unifiedScreenName', 'operatingSystem', 'browser'];
  for (const d of dims) {
      console.log(`\nTesting: ${d}`);
      try {
        const [response] = await client.runRealtimeReport({
          property: `properties/${propertyId}`,
          dimensions: [{ name: d }],
          metrics: [{ name: 'activeUsers' }],
        });
        console.log(`Success:`, (response.rows || []).length);
      } catch (e) {
        console.log(`Fail:`, e.message);
      }
  }
}
runTest();
