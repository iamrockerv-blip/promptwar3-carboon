// @vitest-environment jsdom

import { render, screen, waitFor } from '@testing-library/react';
import axe from 'axe-core';
import { describe, expect, it, vi } from 'vitest';
import BreakdownChart from '@/components/twin/BreakdownChart';
import TimelineChart from '@/components/timeline/TimelineChart';

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  BarChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AreaChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Bar: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Area: () => null,
  XAxis: () => null,
  YAxis: () => null,
  Tooltip: () => null,
  Legend: () => null,
  Cell: () => null
}));

async function expectNoAccessibilityViolations(container: HTMLElement) {
  const results = await axe.run(container, {
    rules: {
      'color-contrast': { enabled: false }
    }
  });
  expect(results.violations).toEqual([]);
}

describe('accessible chart alternatives', () => {
  it('exposes carbon breakdown values through a semantic table', async () => {
    const { container } = render(
      <BreakdownChart
        data={[
          { name: 'Transport', value: 4.6, color: '#3B82F6', icon: '🚗' },
          { name: 'Diet', value: 2.5, color: '#10B981', icon: '🥗' }
        ]}
      />
    );

    await waitFor(() => expect(screen.getByRole('table')).toBeInTheDocument());
    expect(screen.getByRole('rowheader', { name: 'Transport' })).toBeInTheDocument();
    await expectNoAccessibilityViolations(container);
  });

  it('exposes baseline and simulated projections through a semantic table', async () => {
    const { container } = render(
      <TimelineChart
        isSimulatedActive
        data={[
          {
            yearLabel: 'Year 1',
            'Baseline Path': 7.2,
            'Simulated Path': 5.8
          }
        ]}
      />
    );

    await waitFor(() => expect(screen.getByRole('table')).toBeInTheDocument());
    expect(screen.getByRole('columnheader', { name: /simulated path/i })).toBeInTheDocument();
    await expectNoAccessibilityViolations(container);
  });
});
