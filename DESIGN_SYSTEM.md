# Acurat v2 — Design System (derived from the existing HTML)

**Rule #1: Do not invent.** Every new element must reuse a pattern, color, size, and radius that already exists below (or in the HTML pages). If something genuinely has no precedent, copy the closest existing pattern and say so — never introduce new colors, fonts, radii, shadows, or component styles.

Source of truth: `assets/acurat.css` (shell), `assets/acurat.js` (behaviour), plus inline styles in the 14 pages. When in doubt, open the closest page and copy its markup.

---

## 1. Page skeleton (copy exactly)

Every page has the same `<head>` and boot structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>John E Smith — Overview</title>   <!-- "<Entity> — <Section>" -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
body{margin:0;background:#F8FAFC;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
a{color:#2F7D3B}a:hover{color:#1F5A29}
button{font-family:inherit;cursor:pointer}
input{font-family:inherit}
.tbl-scroll{overflow-x:auto}
.row-link::after{content:"";position:absolute;inset:0}
.crow{cursor:pointer;transition:background .15s}
.crow:hover{background:#F8FAFC}
.row-link:focus-visible{outline:2px solid #2F7D3B;outline-offset:2px}
@media (min-width:1200px){.tbl-scroll{overflow:visible}}
/* + details.grp / .msg-shell / .v2-banner helpers as in other pages */
</style>
<link rel="stylesheet" href="assets/acurat.css">
</head>
<body data-ctx="list|work" [data-focusable]>
<script>/* rail + focus boot snippet — copy verbatim from any page */</script>
<div class="app">
  <nav class="rail" aria-label="Main">…</nav>      <!-- identical on every page -->
  <main …>…</main>
</div>
<script src="assets/acurat.js"></script>
</body>
</html>
```

- `data-ctx="list"` → top-level list pages (`index.html`, `engagements.html`); rail is wide by default.
- `data-ctx="work"` → client (`smith-*`) and engagement (`engagement-*`) pages; rail is slim by default.
- `data-focusable` → only on engagement pages (enables Focus mode, key **F**, exit **Esc**).
- Styling approach: **shell = classes from acurat.css; page content = inline `style=""` attributes** with the exact values below. Only complex tool pages (e.g. Binder) define a local `<style>` block of classes.

---

## 2. Color tokens

### Core (from `:root` in acurat.css)
| Token | Hex | Use |
|---|---|---|
| `--ink` | `#111827` | Primary text, titles, values |
| `--ink-2` | `#475569` | Secondary text, inactive tabs |
| `--ink-3` | `#64748B` | Muted/meta text, labels, icons (**most used color**) |
| `--line` | `#E5E7EB` | Card/input/button borders |
| `--line-2` | `#F0F1F3` | Row dividers inside cards |
| `--brand` | `#2F7D3B` | Primary buttons, links, active rail item, avatars, checkmarks |
| `--brand-ink` | `#1F6A2E` | Text on brand-soft / outline-button text |
| `--brand-soft` | `#E3F1E5` | Brand tag / selected pill background |
| `--brand-tint` | `#F2F8F3` | Hover on outline buttons, selected list row |
| `--rail` | `#07140F` | Sidebar bg |
| `--rail-2` / `--rail-3` | `#10261D` / `#1A3A2D` | Sidebar hover / borders |
| `--rail-ink` / `--rail-mute` | `#D3E8DC` / `#9FC6B1` | Sidebar text / section labels |

### Neutrals
- Page bg `#F8FAFC` · card bg `#FFFFFF` · hover row `#F8FAFC`
- Table header bg `#E9EEF4`, header text `#4B5563`
- Neutral chip bg `#EEF1F4` / `#F1F5F9`, chip text `#334155`, chip border `#E2E8F0`
- Empty meter / progress track `#E2E8F0`
- Icon/button text `#374151`; dropdown chevron stroke `#6B7280`
- Headings h1 color `#0B1220`
- Hover link darker green `#1F5A29`; solid button hover `#286C33`

### Semantic tones (bg / border / text)
| Tone | Background | Border | Text | Used for |
|---|---|---|---|---|
| Success | `#F0FDF4` | `#BBF7D0` | `#15803D` | Signed, Ready to view |
| Warning (orange) | `#FFF7ED` | `#FED7AA` | `#B45309` | Awaiting upload/signature, Extended, due dates |
| Info (blue) | `#EFF6FF` | `#BFDBFE` | `#1D4ED8` | CPA portal, Waiting on spouse, info notices |
| Neutral | `#F8FAFC` | `#E2E8F0` | `#334155` | Sent, Closed |
| Danger | `#FAD4D4` / `#FEE2E2` | — | `#B42318` / `#B91C1C` | Unread count, Overdue, alert tab count |
| CPA-only badge | `#FFF4E5` | — | `#9A3412` | "CPA ONLY" label (11px, 700, uppercase) |
| "Up next" callout | `#FFF8EF` | `#F5D9B8` | label `#9A3412` | Next-action card |
| Amber notice (`.xcheck`) | `#FFFBEB` | `#FDE68A` | `#78350F` | Cross-check warnings |
| In-progress step | — | `#C2410C` (2px ring) | `#C2410C` | Current/blocked timeline step |

Text-only status colors: warn `#B45309`, success `#1F6A2E`, neutral `#475569`, alert `#C2410C`.

### Person / entity avatar palette (bg / border / text)
| | bg | border | text |
|---|---|---|---|
| Indigo | `#ECEBFD` | `#C4C0F4` | `#4338CA` |
| Pink | `#FCE7F3` | `#F2BCD8` | `#A3215F` |
| Blue | `#E0ECFD` | `#B7CFF7` | `#1D4ED8` |
| Peach (staff, e.g. preparer) | `#FDEDE3` | `#F5CDB4` | `#9A3412` |
| Overflow "+N" | `#EEF0F3` | `#D5D9DF` | `#374151` |
| Client (solid) | `#2F7D3B` | — | `#FFFFFF` |

### Role/type chips (bg / border / text, weight 400)
- Client type (Family office, Business…): `#F6FAF7` / `#E4EFE6` / `#334155`, icon stroke `#5E8F68`
- Entity: `#F7F6FE` / `#E3E1FB` / `#4338CA`
- Filer / Dependent: `#F5F8FF` / `#DCE6FB` / `#1E40AF`
- Estate: `#FFF8F3` / `#F9E0CE` / `#9A3412`

### Engagement status bar colors (client list mini-bars)
Preparing `#C2347E` · In review `#3B82F6` · Ready to deliver `#5CC08A` · Done `#2E7D4F` · Not started `#EE8B60`.
Stage meter (engagements list, 4 segments): filled `#2F7D3B`, empty `#E2E8F0`. Progress bar fill `#5CC08A` on `#E2E8F0`.

---

## 3. Typography

Font: **Inter** (400/500/600/700/800), fallback `system-ui, sans-serif`. Numbers in tables use `font-variant-numeric: tabular-nums`.

| Role | Size / line-height | Weight | Color |
|---|---|---|---|
| List page H1 (`.list-head h1`) | 24/32, letter-spacing -.4px | 800 | `#0B1220` |
| Workspace H1 (`.ws-name h1`) | 20/26, -.4px | 800 | `#0B1220` |
| Hero/callout H2 | 18/28 | 700 | `#111827` |
| Big stat | 20/28 | 700 | `#111827` |
| Section/card H2 | 16/24 | 600 | `#111827` |
| Body / row primary | 14/20 | 400 (names/values 600) | `#111827` |
| Secondary / meta | 13/20 | 400 | `#64748B` |
| Small meta / timestamps | 12/16 | 400 | `#64748B` |
| Column header / eyebrow | 12/16, letter-spacing .4px, UPPERCASE | 600 | `#4B5563` (table) / `#64748B` |
| Micro badge | 11/16 | 600–700 | per tone |

> Font weights: use exactly what the HTML uses (700/800 where listed above). The "no 700" rule from other projects does **not** apply to these prototypes.

---

## 4. Shape, spacing, elevation

- **Radius:** buttons, inputs, search, filter pills, pagination, icon buttons, rail items → `999px` (fully rounded). Cards/tables/panes → `12px`. Chips/tags/badges → `6px` (micro pill `5px`). Textarea, menu items → `8px`. Menus → `12px`. Avatars → `50%`.
- **Heights:** controls `32px` (small `28px`/`26px`/`24px`), chips `24px`, tags `22px`, micro badges `20px`/`18px`, table header `44px`, tabs `42px`, rail items `40px`, header id row `60–64px`.
- **Spacing:** card padding `24px`; table rows `padding: 12px 24px`, grid `gap: 16px`; section stack `gap: 24px` (workspace) / `16px` (list); heading → content `gap: 8px`; toolbar `gap: 8px`.
- **Page padding:** list `main` → `20px 24px 40px`; workspace body `.ws-body` → `24px 24px 40px`.
- **Borders:** always `1px solid #E5E7EB` on cards; row dividers `1px solid #F0F1F3`.
- **Shadows:** essentially none. Only: dropdown menus `0 12px 32px rgba(15,23,42,.14)`; segmented-tab active `0 1px 2px rgba(15,23,42,.08)`; avatar ring `0 0 0 2px #FFFFFF` (stacks) / `0 0 0 3px rgba(47,125,59,.14)` (header avatar).
- **Icons:** inline SVG, 24×24 viewBox, `fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"`, `stroke-width` 1.8 (2 for chevrons/actions, 2.2–2.4 for plus/check). Sizes: 18 (rail, card heading), 16 (buttons, tabs), 14 (inline meta, chevrons), 12 (breadcrumb separators). Always `aria-hidden="true"`. Lucide-style line icons — reuse an existing path from the pages before drawing new ones.

---

## 5. Components

### Shell (classes in acurat.css — never restyle)
- **Rail** `.rail` — logo `<b>A</b>CURAT`, groups "Platform" (Clients, Engagements, Review) + bottom group (Administration, Documentation, Help & Support, `.me` account pill). Active item: `aria-current="page"` (green pill, white text). The `.me` pill opens the `.pmenu` profile menu, which `acurat.js` builds: a header (avatar, email, role and a Switch workspace caret), then My Profile, Administration and Logout. Every app page loads `assets/guard.js` in `<head>`, so a signed-out visitor is sent to `login.html`.
- **Workspace header** `.ws-head` → `.ws-id` row: back button `.hb` → avatar `.ws-av` → `.ws-title` (`.crumbs` + `.ws-name` with `h1` + `.tag`) → `.ws-sp` spacer → `.status` ("Preparing · **Due Oct 15**" with `.due`) → `.switch.more` kebab menu → Focus button (`data-focus="on"`, engagement pages only).
- **Tabs** `.ws-tabs` — links with 16px icon + label + optional count `.ct` (`.ct.alert` for red). Active = `aria-current="page"` (dark 3px underline). Engagement tabs: Overview, Questionnaire, Documents, Binder, Worksheet, Export, Signatures, Return. Ends with `.tsp` + `.fexit` "Exit focus <kbd>Esc</kbd>".
- **Dropdown menus** `details.switch` + `.menu` (`.menu.small` for simple action lists; `.switch.left` to anchor left). Header `.mh`, footer link `.all`.
- **List-page title row** `.list-head` (h1 + subtitle p) with `.lh-r` containing `.kpis` pill (`.kpi` items: **bold number** + label) and `.ty` tax-year button.
- **Header facts** `.facts` / `.fact` (`<i>` label + `<b>` value, `b.warn`).
- Helpers: `.tag` / `.tag.n`, `.hbtn` / `.hbtn.ghost`, `.hb` / `.hb.sm`, `.xcheck` / `.xcheck.info`, `.owner` (`.t` / `.s`), `.sticky-pane`, `.sr` (screen-reader only), `kbd`.

### Buttons (inline, all `height:32px; border-radius:999px; padding:0 14px; gap:6px; font-size:14px`)
| Variant | Style |
|---|---|
| Primary | `border:0; background:#2F7D3B; color:#FFFFFF; font-weight:600` |
| Outline (brand) | `border:1px solid #2F7D3B; background:transparent; color:#1F6A2E; font-weight:600` |
| Secondary | `border:1px solid #E5E7EB; background:#FFFFFF; color:#111827; font-weight:500` |
| Icon-only | `width:32px; padding:0; border:1px solid #E5E7EB; background:#FFFFFF; color:#374151` (needs `aria-label` + `title`) |
| Filter/dropdown | Secondary style, `padding:0 10px; gap:8px; font-weight:400` + 16px chevron stroke `#6B7280` |
| Text link action | `font-size:14px; font-weight:600; color:#2F7D3B; text-decoration:none` ("View", "Show") |

Filter pills (segment): selected `#E3F1E5` bg / `#CFE3D3` border / `#1F6A2E` 600 text; unselected `#F1F5F9` / `#E2E8F0` / `#334155` 400. Count appended inline ("To sign 3").

### Search input
`<label>` pill: `height:32px; padding:0 10px; gap:6px; border:1px solid #E5E7EB; border-radius:999px; background:#FFF`, 16px magnifier stroke `#6B7280`, borderless transparent `<input type="search">` 14px, hidden label text via `.sr` pattern.

### Card / section
- Card: `border:1px solid #E5E7EB; border-radius:12px; background:#FFFFFF; padding:24px; display:flex; flex-direction:column; gap:16px`.
- Card header (sidebar cards): flex row, `min-height:32px; padding-bottom:12px; border-bottom:1px solid #E5E7EB`; h2 16/24/600 with 18px icon in `#64748B`; optional badge on the right.
- Section with heading **outside** the card: `section{gap:8px}` → header row (h2 16px 600 + Outline button on the right) → card.

### Table (div grid, not `<table>`)
- Wrapper `section` card (12px radius, no padding) → `.tbl-scroll` → inner `min-width`.
- Header row `role="row"`: `display:grid; grid-template-columns:…; gap:16px; height:44px; padding:0 24px; background:#E9EEF4; border-radius:12px 12px 0 0; font 12/16 600 letter-spacing .4px; color:#4B5563`, labels UPPERCASE.
- Body rows: same grid, `padding:12px 24px; border-bottom:1px solid #F0F1F3`; last row no border + `border-radius:0 0 12px 12px`. Clickable rows: `class="crow"` + `position:relative` + main link `class="row-link"`; interactive cells get `position:relative; z-index:1`.
- Primary cell: 40px solid green avatar + name (14/600) + meta line (13px `#64748B` with 14px icons, `gap:16px`).
- Footer below card: "Showing 1–5 of 15 clients" (14px `#4B5563`) + round pagination (32px circles; current `#EEF7EF` bg, `#2F7D3B` border, `#1F5A29` 600) + "Rows per page" dropdown.

### Chips & badges
- Status chip: `inline-flex; height:24px; padding:0 8px; border:1px solid <border>; border-radius:6px; background:<bg>; font 13/16 weight 500; color:<text>` (tones in §2).
- Type/role chip: same shape, weight 400 (palettes in §2).
- Micro badge (Extended, CPA ONLY): `height:20px; padding:0 6px; border-radius:6px; font 11px 600–700`.
- Count bubble: `min-width:20px; height:20px; border-radius:10px` (unread: `#FAD4D4` / `#B42318`).

### Avatars
40px (table primary, solid green or tone), 36px (header `.ws-av`), 32px (lists/messages), 28px (stacks, `margin-right:-6px` + white ring), all initials in 11–14px 600.

### Key–value grid (contact & filing)
`grid-template-columns:repeat(2,minmax(0,1fr)); gap:20px 24px`; each item: 16px `#64748B` icon + label (14px `#64748B`) over value (14px `#111827` 500).

### Key-dates list
Rows `display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #F0F1F3`; left = label 13px `#475569` + hint 12px `#64748B`; right = value 13px 600 (`#111827`, `#B45309` for due/pending, `#64748B` for past).

### Vertical progress timeline
32px circles connected by 1px `#E2E8F0` line. Done: solid `#2F7D3B` + white check. Current/blocked: white with 2px `#C2410C` ring + `#C2410C` number/text. Pending: white with 1px `#D5D9DF` border, `#64748B` number. Title 14/600, sub 12/16.

### Callout
"Up next": `background:#FFF8EF; border:1px solid #F5D9B8; border-radius:12px; padding:24px; gap:12px`; eyebrow UPPERCASE 12px 600 `#9A3412`; title 18/28; sub 14px `#64748B`; Primary + Secondary buttons.
Info notice: `#F5F8FF` bg, `#DCE6FB` border, 12px radius, `padding:20px 24px`.

### Progress bar
`height:6px; border-radius:6px; background:#E2E8F0` with inner fill `#5CC08A`, `role="progressbar"` + aria values.

### Textarea
`width:100%; padding:12px; border:1px solid #E5E7EB; border-radius:8px; font 14/20; resize:vertical; outline:none`. Checkboxes use `accent-color:#2F7D3B`, 16×16.

### Grouped list headings (questionnaire)
Group header bar: `padding:12px 24px; background:#E9EEF4; 12px 600 UPPERCASE .4px; #4B5563`. Collapsible groups use `details.grp` with `.chev` rotating -90° when closed.

### Binder / multi-pane tool pages
Use the local classes from `engagement-binder.html` (`.pane`, `.pane-head`, `.ib`, `.btn`/`.btn.solid`/`.btn.ghost`, `.seg`, `.tabs` segmented control, `.doc`, `.pill.g/.b/.o/.s/.y`, `.field`, `.chk`, `.splitter`). Selected segment there is dark `#0B1220`; segmented tabs are `#EEF1F4` track with white active.

---

### Auth screens (login.html, login-workspace.html, login-password.html, forgot-password.html, set-password.html)
Shared classes live in `assets/auth.css` and behaviour in `assets/auth.js` (state in `localStorage['acurat.auth']`). There's no rail or header. A centered `.auth-card` (white, 1px `#E5E7EB`, 12px radius, 40px padding, 420px wide, 440px `.wide`) sits on `#F8FAFC`. Inside the card: `.auth-brand` (wordmark `assets/acurat-wordmark.svg` + 12px tagline), then `.auth-head` (h1 20/26 800, sub 14px `#64748B`), then `.auth-form` (gap 20px).
- Inputs `.fld > label + .inp + .ferr`: 40px pill, 16px `#6B7280` icon, focus = brand border + `0 0 0 3px rgba(47,125,59,.14)` ring, error = `#B42318` border + 12px message.
- Primary `.abtn` is a 40px full-width pill. Text links use `.alink`.
- Workspace picker `.wsc` cards use the avatar tones. Disabled ones get `aria-disabled="true"` + a neutral "Coming soon" chip (the Taxpayer portal for now).
- Notices: `.note.ok` / `.note.bad` and `.flash` (success tone), plus `.xcheck.info` for hints.

### Clients page v2 (index.html): expandable client → engagement list
`index.html` uses a local `<style>` block of classes and is rendered from a JS `CLIENTS` array, with demo "today" fixed at **Oct 12, 2026**. Follow these patterns for list pages built the same way:
- **Toolbar controls are 36px** (search `.cl-search`, native `<select>` pills `.sel`, `.mf` "More filters" with green count `.mf-n`, icon `.ic`, primary `.add`). The "More filters" panel `.cl-more` uses 34px selects with 8px radius. Active filters show as green `.chip`s with ×, plus "Clear all" `.lnk` (underlined green text button).
- **KPI pill** adds `overdue` (`.kpi.warn.on` turns red `#B91C1C`) and `due in 30 d`, both computed from the data.
- **Table** `.cl-table`: header `#EEF2F6` / `#475569` / letter-spacing .5px. Client rows `.cl-row.main` have an expand chevron `.exp`. The avatar is a **rounded square** (40px, radius 10px). There's also a client-type badge `.ctype` (`#F1F5F9` / `#475569`, 11px 600).
- **Portal connection chip** `.conn`: accepted `#E3F1E5`/`#1F6A2E` · partial `#E0F2FE`/`#075985` · invited `#FEF3C7`/`#92400E` · none `#F1F5F9`/`#475569`, with an optional action link.
- **Due text** `.r`: bad `#B91C1C` (overdue / due today), soon `#B45309` (≤30 d), later `#475569`, ok `#1F6A2E` (filed). Unread bubble: `#FEE2E2`/`#B91C1C`.
- **Engagement sub-rows** `.cl-row.sub` sit on `#F8FAFC`. A solid form badge `.fm` uses `FORM_CLR`: 1040 `#0B1220`, 1041 `#9A3412`, 1065 `#1F6A2E`, 1120 `#5B21B6`, 1120-S `#6D28D9`, 709 `#0E7490`, 990-PF `#1D4ED8`, 1099-NEC `#475569`. A status dot `.st` uses `ST_CLR`: Not started `#94A3B8`, Letter unsigned / Gathering docs `#D97706`, Preparing `#2563EB`, In review `#7C3AED`, Ready to deliver / Filed `#16A34A`. Each sub-row has an "Open" pill `.openbtn`, and the list ends with a dashed "+ Add engagement" `.addeng`.
- **Statuses** (new canonical list): Not started → Letter unsigned → Gathering docs → Preparing → In review → Ready to deliver → Filed.
- **Pagination** current page: `#E3F1E5` bg / `#2F7D3B` border / `#1F6A2E`.
- **Dialog (shared, mandatory for every modal):** the styles live in `assets/acurat.css` and the behaviour in `assets/acurat.js` (`Acurat.dialog(el, {onOpen, onClose})` → `{open, close, isOpen}`). Never restyle a dialog per page. Structure:
  ```html
  <div class="dlg-back" id="x" hidden>                 <!-- blurred backdrop: rgba(15,23,42,.32) + blur(4px) -->
    <div class="dlg [sm|lg]" role="dialog" aria-modal="true" aria-labelledby="…">   <!-- 600px; sm 440, lg 760 -->
      <div class="dlg-h"><div><h2>Title</h2><p>Subtitle</p></div><button class="hb" data-dlg-close aria-label="Close">×</button></div>
      <form novalidate>
        <div class="dlg-b [one]">  <!-- 2-col grid 7fr/5fr; .one = single column; .full spans -->
          <div class="dfld full"><label>Name <i>*</i></label><input><p class="ferr" hidden></p></div>
        </div>
        <div class="dlg-f"><button type="button" class="dbtn sec" data-dlg-close>Cancel</button><button type="submit" class="dbtn">Save</button></div>
      </form>
    </div>
  </div>
  ```
  The card is white with a 12px radius and the menu shadow, and it fades and rises in on open. Title 18/28 700, sub 14px `#64748B`. Fields `.dfld` take input, select or textarea (36px pill, textarea 8px radius) plus `.ferr` and `.hint`. Buttons are `.dbtn` (primary), `.dbtn.sec` (Cancel) and `.dbtn.danger` (destructive). Esc, backdrop click and any `[data-dlg-close]` close it. Focus is trapped inside and goes back to the opener on close.
- **Dropdown (shared, mandatory for every select):** write a plain `<select>`. `acurat.js` automatically replaces its look with the themed dropdown (`Acurat.select`); opt out with `data-native`. The `<select>` stays the source of truth, so read/write `select.value` and listen for `change` as usual (setting `.value` from code updates the pill). Never style `<select>` per page.
  - **Trigger** `.acs-btn`: 36px pill with a 14px chevron that rotates when open. Focus/open uses the brand border + `0 0 0 3px rgba(47,125,59,.14)` ring.
  - **Variants by context:** in a toolbar filter (`label.sel` or `data-filter`), a chosen value tints the pill brand-tint (`#F2F8F3` / `#B9DCC0` / `#1F6A2E`). In the `.cl-more` panel it's 34px with an 8px radius, min 180px. In a dialog `.dfld` it's full-width, 400 weight, with a grey placeholder and red error border.
  - **Menu** `.acs-menu`: white, 12px radius, menu shadow, 6px padding, max 300px tall. Options are 36px rows with an 8px radius. Hover/keyboard `#F8FAFC`; the selected option is brand-tint, 600, with a green check. The placeholder option (`value=""`) is grey with a divider under it.
  - **Search:** a 32px search pill appears at the top automatically when there are more than 7 options (or with `data-search`), with "No matches" when nothing fits.
  - **Keyboard:** ↑/↓/Home/End, Enter to pick, Esc to close, type-ahead, Tab out. It flips above the trigger near the bottom of the screen.
  - **Option descriptions:** `<option data-desc="…">` adds a grey second line (Return, Team and Letter template use this).
  - **Multi-select:** `<select multiple data-placeholder="Add team members">` shows chips inside the pill (`data-short` sets the chip label, × or Backspace removes one). Menu rows get checkboxes, and the menu stays open while you pick.
- **Filter toolbar (shared, in acurat.css):** use `.cl-bar` > `.cl-search` (36px search pill) + `label.sel > select` filters + `.bar-sp` spacer + `.add` primary button. Active filters show as `.chips` / `.chip` + "Clear all" `.lnk`. The footer uses `.pg` round pagination and a "Rows per page" select. The empty state is `.empty-st`. The Clients list and the client Engagements tab both use exactly this.
- **Dialog extras:** `.dlg.lg` (900px) for multi-step forms, with a `.dstep` badge in `.dlg-ha` ("Step 1 of 2 · Details"). Sections are `.dsecs` > `.dsec-t` (12px uppercase title) + `.dgrid` (2 equal columns). Optional labels take `<small>(optional)</small>`. Use `.affix` for a "$" prefix input. Use `.trow` + `.tgl` (role="switch") for on/off settings like Portal access. In the footer, `.sp` splits it into [Cancel / Back] … [Save as draft] [Continue].
- **Letter editor mock** `.rte` (toolbar `.rte-bar` + contenteditable `.rte-ed`, min 280px): Bold / Italic / Underline · lists · link · H2 / H3 / ¶ · clear. Insert-field chips `.fchip` (monospace, brand-soft) put `{{Field}}` at the caret, and hovering a chip shows its value. The empty state is a dashed `.dempty` box. It stands in for React Quill.
- **Header "More actions" (⋯) menu:** `details.switch.more > summary.hb` + `.menu.small`. The trigger shows an open state (brand border, brand-tint fill, focus ring). Items are 36px rows with a 16px `#64748B` icon + 14px label. Destructive items get `a.danger` (`#B42318`, `#FEF2F2` hover) after a `.msep` divider. Client pages: Edit client · New engagement · Add person. These are wired by `assets/client.js` (loaded after acurat.js on every `smith-*.html`). Edit client opens the client dialog in edit mode and saves to `localStorage['acurat.client.smith']`. New engagement and Add person open those dialogs, or go to their tab with `?new=1` / `?add=person`. ⚠️ Never give another component the class `.more`, because `details.switch.more` uses it (the filter panel is `.cl-more`). Engagement pages: Edit engagement · Change preparer · ─ · Archive engagement (danger).
- **Row action menu (shared):** a `.rowbtn` (32px round ⋯) per row, opening `Acurat.menu(btn, [{label, icon, danger, sep, onClick}])`. It looks identical to the header menu and supports ↑/↓, Esc, Tab and outside click. Disable the button when a row has no actions (e.g. the Partner).
- **Dialog building blocks (shared):** `.acards` / `.acard[aria-pressed]` (3 choice cards: icon, label, hint; selected = brand border + tint) · `.dseg` segmented switch (Individual / Entity) · `.dhead` (16px 600 section title + sub) · `.dq` question label · `.dhr` divider · `.chkl` checklist (header "Select all · n of N" with indeterminate state, rows with checkbox + primary + small secondary, max 200px scroll) · `.chkl-empty`.
- **Dialog checkboxes & summary (shared):** `.dchk` is a checkbox + label row (16px, brand accent, optional `<small>` hint). `.dsum` is a grey summary box (title 16px 600 + meta line), used in "File thread as PDF".
- **Messages tab patterns (smith-messages.html):** thread filter pills `.tpill[aria-pressed]` (selected `#E3F1E5` / `#1F6A2E`); thread rows `.thr` (hover `#F8FAFC`, current `#F1F5F9`); 32px icon-only toolbar buttons `.tib`; 40px contact action circles `.cab` (`#F1F5F9`). Your own messages are right-aligned bubbles on `#F2F8F3` with a `#D6E9DA` border and a 12px 4px 12px 12px radius; the client's are left-aligned and white. Search-in-thread highlights use `mark.hit` (`#FEF3C7`). A closed thread replaces the composer with a "Reopen thread" bar.
- **Administration (admin.html):** a 232px left settings-nav card plus a right panel card, both 12px radius, filling the viewport. Nav items `.snav` are 38px rows with a 16px icon. Hover is `#F1F5F9`; active is `#E3F1E5` / `#1F6A2E` 600. A parent with children (Documents) has a rotating chevron and indented `.snav.sub` items. Sections are picked with `?tab=` (and `&kind=letters` for Templates). Sections that aren't built use the placeholder: title + sub, then a dashed `#F8FAFC` box with a 56px icon tile, "<Section> settings — coming soon" and a short note.
- **Tabs: always use the underline `.ws-tabs` design.** Use it even inside panels, such as Templates (Questionnaires | Engagement letters): `<nav class="ws-tabs adm-tabs">` with `<a aria-current="page">` items (icon + label + `.ct` count) sitting on a 1px bottom border under the section title. Never use segmented or pill tabs for page or section navigation. Segmented `.dseg` is only for small in-form switches (Individual / Entity).
- **Questionnaire editor (questionnaire-editor.html?id=qt-1 | new):** crumbs Templates › Questionnaires › name. Title + `Draft v3` pill, with Save draft (`.mf`) and Publish (`.add`) on the right. The main column has a Settings card (name, engagement-type toggle chips `.tchip[aria-pressed]`, intro). Below it are question cards `.qcard` (drag handle, "n. text", Yes / No pill, indigo rule pill). The open card is `.qcard.is-open` (2px brand border), with Question / Answer type / Details box, a grey Rule box (green request chips `.rchip` + dashed "+ Add from request library"), and Delete / Duplicate. The side column has Summary, Versions and Request library cards. Saving writes to `localStorage['acurat.qt']`, and the Templates list reads it.
- **Documentation / Help & Support (docs.html, help.html):** list-page title + one card with the shared coming-soon placeholder (`.ptitle`, `.ph-box`, `.ph-ic` are now in acurat.css).
- **Engagement workspace (engagement-*.html):** `assets/engagement.js` (load after acurat.js) wires the header ⋯ menu (Edit engagement · Change preparer · Archive engagement). It also exposes `Engagement.confirm({title,message,confirm,danger,reason,onConfirm})`, `Engagement.sendFromTemplate({templateId,onSend})` (the fees + live letter preview dialog, `.dlg.xl`) and `Engagement.placeFields({fromReturn,name,onSend})` (3-step upload → place fields → review, `.dlg.xl.pf`). Signatures and Return both use these. Page behaviour lives in a script at the end of each page and works on the existing markup, so the design stays as drawn. `.ws-body [hidden]` always hides, even over inline `display:flex`.
- **New engagement dialog (shared):** `assets/new-engagement.js` (load after acurat.js) → `NewEngagement.open({client, clients, engagements, onCreated(eng, draft)})`. Pass `client` from a client page to hide the Client field; pass `clients` on the Engagements list to show the searchable Client picker first (its partner becomes the default team). Pass `engagements` (`{id, client, name, form, year, status, team}`) to show an optional "Start from People You Know" picker once a client is known. It lists one row per person, by first and last name. Picking one fills in names, email, fee and team, but never the return; "Start fresh" clears them again. The team is optional. The "Send an engagement letter" switch (on by default) sets the flow: on → Continue to step 2 (template + editor); off → the primary button reads "Create engagement" and creates it straight from step 1, with letter status `notsent`. Pass `allowNewClient: true` (Engagements list only) to add "Create New client" at the top of the Client picker. Picking it hides People You Know. On save, the dialog returns `eng.newClient` (an Individual client built from the name and email), which the page adds to its `CLIENTS`. The Engagements list (engagements.html) and the client Engagements tab both use it, so never copy the dialog into a page.
- **Engagements list (engagements.html):** rendered from the same 5 clients / 20 engagements as the Clients page, with the same demo date (Oct 12, 2026). It has the shared filter bar (search, type, status incl. "Open (not filed)", assigned to) and chips. The header has a TY menu and the KPI pill (engagements · clients · overdue). The Columns menu (`.ic`) hides or shows columns and remembers them in `localStorage['acurat.eng.cols']`. Pagination works. Overdue due dates are red 600 with a tooltip.
- ⚠️ **Reserved class names:** don't reuse `.sel` (toolbar filter wrapper: it turns dropdowns green) or `.more` (header ⋯ menu) for anything else.
- **Taxpayer portal (portal-*.html, mirrors ui_screens pages/portal):** pages carry `<html data-portal="taxpayer">` and load `assets/portal.css` + `assets/portal.js` (after acurat.js). `window.Portal` holds the taxpayer data and store (`localStorage['acurat.tp']`: selected return + progress), `todosOf`, `signLetter`, `submitPriorReturn`, `skipStep`. Signing in to the Taxpayer portal workspace goes to `portal-select.html` (own white top bar, return cards) → `portal-todo.html`. `guard.js` keeps the views apart (taxpayer → portal pages only, a return must be picked; firm → never portal pages). Rail: To-do (red `.nb` count, dot when collapsed) · Engagement, bottom Settings + `.me` (TAXPAYER); the profile menu becomes My Profile · Settings · Switch return · Logout. To-do = `.tp-h` heading + five-step track `.steps` (5px bars, 30px circles, focused step has the dark 2px underline like `.ws-tabs`; `.steps-m` on phones) + one step card `.tcard.on` (1.5px brand border, `.tile` icon, `.eyebrow` + `.tpill.warn/.ok`, `.tfacts` grid, `.tact` buttons `.tb.pri/.tb.sec`). Letter flow: `.flow` bar → read (`.sheets` serif pages + sticky `.glance`) → sign (`.sgn`: name, `.dseg` Type/Draw pad, consent, `.dchk`) → done (`.tdone`). Not built yet → info toast "… is coming soon." **Engagement** (rail item) = the firm engagement workspace as the client sees it: same `.ws-head` (back to To-do, `.ws-av`, crumbs Your returns › To-do, return title + form `.tag`, preparer `.status`, no ⋯ / Focus) with only three underline tabs — Questionnaire (`portal-questionnaire.html`), Documents (`portal-documents.html`), E-Signature (`portal-signatures.html`). Documents and E-Signature are copies of the firm pages' `.ws-body` with CPA-only parts removed (Documents: no refresh / upload / Actions; E-Signature: "Documents to sign", signer "You", Review and sign / Remind spouse / View signed copy, row menu Open only, no Send / selection, aside = How signing works + Need help?). Questionnaire is answerable: same summary card + one numbered question list (no sections) as the firm tab, Yes / No / Not sure choices use the filter-pill styles, Yes opens a `.tq-ta` details box, Submit answers (enabled when all are answered) moves the return from step 3 to 4.
- **Template tables** `.ttbl` / `.trw` (grid rows, `#E9EEF4` header) with `.ftag` form tags and `.spill.pub` / `.spill.drf` status pills. Engagement letters show a `.tgl` Active switch per row, ⋯ Edit / Delete, and a delete confirm `.dlg.sm` with `.dbtn.danger`.
- **Toast tones:** `Acurat.toast(msg)` is success. `Acurat.toast(msg,'info')` is neutral (white / `#E2E8F0` / `#334155`), for removals ("… can no longer sign in").
- **Toast (shared):** `Acurat.toast('Client created: …')` shows a bottom-center success pill (`#F0FDF4` / `#BBF7D0` / `#15803D`) that auto-hides after about 3s.
- **Shell:** when copying a page like this, link `assets/acurat.css` / `assets/acurat.js` and `assets/guard.js`; never inline them. Scope generic class names (`.who`, `.av`) to the page container so they don't override `.rail .me`.

## 6. Layouts

- **List page:** `main{padding:20px 24px 40px; gap:16px}` → `.list-head` → toolbar (search + filter dropdowns left; icon buttons + Primary CTA pushed right with `margin-left:auto`) → table card → footer.
- **Workspace page:** `main` (no padding) → `header.ws-head` → `.ws-body` → two-column flex: main column `flex:999 1 560px; gap:24px` + `aside{flex:1 1 320px; max-width:400px; gap:24px}` of stacked cards. Wraps on narrow screens.

---

## 7. Copy & content conventions

- Sentence case for buttons, headings and labels ("Add dependent", "People on the return"); UPPERCASE only for column headers, eyebrows, and micro badges.
- Dates like `Oct 15`, `Jun 14, 2019`, `Oct 14 · 10:12 AM`; separators use ` · `.
- Masked SSN `•••• 6789`. Tax-year control "TY 2025". Form tags like `1040 · MFJ · 2025`.
- Every icon-only control has `aria-label` + `title`; decorative SVGs `aria-hidden="true"`; rows use `role="row"`.

## 8. Checklist before adding anything

1. Is there an existing page with this pattern? → copy its markup.
2. Every color is from §2, every radius/height from §4, every font size from §3.
3. Shell parts use acurat.css classes, not new CSS.
4. Buttons are pill-shaped (999px), cards are 12px, chips are 6px.
5. Green is the only brand/action color; semantic tones only for status.
6. No new shadows, gradients, fonts, or icon styles.
