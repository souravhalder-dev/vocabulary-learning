import { GrammarChapter } from '../../types/grammar';

export const MODULE_3_CHAPTERS: GrammarChapter[] = [
  // ── Chapter 8: Prepositions & Appropriate Prepositions ──────────────────────
  {
    id: 'chapter-8',
    chapterNumber: 8,
    lectureNo: 'Lecture-12 & 13',
    title: 'Prepositions & Appropriate Prepositions (BCS High-Yield)',
    bengaliTitle: 'পদান্বয়ী অব্যয় ও উপযুক্ত প্রিপজিশনের বিসিএস স্পেশাল তালিকা',
    category: 'Applied Usage',
    icon: 'Compass',
    bcsFrequency: 'Very High',
    bcsFrequencyNotes: 'বিসিএস প্রিলিমিনারি পরীক্ষায় প্রতি বছর ৩-৪টি প্রশ্ন শুধুমাত্র Preposition থেকে আসে! বিশেষ করে "look into" (৪৪তম বিসিএস), "look after" (৪৩তম বিসিএস), "convicted of" (৩৫তম বিসিএস), "made of vs made from" (৩৮তম বিসিএস), "between vs among" (৩৫তম বিসিএস)।',
    subchapters: [
      { id: 'sub-8-1', title: 'Rules of Place, Time & Movement', bengaliTitle: 'স্থান, কাল ও গতির প্রিপজিশন (In, On, At, By, Into)' },
      { id: 'sub-8-2', title: 'Made of vs Made from vs Made by', bengaliTitle: 'Made of বনাম Made from এর বৈজ্ঞানিক পার্থক্য' },
      { id: 'sub-8-3', title: 'Between vs Among vs Amidst', bengaliTitle: 'দুই বনাম বহুর মধ্যে বণ্টনের নিয়ম' },
      { id: 'sub-8-4', title: 'Exam-Favorite Appropriate Prepositions', bengaliTitle: 'বিসিএসে বারবার আসা এপ্রোপ্রিয়েট প্রিপজিশন' }
    ],
    rules: [
      {
        id: 'rule-8-1',
        ruleNumber: 1,
        title: 'Made of vs Made from: Physical vs Chemical Transformation',
        bengaliTitle: 'Made of বনাম Made from: পদার্থ চেনার সহজ উপায়',
        explanationBn: 'কোনো উপাদান দিয়ে কোনো কিছু তৈরি হওয়ার পর যদি মূল উপাদানটি চোখে দেখা যায় বা তার বাহ্যিক রূপ চেনা যায় (Physical Change), তবে "Made of" বসে। আর যদি তৈরি করার পর মূল উপাদানটি সম্পূর্ণ পরিবর্তিত হয়ে অদৃশ্য হয়ে যায় (Chemical Change), তবে "Made from" বসে।',
        whyAndWhen: '৩৮তম বিসিএসে "Paper is made from wood" প্রশ্নটি এসেছে। এটি অত্যন্ত জনপ্রিয় একটি কনসেপ্ট।',
        formula: 'মূল উপাদান দেখা গেলে ➔ MADE OF | মূল উপাদান সম্পূর্ণ বিলীন হয়ে গেলে ➔ MADE FROM',
        visualDiagram: {
          title: 'Made of vs Made from Transformation Flowchart',
          type: 'decision_tree',
          steps: [
            { step: 'Step 1: Inspect Output', condition: 'তৈরি করা চূড়ান্ত বস্তুটি কী?', resultBn: 'চেয়ার নাকি কাগজ/মাখন?', color: 'indigo' },
            { step: 'Step 2: Physical Visibility', condition: 'মূল উপাদান কি চোখে দেখা যায় ও চেনা যায়?', resultBn: 'হ্যাঁ ➔ MADE OF (e.g. Chair made of wood)', color: 'emerald' },
            { step: 'Step 3: Chemical Change', condition: 'মূল উপাদান কি রাসায়নিকভাবে পরিবর্তিত ও অদৃশ্য?', resultBn: 'হ্যাঁ ➔ MADE FROM (e.g. Paper made from wood)', color: 'rose' }
          ]
        },
        colorCodedSentence: [
          { token: 'Paper', role: 'subject', note: 'Subject Noun (কাগজ)' },
          { token: 'is made', role: 'verb', note: 'Passive Verb (তৈরি হয়)' },
          { token: 'from', role: 'preposition', note: 'Preposition of Chemical Origin (রাসায়নিক রূপান্তর)' },
          { token: 'wood', role: 'object', note: 'Material Noun (কাঠ)' }
        ],
        fillInTheBlanks: [
          {
            id: 'fib-8-1',
            sentence: 'Paper is made [____] wood.',
            answer: 'from',
            hintBn: 'রাসায়নিক রূপান্তর বোঝাতে কোন প্রিপজিশন বসে?',
            explanationBn: 'কাঠ থেকে কাগজ তৈরির সময় কাঠের রূপ সম্পূর্ণ পরিবর্তিত হয়ে যায়, তাই made from হবে।'
          }
        ],
        errorCorrections: [
          {
            id: 'ec-8-1',
            incorrect: 'Paper is made of wood.',
            errorSegment: 'made of',
            correct: 'Paper is made from wood.',
            reasonBn: 'কাগজে কাঠের বাহ্যিক রূপ দৃশ্যমান নয়, তাই made of ভুল এবং made from সঠিক।'
          }
        ],
        examples: [
          { english: 'Paper is made from wood.', bengali: 'কাঠ থেকে কাগজ তৈরি হয়।', note: "৩৮তম বিসিএসের প্রশ্ন। কাগজে কিন্তু কাঠের আঁশ বা অস্তিত্ব সরাসরি দেখা যায় না, রাসায়নিক পরিবর্তন হয়েছে। তাই 'made from'।" },
          { english: 'This chair is made of wood.', bengali: 'এই চেয়ারটি কাঠ দিয়ে তৈরি।', note: "চেয়ারটির দিকে তাকালেই কাঠ স্পষ্ট দেখা যায় (Physical change), তাই 'made of'।" },
          { english: 'Butter is made from milk.', bengali: 'দুধ থেকে মাখন তৈরি হয়।', note: "মাখনের মধ্যে তরল দুধ অদৃশ্য হয়ে গেছে, তাই 'made from'।" },
          { english: 'The ring is made of gold.', bengali: 'আংটিটি সোনার তৈরি।', note: "আংটির সোনা অক্ষত ও দৃশ্যমান, তাই 'made of'।" }
        ],
        correctVsIncorrect: [
          { correct: 'Paper is made from wood.', incorrect: 'Paper is made of wood.', reasonBn: 'কাগজে কাঠের রূপ বদলে গেছে, তাই of হবে না, from হবে।' },
          { correct: 'The table is made of oak.', incorrect: 'The table is made from oak.', reasonBn: 'টেবিলে কাঠ দৃশ্যমান, তাই of হবে।' }
        ],
        commonMistakes: [
          'অনেকে wood দেখলেই মুখস্থ "of" বা "from" বসিয়ে দেন। দেখতে হবে আউটপুটটা কী! চেয়ার হলে "of", আর কাগজ হলে "from"!'
        ],
        exceptions: [
          'Made by: প্রস্তুতকারক ব্যক্তি বা প্রতিষ্ঠান বোঝালে "made by" বসে (This car was made by Toyota)।'
        ],
        examTricks: [
          'চমৎকার ট্রিক: উপাদান অক্ষত? ➔ OF। উপাদান গায়েব বা রাসায়নিক পরিবর্তন? ➔ FROM।'
        ],
        confusingRelatedRules: [
          'Die of (রোগে মৃত্যু) বনাম Die from (অতিরিক্ত খাওয়া/আঘাত ইত্যাদি কারণে মৃত্যু)।'
        ],
        practiceMcqs: [
          {
            id: 'mcq-8-1-1',
            question: 'Which of the following sentences is correct?',
            options: [
              'Paper is made of wood',
              'Paper is made from wood',
              'Paper is made by wood',
              'Paper is made with wood'
            ],
            correctIndex: 1,
            explanationBn: '৩৮তম বিসিএসের প্রশ্ন। কাঠ থেকে কাগজ তৈরির প্রক্রিয়ায় কাঠের ভৌত ও রাসায়নিক পরিবর্তন ঘটে মূল উপাদান হারিয়ে যায়, তাই "made from" সঠিক।',
            difficulty: 'intermediate',
            isBcsPastQuestion: true,
            bcsYearTag: '৩৮তম বিসিএস'
          }
        ]
      },
      {
        id: 'rule-8-2',
        ruleNumber: 2,
        title: 'High-Yield Phrasal Prepositions: Look into vs Look after',
        bengaliTitle: 'Look into বনাম Look after: প্রিপজিশনাল বিভ্রান্তি দূরীকরণ',
        explanationBn: 'একই Verb-এর সাথে ভিন্ন ভিন্ন Preposition যুক্ত হয়ে সম্পূর্ণ আলাদা অর্থ তৈরি করে। যেমন: Look into = তদন্ত করা (investigate)। Look after = দেখাশোনা করা বা যত্ন নেওয়া (take care of)। Look for = খোঁজা (search)। Look down upon = ঘৃণা করা (hate)।',
        whyAndWhen: '৪৪তম বিসিএসে এসেছে "Please look into the matter" এবং ৪৩তম বিসিএসে এসেছে "Look after means to take care of"।',
        formula: 'Look + INTO = তদন্ত করা (Investigate) | Look + AFTER = দেখাশোনা করা (Take care of)',
        examples: [
          { english: 'The police are looking into the case.', bengali: 'পুলিশ মামলাটি তদন্ত করছে।', note: "৪৪তম বিসিএসে আসা প্রশ্ন। look into = investigate।" },
          { english: 'She looks after her elderly parents.', bengali: 'তিনি তার বয়োবৃদ্ধ পিতা-মাতার দেখাশোনা করেন।', note: "৪৩তম বিসিএসে আসা প্রশ্ন। look after = take care of।" },
          { english: 'Never look down upon the poor.', bengali: 'দরিদ্রদের কখনো ঘৃণা করো না।', note: "look down upon = despise / hate।" }
        ],
        correctVsIncorrect: [
          { correct: 'Please look into the matter.', incorrect: 'Please look after the matter.', reasonBn: 'কোনো ঘটনা বা সমস্যা তদন্ত করার ক্ষেত্রে look into বসে।' },
          { correct: 'Look after your health.', incorrect: 'Look into your health.', reasonBn: 'স্বাস্থ্যের যত্ন নেওয়ার ক্ষেত্রে look after বসে।' }
        ],
        commonMistakes: [
          'তদন্ত করা আর যত্ন নেওয়ার মধ্যে গুলিয়ে ফেলা।'
        ],
        exceptions: [
          'Look up: ডিকশনারিতে কোনো শব্দের অর্থ খোঁজার ক্ষেত্রে "Look up" ব্যবহৃত হয় (Look up the word in the dictionary)।'
        ],
        examTricks: [
          'তদন্ত = Into (ভেতরে ঢুকে দেখা)। যত্ন = After (পেছন থেকে ছায়ার মতো আগলে রাখা)।'
        ],
        confusingRelatedRules: [
          'Call in (ডাক্তার ডাকা) বনাম Call off (বাতিল করা)।'
        ],
        practiceMcqs: [
          {
            id: 'mcq-8-2-1',
            question: '"Look after" means:',
            options: ['To search', 'To take care of', 'To investigate', 'To hate'],
            correctIndex: 1,
            explanationBn: '৪৩তম বিসিএসের প্রশ্ন। Look after হলো একটি Phrasal verb যার অর্থ দেখাশোনা বা যত্ন নেওয়া (To take care of)।',
            difficulty: 'beginner',
            isBcsPastQuestion: true,
            bcsYearTag: '৪৩তম বিসিএস'
          }
        ]
      }
    ],
    bcsQuestions: [
      {
        id: 'bcs-8-1',
        bcsExam: '৪৪তম বিসিএস',
        year: 2022,
        question: 'Please look ____ the matter.',
        options: [
          { key: 'A', text: 'at' },
          { key: 'B', text: 'into' },
          { key: 'C', text: 'after' },
          { key: 'D', text: 'for' }
        ],
        correctOption: 'B',
        detailedExplanationBn: 'কোনো ঘটনা, অভিযোগ বা বিষয় তদন্ত করার অর্থে "look into" ব্যবহৃত হয় (look into = investigate)। তাই "Please look into the matter" সঠিক।',
        optionBreakdown: [
          { option: 'A (at)', isCorrect: false, reasonBn: 'look at অর্থ কোনো কিছুর দিকে সরাসরি তাকানো।' },
          { option: 'B (into)', isCorrect: true, reasonBn: 'তদন্ত করা অর্থে look into শতভাগ উপযুক্ত।' },
          { option: 'C (after)', isCorrect: false, reasonBn: 'দেখাভাল বা যত্ন নেওয়া বোঝায়।' },
          { option: 'D (for)', isCorrect: false, reasonBn: 'হারিয়ে যাওয়া কিছু খোঁজা বোঝায়।' }
        ],
        testedRuleRef: 'rule-8-2',
        trapPattern: 'Look এর বিভিন্ন ফেভারিট Phrasal verbs এর সূক্ষ্ম পার্থক্য।'
      },
      {
        id: 'bcs-8-2',
        bcsExam: '৩৫তম বিসিএস',
        year: 2015,
        question: 'He was convicted ____ murder.',
        options: [
          { key: 'A', text: 'for' },
          { key: 'B', text: 'of' },
          { key: 'C', text: 'to' },
          { key: 'D', text: 'with' }
        ],
        correctOption: 'B',
        detailedExplanationBn: 'কোনো অপরাধে দোষী সাব্যস্ত হওয়া বোঝাতে "Convict of" বসে (He was convicted of murder)। অনুরূপভাবে Accuse of, Guilty of এর পরেও "of" বসে।',
        optionBreakdown: [
          { option: 'A (for)', isCorrect: false, reasonBn: 'বাংলায় "খুনের জন্য দোষী" মনে করে ছাত্ররা for দাগিয়ে ভুল করে।' },
          { option: 'B (of)', isCorrect: true, reasonBn: 'Convict of অপরাধ সংক্রান্ত এপ্রোপ্রিয়েট প্রিপজিশন।' },
          { option: 'C (to)', isCorrect: false, reasonBn: 'Sentence to death হয়, কিন্তু convict to হয় না।' },
          { option: 'D (with)', isCorrect: false, reasonBn: 'Charge with হয়, কিন্তু convict with হয় না।' }
        ],
        testedRuleRef: 'rule-8-2',
        trapPattern: 'বাংলা অর্থ অনুযায়ী "for" মনে হওয়া কিন্তু ব্যাকরণে "of" বসা।'
      }
    ],
    practiceQuestions: [
      {
        id: 'p-8-1',
        question: 'He divided the mangoes ____ the two children.',
        options: ['among', 'between', 'in', 'with'],
        correctIndex: 1,
        explanationBn: '৩৫তম বিসিএসে আসা প্রশ্ন। দুই ব্যক্তি বা বস্তুর মধ্যে বণ্টন বোঝাতে "between" বসে। আর দুইয়ের অধিক ব্যক্তির মধ্যে হলে "among" বসতো।',
        difficulty: 'beginner',
        isBcsPastQuestion: true,
        bcsYearTag: '৩৫তম বিসিএস'
      },
      {
        id: 'p-8-2',
        question: '"Call in a doctor." What does "call in" mean?',
        options: ['Send for', 'Visit', 'Telephone', 'Cancel'],
        correctIndex: 0,
        explanationBn: '৩৫তম বিসিএসে আসা প্রশ্ন। Call in মানে ডেকে পাঠানো (Send for)।',
        difficulty: 'intermediate',
        isBcsPastQuestion: true,
        bcsYearTag: '৩৫তম বিসিএস'
      }
    ],
    summaryRevisionNotes: [
      'Made of (ভৌত রূপ অক্ষত) ➔ Made from (রাসায়নিক রূপান্তর, মূল উপাদান অদৃশ্য)।',
      'Look into (তদন্ত করা) | Look after (যত্ন নেওয়া) | Look down upon (ঘৃণা করা) | Look for (খোঁজা)।',
      'দুইজনের মধ্যে ➔ Between | বহুজনের মধ্যে ➔ Among।',
      'Die of (রোগে) | Die from (ক্ষত/অতিরিক্ত খওয়া) | Die for (দেশের জন্য) | Die by (বিষ/দুর্ঘটনা)।',
      'জরুরি Appropriate Preposition: Accused of, Convicted of, Abide by, Adhere to, Congratulate on, Deprive of, Prefer to।'
    ]
  },

  // ── Chapter 9: Idioms, Phrases & One-Word Substitution ──────────────────────
  {
    id: 'chapter-9',
    chapterNumber: 9,
    lectureNo: 'Lecture-16',
    title: 'Idioms, Phrases & One-Word Substitution',
    bengaliTitle: 'বাগধারা, প্রবাদ-প্রবচন ও এক কথায় প্রকাশ',
    category: 'Applied Usage',
    icon: 'Feather',
    bcsFrequency: 'Very High',
    bcsFrequencyNotes: 'প্রতি বিসিএস প্রিলিতে ২-৩টি প্রশ্ন বাগধারা ও এক কথায় প্রকাশ থেকে নিশ্চিতভাবে থাকে। (৪৬তম, ৪৪তম, ৪১তম, ৪০তম, ৩৬তম বিসিএস)',
    subchapters: [
      { id: 'sub-9-1', title: 'Top 50 Most-Repeated BCS Idioms', bengaliTitle: 'বিসিএসের ৫০টি সর্বাধিক কমন বাগধারা' },
      { id: 'sub-9-2', title: 'One-Word Substitution by Categories', bengaliTitle: 'বিষয়ভিত্তিক এক কথায় প্রকাশ (ব্যক্তি, হত্যা, বিজ্ঞান)' },
      { id: 'sub-9-3', title: 'Common Confusions & Nuances', bengaliTitle: 'অর্থগত বিভ্রান্তিকর বাগধারার সমাধান' }
    ],
    rules: [
      {
        id: 'rule-9-1',
        ruleNumber: 1,
        title: 'Mastering High-Frequency BCS Idioms with Etymology',
        bengaliTitle: 'উৎপত্তি ও গল্পের মাধ্যমে বিসিএস ইডিয়মস মুখস্থ রাখার কৌশল',
        explanationBn: 'ইংরেজি Idiom-এর শাব্দিক অর্থ ও ভাবার্থ সম্পূর্ণ আলাদা। অধিকাংশ ইডিয়ম কোনো ঐতিহাসিক ঘটনা বা রূপকথা থেকে এসেছে। তাদের পেছনের প্রেক্ষাপট জানলে কখনো ভুল হয় না।',
        whyAndWhen: '৪৬তম বিসিএসে "Achilles\' heel" এবং ৪০তম বিসিএসে "A penny for your thoughts" প্রশ্ন এসেছে।',
        formula: 'Idiom ➔ Literal Meaning (শাব্দিক অর্থ নয়) ➔ Metaphorical Meaning (রূপক ভাবার্থ)',
        examples: [
          { english: "Achilles' heel", bengali: "দুর্বল বিন্দু বা দুর্বলতা (A vulnerable point / weak spot)", note: "৪৬তম বিসিএসের প্রশ্ন। গ্রিক বীর একিলিসের একমাত্র দুর্বল স্থান ছিল গোড়ালি।" },
          { english: "A penny for your thoughts", bengali: "আপনি কী ভাবছেন জানতে চাওয়া (Tell me what you are thinking)", note: "৪০তম বিসিএসের প্রশ্ন।" },
          { english: "Call it a day", bengali: "সেদিনের মতো কাজ বন্ধ ঘোষণা করা (To stop working on something)", note: "৪০তম বিসিএসের প্রশ্ন।" },
          { english: "A verbose speech", bengali: "বাগাড়ম্বরপূর্ণ বক্তব্য (A speech full of too many words)", note: "৪৪তম বিসিএসের প্রশ্ন।" }
        ],
        correctVsIncorrect: [
          { correct: "His anger is his Achilles' heel.", incorrect: "His anger is his strong point.", reasonBn: "Achilles' heel দুর্বল স্থান নির্দেশ করে।" }
        ],
        commonMistakes: [
          '"Call it a day" মানে কিন্তু সারাদিন ডাকা নয়, বরং কাজ আজকের মতো শেষ করা!'
        ],
        exceptions: [
          'কিছু ইডিয়মের অর্থ ইতিবাচক কিন্তু শব্দে নেগেটিভ উপাদান থাকে (যেমন: Break a leg = শুভকামনা/Good luck)।'
        ],
        examTricks: [
          'অপশনে যখন ইডিয়মটির শাব্দিক অর্থের অনুবাদ দেওয়া থাকে (যেমন: একিলিসের গোড়ালির হাড়), মনে রাখবেন সেটি ১০০% ভুল অপশন! রূপক ভাবার্থের অপশনটিই সর্বদা সঠিক হয়।'
        ],
        confusingRelatedRules: [
          'At the eleventh hour = শেষ মুহূর্তে | Once in a blue moon = কদাচিৎ (very rarely)।'
        ],
        practiceMcqs: [
          {
            id: 'mcq-9-1-1',
            question: 'The phrase "Achilles\' heel" means:',
            options: [
              'A fast runner',
              'A vulnerable point',
              'A brave hero',
              'An ancient weapon'
            ],
            correctIndex: 1,
            explanationBn: '৪৬তম বিসিএসের প্রশ্ন। Achilles\' heel অর্থ মারাত্মক দুর্বল বিন্দু বা দুর্বল জায়গা (A vulnerable or weak point)।',
            difficulty: 'intermediate',
            isBcsPastQuestion: true,
            bcsYearTag: '৪৬তম বিসিএস'
          }
        ]
      }
    ],
    bcsQuestions: [
      {
        id: 'bcs-9-1',
        bcsExam: '৪৪তম বিসিএস',
        year: 2022,
        question: '"A speech full of too many words" is called:',
        options: [
          { key: 'A', text: 'A big speech' },
          { key: 'B', text: 'An emotional speech' },
          { key: 'C', text: 'A verbose speech' },
          { key: 'D', text: 'An interesting speech' }
        ],
        correctOption: 'C',
        detailedExplanationBn: 'প্রয়োজনের চেয়ে অতিরিক্ত অপ্রয়োজনীয় শব্দবহুল বক্তব্য বা লেখাকে ইংরেজিতে "Verbose" (শব্দাড়ম্বরপূর্ণ) বলা হয়। তাই সঠিক উত্তর "A verbose speech"।',
        optionBreakdown: [
          { option: 'A', isCorrect: false, reasonBn: 'সাধারণ দীর্ঘ ভাষণ বোঝায়।' },
          { option: 'B', isCorrect: false, reasonBn: 'আবেগপ্রবণ বক্তব্য।' },
          { option: 'C', isCorrect: true, reasonBn: 'Verbose শব্দের অর্থই হলো শব্দাড়ম্বরপূর্ণ।' },
          { option: 'D', isCorrect: false, reasonBn: 'আকর্ষণীয় বক্তব্য।' }
        ],
        testedRuleRef: 'rule-9-1',
        trapPattern: 'One-word substitution এর ক্ষেত্রে সরাসরি পারফেক্ট টার্মের পরীক্ষা।'
      },
      {
        id: 'bcs-9-2',
        bcsExam: '৩৬তম বিসিএস',
        year: 2016,
        question: 'A person who hates women is a:',
        options: [
          { key: 'A', text: 'Misanthrope' },
          { key: 'B', text: 'Misogynist' },
          { key: 'C', text: 'Philanthropist' },
          { key: 'D', text: 'Cannibal' }
        ],
        correctOption: 'B',
        detailedExplanationBn: 'Miso (ঘৃণা) + Gyn (নারী) = Misogynist (যে নারীদের ঘৃণা করে)। Misanthrope অর্থ যে সমগ্র মানবজাতিকে ঘৃণা করে। Philanthropist অর্থ মানবদরদী। Cannibal অর্থ নরখাদক।',
        optionBreakdown: [
          { option: 'A (Misanthrope)', isCorrect: false, reasonBn: 'মানবজাতি বিদ্বেষী।' },
          { option: 'B (Misogynist)', isCorrect: true, reasonBn: 'সুনির্দিষ্টভাবে নারী বিদ্বেষী।' },
          { option: 'C (Philanthropist)', isCorrect: false, reasonBn: 'মানবপ্রেমিক।' },
          { option: 'D (Cannibal)', isCorrect: false, reasonBn: 'নরখাদক।' }
        ],
        testedRuleRef: 'rule-9-1',
        trapPattern: 'Misanthrope বনাম Misogynist এর মধ্যে রুট ওয়ার্ডের বিভ্রান্তি।'
      }
    ],
    practiceQuestions: [
      {
        id: 'p-9-1',
        question: 'What is the meaning of "Panacea"?',
        options: ['A poisonous plant', 'Cure-all', 'A dangerous disease', 'A sweet melody'],
        correctIndex: 1,
        explanationBn: '৪১তম বিসিএসে আসা প্রশ্ন। Panacea অর্থ সর্বরোগহর ওষুধ বা সব সমস্যার সমাধান (A cure for all diseases / Cure-all)।',
        difficulty: 'beginner',
        isBcsPastQuestion: true,
        bcsYearTag: '৪১তম বিসিএস'
      },
      {
        id: 'p-9-2',
        question: 'A man whose wife has died is called a:',
        options: ['Widow', 'Widower', 'Bachelor', 'Spinster'],
        correctIndex: 1,
        explanationBn: '৪৪তম বিসিএসে আসা প্রশ্ন। যে পুরুষের স্ত্রী মারা গেছে তাকে Widower (বিপত্নীক) বলা হয়। আর যে নারীর স্বামী মারা গেছে তাকে Widow (বিধবা) বলে।',
        difficulty: 'beginner',
        isBcsPastQuestion: true,
        bcsYearTag: '৪৪তম বিসিএস'
      }
    ],
    summaryRevisionNotes: [
      "Achilles' heel = মারাত্মক দুর্বল দিক (Vulnerable spot)।",
      "Panacea = সর্বরোগহর ঔষধ (Cure-all)।",
      "Verbose speech = অতিরিক্ত শব্দবহুল বক্তব্য।",
      "Misogynist = নারী বিদ্বেষী | Misanthrope = মানববিদ্বেষী | Philanthropist = মানবপ্রেমিক।",
      "Widower = বিপত্নীক পুরুষ | Widow = বিধবা নারী।"
    ]
  },

  // ── Chapter 10: Spelling Rules & High-Frequency Words ───────────────────────
  {
    id: 'chapter-10',
    chapterNumber: 10,
    lectureNo: 'Lecture-16',
    title: 'Spelling Rules & Confusing Word Pairs',
    bengaliTitle: 'বানান শুদ্ধিকরণ: বিসিএস স্ট্যান্ডার্ড স্পেলিং টেকনিক',
    category: 'Applied Usage',
    icon: 'CheckCircle',
    bcsFrequency: 'High',
    bcsFrequencyNotes: 'প্রতি বিসিএসে ১টি বানান শুদ্ধিকরণ নিশ্চিতভাবে আসে। যেমন: Questionnaire (৪৬তম বিসিএস), Millennium (৩৬তম বিসিএস), Lieutenant, Committee, Privilege, Surveillance, Bureaucracy।',
    subchapters: [
      { id: 'sub-10-1', title: 'Top 30 Most Confusing Exam Spellings', bengaliTitle: 'বিসিএসের ৩০টি জটিলতম বানানের স্মৃতি কৌশল' },
      { id: 'sub-10-2', title: 'Doubling Consonants Rule', bengaliTitle: 'কখন ব্যঞ্জনবর্ণ দ্বিত্ব (Double) হয়' },
      { id: 'sub-10-3', title: 'I before E except after C', bengaliTitle: 'ie বনাম ei এর গোলকধাঁধার সমাধান' }
    ],
    rules: [
      {
        id: 'rule-10-1',
        ruleNumber: 1,
        title: 'Mnemonic Tricks for Trappy English Spellings',
        bengaliTitle: 'ছন্দ ও সিলেবল ভেঙে কঠিন বানান আয়ত্ত করার পদ্ধতি',
        explanationBn: 'কঠিন ইংরেজি বানানের জটিলতা মূলত ডাবল লেটার (Double n, double m, double r) এ থাকে। সিলেবল ভেঙে ছোট ছোট অংশে ভাগ করে মনে রাখলে পরীক্ষার হলে বিভ্রান্ত হওয়ার কোনো সুযোগ থাকে না।',
        whyAndWhen: '৪৬তম বিসিএসে "Questionnaire" এবং ৩৬তম বিসিএসে "Millennium" এসেছে।',
        formula: 'Question + naire (with DOUBLE N) ➔ Questionnaire | Mi + ll + e + nn + ium ➔ Millennium',
        examples: [
          { english: 'Questionnaire', bengali: 'প্রশ্নমালা', note: "৪৬তম বিসিএসের প্রশ্ন। লক্ষ্য করুন: Question + n + aire (দুইটি n পাশাপাশি)।" },
          { english: 'Millennium', bengali: 'সহস্রাব্দ', note: "৩৬তম বিসিএসের প্রশ্ন। লক্ষ্য করুন: দুইবার 'll' এবং দুইবার 'nn' (Mi-ll-e-nn-ium)।" },
          { english: 'Lieutenant', bengali: 'সামরিক কর্মকর্তা', note: "মনে রাখার টেকনিক: 'মিথ্যা তুমি দশ পিপড়া' ➔ Lie (মিথ্যা) + u (তুমি) + ten (দশ) + ant (পিপড়া)।" },
          { english: 'Committee', bengali: 'কমিটি', note: "Com + m + it + t + ee (দুইটি m, দুইটি t, এবং দুইটি e)।" }
        ],
        correctVsIncorrect: [
          { correct: 'Questionnaire', incorrect: 'Questionaire', reasonBn: 'দুইটি "n" আবশ্যক।' },
          { correct: 'Millennium', incorrect: 'Millenium', reasonBn: 'দুইটি "n" আবশ্যক।' }
        ],
        commonMistakes: [
          'Questionnaire বানানে একটি n বাদ দেওয়া এবং Millennium বানানে একটি n বাদ দেওয়া সবচেয়ে সাধারণ ভুল।'
        ],
        exceptions: [
          'Privilege বানানে কোনো d নেই! P-r-i-v-i-l-e-g-e (অনেকে Priviledge লেখেন যা ভুল)।'
        ],
        examTricks: [
          'শর্টকাট মেমোরি এইড: \n• Committee: 2m, 2t, 2e\n• Questionnaire: 2n\n• Millennium: 2l, 2n\n• Occurrence: 2c, 2r'
        ],
        confusingRelatedRules: [
          'Receive (c এর পর ei) বনাম Believe (l এর পর ie)।'
        ],
        practiceMcqs: [
          {
            id: 'mcq-10-1-1',
            question: 'Which one is the correct spelling?',
            options: ['Questionaire', 'Questionnaire', 'Questionair', 'Questionare'],
            correctIndex: 1,
            explanationBn: '৪৬তম বিসিএসের প্রশ্ন। সঠিক বানান Questionnaire (Q-u-e-s-t-i-o-n-n-a-i-r-e), যেখানে "n" বর্ণটি পরপর দুইবার বসে।',
            difficulty: 'intermediate',
            isBcsPastQuestion: true,
            bcsYearTag: '৪৬তম বিসিএস'
          }
        ]
      }
    ],
    bcsQuestions: [
      {
        id: 'bcs-10-1',
        bcsExam: '৪৬তম বিসিএস',
        year: 2024,
        question: 'Which one is the correct spelling?',
        options: [
          { key: 'A', text: 'Questionaire' },
          { key: 'B', text: 'Questionnaire' },
          { key: 'C', text: 'Questionnare' },
          { key: 'D', text: 'Questionnairee' }
        ],
        correctOption: 'B',
        detailedExplanationBn: 'ফরাসি শব্দমূল থেকে আসা Questionnaire বানানে "question" অংশের পর "n-a-i-r-e" যুক্ত হয়, যার ফলে "n" বর্ণটি ডাবল (nn) হয়ে যায়।',
        optionBreakdown: [
          { option: 'A', isCorrect: false, reasonBn: 'একটি n বাদ পড়েছে।' },
          { option: 'B', isCorrect: true, reasonBn: 'Questionnaire সম্পূর্ণ নিখুঁত বানান।' },
          { option: 'C', isCorrect: false, reasonBn: 'ai বাদ পড়েছে।' },
          { option: 'D', isCorrect: false, reasonBn: 'শেষে অতিরিক্ত e যোগ করা হয়েছে।' }
        ],
        testedRuleRef: 'rule-10-1',
        trapPattern: 'ডাবল কনসোনেন্ট একক করে ভুল অপশন দেওয়া।'
      },
      {
        id: 'bcs-10-2',
        bcsExam: '৩৬তম বিসিএস',
        year: 2016,
        question: 'Which word is correct in spelling?',
        options: [
          { key: 'A', text: 'Millenium' },
          { key: 'B', text: 'Millennium' },
          { key: 'C', text: 'Milennium' },
          { key: 'D', text: 'Milenium' }
        ],
        correctOption: 'B',
        detailedExplanationBn: 'Millennium শব্দের অর্থ ১০০০ বছরের সময়কাল বা সহস্রাব্দ। এই বানানে দুটি "l" এবং দুটি "n" রয়েছে (M-i-l-l-e-n-n-i-u-m)।',
        optionBreakdown: [
          { option: 'A', isCorrect: false, reasonBn: 'n একটি দেওয়া হয়েছে।' },
          { option: 'B', isCorrect: true, reasonBn: 'Millennium সঠিক বানান।' },
          { option: 'C', isCorrect: false, reasonBn: 'l একটি দেওয়া হয়েছে।' },
          { option: 'D', isCorrect: false, reasonBn: 'l এবং n উভয়ই একটি করে দেওয়া হয়েছে।' }
        ],
        testedRuleRef: 'rule-10-1',
        trapPattern: 'ডাবল l এবং ডাবল n এর বিভ্রান্তি।'
      }
    ],
    practiceQuestions: [
      {
        id: 'p-10-1',
        question: 'Find the correctly spelled word:',
        options: ['Priviledge', 'Privilege', 'Privelege', 'Privilage'],
        correctIndex: 1,
        explanationBn: 'Privilege বানানে কোনো "d" নেই এবং "l" এর পর "e" বসে (P-r-i-v-i-l-e-g-e)।',
        difficulty: 'intermediate',
        isBcsPastQuestion: false
      },
      {
        id: 'p-10-2',
        question: 'Identify the correct spelling of military officer:',
        options: ['Leftenant', 'Lieutenant', 'Lieutenent', 'Leutenant'],
        correctIndex: 1,
        explanationBn: 'উচ্চারণ লেফটেনেন্ট হলেও বানান হলো L-i-e-u-t-e-n-a-n-t (মিথ্যা তুমি দশ পিপড়া)।',
        difficulty: 'beginner',
        isBcsPastQuestion: false
      }
    ],
    summaryRevisionNotes: [
      'Questionnaire: Question + n + aire (Double N)।',
      'Millennium: Double L এবং Double N (M-i-l-l-e-n-n-i-u-m)।',
      'Committee: Double M, Double T, Double E (C-o-m-m-i-t-t-e-e)।',
      'Lieutenant: Lie + u + ten + ant।',
      'Privilege: কোনো "d" নেই (P-r-i-v-i-l-e-g-e)।'
    ]
  }
];
