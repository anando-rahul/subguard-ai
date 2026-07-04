# SubGuardAI Landing and Authenticated Dashboard Plan

## 1. Objective

Replace the current protected `/` placeholder with:

- A public, responsive SubGuardAI landing page at `/`.
- A protected authenticated dashboard at `/dashboard`.
- Correct login, registration, and logout redirects.
- A consistent light-green visual system based only on `@repo/ui` primitives and semantic global color tokens.

This document is the implementation plan only. It does not authorize application-code changes, dependency installation, generated assets, or test execution.

## 2. Design read

Reading this as: a consumer SaaS landing page and subscription-control dashboard for cost-conscious Indonesian users, with a calm, clear, light-green trust-first language built on the existing Tailwind and `@repo/ui` system.

- `DESIGN_VARIANCE: 6`
  - The landing page uses an asymmetric hero and varied section structures.
  - The dashboard uses a more predictable application layout.
- `MOTION_INTENSITY: 3`
  - Use existing hover, focus, active, and transition behavior from `@repo/ui`.
  - Do not add Motion, GSAP, scroll listeners, marquees, parallax, or decorative animation.
- `VISUAL_DENSITY: 5`
  - The landing page remains spacious.
  - The dashboard keeps key financial information visible without becoming crowded.

## 3. Current-state audit

### Route and behavior gaps

- `apps/platform/src/routes/index.tsx` currently protects `/` and renders only account-session data.
- The PRD requires `/` to be public and `/dashboard` to be protected.
- Login and registration currently navigate to `/` instead of `/dashboard`.
- Logout currently navigates to `/login` instead of the public landing page.
- Login and registration routes do not yet redirect an authenticated user to `/dashboard`.
- The root layout labels the product as `Platform` and always displays a dashboard link.
- The root layout constrains every route to the same narrow content container, which prevents a full landing-page composition.

### Product-data gaps

- The repository currently contains authentication and session APIs only.
- Dashboard summary, upcoming billing, subscription CRUD, reminder, AI review, and premium-interest clients are not present.
- The dashboard must not display invented totals, subscription rows, renewal dates, or AI results.
- Any CTA must point to a route that exists when the CTA ships. No placeholder links or dead buttons.

### Visual-system gaps

- Global semantic tokens are neutral grayscale.
- The platform has no SubGuardAI-specific color override.
- Existing `@repo/ui` primitives already cover the required button, card, alert, empty, item, skeleton, tabs, dialog, separator, badge, and aspect-ratio patterns.
- No new component library or icon package is needed.

## 4. Non-negotiable implementation constraints

- Import visual primitives only from `@repo/ui`.
- Use semantic HTML for page structure, headings, paragraphs, lists, navigation, and images.
- Do not import another component system, icon library, animation library, or styling library.
- Do not create local replacements for primitives that already exist in `@repo/ui`.
- Compose page-specific sections from `@repo/ui` primitives instead of adding one-off primitives to the platform app.
- Do not use arbitrary Tailwind utilities in platform code. This includes arbitrary colors, sizes, grid definitions, shadows, radii, z-indexes, and transition values.
- Use standard utilities such as `max-w-7xl`, `grid-cols-1`, `md:grid-cols-2`, `xl:grid-cols-4`, `rounded-xl`, `gap-6`, and semantic color utilities.
- Put all product color changes in `apps/platform/src/styles.css`, which is already imported globally after `@repo/ui/styles.css`.
- Do not change `packages/ui/src/styles.css` for this product theme because that would also recolor the admin application.
- Do not add inline hex, RGB, HSL, or OKLCH values to TSX files.
- Do not hand-edit `routeTree.gen.ts`; let the TanStack Router plugin regenerate it during the later implementation phase.
- Use no em-dash or en-dash characters in visible product copy.
- Use one green accent family throughout the landing page, auth shell, and dashboard.
- Keep the documented shape rule: cards use `rounded-xl`, controls use the primitive default `rounded-md`, and badges remain pill-shaped.

## 5. Global visual system

### Token strategy

Override the existing semantic variables in `apps/platform/src/styles.css` rather than styling individual elements with colors:

- `--background`: very pale green-tinted neutral.
- `--foreground`: deep forest neutral with sufficient contrast.
- `--card` and `--popover`: near-white green-tinted surfaces.
- `--primary`: deep leaf green suitable for CTA backgrounds.
- `--primary-foreground`: near-white with WCAG AA contrast.
- `--secondary`, `--muted`, and `--accent`: progressively stronger pale-green surfaces.
- `--border` and `--input`: quiet green-gray separators.
- `--ring`: visible medium green focus indicator.
- Chart tokens: one green family plus restrained supporting colors for later dashboard charts.

The primary presentation remains light green. Keep compatible `.dark` token overrides in the same global file so the existing dark-class architecture does not regress, but do not add a theme toggle in this scope.

### Typography and layout

- Keep the existing project font stack. Do not add a remote font dependency during this scope.
- Use a two-line maximum hero headline on desktop.
- Keep the supplied 20-word subheadline unchanged unless product copy is explicitly revised.
- Keep the desktop navigation to one line and at the existing `h-16` height.
- Use `min-h-dvh` for full-height application shells. Do not use `h-screen`.
- Use standard responsive grids. Every multi-column section must collapse to one column below `md`.

### Accessibility

- Maintain visible keyboard focus through semantic token-based focus rings.
- Verify WCAG AA contrast for body text, controls, badges, alerts, placeholders, and disabled states.
- Preserve heading order with one `h1` per route.
- Give the hero image meaningful alt text and explicit intrinsic dimensions.
- Ensure all CTA labels remain on one line.
- Use alerts for contextual data errors and toasts only for transient mutation outcomes.

## 6. Route and authentication architecture

### Public landing route

Refactor `apps/platform/src/routes/index.tsx`:

- Remove the blocking `beforeLoad` authentication requirement.
- Render static landing content without requiring the API.
- Optionally perform a non-blocking session query only to change `Register Free` to `Open Dashboard` for authenticated users.
- Never block or hide landing content when the session API is unavailable.
- Never fetch subscriptions or other private product data from this route.

### Protected dashboard route

Create `apps/platform/src/routes/dashboard.tsx`:

- Move the existing `meQueryOptions` authorization guard to `/dashboard`.
- Redirect unauthorized users to `/login`.
- Render the authenticated dashboard and retain the logout mutation.
- Keep the session query as the source of authenticated user identity.

### Auth redirects

Update `apps/platform/src/modules/auth/hooks/use-auth.ts`:

- Successful login navigates to `/dashboard`.
- Successful registration navigates to `/dashboard`.
- Successful logout removes cached auth data and navigates to `/`.

Update `login.tsx` and `register.tsx`:

- Add a public-only route guard.
- Redirect an already authenticated user to `/dashboard`.
- Preserve existing loading, validation, and generic error behavior.

### Shared root layout

Refactor `apps/platform/src/routes/__root.tsx`:

- Change the product name from `Platform` to `SubGuardAI`.
- Remove the global `max-w-6xl` restriction from `<main>` so each route owns its layout width and padding.
- Keep one shared header using `Button`, `Link`, and `LanguageSwitcher`.
- Public header actions: `Login` and `Register Free`.
- Authenticated header actions: `Dashboard`, account identity, and `Logout`.
- Keep the header useful if the session API fails by falling back to public navigation.
- Avoid duplicating navigation inside the landing page.

## 7. Landing page composition

Implement the following sections in `index.tsx`. Extract a local section component only when it reduces repetition or isolates a clear responsibility. All visual controls must come from `@repo/ui`.

### 7.1 Hero

Layout:

- Use an asymmetric two-column layout at `lg` and one column on smaller screens.
- Left side: headline, 20-word subheadline, and at most two CTAs.
- Primary CTA: `Register Free`, or `Open Dashboard` when a session is available.
- Secondary CTA: `Login` for visitors.
- Keep both CTAs above the initial desktop fold.

Visual:

- Use a real screenshot of the implemented dashboard, not a div-based fake dashboard.
- Place the screenshot in the `AspectRatio` and `Card` primitives.
- Capture or generate the asset only after the dashboard layout exists.
- Do not use a gradient blob, hand-rolled SVG illustration, stock finance photo, or overlaid label.

### 7.2 Value proposition

- Present exactly three benefits from the PRD in an asymmetric three-cell composition.
- Give `Track recurring costs` the dominant cell.
- Use smaller supporting cells for billing reminders and AI-assisted review.
- Use `Card`, `CardHeader`, `CardContent`, and `Badge` only where the hierarchy is meaningful.
- Avoid three equal cards and avoid invented statistics.

### 7.3 How it works

- Use the four real action labels as headings: `Add subscriptions`, `See your cost`, `Review suggestions`, and `Mark candidates`.
- Do not add generic `Step 1` labels or section numbering.
- Use `Item` composition and restrained separators rather than four identical cards.
- On mobile, stack the actions in reading order.

### 7.4 Audience fit

- Use `Tabs` to present young professionals, families, and freelancers or remote workers without repeating the card layout.
- Each tab should connect one real user problem to one product outcome.
- Do not use fictional testimonials, avatars, logos, or adoption numbers.

### 7.5 Premium teaser

- Use one tinted `Card` near the end of the page.
- Required copy: `Premium AI Review and smarter reminders are coming soon.`
- Do not include a waitlist CTA until the premium-interest endpoint and dialog submission behavior exist.
- If the premium fake-door feature is implemented in the same later scope, use the existing `Dialog` primitive and record the required analytics event.

### 7.6 Footer

- Show `SubGuardAI` and the required privacy disclaimer.
- Keep the footer compact and inside the same light-green theme.
- Do not add version labels, build metadata, locale strips, decorative status dots, or unsupported legal claims.

## 8. Authenticated dashboard composition

The dashboard skill rules differ from marketing-page rules. Prioritize scannability, data integrity, loading states, and clear actions over landing-page asymmetry.

### 8.1 Immediate dashboard state

This state can ship before subscription APIs exist:

- Welcome heading using the authenticated user name when available, otherwise email.
- Short explanation of the core loop.
- Account-session summary using the existing real session data.
- Honest onboarding `Empty` state explaining that subscription tracking is the next product action.
- Do not show zero-valued financial summary cards unless a real summary response confirms zero.
- Do not show `Add Subscription`, `AI Review`, or premium buttons until their target route or action exists.

### 8.2 Data-connected dashboard state

Implement after the PRD dashboard and subscription endpoints exist:

- Featured monthly-spend and estimated-savings cards.
- Supporting yearly-spend, active-count, trial-count, and candidate-count cards.
- Use an asymmetric `md:grid-cols-2 xl:grid-cols-4` composition, with the two primary financial metrics receiving more area.
- Upcoming billing list sorted by nearest date.
- `Alert` for payments due within seven days.
- Subscription overview linking to the real `/subscriptions` route.
- `AI Review` CTA linking to the real `/ai-review` route only when at least three active or trial subscriptions exist.
- `Add Subscription` CTA linking to `/subscriptions/new` only when that route exists.
- Premium CTA opens the real premium-interest dialog only after its endpoint is available.

### 8.3 Full state model

- Loading: layout-matched `Skeleton` blocks for summary and billing areas.
- Empty: `Empty` primitive with PRD copy and a valid add-subscription action.
- Partial data: render available summary information and isolate the failed section.
- Error: `Alert` with retry action when supported.
- Due soon: semantic alert styling, not a decorative colored dot.
- Cancelled subscriptions: never included in active spend or upcoming billing.
- API unavailable: never replace missing data with sample values.

## 9. Internationalization plan

Update `apps/platform/src/i18n.ts` for English and Bahasa Indonesia:

- Rename the brand from `Platform` to `SubGuardAI`.
- Add landing navigation, hero, benefit, process, audience, premium, footer, and accessibility strings.
- Replace placeholder dashboard copy with product-specific dashboard strings.
- Add dashboard loading, empty, error, reminder, and action labels.
- Keep CTA intent consistent. Use one registration label and one login label throughout each locale.
- Keep all visible copy free of em-dash and en-dash characters.
- Extend `apps/platform/src/i18n.test.ts` with representative keys for both languages.

## 10. Planned file changes

| File | Planned change |
|---|---|
| `apps/platform/src/routes/index.tsx` | Replace protected session page with the public landing page. |
| `apps/platform/src/routes/dashboard.tsx` | Add the protected authenticated dashboard and move the session guard here. |
| `apps/platform/src/routes/__root.tsx` | Add the SubGuardAI shell, route-aware navigation, and route-owned content width. |
| `apps/platform/src/routes/login.tsx` | Add authenticated-user redirect and align route behavior with the PRD. |
| `apps/platform/src/routes/register.tsx` | Add authenticated-user redirect and align route behavior with the PRD. |
| `apps/platform/src/modules/auth/hooks/use-auth.ts` | Correct login, registration, and logout destinations. |
| `apps/platform/src/i18n.ts` | Add English and Indonesian landing and dashboard copy. |
| `apps/platform/src/i18n.test.ts` | Cover critical navigation, landing, and dashboard translations. |
| `apps/platform/src/styles.css` | Define platform-scoped light-green semantic token overrides. |
| `apps/platform/src/routeTree.gen.ts` | Regenerated by tooling only, never manually edited. |
| `apps/platform/public/...` | Add the optimized real dashboard screenshot after dashboard implementation. |

No change is planned for `packages/ui` unless implementation proves a genuinely reusable primitive is missing. Existing user changes outside this file list must remain untouched.

## 11. Implementation sequence

1. Add platform-scoped semantic color tokens and confirm all planned styles can use standard utilities.
2. Split `/` and `/dashboard`, then correct authentication redirects.
3. Refactor the shared shell so route pages control their own containers.
4. Build the immediate authenticated dashboard with real session data and honest non-data state.
5. Capture and optimize the real dashboard screenshot for the hero.
6. Build the public landing sections with the screenshot and PRD copy.
7. Add complete English and Indonesian translations.
8. Add dashboard data services only when the corresponding backend endpoints exist.
9. Add loading, empty, partial-error, and full-data dashboard states.
10. Regenerate the route tree and perform the verification matrix.

## 12. Verification matrix for the later implementation

### Routing and behavior

- [ ] `/` renders without authentication and without waiting for the API.
- [ ] `/dashboard` redirects an unauthenticated user to `/login`.
- [ ] Successful login and registration navigate to `/dashboard`.
- [ ] Logout navigates to `/` and clears cached auth data.
- [ ] Authenticated users visiting login or registration are redirected to `/dashboard`.
- [ ] Every visible CTA has a valid route or working action.
- [ ] Landing failure isolation works when the API is unavailable.

### Responsive layout

- [ ] Header remains one line at desktop sizes.
- [ ] Hero headline remains at most two lines on desktop.
- [ ] Hero subheadline remains at most 20 words and four lines.
- [ ] Primary CTA is visible in the initial desktop viewport.
- [ ] Every multi-column section has an explicit single-column mobile layout.
- [ ] No horizontal overflow appears at common mobile widths.

### Design and constraints

- [ ] All imported visual primitives come from `@repo/ui`.
- [ ] No arbitrary Tailwind utility appears in platform TSX.
- [ ] No color value appears in platform TSX.
- [ ] All palette values live in the global platform stylesheet.
- [ ] One green accent family is used across every section.
- [ ] Radius rules remain consistent.
- [ ] No equal three-card feature row is used.
- [ ] No fake dashboard, fake metric, fake testimonial, or decorative stock claim is used.
- [ ] No em-dash or en-dash appears in visible copy.
- [ ] No dead CTA, decorative status dot, scroll cue, version label, or locale strip appears.

### Accessibility and quality

- [ ] Keyboard focus is visible on all interactive elements.
- [ ] Text and control contrast pass WCAG AA.
- [ ] Heading order, landmarks, labels, and image alt text are valid.
- [ ] Loading, empty, partial-error, and error states are usable.
- [ ] Dashboard values always come from real API responses.
- [ ] Typecheck, translation tests, route tests, and production build pass.
- [ ] Browser verification covers English and Indonesian at mobile and desktop widths.
- [ ] Landing LCP, CLS, and interaction behavior are checked after the real hero image is added.

## 13. Completion boundary

The landing and authenticated dashboard redesign is complete only when:

- Public and protected routes match the PRD.
- Auth redirects are correct.
- The landing page communicates the product value within the first viewport.
- The post-authentication page provides a credible onboarding or real-data dashboard state.
- No dashboard metric is fabricated.
- No CTA points to an unimplemented destination.
- The implementation follows the `@repo/ui`, semantic-token, and no-arbitrary-value constraints.
- Both supported languages and all required interaction states are verified.

