import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

export const prisma = new PrismaClient();

export async function seedInitialData() {
  try {
    console.log('🔄 Checking PostgreSQL hbdays_db connection & seeding initial records...');
    
    // Default password for all canonical demo accounts
    const defaultPasswordHash = await bcrypt.hash('password123', 10);

    const canonicalUsers = [
      {
        id: 'u-1',
        handle: 'samuel_nd',
        fullName: 'Samuel Ndamukong',
        email: 'samuel@hbd.foundation',
        passwordHash: defaultPasswordHash,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        city: 'London',
        country: 'United Kingdom',
        birthDay: 24,
        birthMonth: 10,
        birthYear: 1995,
        bio: 'Product architect & celebration enthusiast. Always down for good coffee & heartfelt surprises ✨',
        isVerified: true,
        traditions: ['Universal Secular', 'Christian Heritage', 'Pan-African & Diaspora'],
        showTributes: true,
        wishlist: ['Specialty Coffee Beans', 'Noise Cancelling Headphones', 'Kindle Travel Books', 'Minimalist Gold Watch'],
        avoidList: ['Lilies (allergic)', 'Extreme Sweet Fondant'],
        idols: ['Steve Jobs', 'Nelson Mandela'],
        musicGenres: ['Afrobeats', 'Jazz'],
        animalTypes: ['Dogs'],
        hobbies: ['Tech & Coding', 'Photography'],
        personalGoals: ['Scale HBD Globally', 'Master Acoustic Guitar'],
        preferences: {
          interests: ['Acoustic Music', 'Gourmet Treats', 'Tech'],
          giftWishes: ['Audio equipment', 'Bespoke cakes'],
          avoid: ['Lilies (allergic)'],
          favoriteColor: '#5B2A86'
        },
        privacy: { birthdayVisibility: 'EVERYONE', showAge: false, preferencesVisibleToFriends: true }
      },
      {
        id: 'u-2',
        handle: 'aisha_tech',
        fullName: 'Aisha Bello',
        email: 'aisha@payseed.africa',
        passwordHash: defaultPasswordHash,
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
        city: 'Lagos',
        country: 'Nigeria',
        birthDay: 14,
        birthMonth: 5,
        birthYear: 1997,
        bio: 'Founder at PaySeed. Celebrating ventures, milestones, and brilliant minds across Africa 🚀',
        isVerified: true,
        traditions: ['Islamic Heritage', 'Pan-African & Diaspora'],
        showTributes: true,
        wishlist: ['Smart Ring', 'Artisan Dark Chocolate', 'Mechanical Keyboard'],
        avoidList: ['Peanuts (severe allergy)', 'Plastic souvenirs'],
        idols: ['Wangari Maathai', 'Ada Lovelace'],
        musicGenres: ['Afrobeats', 'Soul'],
        animalTypes: ['Cats'],
        hobbies: ['Reading', 'Travel'],
        personalGoals: ['PaySeed Series A', 'Mentor 50 Female Founders'],
        preferences: {
          interests: ['Smart Ring', 'Artisan Dark Chocolate'],
          avoid: ['Peanuts (severe allergy)'],
          favoriteColor: '#10B981'
        },
        privacy: { birthdayVisibility: 'EVERYONE', showAge: false, preferencesVisibleToFriends: true }
      },
      {
        id: 'u-3',
        handle: 'amina_tariq',
        fullName: 'Amina & Tariq',
        email: 'amina.tariq@gmail.com',
        passwordHash: defaultPasswordHash,
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        city: 'Toronto',
        country: 'Canada',
        birthDay: 18,
        birthMonth: 12,
        birthYear: 1990,
        bio: 'Two decades of journeys, family love, and celebrating every anniversary together 🥂',
        isVerified: true,
        traditions: ['Universal Secular', 'Islamic Heritage'],
        showTributes: true,
        wishlist: ['Vintage Red Wine', 'Scented Candle Set', 'Weekend Cabin Retreat'],
        avoidList: ['Synthetic Perfumes', 'Seafood'],
        idols: ['Miles Davis', 'Maya Angelou'],
        musicGenres: ['Classical', 'Jazz'],
        animalTypes: ['Horses'],
        hobbies: ['Culinary & Baking', 'Gardening'],
        personalGoals: ['Silver Anniversary Journey'],
        preferences: {
          interests: ['Vintage Red Wine', 'Scented Candle Set'],
          avoid: ['Synthetic Perfumes', 'Seafood'],
          favoriteColor: '#E11D48'
        },
        privacy: { birthdayVisibility: 'FRIENDS', showAge: false, preferencesVisibleToFriends: true }
      },
      {
        id: 'u-sarah',
        handle: 'sarah.j',
        fullName: 'Sarah Johnson',
        email: 'sarah@designstudio.co.uk',
        passwordHash: defaultPasswordHash,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        city: 'London',
        country: 'United Kingdom',
        birthDay: 24,
        birthMonth: 10,
        birthYear: 1995,
        bio: 'Product designer · coffee snob · always reading two books at once.',
        isVerified: true,
        traditions: ['Universal Secular'],
        showTributes: true,
        wishlist: ['Personalised gold pendant', 'Jo Malone candle'],
        avoidList: ['Lilies (allergic)'],
        idols: ['Steve Jobs'],
        musicGenres: ['Indie', 'Jazz'],
        animalTypes: ['Dogs'],
        hobbies: ['Reading', 'Photography'],
        personalGoals: ['Lead Design System'],
        preferences: {
          interests: ['Perfume', 'Jewelry', 'Books', 'Coffee'],
          avoid: ['Lilies (allergic)'],
          favoriteColor: '#FF6B6B'
        },
        privacy: { birthdayVisibility: 'EVERYONE', showAge: false, preferencesVisibleToFriends: true }
      },
      {
        id: 'u-david',
        handle: 'davidk',
        fullName: 'David Kouam',
        email: 'david@kouam.dev',
        passwordHash: defaultPasswordHash,
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        city: 'Toronto',
        country: 'Canada',
        birthDay: 4,
        birthMonth: 12,
        birthYear: 1999,
        bio: 'Software engineer. Gym at 6am, PlayStation at 10pm.',
        isVerified: true,
        traditions: ['Universal Secular'],
        showTributes: true,
        wishlist: ['PlayStation Store credit', 'Noise-cancelling earbuds'],
        avoidList: ['Alcohol'],
        idols: ['Nelson Mandela'],
        musicGenres: ['Afrobeats', 'Hip-Hop'],
        animalTypes: ['Dogs'],
        hobbies: ['Tech & Coding', 'Athletics & Running'],
        personalGoals: ['Launch OSS Library'],
        preferences: {
          interests: ['Gaming', 'Tech', 'Sneakers', 'Fitness'],
          avoid: ['Alcohol'],
          favoriteColor: '#1A8F6B'
        },
        privacy: { birthdayVisibility: 'FRIENDS', showAge: true, preferencesVisibleToFriends: true }
      }
    ];

    for (const u of canonicalUsers) {
      await prisma.user.upsert({
        where: { handle: u.handle },
        update: {},
        create: u
      });
    }

    const count = await prisma.user.count();
    console.log(`✅ PostgreSQL hbdays_db ready! Total registered users in database: ${count}`);

    // 1. Seed Universal Country Routes (Every Country Covered: Commercial & Emotional First Reach)
    const countryRoutesData = [
      {
        countryCode: 'GLOBAL',
        countryName: 'Every Country on Earth',
        region: 'GLOBAL',
        primaryCurrency: 'USD',
        allowedFulfillment: ['EMOTIONAL_TRIBUTE', 'HUMANITARIAN_MILESTONE', 'GIFTCARD_OPEN_LOOP'] as any[],
        isConflictOrCrisisZone: false,
        supportNote: 'Universal fallback: Emotional video/voice tributes, humanitarian milestones, and global virtual prepaid cards.'
      },
      {
        countryCode: 'US',
        countryName: 'United States',
        region: 'AMERICAS',
        primaryCurrency: 'USD',
        allowedFulfillment: ['EMOTIONAL_TRIBUTE', 'HUMANITARIAN_MILESTONE', 'GIFTCARD_BRAND', 'GIFTCARD_OPEN_LOOP', 'AFFILIATE_REDIRECT'] as any[],
        isConflictOrCrisisZone: false,
        supportNote: 'Full digital brand cards (Amazon, Apple, Uber) and affiliate redirects.'
      },
      {
        countryCode: 'GB',
        countryName: 'United Kingdom',
        region: 'EUROPE',
        primaryCurrency: 'GBP',
        allowedFulfillment: ['EMOTIONAL_TRIBUTE', 'HUMANITARIAN_MILESTONE', 'GIFTCARD_BRAND', 'GIFTCARD_OPEN_LOOP', 'NATIVE_ESCROW', 'AFFILIATE_REDIRECT'] as any[],
        isConflictOrCrisisZone: false,
        supportNote: 'Amazon UK, London patisseries, high tea venue passes, and open-loop cards.'
      },
      {
        countryCode: 'CM',
        countryName: 'Cameroon',
        region: 'AFRICA',
        primaryCurrency: 'XAF',
        allowedFulfillment: ['EMOTIONAL_TRIBUTE', 'HUMANITARIAN_MILESTONE', 'MOBILE_CONNECTIVITY', 'NATIVE_ESCROW', 'GIFTCARD_OPEN_LOOP'] as any[],
        isConflictOrCrisisZone: false,
        supportNote: 'Douala artisan bakeries, florists, Glotelho collective, and MTN/Orange cellular data top-up.'
      },
      {
        countryCode: 'NG',
        countryName: 'Nigeria',
        region: 'AFRICA',
        primaryCurrency: 'NGN',
        allowedFulfillment: ['EMOTIONAL_TRIBUTE', 'HUMANITARIAN_MILESTONE', 'MOBILE_CONNECTIVITY', 'GIFTCARD_BRAND', 'NATIVE_ESCROW', 'AFFILIATE_REDIRECT'] as any[],
        isConflictOrCrisisZone: false,
        supportNote: 'Lagos luxury florists, Jumia e-commerce, and MTN/Airtel airtime top-up.'
      },
      {
        countryCode: 'UA',
        countryName: 'Ukraine',
        region: 'CONFLICT_OR_FRONTIER',
        primaryCurrency: 'USD',
        allowedFulfillment: ['EMOTIONAL_TRIBUTE', 'HUMANITARIAN_MILESTONE', 'MOBILE_CONNECTIVITY', 'GIFTCARD_OPEN_LOOP'] as any[],
        isConflictOrCrisisZone: true,
        supportNote: 'Emotional first reach: Video & voice tribute capsule, memory vault preservation, emergency family aid milestone, and cellular roaming connectivity.'
      },
      {
        countryCode: 'SD',
        countryName: 'Sudan',
        region: 'CONFLICT_OR_FRONTIER',
        primaryCurrency: 'USD',
        allowedFulfillment: ['EMOTIONAL_TRIBUTE', 'HUMANITARIAN_MILESTONE', 'MOBILE_CONNECTIVITY'] as any[],
        isConflictOrCrisisZone: true,
        supportNote: 'Emotional solidarity tribute capsule, community memory vault, and celebratory hot meal sponsorship for displaced families.'
      },
      {
        countryCode: 'SY',
        countryName: 'Syria',
        region: 'CONFLICT_OR_FRONTIER',
        primaryCurrency: 'USD',
        allowedFulfillment: ['EMOTIONAL_TRIBUTE', 'HUMANITARIAN_MILESTONE', 'MOBILE_CONNECTIVITY'] as any[],
        isConflictOrCrisisZone: true,
        supportNote: 'Zero-commercial barrier: Free digital memory vault, diaspora family voice compilation, and humanitarian aid dedication.'
      },
      {
        countryCode: 'PS',
        countryName: 'Palestine / Gaza',
        region: 'CONFLICT_OR_FRONTIER',
        primaryCurrency: 'USD',
        allowedFulfillment: ['EMOTIONAL_TRIBUTE', 'HUMANITARIAN_MILESTONE', 'MOBILE_CONNECTIVITY'] as any[],
        isConflictOrCrisisZone: true,
        supportNote: 'Emotional first reach: Family voice capsules, digital keepsake vault, eSIM data connection, and warm community meal milestone.'
      }
    ];

    for (const r of countryRoutesData) {
      await (prisma as any).countryRoute.upsert({
        where: { countryCode: r.countryCode },
        update: r,
        create: r
      });
    }

    // 2. Seed Universal Gifting Merchants and Catalog Items
    const merchantsData = [
      {
        slug: 'hbd_humanitarian',
        name: 'HBD Gives & Emotional Solidarity Collective',
        category: 'HUMANITARIAN_PARTNER' as const,
        logoUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=120&q=80',
        description: 'Universal emotional first reach: collaborative tribute capsules, memory preservation, and humanitarian milestones in conflict & frontier zones.',
        supportedCountries: ['GLOBAL', 'UA', 'SD', 'SY', 'PS', 'CM', 'NG', 'US', 'GB'],
        supportedCurrencies: ['USD', 'EUR', 'GBP'],
        commissionRate: 0.00,
        isVerified: true,
        items: [
          {
            sku: 'HBD-EMOTIONAL-CAPSULE',
            title: 'HBD Universal Celebration Capsule & Memory Vault',
            description: 'Emotional first reach: Curated voice notes, tribute video compilation, heartfelt letters, and digital memory preservation that transcends physical borders.',
            category: 'TRIBUTE' as const,
            fulfillmentType: 'EMOTIONAL_TRIBUTE' as const,
            price: 0.00,
            currency: 'USD',
            imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=600&q=80',
            isPhysicalStore: false,
            deliveryScope: 'GLOBAL',
            estimatedDeliveryDays: 0
          },
          {
            sku: 'HBD-GIVES-MEAL-25',
            title: 'HBD Gives — 10 Celebration Warm Meals Dedicated in Celebrant’s Name',
            description: 'Provide 10 nutritious celebratory hot meals to children in displacement or crisis communities. Includes a personalized Certificate of Celebration Dedication.',
            category: 'HUMANITARIAN' as const,
            fulfillmentType: 'HUMANITARIAN_MILESTONE' as const,
            humanitarianCause: '10 Celebration Meals for Displaced Children',
            price: 25.00,
            currency: 'USD',
            imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=600&q=80',
            isPhysicalStore: false,
            deliveryScope: 'GLOBAL',
            estimatedDeliveryDays: 0
          },
          {
            sku: 'HBD-CONNECT-50GB',
            title: 'Lifeline Connectivity: 50GB Cellular Data & Roaming Recharge',
            description: 'Instant mobile top-up delivering reliable cellular data to keep the celebrant connected with loved ones across borders regardless of physical isolation.',
            category: 'CONNECTIVITY' as const,
            fulfillmentType: 'MOBILE_CONNECTIVITY' as const,
            price: 20.00,
            currency: 'USD',
            imageUrl: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=600&q=80',
            isPhysicalStore: false,
            deliveryScope: 'GLOBAL',
            estimatedDeliveryDays: 0
          }
        ]
      },
      {
        slug: 'global_prepaid',
        name: 'Global Open-Loop Virtual Card Network',
        category: 'GIFTCARD_AGGREGATOR' as const,
        logoUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&q=80',
        description: 'Universal prepaid cards spendable online anywhere Visa or Mastercard is accepted globally.',
        supportedCountries: ['GLOBAL', 'US', 'GB', 'CA', 'DE', 'FR', 'NG', 'CM'],
        supportedCurrencies: ['USD', 'EUR', 'GBP'],
        commissionRate: 0.05,
        isVerified: true,
        items: [
          {
            sku: 'CRD-VISA-PREPAID-50',
            title: 'Global Virtual Visa Prepaid Celebration Card ($50 USD)',
            description: 'Universal freedom of choice: Delivered instantly to the celebrant’s HBD Wallet, spendable online at any merchant worldwide accepting Visa.',
            category: 'DIGITAL' as const,
            fulfillmentType: 'GIFTCARD_OPEN_LOOP' as const,
            brandSlug: 'visa',
            price: 50.00,
            currency: 'USD',
            imageUrl: 'https://images.unsplash.com/photo-1589758438368-0ad531db3366?auto=format&fit=crop&w=600&q=80',
            isPhysicalStore: false,
            deliveryScope: 'GLOBAL',
            estimatedDeliveryDays: 0
          }
        ]
      },
      {
        slug: 'brand_giftcards',
        name: 'Digital Brand Card Network (Powered by Aggregator)',
        category: 'GIFTCARD_AGGREGATOR' as const,
        logoUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=120&q=80',
        description: 'Instant digital gift card codes across thousands of leading global brands.',
        supportedCountries: ['US', 'GB', 'CA', 'GLOBAL'],
        supportedCurrencies: ['USD', 'GBP'],
        commissionRate: 0.06,
        isVerified: true,
        items: [
          {
            sku: 'GFT-AMZ-US-50',
            title: 'Amazon.com Digital Gift Card ($50 USD)',
            description: 'Redeemable on Amazon.com for millions of physical books, electronics, home goods, and Kindle literature.',
            category: 'DIGITAL' as const,
            fulfillmentType: 'GIFTCARD_BRAND' as const,
            brandSlug: 'amazon',
            countryCode: 'US',
            denominationType: 'RANGE',
            minAmount: 1.00,
            maxAmount: 500.00,
            price: 50.00,
            currency: 'USD',
            imageUrl: 'https://cdn.reloadly.com/giftcards/fbef9b57-e0b0-4ead-aee3-fdc2bc80e2db.png',
            isPhysicalStore: false,
            deliveryScope: 'US',
            estimatedDeliveryDays: 0
          },
          {
            sku: 'GFT-APL-GLOBAL-30',
            title: 'Apple Gift Card ($30 USD) – Music, Apps & iCloud',
            description: 'Redeemable for Apple Music subscriptions, App Store purchases, iCloud storage, or towards Apple hardware.',
            category: 'DIGITAL' as const,
            fulfillmentType: 'GIFTCARD_BRAND' as const,
            brandSlug: 'apple',
            countryCode: 'GLOBAL',
            denominationType: 'FIXED',
            price: 30.00,
            currency: 'USD',
            imageUrl: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=600&q=80',
            isPhysicalStore: false,
            deliveryScope: 'GLOBAL',
            estimatedDeliveryDays: 0
          },
          {
            sku: 'GFT-STM-US-50',
            title: 'Steam Wallet Card ($50 USD) – PC Gaming & Software',
            description: 'Instant digital wallet code to purchase top PC games, downloadable content, and software on Steam.',
            category: 'DIGITAL' as const,
            fulfillmentType: 'GIFTCARD_BRAND' as const,
            brandSlug: 'steam',
            countryCode: 'GLOBAL',
            denominationType: 'FIXED',
            price: 50.00,
            currency: 'USD',
            imageUrl: 'https://cdn.reloadly.com/giftcards/795088c7-da49-4cfa-a631-e1cc2ff6b089.png',
            isPhysicalStore: false,
            deliveryScope: 'GLOBAL',
            estimatedDeliveryDays: 0
          },
          {
            sku: 'GFT-SPT-US-30',
            title: 'Spotify Premium 3-Month Subscription Card ($30 USD)',
            description: 'Ad-free celebration music, offline listening, and high-fidelity sound streaming for the celebrant.',
            category: 'DIGITAL' as const,
            fulfillmentType: 'GIFTCARD_BRAND' as const,
            brandSlug: 'spotify',
            countryCode: 'GLOBAL',
            denominationType: 'FIXED',
            price: 30.00,
            currency: 'USD',
            imageUrl: 'https://cdn.reloadly.com/giftcards/fb55ff74-1542-491a-a271-0730e5069249.png',
            isPhysicalStore: false,
            deliveryScope: 'GLOBAL',
            estimatedDeliveryDays: 0
          },
          {
            sku: 'GFT-PSN-UK-50',
            title: 'PlayStation Store Digital Card (£50 GBP)',
            description: 'Redeemable on PlayStation Store for PS5/PS4 blockbuster games, season passes, and classics.',
            category: 'DIGITAL' as const,
            fulfillmentType: 'GIFTCARD_BRAND' as const,
            brandSlug: 'playstation',
            countryCode: 'GB',
            denominationType: 'FIXED',
            price: 50.00,
            currency: 'GBP',
            imageUrl: 'https://cdn.reloadly.com/giftcards/d9f35de2-e87d-4697-ab23-fb04f9090931.png',
            isPhysicalStore: false,
            deliveryScope: 'GB',
            estimatedDeliveryDays: 0
          }
        ]
      },
      {
        slug: 'amazon',
        name: 'Amazon Global Store',
        category: 'GLOBAL_ECOMMERCE' as const,
        logoUrl: 'https://images.unsplash.com/photo-1523474255658-4af61b168e67?auto=format&fit=crop&w=120&q=80',
        description: 'Worldwide consumer tech, literature, lifestyle, and global doorstep delivery.',
        supportedCountries: ['GLOBAL', 'US', 'UK', 'CA', 'DE', 'FR'],
        supportedCurrencies: ['USD', 'GBP', 'EUR'],
        commissionRate: 0.06,
        isVerified: true,
        items: [
          {
            sku: 'AMZ-SONY-XM5',
            title: 'Sony WH-1000XM5 Wireless Noise-Cancelling Headphones',
            description: 'Industry-leading noise cancellation, crystal clear hands-free calling, and 30-hour battery life.',
            category: 'TECH' as const,
            fulfillmentType: 'AFFILIATE_REDIRECT' as const,
            price: 349.99,
            currency: 'USD',
            imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
            externalUrl: 'https://www.amazon.com/dp/B09XS7JWHH?tag=hbdcelebrate-20',
            isPhysicalStore: false,
            deliveryScope: 'GLOBAL',
            estimatedDeliveryDays: 3
          },
          {
            sku: 'AMZ-KINDLE-PW',
            title: 'Kindle Paperwhite (16 GB) – 6.8" Display & Warm Light',
            description: 'Purpose-built for reading with a flush-front design and 300 ppi glare-free display.',
            category: 'TECH' as const,
            fulfillmentType: 'AFFILIATE_REDIRECT' as const,
            price: 149.99,
            currency: 'USD',
            imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
            externalUrl: 'https://www.amazon.com/dp/B08KTZ8249?tag=hbdcelebrate-20',
            isPhysicalStore: false,
            deliveryScope: 'GLOBAL',
            estimatedDeliveryDays: 2
          }
        ]
      },
      {
        slug: 'jumia',
        name: 'Jumia Africa Marketplace',
        category: 'REGIONAL_ECOMMERCE' as const,
        logoUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=120&q=80',
        description: 'Pan-African flagship e-commerce with fast local delivery across Lagos, Nairobi, Accra, and Cairo.',
        supportedCountries: ['NG', 'KE', 'GH', 'EG', 'CI', 'SN'],
        supportedCurrencies: ['USD', 'NGN', 'KES'],
        commissionRate: 0.08,
        isVerified: true,
        items: [
          {
            sku: 'JUM-ORAIMO-FP4',
            title: 'Oraimo FreePods 4 Active Noise Cancelling Earbuds',
            description: 'HeavyBass dual-mic ENC with 35.5-hour playback, tuned for the African rhythm.',
            category: 'TECH' as const,
            fulfillmentType: 'AFFILIATE_REDIRECT' as const,
            price: 38.00,
            currency: 'USD',
            imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
            externalUrl: 'https://www.jumia.com.ng',
            isPhysicalStore: false,
            deliveryScope: 'AFRICA_REGIONAL',
            estimatedDeliveryDays: 2
          }
        ]
      },
      {
        slug: 'glothelo',
        name: 'Glo / Thelo Luxury Collective',
        category: 'REGIONAL_ECOMMERCE' as const,
        logoUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=120&q=80',
        description: 'Premium African and global haute couture, niche fragrances, and curated lifestyle gifting.',
        supportedCountries: ['NG', 'CM', 'GH', 'ZA', 'UK'],
        supportedCurrencies: ['USD', 'GBP', 'NGN', 'XAF'],
        commissionRate: 0.12,
        isVerified: true,
        items: [
          {
            sku: 'GLO-TF-OUD',
            title: 'Tom Ford Oud Wood Eau de Parfum (50ml)',
            description: 'One of the most rare, precious, and expensive ingredients in a perfumer’s arsenal.',
            category: 'FRAGRANCE' as const,
            fulfillmentType: 'NATIVE_ESCROW' as const,
            price: 195.00,
            currency: 'USD',
            imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80',
            isPhysicalStore: false,
            deliveryScope: 'GLOBAL',
            estimatedDeliveryDays: 4
          }
        ]
      },
      {
        slug: 'artisan_bakery',
        name: 'Sweet Sensation Patisserie & Bakery',
        category: 'PHYSICAL_PARTNER' as const,
        logoUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=120&q=80',
        description: 'Affiliated physical patisserie. Dynamic QR pass redeemable at storefront or local courier.',
        supportedCountries: ['UK'],
        supportedCurrencies: ['GBP', 'USD'],
        commissionRate: 0.15,
        isVerified: true,
        posSecretKey: 'BAKE-POS-2026',
        physicalAddress: '14 Marylebone High Street',
        city: 'London',
        country: 'United Kingdom',
        items: [
          {
            sku: 'BAKE-GOLD-VELVET',
            title: '24K Edible Gold Leaf Red Velvet Celebration Cake',
            description: 'Four decadent tiers of Madagascar vanilla-infused cream cheese and moist velvet sponge with edible gold leaf.',
            category: 'CAKE' as const,
            fulfillmentType: 'NATIVE_ESCROW' as const,
            price: 65.00,
            currency: 'USD',
            imageUrl: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=600&q=80',
            isPhysicalStore: true,
            deliveryScope: 'LONDON_ONLY',
            estimatedDeliveryDays: 1
          }
        ]
      },
      {
        slug: 'luxury_florist',
        name: 'Blossoms & Botanicals Boutique',
        category: 'PHYSICAL_PARTNER' as const,
        logoUrl: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=120&q=80',
        description: 'Affiliated floral artisan. Dynamic QR pass redeemable in-store or same-day local delivery.',
        supportedCountries: ['NG'],
        supportedCurrencies: ['NGN', 'USD'],
        commissionRate: 0.15,
        isVerified: true,
        posSecretKey: 'FLORAL-POS-2026',
        physicalAddress: '22 Victoria Island Avenue',
        city: 'Lagos',
        country: 'Nigeria',
        items: [
          {
            sku: 'FLOR-ROYAL-ORCHID',
            title: 'Royal White Orchid & Casablanca Lily Celebration Bouquet',
            description: 'Freshly cut stems arranged in a bespoke ceramic vase with silk celebration ribbon.',
            category: 'FLOWERS' as const,
            fulfillmentType: 'NATIVE_ESCROW' as const,
            price: 55.00,
            currency: 'USD',
            imageUrl: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=600&q=80',
            isPhysicalStore: true,
            deliveryScope: 'LAGOS_ONLY',
            estimatedDeliveryDays: 1
          }
        ]
      }
    ];

    for (const mData of merchantsData) {
      const { items, ...partnerFields } = mData;
      const merchant = await prisma.merchantPartner.upsert({
        where: { slug: partnerFields.slug },
        update: partnerFields,
        create: partnerFields
      });

      for (const item of items) {
        await prisma.giftCatalogItem.upsert({
          where: { sku: item.sku },
          update: {
            ...item,
            merchantId: merchant.id
          },
          create: {
            ...item,
            merchantId: merchant.id
          }
        });
      }
    }

    const routeCount = await (prisma as any).countryRoute.count();
    const merchantCount = await prisma.merchantPartner.count();
    const itemCount = await prisma.giftCatalogItem.count();
    console.log(`✅ Universal Gifting Engine seeded: ${routeCount} country routes, ${merchantCount} merchants, ${itemCount} catalog items!`);
  } catch (err) {
    console.error('⚠️ Could not connect or seed PostgreSQL hbdays_db:', err);
  }
}

export function sanitizeUser(user: any) {
  if (!user) return null;
  const { passwordHash, ...safe } = user;
  
  // Format preferences and privacy objects
  const preferences = safe.preferences || {
    interests: safe.wishlist || ['Coffee', 'Books'],
    avoid: safe.avoidList || ['Lilies (allergic)'],
    favoriteColor: '#5B2A86',
    idols: safe.idols || [],
    musicGenres: safe.musicGenres || [],
    animalTypes: safe.animalTypes || [],
    hobbies: safe.hobbies || [],
    personalGoals: safe.personalGoals || [],
    traditions: safe.traditions || ['Universal Secular'],
    showTributes: safe.showTributes !== undefined ? safe.showTributes : true
  };

  const privacy = safe.privacy || {
    birthdayVisibility: 'EVERYONE',
    showAge: false,
    preferencesVisibleToFriends: true
  };

  return {
    ...safe,
    preferences: {
      ...preferences,
      idols: safe.idols || preferences.idols,
      musicGenres: safe.musicGenres || preferences.musicGenres,
      animalTypes: safe.animalTypes || preferences.animalTypes,
      hobbies: safe.hobbies || preferences.hobbies,
      personalGoals: safe.personalGoals || preferences.personalGoals,
      traditions: safe.traditions || preferences.traditions,
      showTributes: safe.showTributes !== undefined ? safe.showTributes : preferences.showTributes
    },
    privacy
  };
}
