// src/app/about/page.tsx
import type { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'About Carbon Twin AI™ | Our Digital Twin Concept & Mission',
  description: 'Understand the concept of digital twins, our core sustainability principles, and the mission driving our deterministic carbon modeling.',
};

export default function Page() {
  return <AboutClient />;
}
