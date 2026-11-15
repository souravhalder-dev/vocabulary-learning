import { GrammarChapter, GrammarRule, BcsQuestionAnalysis, GrammarQuizQuestion } from '../../types/grammar';
import { MODULE_1_CHAPTERS } from './module1-parts-of-speech';
import { MODULE_2_CHAPTERS } from './module2-sentence-syntax';
import { MODULE_3_CHAPTERS } from './module3-vocabulary-usage';

export const ALL_GRAMMAR_CHAPTERS: GrammarChapter[] = [
  ...MODULE_1_CHAPTERS,
  ...MODULE_2_CHAPTERS,
  ...MODULE_3_CHAPTERS,
];

export function getChapterById(chapterId: string): GrammarChapter | undefined {
  return ALL_GRAMMAR_CHAPTERS.find((c) => c.id === chapterId);
}

export function getAllBcsQuestions(): BcsQuestionAnalysis[] {
  return ALL_GRAMMAR_CHAPTERS.flatMap((c) => c.bcsQuestions);
}

export function getAllPracticeQuestions(): GrammarQuizQuestion[] {
  return ALL_GRAMMAR_CHAPTERS.flatMap((c) => c.practiceQuestions);
}

export function searchGrammarContent(query: string): {
  chapters: GrammarChapter[];
  rules: { chapter: GrammarChapter; rule: GrammarRule }[];
  bcsQuestions: BcsQuestionAnalysis[];
} {
  const q = query.toLowerCase().trim();
  if (!q) {
    return { chapters: [], rules: [], bcsQuestions: [] };
  }

  const matchingChapters = ALL_GRAMMAR_CHAPTERS.filter(
    (c) =>
      c.title.toLowerCase().includes(q) ||
      c.bengaliTitle.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      (c.lectureNo && c.lectureNo.toLowerCase().includes(q))
  );

  const matchingRules: { chapter: GrammarChapter; rule: GrammarRule }[] = [];
  const matchingBcs: BcsQuestionAnalysis[] = [];

  for (const chapter of ALL_GRAMMAR_CHAPTERS) {
    for (const rule of chapter.rules) {
      if (
        rule.title.toLowerCase().includes(q) ||
        rule.bengaliTitle.toLowerCase().includes(q) ||
        rule.explanationBn.toLowerCase().includes(q) ||
        rule.formula.toLowerCase().includes(q) ||
        rule.examples.some((e) => e.english.toLowerCase().includes(q) || e.bengali.toLowerCase().includes(q))
      ) {
        matchingRules.push({ chapter, rule });
      }
    }

    for (const bcs of chapter.bcsQuestions) {
      if (
        bcs.question.toLowerCase().includes(q) ||
        bcs.bcsExam.toLowerCase().includes(q) ||
        bcs.detailedExplanationBn.toLowerCase().includes(q)
      ) {
        matchingBcs.push(bcs);
      }
    }
  }

  return {
    chapters: matchingChapters,
    rules: matchingRules,
    bcsQuestions: matchingBcs,
  };
}
