import { useState } from 'react'
import { blockMainThread } from '../lib/metrics'
import './Lab.css'

type Mode = 'bad' | 'good'

export function InpLab() {
  const [mode, setMode] = useState<Mode>('bad')
  const [clicks, setClicks] = useState(0)
  const [lastHandlerMs, setLastHandlerMs] = useState<number | null>(null)
  const [blockMs, setBlockMs] = useState(600)

  function handleClick() {
    const started = performance.now()
    if (mode === 'bad') {
      blockMainThread(blockMs)
    }
    setClicks((n) => n + 1)
    setLastHandlerMs(performance.now() - started)
  }

  return (
    <section className="lab">
      <h2>INP — Interaction to Next Paint</h2>
      <p>
        INP — задержка от клика/тапа/клавиши до следующего кадра. Если обработчик
        синхронно жжёт CPU, кнопка «залипает», и INP уходит в poor (&gt; 500 ms).
      </p>

      <div className="lab-controls">
        <label>
          <input
            type="radio"
            name="inp-mode"
            checked={mode === 'bad'}
            onChange={() => setMode('bad')}
          />
          Bad: busy-loop в onClick
        </label>
        <label>
          <input
            type="radio"
            name="inp-mode"
            checked={mode === 'good'}
            onChange={() => setMode('good')}
          />
          Good: сразу обновить UI
        </label>
        <label className="lab-range">
          Block
          <input
            type="range"
            min={100}
            max={1200}
            step={50}
            value={blockMs}
            disabled={mode === 'good'}
            onChange={(event) => setBlockMs(Number(event.target.value))}
          />
          <span>{blockMs} ms</span>
        </label>
      </div>

      <button type="button" className="lab-hit" onClick={handleClick}>
        Click me ({clicks})
      </button>
      <p className="lab-note">
        Handler wall time:{' '}
        {lastHandlerMs == null ? '—' : `${Math.round(lastHandlerMs)} ms`}. Кликни
        несколько раз — INP берёт худшее взаимодействие (с нюансами p98).
      </p>
    </section>
  )
}
