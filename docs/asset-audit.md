# Asset audit

Goal: walk every image in `src/assets/images/` and tag it
**KEEP** / **REPLACE** / **DELETE**, so we know exactly what survives the
move into `apps/web/public/images/` and `packages/ui/assets/`.

## Tag definitions

- **KEEP** — real Estación 33 asset, ships in v1 as-is.
- **REPLACE** — concept is needed, but the file is generic Swigo stock and
  needs to be reshot / redrawn for Estación 33.
- **DELETE** — concept doesn't exist in Estación 33's product (e.g. blog,
  team headshots, generic restaurant testimonials). Goes nowhere.

This is a **working doc**: the owner / designer fills in the third column
during Phase 1.5. Defaults below are my best guesses and need review.

## Branding (root)

| File | Default | Notes |
|---|---|---|
| `logo.png` | KEEP? | Confirm this is the real Estación 33 logo, not Swigo's. |
| `logo2.png` | KEEP? | Likely the alternate (light-on-dark or vice versa). |
| `logo-old.png`, `logo2-old.png` | DELETE | Pre-rebrand artifacts. |
| `favicon.png` | KEEP | Already used in `index.html`. |
| `loading.gif` | DELETE | Replace with a Lottie spinner from `@aldowebsitellc/ui`. |
| `pan1.png`, `pan2.png` | DELETE | Decorative pan illustrations from Swigo. |
| `like.png`, `ribbon.png`, `rounded.png`, `pic1.png` | DELETE | Generic template ornaments. |
| `adv-media.jpg` | DELETE | Template ad mock. |

## `menu-small/` — 15 food photos

These are the most important to audit. The owner has real product photos
(boneless tray, burger combo, Texas burger, ensalada bowl) visible in the
menu image — those become the canonical product photography.

| File | Default | Notes |
|---|---|---|
| `pic1.png` … `pic15.png` | REPLACE | Template stock burger/fries photos. Need real photos of: Boneless, Aros, Papas a la Francesa, Papas Locas, Papas Demon, Clásica, Americana, Hawaiana, Doble Burger, each Las Creativas item, Pollo items, Ensalada, each Italianísimos pasta. ~25 product shots total. |

## `gallery/` (small, grid, grid2..grid5) — ~40+ photos

| Default | Notes |
|---|---|
| REPLACE | Atmosphere/restaurant shots of the actual Plan de Iguala location: storefront, dining area, kitchen action, "el carbón está hirviente", staff making food. Reshoot. |

## `main-slider/slider1..3/` — hero shots

| Default | Notes |
|---|---|
| REPLACE | Hero photography for the home page. Plan ~3 hero shots: signature burger close-up, boneless tray, dining-room mood. |

## `team/` (12 + detail)

| Default | Notes |
|---|---|
| DELETE | No "team" page in v1 product scope. If owner wants an "About / Nuestra historia" page, one or two real staff photos suffice — not 12 stock headshots. |

## `testimonial/` (small, large, mini)

| Default | Notes |
|---|---|
| DELETE | Template stock customers. v1 testimonials, if any, come from real Google/social reviews — not embedded photos. |

## `blog/` (grid, grid2, grid3, large, detail, recent-blog)

| Default | Notes |
|---|---|
| DELETE | No blog in v1 scope. |

## `background/` — 21 PNG/JPG textures

| Default | Notes |
|---|---|
| Mostly DELETE | The new design system uses solid color tokens + photography, not textured PNG backgrounds. **KEEP** at most 1-2 if the owner specifically wants a textured "rustic" look on a CTA section. |

## `banner/`, `slider1/`, `adv/`, `modal/`, `shop/`, `faq/`, `switcher/`

| Default | Notes |
|---|---|
| DELETE | All template-only. `shop/` is unrelated e-commerce (shoes/accessories), `switcher/` is the template's theme-switcher demo, `faq/`, `modal/`, `adv/` are decorative. |

## Icon sets in `src/assets/icons/`

| Set | Default | Notes |
|---|---|---|
| Font Awesome | KEEP | Wide icon use across web + mobile; replace with `lucide-react` / `@expo/vector-icons` (Lucide) for a lighter, more consistent look. |
| Line Awesome | DELETE | Redundant once Lucide is in. |
| Themify Icons | DELETE | Redundant. |
| Flaticon (Swigo set) | DELETE | Template-specific. |
| Feather Icons | DELETE | Lucide is a superset. |

## Photography brief for the reshoot (per `REPLACE`)

When the owner schedules a photo session, target:

1. **Product shots** — one per menu item, ~25 hero + 25 thumbnail crops,
   neutral background, top-down or 3/4 angle.
2. **Atmosphere** — storefront sign at dusk, grill in action, dining
   area, hands-on-burger close-up.
3. **Brand** — logo on signage / packaging, takeout bag.

Style: warm tones, charcoal/grill cues, no over-stylized food blog
filters. Match the punchy yellow + black aesthetic of the printed menu.

## Output of this audit

When complete, this doc tells Phase 2 exactly which files to copy from
`legacy_aldowebsitellc/src/assets/images/` into:

- `apps/web/public/images/products/...`
- `apps/web/public/images/atmosphere/...`
- `apps/web/public/images/brand/...`
- `packages/ui/assets/...` (only icons + logos shared with mobile)

Everything else stays inside `legacy_aldowebsitellc/` until that folder
is deleted at the end of Phase 4.
