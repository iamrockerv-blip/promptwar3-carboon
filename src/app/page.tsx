import type { Metadata } from 'next';
import HomeLanding from './HomeLanding';

export const metadata: Metadata = {
  title: 'Carbon Twin AI™ | Simulate and Purify Your Digital Twin',
  description: 'Simulate sustainable lifestyle habits, monitor your environmental impact in real-time, and purify your digital twin with Aura daily quests.',
};

export default function Page() {
  return <HomeLanding />;
}
