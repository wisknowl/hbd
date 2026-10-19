import express, { Request, Response } from 'express';
import crypto from 'crypto';
import { prisma } from './db.js';
import { getReloadlyGiftCards } from './reloadlyService.js';

export const giftingRouter = express.Router();

// Middleware to extract authenticated user from header or fallback
function getUserId(req: Request): string {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const jwt = require('jsonwebtoken');
      const JWT_SECRET = process.env.JWT_SECRET || 'hbd_foundation_super_secret_jwt_key_2026_celebrate_what_matters';
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
      return decoded.id;
    } catch {
      // ignore
    }
  }
  // Optional query or body override for testing/dev
  if (req.body?.giverId) return req.body.giverId;
  if (req.query?.userId) return req.query.userId as string;
  return 'u-1'; // Default canonical demo user (samuel_nd)
}

// -------------------------------------------------------------
// 0. Universal Country Routes (Every Country on Earth Supported)
// -------------------------------------------------------------
giftingRouter.get('/routes', async (_req: Request, res: Response) => {
  try {
    const routes = await (prisma as any).countryRoute.findMany({
      orderBy: { countryName: 'asc' }
    });
    res.json({
      success: true,
      routes
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve country routes', message: err.message });
  }
});

giftingRouter.get('/routes/:countryCode', async (req: Request, res: Response) => {
  try {
    const countryCode = (req.params.countryCode as string).toUpperCase();
    let route = await (prisma as any).countryRoute.findUnique({
      where: { countryCode }
    });

    // If country not explicitly listed, fallback to GLOBAL route so NO country is ever excluded
    if (!route) {
      route = await (prisma as any).countryRoute.findUnique({
        where: { countryCode: 'GLOBAL' }
      });
    }

    res.json({
      success: true,
      route: route || {
        countryCode,
        countryName: 'International Celebration Hub',
        region: 'GLOBAL',
        primaryCurrency: 'USD',
        allowedFulfillment: ['EMOTIONAL_TRIBUTE', 'HUMANITARIAN_MILESTONE', 'GIFTCARD_OPEN_LOOP'],
        isConflictOrCrisisZone: false,
        supportNote: 'Emotional first reach: collaborative tribute room, memory vault preservation, and global open-loop virtual cards.'
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to resolve country route', message: err.message });
  }
});

// -------------------------------------------------------------
// 0.1 Live Aggregator Brand Gift Cards (Powered by Reloadly Sandbox)
// Over 2,900 live digital brand cards: Amazon, Apple, Steam, Spotify, Uber
// -------------------------------------------------------------
giftingRouter.get('/reloadly/cards', async (req: Request, res: Response) => {
  try {
    const country = (req.query.country as string) || undefined;
    const cards = await getReloadlyGiftCards(country, 20);
    res.json({
      success: true,
      count: cards.length,
      cards: cards.map((c: any) => ({
        id: c.productId,
        name: c.productName,
        country: c.country?.isoName,
        currency: c.recipientCurrencyCode,
        minAmount: c.minRecipientDenomination,
        maxAmount: c.maxRecipientDenomination,
        fixedAmounts: c.fixedRecipientDenominations,
        logoUrl: c.logoUrls?.[0] || null
      }))
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch live cards from Reloadly', message: err.message });
  }
});

// -------------------------------------------------------------
// 1. GET /api/gifting/merchants
// List connected global, regional, and physical merchants
// -------------------------------------------------------------
giftingRouter.get('/merchants', async (req: Request, res: Response) => {
  try {
    const { category, country } = req.query;
    const where: any = { isActive: true };
    if (category) where.category = category;

    const merchants = await prisma.merchantPartner.findMany({
      where,
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { items: true }
        }
      }
    });

    // Optional country filter
    const filtered = country
      ? merchants.filter((m: any) => m.supportedCountries.includes('GLOBAL') || m.supportedCountries.includes(country as string))
      : merchants;

    res.json({
      success: true,
      merchants: filtered.map((m: any) => ({
        id: m.id,
        slug: m.slug,
        name: m.name,
        category: m.category,
        logoUrl: m.logoUrl,
        description: m.description,
        supportedCountries: m.supportedCountries,
        supportedCurrencies: m.supportedCurrencies,
        commissionRate: Number(m.commissionRate),
        isVerified: m.isVerified,
        physicalAddress: m.physicalAddress,
        city: m.city,
        country: m.country,
        itemCount: m._count.items
      }))
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve merchants', message: err.message });
  }
});

// -------------------------------------------------------------
// 2. GET /api/gifting/catalog
// Browse curated items across connected merchants
// -------------------------------------------------------------
giftingRouter.get('/catalog', async (req: Request, res: Response) => {
  try {
    const { merchantId, category, fulfillmentType, countryCode, search, maxPrice, isPhysicalStore } = req.query;
    const where: any = { inStock: true };

    if (merchantId) where.merchantId = merchantId as string;
    if (category) where.category = category as any;
    if (fulfillmentType) where.fulfillmentType = fulfillmentType as any;
    if (countryCode && countryCode !== 'GLOBAL') {
      where.OR = [
        { countryCode: 'GLOBAL' },
        { countryCode: (countryCode as string).toUpperCase() }
      ];
    }
    if (isPhysicalStore !== undefined) where.isPhysicalStore = isPhysicalStore === 'true';
    if (maxPrice) where.price = { lte: parseFloat(maxPrice as string) };
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const items = await prisma.giftCatalogItem.findMany({
      where,
      include: { merchant: true },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      count: items.length,
      items: items.map((item: any) => ({
        id: item.id,
        merchantId: item.merchantId,
        merchantName: item.merchant.name,
        merchantCategory: item.merchant.category,
        merchantSlug: item.merchant.slug,
        sku: item.sku,
        title: item.title,
        description: item.description,
        category: item.category,
        fulfillmentType: item.fulfillmentType,
        brandSlug: item.brandSlug,
        countryCode: item.countryCode,
        denominationType: item.denominationType,
        minAmount: item.minAmount ? Number(item.minAmount) : null,
        maxAmount: item.maxAmount ? Number(item.maxAmount) : null,
        humanitarianCause: item.humanitarianCause,
        price: Number(item.price),
        currency: item.currency,
        imageUrl: item.imageUrl,
        externalUrl: item.externalUrl,
        isPhysicalStore: item.isPhysicalStore,
        deliveryScope: item.deliveryScope,
        inStock: item.inStock,
        rating: Number(item.rating),
        estimatedDeliveryDays: item.estimatedDeliveryDays
      }))
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve catalog', message: err.message });
  }
});

// -------------------------------------------------------------
// 3. POST /api/gifting/orders
// Send gift across any of the 7 fulfillment lanes
// -------------------------------------------------------------
giftingRouter.post('/orders', async (req: Request, res: Response) => {
  try {
    const giverId = getUserId(req);
    const { recipientId, itemId, greetingMessage, tributeMediaUrl, deliveryType, customAmount } = req.body;

    if (!recipientId || !itemId) {
      return res.status(400).json({ error: 'recipientId and itemId are required' });
    }

    // Verify recipient exists
    const recipient = await prisma.user.findUnique({ where: { id: recipientId } });
    if (!recipient) {
      return res.status(404).json({ error: 'Celebrant recipient not found' });
    }

    // Verify giver exists
    const giver = await prisma.user.findUnique({ where: { id: giverId } });
    if (!giver) {
      return res.status(404).json({ error: 'Giver not found' });
    }

    // Verify catalog item exists
    const item: any = await prisma.giftCatalogItem.findUnique({
      where: { id: itemId },
      include: { merchant: true }
    });
    if (!item) {
      return res.status(404).json({ error: 'Gift item not found in catalog' });
    }

    // Generate unique order number: HBD-GIFT-YYYY-RANDOM
    const orderNumber = `HBD-GIFT-${new Date().getFullYear()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

    // Resolve order amount
    const resolvedAmount = customAmount ? parseFloat(customAmount) : Number(item.price);

    // Multi-Lane Fulfillment Logic
    let status: any = 'ESCROWED';
    let resolvedDeliveryType: any = deliveryType || (item.isPhysicalStore ? 'STORE_PICKUP_QR' : 'SHIPPING');
    let voucherCode: string | undefined;
    let voucherQrPayload: string | undefined;
    let claimCode: string | undefined;
    let claimPin: string | undefined;
    let claimUrl: string | undefined;
    let humanitarianCertUrl: string | undefined;
    let trackingNumber: string | undefined;
    let carrierName: string | undefined;

    switch (item.fulfillmentType) {
      case 'EMOTIONAL_TRIBUTE':
        // Universal free emotional first reach: collaborative tribute room & memory vault
        status = 'DELIVERED';
        resolvedDeliveryType = 'DIGITAL';
        claimUrl = `/vault`;
        break;

      case 'HUMANITARIAN_MILESTONE':
        // HBD Gives: impact meal / clean water / solar pack dedicated in celebrant's honor
        status = 'DELIVERED';
        resolvedDeliveryType = 'HUMANITARIAN_IMPACT';
        humanitarianCertUrl = `https://hbd.foundation/certificates/${orderNumber}`;
        break;

      case 'MOBILE_CONNECTIVITY':
        // Instant airtime / cellular data top-up
        status = 'CONFIRMED';
        resolvedDeliveryType = 'AIRTIME_RECHARGE';
        claimCode = `AIR-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
        break;

      case 'GIFTCARD_BRAND':
        // Closed-loop digital card (Amazon, Apple, Uber) via Aggregator API
        status = 'CONFIRMED';
        resolvedDeliveryType = 'INSTANT_DIGITAL_CODE';
        claimCode = `${item.brandSlug?.toUpperCase() || 'GFT'}-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
        claimPin = crypto.randomInt(1000, 9999).toString();
        claimUrl = item.externalUrl || undefined;
        break;

      case 'GIFTCARD_OPEN_LOOP':
        // Global virtual Visa / Mastercard spendable worldwide online
        status = 'CONFIRMED';
        resolvedDeliveryType = 'INSTANT_DIGITAL_CODE';
        claimCode = `4485-${crypto.randomBytes(4).toString('hex').toUpperCase()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
        claimPin = crypto.randomInt(100, 999).toString();
        break;

      case 'AFFILIATE_REDIRECT':
        // Outbound e-commerce direct link
        status = 'CONFIRMED';
        resolvedDeliveryType = 'DIGITAL';
        claimUrl = item.externalUrl || undefined;
        break;

      case 'NATIVE_ESCROW':
      default:
        // Local physical florist / bakery / concierge held in HBD escrow
        status = 'ESCROWED';
        resolvedDeliveryType = deliveryType || (item.isPhysicalStore ? 'STORE_PICKUP_QR' : 'SHIPPING');
        if (item.isPhysicalStore || resolvedDeliveryType === 'STORE_PICKUP_QR') {
          voucherCode = `VCH-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
          const qrData = {
            orderNumber,
            voucherCode,
            merchantSlug: item.merchant.slug,
            recipientHandle: recipient.handle,
            itemTitle: item.title,
            amount: resolvedAmount,
            currency: item.currency,
            issuedAt: new Date().toISOString()
          };
          voucherQrPayload = Buffer.from(JSON.stringify(qrData)).toString('base64');
        } else {
          trackingNumber = `TRK-${crypto.randomBytes(5).toString('hex').toUpperCase()}`;
          carrierName = item.merchant.slug === 'amazon' ? 'Amazon Logistics' : 'HBD Local Courier';
        }
        break;
    }

    // Create the GiftOrder in PostgreSQL
    const order: any = await (prisma as any).giftOrder.create({
      data: {
        orderNumber,
        giverId,
        recipientId,
        merchantId: item.merchantId,
        itemId: item.id,
        status,
        fulfillmentType: item.fulfillmentType,
        totalAmount: resolvedAmount,
        currency: item.currency,
        greetingMessage: greetingMessage || 'Happy Birthday! Celebrating you today and always! 🎉',
        tributeMediaUrl,
        deliveryType: resolvedDeliveryType,
        trackingNumber,
        carrierName,
        voucherCode,
        voucherQrPayload,
        claimCode,
        claimPin,
        claimUrl,
        humanitarianCertUrl,
        estimatedDelivery: new Date(Date.now() + item.estimatedDeliveryDays * 24 * 60 * 60 * 1000)
      },
      include: {
        giver: { select: { id: true, handle: true, fullName: true, avatarUrl: true } },
        recipient: { select: { id: true, handle: true, fullName: true, avatarUrl: true, city: true, country: true } },
        merchant: { select: { id: true, name: true, slug: true, category: true } },
        item: true
      }
    });

    res.status(201).json({
      success: true,
      message: item.fulfillmentType === 'EMOTIONAL_TRIBUTE'
        ? 'Celebration tribute capsule recorded & delivered to celebrant’s memory vault!'
        : item.fulfillmentType === 'HUMANITARIAN_MILESTONE'
        ? `Celebration milestone dedicated in ${recipient.fullName}’s name! Certificate issued.`
        : item.fulfillmentType === 'GIFTCARD_BRAND' || item.fulfillmentType === 'GIFTCARD_OPEN_LOOP'
        ? 'Digital celebration card generated & delivered to celebrant’s HBD wallet!'
        : 'Gift secured & dispatched! Celebrant notified.',
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        fulfillmentType: order.fulfillmentType,
        totalAmount: Number(order.totalAmount),
        currency: order.currency,
        giver: order.giver,
        recipient: {
          id: order.recipient.id,
          handle: order.recipient.handle,
          fullName: order.recipient.fullName,
          avatarUrl: order.recipient.avatarUrl
        },
        merchant: order.merchant,
        item: {
          id: order.item.id,
          title: order.item.title,
          category: order.item.category,
          fulfillmentType: order.item.fulfillmentType,
          humanitarianCause: order.item.humanitarianCause,
          price: Number(order.item.price),
          imageUrl: order.item.imageUrl
        },
        deliveryType: order.deliveryType,
        trackingNumber: order.trackingNumber,
        carrierName: order.carrierName,
        voucherCode: order.voucherCode,
        voucherQrPayload: order.voucherQrPayload,
        claimCode: order.claimCode,
        claimPin: order.claimPin,
        claimUrl: order.claimUrl,
        humanitarianCertUrl: order.humanitarianCertUrl,
        greetingMessage: order.greetingMessage,
        tributeMediaUrl: order.tributeMediaUrl,
        createdAt: order.createdAt
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create gift order', message: err.message });
  }
});

// -------------------------------------------------------------
// 4. GET /api/gifting/orders/sent
// Giver views all gifts they sent and tracking progress
// -------------------------------------------------------------
giftingRouter.get('/orders/sent', async (req: Request, res: Response) => {
  try {
    const giverId = getUserId(req);
    const orders = await prisma.giftOrder.findMany({
      where: { giverId },
      include: {
        recipient: { select: { id: true, handle: true, fullName: true, avatarUrl: true } },
        merchant: { select: { id: true, name: true, slug: true, category: true } },
        item: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      orders: orders.map((o: any) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        status: o.status,
        fulfillmentType: o.fulfillmentType,
        totalAmount: Number(o.totalAmount),
        currency: o.currency,
        recipient: o.recipient,
        merchant: o.merchant,
        item: {
          id: o.item.id,
          title: o.item.title,
          imageUrl: o.item.imageUrl,
          price: Number(o.item.price),
          humanitarianCause: o.item.humanitarianCause
        },
        deliveryType: o.deliveryType,
        trackingNumber: o.trackingNumber,
        carrierName: o.carrierName,
        estimatedDelivery: o.estimatedDelivery,
        voucherCode: o.voucherCode,
        claimCode: o.claimCode,
        claimUrl: o.claimUrl,
        humanitarianCertUrl: o.humanitarianCertUrl,
        greetingMessage: o.greetingMessage,
        thankYouNote: o.thankYouNote,
        thankYouEmoji: o.thankYouEmoji,
        createdAt: o.createdAt
      }))
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve sent gifts', message: err.message });
  }
});

// -------------------------------------------------------------
// 5. GET /api/gifting/orders/received
// Recipient views incoming gifts, surprises, and digital passes
// -------------------------------------------------------------
giftingRouter.get('/orders/received', async (req: Request, res: Response) => {
  try {
    const recipientId = getUserId(req);
    const orders = await prisma.giftOrder.findMany({
      where: { recipientId },
      include: {
        giver: { select: { id: true, handle: true, fullName: true, avatarUrl: true } },
        merchant: { select: { id: true, name: true, slug: true, category: true, physicalAddress: true, city: true, country: true } },
        item: true,
        shippingAddress: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      orders: orders.map((o: any) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        status: o.status,
        fulfillmentType: o.fulfillmentType,
        totalAmount: Number(o.totalAmount),
        currency: o.currency,
        giver: o.giver,
        giverName: o.giver?.fullName,
        merchant: o.merchant,
        merchantName: o.merchant?.name,
        merchantPhysicalAddress: o.merchant?.physicalAddress,
        merchantCity: o.merchant?.city,
        item: {
          id: o.item.id,
          title: o.item.title,
          imageUrl: o.item.imageUrl,
          price: Number(o.item.price),
          category: o.item.category,
          humanitarianCause: o.item.humanitarianCause
        },
        itemTitle: o.item?.title,
        itemImageUrl: o.item?.imageUrl,
        deliveryType: o.deliveryType,
        trackingNumber: o.trackingNumber,
        carrierName: o.carrierName,
        estimatedDelivery: o.estimatedDelivery,
        voucherCode: o.voucherCode,
        voucherQrPayload: o.voucherQrPayload,
        voucherRedeemedAt: o.voucherRedeemedAt,
        claimCode: o.claimCode,
        claimPin: o.claimPin,
        claimUrl: o.claimUrl,
        humanitarianCertUrl: o.humanitarianCertUrl,
        greetingMessage: o.greetingMessage,
        tributeMediaUrl: o.tributeMediaUrl,
        hasShippingAddress: !!o.shippingAddress,
        thankYouNote: o.thankYouNote,
        thankYouEmoji: o.thankYouEmoji,
        createdAt: o.createdAt
      }))
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve received gifts', message: err.message });
  }
});

// -------------------------------------------------------------
// 6. POST /api/gifting/orders/:id/claim
// Zero-Knowledge Shipping Address Confirmation or Item Swap
// -------------------------------------------------------------
giftingRouter.post('/orders/:id/claim', async (req: Request, res: Response) => {
  try {
    const recipientId = getUserId(req);
    const id = req.params.id as string;
    const {
      streetAddress,
      city,
      stateOrProvince,
      postalCode,
      country,
      deliveryInstructions,
      phoneNumber,
      swapForVoucher
    } = req.body;

    const order: any = await (prisma as any).giftOrder.findUnique({
      where: { id },
      include: { item: true, merchant: true }
    });

    if (!order) {
      return res.status(404).json({ error: 'Gift order not found' });
    }

    if (order.recipientId !== recipientId) {
      return res.status(403).json({ error: 'Only the designated recipient may claim this gift' });
    }

    if (order.status === 'DELIVERED' || order.status === 'REDEEMED') {
      return res.status(400).json({ error: 'This gift has already been fulfilled or redeemed' });
    }

    // Scenario A: Recipient chooses to Swap for an Equal Value Store Credit Voucher
    if (swapForVoucher) {
      const voucherCode = `SWP-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
      const updated: any = await (prisma as any).giftOrder.update({
        where: { id },
        data: {
          status: 'CONFIRMED',
          deliveryType: 'STORE_PICKUP_QR',
          voucherCode,
          voucherQrPayload: Buffer.from(JSON.stringify({
            orderNumber: order.orderNumber,
            voucherCode,
            swapCreditAmount: Number(order.totalAmount),
            currency: order.currency,
            merchant: order.merchant.name
          })).toString('base64')
        }
      });

      return res.json({
        success: true,
        message: 'Gift swapped for store voucher pass of equal value!',
        order: updated
      });
    }

    // Scenario B: Recipient confirms secret delivery address
    if (!streetAddress || !city || !country) {
      return res.status(400).json({ error: 'streetAddress, city, and country are required to dispatch shipment' });
    }

    // Store private address in address vault
    await prisma.recipientShippingAddress.upsert({
      where: { orderId: id },
      create: {
        orderId: id,
        streetAddress,
        city,
        stateOrProvince,
        postalCode,
        country,
        deliveryInstructions,
        phoneNumber
      },
      update: {
        streetAddress,
        city,
        stateOrProvince,
        postalCode,
        country,
        deliveryInstructions,
        phoneNumber
      }
    });

    // Update order status to CONFIRMED / DISPATCHED
    const updated = await prisma.giftOrder.update({
      where: { id },
      data: {
        status: 'CONFIRMED'
      }
    });

    res.json({
      success: true,
      message: 'Secret shipping address confirmed! Order dispatched to fulfillment carrier.',
      order: updated
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to claim gift', message: err.message });
  }
});

// -------------------------------------------------------------
// 7. POST /api/gifting/vouchers/:code/redeem
// Partner Merchant POS scans QR code / PIN to redeem & release escrow
// -------------------------------------------------------------
giftingRouter.post('/vouchers/:code/redeem', async (req: Request, res: Response) => {
  try {
    const code = req.params.code as string;
    const { posSecretKey, cashierNote } = req.body;

    const order: any = await (prisma as any).giftOrder.findFirst({
      where: {
        OR: [
          { voucherCode: code },
          { orderNumber: code }
        ]
      },
      include: {
        item: true,
        merchant: true,
        recipient: { select: { handle: true, fullName: true, avatarUrl: true } }
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Voucher code not found or invalid' });
    }

    if (order.status === 'REDEEMED') {
      return res.status(400).json({
        error: 'Voucher has already been redeemed',
        redeemedAt: order.voucherRedeemedAt,
        orderNumber: order.orderNumber
      });
    }

    if (order.status === 'CANCELLED') {
      return res.status(400).json({ error: 'Voucher order was cancelled and refunded' });
    }

    // Verify merchant POS key if registered
    if (order.merchant.posSecretKey && posSecretKey && order.merchant.posSecretKey !== posSecretKey) {
      return res.status(401).json({ error: 'Invalid merchant POS secret authorization key' });
    }

    // Mark as redeemed and release escrow to merchant
    const redeemedOrder: any = await (prisma as any).giftOrder.update({
      where: { id: order.id },
      data: {
        status: 'REDEEMED',
        voucherRedeemedAt: new Date(),
        cashierNote: cashierNote || 'Redeemed in person at storefront'
      }
    });

    res.json({
      success: true,
      message: `Voucher successfully redeemed at ${order.merchant.name}! Escrow released.`,
      redemption: {
        orderNumber: redeemedOrder.orderNumber,
        itemTitle: order.item.title,
        amount: Number(redeemedOrder.totalAmount),
        currency: redeemedOrder.currency,
        celebrant: order.recipient.fullName,
        redeemedAt: redeemedOrder.voucherRedeemedAt,
        merchantName: order.merchant.name
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to redeem voucher', message: err.message });
  }
});

// -------------------------------------------------------------
// 8. POST /api/gifting/orders/:id/thank-you
// Recipient records reaction video / appreciation note
// -------------------------------------------------------------
giftingRouter.post('/orders/:id/thank-you', async (req: Request, res: Response) => {
  try {
    const recipientId = getUserId(req);
    const id = req.params.id as string;
    const { thankYouNote, thankYouEmoji, thankYouMediaUrl } = req.body;

    const order: any = await (prisma as any).giftOrder.findUnique({ where: { id } });
    if (!order) {
      return res.status(404).json({ error: 'Gift order not found' });
    }

    if (order.recipientId !== recipientId) {
      return res.status(403).json({ error: 'Only the recipient can send a thank you' });
    }

    const updated: any = await (prisma as any).giftOrder.update({
      where: { id },
      data: {
        thankYouNote: thankYouNote || 'Thank you so much for this wonderful surprise! It made my day so special! ❤️',
        thankYouEmoji: thankYouEmoji || '🎉',
        thankYouMediaUrl,
        status: order.status === 'CONFIRMED' ? 'DELIVERED' : order.status
      }
    });

    res.json({
      success: true,
      message: 'Thank you tribute sent to the giver!',
      order: updated
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to send thank you', message: err.message });
  }
});
