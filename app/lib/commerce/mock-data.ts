import type {BottleArt} from './types';

/**
 * Dummy Afnan-style catalogue in AED, used when no Shopify store is
 * connected. Mirrors what the dev store should contain so the same handles
 * work in both modes (see docs/SHOPIFY_SETUP.md).
 */

export type MockProduct = {
  handle: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  productType: string;
  price: number;
  compareAtPrice?: number;
  collections: string[];
  tags: string[];
  art: BottleArt;
  /** Hidden helper products (gift wrap, free gift, box) stay out of listings. */
  hidden?: boolean;
  soldOut?: boolean;
};

export type MockCollection = {
  handle: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
};

export const MOCK_COLLECTIONS: MockCollection[] = [
  {
    handle: 'femme-collection',
    title: 'Femme Collection',
    titleAr: 'مجموعة فام',
    description: 'Floral, musky and radiant fragrances for her.',
    descriptionAr: 'عطور زهرية ومسكية مشرقة لها.',
  },
  {
    handle: 'homme',
    title: 'Homme',
    titleAr: 'للرجال',
    description: 'Bold woods, spice and amber for him.',
    descriptionAr: 'أخشاب وتوابل وعنبر بطابع جريء له.',
  },
  {
    handle: 'oud',
    title: 'Oud & Oriental',
    titleAr: 'العود والشرقيات',
    description: 'Rich oud and heritage blends.',
    descriptionAr: 'خلطات عود فاخرة بروح التراث.',
  },
  {
    handle: 'gift-sets',
    title: 'Gift Sets',
    titleAr: 'أطقم الهدايا',
    description: 'Ready-wrapped sets for Ramadan and Eid gifting.',
    descriptionAr: 'أطقم جاهزة للإهداء في رمضان والعيد.',
  },
  {
    handle: 'gift-box-perfumes',
    title: 'Build-your-own box perfumes',
    titleAr: 'عطور صندوق الهدايا',
    description: 'Full-size perfumes you can pick for a gift box.',
    descriptionAr: 'عطور بالحجم الكامل يمكنك اختيارها لصندوق الهدايا.',
  },
];

const BOX = 'gift-box-perfumes';

export const MOCK_PRODUCTS: MockProduct[] = [
  // Femme
  {
    handle: '9pm-pour-femme',
    title: '9PM Pour Femme EDP 100ml',
    titleAr: '9PM بور فام أو دو بارفان 100 مل',
    description:
      'A sparkling evening fragrance of pink pepper, peony and warm vanilla musk.',
    descriptionAr: 'عطر مسائي متألق بالفلفل الوردي والفاوانيا ومسك الفانيليا الدافئ.',
    productType: 'Eau de Parfum',
    price: 165,
    collections: ['femme-collection', BOX],
    tags: ['femme'],
    art: {liquid: '#f2a7c3', cap: '#1d1d1f', shape: 'round'},
  },
  {
    handle: 'ornament-pour-femme',
    title: 'Ornament Pour Femme EDP 100ml',
    titleAr: 'أورنامنت بور فام أو دو بارفان 100 مل',
    description: 'Jasmine, pear and praline wrapped in soft white musk.',
    descriptionAr: 'الياسمين والكمثرى والبرالين في مسك أبيض ناعم.',
    productType: 'Eau de Parfum',
    price: 210,
    collections: ['femme-collection', BOX],
    tags: ['femme'],
    art: {liquid: '#f7d9a8', cap: '#c9a24a', shape: 'square'},
  },
  {
    handle: 'supremacy-pour-femme',
    title: 'Supremacy Pour Femme EDP 100ml',
    titleAr: 'سوبريماسي بور فام أو دو بارفان 100 مل',
    description: 'Blackcurrant, rose and patchouli with a velvet amber trail.',
    descriptionAr: 'الكشمش الأسود والورد والباتشولي مع أثر عنبري مخملي.',
    productType: 'Eau de Parfum',
    price: 275,
    compareAtPrice: 310,
    collections: ['femme-collection', BOX],
    tags: ['femme', 'bestseller'],
    art: {liquid: '#b23a5b', cap: '#d8c7a0', shape: 'tall'},
  },
  {
    handle: 'modest-pour-femme-une',
    title: 'Modest Une Pour Femme EDP 100ml',
    titleAr: 'موديست أون بور فام أو دو بارفان 100 مل',
    description: 'Fresh citrus and orange blossom over clean musk.',
    descriptionAr: 'حمضيات منعشة وزهر البرتقال فوق مسك نظيف.',
    productType: 'Eau de Parfum',
    price: 120,
    collections: ['femme-collection'],
    tags: ['femme'],
    art: {liquid: '#fbe6c2', cap: '#e8e1d5', shape: 'round'},
  },
  // Homme
  {
    handle: '9pm',
    title: '9PM EDP 100ml',
    titleAr: '9PM أو دو بارفان 100 مل',
    description: 'Apple, cinnamon and lavender over a sweet amber vanilla base.',
    descriptionAr: 'التفاح والقرفة واللافندر فوق قاعدة عنبر وفانيليا.',
    productType: 'Eau de Parfum',
    price: 160,
    collections: ['homme', BOX],
    tags: ['homme', 'bestseller'],
    art: {liquid: '#2b2d42', cap: '#d4a017', shape: 'tall'},
  },
  {
    handle: 'supremacy-silver',
    title: 'Supremacy Silver EDP 100ml',
    titleAr: 'سوبريماسي سيلفر أو دو بارفان 100 مل',
    description: 'Bergamot, blackcurrant and birch on a smoky musk base.',
    descriptionAr: 'البرغموت والكشمش الأسود وخشب البتولا على قاعدة مسك مدخن.',
    productType: 'Eau de Parfum',
    price: 255,
    collections: ['homme', BOX],
    tags: ['homme'],
    art: {liquid: '#c0c6cf', cap: '#3a3f47', shape: 'square'},
  },
  {
    handle: 'turathi-blue',
    title: 'Turathi Blue EDP 90ml',
    titleAr: 'تراثي بلو أو دو بارفان 90 مل',
    description: 'Grapefruit, amber and woods inspired by the Arabian coast.',
    descriptionAr: 'الجريب فروت والعنبر والأخشاب بإلهام من ساحل الخليج.',
    productType: 'Eau de Parfum',
    price: 235,
    collections: ['homme', BOX],
    tags: ['homme'],
    art: {liquid: '#1f5aa6', cap: '#c9a24a', shape: 'oud'},
  },
  {
    handle: 'rare-carbon',
    title: 'Rare Carbon EDP 100ml',
    titleAr: 'رير كاربون أو دو بارفان 100 مل',
    description: 'Mandarin, cardamom and vetiver with a dark leather heart.',
    descriptionAr: 'اليوسفي والهيل ونجيل الهند بقلب جلدي داكن.',
    productType: 'Eau de Parfum',
    price: 185,
    collections: ['homme', BOX],
    tags: ['homme'],
    art: {liquid: '#3b3b3b', cap: '#111111', shape: 'square'},
  },
  // Oud
  {
    handle: 'turathi-brown',
    title: 'Turathi Brown EDP 90ml',
    titleAr: 'تراثي براون أو دو بارفان 90 مل',
    description: 'Saffron, oud and sandalwood in a heritage blend.',
    descriptionAr: 'الزعفران والعود وخشب الصندل في خلطة تراثية.',
    productType: 'Eau de Parfum',
    price: 240,
    collections: ['oud', BOX],
    tags: ['oud'],
    art: {liquid: '#7a4a24', cap: '#c9a24a', shape: 'oud'},
  },
  {
    handle: 'mukhallat-al-oud',
    title: 'Mukhallat Al Oud EDP 100ml',
    titleAr: 'مخلّط العود أو دو بارفان 100 مل',
    description: 'Rose, agarwood and incense for the majlis.',
    descriptionAr: 'الورد والعود والبخور لأجواء المجلس.',
    productType: 'Eau de Parfum',
    price: 320,
    collections: ['oud', BOX],
    tags: ['oud'],
    art: {liquid: '#4b1d1d', cap: '#d8b25c', shape: 'oud'},
  },
  // Gift sets
  {
    handle: '9pm-discovery-set',
    title: '9PM Discovery Gift Set (4 x 20ml)',
    titleAr: 'طقم اكتشاف 9PM (4 × 20 مل)',
    description: 'Four travel sprays of the 9PM family in a gift sleeve.',
    descriptionAr: 'أربعة عطور سفر من عائلة 9PM في غلاف هدية.',
    productType: 'Gift Set',
    price: 149,
    collections: ['gift-sets'],
    tags: ['gift-set'],
    art: {liquid: '#2b2d42', cap: '#f2a7c3', shape: 'round'},
  },
  {
    handle: 'eid-musk-duo',
    title: 'Eid Musk Duo Gift Set',
    titleAr: 'طقم ثنائي مسك العيد',
    description: 'White musk EDP with a matching hair mist.',
    descriptionAr: 'عطر المسك الأبيض مع معطر شعر مطابق.',
    productType: 'Gift Set',
    price: 185,
    collections: ['gift-sets'],
    tags: ['gift-set'],
    art: {liquid: '#f4f1ea', cap: '#c9a24a', shape: 'round'},
  },
  {
    handle: 'supremacy-gift-set',
    title: 'Supremacy Gift Set (EDP + Body Spray)',
    titleAr: 'طقم سوبريماسي (عطر + بخاخ للجسم)',
    description: 'Supremacy Silver 100ml with a 250ml body spray.',
    descriptionAr: 'سوبريماسي سيلفر 100 مل مع بخاخ للجسم 250 مل.',
    productType: 'Gift Set',
    price: 285,
    collections: ['gift-sets'],
    tags: ['gift-set'],
    art: {liquid: '#c0c6cf', cap: '#3a3f47', shape: 'square'},
  },
  {
    handle: 'turathi-coffret',
    title: 'Turathi Coffret (Blue + Brown)',
    titleAr: 'صندوق تراثي (بلو + براون)',
    description: 'Both Turathi fragrances in a gold-foiled coffret.',
    descriptionAr: 'عطرا تراثي في صندوق مزين بالذهب.',
    productType: 'Gift Set',
    price: 365,
    compareAtPrice: 475,
    collections: ['gift-sets'],
    tags: ['gift-set'],
    art: {liquid: '#7a4a24', cap: '#1f5aa6', shape: 'oud'},
  },
  {
    handle: 'ramadan-majlis-collection',
    title: 'Ramadan Majlis Collection',
    titleAr: 'مجموعة مجلس رمضان',
    description: 'Oud EDP, bakhoor and a crystal burner for the majlis.',
    descriptionAr: 'عطر عود وبخور ومبخرة كريستال للمجلس.',
    productType: 'Gift Set',
    price: 495,
    collections: ['gift-sets'],
    tags: ['gift-set', 'ramadan'],
    art: {liquid: '#4b1d1d', cap: '#d8b25c', shape: 'oud'},
  },
  {
    handle: 'royal-oud-chest',
    title: 'Royal Oud Chest',
    titleAr: 'صندوق العود الملكي',
    description: 'Three oud perfumes and oud oil in a wooden chest.',
    descriptionAr: 'ثلاثة عطور عود وزيت عود في صندوق خشبي.',
    productType: 'Gift Set',
    price: 650,
    collections: ['gift-sets'],
    tags: ['gift-set', 'ramadan'],
    art: {liquid: '#5a3214', cap: '#d8b25c', shape: 'tall'},
  },
  // Helper products, hidden from listings
  {
    handle: 'build-your-own-gift-box',
    title: 'Build-Your-Own Gift Box (any 3)',
    titleAr: 'صندوق هدايا من اختيارك (أي 3 عطور)',
    description: 'Any three full-size perfumes in an Afnan gift box.',
    descriptionAr: 'أي ثلاثة عطور بالحجم الكامل في صندوق أفنان.',
    productType: 'Gift Box',
    price: 449,
    collections: [],
    tags: ['hidden', 'gift-box'],
    art: {liquid: '#c9a24a', cap: '#1d1d1f', shape: 'square'},
    hidden: true,
  },
  {
    handle: 'gift-wrap',
    title: 'Gift Wrap',
    titleAr: 'تغليف الهدية',
    description: 'Hand-wrapped in Afnan paper with a ribbon.',
    descriptionAr: 'تغليف يدوي بورق أفنان مع شريط.',
    productType: 'Service',
    price: 15,
    collections: [],
    tags: ['hidden'],
    art: {liquid: '#c9a24a', cap: '#b23a5b', shape: 'square'},
    hidden: true,
  },
  {
    handle: 'femme-free-gift',
    title: 'Femme Discovery Mini 10ml (Free Gift)',
    titleAr: 'عطر فام صغير 10 مل (هدية مجانية)',
    description: 'A free mini with any Femme Collection purchase.',
    descriptionAr: 'عطر صغير مجاني مع أي عطر من مجموعة فام.',
    productType: 'Free Gift',
    price: 45,
    collections: [],
    tags: ['hidden', 'gwp'],
    art: {liquid: '#f2a7c3', cap: '#c9a24a', shape: 'round'},
    hidden: true,
  },
];
