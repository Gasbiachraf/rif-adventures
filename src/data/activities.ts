import type { Localized } from '../i18n'

export type ActivityType = 'boat' | 'diving' | 'snorkeling' | 'private'
export type DurationBucket = 'short' | 'half' | 'full'
export type Level = 'all' | 'beginner' | 'certified'

export interface Activity {
  slug: string
  type: ActivityType
  durationHours: number
  priceFrom: number
  priceUnit: 'person' | 'boat'
  maxGroup: number
  minAge: number
  level: Level
  image: string
  gallery: string[]
  title: Localized
  tagline: Localized
  description: Localized
  highlights: Localized[]
  included: Localized[]
  notIncluded: Localized[]
  bring: Localized[]
}

// Shared items, reused across activities to keep the data readable.
const water: Localized = { fr: 'Eau fraîche à bord', ar: 'ماء بارد على متن القارب', en: 'Chilled water on board' }
const skipper: Localized = { fr: 'Skipper et équipage', ar: 'ربان وطاقم', en: 'Skipper and crew' }
const snorkelGear: Localized = {
  fr: 'Masque, tuba et palmes',
  ar: 'قناع وأنبوب تنفس وزعانف',
  en: 'Mask, snorkel and fins',
}
const divingGear: Localized = {
  fr: 'Équipement de plongée complet',
  ar: 'معدات غوص كاملة',
  en: 'Full diving equipment',
}
const transfer: Localized = {
  fr: "Transfert depuis l'hôtel",
  ar: 'النقل من الفندق',
  en: 'Hotel transfer',
}
const photos: Localized = { fr: 'Photos sous-marines', ar: 'صور تحت الماء', en: 'Underwater photos' }
const swimwear: Localized = { fr: 'Maillot et serviette', ar: 'ملابس السباحة ومنشفة', en: 'Swimwear and towel' }
const sun: Localized = { fr: 'Crème solaire et chapeau', ar: 'واقي الشمس وقبعة', en: 'Sunscreen and hat' }
const id: Localized = { fr: "Pièce d'identité", ar: 'بطاقة الهوية', en: 'ID document' }
const layer: Localized = { fr: 'Une petite veste pour le retour', ar: 'سترة خفيفة للعودة', en: 'A light jacket for the way back' }
const logbook: Localized = {
  fr: 'Carte de niveau et carnet de plongée',
  ar: 'بطاقة المستوى ودفتر الغوص',
  en: 'Certification card and logbook',
}

export const activities: Activity[] = [
  {
    slug: 'criques-parc-national',
    type: 'boat',
    durationHours: 3,
    priceFrom: 350,
    priceUnit: 'person',
    maxGroup: 10,
    minAge: 4,
    level: 'all',
    image: '/images/calas.webp',
    gallery: ['/images/rocky-coast.webp', '/images/aerial.webp'],
    title: {
      fr: 'Criques du Parc National',
      ar: 'خلجان المنتزه الوطني',
      en: 'National Park Coves',
    },
    tagline: {
      fr: 'Falaises, grottes marines et baignade dans des criques secrètes.',
      ar: 'منحدرات ومغارات بحرية وسباحة في خلجان سرية.',
      en: 'Cliffs, sea caves and swims in hidden coves.',
    },
    description: {
      fr: "Cap à l'ouest le long des falaises du Parc National d'Al Hoceima. On longe les grottes marines, on s'arrête dans des criques accessibles uniquement par la mer, et on prend le temps de se baigner dans une eau limpide.",
      ar: 'نتجه غربًا على طول منحدرات المنتزه الوطني للحسيمة. نمر بمحاذاة المغارات البحرية ونتوقف في خلجان لا يُوصل إليها إلا بحرًا، ونأخذ وقتنا للسباحة في مياه صافية.',
      en: 'Head west along the cliffs of Al Hoceima National Park. Cruise past sea caves, stop in coves only reachable by sea and take time to swim in crystal-clear water.',
    },
    highlights: [
      { fr: 'Navigation le long des falaises', ar: 'إبحار بمحاذاة المنحدرات', en: 'Cruise along the cliffs' },
      { fr: 'Entrée dans une grotte marine (selon la mer)', ar: 'دخول مغارة بحرية (حسب حالة البحر)', en: 'Sea cave visit (sea permitting)' },
      { fr: '2 arrêts baignade et snorkeling', ar: 'توقفان للسباحة والغطس', en: '2 swim and snorkel stops' },
    ],
    included: [skipper, snorkelGear, water],
    notIncluded: [transfer, { fr: 'Repas', ar: 'الوجبات', en: 'Meals' }],
    bring: [swimwear, sun, id],
  },
  {
    slug: 'bapteme-plongee',
    type: 'diving',
    durationHours: 2.5,
    priceFrom: 650,
    priceUnit: 'person',
    maxGroup: 4,
    minAge: 10,
    level: 'beginner',
    image: '/images/bapteme.webp',
    gallery: ['/images/reef-diver.webp', '/images/snorkeling.webp'],
    title: {
      fr: 'Baptême de plongée',
      ar: 'الغوص التجريبي',
      en: 'Try-Dive Experience',
    },
    tagline: {
      fr: 'Vos premières respirations sous l’eau, accompagné pas à pas.',
      ar: 'أنفاسك الأولى تحت الماء، بمرافقة خطوة بخطوة.',
      en: 'Your first breaths underwater, guided step by step.',
    },
    description: {
      fr: 'Pensé pour ceux qui n’ont jamais plongé. Briefing au calme, prise en main du matériel en eau peu profonde, puis une courte immersion accompagnée pour découvrir les fonds rocheux et leurs poissons.',
      ar: 'مصمم لمن لم يغص من قبل. شرح في هدوء، ثم التعرف على المعدات في مياه ضحلة، وبعدها غطسة قصيرة برفقة مرشد لاكتشاف القيعان الصخرية وأسماكها.',
      en: 'Designed for people who have never dived. A calm briefing, getting used to the gear in shallow water, then a short guided dive to discover the rocky seabed and its fish.',
    },
    highlights: [
      { fr: 'Briefing et exercices en surface', ar: 'شرح وتمارين على السطح', en: 'Briefing and surface practice' },
      { fr: 'Immersion accompagnée', ar: 'غطسة برفقة مرشد', en: 'Guided dive' },
      { fr: 'Découverte de la faune locale', ar: 'اكتشاف الحياة البحرية المحلية', en: 'Discover local marine life' },
    ],
    included: [divingGear, { fr: 'Accompagnement individuel', ar: 'مرافقة فردية', en: 'One-to-one guidance' }, water],
    notIncluded: [transfer, photos],
    bring: [swimwear, sun, { fr: 'Questionnaire médical rempli', ar: 'استمارة طبية مملوءة', en: 'Completed medical form' }],
  },
  {
    slug: 'plongee-exploration',
    type: 'diving',
    durationHours: 3,
    priceFrom: 550,
    priceUnit: 'person',
    maxGroup: 6,
    minAge: 12,
    level: 'certified',
    image: '/images/exploration.webp',
    gallery: ['/images/fish-school.webp', '/images/coral.webp'],
    title: {
      fr: 'Plongée exploration',
      ar: 'غوص استكشافي',
      en: 'Guided Exploration Dive',
    },
    tagline: {
      fr: 'Tombants et bancs de poissons, pour plongeurs certifiés.',
      ar: 'جدران بحرية وأسراب أسماك، للغواصين الحاصلين على شهادة.',
      en: 'Drop-offs and schools of fish, for certified divers.',
    },
    description: {
      fr: "Une plongée guidée sur un site rocheux choisi selon les conditions du jour. Tombants, herbiers de posidonie et bancs de poissons : l'occasion de découvrir les fonds méditerranéens du Rif.",
      ar: 'غطسة موجهة في موقع صخري يُختار حسب ظروف اليوم. جدران بحرية ومروج أعشاب بحرية وأسراب أسماك: فرصة لاكتشاف أعماق المتوسط في الريف.',
      en: "A guided dive on a rocky site chosen for the day's conditions. Drop-offs, seagrass meadows and schools of fish: a chance to discover the Rif's Mediterranean seabed.",
    },
    highlights: [
      { fr: 'Site choisi selon la météo', ar: 'موقع يُختار حسب الطقس', en: 'Site picked for the conditions' },
      { fr: 'Une plongée guidée', ar: 'غطسة موجهة واحدة', en: 'One guided dive' },
      { fr: 'Petits groupes par niveau', ar: 'مجموعات صغيرة حسب المستوى', en: 'Small groups by level' },
    ],
    included: [divingGear, { fr: 'Guide de palanquée', ar: 'مرشد غوص', en: 'Dive guide' }, water],
    notIncluded: [transfer, photos],
    bring: [logbook, swimwear, layer],
  },
  {
    slug: 'snorkeling-criques',
    type: 'snorkeling',
    durationHours: 2,
    priceFrom: 250,
    priceUnit: 'person',
    maxGroup: 8,
    minAge: 6,
    level: 'all',
    image: '/images/snorkeling.webp',
    gallery: ['/images/fish-school.webp', '/images/rocky-coast.webp'],
    title: {
      fr: 'Snorkeling dans les criques',
      ar: 'سباحة بالقناع في الخلجان',
      en: 'Cove Snorkeling',
    },
    tagline: {
      fr: 'Masque, tuba et eau turquoise : la mer vue de près.',
      ar: 'قناع وأنبوب تنفس ومياه فيروزية: البحر عن قرب.',
      en: 'Mask, snorkel and turquoise water: the sea up close.',
    },
    description: {
      fr: 'Une courte navigation vers des criques abritées, puis une randonnée palmée le long des rochers. Idéal en famille ou pour une première découverte des fonds marins sans plonger.',
      ar: 'إبحار قصير نحو خلجان محمية، ثم سباحة بالزعانف على طول الصخور. مثالي للعائلات أو لاكتشاف القاع البحري لأول مرة دون غوص.',
      en: 'A short boat ride to sheltered coves, then a snorkel trail along the rocks. Perfect for families or a first look at the seabed without diving.',
    },
    highlights: [
      { fr: 'Courte navigation côtière', ar: 'إبحار ساحلي قصير', en: 'Short coastal ride' },
      { fr: 'Randonnée palmée guidée', ar: 'سباحة موجهة بالزعانف', en: 'Guided snorkel trail' },
      { fr: 'Pause baignade', ar: 'استراحة للسباحة', en: 'Swim break' },
    ],
    included: [snorkelGear, { fr: 'Guide dans l’eau', ar: 'مرشد في الماء', en: 'In-water guide' }, water],
    notIncluded: [transfer, { fr: 'Combinaison (sur demande)', ar: 'بدلة السباحة (عند الطلب)', en: 'Wetsuit (on request)' }],
    bring: [swimwear, sun, id],
  },
  {
    slug: 'coucher-de-soleil',
    type: 'boat',
    durationHours: 2,
    priceFrom: 300,
    priceUnit: 'person',
    maxGroup: 10,
    minAge: 0,
    level: 'all',
    image: '/images/sunset.webp',
    gallery: ['/images/beach-sunset.webp', '/images/swell.webp'],
    title: {
      fr: 'Coucher de soleil en mer',
      ar: 'الغروب في عرض البحر',
      en: 'Sunset at Sea',
    },
    tagline: {
      fr: 'La baie d’Al Hoceima à l’heure dorée.',
      ar: 'خليج الحسيمة في الساعة الذهبية.',
      en: 'Al Hoceima Bay at golden hour.',
    },
    description: {
      fr: "Une sortie tranquille en fin de journée, quand la lumière dore les falaises. On navigue dans la baie, on s'arrête face au soleil couchant et on rentre au port à la tombée de la nuit.",
      ar: 'رحلة هادئة في آخر النهار، حين يكسو الضوء المنحدرات بلون ذهبي. نبحر في الخليج ونتوقف أمام الشمس الغاربة ونعود إلى الميناء مع حلول الليل.',
      en: 'A relaxed late-afternoon trip, when the light turns the cliffs gold. Cruise the bay, pause facing the sunset and head back to port at dusk.',
    },
    highlights: [
      { fr: 'Navigation dans la baie', ar: 'إبحار في الخليج', en: 'Bay cruise' },
      { fr: 'Arrêt face au coucher de soleil', ar: 'توقف أمام الغروب', en: 'Sunset stop' },
      { fr: 'Rafraîchissements à bord', ar: 'مشروبات منعشة على متن القارب', en: 'Refreshments on board' },
    ],
    included: [skipper, { fr: 'Thé et rafraîchissements', ar: 'شاي ومشروبات منعشة', en: 'Tea and refreshments' }],
    notIncluded: [transfer, { fr: 'Dîner', ar: 'العشاء', en: 'Dinner' }],
    bring: [layer, id],
  },
  {
    slug: 'journee-privee',
    type: 'private',
    durationHours: 7,
    priceFrom: 3500,
    priceUnit: 'boat',
    maxGroup: 8,
    minAge: 0,
    level: 'all',
    image: '/images/private.webp',
    gallery: ['/images/calas.webp', '/images/aerial.webp'],
    title: {
      fr: 'Journée privée en bateau',
      ar: 'يوم خاص على متن قارب',
      en: 'Private Boat Day',
    },
    tagline: {
      fr: 'Le bateau rien que pour vous : itinéraire sur mesure.',
      ar: 'القارب لكم وحدكم: مسار حسب رغبتكم.',
      en: 'The boat all to yourselves, with a tailor-made route.',
    },
    description: {
      fr: 'Famille, amis ou occasion spéciale : privatisez le bateau pour la journée. Criques, baignades, snorkeling et déjeuner à bord — l’itinéraire se construit avec vous selon la météo.',
      ar: 'عائلة أو أصدقاء أو مناسبة خاصة: احجزوا القارب ليوم كامل. خلجان وسباحة وغطس وغداء على متن القارب — يُبنى المسار معكم حسب الطقس.',
      en: 'Family, friends or a special occasion: charter the boat for the day. Coves, swims, snorkeling and lunch on board — the route is planned with you around the weather.',
    },
    highlights: [
      { fr: 'Itinéraire personnalisé', ar: 'مسار حسب الطلب', en: 'Custom route' },
      { fr: 'Déjeuner à bord', ar: 'غداء على متن القارب', en: 'Lunch on board' },
      { fr: 'Arrêts baignade à volonté', ar: 'توقفات سباحة حسب الرغبة', en: 'Swim stops as you like' },
    ],
    included: [skipper, snorkelGear, { fr: 'Déjeuner et boissons', ar: 'غداء ومشروبات', en: 'Lunch and drinks' }],
    notIncluded: [transfer, photos],
    bring: [swimwear, sun, id],
  },
]

export function findActivity(slug: string | null | undefined) {
  return activities.find((a) => a.slug === slug)
}

export function durationBucket(hours: number): DurationBucket {
  if (hours <= 2.5) return 'short'
  if (hours < 6) return 'half'
  return 'full'
}

// Fills a 4×2 grid on desktop and a 2×4 grid on mobile: one wide, one tall, four squares.
export const GALLERY = [
  { src: '/images/reef-diver.webp', shape: 'wide' },
  { src: '/images/wave.webp', shape: 'tall' },
  { src: '/images/rocky-coast.webp', shape: 'square' },
  { src: '/images/fish-school.webp', shape: 'square' },
  { src: '/images/beach-sunset.webp', shape: 'square' },
  { src: '/images/coral.webp', shape: 'square' },
] as const
