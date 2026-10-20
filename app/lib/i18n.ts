import {useRouteLoaderData} from 'react-router';
import type {RootLoader} from '~/root';

export type Language = 'en' | 'ar';

export type Locale = {
  language: Language;
  dir: 'ltr' | 'rtl';
  /** '' for English, '/ar' for Arabic. */
  pathPrefix: string;
  storefront: {language: 'EN' | 'AR'; country: 'AE'};
};

export const LOCALES: Record<Language, Locale> = {
  en: {
    language: 'en',
    dir: 'ltr',
    pathPrefix: '',
    storefront: {language: 'EN', country: 'AE'},
  },
  ar: {
    language: 'ar',
    dir: 'rtl',
    pathPrefix: '/ar',
    storefront: {language: 'AR', country: 'AE'},
  },
};

export function getLocaleFromRequest(request: Request): Locale {
  const [first] = new URL(request.url).pathname.split('/').filter(Boolean);
  return first?.toLowerCase() === 'ar' ? LOCALES.ar : LOCALES.en;
}

/** Throws a 404 for unknown `($locale)` segments such as `/fr/...`. */
export function assertLocaleParam(locale: string | undefined) {
  if (locale && locale.toLowerCase() !== 'ar') {
    throw new Response('Not found', {status: 404});
  }
}

/** Same path in the other language, used by the language switch. */
export function switchLocalePath(pathname: string, to: Language) {
  const bare = pathname.replace(/^\/ar(?=\/|$)/i, '') || '/';
  if (to === 'en') return bare;
  return bare === '/' ? '/ar' : `/ar${bare}`;
}

export function formatMoney(
  money: {amount: string; currencyCode: string},
  language: Language,
) {
  const amount = Number(money.amount);
  const fractionDigits = Number.isInteger(amount) ? 0 : 2;
  const formatted = new Intl.NumberFormat(
    language === 'ar' ? 'ar-AE-u-nu-latn' : 'en-AE',
    {
      style: 'currency',
      currency: money.currencyCode,
      currencyDisplay: 'code',
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    },
  ).format(amount);
  // Normalise non-breaking spaces so text matching and wrapping behave.
  return formatted.replace(/\u00a0/g, ' ');
}

const en = {
  'brand.tagline': 'Perfumes of the East, made in the UAE',
  'nav.women': 'Women',
  'nav.men': 'Men',
  'nav.oud': 'Oud',
  'nav.giftSets': 'Gift sets',
  'nav.ramadan': 'Ramadan gifts',
  'nav.buildBox': 'Build a box',
  'nav.loyalty': 'Rewards',
  'nav.account': 'Account',
  'nav.cart': 'Bag',
  'nav.menu': 'Menu',
  'nav.close': 'Close',
  'nav.language': 'العربية',
  'nav.languageLabel': 'Switch to Arabic',

  'announcement.default': 'Free delivery across the UAE on orders over AED 200',
  'announcement.ramadan':
    'Ramadan Kareem. Order by 25 Ramadan for delivery before Eid',

  'banner.eyebrow': 'Ramadan Kareem',
  'banner.title': 'The gift of fragrance this Ramadan',
  'banner.text':
    'Hand-picked sets, a build-your-own box and gift wrapping for everyone on your list.',
  'banner.cta': 'Shop Ramadan gifts',
  'banner.secondary': 'Build a gift box',

  'home.heroEyebrow': 'Afnan Perfumes',
  'home.heroTitle': 'Scents that tell your story',
  'home.heroText':
    'Eau de parfums crafted in Dubai, from bright florals to deep oud.',
  'home.heroCta': 'Shop women',
  'home.heroCta2': 'Shop men',
  'home.bestsellers': 'Bestsellers',
  'home.collections': 'Shop by collection',
  'home.loyaltyTitle': 'Afnan Rewards',
  'home.loyaltyText': 'Earn points on every order and unlock Gold and Platinum perks.',
  'home.loyaltyCta': 'Join for free',

  'product.addToBag': 'Add to bag',
  'product.adding': 'Adding…',
  'product.added': 'Added to your bag.',
  'product.viewBag': 'View bag',
  'product.soldOut': 'Sold out',
  'product.sale': 'Sale',
  'product.vendor': 'Afnan',
  'product.notFound': 'We could not find that product.',
  'product.gwpPromo':
    'Buy any Femme Collection perfume and get a free gift with your order.',

  'gwp.unlocked': 'You’ve unlocked a free gift',
  'gwp.unlockedDetail': '{gift} has been added to your bag at no cost.',
  'gwp.outOfStock':
    'You qualify for a free gift, but it is out of stock right now. Your order can still go ahead as normal.',
  'gwp.free': 'Free',
  'gwp.label': 'Free gift',
  'gwp.chooseTitle': 'Choose your free gift',
  'gwp.chooseDetail': 'Pick any one of these. It comes free with your order.',
  'gwp.choose': 'Choose',
  'gwp.change': 'Change gift',
  'gwp.unavailable': 'That gift isn’t available any more. Please choose another.',

  'collection.empty': 'No products here yet.',
  'collection.count': '{count} products',
  'collections.title': 'Collections',

  'gifting.metaTitle': 'Ramadan & Eid gifts',
  'gifting.eyebrow': 'Ramadan gifting',
  'gifting.title': 'Gifts that linger long after Eid',
  'gifting.text': 'Find the right fragrance for every budget, ready to wrap.',
  'gifting.countdownTitle': 'Eid al-Fitr begins in',
  'gifting.eidMubarak': 'Eid Mubarak!',
  'gifting.days': 'Days',
  'gifting.hours': 'Hours',
  'gifting.minutes': 'Minutes',
  'gifting.seconds': 'Seconds',
  'gifting.shopNow': 'Shop gift sets',
  'gifting.budgetTitle': 'Gifts by budget',
  'gifting.budget.under-200': 'Under AED 200',
  'gifting.budget.200-400': 'AED 200–400',
  'gifting.budget.400-plus': 'AED 400+',
  'gifting.budgetEmpty': 'No gift sets in this budget yet.',
  'gifting.boxTitle': 'Make it personal',
  'gifting.boxText': 'Pick any 3 perfumes and we will pack them in one Afnan gift box.',
  'gifting.boxCta': 'Build your box',
  'gifting.faqTitle': 'Gifting questions',
  'gifting.faq.1.q': 'When should I order to receive my gifts before Eid?',
  'gifting.faq.1.a':
    'Order by 25 Ramadan for standard UAE delivery, or by 28 Ramadan for express delivery to Dubai, Sharjah and Abu Dhabi.',
  'gifting.faq.2.q': 'Can I add a gift message?',
  'gifting.faq.2.a':
    'Yes. Tick “This is a gift” in your bag and write a message of up to 150 characters. We print it on a card inside the box.',
  'gifting.faq.3.q': 'How much is gift wrapping?',
  'gifting.faq.3.a': 'Gift wrapping is AED 15 per order and covers every item in it.',
  'gifting.faq.4.q': 'Will the receipt show prices?',
  'gifting.faq.4.a':
    'No. Orders marked as a gift are packed without a priced invoice.',
  'gifting.faq.5.q': 'Can I return or exchange a gift?',
  'gifting.faq.5.a':
    'Unopened items can be exchanged within 14 days of delivery with the order number.',

  'box.metaTitle': 'Build your own gift box',
  'box.eyebrow': 'Gift box',
  'box.title': 'Build your own gift box',
  'box.text': 'Choose any {size} full-size perfumes. They go in one box for {price}.',
  'box.selected': '{count} of {size} selected',
  'box.choose': 'Choose',
  'box.chosen': 'Chosen',
  'box.remove': 'Remove',
  'box.full': 'Your box is full. Remove one to swap it.',
  'box.separately': 'Bought separately',
  'box.boxPrice': 'Box price',
  'box.youSave': 'You save {amount}',
  'box.add': 'Add box to bag',
  'box.pickMore': 'Pick {count} more',
  'box.contents': 'In this box',
  'box.slot': 'Perfume {n}',
  'box.unavailable': 'The gift box is not available right now.',

  'cart.title': 'Your bag',
  'cart.empty': 'Your bag is empty.',
  'cart.continue': 'Continue shopping',
  'cart.subtotal': 'Subtotal',
  'cart.total': 'Total',
  'cart.checkout': 'Checkout',
  'cart.remove': 'Remove',
  'cart.decrease': 'Decrease quantity',
  'cart.increase': 'Increase quantity',
  'cart.quantity': 'Quantity',
  'cart.giftWrapLine': 'Added with your gift options',
  'cart.taxes': 'Prices include VAT. Shipping is calculated at checkout.',
  'cart.giftOptions': 'Gift options',
  'cart.isGift': 'This is a gift',
  'cart.message': 'Gift message',
  'cart.messagePlaceholder': 'Write a short message for the card',
  'cart.charsLeft': '{count} characters left',
  'cart.wrap': 'Add gift wrap (+{price})',
  'cart.saveGift': 'Save gift options',
  'cart.saving': 'Saving…',
  'cart.saved': 'Gift options saved to your order.',
  'cart.messageTooLong': 'Gift messages can be up to 150 characters.',
  'cart.wrapUnavailable': 'Gift wrap is unavailable right now.',

  'checkout.title': 'Order preview',
  'checkout.text':
    'This is what the warehouse sees on the order. With a Shopify store connected, Checkout takes you to Shopify checkout instead.',
  'checkout.attributes': 'Order notes (Additional details)',
  'checkout.lineProps': 'Line properties',
  'checkout.none': 'None',

  'loyalty.metaTitle': 'Afnan Rewards',
  'loyalty.eyebrow': 'Afnan Rewards',
  'loyalty.title': 'Every bottle brings you closer to more',
  'loyalty.text':
    'Join for free, earn points on what you already love and spend them at checkout.',
  'loyalty.join': 'Join Afnan Rewards',
  'loyalty.viewAccount': 'View my points',
  'loyalty.howTitle': 'How it works',
  'loyalty.step1.title': 'Join',
  'loyalty.step1.text': 'Create a free account and get 100 welcome points.',
  'loyalty.step2.title': 'Earn',
  'loyalty.step2.text': 'Collect points on orders, reviews, your birthday and referrals.',
  'loyalty.step3.title': 'Redeem',
  'loyalty.step3.text': 'Turn 100 points into AED 10 off at checkout.',
  'loyalty.tiersTitle': 'Tiers and benefits',
  'loyalty.benefit': 'Benefit',
  'loyalty.tier.silver': 'Silver',
  'loyalty.tier.gold': 'Gold',
  'loyalty.tier.platinum': 'Platinum',
  'loyalty.row.threshold': 'Points to reach',
  'loyalty.row.earn': 'Points per AED 1',
  'loyalty.row.birthday': 'Birthday gift',
  'loyalty.row.shipping': 'Free express delivery',
  'loyalty.row.early': 'Early access to launches',
  'loyalty.row.samples': 'Samples with every order',
  'loyalty.yes': 'Included',
  'loyalty.no': 'Not included',
  'loyalty.earnTitle': 'Ways to earn',
  'loyalty.earn.purchase': 'Shop',
  'loyalty.earn.purchaseValue': '1 point per AED 1',
  'loyalty.earn.review': 'Write a review',
  'loyalty.earn.reviewValue': '50 points',
  'loyalty.earn.birthday': 'Celebrate your birthday',
  'loyalty.earn.birthdayValue': '200 points',
  'loyalty.earn.referral': 'Refer a friend',
  'loyalty.earn.referralValue': '250 points',
  'loyalty.flowTitle': 'The customer journey',
  'loyalty.flowAlt':
    'Flow diagram: sign up, earn points from purchases, reviews, birthdays and referrals, move from Silver to Gold to Platinum, redeem at checkout.',

  'account.title': 'My account',
  'account.greeting': 'Hello, {name}',
  'account.demo': 'Demo customer. Connect a Shopify store to sign in for real.',
  'account.signInDemo': 'You’re seeing a demo customer. Sign in to see your own points.',
  'account.signIn': 'Sign in',
  'account.points': 'Points balance',
  'account.tier': 'Tier',
  'account.progress': '{count} points to {tier}',
  'account.topTier': 'You are at our top tier. Thank you!',
  'account.worth': 'Worth {amount} at checkout',
  'account.howToEarn': 'Ways to earn more',
  'account.logout': 'Sign out',
  'account.orders': 'Orders',
  'account.ordersEmpty': 'Your orders will show here.',
  'account.ordersNone': 'No orders yet. Your first order will show here.',
  'account.pointsEstimated': 'Worked out from your orders: 100 sign-up points plus 1 point per AED on paid orders. Your rewards app balance is the final figure.',
  'account.orderView': 'View',
  'account.tab.profile': 'Profile',
  'account.tab.orders': 'Orders',
  'account.tab.loyalty': 'Loyalty',
  'account.field.name': 'Name',
  'account.field.email': 'Email',
  'account.field.phone': 'Phone',
  'account.field.address': 'Default address',
  'account.field.since': 'Member since',
  'account.shop': 'Continue shopping',
  'account.memberSince': 'Member since {date}',
  'account.status.PAID': 'Paid',
  'account.status.PENDING': 'Payment pending',
  'account.status.AUTHORIZED': 'Authorised',
  'account.status.REFUNDED': 'Refunded',
  'account.status.PARTIALLY_REFUNDED': 'Partly refunded',
  'account.status.VOIDED': 'Voided',
  'account.status.CANCELLED': 'Cancelled',
  'account.status.FULFILLED': 'Delivered',
  'account.status.UNFULFILLED': 'Preparing',

  'footer.about': 'Afnan Perfumes. Dummy storefront built with Shopify Hydrogen.',
  'footer.help': 'Help',
  'footer.shipping': 'Delivery & returns',
  'footer.contact': 'Contact us',
  'footer.ramadanSwitch': 'Ramadan look (demo switch)',
  'footer.on': 'On',
  'footer.off': 'Off',

  'error.title': 'Something went wrong',
  'error.notFound': 'Page not found',
  'error.home': 'Back to home',
};

export type MessageKey = keyof typeof en;

const ar: Record<MessageKey, string> = {
  'brand.tagline': 'عطور الشرق، صُنعت في الإمارات',
  'nav.women': 'نساء',
  'nav.men': 'رجال',
  'nav.oud': 'عود',
  'nav.giftSets': 'أطقم الهدايا',
  'nav.ramadan': 'هدايا رمضان',
  'nav.buildBox': 'صمّم صندوقك',
  'nav.loyalty': 'المكافآت',
  'nav.account': 'حسابي',
  'nav.cart': 'الحقيبة',
  'nav.menu': 'القائمة',
  'nav.close': 'إغلاق',
  'nav.language': 'English',
  'nav.languageLabel': 'التبديل إلى الإنجليزية',

  'announcement.default': 'توصيل مجاني داخل الإمارات للطلبات فوق 200 درهم',
  'announcement.ramadan': 'رمضان كريم. اطلب قبل 25 رمضان ليصلك قبل العيد',

  'banner.eyebrow': 'رمضان كريم',
  'banner.title': 'أهدِ العطر في رمضان',
  'banner.text': 'أطقم مختارة وصندوق هدايا من اختيارك وتغليف أنيق لكل من تحب.',
  'banner.cta': 'تسوّق هدايا رمضان',
  'banner.secondary': 'صمّم صندوق هدايا',

  'home.heroEyebrow': 'عطور أفنان',
  'home.heroTitle': 'عطور تحكي قصتك',
  'home.heroText': 'عطور صُنعت في دبي، من الأزهار المشرقة إلى العود العميق.',
  'home.heroCta': 'تسوّقي للنساء',
  'home.heroCta2': 'تسوّق للرجال',
  'home.bestsellers': 'الأكثر مبيعاً',
  'home.collections': 'تسوّق حسب المجموعة',
  'home.loyaltyTitle': 'مكافآت أفنان',
  'home.loyaltyText': 'اكسب النقاط مع كل طلب واحصل على مزايا الذهبي والبلاتيني.',
  'home.loyaltyCta': 'انضم مجاناً',

  'product.addToBag': 'أضف إلى الحقيبة',
  'product.adding': 'جارٍ الإضافة…',
  'product.added': 'تمت الإضافة إلى حقيبتك.',
  'product.viewBag': 'عرض الحقيبة',
  'product.soldOut': 'نفدت الكمية',
  'product.sale': 'تخفيض',
  'product.vendor': 'أفنان',
  'product.notFound': 'لم نعثر على هذا المنتج.',
  'product.gwpPromo': 'اشترِ أي عطر من مجموعة فام واحصل على هدية مجانية مع طلبك.',

  'gwp.unlocked': 'لقد حصلت على هدية مجانية',
  'gwp.unlockedDetail': 'تمت إضافة {gift} إلى حقيبتك مجاناً.',
  'gwp.outOfStock':
    'أنت مؤهل لهدية مجانية لكنها غير متوفرة حالياً. يمكنك إكمال طلبك كالمعتاد.',
  'gwp.free': 'مجاناً',
  'gwp.label': 'هدية مجانية',
  'gwp.chooseTitle': 'اختر هديتك المجانية',
  'gwp.chooseDetail': 'اختر واحدة منها، وتصلك مجاناً مع طلبك.',
  'gwp.choose': 'اختيار',
  'gwp.change': 'تغيير الهدية',
  'gwp.unavailable': 'هذه الهدية لم تعد متاحة. يرجى اختيار هدية أخرى.',

  'collection.empty': 'لا توجد منتجات هنا بعد.',
  'collection.count': '{count} منتجات',
  'collections.title': 'المجموعات',

  'gifting.metaTitle': 'هدايا رمضان والعيد',
  'gifting.eyebrow': 'هدايا رمضان',
  'gifting.title': 'هدايا يبقى عطرها بعد العيد',
  'gifting.text': 'اعثر على العطر المناسب لكل ميزانية، جاهزاً للتغليف.',
  'gifting.countdownTitle': 'عيد الفطر بعد',
  'gifting.eidMubarak': 'عيد مبارك!',
  'gifting.days': 'أيام',
  'gifting.hours': 'ساعات',
  'gifting.minutes': 'دقائق',
  'gifting.seconds': 'ثوانٍ',
  'gifting.shopNow': 'تسوّق أطقم الهدايا',
  'gifting.budgetTitle': 'هدايا حسب الميزانية',
  'gifting.budget.under-200': 'أقل من 200 درهم',
  'gifting.budget.200-400': '200–400 درهم',
  'gifting.budget.400-plus': '400 درهم وأكثر',
  'gifting.budgetEmpty': 'لا توجد أطقم هدايا ضمن هذه الميزانية بعد.',
  'gifting.boxTitle': 'اجعلها شخصية',
  'gifting.boxText': 'اختر أي 3 عطور وسنضعها في صندوق هدايا واحد من أفنان.',
  'gifting.boxCta': 'صمّم صندوقك',
  'gifting.faqTitle': 'أسئلة عن الهدايا',
  'gifting.faq.1.q': 'متى أطلب لتصلني الهدايا قبل العيد؟',
  'gifting.faq.1.a':
    'اطلب قبل 25 رمضان للتوصيل العادي داخل الإمارات، أو قبل 28 رمضان للتوصيل السريع إلى دبي والشارقة وأبوظبي.',
  'gifting.faq.2.q': 'هل يمكنني إضافة رسالة إهداء؟',
  'gifting.faq.2.a':
    'نعم. اختر «هذه هدية» في حقيبتك واكتب رسالة حتى 150 حرفاً، وسنطبعها على بطاقة داخل الصندوق.',
  'gifting.faq.3.q': 'كم تكلفة تغليف الهدية؟',
  'gifting.faq.3.a': 'تغليف الهدية بـ 15 درهماً للطلب ويشمل جميع المنتجات فيه.',
  'gifting.faq.4.q': 'هل ستظهر الأسعار على الفاتورة؟',
  'gifting.faq.4.a': 'لا. الطلبات المحددة كهدية تُغلّف دون فاتورة بالأسعار.',
  'gifting.faq.5.q': 'هل يمكن إرجاع الهدية أو استبدالها؟',
  'gifting.faq.5.a': 'يمكن استبدال المنتجات غير المفتوحة خلال 14 يوماً من التوصيل برقم الطلب.',

  'box.metaTitle': 'صمّم صندوق هداياك',
  'box.eyebrow': 'صندوق الهدايا',
  'box.title': 'صمّم صندوق هداياك',
  'box.text': 'اختر أي {size} عطور بالحجم الكامل في صندوق واحد بسعر {price}.',
  'box.selected': 'تم اختيار {count} من {size}',
  'box.choose': 'اختر',
  'box.chosen': 'تم الاختيار',
  'box.remove': 'إزالة',
  'box.full': 'صندوقك ممتلئ. أزل عطراً لتستبدله.',
  'box.separately': 'عند الشراء منفصلاً',
  'box.boxPrice': 'سعر الصندوق',
  'box.youSave': 'توفّر {amount}',
  'box.add': 'أضف الصندوق إلى الحقيبة',
  'box.pickMore': 'اختر {count} أخرى',
  'box.contents': 'محتويات الصندوق',
  'box.slot': 'العطر {n}',
  'box.unavailable': 'صندوق الهدايا غير متوفر حالياً.',

  'cart.title': 'حقيبتك',
  'cart.empty': 'حقيبتك فارغة.',
  'cart.continue': 'متابعة التسوق',
  'cart.subtotal': 'المجموع الفرعي',
  'cart.total': 'الإجمالي',
  'cart.checkout': 'إتمام الشراء',
  'cart.remove': 'إزالة',
  'cart.decrease': 'تقليل الكمية',
  'cart.increase': 'زيادة الكمية',
  'cart.quantity': 'الكمية',
  'cart.giftWrapLine': 'أضيف مع خيارات الهدية',
  'cart.taxes': 'الأسعار شاملة ضريبة القيمة المضافة. تُحسب رسوم الشحن عند الدفع.',
  'cart.giftOptions': 'خيارات الهدية',
  'cart.isGift': 'هذه هدية',
  'cart.message': 'رسالة الإهداء',
  'cart.messagePlaceholder': 'اكتب رسالة قصيرة للبطاقة',
  'cart.charsLeft': 'متبقٍ {count} حرفاً',
  'cart.wrap': 'أضف تغليف الهدية (+{price})',
  'cart.saveGift': 'حفظ خيارات الهدية',
  'cart.saving': 'جارٍ الحفظ…',
  'cart.saved': 'تم حفظ خيارات الهدية في طلبك.',
  'cart.messageTooLong': 'رسالة الإهداء حتى 150 حرفاً.',
  'cart.wrapUnavailable': 'تغليف الهدية غير متوفر حالياً.',

  'checkout.title': 'معاينة الطلب',
  'checkout.text':
    'هذا ما يراه المستودع في الطلب. عند ربط متجر Shopify ينقلك زر الدفع إلى صفحة الدفع في Shopify.',
  'checkout.attributes': 'ملاحظات الطلب (تفاصيل إضافية)',
  'checkout.lineProps': 'خصائص المنتج',
  'checkout.none': 'لا يوجد',

  'loyalty.metaTitle': 'مكافآت أفنان',
  'loyalty.eyebrow': 'مكافآت أفنان',
  'loyalty.title': 'كل عطر يقرّبك من المزيد',
  'loyalty.text': 'انضم مجاناً، واكسب النقاط على ما تحب، واستخدمها عند الدفع.',
  'loyalty.join': 'انضم إلى مكافآت أفنان',
  'loyalty.viewAccount': 'عرض نقاطي',
  'loyalty.howTitle': 'كيف يعمل البرنامج',
  'loyalty.step1.title': 'انضم',
  'loyalty.step1.text': 'أنشئ حساباً مجانياً واحصل على 100 نقطة ترحيبية.',
  'loyalty.step2.title': 'اكسب',
  'loyalty.step2.text': 'اجمع النقاط من الطلبات والتقييمات وعيد ميلادك والإحالات.',
  'loyalty.step3.title': 'استبدل',
  'loyalty.step3.text': 'كل 100 نقطة تساوي خصم 10 دراهم عند الدفع.',
  'loyalty.tiersTitle': 'المستويات والمزايا',
  'loyalty.benefit': 'الميزة',
  'loyalty.tier.silver': 'فضي',
  'loyalty.tier.gold': 'ذهبي',
  'loyalty.tier.platinum': 'بلاتيني',
  'loyalty.row.threshold': 'النقاط المطلوبة',
  'loyalty.row.earn': 'نقاط لكل درهم',
  'loyalty.row.birthday': 'هدية عيد الميلاد',
  'loyalty.row.shipping': 'توصيل سريع مجاني',
  'loyalty.row.early': 'وصول مبكر للإصدارات',
  'loyalty.row.samples': 'عينات مع كل طلب',
  'loyalty.yes': 'متاح',
  'loyalty.no': 'غير متاح',
  'loyalty.earnTitle': 'طرق كسب النقاط',
  'loyalty.earn.purchase': 'تسوّق',
  'loyalty.earn.purchaseValue': 'نقطة لكل درهم',
  'loyalty.earn.review': 'اكتب تقييماً',
  'loyalty.earn.reviewValue': '50 نقطة',
  'loyalty.earn.birthday': 'احتفل بعيد ميلادك',
  'loyalty.earn.birthdayValue': '200 نقطة',
  'loyalty.earn.referral': 'ادعُ صديقاً',
  'loyalty.earn.referralValue': '250 نقطة',
  'loyalty.flowTitle': 'رحلة العميل',
  'loyalty.flowAlt':
    'مخطط: التسجيل، كسب النقاط من الطلبات والتقييمات وأعياد الميلاد والإحالات، الانتقال من الفضي إلى الذهبي إلى البلاتيني، والاستبدال عند الدفع.',

  'account.title': 'حسابي',
  'account.greeting': 'مرحباً، {name}',
  'account.demo': 'عميل تجريبي. اربط متجر Shopify لتسجيل الدخول فعلياً.',
  'account.signInDemo': 'تعرض هذه الصفحة عميلاً تجريبياً. سجّل الدخول لرؤية نقاطك.',
  'account.signIn': 'تسجيل الدخول',
  'account.points': 'رصيد النقاط',
  'account.tier': 'المستوى',
  'account.progress': '{count} نقطة للوصول إلى {tier}',
  'account.topTier': 'أنت في أعلى مستوى. شكراً لك!',
  'account.worth': 'تساوي {amount} عند الدفع',
  'account.howToEarn': 'طرق كسب المزيد',
  'account.logout': 'تسجيل الخروج',
  'account.orders': 'الطلبات',
  'account.ordersEmpty': 'ستظهر طلباتك هنا.',
  'account.ordersNone': 'لا توجد طلبات بعد. سيظهر طلبك الأول هنا.',
  'account.pointsEstimated': 'محسوبة من طلباتك: 100 نقطة عند التسجيل ونقطة لكل درهم على الطلبات المدفوعة. الرصيد في تطبيق المكافآت هو الرقم النهائي.',
  'account.orderView': 'عرض',
  'account.tab.profile': 'الملف الشخصي',
  'account.tab.orders': 'الطلبات',
  'account.tab.loyalty': 'المكافآت',
  'account.field.name': 'الاسم',
  'account.field.email': 'البريد الإلكتروني',
  'account.field.phone': 'الهاتف',
  'account.field.address': 'العنوان الافتراضي',
  'account.field.since': 'عضو منذ',
  'account.shop': 'متابعة التسوق',
  'account.memberSince': 'عضو منذ {date}',
  'account.status.PAID': 'مدفوع',
  'account.status.PENDING': 'بانتظار الدفع',
  'account.status.AUTHORIZED': 'مصرّح به',
  'account.status.REFUNDED': 'مسترد',
  'account.status.PARTIALLY_REFUNDED': 'مسترد جزئياً',
  'account.status.VOIDED': 'ملغى الدفع',
  'account.status.CANCELLED': 'ملغى',
  'account.status.FULFILLED': 'تم التوصيل',
  'account.status.UNFULFILLED': 'قيد التجهيز',

  'footer.about': 'عطور أفنان. متجر تجريبي مبني باستخدام Shopify Hydrogen.',
  'footer.help': 'المساعدة',
  'footer.shipping': 'التوصيل والإرجاع',
  'footer.contact': 'تواصل معنا',
  'footer.ramadanSwitch': 'مظهر رمضان (مفتاح تجريبي)',
  'footer.on': 'تشغيل',
  'footer.off': 'إيقاف',

  'error.title': 'حدث خطأ ما',
  'error.notFound': 'الصفحة غير موجودة',
  'error.home': 'العودة للرئيسية',
};

const DICTIONARIES: Record<Language, Record<MessageKey, string>> = {en, ar};

export function translate(
  language: Language,
  key: MessageKey,
  vars?: Record<string, string | number>,
) {
  let text = DICTIONARIES[language][key] ?? en[key];
  if (vars) {
    for (const [name, value] of Object.entries(vars)) {
      text = text.replaceAll(`{${name}}`, String(value));
    }
  }
  return text;
}

/** Locale-aware helpers for components: `t()`, `money()` and `path()`. */
export function useLocale() {
  const data = useRouteLoaderData<RootLoader>('root');
  const locale = data?.locale ?? LOCALES.en;
  return {
    locale,
    t: (key: MessageKey, vars?: Record<string, string | number>) =>
      translate(locale.language, key, vars),
    money: (m: {amount: string; currencyCode: string}) =>
      formatMoney(m, locale.language),
    path: (to: string) => `${locale.pathPrefix}${to === '/' && locale.pathPrefix ? '' : to}`,
  };
}
