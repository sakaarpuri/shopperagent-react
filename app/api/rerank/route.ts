import { NextResponse } from 'next/server';

type Candidate = {
  id: string;
  text: string;
  ruleScore: number;
};

type Payload = {
  userText: string;
  candidates: Candidate[];
};

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  const length = Math.min(a.length, b.length);
  for (let i = 0; i < length; i += 1) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

function normalizeScores(values: number[]): number[] {
  if (values.length === 0) return values;
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (max === min) return values.map(() => 0.5);
  return values.map(value => (value - min) / (max - min));
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Payload;
    const userText = payload?.userText?.trim();
    const candidates = payload?.candidates || [];

    if (!userText || candidates.length === 0) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const defaultOrder = candidates.map(candidate => candidate.id);
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        orderedIds: defaultOrder,
        usedEmbeddings: false,
        reason: 'OPENAI_API_KEY not set'
      });
    }

    const input = [userText, ...candidates.map(candidate => candidate.text)];
    const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input
      })
    });

    if (!embeddingResponse.ok) {
      return NextResponse.json({
        orderedIds: defaultOrder,
        usedEmbeddings: false,
        reason: 'Embedding API call failed'
      });
    }

    const embeddingJson = (await embeddingResponse.json()) as {
      data?: Array<{ embedding: number[] }>;
    };
    const vectors = (embeddingJson.data || []).map(item => item.embedding);
    if (vectors.length !== candidates.length + 1) {
      return NextResponse.json({
        orderedIds: defaultOrder,
        usedEmbeddings: false,
        reason: 'Unexpected embedding response length'
      });
    }

    const userVector = vectors[0];
    const productVectors = vectors.slice(1);
    const similarities = productVectors.map(vector => (cosineSimilarity(userVector, vector) + 1) / 2);
    const normalizedRuleScores = normalizeScores(candidates.map(candidate => candidate.ruleScore || 0));

    const ranked = candidates.map((candidate, index) => {
      const finalScore = 0.6 * similarities[index] + 0.4 * normalizedRuleScores[index];
      return { id: candidate.id, finalScore };
    });
    ranked.sort((a, b) => b.finalScore - a.finalScore);

    return NextResponse.json({
      orderedIds: ranked.map(item => item.id),
      usedEmbeddings: true
    });
  } catch {
    return NextResponse.json({ error: 'Failed to rerank' }, { status: 500 });
  }
}
