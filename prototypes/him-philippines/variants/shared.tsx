import type { ReactNode } from 'react'
import {
  apostolicCouncil,
  himApplicationForm,
  himBoardMembers,
  himCoreValues,
  himCoreValuesIntroduction,
  himDpoBadge,
  himHeroImage,
  himIntroduction,
  himLogo,
  himMembershipStatement,
  himMission,
  himSecretary,
  himVision,
  statementOfFaith,
  statementOfFaithIntroduction,
} from '../../../src/features/about/data/himPhilippinesData'

export {
  apostolicCouncil,
  himApplicationForm,
  himBoardMembers,
  himCoreValues,
  himCoreValuesIntroduction,
  himDpoBadge,
  himHeroImage,
  himIntroduction,
  himLogo,
  himMembershipStatement,
  himMission,
  himSecretary,
  himVision,
  statementOfFaith,
  statementOfFaithIntroduction,
}

export function BrandLockup() {
  return <img className="him-lockup" src={himLogo} alt="Harvest International Ministry Philippines" />
}

export function PhotoHero({ layout = 'flow' }: { layout?: 'flow' | 'portraits' | 'directory' }) {
  return (
    <section className={`rog-photo-hero hero-${layout}`} data-plate="dark" aria-labelledby="him-philippines-title">
      <img className="hero-media" src={himHeroImage} alt="" fetchPriority="high" />
      <div className="hero-scrim" aria-hidden="true" />
      <div className="hero-content">
        <BrandLockup />
        <span className="hero-rule" aria-hidden="true" />
        {layout !== 'flow' && <p className="eyebrow">Harvest International Ministry · Philippines</p>}
        <h1 id="him-philippines-title">H.I.M. Philippines</h1>
        <p className="hero-intro">{himIntroduction}</p>
        <a className="hero-action" href="#mission-and-vision">Explore our mission <span aria-hidden="true">↓</span></a>
      </div>
    </section>
  )
}

export function Profiles({ leaders, layout = 'cards' }: { leaders: readonly { name: string; portrait: string; roles: readonly string[] }[]; layout?: 'cards' | 'portrait' | 'directory' }) {
  return <div className={`profiles profiles-${layout}`}>{leaders.map((leader) => (
    <article className="profile" key={`${leader.name}-${leader.portrait}`}>
      <img src={leader.portrait} alt={`Portrait of ${leader.name}`} loading="lazy" decoding="async" />
      <div className="profile-copy">
        <h3>{leader.name}</h3>
        <ul>{leader.roles.map((role) => <li key={role}>{role}</li>)}</ul>
      </div>
    </article>
  ))}</div>
}

export function SectionTitle({ eyebrow, title, intro }: { eyebrow?: string; title: string; intro?: string }) {
  return <div className="section-title">{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h2>{title}</h2>{intro && <p className="section-intro">{intro}</p>}</div>
}

export function MissionCopy({ layout = 'balanced' }: { layout?: 'balanced' | 'spotlight' }) {
  return <section id="mission-and-vision" data-plate="dark" className={`mission-band mission-${layout}`} aria-label="Our mission and vision">
    <article className="mission-block"><MissionIcon /><div><p className="eyebrow">Our mission</p><p className="mission-copy">{himMission}</p></div></article>
    <article className="vision-block"><VisionIcon /><div><p className="eyebrow">Our vision</p><p className="vision-copy">{himVision}</p></div></article>
  </section>
}

export function PortraitSections({ councilLayout = 'cards', boardLayout = 'cards' }: { councilLayout?: 'cards' | 'portrait' | 'directory'; boardLayout?: 'cards' | 'portrait' | 'directory' }) {
  return <>
    <section id="apostolic-council" data-plate="light" className="leaders-section council-section"><div className="section-wrap"><SectionTitle eyebrow="Apostolic and Leadership Team" title="Apostolic Council" /><Profiles leaders={apostolicCouncil} layout={councilLayout} /></div></section>
    <section id="board-members" data-plate="dark" className="leaders-section board-section"><div className="section-wrap"><SectionTitle eyebrow="H.I.M. Philippines" title="Board Members" /><Profiles leaders={himBoardMembers} layout={boardLayout} /></div></section>
    <section id="secretary-and-staff" data-plate="light" className="leaders-section secretary-section"><div className="section-wrap secretary-wrap"><SectionTitle eyebrow="H.I.M. Philippines" title="Secretary and Staff" /><Profiles leaders={[himSecretary]} layout={councilLayout} /></div></section>
  </>
}

export function ValuesSection({ layout = 'grid' }: { layout?: 'grid' | 'list' }) {
  return <section id="core-values" data-plate="light" className={`values-section values-${layout}`}><div className="section-wrap"><SectionTitle eyebrow="What guides us" title="Our Core Values" intro={himCoreValuesIntroduction} /><ValueDetails numbered={layout === 'list'} /></div></section>
}

export function FaithDetails() {
  return <div className="faith-list">{statementOfFaith.map((statement, i) => <details className="faith-item" key={statement.text}>
    <summary><span className="item-number">{String(i + 1).padStart(2, '0')}</span><span>{statement.summary}</span><span className="plus" aria-hidden="true">+</span></summary>
    <div className="faith-copy"><p>{statement.text}</p></div>
  </details>)}</div>
}

export function FaithSection({ visibleAll = false }: { visibleAll?: boolean }) {
  return <section id="statement-of-faith" data-plate="dark" className={`faith-section${visibleAll ? ' faith-visible' : ''}`}><div className="section-wrap"><SectionTitle eyebrow="What we believe" title="Statement of Faith" intro={statementOfFaithIntroduction} />{visibleAll
    ? <ol className="faith-visible-list">{statementOfFaith.map((statement, i) => <li key={statement.text}><span className="item-number">{String(i + 1).padStart(2, '0')}</span><p>{statement.text}</p></li>)}</ol>
    : <FaithDetails />}</div></section>
}

export function Signup({ layout = 'split' }: { layout?: 'split' | 'centered' }) {
  return <section id="join-him-philippines" data-plate="light" className={`signup signup-${layout}`} aria-labelledby="join-him-title">
    <div className="signup-copy"><p className="eyebrow">An invitation to partner</p><h2 id="join-him-title">Sign up to join H.I.M. Philippines</h2>
      <p>{himMembershipStatement}</p><p className="signup-contact">For questions, please contact <a href="mailto:pastorgreeko@gmail.com">pastorgreeko@gmail.com</a>.</p>
      <a className="application-link" href={himApplicationForm} download>Download application form <span>PDF&nbsp; ↗</span></a>
    </div>
    <figure className="privacy-badge"><img src={himDpoBadge} alt="National Privacy Commission DPO/DPS registration badge. The source badge shows a validity period through 15 December 2025." loading="lazy" decoding="async" /><figcaption>Registration badge retained from the source page; its printed validity ends 15 December 2025.</figcaption></figure>
  </section>
}

export function ValueDetails({ numbered = false }: { numbered?: boolean }) {
  return <div className={`value-list${numbered ? ' numbered' : ''}`}>{himCoreValues.map((value, i) => <details className="value-item" key={value.label}>
    <summary>{numbered && <span className="item-number">{String(i + 1).padStart(2, '0')}</span>}<span>{value.label}</span><span className="plus" aria-hidden="true">+</span></summary>
    <div className="value-copy">{value.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
  </details>)}</div>
}

function MissionIcon() {
  return <span className="mission-icon" aria-hidden="true"><svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.5" /><circle cx="16" cy="16" r="7" stroke="currentColor" strokeWidth="1.5" /><circle cx="16" cy="16" r="2" fill="currentColor" /><path d="m17.5 14.5 8-8m0 0h-5m5 0v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
}

function VisionIcon() {
  return <span className="mission-icon" aria-hidden="true"><svg viewBox="0 0 32 32" fill="none"><path d="M3.5 16s4.5-7 12.5-7 12.5 7 12.5 7-4.5 7-12.5 7S3.5 16 3.5 16Z" stroke="currentColor" strokeWidth="1.5" /><circle cx="16" cy="16" r="3.5" stroke="currentColor" strokeWidth="1.5" /></svg></span>
}

export function HeroIntro({ children }: { children?: ReactNode }) {
  return <p className="hero-intro">{children ?? himIntroduction}</p>
}
