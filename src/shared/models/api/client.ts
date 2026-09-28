/**
 * Strapi REST client — the only place in the site that knows the CMS's
 * address or how its errors look (Doc 5 §4.3, Doc 6 §6b step 4).
 *
 * Base URL comes from `VITE_STRAPI_URL` in `.env.local`
 * (http://localhost:1337 in dev). Vite reads env files only at startup, so
 * changing it needs `npm run dev` restarted.
 *
 * Errors are written for the person debugging, because the two failures the
 * POC actually hit both look like "the site is broken" from the outside:
 *   · the CMS isn't running → a network error, not an HTTP status
 *   · the Public role can't read a type → HTTP 403, even though the admin
 *     checkbox looked saved (the POC's silent-permission bug)
 */

export const STRAPI_URL = String(import.meta.env.VITE_STRAPI_URL ?? 'http://localhost:1337').replace(
  /\/$/,
  '',
)

export class StrapiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'StrapiError'
    this.status = status
  }
}

function hintFor(status: number): string {
  if (status === 403) {
    return ' — the Public role cannot read this. rog-cms grants find/findOne at boot (src/index.ts); restart `npm run develop`, then check Settings → Users & Permissions → Public.'
  }
  if (status === 404) {
    return ' — this content type or route does not exist. Restart Strapi after any schema change.'
  }
  return ''
}

/** GET `/api/<path>?<query>` and return the parsed JSON. */
export async function strapiGet<T>(path: string, query?: URLSearchParams): Promise<T> {
  const qs = query && [...query.keys()].length ? `?${query.toString()}` : ''
  const url = `${STRAPI_URL}/api/${path}${qs}`

  let res: Response
  try {
    res = await fetch(url, { headers: { Accept: 'application/json' } })
  } catch {
    throw new StrapiError(
      0,
      `Could not reach the CMS at ${STRAPI_URL}. Is \`npm run develop\` running in rog-cms?`,
    )
  }

  if (!res.ok) {
    throw new StrapiError(res.status, `CMS request /api/${path} failed with ${res.status}${hintFor(res.status)}`)
  }
  return (await res.json()) as T
}

interface StrapiList<T> {
  data: T[]
  meta?: { pagination?: { page: number; pageCount: number } }
}

/**
 * Every entry of a collection, following pagination. Strapi caps a page at
 * 100 by default; ROG's library is ~165 messages, so a single request would
 * silently drop the oldest ones.
 */
export async function strapiGetAll<T>(path: string, query: URLSearchParams): Promise<T[]> {
  const PAGE_SIZE = 100
  const all: T[] = []
  let page = 1
  let pageCount = 1

  do {
    const q = new URLSearchParams(query)
    q.set('pagination[page]', String(page))
    q.set('pagination[pageSize]', String(PAGE_SIZE))
    const res = await strapiGet<StrapiList<T>>(path, q)
    all.push(...res.data)
    pageCount = res.meta?.pagination?.pageCount ?? 1
    page += 1
  } while (page <= pageCount)

  return all
}
