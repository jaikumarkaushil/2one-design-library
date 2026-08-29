// @expect truncated-axis
// Bar length encodes magnitude, so a baseline at 20 exaggerates every gap.
import { Bar, BarChart, YAxis } from 'recharts'

export function WatchHours({ data }: { data: unknown[] }) {
  return (
    <BarChart data={data}>
      <YAxis domain={[20, 100]} />
      <Bar dataKey="hours" fill="var(--chart-1)" />
    </BarChart>
  )
}
