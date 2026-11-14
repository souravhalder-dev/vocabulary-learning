// TypeScript implementation of authentic English-to-Bengali phonetic pronunciation engine

export const COMMON_PRONUNCIATION_DICT: Record<string, string> = {
  // Pronouns & determiners
  i: "আই",
  me: "মি",
  my: "মাই",
  mine: "মাইন",
  myself: "মাইসেলফ",
  we: "উই",
  us: "আস",
  our: "আওয়ার",
  ours: "আওয়ার্স",
  ourselves: "আওয়ারসেলভস",
  you: "ইউ",
  your: "ইউর",
  yours: "ইউরস",
  yourself: "ইউরসেলফ",
  yourselves: "ইউরসেলভস",
  he: "হি",
  him: "হিম",
  his: "হিজ",
  himself: "হিমসেলফ",
  she: "শী",
  her: "হার",
  hers: "হার্স",
  herself: "হারসেলফ",
  it: "ইট",
  its: "ইটস",
  itself: "ইটসেলফ",
  they: "দে",
  them: "দেম",
  their: "দেয়ার",
  theirs: "দেয়ার্স",
  themselves: "দেমসেলভস",
  this: "দিস",
  that: "দ্যাট",
  these: "দিজ",
  those: "দোজ",
  what: "হোয়াট",
  which: "হুইচ",
  who: "হু",
  whom: "হুম",
  whose: "হুজ",
  whatever: "হোয়াটএভার",
  whoever: "হুএভার",
  the: "দ্য",
  a: "এ",
  an: "অ্যান",

  // Be-verbs, auxiliaries, modals
  am: "অ্যাম",
  is: "ইজ",
  are: "আর",
  was: "ওয়াজ",
  were: "ওয়্যার",
  be: "বি",
  been: "বিন",
  being: "বিয়িং",
  have: "হ্যাভ",
  has: "হ্যাব",
  had: "হ্যাড",
  having: "হ্যাভিং",
  do: "ডু",
  does: "ডাজ",
  did: "ডিড",
  doing: "ডুইং",
  done: "ডান",
  will: "উইল",
  would: "উড",
  shall: "শ্যাল",
  should: "শুড",
  can: "ক্যান",
  could: "কুড",
  may: "মে",
  might: "মাইট",
  must: "মাস্ট",
  need: "নিড",
  dare: "ডেয়ার",
  ought: "অট",
  used: "ইউজড",

  // Prepositions
  to: "টু",
  of: "অব",
  in: "ইন",
  for: "ফর",
  on: "অন",
  with: "উইথ",
  at: "অ্যাট",
  by: "বাই",
  from: "ফ্রম",
  up: "আপ",
  down: "ডাউন",
  about: "অ্যাবাউট",
  into: "ইনটু",
  over: "ওভার",
  under: "আন্ডার",
  above: "অ্যাবভ",
  below: "বিলো",
  after: "আফটার",
  before: "বিফোর",
  between: "বিটুইন",
  among: "অ্যামং",
  through: "থ্রু",
  during: "ডিউরিং",
  without: "উইদাউট",
  within: "উইদিন",
  across: "অ্যাক্রস",
  behind: "বিহাইন্ড",
  beyond: "বিয়ন্ড",
  around: "অ্যারাউন্ড",
  toward: "টুওয়ার্ড",
  towards: "টুওয়ার্ডস",
  upon: "আপন",
  against: "অ্যাগেইন্সট",
  along: "অ্যালং",
  off: "অফ",

  // Conjunctions & connectives
  and: "অ্যান্ড",
  or: "অর",
  but: "বাট",
  so: "সো",
  yet: "ইয়েট",
  nor: "নর",
  if: "ইফ",
  as: "অ্যাজ",
  than: "দ্যান",
  because: "বিকজ",
  while: "হোয়াইল",
  whereas: "হোয়ারঅ্যাজ",
  since: "সিন্স",
  unless: "আনলেস",
  until: "আনটিল",
  whether: "হোয়েদার",
  although: "অলদো",
  though: "দো",
  even: "ইভেন",

  // Question words & Adverbs
  how: "হাউ",
  when: "হোয়েন",
  where: "হোয়ার",
  why: "হোয়াই",
  not: "নট",
  no: "নো",
  yes: "ইয়েস",
  never: "নেভার",
  always: "অলওয়েজ",
  sometimes: "সামটাইমস",
  often: "অফেন",
  usually: "ইউজুয়ালি",
  seldom: "সেলডম",
  rarely: "রেয়ারলি",
  very: "ভেরি",
  quite: "কোয়াইট",
  too: "টু",
  also: "অলসো",
  just: "জাস্ট",
  only: "অনলি",
  well: "ওয়েল",
  back: "ব্যাক",
  still: "স্টিল",
  here: "হিয়ার",
  there: "দেয়ার",
  now: "নাউ",
  then: "দেন",
  again: "অ্যাগেইন",
  already: "অলরেডি",
  almost: "অলমোস্ট",
  perhaps: "পারহ্যাপস",
  probably: "প্রবাবলি",
  certainly: "সার্টেইনলি",
  actually: "অ্যাকচুয়ালি",
  indeed: "ইনডিড",
  together: "টুগেদার",
  away: "অ্যাওয়ে",
  far: "ফার",
  near: "নিয়ার",
  soon: "সুন",
  early: "আর্লি",
  late: "লেট",
  later: "লেটার",

  // Numbers & Ordinals
  one: "ওয়ান",
  two: "টু",
  three: "থ্রি",
  four: "ফোর",
  five: "ফাইভ",
  six: "সিক্স",
  seven: "সেভেন",
  eight: "এইট",
  nine: "নাইন",
  ten: "টেন",
  eleven: "ইলেভেন",
  twelve: "টুয়েলভ",
  twenty: "টুয়েন্টি",
  thirty: "থার্টি",
  forty: "ফরটি",
  fifty: "ফিফটি",
  hundred: "হান্ড্রেড",
  thousand: "থাউজেন্ড",
  million: "মিলিয়ন",
  billion: "বিলিয়ন",
  first: "ফার্স্ট",
  second: "সেকেন্ড",
  third: "থার্ড",
  fourth: "ফোর্থ",
  fifth: "ফিফথ",
  last: "লাস্ট",
  next: "নেক্সট",

  // Core & prompt vocabulary
  revolution: "রেভোলিউশন",
  revolutionary: "রেভোলিউশনারি",
  student: "স্টুডেন্ট",
  students: "স্টুডেন্টস",
  significant: "সিগনিফিক্যান্ট",
  significance: "সিগনিফিক্যান্স",
  resilience: "রেজিলিয়েন্স",
  resilient: "রেজিলিয়েন্ট",
  trying: "ট্রাইং",
  try: "ট্রাই",
  tries: "ট্রাইজ",
  tried: "ট্রাইড",
  improve: "ইমপ্রুভ",
  improves: "ইমপ্রুভস",
  improving: "ইমপ্রুভিং",
  improved: "ইমপ্রুভড",
  improvement: "ইমপ্রুভমেন্ট",
  english: "ইংলিশ",
  reading: "রিডিং",
  read: "রিড",
  reader: "রিডার",
  skills: "স্কিলস",
  skill: "স্কিল",
  creative: "ক্রিয়েটিভ",
  creativity: "ক্রিয়েটিভিটি",
  creatively: "ক্রিয়েটিভলি",
  create: "ক্রিয়েট",
  creating: "ক্রিয়েটিং",
  created: "ক্রিয়েটেড",
  economy: "ইকোনমি",
  economic: "ইকোনমিক",
  economics: "ইকোনমিক্স",
  economist: "ইকোনমিস্ট",
  culture: "কালচার",
  cultural: "কালচারাল",
  culturally: "কালচারালি",
  horizon: "হরাইজন",
  horizons: "হরাইজনস",
  philosophy: "ফিলোসফি",
  philosophical: "ফিলোসফিকাল",
  traditional: "ট্রাডিশনাল",
  tradition: "ট্রাডিশন",
  transformation: "ট্রান্সফরমেশন",
  transform: "ট্রান্সফর্ম",
  transforming: "ট্রান্সফর্মিং",
  undergoing: "আন্ডারগোয়িং",
  undergo: "আন্ডারগো",
  massive: "ম্যাসিভ",
  massively: "ম্যাসিভলি",
  obsolete: "অবসোলেট",
  individual: "ইন্ডিভিজুয়াল",
  individuality: "ইন্ডিভিজুয়ালিটি",
  imagination: "ইমাজিনেশন",
  imagine: "ইমাজিন",
  financial: "ফাইন্যান্সিয়াল",
  finance: "ফাইন্যান্স",
  opinion: "ওপিনিয়ন",
  opinions: "ওপিনিয়নস",
  article: "আর্টিকেল",
  articles: "আর্টিকেলস",
  pillar: "পিলার",
  pillars: "পিলার্স",
  industrial: "ইন্ডাস্ট্রিয়াল",
  industry: "ইন্ডাস্ট্রি",
  began: "বিগান",
  begin: "বিগিন",
  beginning: "বিগিনিং",
  vocabulary: "ভোকাবুলারি",
  learning: "লার্নিং",
  learn: "লার্ন",
  learners: "লার্নার্স",
  curious: "কিউরিয়াস",
  curiosity: "কিউরিওসিটি",
  emphasize: "এমফাসাইজ",
  emphasise: "এমফাসাইজ",
  emphasized: "এমফাসাইজড",
  emphasised: "এমফাসাইজড",
  platform: "প্ল্যাটফর্ম",
  pronunciation: "প্রোনাউন্সিয়েশন",
  meaning: "মিনিং",
  sentence: "সেন্টেন্স",
  sentences: "সেন্টেন্সেস",
  translation: "ট্রান্সলেশন",
  translations: "ট্রান্সলেশনস",
  translate: "ট্রান্সলেট",
  clipboard: "ক্লিপবোর্ড",
  notebook: "নোটবুক",
  document: "ডকুমেন্ট",
  documents: "ডকুমেন্টস",
  knowledge: "নলেজ",
  practice: "প্র্যাকটিস",
  fluency: "ফ্লুয়েন্সি",
  fluent: "ফ্লুয়েন্ট",
  education: "এডুকেশন",
  technology: "টেকনোলজি",
  development: "ডেভেলপমেন্ট",
  opportunity: "অপরচুনিটি",
  opportunities: "অপরচুনিটিজ",
  challenge: "চ্যালেঞ্জ",
  achievement: "অ্যাচিভমেন্ট",
  understand: "আন্ডারস্ট্যান্ড",
  understanding: "আন্ডারস্ট্যান্ডিং",
  comprehension: "কম্প্রিহেনশন",
  confidence: "কনফিডেন্স",
  communication: "কমিউনিকেশন",
  language: "ল্যাঙ্গুয়েজ",
  grammar: "গ্রামার",
  definition: "ডেফিনিশন",
  example: "এক্সাম্পল",
  context: "কনটেক্সট",
  progress: "প্রগ্রেস",
  streak: "স্ট্রিক",
  flashcard: "ফ্ল্যাশকার্ড",
  quiz: "কুইজ",
  review: "রিভিউ",
  memory: "মেমরি",
  remember: "রিমেম্বার",
  intelligence: "ইন্টেলিজেন্স",
  artificial: "আর্টিফিশিয়াল",
  audio: "অডিও",
  speaker: "স্পিকার",
  offline: "অফলাইন",
  online: "অনলাইন",
  library: "লাইব্রেরি",
  settings: "সেটিংস",
  dashboard: "ড্যাশবোর্ড",
  automatic: "অটোমেটিক",
  intelligent: "ইন্টেলিজেন্ট",
  important: "ইম্পর্ট্যান্ট",
  beautiful: "বিউটিফুল",
  wonderful: "ওয়ান্ডারফুল",
  difficult: "ডিফিকাল্ট",
  easy: "ইজি",
  simple: "সিম্পল",
  success: "সাকসেস",
  successful: "সাকসেসফুল",
  effort: "এফোর্ট",
  growth: "গ্রোথ",
  future: "ফিউচার",
  career: "ক্যারিয়ার",
  people: "পিপল",
  world: "ওয়ার্ল্ড",
  time: "টাইম",
  life: "লাইফ",
  work: "ওয়ার্ক",
  study: "স্টাডি",
  book: "বুক",
  system: "সিস্টেম",
  process: "প্রসেস",
  question: "কোশ্চেন",
  answer: "অ্যানসার",
  computer: "কম্পিউটার",
  website: "ওয়েবসাইট",
};

export const COMMON_BENGALI_MEANINGS: Record<string, string> = {
  revolution: "বিপ্লব / আবর্তন / আমূল পরিবর্তন",
  revolutionary: "বিপ্লবী / বৈপ্লবিক",
  student: "শিক্ষার্থী / ছাত্র / ছাত্রী",
  students: "শিক্ষার্থীবৃন্দ / ছাত্রছাত্রীরা",
  significant: "গুরুত্বপূর্ণ / তাৎপর্যপূর্ণ",
  resilience: "প্রতিকূলতা কাটিয়ে ওঠার ক্ষমতা / সহনশীলতা",
  trying: "চেষ্টা করা / সচেষ্ট",
  improve: "উন্নত করা / উন্নতি সাধন করা",
  improving: "উন্নতিসাধন",
  english: "ইংরেজি / ইংরেজি ভাষা",
  reading: "পড়া / পাঠ / অধ্যয়ন",
  skills: "দক্ষতা / নৈপুণ্য",
  skill: "দক্ষতা",
  creative: "সৃজনশীল / উদ্ভাবনী",
  creativity: "সৃজনশীলতা / উদ্ভাবনী ক্ষমতা",
  economy: "অর্থনীতি",
  economic: "অর্থনৈতিক",
  cultural: "সাংস্কৃতিক",
  culture: "সংস্কৃতি",
  horizon: "দিগন্ত",
  horizons: "দিগন্তসমূহ",
  philosophy: "দর্শন",
  traditional: "ঐতিহ্যবাহী / প্রথাগত",
  transformation: "রূপান্তর / যুগান্তকারী পরিবর্তন",
  undergoing: "অতিক্রম করা / মধ্য দিয়ে যাওয়া",
  massive: "বিশাল / বিপুল",
  obsolete: "অপ্রচলিত / সেকেলে",
  individual: "ব্যক্তি / স্বতন্ত্র",
  individuality: "ব্যক্তিস্বাতন্ত্র্য",
  imagination: "কল্পনা / কল্পনাশক্তি",
  financial: "আর্থিক / অর্থনৈতিক",
  finance: "অর্থসংস্থান / অর্থায়ন",
  opinion: "মতামত",
  pillar: "স্তম্ভ / মূল ভিত্তি",
  industrial: "শিল্পসংক্রান্ত / শিল্প",
  began: "শুরু হয়েছিল",
  vocabulary: "শব্দভাণ্ডার / শব্দসম্ভার",
  learning: "শিক্ষাগ্রহণ / শেখা",
  learn: "শেখা",
  fluency: "সাবলীলতা / অনর্গল দক্ষতা",
  fluent: "সাবলীল / অনর্গল",
  knowledge: "জ্ঞান / বিদ্যা",
  practice: "অনুশীলন / চর্চা",
  education: "শিক্ষা",
  technology: "প্রযুক্তি",
  development: "উন্নয়ন / বিকাশ",
  opportunity: "সুযোগ / সম্ভাবনা",
  challenge: "চ্যালেঞ্জ / প্রতিকূলতা",
  achievement: "অর্জন / সাফল্য",
  understand: "বোঝা / অনুধাবন করা",
  comprehension: "বোধগম্যতা / উপলব্ধি",
  confidence: "আত্মবিশ্বাস / প্রত্যয়",
  communication: "যোগাযোগ / ভাববিনিময়",
  language: "ভাষা",
  grammar: "ব্যাকরণ",
  definition: "সংজ্ঞা",
  example: "উদাহরণ",
  context: "প্রসঙ্গ / পটভূমি",
  progress: "অগ্রগতি / উন্নতি",
  streak: "ধারাবাহিকতা",
  flashcard: "ফ্ল্যাশকার্ড",
  memory: "স্মৃতি / স্মরণশক্তি",
  remember: "মনে রাখা / স্মরণ করা",
  intelligence: "বুদ্ধিমত্তা / মেধা",
  artificial: "কৃত্রিম",
  audio: "শ্রব্য / অডিও",
  offline: "অফলাইন (ইন্টারনেট ছাড়া)",
  online: "অনলাইন",
  important: "গুরুত্বপূর্ণ",
  beautiful: "সুন্দর / চমৎকার",
  wonderful: "অসাধারণ / চমৎকার",
  difficult: "কঠিন / জটিল",
  easy: "সহজ / সরল",
  simple: "সহজ / সাধারণ",
  success: "সাফল্য / কৃতকার্য",
  growth: "বৃদ্ধি / বিকাশ",
  future: "ভবিষ্যত",
  career: "পেশা / কর্মজীবন",
  people: "মানুষ / জনগণ",
  world: "পৃথিবী / বিশ্ব",
  time: "সময়",
  life: "জীবন",
  work: "কাজ / কর্ম",
  system: "ব্যবস্থা / পদ্ধতি"
};

const PHONEME_MAP: Record<string, string> = {
  sh: "শ", ch: "চ", th: "থ", ph: "ফ", wh: "হো",
  gh: "গ", kh: "খ", rh: "র", sc: "স্ক", sk: "স্ক",
  sp: "স্প", st: "স্ট", str: "স্ট্র", squ: "স্কু",
  tr: "ট্র", dr: "ড্র", br: "ব্র", cr: "ক্র",
  fr: "ফ্র", gr: "গ্র", pr: "প্র", pl: "প্ল",
  cl: "ক্ল", bl: "ব্ল", fl: "ফ্ল", gl: "গ্ল",
  qu: "কো", ck: "ক", ng: "ং", nk: "ঙ্ক",
  tion: "শন", sion: "শন", tions: "শনস", sions: "শনস",
  ture: "চার", tures: "চার্স",
  cial: "শাল", tial: "শাল",
  cious: "শাস", tious: "শাস",
  ment: "মেন্ট", ments: "মেন্টস",
  b: "ব", c: "ক", d: "ড", f: "ফ", g: "গ",
  h: "হ", j: "জ", k: "ক", l: "ল", m: "ম",
  n: "ন", p: "প", q: "ক", r: "র", s: "স",
  t: "ট", v: "ভ", w: "ওয়", x: "ক্স", y: "ই",
  z: "জ"
};

export function transliterateWordToBengali(word: string, ipa?: string): string {
  const cleanWord = word.replace(/[^a-zA-Z]/g, "").trim().toLowerCase();
  if (!cleanWord) return "";

  // 1. Exact match
  if (COMMON_PRONUNCIATION_DICT[cleanWord]) {
    return COMMON_PRONUNCIATION_DICT[cleanWord];
  }

  // 2. Inflection checks
  if (cleanWord.endsWith("s") && COMMON_PRONUNCIATION_DICT[cleanWord.slice(0, -1)]) {
    return COMMON_PRONUNCIATION_DICT[cleanWord.slice(0, -1)] + "স";
  }
  if (cleanWord.endsWith("es") && COMMON_PRONUNCIATION_DICT[cleanWord.slice(0, -2)]) {
    return COMMON_PRONUNCIATION_DICT[cleanWord.slice(0, -2)] + "েস";
  }
  if (cleanWord.endsWith("ed") && COMMON_PRONUNCIATION_DICT[cleanWord.slice(0, -2)]) {
    return COMMON_PRONUNCIATION_DICT[cleanWord.slice(0, -2)] + "ড";
  }
  if (cleanWord.endsWith("ing") && COMMON_PRONUNCIATION_DICT[cleanWord.slice(0, -3)]) {
    return COMMON_PRONUNCIATION_DICT[cleanWord.slice(0, -3)] + "ইং";
  }
  if (cleanWord.endsWith("ly") && COMMON_PRONUNCIATION_DICT[cleanWord.slice(0, -2)]) {
    return COMMON_PRONUNCIATION_DICT[cleanWord.slice(0, -2)] + "লি";
  }

  // 3. Suffix decomposition
  let w = cleanWord;
  let suffixBengali = "";

  if (w.endsWith("tion")) {
    w = w.slice(0, -4);
    suffixBengali = "শন";
  } else if (w.endsWith("sion")) {
    w = w.slice(0, -4);
    suffixBengali = "শন";
  } else if (w.endsWith("tions")) {
    w = w.slice(0, -5);
    suffixBengali = "শনস";
  } else if (w.endsWith("sions")) {
    w = w.slice(0, -5);
    suffixBengali = "শনস";
  } else if (w.endsWith("ture")) {
    w = w.slice(0, -4);
    suffixBengali = "চার";
  } else if (w.endsWith("ment")) {
    w = w.slice(0, -4);
    suffixBengali = "মেন্ট";
  } else if (w.endsWith("cial") || w.endsWith("tial")) {
    w = w.slice(0, -4);
    suffixBengali = "শাল";
  } else if (w.endsWith("able")) {
    w = w.slice(0, -4);
    suffixBengali = "এবল";
  } else if (w.endsWith("ible")) {
    w = w.slice(0, -4);
    suffixBengali = "ইবল";
  } else if (w.endsWith("ness")) {
    w = w.slice(0, -4);
    suffixBengali = "নেস";
  } else if (w.endsWith("ful")) {
    w = w.slice(0, -3);
    suffixBengali = "ফুল";
  } else if (w.endsWith("ity")) {
    w = w.slice(0, -3);
    suffixBengali = "ইটি";
  }

  if (COMMON_PRONUNCIATION_DICT[w]) {
    return COMMON_PRONUNCIATION_DICT[w] + suffixBengali;
  }

  // 4. Character & Cluster synthesis
  const result: string[] = [];
  let i = 0;
  const len = w.length;

  while (i < len) {
    if (i + 4 <= len && PHONEME_MAP[w.slice(i, i + 4)]) {
      result.push(PHONEME_MAP[w.slice(i, i + 4)]);
      i += 4;
      continue;
    }
    if (i + 3 <= len && PHONEME_MAP[w.slice(i, i + 3)]) {
      result.push(PHONEME_MAP[w.slice(i, i + 3)]);
      i += 3;
      continue;
    }
    if (i + 2 <= len && PHONEME_MAP[w.slice(i, i + 2)]) {
      result.push(PHONEME_MAP[w.slice(i, i + 2)]);
      i += 2;
      continue;
    }

    const char = w[i];
    if (char === "a") {
      result.push(i === 0 ? (len > 3 ? "অ্যা" : "এ") : "া");
    } else if (char === "e") {
      if (i === 0) result.push("এ");
      else if (i !== len - 1) result.push("ে");
    } else if (char === "i") {
      result.push(i === 0 ? "ই" : "ি");
    } else if (char === "o") {
      result.push(i === 0 ? "ও" : "ো");
    } else if (char === "u") {
      result.push(i === 0 ? "ইউ" : "ু");
    } else if (PHONEME_MAP[char]) {
      result.push(PHONEME_MAP[char]);
    } else {
      result.push(char);
    }
    i++;
  }

  const combined = (result.join("") + suffixBengali).replace(/([ািীুূেৈোৌ্])\1+/g, "$1");
  return combined || cleanWord;
}

export function transliterateSentenceToBengali(sentence: string): string {
  const cleanSent = sentence.trim();
  if (!cleanSent) return "";

  const tokens = cleanSent.split(/(\s+|[.,!?;:"'()[\]{}—–])/g);
  const bengaliTokens: string[] = [];

  for (const token of tokens) {
    if (!token) continue;
    if (/^\s+$/.test(token)) {
      bengaliTokens.push(token);
    } else if (token === ".") {
      bengaliTokens.push("।");
    } else if (/^[.,!?;:"'()[\]{}—–]+$/.test(token)) {
      bengaliTokens.push(token);
    } else {
      const clean = token.replace(/[^a-zA-Z]/g, "");
      if (clean) {
        bengaliTokens.push(transliterateWordToBengali(clean));
      } else {
        bengaliTokens.push(token);
      }
    }
  }

  return bengaliTokens.join("").trim();
}
