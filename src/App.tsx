import { useState } from 'react'
import { Hud } from './components/Hud'
import { useWebVitals } from './hooks/useWebVitals'
import { ClsLab } from './labs/ClsLab'
import { InpLab } from './labs/InpLab'
import { TtfbLab } from './labs/TtfbLab'
import './App.css'

type Lab = 'cls' | 'inp' | 'ttfb'

export default function App() {
  const metrics = useWebVitals()
  const [lab, setLab] = useState<Lab>(() =>
    new URLSearchParams(window.location.search).has('ttfb') ? 'ttfb' : 'cls',
  )

  return (
    <main className="app">
      <header className="hero">
        <p className="eyebrow">Core Web Vitals lab</p>
        <h1>Reproduce bad CLS, INP and TTFB</h1>
        <p>
          Репо для того, чтобы провернуть три контролируемых поломки
          метрик с{' '}
          <a href="https://web.dev/vitals/" target="_blank" rel="noreferrer">
            web.dev/vitals
          </a>
          . HUD сверху читает значения через библиотеку <code>web-vitals</code>.
        </p>
      </header>

      <Hud metrics={metrics} />

      <nav className="tabs" aria-label="Labs">
        {(['cls', 'inp', 'ttfb'] as const).map((id) => (
          <button
            key={id}
            type="button"
            className={lab === id ? 'tab-active' : ''}
            onClick={() => setLab(id)}
          >
            {id.toUpperCase()}
          </button>
        ))}
      </nav>

      {lab === 'cls' && <ClsLab />}
      {lab === 'inp' && <InpLab />}
      {lab === 'ttfb' && <TtfbLab />}
    </main>
  )
}
