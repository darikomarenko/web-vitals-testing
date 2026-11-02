import { useMemo, useState } from 'react'
import './Lab.css'

export function TtfbLab() {
  const params = useMemo(() => new URLSearchParams(window.location.search), [])
  const currentDelay = Number(params.get('ttfb') ?? 0)
  const [delay, setDelay] = useState(currentDelay || 2000)
  const [apiMs, setApiMs] = useState<number | null>(null)
  const [apiStatus, setApiStatus] = useState('idle')

  function reloadWithDelay() {
    const next = new URL(window.location.href)
    next.searchParams.set('ttfb', String(delay))
    window.location.assign(next.toString())
  }

  function reloadFast() {
    const next = new URL(window.location.href)
    next.searchParams.delete('ttfb')
    window.location.assign(next.toString())
  }

  async function pingApi() {
    setApiStatus('loading')
    const started = performance.now()
    await fetch(`/api/slow?ms=${delay}`)
    setApiMs(performance.now() - started)
    setApiStatus('done')
  }

  return (
    <section className="lab">
      <h2>TTFB — Time to First Byte</h2>
      <p>
        TTFB — время до первого байта HTML. Это сервер + сеть, не React. В этом
        демо Vite middleware специально задерживает <code>index.html</code>, если
        в URL есть <code>?ttfb=2000</code>.
      </p>

      <div className="lab-controls">
        <label className="lab-range">
          HTML delay
          <input
            type="range"
            min={0}
            max={3500}
            step={100}
            value={delay}
            onChange={(event) => setDelay(Number(event.target.value))}
          />
          <span>{delay} ms</span>
        </label>
        <button type="button" onClick={reloadWithDelay}>
          Reload with slow TTFB
        </button>
        <button type="button" onClick={reloadFast}>
          Reload without delay
        </button>
        <button type="button" onClick={pingApi}>
          Slow API only
        </button>
      </div>

      <p className="lab-note">
        Текущий document delay: {currentDelay ? `${currentDelay} ms` : 'off'}.
        API round-trip: {apiStatus === 'loading' ? 'waiting…' : apiMs == null ? '—' : `${Math.round(apiMs)} ms`}.
        Slow API не меняет TTFB документа — только полный reload HTML.
      </p>
    </section>
  )
}
