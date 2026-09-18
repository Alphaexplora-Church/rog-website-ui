# ROG frontend — restart, step 1 of N

Navbar + Home hero only. Nothing else is in this drop on purpose.

## 1. Wipe the old `src`

```powershell
cd "C:\Users\Jude Emmanuel Flores\Desktop\Alpha\GIT\ROG\rog-website-ui"
Remove-Item -Recurse -Force src
```

`node_modules`, `package.json`, `.git`, `index.html` and `vite.config.ts` all
stay. Nothing to reinstall.

## 2. Drop this in

Copy the `src/` folder from this archive into the repo root so you end up with:

```
rog-website-ui/
  public/
    rog-logo.png          <-- YOU add this, see step 3
  src/
    App.tsx
    main.tsx
    index.css
    shared/
      components/Navbar.tsx
      components/ui/Button.tsx
      config/navigation.ts
      config/site.ts
      hooks/useInView.ts
    features/home/views/Home.tsx
    features/home/views/sections/HeroSection.tsx
```

## 3. The logo — this one needs you

The URL you sent is a Facebook CDN link. Those expire (that is what the `oe=`
parameter is) and Facebook blocks hotlinking from other origins, so it will go
dead — and if it goes dead inside a prerendered build, the dead URL is baked
into the static HTML.

Save it locally instead:

- `public/rog-logo.png` — the **white** lockup, for dark plates
- `public/rog-logo-dark.png` — the **black** lockup, for white plates

A transparent PNG or, better, an SVG. Until those files exist both the navbar
and the hero fall back to a live text wordmark, so nothing looks broken while
you are still chasing the asset from ROG.

Paths are set in one place: `src/shared/config/site.ts`.

## 4. Run

```powershell
npm run dev
```

## What to look at

1. **The hero is 92svh, not 100.** There is always a sliver of the next plate
   at the bottom edge. That is the thing that makes people scroll.
2. **Scroll slowly across the hero/next-section boundary** and watch the
   navbar invert — white-on-glass over black, black-on-glass over white. The
   inversion rhythm runs through the chrome instead of stopping at it.
3. **Hover across About → Ministries → Media & Events.** One highlight chip
   slides and resizes between them; it does not fade out and back in.
4. **The word "River"** is the only thing on the page that moves by itself.

## Before anyone outside sees this

- `src/shared/config/navigation.ts` — four dropdown blurbs are marked
  `⚠ PLACEHOLDER`. H.I.M. PH, RBSI, Body of Christ Ministries and Activate12.
  I have not confirmed what those expand to and I am not going to invent it.
- `src/shared/config/site.ts` — the service times are the footer set, and
  riverofgod.ph publishes three different schedules. Confirm with ROG.
