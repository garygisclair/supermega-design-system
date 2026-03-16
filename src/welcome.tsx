import { useState } from 'react'
import './welcome.css'
import { Icon } from './components/Icon/Icon'
import { IconButton } from './components/IconButton/IconButton'
import { CtaButton } from './components/Button/CtaButton'
import { ProgressStepper } from './components/ProgressStepper/ProgressStepper'
import { Dialog } from './components/Dialog/Dialog'
import heroBg from './hero-bg.png'
import heroVideo from './hero-bg.mp4'
import thumbsUp from './thumbs-up.png'

const STEPS = [
  {
    state: 'complete' as const,
    title: 'Extract design tokens',
    subtitle: 'Connected Figma via MCP and pulled all color, typography, spacing, and state tokens into tokens.css.',
  },
  {
    state: 'complete' as const,
    title: 'Implement components',
    subtitle: 'Used get_design_context to translate each Figma component directly into TSX + CSS — no scripts, no intermediate specs.',
  },
  {
    state: 'complete' as const,
    title: 'Build the UI Library',
    subtitle: 'Assembled a preview shell with sidebar navigation so every component can be browsed and inspected in one place.',
  },
  {
    state: 'complete' as const,
    title: 'Add the Playground',
    subtitle: 'Created a Portal-scaffolded sandbox where anyone can prototype new experiences using the component library.',
  },
  {
    state: 'latest' as const,
    title: 'Ship and iterate',
    subtitle: 'Hosted on GitHub. Teams can clone, branch, and build — using their AI assistant with the included sample prompt.',
  },
]

interface WelcomeProps {
  onLibrary:    () => void
  onPlayground: () => void
}

export function Welcome({ onLibrary, onPlayground }: WelcomeProps) {
  const [showSummary, setShowSummary] = useState(false)

  return (
    <div className="wl-page">

      {/* ── Hero ──────────────────────────────────────────── */}
      <div className="wl-hero">
        <div className="wl-hero__bg" style={{ backgroundImage: `url(${heroBg})` }}>
          <video
            className="wl-hero__video"
            autoPlay
            loop
            muted
            playsInline
            poster={heroBg}
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
        </div>
        <div className="wl-hero__content">
          <p className="wl-hero__eyebrow">DESIGN SYSTEM</p>
          <h1 className="wl-hero__title">Supermega</h1>
          <p className="wl-hero__subtitle">
            A Figma-to-React pipeline that uses Claude Code and the Figma MCP to turn
            design components into production-ready TSX and CSS.
          </p>
          <div className="wl-hero__cta">
            <CtaButton
              variant="primary"
              size="large"
              label="Explore the library"
              trailingIcon={<Icon name="arrow-right" size={20} />}
              onClick={onLibrary}
            />
          </div>
        </div>
      </div>

      {/* ── Cards ─────────────────────────────────────────── */}
      <div className="wl-section wl-section--cards">
        <div className="wl-cards">

          <div className="wl-card" onClick={onLibrary}>
            <IconButton
              icon={<Icon name="book" size={20} />}
              aria-label="UI Library"
              style="tertiary"
              size="medium"
              onClick={onLibrary}
            />
            <div className="wl-card__body">
              <h2 className="itss-title-3 wl-card__title">UI Library</h2>
              <p className="itss-body wl-card__desc">
                Browse all components, tokens, and design patterns.
              </p>
            </div>
            <div className="wl-card__footer">
              <CtaButton
                variant="secondary"
                size="small"
                label="Open library"
                trailingIcon={<Icon name="arrow-right" size={16} />}
                onClick={onLibrary}
              />
            </div>
          </div>

          <div className="wl-card" onClick={onPlayground}>
            <IconButton
              icon={<Icon name="code" size={20} />}
              aria-label="Playground"
              style="tertiary"
              size="medium"
              onClick={onPlayground}
            />
            <div className="wl-card__body">
              <h2 className="itss-title-3 wl-card__title">Playground</h2>
              <p className="itss-body wl-card__desc">
                Build and prototype using Supermega components.
              </p>
            </div>
            <div className="wl-card__footer">
              <CtaButton
                variant="secondary"
                size="small"
                label="Open playground"
                trailingIcon={<Icon name="arrow-right" size={16} />}
                onClick={onPlayground}
              />
            </div>
          </div>

        </div>
      </div>

      {/* ── The goal ──────────────────────────────────────── */}
      <div className="wl-section">
        <div className="wl-prose">
          <h2 className="itss-title-2 wl-prose__heading">The goal</h2>
          <p className="itss-body wl-prose__body">
            The Supermega design system lives in Figma. Getting it into React historically meant
            exporting assets, writing specs, and hand-coding components one by one. This project
            collapses that entire pipeline into a single workflow: point Claude Code at a Figma node,
            and get a fully-styled, token-compliant React component back — ready to use.
          </p>
          <p className="itss-body wl-prose__body">
            The result is a living component library that stays in sync with Figma by design,
            plus a Playground where anyone on the team can prototype new experiences
            using those same components.
          </p>
        </div>
      </div>

      {/* ── What's inside ─────────────────────────────────── */}
      <div className="wl-section wl-section--alt">
        <div className="wl-prose">
          <h2 className="itss-title-2 wl-prose__heading">What's inside</h2>
          <div className="wl-stats">
            <div className="wl-stat">
              <p className="itss-title-1 wl-stat__number">70+</p>
              <p className="itss-body wl-stat__label">Components</p>
            </div>
            <div className="wl-stat">
              <p className="itss-title-1 wl-stat__number">200+</p>
              <p className="itss-body wl-stat__label">Design tokens</p>
            </div>
            <div className="wl-stat">
              <p className="itss-title-1 wl-stat__number">0</p>
              <p className="itss-body wl-stat__label">Magic numbers</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── How we built it ───────────────────────────────── */}
      <div className="wl-section">
        <div className="wl-prose">
          <div className="wl-prose__title-row">
            <h2 className="itss-title-2 wl-prose__heading">How we built it</h2>
            <CtaButton variant="tertiary" size="small" label="Summarize" onClick={() => setShowSummary(true)} />
          </div>
          <ProgressStepper steps={STEPS} vertical />
        </div>
      </div>

      {/* ── Stack ─────────────────────────────────────────── */}
      <div className="wl-section wl-section--alt">
        <div className="wl-prose">
          <h2 className="itss-title-2 wl-prose__heading">Stack</h2>
          <div className="wl-stack-grid">
            <div className="wl-stack-item">
              <p className="itss-body-bold wl-stack-item__title">Vite + React + TypeScript</p>
              <p className="itss-caption wl-stack-item__desc">Fast dev server, type-safe components, zero config</p>
            </div>
            <div className="wl-stack-item">
              <p className="itss-body-bold wl-stack-item__title">Plain CSS + Design Tokens</p>
              <p className="itss-caption wl-stack-item__desc">No Tailwind, no CSS-in-JS — just custom properties</p>
            </div>
            <div className="wl-stack-item">
              <p className="itss-body-bold wl-stack-item__title">Figma MCP</p>
              <p className="itss-caption wl-stack-item__desc">get_design_context replaces the entire extract-spec-generate pipeline</p>
            </div>
            <div className="wl-stack-item">
              <p className="itss-body-bold wl-stack-item__title">Claude Code</p>
              <p className="itss-caption wl-stack-item__desc">AI-powered pipeline — no scripts, no intermediate specs</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Summary modal ─────────────────────────────────── */}
      {showSummary && (
        <div className="wl-scrim" onClick={() => setShowSummary(false)}>
          <div onClick={e => e.stopPropagation()}>
            <Dialog
              size="small"
              title=" "
              showCancel={false}
              submitLabel="Nice"
              onClose={() => setShowSummary(false)}
              onSubmit={() => setShowSummary(false)}
            >
              <div className="wl-summary-body">
                <p className="wl-retro-title">It's Awesome!</p>
                <div className="wl-thumb-circle">
                  <img src={thumbsUp} alt="Thumbs up" className="wl-thumb-img" />
                </div>
                <p className="itss-body">
                  A fully token-compliant Supermega component library, built directly from Figma
                  using Claude Code and the Figma MCP. Zero magic numbers. Zero scripts.
                  Just great components, ready to use.
                </p>
              </div>
            </Dialog>
          </div>
        </div>
      )}

    </div>
  )
}
