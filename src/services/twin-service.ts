import { QuizAnswer, CarbonBreakdown, CarbonLifeReplay, Recommendation } from '@/types';

export async function generateTwinApi(
  score: number,
  aura: string,
  breakdown: CarbonBreakdown,
  answers: QuizAnswer[]
): Promise<{ auraExplanation: string; lifeReplay: CarbonLifeReplay; recommendations: Recommendation[] }> {
  const response = await fetch('/api/generate-twin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ score, aura, breakdown, answers })
  });

  if (!response.ok) {
    throw new Error('API Request failed');
  }

  return response.json();
}
