import { useEffect, useState } from 'react'
import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals'
import {
  fromWebVital,
  type MetricName,
  type MetricSnapshot,
} from '../lib/metrics'

const EMPTY: Record<MetricName, MetricSnapshot> = {
  CLS: { name: 'CLS', value: null, rating: 'waiting' },
  INP: { name: 'INP', value: null, rating: 'waiting' },
  TTFB: { name: 'TTFB', value: null, rating: 'waiting' },
  LCP: { name: 'LCP', value: null, rating: 'waiting' },
  FCP: { name: 'FCP', value: null, rating: 'waiting' },
}

export function useWebVitals() {
  const [metrics, setMetrics] = useState(EMPTY)

  useEffect(() => {
    const report = (snapshot: MetricSnapshot) => {
      setMetrics((prev) => ({ ...prev, [snapshot.name]: snapshot }))
    }

    onCLS((metric) => report(fromWebVital(metric)), { reportAllChanges: true })
    onINP((metric) => report(fromWebVital(metric)), { reportAllChanges: true })
    onTTFB((metric) => report(fromWebVital(metric)))
    onLCP((metric) => report(fromWebVital(metric)), { reportAllChanges: true })
    onFCP((metric) => report(fromWebVital(metric)))
  }, [])

  return metrics
}
