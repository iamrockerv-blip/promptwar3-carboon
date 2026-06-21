// src/components/timeline/TimelineChart.tsx
'use client';
import { useState, useEffect } from 'react';

interface ChartDataEntry {
  yearLabel: string;
  'Baseline Path': number;
  'Simulated Path': number | undefined;
}

interface TimelineChartProps {
  data: ChartDataEntry[];
  isSimulatedActive: boolean;
}

export default function TimelineChart({ data, isSimulatedActive }: TimelineChartProps) {
  const [recharts, setRecharts] = useState<typeof import('recharts') | null>(null);

  useEffect(() => {
    import('recharts').then((mod) => {
      setRecharts(mod);
    });
  }, []);

  if (!recharts) {
    return (
      <output
        className="h-[320px] w-full flex items-center justify-center text-zinc-500 bg-zinc-900/10 rounded-xl border border-zinc-800/10"
        aria-label="Loading decade projection chart"
      >
        Loading chart...
      </output>
    );
  }

  const { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Legend } = recharts;

  return (
    <figure>
      <figcaption className="sr-only">
        Cumulative carbon emissions over ten years for the baseline and simulated paths.
      </figcaption>
      <div aria-hidden="true">
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorSimulated" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="yearLabel" stroke="#888888" tickLine={false} />
            <YAxis stroke="#888888" tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#171717',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: '#ffffff'
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="Baseline Path"
              stroke="#ef4444"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorBaseline)"
            />
            {isSimulatedActive && (
              <Area
                type="monotone"
                dataKey="Simulated Path"
                stroke="#10b981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorSimulated)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <table className="sr-only">
        <caption>Ten-year cumulative carbon projection</caption>
        <thead>
          <tr>
            <th scope="col">Year</th>
            <th scope="col">Baseline path in tonnes</th>
            {isSimulatedActive && <th scope="col">Simulated path in tonnes</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((entry) => (
            <tr key={entry.yearLabel}>
              <th scope="row">{entry.yearLabel}</th>
              <td>{entry['Baseline Path'].toFixed(1)}</td>
              {isSimulatedActive && (
                <td>{entry['Simulated Path']?.toFixed(1) ?? 'Not available'}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
