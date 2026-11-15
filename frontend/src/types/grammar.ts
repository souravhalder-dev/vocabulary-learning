export type GrammarDifficulty = 'beginner' | 'intermediate' | 'advanced';

export type BcsFrequency = 'Very High' | 'High' | 'Medium' | 'Frequent';

export interface GrammarExample {
  english: string;
  bengali: string;
  note?: string;
}

export interface CorrectVsIncorrect {
  correct: string;
  incorrect: string;
  reasonBn: string;
}

export interface GrammarQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanationBn: string;
  difficulty: GrammarDifficulty;
  isBcsPastQuestion: boolean;
  bcsYearTag?: string;
  ruleIdRef?: string;
}

export interface VisualStep {
  step: string;
  condition: string;
  resultBn: string;
  color: 'indigo' | 'emerald' | 'amber' | 'rose' | 'violet';
}

export interface VisualDiagram {
  title: string;
  type: 'flowchart' | 'decision_tree' | 'timeline';
  steps: VisualStep[];
}

export interface ColorCodedToken {
  token: string;
  role: 'subject' | 'verb' | 'object' | 'modifier' | 'connector' | 'preposition';
  note: string;
}

export interface FillInTheBlank {
  id: string;
  sentence: string; // e.g. "He ran fast lest he [___] miss the train."
  answer: string;
  hintBn: string;
  explanationBn: string;
}

export interface ErrorCorrectionItem {
  id: string;
  incorrect: string;
  errorSegment: string;
  correct: string;
  reasonBn: string;
}

export interface GrammarRule {
  id: string;
  ruleNumber: number;
  title: string;
  bengaliTitle: string;
  explanationBn: string;
  whyAndWhen: string;
  formula: string;
  visualDiagram?: VisualDiagram;
  colorCodedSentence?: ColorCodedToken[];
  examples: GrammarExample[];
  correctVsIncorrect: CorrectVsIncorrect[];
  commonMistakes: string[];
  exceptions: string[];
  examTricks: string[];
  confusingRelatedRules: string[];
  practiceMcqs: GrammarQuizQuestion[];
  fillInTheBlanks?: FillInTheBlank[];
  errorCorrections?: ErrorCorrectionItem[];
}

export interface OptionAnalysis {
  option: string;
  isCorrect: boolean;
  reasonBn: string;
}

export interface BcsQuestionAnalysis {
  id: string;
  bcsExam: string; // e.g. "45th BCS", "40th BCS"
  year: number;
  question: string;
  options: { key: string; text: string }[];
  correctOption: string; // e.g. "A", "B", "C", "D"
  detailedExplanationBn: string;
  optionBreakdown: OptionAnalysis[];
  testedRuleRef: string;
  trapPattern: string;
}

export interface GrammarSubchapter {
  id: string;
  title: string;
  bengaliTitle: string;
}

export interface GrammarChapter {
  id: string;
  chapterNumber: number;
  title: string;
  bengaliTitle: string;
  category: string;
  lectureNo?: string; // e.g. "Lecture-01", "Lecture-04" from BCS Course Plan
  icon: string;
  bcsFrequency: BcsFrequency;
  bcsFrequencyNotes: string;
  subchapters: GrammarSubchapter[];
  rules: GrammarRule[];
  bcsQuestions: BcsQuestionAnalysis[];
  practiceQuestions: GrammarQuizQuestion[];
  summaryRevisionNotes: string[];
}

export interface UserGrammarProgress {
  completedRules: string[]; // rule ids
  completedChapters: string[]; // chapter ids
  bookmarkedRules: string[]; // rule ids
  savedQuestions: string[]; // question ids
  personalNotes: Record<string, string>; // ruleId -> student's custom notes
  quizScores: Record<string, { total: number; score: number; date: string }>;
}
