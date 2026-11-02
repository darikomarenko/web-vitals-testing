import { formatMetric, THRESHOLDS, type MetricSnapshot } from '../lib/metrics'
import './Hud.css'

const PRIMARY: Array<MetricSnapshot['name']> = ['CLS', 'INP', 'TTFB']
const SECONDARY: Array<MetricSnapshot['name']> = ['LCP', 'FCP']

function Card({ metric }: { metric: MetricSnapshot }) {
  const threshold = THRESHOLDS[metric.name]
  return (
    <article className={`hud-card rating-${metric.rating}`}>
      <header>
        <span className="hud-name">{metric.name}</span>
        <span className={`hud-pill rating-${metric.rating}`}>
          {metric.rating === 'waiting'
            ? 'waiting'
            : metric.rating === 'needs-improvement'
              ? 'needs work'
              : metric.rating}
        </span>
      </header>
      <p className="hud-value">{formatMetric(metric.name, metric.value)}</p>
      <p className="hud-hint">
        good ≤ {threshold.unit === 'score' ? threshold.good : `${threshold.good} ms`}
        {' · '}
        poor &gt; {threshold.unit === 'score' ? threshold.poor : `${threshold.poor} ms`}
      </p>
    </article>
  )
}

type Props = {
  metrics: Record<MetricSnapshot['name'], MetricSnapshot>
}

export function Hud({ metrics }: Props) {
  return (
    <section className="hud" aria-label="Live Web Vitals">
      <div className="hud-primary">
        {PRIMARY.map((name) => (
          <Card key={name} metric={metrics[name]} />
        ))}
      </div>
      <div className="hud-secondary">
        {SECONDARY.map((name) => (
          <Card key={name} metric={metrics[name]} />
        ))}
      </div>
    </section>
  )
}
