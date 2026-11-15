import { GrammarChapter } from '../../types/grammar';

export const MODULE_2_CHAPTERS: GrammarChapter[] = [
  // ── Chapter 5: Right Forms of Verbs ─────────────────────────────────────────
  {
    id: 'chapter-5',
    chapterNumber: 5,
    lectureNo: 'Lecture-09',
    title: 'Right Forms of Verbs & Special Verbal Rules',
    bengaliTitle: 'ক্রিয়ার সঠিক রূপ ও বিশেষ নিয়মের প্রয়োগ',
    category: 'Sentence Syntax',
    icon: 'CheckSquare',
    bcsFrequency: 'Very High',
    bcsFrequencyNotes: 'বিসিএস প্রিলিমিনারিতে প্রতি বছর ২-৩টি প্রশ্ন আসে। বিশেষ করে Lest + should (৪৬তম ও ৪৫তম বিসিএস), It is high time (৪৩তম ও ৩৮তম বিসিএস), No sooner had...than (৪৫তম বিসিএস), এবং As if / As though এর নিয়ম থেকে নিয়মিত প্রশ্ন আসে।',
    subchapters: [
      { id: 'sub-5-1', title: 'Lest & Conjunction of Fear', bengaliTitle: 'Lest এর সাথে should / might এর অকাট্য নিয়ম' },
      { id: 'sub-5-2', title: 'It is high time / It is time', bengaliTitle: 'It is high time এর পর Past Indefinite' },
      { id: 'sub-5-3', title: 'As if, As though, Wish & Fancy', bengaliTitle: 'কাল্পনিক ভাব ও Unrealistic Past' },
      { id: 'sub-5-4', title: 'Had better, Would rather, Cannot but', bengaliTitle: 'বেয়ার ইনফিনিটিভ ও মডাল অভিব্যক্তি' }
    ],
    rules: [
      {
        id: 'rule-5-1',
        ruleNumber: 1,
        title: 'Lest + Subject + Should / Might + Verb Base Form',
        bengaliTitle: 'Lest এর পর Should এবং নঞর্থক শব্দের নিষেধাজ্ঞা',
        explanationBn: 'Lest একটি কনজাংশন যার অর্থ "পাছে ভয় হয় যে" বা "যাতে এমনটি না ঘটে"। বাক্যে Lest থাকলে পরবর্তী ক্লজের Subject এর পর সর্বদা "should" (বা কদাচিৎ "might") বসে এবং Verb এর Base form (V1) হয়। Lest এর ভেতরেই "না" সূচক ভাব থাকায় ওই ক্লজে কোনোভাবেই not বা no বসবে না।',
        whyAndWhen: '৪৬তম এবং ৪৫তম বিসিএসে ব্যাক-টু-ব্যাক এই প্রশ্নটি এসেছে ("He ran fast lest he ____ miss the train" এবং "Walk fast lest you ____ miss the bus")।',
        formula: 'Lest + Subject + SHOULD / MIGHT + Verb(Base Form) [NOT ব্যবহার নিষিদ্ধ]',
        visualDiagram: {
          title: 'Lest Clause Construction Pipeline (লেস্ট বাক্যের চেইন ডায়াগ্রাম)',
          type: 'decision_tree',
          steps: [
            { step: 'Step 1', condition: 'বাক্যে সংযোগকারী শব্দ "Lest" দেখা গেছে?', resultBn: 'পরবর্তী ক্লজে যান', color: 'indigo' },
            { step: 'Step 2: Subject', condition: 'Lest এর ঠিক পরেই Subject বসবে', resultBn: 'e.g., he / you / they', color: 'amber' },
            { step: 'Step 3: Modal', condition: 'মডেল হিসেবে সর্বদা SHOULD বসবে', resultBn: 'can / could / will / would নিষিদ্ধ', color: 'rose' },
            { step: 'Step 4: Verb', condition: 'মূল Verb এর Base Form (V1) বসবে', resultBn: 'miss, fail, lose ইত্যাদি', color: 'emerald' },
            { step: 'Step 5: Alert', condition: 'কোনোভাবেই "NOT" বা "NO" যুক্ত করবেন না', resultBn: 'কারণ Lest নিজেই নঞর্থক', color: 'violet' }
          ]
        },
        colorCodedSentence: [
          { token: 'Walk', role: 'verb', note: 'Imperative Verb (হাঁটো)' },
          { token: 'fast', role: 'modifier', note: 'Adverb of Manner (দ্রুত)' },
          { token: 'lest', role: 'connector', note: 'Subordinating Conjunction (পাছে ভয় হয় যে)' },
          { token: 'you', role: 'subject', note: 'Subject Pronoun (তুমি)' },
          { token: 'should', role: 'verb', note: 'Modal Auxiliary (নিয়ম অনুযায়ী বাধ্যতামূলক)' },
          { token: 'miss', role: 'verb', note: 'Main Verb Base Form (হারিয়ে ফেলো)' },
          { token: 'the bus', role: 'object', note: 'Object Noun Phrase' }
        ],
        fillInTheBlanks: [
          {
            id: 'fib-5-1',
            sentence: 'Walk fast lest you [____] miss the bus.',
            answer: 'should',
            hintBn: 'Lest এর নিয়মে কোন মডেল বসে?',
            explanationBn: 'Lest এর সাথে সর্বদা "should" বসে।'
          }
        ],
        errorCorrections: [
          {
            id: 'ec-5-1',
            incorrect: 'Run fast lest you should not miss the train.',
            errorSegment: 'should not miss',
            correct: 'Run fast lest you should miss the train.',
            reasonBn: 'Lest বাক্যে কখনোই "not" বসে না, কারণ Lest শব্দের ভেতরেই "না" সূচক অর্থ বিদ্যমান।'
          }
        ],
        examples: [
          { english: 'Walk fast lest you should miss the bus.', bengali: 'দ্রুত হাঁটো পাছে তুমি বাস মিস না করো।', note: "৪৫তম বিসিএসের প্রশ্ন। Lest এর পর 'should miss' বসেছে।" },
          { english: 'He ran fast lest he should miss the train.', bengali: 'সে দ্রুত দৌড়াল পাছে ট্রেনটি হারিয়ে ফেলে।', note: "৪৬তম বিসিএসের প্রশ্ন। should এর পর verb এর base form।" },
          { english: 'Study attentively lest you should fail in the examination.', bengali: 'মনোযোগ দিয়ে পড়ো পাছে পরীক্ষায় ফেল না করো।', note: "পরীক্ষার্থীকে সতর্ক করার জন্য ব্যবহৃত হয়েছে।" }
        ],
        correctVsIncorrect: [
          { correct: 'Work hard lest you should fail.', incorrect: 'Work hard lest you should not fail.', reasonBn: 'Lest এর ক্লজে "not" বসানো গুরুতর ভুল।' },
          { correct: 'He fled lest he should be seen.', incorrect: 'He fled lest he would be seen.', reasonBn: 'Lest এর সাথে would হবে না, should হবে।' }
        ],
        commonMistakes: [
          'অনেকে can, could, would বা will দাগিয়ে আসেন। মনে রাখুন Lest মানেই should!'
        ],
        exceptions: [
          'আমেরিকান ইংলিশে অনেক সময় Subjunctive mood হিসেবে should উহ্য রেখে শুধু Base verb বসানো হয় (e.g., lest he miss), কিন্তু বিসিএস ও পিএসসির পরীক্ষায় "should" কেই একমাত্র আদর্শ উত্তর হিসেবে নেওয়া হয়।'
        ],
        examTricks: [
          'পরীক্ষার হলে প্রশ্নে "lest" দেখা মাত্রই অপশনে চোখ দিয়ে "should" খুঁজে বের করুন এবং দাগিয়ে দিন!'
        ],
        confusingRelatedRules: [
          'So that / In order that এর পর can / could / may / might বসে, কিন্তু Lest এর পর should বসে।'
        ],
        practiceMcqs: [
          {
            id: 'mcq-5-1-1',
            question: 'Walk fast lest you ____ miss the bus.',
            options: ['can', 'might', 'should', 'will'],
            correctIndex: 2,
            explanationBn: '৪৫তম বিসিএসের প্রশ্ন। Lest এর পরে Subject আসলে নিয়ম অনুযায়ী Modal Auxiliary হিসেবে "should" বসে।',
            difficulty: 'beginner',
            isBcsPastQuestion: true,
            bcsYearTag: '৪৫তম বিসিএস'
          }
        ]
      },
      {
        id: 'rule-5-2',
        ruleNumber: 2,
        title: 'It is high time / It is time + Past Indefinite (V2)',
        bengaliTitle: 'It is high time এর পর সময়ক্ষেপণ রোধে Past Indefinite',
        explanationBn: 'কোনো কাজ করার এখনই উপযুক্ত সময় এবং ইতিমধ্যে কিছুটা দেরি হয়ে গেছে বোঝাতে "It is high time" বা "It is time" ব্যবহৃত হয়। এর পরে যদি সরাসরি কোনো Subject থাকে, তবে Verb-টি অবশ্যই Past Indefinite Tense (V2) এ রূপান্তরিত হবে। তবে Subject না থাকলে "to + V1" বসে।',
        whyAndWhen: 'বিসিএস পরীক্ষায় সবচেয়ে বেশিবার আসা ৩টি ব্যাকরণিক নিয়মের একটি হলো এটি।',
        formula: 'It is high time + Subject + Verb(Past Form - V2) | অথবা It is high time + to + Verb(V1)',
        examples: [
          { english: 'It is high time we changed our bad habits.', bengali: 'আমাদের খারাপ অভ্যাসগুলো পরিবর্তন করার এখনই উপযুক্ত সময়।', note: "Subject 'we' থাকায় Verb 'change' পরিবর্তিত হয়ে 'changed' (V2) হয়েছে।" },
          { english: 'It is time to start the work.', bengali: 'কাজটি শুরু করার সময় হয়েছে।', note: "Subject নেই, তাই 'to + start' ইনফিনিটিভ বসেছে।" },
          { english: 'It is high time they gave up corruption.', bengali: 'তাদের দুর্নীতি ত্যাগ করার এখনই চূড়ান্ত সময়।', note: "'give up' এর past form 'gave up' বসেছে।" }
        ],
        correctVsIncorrect: [
          { correct: 'It is high time we left the place.', incorrect: 'It is high time we leave the place.', reasonBn: 'Subject (we) এর পর Past tense (left) আবশ্যক।' },
          { correct: 'It is time we acted on it.', incorrect: 'It is time we should act on it.', reasonBn: 'Past Indefinite অগ্রাধিকার পায়।' }
        ],
        commonMistakes: [
          'অনেকে বর্তমান সময়ের কথা মনে করে Present Tense (leave, change) দাগিয়ে দেন। মনে রাখবেন গঠনটি Past হলেও এর অর্থ Present বা Future এ কার্যকর বোঝায়।'
        ],
        exceptions: [
          'It is high time for us to leave (for + object থাকলে to + V1 বসে)।'
        ],
        examTricks: [
          'It is high time + [Subject] ➔ চোখ বন্ধ করে Verb-এর ২য় রূপ (V2) খুঁজুন!'
        ],
        confusingRelatedRules: [
          'I wish / I fancy এর পরেও Subject এর পর V2 বসে (যেমন: I wish I were a king)।'
        ],
        practiceMcqs: [
          {
            id: 'mcq-5-2-1',
            question: 'It is high time we ____ the matter.',
            options: ['discuss', 'discussed', 'have discussed', 'are discussing'],
            correctIndex: 1,
            explanationBn: 'It is high time এর পর Subject "we" থাকায় Verb এর Past Indefinite রূপ "discussed" হবে।',
            difficulty: 'beginner',
            isBcsPastQuestion: true,
            bcsYearTag: '৩৮তম বিসিএস'
          }
        ]
      }
    ],
    bcsQuestions: [
      {
        id: 'bcs-5-1',
        bcsExam: '৪৬তম বিসিএস',
        year: 2024,
        question: 'He ran fast lest he ____ miss the train.',
        options: [
          { key: 'A', text: 'will' },
          { key: 'B', text: 'can' },
          { key: 'C', text: 'should' },
          { key: 'D', text: 'may' }
        ],
        correctOption: 'C',
        detailedExplanationBn: 'Lest এর সাথে পরবর্তী ক্লজে সর্বদা "should" বসে এবং এর পর Verb এর base form (miss) ব্যবহৃত হয়। বাক্যটির অর্থ: সে দ্রুত দৌড়াল পাছে সে ট্রেন মিস করে ফেলে।',
        optionBreakdown: [
          { option: 'A (will)', isCorrect: false, reasonBn: 'Lest এর সাথে will কখনো বসে না।' },
          { option: 'B (can)', isCorrect: false, reasonBn: 'সক্ষমতা বোঝায় না, সতর্কতা বোঝায়।' },
          { option: 'C (should)', isCorrect: true, reasonBn: 'ব্যাকরণিক বাধ্যবাধকতা অনুসারে should সঠিক।' },
          { option: 'D (may)', isCorrect: false, reasonBn: 'Lest এর সাথে may বসে না।' }
        ],
        testedRuleRef: 'rule-5-1',
        trapPattern: 'সাধারণ মডেল ভার্বের সাথে গুলিয়ে ফেলা।'
      },
      {
        id: 'bcs-5-2',
        bcsExam: '৪৫তম বিসিএস',
        year: 2023,
        question: 'No sooner had I reached the station ____ the train left.',
        options: [
          { key: 'A', text: 'when' },
          { key: 'B', text: 'than' },
          { key: 'C', text: 'then' },
          { key: 'D', text: 'before' }
        ],
        correctOption: 'B',
        detailedExplanationBn: 'No sooner had...than একটি কো-রিলেটিভ নেগেটিভ ইনভার্সন স্ট্রাকচার। "No sooner" একটি Comparative ডিগ্রী প্রকাশক অভিব্যক্তি হওয়ায় এর সাথে সর্বদা "than" বসে। Scarcely had / Hardly had থাকলে "when" বা "before" বসতো।',
        optionBreakdown: [
          { option: 'A (when)', isCorrect: false, reasonBn: 'Hardly had বা Scarcely had থাকলে when হতো।' },
          { option: 'B (than)', isCorrect: true, reasonBn: 'No sooner এর পেয়ার হলো than।' },
          { option: 'C (then)', isCorrect: false, reasonBn: 'then বানান ভুল, কম্পারেটিভে than ব্যবহৃত হয়।' },
          { option: 'D (before)', isCorrect: false, reasonBn: 'এখানে অপ্রযোজ্য।' }
        ],
        testedRuleRef: 'rule-5-1',
        trapPattern: 'Than বনাম Then এবং When এর মধ্যে বিভ্রান্তি তৈরি করা।'
      }
    ],
    practiceQuestions: [
      {
        id: 'p-5-1',
        question: 'He talks as if he ____ everything.',
        options: ['knows', 'knew', 'has known', 'knowing'],
        correctIndex: 1,
        explanationBn: 'As if / As though এর প্রথম অংশ Present Indefinite হলে পরের অংশ Past Indefinite (V2) হয়। তাই "knew" সঠিক। আর to be verb হলে সর্বত্র "were" বসে (He talks as if he were mad)।',
        difficulty: 'intermediate',
        isBcsPastQuestion: true,
        bcsYearTag: '৩২তম বিসিএস'
      },
      {
        id: 'p-5-2',
        question: 'I had better ____ there immediately.',
        options: ['go', 'to go', 'going', 'went'],
        correctIndex: 0,
        explanationBn: 'Had better, would rather, had rather এর পর সর্বদা Verb এর Base Form (Bare Infinitive) বসে। তাই "go" হবে, "to go" বা "went" হবে না।',
        difficulty: 'intermediate',
        isBcsPastQuestion: true,
        bcsYearTag: '৩৭তম বিসিএস'
      }
    ],
    summaryRevisionNotes: [
      'Lest + Subject + should + V1 (not বসবে না)।',
      'It is high time + Subject + V2 (Past form)।',
      'As if / As though: Present + as if + Past | Past + as if + Past Perfect।',
      'Had better / Would rather + V1 (Bare infinitive)।',
      'No sooner had ... than | Scarcely had ... when | Hardly had ... when/before।'
    ]
  },

  // ── Chapter 6: Subject-Verb Agreement ───────────────────────────────────────
  {
    id: 'chapter-6',
    chapterNumber: 6,
    lectureNo: 'Lecture-10',
    title: 'Subject-Verb Agreement: Master Rules & Exceptions',
    bengaliTitle: 'সাবজেক্ট-ভার্ব এগ্রিমেন্ট: কর্তা অনুযায়ী ক্রিয়ার সামঞ্জস্য',
    category: 'Sentence Syntax',
    icon: 'Scale',
    bcsFrequency: 'Very High',
    bcsFrequencyNotes: 'প্রতি বছর বিসিএস ও পিএসসির পরীক্ষায় নিশ্চিতভাবে ১-২টি প্রশ্ন থাকে। বিশেষ করে "Neither..nor", "Along with / Together with", "Fractions / Percentages", এবং দূরত্ব/অর্থ/সময়ের পরিমাণ থেকে প্রশ্ন আসে। (৪৩তম, ৪১তম, ৩৮তম বিসিএস)',
    subchapters: [
      { id: 'sub-6-1', title: 'Conjunction Pairs (Either..or, Neither..nor)', bengaliTitle: 'নিকটবর্তী সাবজেক্ট অনুযায়ী ভার্ব নির্ধারণের নিয়ম' },
      { id: 'sub-6-2', title: 'Prepositional Parenthesis (As well as, Along with)', bengaliTitle: 'প্রথম সাবজেক্ট অনুযায়ী ভার্ব বসার নিয়ম' },
      { id: 'sub-6-3', title: 'Fractions, Percentages & Quantifiers', bengaliTitle: 'ভগ্নাংশ ও শতকরা থাকলে কীভাবে ভার্ব বসে' },
      { id: 'sub-6-4', title: 'Measurement of Distance, Time & Money', bengaliTitle: 'দূরত্ব, সময় ও অর্থের পরিমাণ সর্বদা একবচন' }
    ],
    rules: [
      {
        id: 'rule-6-1',
        ruleNumber: 1,
        title: 'Rule of Proximity: Either...or, Neither...nor, Not only...but also',
        bengaliTitle: 'প্রক্সিমিটি রুল: নিকটবর্তী কর্তা অনুযায়ী ভার্ব নির্ধারণ',
        explanationBn: 'যখন দুটি Subject "Neither...nor", "Either...or", "Not only...but also", বা "or/nor" দ্বারা যুক্ত থাকে, তখন Verb-টি সর্বদা তার সবচেয়ে কাছের (২য়) Subject অনুযায়ী বসে। কাছের Subject Singular হলে Verb Singular, আর কাছের Subject Plural হলে Verb Plural হবে।',
        whyAndWhen: '৪৩তম বিসিএসে এই নিয়ম থেকে সরাসরি প্রশ্ন এসেছে। এটি প্রতিযোগিতামূলক পরীক্ষার প্রধান প্রশ্নগুলোর একটি।',
        formula: 'Neither S1 nor S2 + VERB (Agreeing with S2 - Nearest Subject)',
        examples: [
          { english: 'Neither the teacher nor the students were present.', bengali: 'শিক্ষক বা ছাত্রছাত্রী কেউই উপস্থিত ছিল না।', note: "৪৩তম বিসিএসের প্রশ্ন। Verb 'were' তার নিকটতম সাবজেক্ট 'students' (Plural) অনুযায়ী বসেছে।" },
          { english: 'Neither the students nor the teacher was present.', bengali: 'ছাত্রছাত্রী বা শিক্ষক কেউই উপস্থিত ছিলেন না।', note: "এখানে নিকটতম সাবজেক্ট 'teacher' (Singular), তাই Verb 'was' হয়েছে।" },
          { english: 'Either you or he is responsible for this.', bengali: 'হয় তুমি না হয় সে এর জন্য দায়ী।', note: "নিকটতম সাবজেক্ট 'he' অনুযায়ী 'is' বসেছে।" }
        ],
        correctVsIncorrect: [
          { correct: 'Neither Rahim nor his friends have come.', incorrect: 'Neither Rahim nor his friends has come.', reasonBn: 'নিকটতম সাবজেক্ট friends (Plural), তাই have হবে।' },
          { correct: 'Not only the manager but also the workers were praised.', incorrect: 'Not only the manager but also the workers was praised.', reasonBn: 'workers অনুযায়ী were বসেছে।' }
        ],
        commonMistakes: [
          'ছাত্ররা প্রথম সাবজেক্টের দিকে তাকিয়ে ভার্ব বসিয়ে ভুল করেন। মনে রাখুন: or/nor থাকলে কেবল শেষ/নিকটের সাবজেক্ট দেখতে হবে।'
        ],
        exceptions: [
          'যদি কেবল "Neither of" বা "Either of" থাকে (nor/or ছাড়া), তবে Verb সর্বদা Singular হবে! যেমন: "Neither of the boys was present"।'
        ],
        examTricks: [
          'Nor/Or থাকলে পেছনের দিকে তাকাবেন না, ঠিক Nor/Or এর পরের সাবজেক্ট দেখে ভার্ব বসান।'
        ],
        confusingRelatedRules: [
          'Rule 6-2: As well as, along with থাকলে আবার ঠিক উল্টো—প্রথম সাবজেক্ট দেখে ভার্ব বসে!'
        ],
        practiceMcqs: [
          {
            id: 'mcq-6-1-1',
            question: 'Neither the teacher nor the students ____ present.',
            options: ['was', 'were', 'is', 'are'],
            correctIndex: 1,
            explanationBn: '৪৩তম বিসিএসের প্রশ্ন। Neither...nor এর ক্ষেত্রে ভার্ব নিকটতম সাবজেক্ট অনুযায়ী বসে। এখানে নিকটতম সাবজেক্ট "the students" (বহুবচন), তাই অতীতকালে "were" সঠিক।',
            difficulty: 'intermediate',
            isBcsPastQuestion: true,
            bcsYearTag: '৪৩তম বিসিএস'
          }
        ]
      },
      {
        id: 'rule-6-2',
        ruleNumber: 2,
        title: 'As well as, Along with, Together with, Accompanied by',
        bengaliTitle: 'প্রথম সাবজেক্ট অনুযায়ী ভার্ব নির্ধারণের অমোঘ নিয়ম',
        explanationBn: 'যদি দুটি Subject যুক্ত থাকে: as well as, along with, together with, accompanied by, in addition to, with, including, excluding ইত্যাদি ফ্রেজ দিয়ে, তবে মাঝের অংশটি মূলত অতিরিক্ত তথ্য (Parenthesis)। তাই Verb সর্বদা প্রথম Subject (1st Subject) অনুযায়ী নির্ধারিত হবে।',
        whyAndWhen: 'বিসিএস পরীক্ষায় এই নিয়মটি বারবার আসে কারণ ছাত্ররা কাছের সাবজেক্ট দেখে ভুল করে ফেলে।',
        formula: 'S1 + [as well as / along with / together with] + S2 + VERB (Agreeing with S1)',
        examples: [
          { english: 'The chairman, along with his advisors, is attending the meeting.', bengali: 'উপদেষ্টাদের সাথে নিয়ে চেয়ারম্যান মিটিংয়ে উপস্থিত হচ্ছেন।', note: "advisors বহুবচন হওয়া সত্ত্বেও ১ম সাবজেক্ট 'The chairman' একবচন বলে Verb 'is' হয়েছে।" },
          { english: 'Rahim as well as his brothers was invited.', bengali: 'ভাইদের সাথে রহিমও আমন্ত্রিত ছিল।', note: "১ম সাবজেক্ট 'Rahim' একবচন, তাই 'was' বসেছে।" },
          { english: 'The soldiers, accompanied by the captain, were marching.', bengali: 'ক্যাপ্টেনের সাথে সৈন্যরা মার্চ করছিল।', note: "১ম সাবজেক্ট 'The soldiers' বহুবচন, তাই 'were' হয়েছে।" }
        ],
        correctVsIncorrect: [
          { correct: 'He as well as I is ready.', incorrect: 'He as well as I am ready.', reasonBn: '১ম সাবজেক্ট "He", তাই "am" নয়, "is" হবে।' },
          { correct: 'The principal along with the teachers has visited the lab.', incorrect: 'The principal along with the teachers have visited the lab.', reasonBn: '১ম সাবজেক্ট The principal একবচন, তাই has।' }
        ],
        commonMistakes: [
          '"I" দেখে "am" বসানো সবচেয়ে ক্লাসিক ফাঁদ! "He as well as I" বাক্যে "He" দেখে "is" বসাতে হবে।'
        ],
        exceptions: [
          'যদি শুধু "And" দিয়ে যুক্ত হয় (যেমন: Rahim and Karim), তবে Verb বহুবচন (are/were) হবে।'
        ],
        examTricks: [
          'পেন্সিল দিয়ে as well as / along with থেকে শুরু করে পরবর্তী সাবজেক্ট পর্যন্ত মনে মনে কেটে দিন! বাক্যটি দাঁড়াবে: "The chairman [...] is attending।" এবার ভুল হওয়ার কোনো সুযোগই নেই!'
        ],
        confusingRelatedRules: [
          'Or / Nor এর সময় ২য় সাবজেক্ট দেখে ভার্ব বসে, কিন্তু As well as / Along with এর সময় ১ম সাবজেক্ট দেখে ভার্ব বসে।'
        ],
        practiceMcqs: [
          {
            id: 'mcq-6-2-1',
            question: 'The captain along with his team members ____ arrived.',
            options: ['have', 'has', 'were', 'are'],
            correctIndex: 1,
            explanationBn: 'along with দ্বারা যুক্ত থাকায় ১ম সাবজেক্ট "The captain" (Singular) অনুযায়ী Verb Singular "has" হবে। team members দেখে have দেওয়া যাবে না।',
            difficulty: 'intermediate',
            isBcsPastQuestion: true,
            bcsYearTag: '৩৮তম বিসিএস'
          }
        ]
      }
    ],
    bcsQuestions: [
      {
        id: 'bcs-6-1',
        bcsExam: '৪৩তম বিসিএস',
        year: 2021,
        question: 'Identify the sentence with correct subject-verb agreement:',
        options: [
          { key: 'A', text: 'Neither the teacher nor the students was present.' },
          { key: 'B', text: 'Neither the teacher nor the students were present.' },
          { key: 'C', text: 'Neither the students nor the teacher were present.' },
          { key: 'D', text: 'Neither the teachers nor the student are present.' }
        ],
        correctOption: 'B',
        detailedExplanationBn: 'Neither...nor এর নিয়মে Verb নিকটতম সাবজেক্ট অনুযায়ী বসে। অপশন B-তে Verb "were" এর ঠিক আগের সাবজেক্ট "the students" একটি বহুবচন Noun। তাই Plural Verb "were" সঠিক। অপশন C-তে teacher একবচন থাকা সত্ত্বেও were বসানো হয়েছে যা ভুল।',
        optionBreakdown: [
          { option: 'A', isCorrect: false, reasonBn: 'the students বহুবচন, তাই was ভুল।' },
          { option: 'B', isCorrect: true, reasonBn: 'the students বহুবচন এবং were ও বহুবচন।' },
          { option: 'C', isCorrect: false, reasonBn: 'the teacher একবচন, তাই were ভুল।' },
          { option: 'D', isCorrect: false, reasonBn: 'the student একবচন, are ভুল।' }
        ],
        testedRuleRef: 'rule-6-1',
        trapPattern: 'নিকটতম সাবজেক্ট ও দূরবর্তী সাবজেক্টের মধ্যে একবচন-বহুবচন অদলবদল করা।'
      }
    ],
    practiceQuestions: [
      {
        id: 'p-6-1',
        question: 'Fifty thousand dollars ____ a big amount of money.',
        options: ['is', 'are', 'were', 'have been'],
        correctIndex: 0,
        explanationBn: 'অর্থের পরিমাণ, সময়, দূরত্ব বা ওজন বহুবচন মনে হলেও সামগ্রিক একক হিসেবে সর্বদা Singular Verb গ্রহণ করে। তাই "is" সঠিক।',
        difficulty: 'beginner',
        isBcsPastQuestion: true,
        bcsYearTag: '৩৭তম বিসিএস'
      },
      {
        id: 'p-6-2',
        question: 'Two-thirds of the work ____ finished.',
        options: ['have been', 'has been', 'are', 'were'],
        correctIndex: 1,
        explanationBn: 'ভগ্নাংশ বা শতকরার পর Uncountable Noun (work) থাকলে Verb Singular হয় (has been)। কিন্তু Plural Countable Noun থাকলে Verb Plural হতো (Two-thirds of the students have passed)।',
        difficulty: 'intermediate',
        isBcsPastQuestion: true,
        bcsYearTag: '৩৫তম বিসিএস'
      }
    ],
    summaryRevisionNotes: [
      'Neither..nor / Either..or / Not only..but also ➔ নিকটতম (২য়) সাবজেক্ট অনুযায়ী ভার্ব।',
      'As well as / Along with / Together with / With ➔ ১ম সাবজেক্ট অনুযায়ী ভার্ব।',
      'One of the + Plural Noun + Singular Verb (e.g., One of the boys is absent)।',
      'দূরত্ব, সময়, অর্থ, ওজন সামগ্রিক একক হিসেবে সর্বদা Singular Verb নেয় (Ten miles is a long way)।',
      'ভগ্নাংশ/শতকরা: ভগ্নাংশের পরের Noun যদি Singular/Uncountable হয় ➔ Verb Singular; Noun Plural হলে ➔ Verb Plural।'
    ]
  },

  // ── Chapter 7: Voice Change & Passive Constructions ─────────────────────────
  {
    id: 'chapter-7',
    chapterNumber: 7,
    lectureNo: 'Lecture-14',
    title: 'Voice Change: Active to Passive & Tricky Patterns',
    bengaliTitle: 'বাচ্য পরিবর্তন: জটিল প্রশ্ন ও ব্যতিক্রমী প্যাসিভ রূপান্তর',
    category: 'Sentence Syntax',
    icon: 'RefreshCw',
    bcsFrequency: 'High',
    bcsFrequencyNotes: 'Who দিয়ে ইন্টারোগেটিভ বাক্য ("Who taught you English?"), আদেশসূচক বাক্য ("Do it"), এবং প্রিপজিশনাল প্যাসিভ (surprised at, pleased with, known to) থেকে বিসিএসে প্রশ্ন এসেছে। (৪৪তম, ৪১তম, ৪০তম, ৩৭তম বিসিএস)',
    subchapters: [
      { id: 'sub-7-1', title: 'Interrogative Voice with Who / Whom', bengaliTitle: 'Who এবং Whom যুক্ত বাক্যের প্যাসিভ' },
      { id: 'sub-7-2', title: 'Imperative Sentences with Let', bengaliTitle: 'আদেশ, নিষেধ ও অনুরোধসূচক বাক্যের প্যাসিভ' },
      { id: 'sub-7-3', title: 'Quasi-Passive & Reflexive Objects', bengaliTitle: 'কোয়াসি-প্যাসিভ ও রিফ্লেক্সিভ অবজেক্টের প্যাসিভ' },
      { id: 'sub-7-4', title: 'Verbs Taking Prepositions other than By', bengaliTitle: 'By ছাড়া অন্যান্য প্রিপজিশন গ্রহণকারী ভার্ব' }
    ],
    rules: [
      {
        id: 'rule-7-1',
        ruleNumber: 1,
        title: 'Interrogative Voice with "Who" -> "By whom"',
        bengaliTitle: 'Who যুক্ত প্রশ্নবোধক বাক্যের প্যাসিভ করার নিয়ম',
        explanationBn: 'Active Voice-এ "Who" থাকলে Passive করার সময় শুরুতে "By whom" বসে। এরপর Tense ও নতুন Subject অনুযায়ী Auxiliary Verb বসে, তারপর Subject বসে, এবং সবশেষে মূল Verb-এর Past Participle (V3) বসে।',
        whyAndWhen: '৪০তম ও ৪১তম বিসিএসে যথাক্রমে "Who taught you English?" এবং "Who broke the glass?" প্রশ্ন এসেছে।',
        formula: 'By whom + Auxiliary Verb + Subject + V3 (Past Participle) + ?',
        examples: [
          { english: 'Who taught you English?', bengali: 'তোমাকে কে ইংরেজি শিখিয়েছিল?', note: "৪০তম বিসিএসের প্রশ্ন। Passive: By whom were you taught English? (অথবা By whom was English taught to you?)" },
          { english: 'Who broke the glass?', bengali: 'গ্লাসটি কে ভেঙেছিল?', note: "৪১তম বিসিএসের প্রশ্ন। Passive: By whom was the glass broken?" },
          { english: 'Who will help you?', bengali: 'তোমাকে কে সাহায্য করবে?', note: "Passive: By whom will you be helped?" }
        ],
        correctVsIncorrect: [
          { correct: 'By whom were you taught English?', incorrect: 'By whom you were taught English?', reasonBn: 'প্রশ্নবোধক বাক্যে Subject (you) এর পূর্বে Auxiliary verb (were) বসতে হবে।' },
          { correct: 'By whom was it done?', incorrect: 'Whom was it done by?', reasonBn: 'By whom শুরুতে বসানোই বিসিএস পরীক্ষার স্বীকৃত রূপ।' }
        ],
        commonMistakes: [
          'প্রশ্নবোধক বাক্যে Subject এর আগে Auxiliary Verb না বসিয়ে পরে বসালে পুরো বাক্য ভুল হয়ে যায়।'
        ],
        exceptions: [
          'Whom থাকলে Passive করার সময় শুরুতে "Who" বসে। যেমন: "Whom did you see?" ➔ "Who was seen by you?"'
        ],
        examTricks: [
          'Who দেখলে অপশনে খুঁজুন "By whom" + [Auxiliary Verb] + [Subject] + [V3]। স্ট্রাকচার মিলালেই ১০ সেকেন্ডে উত্তর নিশ্চিত!'
        ],
        confusingRelatedRules: [
          'Whom ➔ Who | Who ➔ By whom।'
        ],
        practiceMcqs: [
          {
            id: 'mcq-7-1-1',
            question: 'The passive form of "Who taught you English?" is:',
            options: [
              'By whom you were taught English?',
              'By whom were you taught English?',
              'Who was taught English by you?',
              'By whom English was taught you?'
            ],
            correctIndex: 1,
            explanationBn: '৪০তম বিসিএসের প্রশ্ন। Who এর জন্য By whom + auxiliary verb (were) + subject (you) + V3 (taught) + বাকি অংশ (English) + ?।',
            difficulty: 'intermediate',
            isBcsPastQuestion: true,
            bcsYearTag: '৪০তম বিসিএস'
          }
        ]
      }
    ],
    bcsQuestions: [
      {
        id: 'bcs-7-1',
        bcsExam: '৪০তম বিসিএস',
        year: 2019,
        question: 'The passive of "Who taught you English?"',
        options: [
          { key: 'A', text: 'By whom you were taught English?' },
          { key: 'B', text: 'By whom were you taught English?' },
          { key: 'C', text: 'Who was taught you English?' },
          { key: 'D', text: 'By whom was you taught English?' }
        ],
        correctOption: 'B',
        detailedExplanationBn: 'Past Indefinite Tense এর প্রশ্নবোধক বাক্যে Active-এ Who থাকলে Passive-এ By whom হয়। তারপর "you" অবজেক্টকে সাবজেক্ট করায় Auxiliary Verb "were" পূর্বে বসেছে (were you taught English?)।',
        optionBreakdown: [
          { option: 'A', isCorrect: false, reasonBn: 'you were লিখে Assertive রূপ দেওয়া হয়েছে, প্রশ্নবোধক করা হয়নি।' },
          { option: 'B', isCorrect: true, reasonBn: 'By whom were you taught English? সম্পূর্ণ ব্যাকরণসম্মত।' },
          { option: 'C', isCorrect: false, reasonBn: 'By whom নেই।' },
          { option: 'D', isCorrect: false, reasonBn: 'you এর সাথে was বসে না, were বসে।' }
        ],
        testedRuleRef: 'rule-7-1',
        trapPattern: 'ইন্টারোগেটিভ বাক্যের ওয়ার্ড অর্ডার ও you-এর সাথে were/was এর বিভ্রান্তি।'
      },
      {
        id: 'bcs-7-2',
        bcsExam: '৪৪তম বিসিএস',
        year: 2022,
        question: 'Identify the correct passive form of "Do it":',
        options: [
          { key: 'A', text: 'Let it be done' },
          { key: 'B', text: 'Let it done' },
          { key: 'C', text: 'It should be done' },
          { key: 'D', text: 'You are requested to do it' }
        ],
        correctOption: 'A',
        detailedExplanationBn: 'আদেশসূচক (Imperative) বাক্যে মূল Verb দিয়ে শুরু হলে প্যাসিভ করার সূত্র হলো: Let + Object + be + V3। তাই "Do it" এর প্যাসিভ রূপ হলো "Let it be done"।',
        optionBreakdown: [
          { option: 'A', isCorrect: true, reasonBn: 'Let + it + be + done সূত্র হুবহু মিলেছে।' },
          { option: 'B', isCorrect: false, reasonBn: 'be বাদ পড়েছে।' },
          { option: 'C', isCorrect: false, reasonBn: 'সাধারণ প্যাসিভ রূপ নয়।' },
          { option: 'D', isCorrect: false, reasonBn: 'অনুরোধ নয়, সাধারণ আদেশ।' }
        ],
        testedRuleRef: 'rule-7-1',
        trapPattern: 'Imperative বাক্যে be বাদ দিয়ে ভুল অপশন তৈরি।'
      }
    ],
    practiceQuestions: [
      {
        id: 'p-7-1',
        question: 'All of us were surprised ____ his success.',
        options: ['by', 'with', 'at', 'in'],
        correctIndex: 2,
        explanationBn: '৩৭তম বিসিএসে আসা প্রশ্ন। Surprise, Shock, Astonish এর সাথে প্যাসিভ ভয়েসে ব্যক্তির ক্ষেত্রে with কিন্তু কোনো আচরণ/ঘটনার ক্ষেত্রে "at" বসে (surprised at his success)।',
        difficulty: 'intermediate',
        isBcsPastQuestion: true,
        bcsYearTag: '৩৭তম বিসিএস'
      },
      {
        id: 'p-7-2',
        question: 'Panic seized the writer. The passive form is:',
        options: [
          'The writer was seized by panic',
          'The writer was seized with panic',
          'The writer was seized at panic',
          'The writer had been seized with panic'
        ],
        correctIndex: 1,
        explanationBn: 'Seize এর পর ভয়/আবেগের ক্ষেত্রে Preposition হিসেবে "with" বসে, by বসে না। তাই "The writer was seized with panic" সঠিক।',
        difficulty: 'advanced',
        isBcsPastQuestion: true,
        bcsYearTag: '৩৫তম বিসিএস'
      }
    ],
    summaryRevisionNotes: [
      'Who ➔ By whom + Aux Verb + Subject + V3 + ?',
      'Whom ➔ Who + Aux Verb + V3 + by + Object + ?',
      'Imperative: Let + Object + be + V3 (না-বোধক হলে Let not + Object + be + V3)।',
      'ব্যতিক্রমী প্রিপজিশন: Known to, Surprised at, Pleased with, Seized with, Satisfied with, Annoyed with (ব্যক্তি) / Annoyed at (আচরণ)।'
    ]
  }
];
