import type { Metric } from 'web-vitals'

export type MetricName = 'CLS' | 'INP' | 'TTFB' | 'LCP' | 'FCP'
export type Rating = 'good' | 'needs-improvement' | 'poor' | 'waiting'

export type MetricSnapshot = {
  name: MetricName
  value: number | null
  rating: Rating
  delta?: number
}

export const THRESHOLDS: Record<
  MetricName,
  { good: number; poor: number; unit: 'ms' | 'score' }
> = {
  CLS: { good: 0.1, poor: 0.25, unit: 'score' },
  INP: { good: 200, poor: 500, unit: 'ms' },
  TTFB: { good: 800, poor: 1800, unit: 'ms' },
  LCP: { good: 2500, poor: 4000, unit: 'ms' },
  FCP: { good: 1800, poor: 3000, unit: 'ms' },
}

export function rate(name: MetricName, value: number): Rating {
  const { good, poor } = THRESHOLDS[name]
  if (value <= good) return 'good'
  if (value <= poor) return 'needs-improvement'
  return 'poor'
}

export function formatMetric(name: MetricName, value: number | null): string {
  if (value == null) return '—'
  if (name === 'CLS') return value.toFixed(3)
  return `${Math.round(value)} ms`
}

export function fromWebVital(metric: Metric): MetricSnapshot {
  const name = metric.name as MetricName
  return {
    name,
    value: metric.value,
    rating: rate(name, metric.value),
    delta: metric.delta,
  }
}

export function blockMainThread(ms: number) {
  const end = performance.now() + ms
  let acc = 0
  while (performance.now() < end) {
    acc += Math.sqrt(acc + Math.random())
  }
  return acc
}
