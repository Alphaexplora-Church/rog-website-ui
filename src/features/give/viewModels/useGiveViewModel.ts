import { useEffect, useState } from 'react'

export type GiveKey = 'church' | 'tech'

export interface GiveOption {
  /** Modal heading. */
  title: string
  /** One line under the modal heading. */
  description: string
  /** QR image, served from `public/`. */
  qrSrc: string
  /** The giving form this QR opens — also the "can't scan" fallback link. */
  link: string
  steps: string[]
}

/**
 * Give (`/give`) — view model.
 *
 * BUILT 2026-09-23 from a reference component Jude sent ("yung sa give, make
 * it like this… palitan mo lang yung image tsaka yung color"), so the layout,
 * the accordion behaviour and the modal flow are deliberately the
 * reference's. What changed is the palette (its gold/royal-purple set does
 * not exist in this project — see below), the photography, and the copy.
 *
 * THE LINKS AND QR FILENAMES ARE JUDE'S, VERBATIM, ON HIS EXPLICIT CALL
 * ("same link ng sinend ko na code") after being asked. Worth knowing when
 * these are next touched: `xPnaKpS5UiZY6h389` and `EGC-QR.png` are El Gibhor
 * Church's giving form, not River of God's — the reference came from that
 * build. The Alphaexplora pair is Alphaexplora's own. Swap the church pair
 * the moment ROG's real form exists; nothing else needs to change.
 *
 * BOTH QR IMAGES STILL NEED TO BE ADDED to `public/` (`EGC-QR.png`,
 * `ALPHA-QR.png`). They are not in the repo yet. The modal degrades to its
 * text link if a QR is missing rather than showing a broken-image icon —
 * this is a money path, so it should never look broken.
 */
export const giveOptions: Record<GiveKey, GiveOption> = {
  church: {
    title: 'Church Tithing & Offering',
    description: 'Scan to open the official River of God giving form.',
    qrSrc: '/EGC-QR.png',
    link: 'https://forms.gle/xPnaKpS5UiZY6h389',
    steps: [
      'Scan the QR or open the form to provide your contact details.',
      'Select donation type (Tithes/Offering) and your preferred bank or e-wallet.',
      'Transfer the exact amount to the provided channels and upload your screenshot in the form.',
    ],
  },
  tech: {
    title: 'Fuel the Alphaexplora Team',
    description: 'Scan to support the developers behind this site.',
    qrSrc: '/ALPHA-QR.png',
    link: 'https://forms.gle/NxPUnynYgTjnqFEcA',
    steps: [
      'Scan the QR to open the Alphaexplora support form.',
      'Fill in your name, contact, and preferred bank or e-wallet channel.',
      'Complete the transfer and upload a screenshot of your receipt in the form.',
    ],
  },
}

export function useGiveViewModel() {
  const [activeModal, setActiveModal] = useState<GiveKey | null>(null)
  const [expandedCard, setExpandedCard] = useState<GiveKey>('church')

  /* Lock the page behind the modal. Restores on unmount too, so navigating
     away with the modal open cannot leave the body stuck. */
  useEffect(() => {
    if (!activeModal) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [activeModal])

  /* Escape closes it. The reference had no keyboard exit, which strands
     anyone not using a mouse inside a fixed full-screen overlay. */
  useEffect(() => {
    if (!activeModal) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setActiveModal(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeModal])

  return {
    activeModal,
    setActiveModal,
    expandedCard,
    setExpandedCard,
    option: activeModal ? giveOptions[activeModal] : null,
  }
}
