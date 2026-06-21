import { beforeEach, describe, expect, it, vi } from 'vitest';
import { sendCoachMessageApi } from '@/services/coach-service';
import { generateTwinApi } from '@/services/twin-service';

describe('API service clients', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('posts the carbon twin payload and returns parsed data', async () => {
    const payload = {
      auraExplanation: 'Explanation',
      lifeReplay: { narrative: 'Narrative', chapters: [] },
      recommendations: []
    };
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(payload), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    );

    await expect(
      generateTwinApi(
        7.3,
        'sapphire',
        { transport: 1, diet: 1, energy: 2, travel: 2, consumption: 1.3 },
        []
      )
    ).resolves.toEqual(payload);

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/generate-twin',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
    );
  });

  it('posts coach context and rejects non-success responses', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ text: 'Try public transit.' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ error: 'Unavailable' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        })
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ error: 'Unavailable' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        })
      );

    await expect(sendCoachMessageApi('Help', [], 7.3, 'sapphire', 'Story')).resolves.toEqual({
      text: 'Try public transit.'
    });
    await expect(sendCoachMessageApi('Help', [])).rejects.toThrow('Coach API failed');
    await expect(
      generateTwinApi(
        7.3,
        'sapphire',
        { transport: 1, diet: 1, energy: 2, travel: 2, consumption: 1.3 },
        []
      )
    ).rejects.toThrow('API Request failed');
  });
});
