import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import './Lab.css'

type Mode = 'bad' | 'good'

export function ClsLab() {
  const [mode, setMode] = useState<Mode>('bad')
  const [showBanner, setShowBanner] = useState(false)
  const [showImage, setShowImage] = useState(false)
  const [runId, setRunId] = useState(0)
  const [portalNode, setPortalNode] = useState<HTMLElement | null>(null)

  useEffect(() => {
    const node = document.createElement('div')
    node.id = 'cls-shift-root'
    document.body.prepend(node)
    setPortalNode(node)
    return () => {
      node.remove()
    }
  }, [])

  useEffect(() => {
    if (runId === 0) return
    setShowBanner(false)
    setShowImage(false)
    const bannerTimer = window.setTimeout(() => setShowBanner(true), 1400)
    const imageTimer = window.setTimeout(() => setShowImage(true), 2000)
    return () => {
      window.clearTimeout(bannerTimer)
      window.clearTimeout(imageTimer)
    }
  }, [runId, mode])

  const pageBanner =
    mode === 'bad' &&
    showBanner &&
    portalNode &&
    createPortal(<aside className="cls-page-banner">Late-loading full-width promo</aside>, portalNode)

  return (
    <section className="lab">
      {pageBanner}
      <h2>CLS — Cumulative Layout Shift</h2>
      <p>
        CLS считает, насколько контент прыгает после отрисовки. Классика: баннер,
        картинка без размеров, cookie-bar — всё, что вставляется сверху без
        зарезервированного места.
      </p>

      <div className="lab-controls">
        <label>
          <input
            type="radio"
            name="cls-mode"
            checked={mode === 'bad'}
            onChange={() => setMode('bad')}
          />
          Bad: баннер в начало страницы, картинка без слота
        </label>
        <label>
          <input
            type="radio"
            name="cls-mode"
            checked={mode === 'good'}
            onChange={() => setMode('good')}
          />
          Good: reserved space / aspect-ratio
        </label>
        <button type="button" onClick={() => setRunId((id) => id + 1)}>
          {runId === 0 ? 'Start late injection' : 'Replay shift'}
        </button>
      </div>

      <div className="cls-stage">
        {mode === 'good' && (
          <div className="cls-slot" aria-hidden={!showBanner}>
            {showBanner ? (
              <aside className="cls-banner">Reserved promo slot</aside>
            ) : (
              <span className="cls-placeholder">ad slot reserved 280×88</span>
            )}
          </div>
        )}

        <article className="cls-article">
          <h3>Article headline that should stay put</h3>
          <p>
            Нажми Start и подожди ~1.5 с. В bad-режиме сверху страницы въезжает
            высокий баннер — весь layout уезжает вниз, CLS должен выйти за 0.1.
          </p>
          {mode === 'good' ? (
            <div className="cls-media">{showImage ? <Hero /> : null}</div>
          ) : (
            showImage && <Hero />
          )}
          <div className="cls-filler" aria-hidden="true" />
        </article>
      </div>
    </section>
  )
}

function Hero() {
  return <div className="cls-hero">Hero image (loaded late)</div>
}
