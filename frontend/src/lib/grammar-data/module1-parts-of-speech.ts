import { GrammarChapter } from '../../types/grammar';

export const MODULE_1_CHAPTERS: GrammarChapter[] = [
  // ── Chapter 1: Parts of Speech & Identification ─────────────────────────────
  {
    id: 'chapter-1',
    chapterNumber: 1,
    lectureNo: 'Lecture-05',
    title: 'Parts of Speech & Identification',
    bengaliTitle: 'পদ প্রকরণ ও পার্টস অব স্পিচ সনাক্তকরণ',
    category: 'Parts of Speech',
    icon: 'Layers',
    bcsFrequency: 'Very High',
    bcsFrequencyNotes: 'বিসিএস প্রিলিমিনারিতে প্রতি বছর ১-৩টি প্রশ্ন আসে। শব্দের অবস্থান (Position) ও সাফিক্স (Suffix) দেখে পদ সনাক্তকরণ সবচেয়ে গুরুত্বপূর্ণ। (৪০তম, ৪১তম, ৪৩তম, ৪৫তম বিসিএস)',
    subchapters: [
      { id: 'sub-1-1', title: 'Classification & Overview', bengaliTitle: 'আট প্রকার পদের প্রাথমিক ধারণা' },
      { id: 'sub-1-2', title: 'Position-Based Identification', bengaliTitle: 'বাক্যে অবস্থানের ভিত্তিতে পদ সনাক্তকরণ' },
      { id: 'sub-1-3', title: 'Suffix & Prefix Clues', bengaliTitle: 'সাফিক্স দেখে পার্টস অব স্পিচ চেনার উপায়' },
      { id: 'sub-1-4', title: 'Same Word as Different Parts of Speech', bengaliTitle: 'একই শব্দের ভিন্ন ভিন্ন পদে ব্যবহার' }
    ],
    rules: [
      {
        id: 'rule-1-1',
        ruleNumber: 1,
        title: 'Determining Part of Speech by Sentence Position',
        bengaliTitle: 'বাক্যের গঠনের মাধ্যমে পার্টস অব স্পিচ নির্ধারণ',
        explanationBn: 'কোনো শব্দ একা থাকলে তার একটি নির্দিষ্ট অর্থ থাকতে পারে, কিন্তু বাক্যে ব্যবহারের ওপর ভিত্তি করেই তার আসল Part of Speech নির্ধারিত হয়। যেমন: Article/Preposition/Possessive Adjective এর পর একটি মাত্র শব্দ বসলে তা সর্বদা Noun হয়।',
        whyAndWhen: 'বিসিএস ও চাকরির পরীক্ষায় আন্ডারলাইন করা শব্দের পদ সনাক্ত করতে বলা হয়। অবস্থানগত নিয়ম জানলে শব্দের অর্থ না জেনেও শতভাগ সঠিক উত্তর দেওয়া যায়।',
        formula: 'Article / Preposition / Possessive Adjective + [Only One Word] = NOUN',
        examples: [
          { english: 'This is the go of the world.', bengali: 'এটাই জগতের নিয়ম।', note: "'the' (article) এবং 'of' (preposition) এর মাঝে একটি মাত্র শব্দ 'go', তাই এটি Noun (অর্থ: নিয়ম/রীতি)।" },
          { english: 'He is on the committee.', bengali: 'তিনি কমিটির সদস্য।', note: "'the' এর পর 'committee' একটি মাত্র শব্দ, তাই Noun।" },
          { english: 'I have no patience.', bengali: 'আমার কোনো ধৈর্য নেই।', note: "'no' (Adjective/Determiner) এর পর 'patience' বসেছে, তাই এটি Noun।" }
        ],
        correctVsIncorrect: [
          { correct: 'This is the need of the hour.', incorrect: 'This is the need to the hour.', reasonBn: "'the' এর পর 'need' এখানে Noun হিসেবে ব্যবহৃত হয়েছে।" },
          { correct: 'Wait for a while.', incorrect: 'Wait for a while time.', reasonBn: "'for a while' ফ্রেজে 'a' এর পর 'while' একটি Noun।" }
        ],
        commonMistakes: [
          'অনেকে "go", "need", "walk" দেখলেই ভাবেন এগুলো শুধু Verb। মনে রাখবেন: "He went for a walk" বাক্যে "a" এর পর "walk" নিশ্চিতভাবে একটি Noun।'
        ],
        exceptions: [
          'যদি Article + Word + Noun থাকে, তবে মাঝের শব্দটি Adjective হবে। যেমন: "He is a good boy" (good = Adjective)।'
        ],
        examTricks: [
          'শর্টকাট সূত্র: Determiner + Adverb + Adjective + Noun। যেমন: "A very good boy" (A = Det, very = Adv, good = Adj, boy = Noun)। ডানদিক থেকে বামে আসুন!'
        ],
        confusingRelatedRules: [
          'Rule 1-2: Article + Adjective + Noun এর নিয়মের সাথে এটি মিলিয়ে ফেলা যাবে না।'
        ],
        practiceMcqs: [
          {
            id: 'mcq-1-1-1',
            question: 'This is the go of the world. Here "go" is a/an:',
            options: ['Verb', 'Noun', 'Adjective', 'Adverb'],
            correctIndex: 1,
            explanationBn: 'Article "the" এবং Preposition "of" এর মাঝে একটি মাত্র শব্দ "go" থাকায় এটি Noun হিসেবে কাজ করছে।',
            difficulty: 'intermediate',
            isBcsPastQuestion: true,
            bcsYearTag: '৩৮তম বিসিএস'
          }
        ]
      },
      {
        id: 'rule-1-2',
        ruleNumber: 2,
        title: 'Identifying Adjectives Qualifying Nouns and Above Rule',
        bengaliTitle: 'Noun এর পূর্বে বসে Adjective এর ভূমিকা (৪০তম বিসিএস স্পেশাল)',
        explanationBn: 'যেকোনো শব্দ—তা সাধারণ অবস্থায় Adverb বা Preposition হোক না কেন—যদি সরাসরি কোনো Noun এর ঠিক পূর্বে বসে সেই Noun-কে বিশেষায়িত করে, তবে তা নিশ্চিতভাবে Adjective হবে।',
        whyAndWhen: '৪০তম বিসিএসে ঠিক এই নিয়ম থেকে সরাসরি প্রশ্ন এসেছে। এটি বিসিএসের অন্যতম প্রিয় প্রশ্ন প্যাটার্ন।',
        formula: 'Word + Noun = ADJECTIVE (সেই শব্দটি Noun-কে মডিফাই করে)',
        examples: [
          { english: 'Please write to me at the above address.', bengali: 'অনুগ্রহ করে আমাকে উপরের ঠিকানায় চিঠি লিখবেন।', note: "'above' সাধারণত Preposition/Adverb হলেও এখানে Noun 'address' এর পূর্বে বসেছে, তাই এটি Adjective।" },
          { english: 'A down train has arrived.', bengali: 'একটি ডাউন ট্রেন এসে পৌঁছেছে।', note: "'down' এখানে Noun 'train' এর পূর্বে বসে Adjective হয়েছে।" },
          { english: 'I have no money.', bengali: 'আমার কাছে কোনো টাকা নেই।', note: "'money' (Noun) এর পূর্বে 'no' বসে Adjective (Determiner) হয়েছে।" }
        ],
        correctVsIncorrect: [
          { correct: 'He looked above.', incorrect: 'He looked above address.', reasonBn: 'প্রথম বাক্যে "above" একাকী বসেছে তাই Adverb (কোথায় তাকালো? উপরে)। কিন্তু "above address" এ "above" হলো Adjective।' }
        ],
        commonMistakes: [
          '"above" দেখলেই Preposition দাগানো ভুল। দেখতে হবে তার পর Noun আছে কি না এবং সে Noun-এর গুণ প্রকাশ করছে কি না।'
        ],
        exceptions: [
          'যদি Preposition এর পর Object বসে সম্পর্ক প্রকাশ করে, যেমন: "The sky is above us", তবে "above" হলো Preposition।'
        ],
        examTricks: [
          'টেস্ট টেকনিক: "কোন ঠিকানায়?" - "উপরের ঠিকানায় (above address)"। Which/What kind of দিয়ে প্রশ্ন করে উত্তর পেলে তা ১০০% Adjective।'
        ],
        confusingRelatedRules: [
          'Adverb of Place: "The bird flew above" (এখানে above = Adverb)।'
        ],
        practiceMcqs: [
          {
            id: 'mcq-1-2-1',
            question: 'Please write to me at the above address. Here "above" is a/an:',
            options: ['Noun', 'Adjective', 'Pronoun', 'Adverb'],
            correctIndex: 1,
            explanationBn: '৪০তম বিসিএসের প্রশ্ন। "address" একটি Noun, আর Noun এর ঠিক পূর্বে বসে তার পরিচয় নির্দেশ করায় "above" এখানে Adjective।',
            difficulty: 'intermediate',
            isBcsPastQuestion: true,
            bcsYearTag: '৪০তম বিসিএস'
          }
        ]
      }
    ],
    bcsQuestions: [
      {
        id: 'bcs-1-1',
        bcsExam: '৪০তম বিসিএস',
        year: 2019,
        question: 'Please write to me at the above address. Here "above" is a/an:',
        options: [
          { key: 'A', text: 'noun' },
          { key: 'B', text: 'adjective' },
          { key: 'C', text: 'pronoun' },
          { key: 'D', text: 'adverb' }
        ],
        correctOption: 'B',
        detailedExplanationBn: 'বাক্যটিতে "address" শব্দটি একটি Noun। Noun এর ঠিক পূর্বে বসে "above" শব্দটি বোঝাচ্ছে "কোন ঠিকানা?" অর্থাৎ উপরের ঠিকানা। যেহেতু শব্দটি Noun-কে বিশেষায়িত করছে, তাই এটি একটি Adjective।',
        optionBreakdown: [
          { option: 'A (noun)', isCorrect: false, reasonBn: 'above এখানে কোনো কিছুর নাম নয়, বরং ঠিকানার অবস্থা বোঝাচ্ছে।' },
          { option: 'B (adjective)', isCorrect: true, reasonBn: 'Noun (address) এর ঠিক পূর্বে বসে Adjective হিসেবে মডিফাই করেছে।' },
          { option: 'C (pronoun)', isCorrect: false, reasonBn: 'Noun এর পরিবর্তে বসেনি, তাই Pronoun হওয়ার কোনো সুযোগ নেই।' },
          { option: 'D (adverb)', isCorrect: false, reasonBn: 'যদি বলা হতো "Look above", তখন Verb "look" কে মডিফাই করে Adverb হতো। কিন্তু এখানে Noun এর পূর্বে বসেছে।' }
        ],
        testedRuleRef: 'rule-1-2',
        trapPattern: 'সাধারণত ছাত্ররা মুখস্থ রাখে above মানে Preposition/Adverb। পরীক্ষক ইচ্ছাকৃতভাবে Noun এর আগে বসিয়ে Adjective যাচাই করেছেন।'
      },
      {
        id: 'bcs-1-2',
        bcsExam: '৩৮তম বিসিএস',
        year: 2018,
        question: 'This is the go of the world. Here "go" is a/an:',
        options: [
          { key: 'A', text: 'Verb' },
          { key: 'B', text: 'Noun' },
          { key: 'C', text: 'Adjective' },
          { key: 'D', text: 'Adverb' }
        ],
        correctOption: 'B',
        detailedExplanationBn: 'ইংরেজি ব্যাকরণের নিয়ম অনুসারে, Article (the) এবং Preposition (of) এর মাঝে যখন একটি মাত্র শব্দ বসে, তখন সেই শব্দটি নির্দ্বিধায় Noun হয়। এখানে "go" শব্দের অর্থ রীতি বা নিয়ম (custom/fashion)।',
        optionBreakdown: [
          { option: 'A (Verb)', isCorrect: false, reasonBn: 'go সাধারণত verb হলেও Article এর পর একাকী বসলে তা Noun হয়ে যায়।' },
          { option: 'B (Noun)', isCorrect: true, reasonBn: 'The + Noun + of কাঠামোতে গঠিত হয়েছে।' },
          { option: 'C (Adjective)', isCorrect: false, reasonBn: 'কোনো Noun এর পূর্বে বসেনি।' },
          { option: 'D (Adverb)', isCorrect: false, reasonBn: 'কোনো Verb, Adjective বা অন্য কোনো Adverb কে মডিফাই করেনি।' }
        ],
        testedRuleRef: 'rule-1-1',
        trapPattern: 'শব্দটি দেখে Verb মনে হলেও ব্যাকরণিক পজিশন Noun নির্দেশ করে।'
      }
    ],
    practiceQuestions: [
      {
        id: 'p-1-1',
        question: 'In the sentence "I have no money", what part of speech is "no"?',
        options: ['Adverb', 'Adjective', 'Pronoun', 'Conjunction'],
        correctIndex: 1,
        explanationBn: '৪০তম বিসিএসে আসা প্রশ্ন। Noun (money) এর পূর্বে বসে "no" পরিমাণ নির্দেশ করেছে (Determiner), তাই এটি Adjective।',
        difficulty: 'intermediate',
        isBcsPastQuestion: true,
        bcsYearTag: '৪০তম বিসিএস'
      },
      {
        id: 'p-1-2',
        question: 'Still waters run deep. Here "Still" is a/an:',
        options: ['Noun', 'Adjective', 'Adverb', 'Verb'],
        correctIndex: 1,
        explanationBn: '"waters" Noun-এর পূর্বে বসে তার শান্ত অবস্থা প্রকাশ করায় "Still" একটি Adjective।',
        difficulty: 'intermediate',
        isBcsPastQuestion: true,
        bcsYearTag: '২৯তম বিসিএস'
      },
      {
        id: 'p-1-3',
        question: 'Which of the following words is a Noun?',
        options: ['Accept', 'Acceptable', 'Acceptance', 'Acceptably'],
        correctIndex: 2,
        explanationBn: 'শব্দের শেষে -ance, -ence থাকলে তা Noun হয়। যেমন: Acceptance (Noun), Accept (Verb), Acceptable (Adjective), Acceptably (Adverb)।',
        difficulty: 'beginner',
        isBcsPastQuestion: false
      }
    ],
    summaryRevisionNotes: [
      'Determiner + Adverb + Adjective + Noun হলো মৌলিক সূত্র।',
      'Article এবং Preposition এর মাঝে একটি শব্দ = Noun।',
      'Noun এর ঠিক পূর্বে বসা যেকোনো শব্দ = Adjective।',
      'সাফিক্স দেখে চেনার উপায়: -tion, -sion, -ment, -ness, -ance, -ence, -ity, -hood, -ship থাকলে Noun হয়।',
      '-ful, -less, -able, -ive, -ous, -ic, -al থাকলে সাধারণত Adjective হয়।'
    ]
  },

  // ── Chapter 2: The Noun ─────────────────────────────────────────────────────
  {
    id: 'chapter-2',
    chapterNumber: 2,
    lectureNo: 'Lecture-01',
    title: 'The Noun: Classification, Countable & Uncountable',
    bengaliTitle: 'বিশেষ্য পদ: প্রকারভেদ, গণনাযোগ্য ও অগণনাযোগ্য বিশেষ্য',
    category: 'Parts of Speech',
    icon: 'BookOpen',
    bcsFrequency: 'Very High',
    bcsFrequencyNotes: 'প্রতি বছর বিসিএসে Noun এর প্রকারভেদ (Proper, Common, Collective, Material, Abstract) এবং Uncountable Noun এর সাথে Determiner এর ব্যবহার থেকে প্রশ্ন থাকে। (৪৫তম, ৪৩তম, ৪১তম, ৩৭তম, ৩৫তম বিসিএস)',
    subchapters: [
      { id: 'sub-2-1', title: '5 Classic Types of Nouns', bengaliTitle: '৫ প্রকার নাউনের নিখুঁত পার্থক্য' },
      { id: 'sub-2-2', title: 'Collective Noun & Subject-Verb Agreement', bengaliTitle: 'কালেক্টিভ নাউন ও ভার্ব নির্বাচন' },
      { id: 'sub-2-3', title: 'Abstract & Material Nouns', bengaliTitle: 'অ্যাবস্ট্রাক্ট ও ম্যাটেরিয়াল নাউনের নিয়ম' },
      { id: 'sub-2-4', title: 'Countable vs Uncountable Nouns', bengaliTitle: 'কাউন্টেবল ও আনকাউন্টেবল নাউন লিস্ট' }
    ],
    rules: [
      {
        id: 'rule-2-1',
        ruleNumber: 1,
        title: 'Proper vs Common vs Collective Noun Distinction',
        bengaliTitle: 'প্রোপার, কমন ও কালেক্টিভ নাউনের মৌলিক পার্থক্য',
        explanationBn: 'Proper Noun হলো নির্দিষ্ট নাম (Dhaka, Padma, Shakespeare)। Common Noun হলো একই জাতীয় সকলের সাধারণ নাম (City, River, Poet)। আর Collective Noun হলো সমজাতীয় কিছুর অবিভাজ্য দল বা সমষ্টি (Class, Herd, Fluck, Team, Jury, Cattle)।',
        whyAndWhen: 'বিসিএসে বারবার কোনো একটি Noun দিয়ে জানতে চাওয়া হয় এটি কোন প্রকারের Noun। যেমন: River (Common), Cattle (Collective), Discipline (Abstract)।',
        formula: 'Proper (একক নির্দিষ্ট নাম) ➔ Common (একই জাতের সাধারণ নাম) ➔ Collective (সমজাতীয়র দল)',
        examples: [
          { english: 'The Padma is a mighty river.', bengali: 'পদ্মা একটি প্রমত্তা নদী।', note: "Padma = Proper Noun, river = Common Noun।" },
          { english: 'A herd of cattle is passing.', bengali: 'একদল গবাদিপশু অতিক্রম করছে।', note: "herd = Collective Noun, cattle = Collective Noun।" },
          { english: 'Discipline is essential for success.', bengali: 'শৃঙ্খলা সফলতার জন্য অপরিহার্য।', note: "discipline = Abstract Noun (দেখা/স্পর্শ করা যায় না, শুধু অনুভবযোগ্য)।" }
        ],
        correctVsIncorrect: [
          { correct: 'Cattle are grazing in the field.', incorrect: 'Cattles are grazing in the field.', reasonBn: "'Cattle' শব্দটি নিজেই বহুবচন বোধক কালেক্টিভ নাউন, এর সাথে 's' যুক্ত হয় না এবং Verb প্লুরাল হয়।" },
          { correct: 'The jury were divided in their opinions.', incorrect: 'The jury was divided in their opinions.', reasonBn: 'কালেক্টিভ নাউনের সদস্যরা মতভেদ করলে তা "Noun of Multitude" হয় এবং Verb বহুবচন হয়।' }
        ],
        commonMistakes: [
          'অনেকে "Cattle", "People", "Poultry" কে একবচন ভেবে ভুল করেন। এগুলো দেখতে একবচনের মতো হলেও সর্বদা বহুবচন হিসেবে ব্যবহৃত হয়।'
        ],
        exceptions: [
          'Proper Noun এর পূর্বে Article "the" এবং পরে "of" বসলে তা Common Noun হয়ে যায়! যেমন: "Nazrul is the Byron of Bangladesh" (এখানে Byron = Common Noun)।'
        ],
        examTricks: [
          'বিসিএস কমন ট্রিক: কোনো প্রোপার বা ম্যাটেরিয়াল নাউনের আগে "the" এবং পরে "of" আসলেই তা কমন নাউন হয়ে যায়। যেমন: "The water of this pond" (এখানে water কমন নাউন)।'
        ],
        confusingRelatedRules: [
          'Noun of Multitude: Collective Noun একতাবদ্ধ থাকলে Verb Singular, বিভক্ত হলে Verb Plural।'
        ],
        practiceMcqs: [
          {
            id: 'mcq-2-1-1',
            question: 'What kind of noun is "River"?',
            options: ['Proper noun', 'Common noun', 'Collective noun', 'Material noun'],
            correctIndex: 1,
            explanationBn: '৪৫তম বিসিএসের প্রশ্ন। River দ্বারা যেকোনো নদীকে সাধারণভাবে বোঝায়, তাই এটি Common Noun। কিন্তু Padma, Meghna হলো Proper Noun।',
            difficulty: 'beginner',
            isBcsPastQuestion: true,
            bcsYearTag: '৪৫তম বিসিএস'
          }
        ]
      },
      {
        id: 'rule-2-2',
        ruleNumber: 2,
        title: 'Uncountable Noun Rules & Quantity Determiners',
        bengaliTitle: 'অগণনাযোগ্য বিশেষ্য (Uncountable Nouns) এর গুরুত্বপূর্ণ নিয়ম',
        explanationBn: 'যেসব Noun গণনা করা যায় না, শুধু পরিমাপ করা যায়, সেগুলোকে Uncountable Noun বলে (e.g., Information, Advice, Furniture, Luggage, Baggage, Poetry, Scenery, Bread, Soap, Hair)। এগুলোর সাথে কখনও s/es যুক্ত হয়ে বহুবচন হয় না এবং এদের পূর্বে সরাসরি a/an বসে না।',
        whyAndWhen: 'চাকরির পরীক্ষায় "Informations", "Furnitures" দিয়ে ভুল বাক্য দেওয়া হয়। সঠিক রূপ জানতে এই নিয়ম অপরিহার্য।',
        formula: 'Uncountable Noun + ALWAYS Singular Verb | NO plural s/es | NO direct a/an',
        examples: [
          { english: 'He gave me some good advice.', bengali: 'তিনি আমাকে কিছু ভালো উপদেশ দিয়েছিলেন।', note: "'advice' আনকাউন্টেবল, তাই 'an advice' বা 'advices' সম্পূর্ণ ভুল।" },
          { english: 'All the furniture was sold.', bengali: 'সব আসবাবপত্র বিক্রি হয়ে গিয়েছিল।', note: "'furniture' সর্বদা সিঙ্গুলার, তাই Verb 'was' হয়েছে।" },
          { english: 'I need a piece of information.', bengali: 'আমার একটি তথ্য প্রয়োজন।', note: "একটি তথ্য বোঝাতে 'a piece of information' বলতে হয়।" }
        ],
        correctVsIncorrect: [
          { correct: 'He provided useful information.', incorrect: 'He provided useful informations.', reasonBn: 'Information আনকাউন্টেবল, বহুবচন হয় না।' },
          { correct: 'The scenery of Cox’s Bazar is charming.', incorrect: 'The sceneries of Cox’s Bazar are charming.', reasonBn: 'Scenery এর কোনো বহুবচন নেই, Verb সর্বদা Singular (is)।' }
        ],
        commonMistakes: [
          'Poetry এবং Poem এর পার্থক্য: Poem কাউন্টেবল (a poem, two poems), কিন্তু Poetry আনকাউন্টেবল (The poetry of Keats)।'
        ],
        exceptions: [
          'একক বোঝাতে বিশেষ পরিমাপক শব্দ লাগে: a piece of advice, an article of luggage, a loaf of bread, a bar of soap।'
        ],
        examTricks: [
          'মুখস্থ রাখার ছন্দ: "Advice, Information, Furniture, Luggage, Baggage, Scenery, Poetry, Machinery, Soap, Bread" - এদের সাথে কখনও s যোগ হবে না, Verb ও Singular হবে!'
        ],
        confusingRelatedRules: [
          'Determiner: Uncountable এর সাথে Much/Little বসে, Many/Few বসে না।'
        ],
        practiceMcqs: [
          {
            id: 'mcq-2-2-1',
            question: 'Which of the following sentences is correct?',
            options: [
              'He gave me an advice',
              'He gave me many advices',
              'He gave me some advice',
              'He gave me few advices'
            ],
            correctIndex: 2,
            explanationBn: 'Advice একটি Uncountable Noun। এর আগে "an" বসে না, বহুবচনে "advices" হয় না, এবং "few" বসে না। তাই "some advice" সঠিক।',
            difficulty: 'intermediate',
            isBcsPastQuestion: true,
            bcsYearTag: '৩৮তম বিসিএস'
          }
        ]
      }
    ],
    bcsQuestions: [
      {
        id: 'bcs-2-1',
        bcsExam: '৪৫তম বিসিএস',
        year: 2023,
        question: 'What kind of noun is "River"?',
        options: [
          { key: 'A', text: 'Proper noun' },
          { key: 'B', text: 'Common noun' },
          { key: 'C', text: 'Collective noun' },
          { key: 'D', text: 'Material noun' }
        ],
        correctOption: 'B',
        detailedExplanationBn: '"River" শব্দটি নির্দিষ্ট কোনো একটি নদীর নাম নয়, বরং পৃথিবীর যেকোনো নদীকেই বোঝায়। এটি একজাতীয় সকল নদীর সাধারণ নাম, তাই এটি Common Noun।',
        optionBreakdown: [
          { option: 'A (Proper)', isCorrect: false, reasonBn: 'যদি পদ্মা, মেঘনা, যমুনা বলা হতো তবে প্রোপার নাউন হতো।' },
          { option: 'B (Common)', isCorrect: true, reasonBn: 'সমজাতীয় সবার সাধারণ নাম বুঝিয়েছে।' },
          { option: 'C (Collective)', isCorrect: false, reasonBn: 'কোনো দল বা সমষ্টি বোঝায়নি।' },
          { option: 'D (Material)', isCorrect: false, reasonBn: 'কোনো বস্তু বা উপাদান নয়।' }
        ],
        testedRuleRef: 'rule-2-1',
        trapPattern: 'নদীর নাম (Proper) আর "নদী" সাধারণ পরিচয় (Common) এর মধ্যে পার্থক্য যাচাই।'
      },
      {
        id: 'bcs-2-2',
        bcsExam: '৩৭তম বিসিএস',
        year: 2016,
        question: 'What kind of noun is "Cattle"?',
        options: [
          { key: 'A', text: 'Proper' },
          { key: 'B', text: 'Common' },
          { key: 'C', text: 'Collective' },
          { key: 'D', text: 'Material' }
        ],
        correctOption: 'C',
        detailedExplanationBn: '"Cattle" অর্থ গবাদিপশুর পাল বা সমষ্টি। এটি সমজাতীয় পশুর সমষ্টিকে বোঝায়, তাই এটি Collective Noun। লক্ষণীয় যে Cattle সর্বদা বহুবচন হিসেবে Verb Plural নেয়।',
        optionBreakdown: [
          { option: 'A', isCorrect: false, reasonBn: 'নির্দিষ্ট কোনো একটি পশুর নাম নয়।' },
          { option: 'B', isCorrect: false, reasonBn: 'Cow বা Bull হলো Common Noun, কিন্তু তাদের সমষ্টি Cattle হলো Collective Noun।' },
          { option: 'C', isCorrect: true, reasonBn: 'সমষ্টি নির্দেশক Noun।' },
          { option: 'D', isCorrect: false, reasonBn: 'পদার্থ বা কাঁচামাল নয়।' }
        ],
        testedRuleRef: 'rule-2-1',
        trapPattern: 'Cow (Common) বনাম Cattle (Collective) এর দ্বন্দ্ব তৈরি করা।'
      }
    ],
    practiceQuestions: [
      {
        id: 'p-2-1',
        question: 'What kind of noun is "Discipline"?',
        options: ['Proper', 'Common', 'Collective', 'Abstract'],
        correctIndex: 3,
        explanationBn: '৪১তম বিসিএসের প্রশ্ন। Discipline (শৃঙ্খলা) ইন্দ্রিয় দ্বারা স্পর্শ বা দেখা যায় না, শুধু উপলব্ধি করা যায়। তাই এটি Abstract Noun।',
        difficulty: 'beginner',
        isBcsPastQuestion: true,
        bcsYearTag: '৪১তম বিসিএস'
      },
      {
        id: 'p-2-2',
        question: 'Identify the collective noun in: "A herd of cattle is passing."',
        options: ['passing', 'cattle', 'herd', 'is'],
        correctIndex: 2,
        explanationBn: '৪৫তম বিসিএসে আসা প্রশ্ন। এখানে "herd" (পাল/দল) হলো Collective Noun।',
        difficulty: 'intermediate',
        isBcsPastQuestion: true,
        bcsYearTag: '৪৫তম বিসিএস'
      }
    ],
    summaryRevisionNotes: [
      'Proper Noun: নির্দিষ্ট ব্যক্তি, স্থান, গ্রন্থের একক নাম।',
      'Common Noun: একই জাতীয় ব্যক্তি/বস্তুর সাধারণ নাম (Boy, River, City)।',
      'Collective Noun: দল বা সমষ্টি (Army, Herd, Fleet, Jury, Class)।',
      'Material Noun: ওজন করা যায় কিন্তু গণনা করা যায় না এমন পদার্থ (Water, Gold, Milk)।',
      'Abstract Noun: গুণ, অবস্থা বা কাজের নাম (Honesty, Childhood, Freedom)।',
      'Uncountable Noun এর সাথে কখনোই s/es হয় না এবং এদের পূর্বে সরাসরি a/an বসে না।'
    ]
  },

  // ── Chapter 3: Number & Gender ──────────────────────────────────────────────
  {
    id: 'chapter-3',
    chapterNumber: 3,
    lectureNo: 'Lecture-11',
    title: 'Number & Gender: Irregular Plurals & Foreign Forms',
    bengaliTitle: 'বচন ও লিঙ্গ: অনিয়মিত বহুবচন এবং বিদেশি শব্দের রূপান্তর',
    category: 'Parts of Speech',
    icon: 'Users',
    bcsFrequency: 'High',
    bcsFrequencyNotes: 'ল্যাটিন ও গ্রিক বহুবচন (যেমন: Radius -> Radii, Criterion -> Criteria, Oasis -> Oases) এবং ব্যতিক্রমী লিঙ্গ পরিবর্তন থেকে বারবার প্রশ্ন আসে। (৪৬তম, ৪৪তম, ৩৫তম বিসিএস)',
    subchapters: [
      { id: 'sub-3-1', title: 'Foreign Plurals (Latin & Greek)', bengaliTitle: 'বিদেশি শব্দের বহুবচন গঠনের নিয়ম' },
      { id: 'sub-3-2', title: 'Always Singular & Always Plural Nouns', bengaliTitle: 'সর্বদা একবচন ও সর্বদা বহুবচন নাউন' },
      { id: 'sub-3-3', title: 'Gender Transformation Rules', bengaliTitle: 'পুংলিঙ্গ ও স্ত্রীলিঙ্গের ব্যতিক্রমী রূপান্তর' }
    ],
    rules: [
      {
        id: 'rule-3-1',
        ruleNumber: 1,
        title: 'Latin & Greek Irregular Plurals in Competitive Exams',
        bengaliTitle: 'ল্যাটিন ও গ্রিক শব্দের বহুবচন করার ম্যাজিক নিয়ম',
        explanationBn: 'যেসব ইংরেজি শব্দ ল্যাটিন বা গ্রিক ভাষা থেকে এসেছে, সেগুলোর বহুবচন সাধারণ -s বা -es যোগ করে হয় না। এদের নির্দিষ্ট সাফিক্স পরিবর্তন নিয়ম মেনে চলে। যেমন: -us থাকলে -i হয়, -um/on থাকলে -a হয়, -is থাকলে -es হয়।',
        whyAndWhen: '৩৫তম ও ৪৬তম বিসিএস সহ সব ব্যাংকিং ও পিএসসি পরীক্ষায় একটি ল্যাটিন/গ্রিক বহুবচন নিশ্চিতভাবে থাকে।',
        formula: '-us ➔ -i | -is ➔ -es | -um/-on ➔ -a | -a ➔ -ae | -ex/-ix ➔ -ices',
        examples: [
          { english: 'Radius ➔ Radii', bengali: 'ব্যাসার্ধ ➔ ব্যাসার্ধসমূহ', note: "৩৫তম বিসিএসে আসা প্রশ্ন। -us পরিবর্তিত হয়ে -i হয়েছে।" },
          { english: 'Criterion ➔ Criteria', bengali: 'মানদণ্ড ➔ মানদণ্ডসমূহ', note: "-on পরিবর্তিত হয়ে -a হয়েছে। Criteria শব্দটি বহুবচন।" },
          { english: 'Crisis ➔ Crises', bengali: 'সংকট ➔ সংকটসমূহ', note: "-is পরিবর্তিত হয়ে -es হয়েছে।" },
          { english: 'Oasis ➔ Oases', bengali: 'মরূদ্যান ➔ মরূদ্যানসমূহ', note: "একবচনে Oasis, বহুবচনে Oases।" }
        ],
        correctVsIncorrect: [
          { correct: 'These criteria are important.', incorrect: 'These criterias are important.', reasonBn: 'Criteria নিজেই বহুবচন, তাই Criterias লেখা ভুল এবং এর সাথে Verb Plural (are) হবে।' },
          { correct: 'The data are accurate.', incorrect: 'The datas are accurate.', reasonBn: 'Datum একবচন, Data বহুবচন।' }
        ],
        commonMistakes: [
          'Phenomenon (একবচন) বনাম Phenomena (বহুবচন)। Phenomenons বলে কোনো শব্দ ইংরেজিতে নেই!'
        ],
        exceptions: [
          'কিছু শব্দের একবচন ও বহুবচন একই থাকে: Sheep, Deer, Species, Series, Aircraft (৪৬তম বিসিএস)।'
        ],
        examTricks: [
          'শর্টকাট ছক: \n• Focus -> Foci \n• Syllable -> Syllabi \n• Basis -> Bases \n• Thesis -> Theses \n• Medium -> Media \n• Curriculum -> Curricula'
        ],
        confusingRelatedRules: [
          'Alumna (স্ত্রীবাচক একবচন) -> Alumnae (স্ত্রীবাচক বহুবচন)। Alumnus (পুরুষবাচক একবচন) -> Alumni (পুরুষবাচক বহুবচন)।'
        ],
        practiceMcqs: [
          {
            id: 'mcq-3-1-1',
            question: 'What is the plural of "Radius"?',
            options: ['Radiuses', 'Radii', 'Radies', 'Radia'],
            correctIndex: 1,
            explanationBn: '৩৫তম বিসিএসের প্রশ্ন। ল্যাটিন নিয়ম অনুসারে -us যুক্ত শব্দের বহুবচনে -i হয়। তাই Radius এর বহুবচন Radii।',
            difficulty: 'intermediate',
            isBcsPastQuestion: true,
            bcsYearTag: '৩৫তম বিসিএস'
          }
        ]
      }
    ],
    bcsQuestions: [
      {
        id: 'bcs-3-1',
        bcsExam: '৩৫তম বিসিএস',
        year: 2015,
        question: 'What is the plural of "Radius"?',
        options: [
          { key: 'A', text: 'Radius' },
          { key: 'B', text: 'Radiuses' },
          { key: 'C', text: 'Radii' },
          { key: 'D', text: 'Radia' }
        ],
        correctOption: 'C',
        detailedExplanationBn: 'Radius একটি ল্যাটিন শব্দ। ল্যাটিন শব্দাবলির শেষে -us থাকলে বহুবচন করতে -us বাদ দিয়ে -i যোগ করতে হয় (Radius -> Radii)।',
        optionBreakdown: [
          { option: 'A', isCorrect: false, reasonBn: 'একবচন রূপ রাখা হয়েছে।' },
          { option: 'B', isCorrect: false, reasonBn: 'সাধারণ ইংরেজি নিয়মে s/es যোগ করা হয়েছে যা ল্যাটিন শব্দের জন্য প্রযোজ্য নয়।' },
          { option: 'C', isCorrect: true, reasonBn: 'ল্যাটিন ব্যাকরণিক সঠিক বহুবচন রূপ।' },
          { option: 'D', isCorrect: false, reasonBn: 'ভুল বানান।' }
        ],
        testedRuleRef: 'rule-3-1',
        trapPattern: 'ইংরেজি সাধারণ s/es নিয়মের ফাঁদ।'
      },
      {
        id: 'bcs-3-2',
        bcsExam: '৪৪তম বিসিএস',
        year: 2022,
        question: 'Which one of the following words is masculine?',
        options: [
          { key: 'A', text: 'Mare' },
          { key: 'B', text: 'Lad' },
          { key: 'C', text: 'Lass' },
          { key: 'D', text: 'Ewe' }
        ],
        correctOption: 'B',
        detailedExplanationBn: '"Lad" অর্থ বালক বা তরুণ (Masculine gender), এর স্ত্রীলিঙ্গ হলো "Lass" (বালিকা/তরুণী)। Mare (ঘোটকী) হলো Horse এর স্ত্রীলিঙ্গ এবং Ewe (ভেড়ী) হলো Ram (ভেড়া) এর স্ত্রীলিঙ্গ।',
        optionBreakdown: [
          { option: 'A (Mare)', isCorrect: false, reasonBn: 'স্ত্রীলিঙ্গ (ঘোটকী)।' },
          { option: 'B (Lad)', isCorrect: true, reasonBn: 'পুংলিঙ্গ (বালক)।' },
          { option: 'C (Lass)', isCorrect: false, reasonBn: 'স্ত্রীলিঙ্গ (বালিকা)।' },
          { option: 'D (Ewe)', isCorrect: false, reasonBn: 'স্ত্রীলিঙ্গ (ভেড়ী)।' }
        ],
        testedRuleRef: 'rule-3-1',
        trapPattern: 'অপ্রচলিত প্রাণীর ও প্রাচীন ইংরেজি জেন্ডার রূপ যাচাই।'
      }
    ],
    practiceQuestions: [
      {
        id: 'p-3-1',
        question: 'The feminine form of "Monk" is:',
        options: ['Nun', 'Sister', 'Monkess', 'Priestess'],
        correctIndex: 0,
        explanationBn: '৩৬তম বিসিএসের প্রশ্ন। Monk (সন্ন্যাসী) এর Feminine gender হলো Nun (সন্ন্যাসিনী)।',
        difficulty: 'beginner',
        isBcsPastQuestion: true,
        bcsYearTag: '৩৬তম বিসিএস'
      },
      {
        id: 'p-3-2',
        question: 'Identify the word that remains same in both singular and plural:',
        options: ['Ox', 'Foot', 'Sheep', 'Mouse'],
        correctIndex: 2,
        explanationBn: '৪৬তম বিসিএসে আসা প্রশ্ন। Sheep এর একবচন ও বহুবচন উভয় রূপই "Sheep"। Ox -> Oxen, Foot -> Feet, Mouse -> Mice।',
        difficulty: 'beginner',
        isBcsPastQuestion: true,
        bcsYearTag: '৪৬তম বিসিএস'
      }
    ],
    summaryRevisionNotes: [
      '-us ➔ -i: Radius ➔ Radii, Focus ➔ Foci, Locus ➔ Loci',
      '-is ➔ -es: Crisis ➔ Crises, Basis ➔ Bases, Thesis ➔ Theses, Oasis ➔ Oases',
      '-um/-on ➔ -a: Datum ➔ Data, Medium ➔ Media, Criterion ➔ Criteria, Phenomenon ➔ Phenomena',
      'সর্বদা একবচন ও বহুবচন এক: Sheep, Deer, Aircraft, Species, Series',
      'জরুরি জেন্ডার রূপ: Monk/Nun, Lad/Lass, Ram/Ewe, Drone/Bee, Drake/Duck, Stag/Hind'
    ]
  },

  // ── Chapter 4: Non-Finite Verbs: Gerund, Participle & Infinitive ────────────
  {
    id: 'chapter-4',
    chapterNumber: 4,
    lectureNo: 'Lecture-04',
    title: 'Non-Finite Verbs: Gerund, Participle & Infinitive',
    bengaliTitle: 'অসমাপিকা ক্রিয়া: জেরান্ড, পার্টিসিপল ও ইনফিনিটিভের ব্যবচ্ছেদ',
    category: 'Parts of Speech',
    icon: 'GitFork',
    bcsFrequency: 'Very High',
    bcsFrequencyNotes: 'বিসিএস পরীক্ষার সবচেয়ে জনপ্রিয় ও কনফিউজিং টপিক! Gerund বনাম Present Participle পার্থক্য করা নিয়ে ৪০তম, ৪১তম, ৪৪তম, ৪৬তম বিসিএসে সরাসরি প্রশ্ন এসেছে। (A rolling stone, Swimming is good, Reading room ইত্যাদি)',
    subchapters: [
      { id: 'sub-4-1', title: 'Gerund (Verb + ing as Noun)', bengaliTitle: 'জেরান্ডের অবস্থান ও কাজ' },
      { id: 'sub-4-2', title: 'Participle (Present, Past, Perfect)', bengaliTitle: 'পার্টিসিপলের তিন রূপ ও Adjective হিসেবে কাজ' },
      { id: 'sub-4-3', title: 'Gerund vs Participle: The 5 Second Test', bengaliTitle: '৫ সেকেন্ডে জেরান্ড ও পার্টিসিপল চেনার টেকনিক' },
      { id: 'sub-4-4', title: 'Verbal Noun & Dangling Modifier', bengaliTitle: 'ভার্বাল নাউন ও ড্যাংগলিং মডিফায়ার' }
    ],
    rules: [
      {
        id: 'rule-4-1',
        ruleNumber: 1,
        title: 'Gerund vs Present Participle: Action Test & Replacement Test',
        bengaliTitle: 'জেরান্ড বনাম প্রেজেন্ট পার্টিসিপল নির্ণয়ের অকাট্য টেস্ট',
        explanationBn: 'Verb + ing যখন একই সাথে Verb ও Noun এর কাজ করে, তখন তা Gerund। আর Verb + ing যখন একই সাথে Verb ও Adjective এর কাজ করে (অর্থাৎ অবস্থা, গতিশীলতা বা বৈশিষ্ট্য বোঝায়), তখন তা Present Participle।',
        whyAndWhen: 'বিসিএস পরীক্ষায় "A rolling stone gathers no moss" বাক্যে "rolling" কী তা জানতে চাওয়া হয়েছে। এটি সবচেয়ে বেশি জিজ্ঞাসিত প্রশ্ন।',
        formula: 'Verb + ing = Noun এর কাজ করলে GERUND | Adjective এর কাজ করলে PARTICIPLE',
        examples: [
          { english: 'A rolling stone gathers no moss.', bengali: 'ঘূর্ণায়মান পাথরে শ্যাওলা জমে না।', note: "৪০তম ও ৪৬তম বিসিএসে আসা প্রশ্ন। পাথরটির চলমান অবস্থা (running action) বোঝাচ্ছে, তাই 'rolling' এখানে Participle (Adjective)।" },
          { english: 'Swimming is a good exercise.', bengali: 'সাঁতার কাটা একটি ভালো ব্যায়াম।', note: "'Swimming' এখানে Subject হিসেবে Noun-এর কাজ করছে, তাই Gerund।" },
          { english: 'This is a reading room.', bengali: 'এটি পড়ার কক্ষ।', note: "রুমটি সাঁতার বা পড়ছে না, এটি 'a room for reading'। উদ্দেশ্য বোঝালে তা Gerund।" },
          { english: 'I saw a dancing girl.', bengali: 'আমি একটি নৃত্যরত বালিকাকে দেখলাম।', note: "মেয়েটি নিজে নাচছিল (A girl who is dancing), তাই 'dancing' এখানে Participle।" }
        ],
        correctVsIncorrect: [
          { correct: 'He is fond of playing cricket.', incorrect: 'He is fond of to play cricket.', reasonBn: 'Preposition এর পরে Verb আসলে সর্বদা Gerund (verb+ing) হয়।' },
          { correct: 'Walking is good for health.', incorrect: 'Walk is good for health.', reasonBn: 'বাক্যের শুরুতে Subject হিসেবে কাজ করতে Gerund দরকার।' }
        ],
        commonMistakes: [
          'Compound Noun এর প্রথম অংশ দেখে অনেকেই পার্টিসিপল ভাবেন। মনে রাখবেন: "Sleeping pill" = a pill for sleeping (উদ্দেশ্য), তাই sleeping = Gerund। কিন্তু "Sleeping baby" = a baby who is sleeping (চলমান অবস্থা), তাই sleeping = Participle!'
        ],
        exceptions: [
          'Verbal Noun: যদি Verb+ing এর আগে "The" এবং পরে "of" থাকে, তবে তাকে Gerund না বলে স্পেসিফিকভাবে "Verbal Noun" বলা হয়। যেমন: "The reading of history is interesting।"'
        ],
        examTricks: [
          'ম্যাজিক টেস্ট ১ (is + verb+ing): \n• Stone is rolling? হ্যাঁ, পাথরটি ঘুরছে ➔ Participle!\n• Room is reading? না, রুম পড়তে পারে না, রুম পড়ার জন্য (for reading) ➔ Gerund!\nম্যাজিক টেস্ট ২: শব্দটি তুলে দিয়ে "it" বসিয়ে দেখুন। বাক্য অর্থপূর্ণ হলে Gerund, না হলে Participle।'
        ],
        confusingRelatedRules: [
          'Rule 4-2: Preposition + Gerund বনাম To + Base verb (Infinitive)।'
        ],
        practiceMcqs: [
          {
            id: 'mcq-4-1-1',
            question: '"A rolling stone gathers no moss." What is "rolling"?',
            options: ['Gerund', 'Participle', 'Verbal Noun', 'Adverb'],
            correctIndex: 1,
            explanationBn: '৪০তম ও ৪৬তম বিসিএসে আসা প্রশ্ন। stone Noun-এর চলমান অবস্থা নির্দেশ করায় "rolling" এখানে Adjective হিসেবে কাজ করছে, তাই এটি Present Participle।',
            difficulty: 'intermediate',
            isBcsPastQuestion: true,
            bcsYearTag: '৪০তম ও ৪৬তম বিসিএস'
          }
        ]
      }
    ],
    bcsQuestions: [
      {
        id: 'bcs-4-1',
        bcsExam: '৪০তম বিসিএস',
        year: 2019,
        question: '"A rolling stone gathers no moss." What is "rolling"?',
        options: [
          { key: 'A', text: 'Gerund' },
          { key: 'B', text: 'Participle' },
          { key: 'C', text: 'Verbal Noun' },
          { key: 'D', text: 'Adjective' }
        ],
        correctOption: 'B',
        detailedExplanationBn: 'এখানে "rolling" শব্দটি Verb (roll) থেকে তৈরি হয়ে stone Noun-কে বিশেষায়িত করছে (A stone that rolls)। যেহেতু এটি একই সাথে Verb এবং Adjective এর কাজ সম্পন্ন করেছে, তাই এটি একটি Present Participle।',
        optionBreakdown: [
          { option: 'A', isCorrect: false, reasonBn: 'জেরান্ড Noun এর কাজ করে, কিন্তু rolling এখানে Noun-কে মডিফাই করা Adjective।' },
          { option: 'B', isCorrect: true, reasonBn: 'সঠিক উত্তর। এটি স্পষ্টত একটি Present Participle।' },
          { option: 'C', isCorrect: false, reasonBn: 'The + verb+ing + of কাঠামো নেই।' },
          { option: 'D', isCorrect: false, reasonBn: 'অপশনে Participle থাকলে grammatical term হিসেবে Participle অগ্রাধিকার পায়।' }
        ],
        testedRuleRef: 'rule-4-1',
        trapPattern: 'জেরান্ড ও পার্টিসিপলের মধ্যে সূক্ষ্ম পার্থক্য।'
      },
      {
        id: 'bcs-4-2',
        bcsExam: '৩৭তম বিসিএস',
        year: 2016,
        question: '"Gerund" is similar to which of the following?',
        options: [
          { key: 'A', text: 'Verb + Adjective' },
          { key: 'B', text: 'Verb + Noun' },
          { key: 'C', text: 'Verb + Adverb' },
          { key: 'D', text: 'Noun + Adjective' }
        ],
        correctOption: 'B',
        detailedExplanationBn: 'Gerund হলো এমন একটি অসমাপিকা ক্রিয়া যা একই সাথে Verb এবং Noun এর কাজ করে। একে Double Parts of Speech বলা হয়। অপরদিকে Participle হলো Verb + Adjective।',
        optionBreakdown: [
          { option: 'A', isCorrect: false, reasonBn: 'Verb + Adjective হলো Participle।' },
          { option: 'B', isCorrect: true, reasonBn: 'Gerund = Verb + Noun।' },
          { option: 'C', isCorrect: false, reasonBn: 'ভুল মিশ্রণ।' },
          { option: 'D', isCorrect: false, reasonBn: 'ভুল মিশ্রণ।' }
        ],
        testedRuleRef: 'rule-4-1',
        trapPattern: 'সংজ্ঞাভিত্তিক মৌলিক প্রশ্ন।'
      }
    ],
    practiceQuestions: [
      {
        id: 'p-4-1',
        question: 'Look at the flying bird. Here "flying" is a:',
        options: ['Gerund', 'Participle', 'Verbal Noun', 'Infinitive'],
        correctIndex: 1,
        explanationBn: 'পাখিটি নিজে উড়ছে (The bird is flying) এবং bird Noun-এর অবস্থা বুঝিয়েছে, তাই flying হলো Present Participle।',
        difficulty: 'beginner',
        isBcsPastQuestion: false
      },
      {
        id: 'p-4-2',
        question: 'He gave up ____ football.',
        options: ['play', 'playing', 'to play', 'played'],
        correctIndex: 1,
        explanationBn: '৩৮তম বিসিএসে আসা প্রশ্ন। "gave up" একটি Phrasal verb যার শেষে Preposition "up" রয়েছে। Preposition এর পর সর্বদা Gerund (verb+ing) বসে।',
        difficulty: 'intermediate',
        isBcsPastQuestion: true,
        bcsYearTag: '৩৮তম বিসিএস'
      }
    ],
    summaryRevisionNotes: [
      'Gerund = Verb + ing ➔ Noun হিসেবে কাজ করে (Subject, Object, Preposition এর Object)।',
      'Participle = Verb + ing / d,ed,en ➔ Adjective হিসেবে Noun এর অবস্থা/দোষ-গুণ প্রকাশ করে।',
      'ম্যাজিক টেস্ট: [Noun] is [verb+ing]? উত্তর "হ্যাঁ" হলে Participle, উত্তর "না" (উদ্দেশ্য/for) হলে Gerund।',
      'The + verb+ing + of = Verbal Noun।',
      'Preposition এর পর ভার্ব আসলে সর্বদা Gerund (playing, swimming, learning) হয়।'
    ]
  }
];
