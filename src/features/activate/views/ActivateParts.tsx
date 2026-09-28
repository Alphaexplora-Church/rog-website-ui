import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { ActivateConference, ActivateSpeaker } from '../../../shared/data/activate'
import type { activateContact } from '../../../shared/data/activate'
import { Eyebrow, Reveal } from '../../../shared/components/ui/River'
import { container } from '../../../shared/styles/tokens'
import { youtubeEmbedUrl } from '../../../shared/lib/youtube'

/**
 * Pieces shared by the three Activate pages. NEW 2026-09-28.
 *
 *   LogoMark        a conference logo drawn as a CSS mask, so it takes the
 *                   ground's ink (bone on dark, abyss on light) instead of
 *                   the file's own grey.
 *   VideoFacade     a 16:9 poster with a play button; the YouTube player
 *                   only loads on click (a YouTube iframe costs ~1 MB of
 *                   script — three of them on load would blow the budget).
 *   SpeakerCard     portrait (or monogram) + name + church + bio.
 *   PastCard        the "button" to a past conference page.
 *   ContactSection  "Where to reach us?" — the same block on every page.
 */

export function LogoMark({
  src,
  aspect,
  label,
  className = '',
}: {
  src: string
  aspect?: string
  label: string
  className?: string
}) {
  return (
    <span
      role="img"
      aria-label={label}
      className={`block bg-current ${aspect ?? ''} ${className}`}
      style={{
        WebkitMask: `url('${src}') center/contain no-repeat`,
        mask: `url('${src}') center/contain no-repeat`,
      }}
    />
  )
}

export function VideoFacade({ videoId, title }: { videoId: string; title: string }) {
  const [playing, setPlaying] = useState(false)
  return (
    <div className="relative aspect-video w-full overflow-hidden bg-deep ring-1 ring-bone/10">
      {playing ? (
        <iframe
          src={`${youtubeEmbedUrl(videoId)}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play video: ${title}`}
          className="group absolute inset-0 block h-full w-full cursor-pointer"
        >
          <img
            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
            onError={(e) => {
              // maxres isn't generated for every upload — fall back once.
              const img = e.currentTarget
              if (!img.src.includes('hqdefault')) img.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
            }}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-current group-hover:scale-[1.03] motion-reduce:transition-none"
          />
          <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-abyss/80 via-abyss/20 to-transparent" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-ember text-abyss transition-transform duration-500 ease-current group-hover:scale-105 sm:h-24 sm:w-24">
              <span aria-hidden="true" className="pointer-events-none absolute -inset-3 -z-10 rounded-full bg-ember/35 blur-xl" />
              <svg viewBox="0 0 24 24" className="ml-1 h-8 w-8" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </span>
          <span className="absolute bottom-0 left-0 p-5 text-left sm:p-7">
            <span className="block text-[0.72rem] font-semibold tracking-[0.22em] text-shallows uppercase">Watch</span>
            <span className="mt-1 block font-shout text-[clamp(1.5rem,3vw,2.5rem)] font-extrabold uppercase leading-none text-bone">
              {title}
            </span>
          </span>
        </button>
      )}
    </div>
  )
}

function initials(name: string) {
  const parts = name
    .replace(/^(Bishop|Pastor|Dr\.|Ps\.|Rev\.)\s+/i, '')
    .split(/\s+/)
    .filter(Boolean)
  return (parts[0]?.[0] ?? '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')
}

export function SpeakerCard({ speaker, index }: { speaker: ActivateSpeaker; index: number }) {
  return (
    <Reveal as="li" delay={(index % 3) * 70} className="flex flex-col">
      <div className="grain relative aspect-[4/5] overflow-hidden bg-deep">
        {speaker.photo ? (
          <img
            src={speaker.photo}
            alt={`Portrait of ${speaker.name}`}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
        ) : (
          <div
            aria-hidden="true"
            className="absolute inset-0 flex items-end p-6 [background-image:radial-gradient(ellipse_90%_70%_at_20%_10%,color-mix(in_srgb,var(--color-ember)_45%,transparent),transparent_70%),radial-gradient(ellipse_70%_60%_at_100%_100%,color-mix(in_srgb,var(--color-river)_90%,transparent),transparent_70%)]"
          >
            <span className="font-shout text-[clamp(5rem,9vw,8rem)] font-extrabold uppercase leading-none text-bone/90">
              {initials(speaker.name)}
            </span>
          </div>
        )}
        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-abyss/70 to-transparent" />
      </div>
      <h3 className="mt-6 font-shout text-[clamp(1.6rem,2.2vw,2.1rem)] font-extrabold uppercase leading-[0.95]">
        {speaker.name}
      </h3>
      {speaker.church ? (
        <p className="mt-2 text-[0.72rem] font-semibold tracking-[0.22em] text-ember uppercase">{speaker.church}</p>
      ) : null}
      <p className="mt-4 text-[0.95rem] leading-relaxed text-bone/75">{speaker.bio}</p>
    </Reveal>
  )
}

export function PastCard({ conference, tone = 'light' }: { conference: ActivateConference; tone?: 'light' | 'dark' }) {
  const light = tone === 'light'
  return (
    <Link
      to={conference.to}
      viewTransition
      className={`group relative flex h-full min-h-[18rem] flex-col justify-between overflow-hidden border p-7 transition-colors duration-500 ease-current sm:p-9 ${
        light
          ? 'border-abyss/15 bg-bone-2 text-abyss hover:border-abyss hover:bg-abyss hover:text-bone'
          : 'border-bone/15 bg-abyss-2 text-bone hover:border-ember hover:bg-ember hover:text-abyss'
      }`}
    >
      <div className="flex items-start justify-between gap-6">
        <span className="text-[0.72rem] font-semibold tracking-[0.22em] uppercase opacity-70">
          Past conference · {String(conference.edition).padStart(2, '0')}
        </span>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-6 w-6 flex-none transition-transform duration-500 ease-current group-hover:translate-x-1 group-hover:-translate-y-1"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 17 17 7M9 7h8v8" />
        </svg>
      </div>
      {conference.logo ? (
        <LogoMark
          src={conference.logo}
          aspect={conference.logoAspect}
          label={`${conference.name}${conference.theme ? ` — ${conference.theme}` : ''}`}
          className="my-8 h-auto max-h-36 w-[min(18rem,80%)]"
        />
      ) : (
        <p className="my-8 font-shout text-5xl font-extrabold uppercase">{conference.name}</p>
      )}
      <p className="flex items-baseline justify-between gap-4">
        <span className="font-shout text-2xl font-bold uppercase leading-none">
          {conference.name}
          {conference.theme ? <span className="opacity-60"> · {conference.theme}</span> : null}
        </span>
        <span className="text-sm font-semibold whitespace-nowrap underline decoration-1 underline-offset-4">
          Landing page
        </span>
      </p>
    </Link>
  )
}

export function ContactSection({ contact }: { contact: typeof activateContact }) {
  return (
    <section
      data-plate="dark"
      aria-labelledby="activate-contact-heading"
      className="relative overflow-hidden bg-river py-24 text-bone sm:py-28"
    >
      <div aria-hidden="true" className="grain absolute inset-0" />
      <div className={`${container} relative grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-end`}>
        <div>
          <Eyebrow className="text-bone/80">Questions about Activate</Eyebrow>
          <h2
            id="activate-contact-heading"
            className="mt-5 font-shout text-[clamp(3rem,7vw,6rem)] font-extrabold uppercase leading-[0.88]"
          >
            Where to
            <br />
            reach us.
          </h2>
          <p className="mt-6 max-w-[34ch] font-whisper text-xl italic leading-snug text-bone/80">
            Call either line and look for {contact.person}.
          </p>
        </div>
        <dl className="grid gap-px overflow-hidden bg-bone/15 sm:grid-cols-2">
          <ContactRow label="Landline" value={contact.landline} href={contact.landlineHref} />
          <ContactRow label="Mobile" value={contact.mobile} href={contact.mobileHref} />
          <div className="bg-river p-6 sm:col-span-2 sm:p-8">
            <dt className="text-[0.72rem] font-semibold tracking-[0.22em] text-shallows uppercase">Facebook</dt>
            <dd className="mt-2">
              <a
                href={contact.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="font-shout text-[clamp(1.5rem,2.6vw,2.25rem)] font-bold uppercase leading-tight underline decoration-bone/30 decoration-1 underline-offset-[6px] transition-colors duration-300 hover:text-sky hover:decoration-sky"
              >
                {contact.facebookLabel}
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  )
}

function ContactRow({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <div className="bg-river p-6 sm:p-8">
      <dt className="text-[0.72rem] font-semibold tracking-[0.22em] text-shallows uppercase">{label}</dt>
      <dd className="mt-2">
        <a
          href={href}
          className="font-shout text-[clamp(1.75rem,3vw,2.75rem)] font-bold leading-none tabular-nums transition-colors duration-300 hover:text-sky"
        >
          {value}
        </a>
      </dd>
    </div>
  )
}
