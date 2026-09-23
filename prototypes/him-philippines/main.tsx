import { useLayoutEffect, useRef, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { createRoot, type Root } from 'react-dom/client'
import { Footer } from '../../src/shared/components/Footer'
import { Navbar } from '../../src/shared/components/Navbar'
import { fontFamily } from '../../src/shared/styles/tokens'
import Flow from './variants/Flow'
import Portraits from './variants/Portraits'
import Directory from './variants/Directory'
import '../../src/index.css'
import './styles.css'

const variants = [
  { name: 'Flow', Component: Flow },
  { name: 'Portraits', Component: Portraits },
  { name: 'Directory', Component: Directory },
] as const

function Picker({ value, onChange, onReplay }: { value: number; onChange: (next: number) => void; onReplay: () => void }) {
  const nav = useRef<HTMLElement>(null)
  const highlight = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const active = nav.current?.querySelector<HTMLButtonElement>('[data-active]')
    if (!active || !highlight.current) return
    highlight.current.style.width = `${active.offsetWidth}px`
    highlight.current.style.transform = `translateX(${active.offsetLeft}px)`
  }, [value])

  useLayoutEffect(() => {
    const picker = nav.current
    const id = requestAnimationFrame(() => requestAnimationFrame(() => picker?.setAttribute('data-ready', '')))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <nav className="proto-picker" aria-label="Prototype variants" ref={nav}>
      <span className="proto-picker-highlight" aria-hidden="true" ref={highlight} />
      {variants.map((variant, i) => (
        <button className="proto-picker-item" key={variant.name} data-active={value === i || undefined} aria-current={value === i ? 'true' : undefined} onClick={() => onChange(i)}>{variant.name}</button>
      ))}
      <span className="proto-picker-divider" aria-hidden="true" />
      <button className="proto-picker-item proto-picker-replay" aria-label="Replay animation (R)" onClick={onReplay}>↻</button>
    </nav>
  )
}

function App() {
  const initial = Math.max(0, Math.min(variants.length - 1, (Number(new URLSearchParams(location.search).get('v')) || 1) - 1))
  const [selected, setSelected] = useState(initial)
  const [replay, setReplay] = useState(0)
  const Current = variants[selected].Component

  const choose = (index: number) => {
    if (index < 0 || index >= variants.length) return
    setSelected(index)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    const url = new URL(location.href)
    url.searchParams.set('v', String(index + 1))
    history.replaceState(null, '', url)
  }

  useLayoutEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if ((target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) || target?.isContentEditable) return
      if (event.metaKey || event.ctrlKey || event.altKey) return
      const key = Number(event.key)
      if (key >= 1 && key <= variants.length) choose(key - 1)
      else if (event.key === 'ArrowRight') choose((selected + 1) % variants.length)
      else if (event.key === 'ArrowLeft') choose((selected - 1 + variants.length) % variants.length)
      else if (event.key.toLowerCase() === 'r') setReplay((count) => count + 1)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [selected])

  return (
    <BrowserRouter>
      <div className="design-preview-shell selection:bg-black selection:text-white" style={{ fontFamily, lineHeight: 1.6, letterSpacing: '-0.015em' }}>
        <a href="#prototype-stage" className="skip-link">Skip to content</a>
        <Navbar />
        <main id="prototype-stage" key={`${selected}-${replay}`} className={`prototype-page direction-${selected + 1}`}>
          <Current />
        </main>
        <Footer />
        <Picker value={selected} onChange={choose} onReplay={() => setReplay((count) => count + 1)} />
      </div>
    </BrowserRouter>
  )
}

declare global {
  interface Window { __himDesignPrototypeRoot?: Root }
}

const root = window.__himDesignPrototypeRoot ?? createRoot(document.getElementById('root')!)
window.__himDesignPrototypeRoot = root
root.render(<App />)
