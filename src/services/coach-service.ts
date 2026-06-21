import { ChatMessage } from '@/types';

export async function sendCoachMessageApi(
  message: string,
  history: ChatMessage[],
  score?: number,
  aura?: string,
  narrative?: string
): Promise<{ text: string }> {
  const response = await fetch('/api/carbon-coach', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      history,
      score,
      aura,
      narrative
    })
  });

  if (!response.ok) {
    throw new Error('Coach API failed');
  }

  return response.json();
}
