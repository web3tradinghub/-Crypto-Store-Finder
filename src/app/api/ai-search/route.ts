import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();
    if (!query) return NextResponse.json({ error: 'No query' }, { status: 400 });

    const prompt = `You are a crypto merchant search assistant.
The user typed: "${query}"

Extract the following and respond ONLY with valid JSON:
- location: the city or country they want to search
- category: type of shop (cafe, restaurant, bitcoin atm, etc) or "any"
- corrected_query: fix typos and translate Urdu/Hindi to English
- confidence: number 0 to 1

Examples:
"cofee shp dubai" → {"location":"Dubai","category":"cafe","corrected_query":"coffee shop Dubai","confidence":0.95}
"bitcoin ki dukan karachi mein" → {"location":"Karachi","category":"bitcoin atm","corrected_query":"bitcoin shop Karachi","confidence":0.98}
"restarant in germny" → {"location":"Germany","category":"restaurant","corrected_query":"restaurant in Germany","confidence":0.93}
"crypto store neer me" → {"location":"near me","category":"crypto","corrected_query":"crypto store near me","confidence":0.9}

Respond ONLY with JSON, no markdown, no extra text.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 200 }
        })
      }
    );

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);
    return NextResponse.json(parsed);

  } catch (error) {
    return NextResponse.json({
      location: '',
      category: 'any',
      corrected_query: '',
      confidence: 0
    });
  }
}
