/**
 * HBD Foundation — Reloadly Integration Service
 * Rails: GIFTCARD_BRAND & MOBILE_CONNECTIVITY
 * Supports 160+ countries: Amazon, Apple, Steam, PlayStation, Spotify + Mobile Airtime/Data
 */

interface ReloadlyTokenCache {
  accessToken: string;
  expiresAt: number;
}

let giftCardTokenCache: ReloadlyTokenCache | null = null;
let topupsTokenCache: ReloadlyTokenCache | null = null;

const CLIENT_ID = process.env.RELOADLY_CLIENT_ID || '';
const CLIENT_SECRET = process.env.RELOADLY_CLIENT_SECRET || '';
const IS_SANDBOX = process.env.RELOADLY_SANDBOX !== 'false';

const AUTH_URL = 'https://auth.reloadly.com/oauth/token';
const GIFTCARDS_BASE_URL = IS_SANDBOX
  ? 'https://giftcards-sandbox.reloadly.com'
  : 'https://giftcards.reloadly.com';
const TOPUPS_BASE_URL = IS_SANDBOX
  ? 'https://topups-sandbox.reloadly.com'
  : 'https://topups.reloadly.com';

/**
 * Fetch OAuth2 Bearer token for given Reloadly service audience
 */
async function getAccessToken(audience: string, cacheRef: 'giftcards' | 'topups'): Promise<string | null> {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    return null;
  }

  const cache = cacheRef === 'giftcards' ? giftCardTokenCache : topupsTokenCache;
  const now = Date.now();

  if (cache && cache.expiresAt > now + 60000) {
    return cache.accessToken;
  }

  try {
    const res = await fetch(AUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'client_credentials',
        audience
      })
    });

    if (!res.ok) {
      console.error(`Reloadly Auth error for ${cacheRef}:`, res.status, res.statusText);
      return null;
    }

    const data: any = await res.json();
    const newCache: ReloadlyTokenCache = {
      accessToken: data.access_token,
      expiresAt: now + (data.expires_in * 1000)
    };

    if (cacheRef === 'giftcards') giftCardTokenCache = newCache;
    else topupsTokenCache = newCache;

    return data.access_token;
  } catch (err: any) {
    console.error(`Reloadly Auth exception (${cacheRef}):`, err.message);
    return null;
  }
}

/**
 * Get Gift Card Catalog Products from Reloadly (Sandbox: 2,900+ brands)
 */
export async function getReloadlyGiftCards(countryCode?: string, size = 15) {
  const token = await getAccessToken(GIFTCARDS_BASE_URL, 'giftcards');
  if (!token) return [];

  try {
    const query = new URLSearchParams({ size: String(size), page: '1' });
    if (countryCode && countryCode !== 'GLOBAL') {
      query.append('countryCode', countryCode);
    }

    const res = await fetch(`${GIFTCARDS_BASE_URL}/products?${query.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/com.reloadly.giftcards-v1+json'
      }
    });

    if (!res.ok) return [];

    const json: any = await res.json();
    return json.content || [];
  } catch (err: any) {
    console.error('Reloadly getGiftCards error:', err.message);
    return [];
  }
}

/**
 * Order a digital gift card from Reloadly in real-time
 */
export async function orderReloadlyGiftCard(params: {
  productId: number;
  unitPrice: number;
  recipientEmail?: string;
  recipientName?: string;
}) {
  const token = await getAccessToken(GIFTCARDS_BASE_URL, 'giftcards');
  if (!token) {
    return null;
  }

  try {
    const customIdentifier = `HBD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const res = await fetch(`${GIFTCARDS_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/com.reloadly.giftcards-v1+json'
      },
      body: JSON.stringify({
        productId: params.productId,
        unitPrice: params.unitPrice,
        quantity: 1,
        customIdentifier,
        recipientEmail: params.recipientEmail || 'celebrant@hbdays.app',
        recipientName: params.recipientName || 'HBD Celebrant'
      })
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error('Reloadly order error:', res.status, errBody);
      return null;
    }

    const json: any = await res.json();
    return json;
  } catch (err: any) {
    console.error('Reloadly order exception:', err.message);
    return null;
  }
}
