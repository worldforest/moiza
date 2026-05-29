export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { addresses } = req.body || {};
  if (!addresses?.length) return res.status(400).json({ error: 'No addresses' });

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not set' });
  }

  const prompt = `다음 멤버들의 집 주소:\n${addresses.map(a => `- ${a.name}: ${a.address}`).join('\n')}\n\n만나기 좋은 중간 지점을 추천해주세요. 반드시 JSON만 응답(다른 텍스트 없이): {"area":"지역명","reason":"이유(2문장 이내)","suggestions":["구체적장소1","구체적장소2","구체적장소3"]}`;

  let geminiData;
  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );
    geminiData = await geminiRes.json();
  } catch (e) {
    return res.status(500).json({ error: 'Gemini fetch failed', detail: e.message });
  }

  if (geminiData.error) {
    return res.status(500).json({ error: 'Gemini API error', detail: geminiData.error });
  }

  const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
  if (!text) {
    return res.status(500).json({ error: 'Empty Gemini response', raw: geminiData });
  }

  try {
    const cleaned = text.replace(/```json|```/g, '').trim();
    const result = JSON.parse(cleaned);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: 'JSON parse failed', raw: text });
  }
}
