import { useState } from 'react'
import type { FormEvent } from 'react'
import { site } from '../../../shared/config/site'

/**
 * Plan a Visit — view model for the `/plan-a-visit` form.
 *
 * Content and field set are Jude's own spec, 2026-09-22 — he pasted a
 * reference screenshot ("we'll save a seat", First/Last name, Email, Which
 * Sunday, Preferred Service, Adults/Kids, "I am a... First-time / Returning
 * Guest", "Continue to Guide") and asked for "yung laman nung forms" (this
 * exact form content). Visual style is our own dark/teal system, not the
 * reference's light/orange palette — confirmed with Jude via AskUserQuestion
 * before building.
 *
 * FRONTEND-ONLY, same convention as mediaData.ts and the rest of this pass
 * ("wala munang gagalawin sa cms interface"). `signup` is already spec'd in
 * Doc 2 §4.8 with a `formType: 'plan-a-visit'` discriminator — this is the
 * exact shape that Strapi collection expects, so wiring the real POST later
 * is a one-function swap in `submit` below, not a form rewrite. There is no
 * "Guide" page yet (the reference's post-submit step), so submitting here
 * just shows a confirmation panel in place of the form.
 */

export type GuestType = 'first-time' | 'returning'

export interface PlanAVisitForm {
  firstName: string
  lastName: string
  email: string
  sundayDate: string
  serviceTime: string
  adults: number
  kids: number
  guestType: GuestType
}

const emptyForm: PlanAVisitForm = {
  firstName: '',
  lastName: '',
  email: '',
  sundayDate: '',
  serviceTime: '',
  adults: 1,
  kids: 0,
  guestType: 'first-time',
}

/** Sunday services only — Wednesday Prayer & Fasting isn't a visit-planning
 *  option, it's a midweek gathering. Value is `time|language` so the label
 *  can be reconstructed from a plain HTML <select> value string. */
export const sundayServiceOptions = site.services
  .filter((s) => s.day === 'Sunday')
  .map((s) => ({
    value: `${s.time}|${s.language}`,
    label: `${s.time} — ${s.language}`,
  }))

export function usePlanAVisitViewModel() {
  const [form, setForm] = useState<PlanAVisitForm>(emptyForm)
  const [submitted, setSubmitted] = useState(false)

  function setField<K extends keyof PlanAVisitForm>(key: K, value: PlanAVisitForm[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function submit(e: FormEvent) {
    e.preventDefault()
    // TODO: POST to Strapi `signup` (formType: 'plan-a-visit') once the CMS
    // is wired up. For now this is a local-only confirmation, same pattern
    // as the rest of this frontend-only pass.
    setSubmitted(true)
  }

  function reset() {
    setForm(emptyForm)
    setSubmitted(false)
  }

  return { form, setField, submitted, submit, reset }
}
