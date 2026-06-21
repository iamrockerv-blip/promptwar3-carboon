import type { Metadata } from 'next';
import HomeClient from '../HomeClient';

export const metadata: Metadata = {
  title: 'Carbon Twin AI™ App | Digital Twin Simulator',
  description: 'Simulate sustainable lifestyle habits, monitor your environmental impact in real-time, and purify your digital twin.',
};

export default function Page() {
  return <HomeClient />;
}
