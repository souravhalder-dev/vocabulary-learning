/**
 * LangChain-powered Bengali pronunciation engine.
 * Uses @langchain/openai (targeting OpenRouter) + @langchain/core messages.
 * This module is ONLY imported in server-side Next.js API routes (never in client components).
 */

import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

// ── Shared model instance (created once per cold start) ─────────────────────
let _model: ChatOpenAI | null = null;

function getModel(): ChatOpenAI {
  if (_model) return _model;

  const apiKey = process.env.AI_API_KEY || process.env.OPENROUTER_API_KEY || "";
  const modelName =
    process.env.AI_MODEL || "nvidia/nemotron-3-ultra-550b-a55b:free";

  _model = new ChatOpenAI({
    model: modelName,
    apiKey,
    // Point to OpenRouter's OpenAI-compatible endpoint
    configuration: {
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": "https://vocabulary-learning.app",
        "X-Title": "ShobdoShadhon Vocabulary Learning",
      },
    },
    maxTokens: 350,
    temperature: 0,
    // LangChain timeout in ms
    timeout: 4500,
  });

  return _model;
}

// ── Bengali unicode extraction helper ───────────────────────────────────────
function extractBengali(text: string): string | null {
  if (!text) return null;
  // Strip markdown code fences
  const cleaned = text.replace(/```[\s\S]*?```/g, "").replace(/["`']/g, "").trim();
  const match = cleaned.match(/[\u0980-\u09FF][\u0980-\u09FF\s\u09BC\u09BE-\u09C8\u09CB-\u09D7]*/);
  if (match) {
    const pron = match[0].trim();
    if (pron.length >= 2 && !pron.includes("\n")) return pron;
  }
  return null;
}

// ── Main export: AI-powered Bengali pronunciation via LangChain ──────────────
export async function fetchAiBengaliPronunciationLC(
  word: string,
  accent: 'uk' | 'us' = 'uk',
  givenIpa?: string
): Promise<string | null> {
  const clean = word.replace(/[^a-zA-Z]/g, "").trim().toLowerCase();
  if (!clean) return null;

  const apiKey = process.env.AI_API_KEY || process.env.OPENROUTER_API_KEY || "";
  if (!apiKey) return null;

  try {
    const model = getModel();

    const accentDesc = accent === 'us'
      ? "authentic General American English (US)"
      : "authentic British English (UK/RP)";

    const systemPrompt = givenIpa
      ? `You are an expert English-to-Bengali phonetician. Given the English word and its authentic ${accentDesc} IPA transcription (${givenIpa}), convert it into accurate Bengali script pronunciation (বাংলা উচ্চারণ). Return ONLY the Bengali pronunciation word in Bengali script. Do not write English letters or explanation.`
      : `You are an expert English-to-Bengali phonetician. Given an English word, write its ${accentDesc} pronunciation in Bengali script (বাংলা উচ্চারণ). Consider syllables, silent letters, and stress. Return ONLY the Bengali pronunciation word. No English, no explanation.`;

    const messages = [
      new SystemMessage(systemPrompt),
      new HumanMessage(givenIpa ? `Word: "${clean}", IPA: "${givenIpa}"` : `Word: "${clean}"`),
    ];

    const response = await model.invoke(messages);

    // response.content may be string or complex content parts
    let content =
      typeof response.content === "string"
        ? response.content
        : Array.isArray(response.content)
        ? response.content
            .map((c) => (typeof c === "string" ? c : (c as { text?: string }).text || ""))
            .join("")
        : "";

    // Some reasoning models put Bengali in additional_kwargs.reasoning
    if (!content || !content.match(/[\u0980-\u09FF]/)) {
      const reasoning =
        (response.additional_kwargs as Record<string, unknown>)?.reasoning as string | undefined;
      if (reasoning) content = reasoning;
    }

    return extractBengali(content);
  } catch (err) {
    console.error("[ai-phonetics] LangChain call failed:", (err as Error).message);
    return null;
  }
}

// ── Fallback chain: try multiple free OpenRouter models ─────────────────────
const FALLBACK_MODELS = [
  "nvidia/nemotron-3-ultra-550b-a55b:free",
  "meta-llama/llama-3.1-8b-instruct:free",
  "google/gemma-3-27b-it:free",
];

export async function fetchAiBengaliPronunciationWithFallback(
  word: string,
  accent: 'uk' | 'us' = 'uk',
  givenIpa?: string
): Promise<string | null> {
  const clean = word.replace(/[^a-zA-Z]/g, "").trim().toLowerCase();
  if (!clean) return null;

  const apiKey = process.env.AI_API_KEY || process.env.OPENROUTER_API_KEY || "";
  if (!apiKey) return null;

  const accentDesc = accent === 'us' ? "General American English (US)" : "British English (UK)";

  for (const modelName of FALLBACK_MODELS) {
    try {
      const model = new ChatOpenAI({
        model: modelName,
        apiKey,
        configuration: {
          baseURL: "https://openrouter.ai/api/v1",
          defaultHeaders: {
            "HTTP-Referer": "https://vocabulary-learning.app",
            "X-Title": "ShobdoShadhon Vocabulary Learning",
          },
        },
        maxTokens: 350,
        temperature: 0,
        timeout: 4000,
      });

      const response = await model.invoke([
        new SystemMessage(
          `You are an expert English-to-Bengali phonetician. Given an English word, write its natural ${accentDesc} pronunciation in Bengali script. Return ONLY the Bengali pronunciation word. No English, no explanation.`
        ),
        new HumanMessage(givenIpa ? `Word: "${clean}", IPA: "${givenIpa}"` : `Word: "${clean}"`),
      ]);

      let content =
        typeof response.content === "string"
          ? response.content
          : Array.isArray(response.content)
          ? response.content
              .map((c) => (typeof c === "string" ? c : (c as { text?: string }).text || ""))
              .join("")
          : "";

      const bengali = extractBengali(content);
      if (bengali) {
        return bengali;
      }
    } catch (err) {
      // continue to next fallback
    }
  }

  return null;
}
