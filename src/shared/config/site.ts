/**
 * Site-wide constants. Everything here is a single edit point.
 *
 * WHY THIS FILE EXISTS: these five values get referenced from the navbar, the
 * hero, the footer and every SEO tag. When ROG hands over their real logo or
 * changes a service time, it should be one line, not a grep.
 *
 * Later these move behind the Strapi `global` single type (Doc 2 §4.9) and
 * this file becomes the fallback when the CMS is unreachable. The shape below
 * is deliberately already the shape that single type will return.
 */

/** Mirrors Doc 2's `shared.service-time` component field-for-field. */
export type ServiceLanguage = 'Taglish' | 'English' | 'Tagalog' | 'Other'

/**
 * One entry in `site.services`. `label` is genuinely optional (only the
 * Wednesday Prayer & Fasting entry uses it) — asserted explicitly on the
 * array below with `as ServiceTime[]` rather than left to infer through the
 * file's outer `as const`, because `as const` would otherwise narrow each
 * object literal to its own exact shape (three variants with no `label` key
 * at all, one with it) and produce a union that makes `t.label` a compile
 * error everywhere except the Wednesday branch.
 */
export interface ServiceTime {
  day: string
  time: string
  language: ServiceLanguage
  label?: string
}

export const site = {
  name: 'River of God',
  shortName: 'ROG',

  /**
   * LOGO — one file, both plates.
   *
   * What we have is a JPEG: white lockup on a solid black square, no alpha.
   * Normally that means two exports (white-on-transparent and
   * black-on-transparent) or it shows its own black box on every white
   * section. We do not need them. `.mark` in index.css blends the black away
   * on dark plates and inverts + blends the white away on light ones, so this
   * single file renders correctly on both.
   *
   * STILL WORTH ASKING ROG FOR AN SVG. The blend trick is exact, but a raster
   * mark softens on retina at hero size and the JPEG is 85 KB where the vector
   * would be about 4 KB. Drop an SVG at the same path and change the extension
   * here — nothing else has to change.
   */
  logo: {
    src: '/assets/1.png',
    /** The mark reads "River of God Ortigas", so the alt text says so. */
    alt: 'River of God Ortigas',

    /**
     * NAVBAR MARK — the wave alone, no text lockup.
     *
     * The full lockup above (`src`) reads as a tall stacked square — flagged
     * early on as the wrong shape for a navbar. This wide, short wave is the
     * actual icon-only mark and fits the bar the way the full lockup can't.
     * Cropped tight to its own alpha bounds (the source file had a lot of
     * dead transparent canvas above and below it) so it renders at a real
     * size instead of a thin sliver inside a square box.
     *
     * One black-on-transparent file, both tones: real alpha this time (not
     * the old JPEG's baked-in black square), so the navbar's own
     * `[data-tone]` CSS just inverts it to white over a dark plate — see
     * `.nav-mark__img` in index.css. No mix-blend-mode trick needed here.
     */
    mark: '/assets/logo2.webp',

    /**
     * NAVBAR LOCKUP (2026-09-28, Jude: "yung logo sa navbar tanggalin mo na
     * tas palitan mo neto … logo_tbg.png"). A trimmed, alpha-only copy of
     * public/assets/logo_tbg.png (229 KB of mostly empty canvas → 9 KB; the
     * original is untouched). Drawn as a mask in the bar's own ink colour.
     * `mark` above is no longer used by the Navbar or Footer.
     */
    nav: '/assets/rog/1-nav.webp',
    /** Navbar lockup swapped to public/assets/rog/1.png (2026-10-01, Jude); trimmed alpha-only copy, 2039:779. */

    /** The three-wave mark used site-wide by <WaveMark> (from logo1.png). */
    wave: '/assets/logo1-mark.webp',
  },

  /** The line under the logo in the hero. Their own, not ours. */
  motto: 'We come alive in the River.',

  /**
   * CONFIRMED 2026-09-16 — three different service schedules were published
   * across riverofgod.ph, their Facebook page and their printed material
   * (see CONTENT_CONFLICTS); Jude picked this one, the Doc 8 §3 schedule,
   * when asked directly rather than have it guessed from a stale source.
   * This replaces the old footer-sourced "8:00 / 10:30 / 4:00, no language"
   * placeholder that used to sit here unverified.
   *
   * One flat, ordered list — not grouped by day — because it's the same
   * shape as Doc 2's `shared.service-time` component (`dayOfWeek`, `time`,
   * `language`, `label`, `note`). This array is what seeds that Strapi
   * repeatable field once the CMS is wired up, so campus and the church
   * directory both read from one source instead of duplicating it.
   * ServiceTimesSection renders this array directly, one tile per entry, in
   * this exact order; the hero badge groups it by day for a terser summary
   * instead — see both call sites, not duplicated data here.
   */
  services: [
    { day: 'Sunday', time: '10:00 AM', language: 'Taglish' },
    { day: 'Sunday', time: '1:00 PM', language: 'Taglish' },
    { day: 'Sunday', time: '4:00 PM', language: 'English' },
    { day: 'Wednesday', time: '6:00 PM', language: 'Other', label: 'Prayer & Fasting' },
  ] as ServiceTime[],

  /**
   * CONFIRMED 2026-09-22 from riverofgod.ph directly, replacing the earlier
   * "Ortigas, Pasig City" placeholder this file used to carry (flagged
   * unverified since it was set) — Jude pasted the live site's own footer
   * address and phone number. `phone` is a new field; anything reading
   * `site.location` (ServicesMainCenterSection's Main Center card, Footer)
   * picks up the corrected address automatically.
   */
  location: {
    venue: 'River of God Center — Lower Ground, Main Wing, Shangri-La Plaza',
    area: 'EDSA corner Shaw Blvd., Wack-Wack Greenhills East, Mandaluyong City, Metro Manila 1550',
  },
  phone: '(02) 8712 7006',

  /**
   * SOCIAL CHANNELS — one definition, every call site.
   *
   * MOVED HERE 2026-09-23. These three URLs were hardcoded inside
   * `LiveServicesSection`'s `platforms` array, which meant the only place
   * the church's own YouTube / Facebook / Instagram addresses existed was
   * the middle of one home-page section. They are site-wide facts (the
   * footer wants them, a contact page would want them, Strapi's `global`
   * single type will carry them), so they live here now and that section
   * reads them.
   *
   * ⚠ TWO DIFFERENT FACEBOOK PAGES ARE IN PLAY AND ONE OF THEM MAY BE
   * WRONG. `facebook` below is the Ortigas page that the home page has
   * always linked; `liveStreamUrl` further down points at
   * facebook.com/riverofgodph, the network-wide page, and has since this
   * file was created. Both have been left exactly as they were rather than
   * silently reconciled — but this site is the Ortigas site (the logo alt
   * text says so), so the Watch Live button probably wants the Ortigas
   * page too. Jude to confirm which page the stream actually runs on, then
   * point `liveStreamUrl` at `site.social.facebook` and delete the
   * standalone URL.
   */
  social: {
    youtube: 'https://www.youtube.com/@riverofgodortigas',
    facebook: 'https://www.facebook.com/riverofgodortigas/',
    instagram: 'https://www.instagram.com/riverofgod.ph/',
  },

  /** Drives the pulsing dot on the Watch Live button. See the ⚠ above. */
  liveStreamUrl: 'https://www.facebook.com/riverofgodph',
  /**
   * YouTube channel ID (starts with "UC", NOT the @handle) used by the Watch
   * Live embed (`youtube.com/embed/live_stream?channel=<id>`). Leave empty
   * and /watch-live falls back to the Watch Live button instead of an embed.
   * Find it in YouTube Studio → Settings → Channel → Advanced settings.
   */
  youtubeChannelId: 'UChQlOwL5h8OX1vlMjHjN68w' as string,
} as const
