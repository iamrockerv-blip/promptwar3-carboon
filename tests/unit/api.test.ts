import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST as generateTwinPost } from '@/app/api/generate-twin/route';
import { POST as carbonCoachPost } from '@/app/api/carbon-coach/route';
import { generateTwinNarrative, generateCoachResponse } from '@/lib/gemini';

// Mock the Gemini API functions
vi.mock('@/lib/gemini', () => ({
  generateTwinNarrative: vi.fn(),
  generateCoachResponse: vi.fn()
}));

describe('API Route Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const getUniqueIp = () => {
    // Generate a unique IP address to isolate rate limit maps across tests
    return `192.168.10.${Math.floor(Math.random() * 254) + 1}`;
  };

  describe('POST /api/generate-twin', () => {
    const validBody = {
      score: 11.8,
      aura: 'amber',
      breakdown: {
        transport: 4.6,
        diet: 2.5,
        energy: 2.5,
        travel: 1.0,
        consumption: 1.2
      },
      answers: [
        { questionId: 'q1', category: 'transport', value: 'car_petrol' },
        { questionId: 'q2', category: 'diet', value: 'meat_regular' },
        { questionId: 'q3', category: 'energy', value: 'grid_gas' },
        { questionId: 'q4', category: 'travel', value: 'flights_1_2' },
        { questionId: 'q5', category: 'consumption', value: 'average' }
      ]
    };

    it('should return 200 with twin narrative and correct rate-limiting headers', async () => {
      const mockNarrative = {
        auraExplanation: 'Aura explanation',
        lifeReplay: { narrative: 'Life narrative', chapters: [] },
        recommendations: []
      };
      vi.mocked(generateTwinNarrative).mockResolvedValue(mockNarrative);

      const req = new Request('http://localhost:3000/api/generate-twin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': getUniqueIp()
        },
        body: JSON.stringify(validBody)
      });

      const res = await generateTwinPost(req);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data).toEqual(mockNarrative);

      // Verify rate-limiting headers are present
      expect(res.headers.get('X-RateLimit-Limit')).toBe('10');
      expect(res.headers.get('X-RateLimit-Remaining')).toBe('9');
    });

    it('should return 400 for validation schema errors (missing fields)', async () => {
      const req = new Request('http://localhost:3000/api/generate-twin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': getUniqueIp()
        },
        body: JSON.stringify({}) // Empty body
      });

      const res = await generateTwinPost(req);
      expect(res.status).toBe(400);

      const data = await res.json();
      expect(data.error).toBeDefined();
    });

    it('should return 429 when rate limit of 10 requests is exceeded', async () => {
      const mockNarrative = {
        auraExplanation: 'Aura explanation',
        lifeReplay: { narrative: 'Life narrative', chapters: [] },
        recommendations: []
      };
      vi.mocked(generateTwinNarrative).mockResolvedValue(mockNarrative);

      const clientIp = getUniqueIp();

      // Make 10 successful requests
      for (let i = 0; i < 10; i++) {
        const req = new Request('http://localhost:3000/api/generate-twin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-forwarded-for': clientIp
          },
          body: JSON.stringify(validBody)
        });
        const res = await generateTwinPost(req);
        expect(res.status).toBe(200);
      }

      // The 11th request should be rate-limited (429)
      const blockedReq = new Request('http://localhost:3000/api/generate-twin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': clientIp
        },
        body: JSON.stringify(validBody)
      });
      const blockedRes = await generateTwinPost(blockedReq);
      expect(blockedRes.status).toBe(429);

      const errorData = await blockedRes.json();
      expect(errorData.error).toContain('Too many requests');
    });

    it('should return 500 when the Gemini AI helper fails', async () => {
      vi.mocked(generateTwinNarrative).mockRejectedValue(new Error('AI generation failed'));

      const req = new Request('http://localhost:3000/api/generate-twin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': getUniqueIp()
        },
        body: JSON.stringify(validBody)
      });

      const res = await generateTwinPost(req);
      expect(res.status).toBe(500);

      const data = await res.json();
      expect(data.error).toBe('AI generation failed');
    });
  });

  describe('POST /api/carbon-coach', () => {
    const validBody = {
      message: 'What is my carbon aura?',
      history: [
        { id: '1', sender: 'user' as const, text: 'Hello', timestamp: new Date().toISOString() }
      ],
      score: 11.8,
      aura: 'amber' as const,
      narrative: 'Aura narrative'
    };

    it('should return 200 with the coach message', async () => {
      vi.mocked(generateCoachResponse).mockResolvedValue('Mocked coach advice');

      const req = new Request('http://localhost:3000/api/carbon-coach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': getUniqueIp()
        },
        body: JSON.stringify(validBody)
      });

      const res = await carbonCoachPost(req);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.text).toBe('Mocked coach advice');
      expect(res.headers.get('X-RateLimit-Limit')).toBe('30');
    });

    it('should return 400 for validation errors (missing chat message)', async () => {
      const req = new Request('http://localhost:3000/api/carbon-coach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': getUniqueIp()
        },
        body: JSON.stringify({
          history: [] // Missing message parameter
        })
      });

      const res = await carbonCoachPost(req);
      expect(res.status).toBe(400);

      const data = await res.json();
      expect(data.error).toBeDefined();
    });

    it('should return 429 when rate limit of 30 requests is exceeded', async () => {
      vi.mocked(generateCoachResponse).mockResolvedValue('Mocked coach advice');
      const clientIp = getUniqueIp();

      // Make 30 successful requests
      for (let i = 0; i < 30; i++) {
        const req = new Request('http://localhost:3000/api/carbon-coach', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-forwarded-for': clientIp
          },
          body: JSON.stringify(validBody)
        });
        const res = await carbonCoachPost(req);
        expect(res.status).toBe(200);
      }

      // The 31st request should be rate-limited (429)
      const blockedReq = new Request('http://localhost:3000/api/carbon-coach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': clientIp
        },
        body: JSON.stringify(validBody)
      });
      const blockedRes = await carbonCoachPost(blockedReq);
      expect(blockedRes.status).toBe(429);

      const errorData = await blockedRes.json();
      expect(errorData.error).toContain('Too many requests');
    });

    it('should return 500 when coach AI helper fails', async () => {
      vi.mocked(generateCoachResponse).mockRejectedValue(new Error('AI response failed'));

      const req = new Request('http://localhost:3000/api/carbon-coach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': getUniqueIp()
        },
        body: JSON.stringify(validBody)
      });

      const res = await carbonCoachPost(req);
      expect(res.status).toBe(500);

      const data = await res.json();
      expect(data.error).toBe('AI response failed');
    });
  });
});
