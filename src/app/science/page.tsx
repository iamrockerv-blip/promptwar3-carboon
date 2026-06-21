// src/app/science/page.tsx
import type { Metadata } from 'next';
import ScienceClient from './ScienceClient';

export const metadata: Metadata = {
  title: 'Environmental Science & Math | Carbon Twin AI™',
  description: 'Understand the reproducible carbon twin calculation formulas, emission coefficients, and scientific datasets powering our digital twin models.',
};

export default function Page() {
  return <ScienceClient />;
}
