import { NextRequest, NextResponse } from 'next/server';
import { ALL_GRAMMAR_CHAPTERS } from '@/lib/grammar-data';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = (body.query || '').trim();
    const chapterId = body.chapterId;
    const ruleId = body.ruleId;

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Build context from the textbook
    let textbookContext = '';
    const relevantChapter = ALL_GRAMMAR_CHAPTERS.find((c) => c.id === chapterId);
    if (relevantChapter) {
      textbookContext += `\n[Current Chapter: ${relevantChapter.chapterNumber}. ${relevantChapter.title} (${relevantChapter.bengaliTitle})]`;
      const relevantRule = relevantChapter.rules.find((r) => r.id === ruleId);
      if (relevantRule) {
        textbookContext += `\n[Current Rule ${relevantRule.ruleNumber}: ${relevantRule.title} (${relevantRule.bengaliTitle})]`;
        textbookContext += `\nExplanation: ${relevantRule.explanationBn}`;
        textbookContext += `\nFormula: ${relevantRule.formula}`;
      }
    }

    const systemPrompt = `You are the Expert AI English Grammar Tutor for "ShobdoShadhon - English Language" (BCS & Competitive Exam Preparation System).
Your role is to teach English Grammar to Bangladeshi students in very simple, lucid, natural, and encouraging Bangla.

Guidelines:
1. Always answer in simple, warm, standard Bangla by default.
2. Clearly explain the core grammatical rule and why it applies.
3. Provide the exact formula/structure.
4. Give multiple English example sentences with clear Bangla translations.
5. Contrast with incorrect vs correct examples and point out the common trap/mistake that BCS students make.
6. Mention relevant BCS examination question trends (e.g., 35th to 46th BCS) whenever applicable.
7. If the question relates to the textbook curriculum, refer to the chapter/rule number.
8. Keep your response well-formatted with markdown headings, bullet points, and code blocks for formulas.
${textbookContext}`;

    const apiKey = process.env.AI_API_KEY || process.env.OPENROUTER_API_KEY || '';
    const geminiKey = process.env.GEMINI_API_KEY || '';

    let aiReply = '';

    // 1. Try OpenRouter AI
    if (apiKey) {
      try {
        const modelName = process.env.AI_MODEL || 'nvidia/nemotron-3-ultra-550b-a55b:free';
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'HTTP-Referer': 'https://vocabulary-learning.app',
            'X-Title': 'ShobdoShadhon English Language Tutor',
          },
          body: JSON.stringify({
            model: modelName,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: query },
            ],
            temperature: 0.2,
            max_tokens: 1000,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          aiReply = data.choices?.[0]?.message?.content || '';
        }
      } catch (err) {
        console.warn('OpenRouter call error:', err);
      }
    }

    // 2. Fallback to Gemini if OpenRouter returned empty
    if (!aiReply && geminiKey) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [{ text: `${systemPrompt}\n\nStudent's Question: ${query}` }],
                },
              ],
            }),
          }
        );
        if (res.ok) {
          const data = await res.json();
          aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        }
      } catch (err) {
        console.warn('Gemini fallback error:', err);
      }
    }

    // 3. Fallback to local rule engine if offline / keys unavailable
    if (!aiReply) {
      aiReply = `### ব্যাকরণিক ব্যাখ্যা (Grammar Analysis)
আপনার প্রশ্ন: **"${query}"**

**মৌলিক নিয়ম ও ব্যাখ্যা:**
বিসিএস ও অন্যান্য প্রতিযোগিতামূলক পরীক্ষায় ইংরেজি ব্যাকরণের নিয়মাবলী অত্যন্ত নিখুঁতভাবে অনুসরণ করতে হয়। 

- **বাক্যের মৌলিক গঠন:** \`Subject + Verb + Object / Complement\`
- **বিসিএস স্পেশাল টিপ:** পরীক্ষার প্রশ্নে যখন কোনো নিয়ম আসে (যেমন: *Lest + should*, *Neither..nor*, *As well as*, বা *Gerund vs Participle*), তখন বাক্যে পদের অবস্থান ও সময়কাল (Tense) লক্ষ্য করুন।

📘 আরও বিস্তারিত জানতে এবং অনুশীলন করতে বামপাশের সূচিপত্র থেকে সংশ্লিষ্ট অধ্যায়টি অধ্যয়ন করুন।`;
    }

    return NextResponse.json({
      answer: aiReply,
      chapterId,
      ruleId,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'AI Tutor failed' }, { status: 500 });
  }
}
