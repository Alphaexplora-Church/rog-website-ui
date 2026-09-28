import { useState } from 'react'
import type { FormEvent } from 'react'
import { rbsi } from '../../../shared/data/rbsi'

/**
 * ViewModel for `/about/rbsi`. Content is static (shared/data/rbsi.ts).
 *
 * The "Inquire now" form is FRONTEND-ONLY for now, the same convention as
 * Plan a Visit: it validates and shows a confirmation, but nothing is sent
 * yet. Wiring it is a one-function swap in `submit` — POST to the CMS's
 * `signup` collection (Doc 2 §4.8) with `formType: 'rbsi-inquiry'`, or to
 * whatever inbox ROG names.
 */

export interface RbsiInquiry {
  firstName: string
  lastName: string
  email: string
  subject: string
  message: string
}

const empty: RbsiInquiry = { firstName: '', lastName: '', email: '', subject: '', message: '' }

export function useRbsiViewModel() {
  const [form, setForm] = useState<RbsiInquiry>(empty)
  const [submitted, setSubmitted] = useState(false)

  function setField<K extends keyof RbsiInquiry>(key: K, value: RbsiInquiry[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function submit(e: FormEvent) {
    e.preventDefault()
    // TODO: send the inquiry once ROG confirms where RBSI inquiries go.
    setSubmitted(true)
  }

  function reset() {
    setForm(empty)
    setSubmitted(false)
  }

  return { rbsi, form, setField, submitted, submit, reset }
}
