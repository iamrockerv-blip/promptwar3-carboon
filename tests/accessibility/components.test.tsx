// @vitest-environment jsdom

import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import axe from 'axe-core';
import QuestionCard from '@/components/quiz/QuestionCard';
import ProgressBar from '@/components/quiz/ProgressBar';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';

async function expectNoAccessibilityViolations(container: HTMLElement) {
  const results = await axe.run(container, {
    rules: {
      'color-contrast': { enabled: false }
    }
  });

  expect(results.violations).toEqual([]);
}

describe('component accessibility', () => {
  it('renders the quiz question as a labelled single-choice group', async () => {
    const { container } = render(
      <QuestionCard
        question={{
          id: 'q1',
          text: 'How do you usually commute?',
          category: 'transport',
          options: [
            {
              value: 'bike',
              label: 'Bike or walk',
              description: 'Mostly active travel',
              icon: '🚲'
            },
            {
              value: 'car',
              label: 'Petrol car',
              description: 'Mostly driving alone',
              icon: '🚗'
            }
          ]
        }}
        selectedOptionValue="bike"
        onSelect={vi.fn()}
      />
    );

    await expectNoAccessibilityViolations(container);
  });

  it('renders progress and site navigation without axe violations', async () => {
    const { container } = render(
      <>
        <Header />
        <ProgressBar current={2} total={5} />
        <Footer />
      </>
    );

    await expectNoAccessibilityViolations(container);
  });
});
