# Next.js → Astro migration plan

> Project: `luisjcenteno.dev` (personal portfolio)
> Current stack: Next.js 16 Pages Router, static export, Bulma/SCSS, React 19
> Target: Astro 7 (static output) + React integration, reusing existing React components
>
> **Status:** implemented on branch `migrate/astro` with Astro 7.4.2,
> `@astrojs/react` 7.1.1, and `@astrojs/sitemap` 3.7.4.

---

## 1. What the site actually is today

The site is **already a pure static site**. `next.config.js` sets `output: 'export'`, so
`next build` produces plain HTML/CSS/JS in `out/`, and Docker serves that folder through Nginx.
There is no server runtime, API route, middleware, or image optimization service.

### Routes

| URL | Source file | Notes |
| --- | --- | --- |
| `/` | `pages/index.jsx` | Profile sidebar + about + work experience + projects |
| `/projects` | `pages/projects/index.jsx` | Project grid |
| `/projects/adm2` | `pages/projects/[slug].jsx` | Markdown README fetched at build time |
| `/projects/baby-tracker` | same | same |
| `/projects/memorias-de-vida` | same | same |
| `/projects/contractflow` | same | same |
| `/projects/photo-print-tool` | same | same |
| `/privacy` | `pages/privacy.jsx` | Static text |
| `404` | Next.js default | No custom `pages/404.jsx` exists |

### Build and deploy flow

```
bun install
  → next build (output: export) → out/
  → next-sitemap → out/sitemap*.xml + out/robots.txt
  → Docker builder stage
  → nginx:alpine serves /app/out at :80 (nginx/default.conf)
```

### Dependencies that matter

- `next`, `react`, `react-dom`
- `@tabler/icons-react` (SVG icons inside React components)
- `bulma` + `sass` (SCSS with Bulma variables)
- `marked` (remote README → HTML at build time)
- `html-react-parser` (renders the HTML string into React)
- `styled-components` — **only used for `StyleSheetManager` in `_app.js`; not used for styling**
- `next-sitemap`, `eslint-config-next`
- `prop-types` — imported by components but **not declared** in `package.json`; it currently
  resolves transitively through `eslint-plugin-react`.

### Interactivity audit

Only **one** component is genuinely interactive:

- `components/navbar/index.jsx` — `useState` for the mobile burger menu.

Everything else is static markup:

- `profile-box`, `about-me-box`, `work-experience`, `timeline`, `timeline/row`,
  `projects-box`, `project-card`, `dev-icon`, `github-button`, `seo`.

`hooks/useWindowSize.js` exists but is **not imported anywhere**.

This matters: after the navbar is handled, Astro can render the entire site with **zero
React hydration**, while still reusing the React components at build time.

### Existing quirks/bugs to fix during migration

These are pre-existing, not caused by Astro:

1. `components/dev-icon/index.jsx` maps icon keys as `REACT`, `VUE`, … but `projects.json`
   uses `"react"`, `"vue"`, so `logos[name]` is always `undefined` — **no stack icons render
   today**. Use lowercase keys.
2. `projects.json` also uses `express` and `postgres`, which `dev-icon` has no mapping for.
3. `projects-box` calls `.sort()` on the imported `Projects` array in place.
4. `useWindowSize` has an invalid dependency array (`[input]`) and is unused.
5. `about-me-box` has a `callToAction.button` with `onClick`; it is never used, and would not
   hydrate in Astro without a `client:*` directive.
6. `seo` renders a relative `og:image` (`/images/cover.jpg`), which social crawlers generally
   require to be absolute.
7. `privacy.jsx` has no SEO/title and its copy mentions “Living Company” and
   `contact@livingcompany.com` (likely copy/paste leftovers).
8. No canonical URL anywhere.
9. `next.config.js` forwards `sassOptions.includePaths`, but the SCSS uses Bulma package imports;
   this is not needed in Astro/Vite.
10. `/_next/static/*` has a long-cache rule in Nginx; Astro uses `/_astro/*`.
11. No Nginx `error_page 404`; the custom 404 HTML is not used.

---

## 2. Recommended strategy

### Strategy A (recommended first pass): lift-and-shift React components into Astro

Keep the React components almost exactly as they are and render them from `.astro` pages
**without a `client:*` directive**. Astro renders them to static HTML at build time and ships
no React runtime to the browser.

- Lowest risk, fastest parity.
- Reuses all presentational components.
- Only the navbar and Next-specific imports need real changes.
- Gives the full Astro benefit for deployment, routing, sitemap, and JS payload
  (React is build-time only).

### Strategy B (optional follow-up): convert static React components to `.astro`

Once parity is reached, progressively rewrite the purely presentational components as
`.astro` components and remove `@astrojs/react`, `react`, and `react-dom` entirely.
This removes React from the build pipeline too, but is not required for the first migration.

> Recommendation: do A now, keep B as a later cleanup. Do **not** mix both in the first PR.

### Key architectural decisions

| Decision | Recommendation | Reason |
| --- | --- | --- |
| Output | `output: 'static'` (Astro default) | Same deployment model as today |
| URL format | `build.format: 'directory'`, `trailingSlash: 'never'` | Produces `dist/projects/index.html`; keeps existing no-slash URLs/links and canonical URLs |
| React | `@astrojs/react`, no `client:*` initially | Static render at build; no React in browser |
| Navbar | Rewrite as `Navbar.astro` + tiny inline script | Avoids shipping React just for a burger menu |
| SEO | Move into `BaseLayout.astro` props | Astro has no `next/head`; head is owned by layouts |
| Markdown | Keep `marked` + `<Fragment set:html={content} />` | Same behavior, removes `html-react-parser` |
| Styles | Keep all SCSS under one `globals.scss` entrypoint | Current partials rely on Bulma variables loaded first |
| Sitemap | `@astrojs/sitemap` + `src/pages/robots.txt.ts` | Replaces `next-sitemap` |
| Hosting | Keep Docker + Nginx, change `out` → `dist` and `_next` → `_astro` | Minimal infra change |

---

## 3. Target file tree

```
astro.config.mjs
package.json
public/                      # stays at root; Astro copies it to dist/
src/
  components/
    about-me-box/index.jsx            # reused
    dev-icon/index.jsx                # reused + key fix
    github-button/index.jsx           # reused, <a>
    navbar/Navbar.astro               # rewritten
    profile-box/index.jsx             # reused, <a>
    project-card/index.jsx            # reused, <a> + dangerouslySetInnerHTML
    projects-box/index.jsx            # reused
    seo/                              # DELETE (merged into BaseLayout)
    timeline/index.jsx                # reused
    timeline/row.jsx                  # reused
    work-experience/index.jsx         # reused
  data/
    index.js
    profile.json
    projects.json
    work-experience.json
  layouts/
    BaseLayout.astro                  # replaces _app + main-layout + seo
    ProjectLayout.astro               # replaces project-layout + html-react-parser
  pages/
    index.astro
    projects/index.astro
    projects/[slug].astro
    privacy.astro
    404.astro
    robots.txt.ts
  styles/
    globals.scss
    components/...
    pages/...
  utils/
    getProjectContent.js
    getProjectData.js                # renamed from getProjectStaticProps
    index.js
    markdownFetch.js
nginx/default.conf
Dockerfile
```

`pages/`, root `components/`, `layouts/`, `data/`, `styles/`, `hooks/` are deleted after parity.
`next.config.js`, `next-sitemap.config.js`, and the Next dependencies are removed at the end.

---

## 4. Step-by-step migration

### Phase 0 — Baseline and safety net (30–60 min)

1. Create a branch:
   ```sh
   git checkout -b migrate/astro
   ```
2. Install the current project and keep a baseline build for comparison:
   ```sh
   bun install
   bun run build
   cp -R out /tmp/luisjcenteno-next-baseline
   ```
3. Record the current routes and rendered output:
   ```sh
   find out -name '*.html' | sort
   curl -s https://luisjcenteno.dev/sitemap.xml
   ```
4. Capture screenshots/Lighthouse for `/`, `/projects`, one project page, `/privacy`.
   (Optional: `npx lighthouse https://luisjcenteno.dev --view`.)
5. Note the production URL policy: internal links currently have no trailing slash
   (`/projects/adm2`), so the plan keeps no-trailing-slash canonicals.

**Acceptance:** baseline build works and `out/` routes are recorded.

---

### Phase 1 — Scaffold Astro in place (1–2 h)

Add Astro and integrations with Bun:

```sh
bun add astro @astrojs/react @astrojs/sitemap
bun add -d @astrojs/check typescript
```

> Use the latest Astro 7.x / matching `@astrojs/react`. Do not copy versions by hand;
> `bun add` will resolve a compatible set.

Create `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: process.env.SITE_URL ?? 'https://luisjcenteno.dev',
  trailingSlash: 'never',
  build: { format: 'directory' },
  integrations: [react(), sitemap()],
})
```

Notes:

- `site` is required by `@astrojs/sitemap` and makes canonical/OG URLs easy.
- `build.format: 'directory'` emits `dist/projects/index.html`.
- `trailingSlash: 'never'` keeps the current links (`/projects/adm2`) canonical. Nginx will
  serve both `/projects` and `/projects/`; Astro dev redirects the slash variant.
- Do **not** port `sassOptions.includePaths`; Bulma imports (`@import 'bulma/sass/...'`)
  resolve from `node_modules` through Vite.
- No `output` key is needed; static is the default.

Update `package.json` scripts now (keep old ones temporarily if running side by side):

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro"
  }
}
```

Move directories to `src/`:

```sh
mkdir -p src
git mv components src/components
git mv data src/data
git mv layouts src/layouts
git mv styles src/styles
git mv utils src/utils
git mv pages src/legacy-pages   # temporary reference only
```

Move JSON/data alongside. Keep `public/` at the repository root.

Update `.gitignore` (`/dist/` is already listed, so only the Astro cache is new; remove the
Next entries after parity):

```gitignore
/.astro/
# /dist/ already exists
# remove /.next/ and /out/ once Next is gone
```

Add a `jsconfig.json` (optional, for editor aliases and JSX):

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  },
  "include": ["src/**/*", "astro.config.mjs"]
}
```

If aliases are not configured, keep relative imports — no alias is required.

**Acceptance:** `bun run astro --version` works and `src/` contains the old code.

---

### Phase 2 — Build the shared layout and SEO (2–3 h)

#### 2.1 `src/layouts/BaseLayout.astro`

Replaces `pages/_app.js`, `layouts/main-layout`, and `components/seo`.

```astro
---
import NavBar from '../components/navbar/Navbar.astro'
import '../styles/globals.scss'

const {
  title,
  description,
  image = '/images/cover.jpg',
  className = '',
  type = 'website',
} = Astro.props

const canonical = new URL(Astro.url.pathname, Astro.site)
const ogImage = new URL(image, Astro.site)
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <link rel="icon" href="/favicon.ico" />
    <link rel="canonical" href={canonical} />

    <meta name="description" content={description} />
    <meta property="og:type" content={type} />
    <meta property="og:url" content={canonical} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={ogImage} />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={ogImage} />

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;700&display=swap"
      rel="stylesheet"
    />

    <!-- Umami analytics: was next/script in _app.js -->
    <script
      is:inline
      defer
      src="https://analytics.luisjcenteno.dev/script.js"
      data-website-id="2c1eb7da-c2ec-47eb-8e4b-d741d9ff8e9f"
    ></script>
  </head>
  <body>
    <main class:list={['MainLayout', className]}>
      <NavBar />
      <slot />
    </main>
  </body>
</html>
```

Important details:

- `className` is a prop here; DOM elements inside `.astro` files use `class`, not `className`.
- The global SCSS import must happen **once**, here. The page/component partials use Bulma
  variables (`$text`, `$purple`, `$dark-secondary`, `$scheme-main`) that are defined in
  `globals.scss` before those partials are imported. Do not split the imports.
- Move the Google Fonts `@import` out of `globals.scss` (delete line 3) now that it is a
  `<link>`; this avoids a render-blocking CSS import.
- `og:image` is absolute now. `image` can stay relative and is resolved against `Astro.site`.
- `Astro.site` is defined because `site` is set in `astro.config.mjs`.

Delete `src/components/seo/` after moving its meta tags here.

#### 2.2 Navbar: rewrite as Astro (recommended)

Create `src/components/navbar/Navbar.astro`. This removes the only React island and keeps the
mobile menu working with a tiny vanilla script.

```astro
---
import { Profile } from '../../data'
---
<nav class="navbar is-dark" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <a href="/" class="navbar-item has-text-weight-bold" aria-label={Profile.name}>
      <img src="/images/logo.png" height={28} width={28} alt={Profile.name} />
    </a>

    <button
      class="navbar-burger"
      aria-label="menu"
      aria-expanded="false"
      data-target="navbarMenu"
      type="button"
    >
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </button>
  </div>

  <div id="navbarMenu" class="navbar-menu closed">
    <div class="navbar-start">
      <a href="/" class="navbar-item" data-umami-event="home_link_click"
        data-umami-event-type="click">Home</a>
      <a href="/projects" class="navbar-item" data-umami-event="projects_link_click"
        data-umami-event-type="click">Projects</a>
      <a href={Profile.cv} class="navbar-item is-flex is-align-items-center"
        target="_blank" rel="noopener noreferrer" data-umami-event="cv_link_click"
        data-umami-event-type="click">
        Resume
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
          <path d="M7 11l5 5l5-5" />
          <path d="M12 4v12" />
        </svg>
      </a>
    </div>
  </div>
</nav>

<script>
  const burger = document.querySelector('.navbar-burger')
  if (burger) {
    burger.addEventListener('click', () => {
      const menu = document.getElementById(burger.dataset.target)
      const isOpen = menu.classList.toggle('open')
      menu.classList.toggle('closed', !isOpen)
      burger.setAttribute('aria-expanded', String(isOpen))
    })
  }
</script>
```

Astro bundles this script (module, deferred) and includes it only where the navbar is rendered.
No React, no hydration.

**Fallback if you want zero component rewrites:** keep the React navbar and hydrate it:

```astro
<NavBar client:load />
```

This ships the React runtime to the browser just for the menu, so prefer the Astro rewrite.

#### 2.3 `src/layouts/ProjectLayout.astro`

Replaces `layouts/project-layout/index.jsx`. `html-react-parser` is replaced by `set:html`.

```astro
---
import BaseLayout from './BaseLayout.astro'
import { Profile } from '../data'
import GithubButton from '../components/github-button'

const { project, content, className = 'ProjectPage' } = Astro.props

const githubLink = project.links?.find((link) => link.label === 'View on GitHub')?.url
const coverImage = typeof project.cover === 'string' ? project.cover : null
---
<BaseLayout
  title={`${Profile.name} | ${project.name}`}
  description={project.description}
  image={coverImage ?? undefined}
  className={className}
>
  <div class="container is-max-desktop p-5">
    {coverImage && (
      <figure class="project__cover">
        <img src={coverImage} alt={`${project.name} cover image`} loading="lazy" />
      </figure>
    )}

    <article class="box project">
      <Fragment set:html={content} />

      {githubLink && (
        <div class="m-4 has-text-centered">
          <GithubButton url={githubLink} />
        </div>
      )}
    </article>
  </div>
</BaseLayout>
```

**Acceptance:** layout renders, head tags are correct, navbar burger still works.

---

### Phase 3 — Migrate pages (3–4 h)

#### 3.1 `src/pages/index.astro`

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro'
import ProfileBox from '../components/profile-box'
import AboutMeBox from '../components/about-me-box'
import ProjectsBox from '../components/projects-box'
import WorkExperience from '../components/work-experience'
import { Profile, Projects, WorkExp } from '../data'

const title = `${Profile.name} | ${Profile.title}`
---
<BaseLayout className="HomePage" title={title} description={Profile.short_desc}>
  <div class="container">
    <div class="columns is-mobile is-multiline">
      <div class="column is-one-third-desktop is-full-mobile HomePage-profileColumn">
        <ProfileBox
          name={Profile.name}
          avatar={Profile.photo}
          role={Profile.title}
          email={Profile.email}
          country={Profile.location}
          skills={Profile.skils}
        />
      </div>

      <div class="column HomePage-scrollContainer">
        <div class="HomePage-scrollArea">
          <AboutMeBox title={Profile.title} description={Profile.about} />
          <WorkExperience jobs={WorkExp} />
          <ProjectsBox projects={Projects} />
        </div>
      </div>
    </div>
  </div>
</BaseLayout>
```

Note the conversion from `className` to `class` on plain HTML elements. React components keep
their existing `className` internals.

The imports above use Vite's directory-index resolution (`components/profile-box` →
`components/profile-box/index.jsx`). If your resolver setup does not do that, use explicit
paths such as `../components/profile-box/index.jsx`.

#### 3.2 `src/pages/projects/index.astro`

Same as the current page, with `class` on DOM elements and `<BaseLayout>` instead of
`<MainLayout>` + `<SEO>`:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro'
import ProjectCard from '../../components/project-card'
import { Profile, Projects } from '../../data'
---
<BaseLayout
  className="ProjectsPage"
  title={`${Profile.name} | Projects`}
  description="Check out these great projects that I have developed"
>
  <div class="container pt-5 pb-5">
    <div class="box">
      <h1 class="title">Projects 🚀</h1>
      <p class="subtitle is-6">
        Explore these builds and reach out if one sparks your next idea.
      </p>
      <div class="columns is-mobile is-multiline">
        {Projects.map((project, index) => (
          <div class="column is-half-desktop is-full-mobile" key={`project-column-${index}`}>
            <ProjectCard
              name={project.name}
              description={project.description}
              stack={project.stack}
              image={project.cover}
              links={project.links}
            />
          </div>
        ))}
      </div>
    </div>
  </div>
</BaseLayout>
```

#### 3.3 `src/pages/projects/[slug].astro`

`getStaticPaths()` replaces `getStaticPaths`/`getStaticProps`/`fallback: false`.

```astro
---
import ProjectLayout from '../../layouts/ProjectLayout.astro'
import { Projects } from '../../data'
import { getProjectData } from '../../utils'

export function getStaticPaths() {
  return Projects
    .filter(({ slug }) => typeof slug === 'string' && slug.trim().length)
    .map(({ slug }) => ({ params: { slug } }))
}

const { slug } = Astro.params
const { project, content } = await getProjectData(slug)
---
<ProjectLayout className="ProjectPage" project={project} content={content} />
```

Refactor `src/utils/getProjectStaticProps.js` → `src/utils/getProjectData.js`:

```js
import { getProjectBySlug } from '../data'
import getProjectContent from './getProjectContent'

const getProjectData = async (slug) => {
  const project = getProjectBySlug(slug)

  if (!project.content) {
    throw new Error(`No markdown content configured for project "${slug}"`)
  }

  const content = await getProjectContent(project.content)
  return { project, content }
}

export default getProjectData
```

Update `src/utils/index.js`. Remove the old `getProjectStaticProps` export.

#### 3.4 `src/pages/privacy.astro`

Port the JSX one-to-one. Use `class` instead of `className`, and add a proper title
(which the current page lacks):

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro'
import { Profile } from '../data'
---
<BaseLayout
  className="PrivacyPage"
  title={`Privacy Policy | ${Profile.name}`}
  description="Privacy policy for luisjcenteno.dev"
>
  <article class="container mt-6">
    <!-- existing copy -->
  </article>
</BaseLayout>
```

While here, decide whether the “Living Company” copy is intentional. If not, replace it.

#### 3.5 `src/pages/404.astro`

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro'
---
<BaseLayout title="Page not found | Luis J. Centeno" description="This page does not exist.">
  <div class="container mt-6">
    <h1 class="title is-1">404</h1>
    <p>This page does not exist.</p>
    <p><a href="/">Go back home</a></p>
  </div>
</BaseLayout>
```

**Acceptance:** `bun run build` produces every route; project pages render the same HTML
content as today.

---

### Phase 4 — Adapt the React components (2–3 h)

All components keep their current folder shape and JSX. Only these edits are required:

#### 4.1 Remove `next/link`

In `profile-box`, `project-card`, `github-button`, and (if kept) `navbar`:

```diff
- import Link from 'next/link'
- <Link href={...} target="_blank">...</Link>
+ <a href={...} target="_blank">...</a>
```

Plain anchors are correct for a static site. Internal links become normal page navigations.

#### 4.2 Replace `html-react-parser` in `project-card`

```diff
- import parse from 'html-react-parser'
- <div className="content">{parse(description || '')}</div>
+ <div
+   className="content"
+   dangerouslySetInnerHTML={{ __html: description || '' }}
+ />
```

Descriptions come from the trusted local `projects.json`. In `ProjectLayout` the HTML is
rendered by Astro's `set:html`, so `html-react-parser` is no longer needed anywhere.

#### 4.3 Remove `React` imports

With Astro's React integration the automatic JSX runtime is used. `import React from 'react'`
can be removed from every component. It is harmless if left in place.

#### 4.4 PropTypes

`prop-types` is currently only a transitive dependency. Choose one:

- **Recommended:** remove all `PropTypes` declarations and the imports (Astro does not use
  them, and they add noise).
- **Minimal change:** `bun add prop-types` so the dependency is explicit.

#### 4.5 Fix `dev-icon` while touching it

```js
const logos = {
  react: <IconBrandReact {...logoProps} />,
  vue: <IconBrandVue {...logoProps} />,
  angular: <IconBrandAngular {...logoProps} />,
  javascript: <IconBrandJavascript {...logoProps} />,
  nodejs: <IconBrandNodejs {...logoProps} />,
  python: <IconBrandPython {...logoProps} />,
  android: <IconBrandAndroid {...logoProps} />,
  apple: <IconBrandApple {...logoProps} />,
  github: <IconBrandGithub {...logoProps} />,
  // add mappings for express / postgres or render a fallback
}
```

Return `null` (not `undefined`) for unknown names. This fixes the missing stack icons.

#### 4.6 Components that need no changes

- `timeline`, `timeline/row`
- `work-experience`
- `projects-box` (optional: change `projects.sort` to `[...projects].sort`)
- `about-me-box` (optional: drop the unused `callToAction` branch, which cannot work
  without hydration)

**Acceptance:** no imports from `next/*`, `html-react-parser`, or `styled-components` remain in
the rendered tree.

---

### Phase 5 — Markdown content and build robustness (1–2 h)

`utils/getProjectContent.js` currently does:

```js
const response = await markdownFetch(contentURL)
const rawContent = await response.text() || ''
const htmlContent = marked(rawContent)
```

Clean it up:

```js
import { marked } from 'marked'

const getProjectContent = async (url) => {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch project content: ${url} (${response.status})`)
  }

  return marked.parse(await response.text())
}

export default getProjectContent
```

- Remove the unused `import { ReactNode } from 'react'`.
- Inline `markdownFetch` or keep it; it is a one-line wrapper.
- `marked.parse()` is the documented API.
- The build now fails loudly instead of silently rendering an empty page if GitHub is down.

**Optional but recommended for reproducible builds:** vendor the READMEs.

```
scripts/fetch-readmes.mjs
  fetch each project.content
  write src/data/readmes/<slug>.md
  build reads local files; fall back to network only if missing
```

This removes a network dependency and rate-limit risk from Docker/CI builds. It can be done in
a follow-up PR if you want to keep the first migration focused.

Security note: `set:html` disables escaping. The markdown comes from your own repositories, so
it is trusted. If that ever changes, sanitize the HTML.

---

### Phase 6 — Replace the Next build pipeline (1 h)

#### 6.1 Sitemap

`astro.config.mjs` already registers `sitemap()` and sets `site`. It emits:

```
dist/sitemap-index.xml
dist/sitemap-0.xml
```

Add `src/pages/robots.txt.ts`:

```ts
import type { APIRoute } from 'astro'

export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL('https://luisjcenteno.dev')
  const sitemap = new URL('sitemap-index.xml', base)

  return new Response(
    `User-agent: *\nAllow: /\n\nSitemap: ${sitemap.href}\n`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
  )
}
```

This replaces `next-sitemap.config.js`. If you want to keep the old `/sitemap.xml` URL working,
add an Nginx redirect (see Phase 7) or accept the new filename and update Search Console.

#### 6.2 Remove Next-only config and dependencies

```sh
bun remove next next-sitemap styled-components html-react-parser eslint-config-next
bun remove prop-types   # only if you removed PropTypes declarations
```

Then:

```sh
bun install
```

Remove files:

```
next.config.js
next-sitemap.config.js
src/legacy-pages/
src/hooks/
```

Remove `NEXT_PUBLIC_SITE_URL` references from the README. Use `SITE_URL` for the Astro config.

Expected final dependency shape (versions resolved by Bun):

```json
{
  "dependencies": {
    "@astrojs/react": "latest compatible",
    "@astrojs/sitemap": "latest compatible",
    "@tabler/icons-react": "^3",
    "astro": "^7",
    "bulma": "^0.9.4",
    "marked": "^12",
    "react": "^19",
    "react-dom": "^19",
    "sass": "^1.70"
  },
  "devDependencies": {
    "@astrojs/check": "latest",
    "eslint": "^9",
    "eslint-plugin-astro": "latest",
    "typescript": "latest"
  }
}
```

`sass` 1.70 works today; if the Astro/Vite version in use complains about the legacy Sass API,
upgrade `sass` and expect deprecation warnings from Bulma 0.9's `@import` usage (warnings only,
not build failures).

#### 6.3 Lint

The current `eslint.config.mjs` extends `eslint-config-next`. Replace it with Astro support:

```sh
bun add -d eslint-plugin-astro
```

```js
import js from '@eslint/js'
import astro from 'eslint-plugin-astro'

export default [
  js.configs.recommended,
  ...astro.configs.recommended,
  {
    ignores: ['dist/**', '.astro/**', 'node_modules/**'],
  },
]
```

If linting is not actively used, dropping the config is also acceptable; do not leave a config
that depends on a removed package.

**Acceptance:** `bun run build` uses only Astro, generates sitemap + robots, and has no Next
imports.

---

### Phase 7 — Deployment (Docker + Nginx) (1–2 h)

#### 7.1 Dockerfile

```diff
 FROM deps AS builder
 COPY . .
 RUN bun run build

 FROM nginx:alpine AS runner
 WORKDIR /usr/share/nginx/html
-COPY --from=builder /app/out .
+COPY --from=builder /app/dist .
 COPY nginx/default.conf /etc/nginx/conf.d/default.conf
```

#### 7.2 `.dockerignore`

Add Astro output/cache:

```gitignore
dist
.astro
```

#### 7.3 `nginx/default.conf`

Required changes:

```diff
- location = /projects {
-     try_files /projects.html =404;
- }
-
- location = /projects/ {
-     try_files /projects.html =404;
- }
-
 location / {
-     try_files $uri.html $uri $uri/index.html =404;
+     try_files $uri $uri.html $uri/ =404;
 }

-location ~* ^/_next/static/.+\.(?:js|css|woff2?|ttf|eot|otf)$ {
+location /_astro/ {
     access_log off;
     expires 1y;
     add_header Cache-Control "public, max-age=31536000, immutable" always;
     try_files $uri =404;
 }
```

Also add a real 404 handler (currently missing):

```nginx
error_page 404 /404.html;
```

and optionally, to preserve the old sitemap URL:

```nginx
location = /sitemap.xml {
    return 301 /sitemap-index.xml;
}
```

Notes:

- `try_files $uri $uri.html $uri/` supports both directory output (`/projects/index.html`)
  and file output if you later change `build.format`.
- `index index.html;` is already present, so `$uri/` serves directory indexes.
- Keep the existing gzip, dotfile, PHP/WordPress, and security-header rules.
- Keep the generic asset-cache rule; prefix `location /_astro/` takes precedence.
- Verify that `/404.html` is not caught by the long-cache rule — the existing `.html`
  no-cache rule covers it.

#### 7.4 Smoke test locally

```sh
bun run build
docker build -t luisjcenteno/portfolio:astro .
docker run --rm -p 8080:80 luisjcenteno/portfolio:astro
```

```sh
curl -I http://localhost:8080/
curl -I http://localhost:8080/projects
curl -I http://localhost:8080/projects/adm2
curl -I http://localhost:8080/privacy
curl -I http://localhost:8080/does-not-exist
curl -I http://localhost:8080/_astro/<some-built-file>.css
```

Check:

- `200` for all known routes (with and without trailing slash).
- `404` returns the custom `404.html` body.
- `_astro/*` returns `Cache-Control: public, max-age=31536000, immutable`.
- HTML returns `no-cache`.
- `robots.txt` references the Astro sitemap index.
- Security headers still present.
- gzip works for HTML/CSS/JS/XML.

**Acceptance:** the container serves the same visual site and all headers/routes are correct.

---

### Phase 8 — Cleanup and validation (1 h)

1. Search for leftovers:
   ```sh
   rg -n "next/|_next|styled-components|html-react-parser|getStaticProps|next-sitemap" \
     --glob '!ASTRO_MIGRATION_PLAN.md' --glob '!bun.lock'
   ```
2. Remove unused files: `hooks/`, `public/vercel.svg`, stale `.vscode/tasks.json` (it runs
   Jekyll), and the root `.nojekyll` unless you deploy to GitHub Pages.
3. If deploying to GitHub Pages, move `.nojekyll` into `public/` and set `base` in
   `astro.config.mjs` if the site is not served from the domain root. Because `projects.json`
   contains root-absolute `/images/...` paths, a non-root `base` requires updating those paths.
4. Update `README.md`:
   - Astro instead of Next
   - `dist/` instead of `out/`
   - `bun run dev` (port 4321) and `bun run preview`
   - sitemap is generated by Astro
   - `SITE_URL` instead of `NEXT_PUBLIC_SITE_URL`
5. Update `.vscode/tasks.json` to a `bun run dev` task or delete it.
6. Run lint/build:
   ```sh
   bun run lint
   bun run build
   ```
7. Final visual check:
   - `/` profile sidebar sticky on desktop; scroll area works
   - mobile column layout
   - project grid images/cards
   - project README rendering: headings, lists, code blocks, links, cover
   - navbar burger open/close on mobile, `aria-expanded` updates
   - Umami request fires and `data-umami-event` attributes survive
   - sitemap/robots/canonical/OG values
8. Compare Lighthouse against the baseline. Expect:
   - similar or better LCP/CLS
   - significantly less JavaScript (React/Next runtime removed)
   - no hydration warnings

---

## 5. Acceptance checklist

- [ ] `bun run dev` serves all routes at `http://localhost:4321`
- [ ] `bun run build` completes without Next.js
- [ ] `dist/` contains `/`, `/projects`, 5 project pages, `/privacy`, `404.html`,
      `robots.txt`, sitemap files
- [ ] Project markdown renders identically (headings, lists, code, links)
- [ ] No `next/*` imports remain
- [ ] No React JS is shipped to the browser (unless the React navbar fallback is chosen)
- [ ] Mobile navigation works and updates `aria-expanded`
- [ ] Umami analytics loads and page/event tracking still works
- [ ] Title, description, OG, Twitter, canonical tags are correct and absolute
- [ ] `sitemap-index.xml`, `sitemap-0.xml`, and `robots.txt` are reachable
- [ ] Nginx serves `/_astro/*` with immutable caching and HTML with `no-cache`
- [ ] Unknown URLs return the custom 404 page
- [ ] Docker image builds and serves the site
- [ ] README and environment-variable docs are updated

---

## 6. Risks and gotchas

| Risk | Impact | Mitigation |
| --- | --- | --- |
| SCSS variables unresolved | Page styles break | Keep one `globals.scss` import; do not split partials into Astro scoped styles |
| Bulma 0.9 uses deprecated Sass `@import` | Warnings; future breakage | Keep `sass` pinned for the migration; plan Bulma 1.x/`@use` later |
| Remote README fetch fails during Docker build | Build failure or empty content | Add status checks; optionally vendor READMEs locally |
| React event handlers silently do nothing | Broken UI after migration | Audit `onClick`/`useState`; only navbar was interactive |
| `className` in `.astro` files | Attributes render literally / styles missing | Use `class` on DOM elements; `className` only as a component prop |
| Trailing-slash policy mismatch | Duplicate URLs/redirects | Set `trailingSlash` once; keep links canonical; verify sitemap |
| Sitemap filename changes | Search Console/old links | Add `/sitemap.xml` → `/sitemap-index.xml` redirect |
| `set:html` bypasses escaping | XSS if content source changes | Trusted repo READMEs; sanitize if user-generated |
| `prop-types` only transitive | Breaks after dependency cleanup | Remove declarations or add the package explicitly |
| Nginx `_next` cache rule | Astro assets not cached | Replace with `/_astro/` |
| Docker copies wrong folder | Empty container | `out` → `dist` in Dockerfile |
| GitHub Pages/subpath deploy | Root-absolute asset URLs break | Set `base` and update `/images/...` paths; move `.nojekyll` to `public/` |
| Astro 7 / `@astrojs/react` version mismatch | Build errors | Install latest with `bun add`, do not hand-pin old versions |
| Node/Bun version | Astro 7 requires Node >= 22.23.4 | Node 24 and Bun 1.4.4 are already available |

---

## 7. Effort estimate

| Phase | Work | Estimate |
| --- | --- | --- |
| 0 | Baseline | 0.5–1 h |
| 1 | Scaffold + move files | 1–2 h |
| 2 | Layouts + SEO + navbar | 2–3 h |
| 3 | Pages + dynamic routes | 3–4 h |
| 4 | React component edits | 2–3 h |
| 5 | Markdown/build robustness | 1–2 h |
| 6 | Build pipeline + cleanup deps | 1 h |
| 7 | Docker/Nginx | 1–2 h |
| 8 | QA + README | 1 h |
| **Total** | | **~1.5–2.5 working days** |

For a focused first pass (reuse React components, Astro navbar, Docker/Nginx updates, no README
vendoring or full component conversion), **1–1.5 days** is realistic.

---

## 8. Suggested commit sequence

1. `chore: scaffold astro and move source into src/`
2. `feat: add BaseLayout, ProjectLayout, and SEO head`
3. `feat: migrate home, projects, project detail, privacy, and 404 pages`
4. `refactor: remove next/link and html-react-parser from React components`
5. `feat: rewrite navbar as Astro component`
6. `chore: replace next-sitemap with @astrojs/sitemap and robots endpoint`
7. `chore: update docker and nginx for astro dist output`
8. `chore: remove next dependencies and dead code`
9. `docs: update README for astro`

Keeping these separable makes it easy to review and to bisect any visual regression.

---

## 9. Optional follow-up: drop React entirely

After the site is stable, the presentational components can be rewritten as `.astro`
components. At that point:

- `@astrojs/react`, `react`, and `react-dom` can be removed.
- `@tabler/icons-react` can be replaced with inline SVGs or `@tabler/icons`.
- The only browser JS left is the navbar toggle (or it can be replaced with a CSS-only menu).
- Build time and dependency count drop further.

This is a “nice to have”, not a requirement of the migration, and should be a separate PR.
