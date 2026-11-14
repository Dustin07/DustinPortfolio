# Change history and design decisions

This is the portfolio's completed-work record. Read it before proposing or implementing another improvement. It is not a backlog: an item recorded here should be checked in the current code before anyone tries to build it again.

Current user instructions take precedence. A new request can deliberately replace an earlier decision; record that replacement here rather than silently undoing the history.

## How to use this record

1. Read this file and README.md, then inspect the current implementation.
2. Confirm a concrete remaining problem before changing an already completed area.
3. Preserve the constraints below unless the user changes them.
4. For each meaningful batch, add a dated entry with the behavior changed, affected files, checks performed, and any remaining deployment gate.
5. Treat a commit, passing local checks, and a successful production deployment as separate evidence. Check GitHub Actions before calling a queued change live.

## Current direction and constraints

- Keep the existing public Dustin07/DustinPortfolio repository and GitHub Pages address. Do not add paid hosting, larger paid runners, analytics, external fonts, API keys, or a contact-form backend as a routine improvement.
- Preserve the clean static neutral background. The decorative wave, airflow, gradient, and heavy glass experiments are retired.
- Keep the Experience & Education introduction at the full section width and keep dates, timeline markers, and cards aligned.
- Keep motion brief and optional. Respect system reduced motion, the page-wide pause, local illustration pauses, hidden tabs, offscreen work, and keyboard focus.
- Use unaccented Resume labels. Keep Resume a supporting destination in the existing hierarchy.
- Preserve the original supplied PDFs. Their byte counts and SHA-256 hashes are recorded in tests/document-manifest.json; change a baseline only for an approved replacement.
- Keep engineering claims tied to the published material. Distinguish the owner's contribution from team work, modeled results from physical validation, planned manufacturing from verified production, and completed design handoffs from customer approval.
- Keep employer descriptions within the existing public material or explicit user-supplied sharing authority.
- Do not publish temporary localhost verification fixtures or private progress records into the site.

## Completed capability map

These behaviors already exist. Improve a verified defect in them; do not recreate them as new features.

| Area | Current completed behavior | Main implementation / evidence |
| --- | --- | --- |
| Identity and structure | Circular DL badge and favicon, consistent heading/footer capitalization, one main heading per page, 11 engineering case studies, and a compact introduction. | index.html, projects/, 404.html; site and metadata checks |
| Engineering evidence | Each case has role, decision, outcome, and evidence summaries. NASA has a dedicated case. Academic and employer narratives preserve ownership and validation boundaries. | case-brief markup; tests/engineering.test.cjs |
| Project discovery | Three featured starting points plus the complete native project-library disclosure. Category filters, immediate keyword search, exact acronym handling, normalized GD&T/C++ terms, counts, empty-state guidance, and widening searches use local data. | portfolio.js; tests/portfolio.test.cjs |
| Saved browsing | URLs, browser history, and tab-local preferences retain the category and query. Timeline category links and case return links land directly at the project library. Multiple matching results supply a contextual Next Result order, with the original order as fallback. | portfolio.js; selection work in c096d2c |
| Reading layout | Static neutral surfaces, full-width Experience description, aligned timeline rows, content-sized phone cards, readable capability columns, fluid compact case titles, balanced headings, and safe wrapping under expanded text spacing. | styles.css; desktop/phone review and spacing checks |
| Contact and touch | Email is the primary contact action; Resume and LinkedIn remain secondary. Hero links have at least 44px height. LinkedIn links announce new-tab behavior. Project search is a named search landmark. | index.html, styles.css |
| Navigation and focus | Compact main/project menus have associated controls, Escape and outside-tap dismissal, keyboard-exit dismissal, responsive focus recovery, and active-section tracking. Compact contents stay sticky with bounded scrolling and clear heading offsets. | portfolio.js, styles.css; navigation regression checks |
| Tables and hierarchy | Wide tables keep their data, expose horizontal scrolling only when needed, have scoped headers/captions and distinct region labels. Aircraft team sub-analyses retain their nested heading hierarchy. | portfolio.js, styles.css, case HTML; site/engineering checks |
| Documents | Project PDFs use readable document rows with format, rounded transfer size, and new-tab cues. Size labels are checked against the source files. | case HTML; tests/documents.test.cjs |
| Technical figures | Existing raster/SVG figures open in one native modal. Fit/actual-size modes, keyboard panning, Tab containment, Escape/backdrop dismissal, original dimensions, captions, detailed vector alternatives, and return focus are implemented. The enlargement cue sits below the data. A stable scrollbar gutter prevents sideways page movement. | figures.js, styles.css; tests/figures.test.cjs |
| Motion | One-time entrances never hide content pending JavaScript. Filtering remains immediate. Native same-origin page changes use a brief 180ms transition with a stable header. Direct fragment links settle immediately; interactive same-page links scroll smoothly. History restores the latest page-motion preference. | ambient.js, motion.js, styles.css; motion tests |
| Process summaries | NASA, protective-cover, and reverse-engineering workflows have optional step highlights. Ergonomic-tool, gating, and die-design workflows are static summaries grounded in the published descriptions. | workflow.js and case HTML |
| Technical illustrations | A labeled dogbone tensile sequence, six-stage putter sequence with original CAM references, and three-variant carabiner comparison explain the documented work. They retain static inspection, source qualifiers, local/page/system pause behavior, and offscreen/hidden-tab limits. | tensile.js, putter.js, carabiner.js and their tests |
| Performance and reliability | Images reserve their dimensions, load lazily, and request async decoding. Unused legacy component rules were removed. Content-hash asset versions prevent stale CSS/JS. The 404 page, canonical metadata, sitemap, branded sharing image, curated related work, and project-specific email contexts already exist. | tools/version_assets.py, tools/build_related.cjs, tests/, .github/workflows/validate.yml |
| Free setup | Public repository, existing static GitHub Pages, standard ubuntu-latest validation, read-only workflow permissions, and no artifact/cache uploads or third-party automatic resources. | README.md; repository visibility and workflow audited on 2026-10-19 |

## Retired or superseded approaches

- Repeated logo experiments were superseded by the current circular DL badge. Do not restart a logo exploration without a new user request.
- Flowing gradients, frosted/liquid-glass experiments, and airflow/wave backgrounds are historical, not the current design direction. The static replacement is recorded in c4a4958.
- The narrow Experience introduction and misaligned marker row were replaced by full-width text and aligned timeline rows in c4a4958 and d4a57a5.
- Fixed minimum heights that left excessive empty space in single-column phone cards were replaced by content-sized layouts.
- Two cramped capability columns on the smallest screens were replaced by one readable column.
- Figure enlargement labels positioned over chart/image content were moved below the content.
- A document section made entirely of similar dark PDF pills was replaced by readable document rows with source-derived sizes.
- Global smooth scrolling on initial fragment loads was replaced by immediate initial positioning plus smooth interaction after focus enters the page.
- Playback controls that remained enabled while the page-wide pause blocked them are corrected in the entry below.

## 2026-10-19 — Changes introduced with this record

### Illustration playback consistency

- Putter and carabiner playback buttons now disable while the page-wide pause is active and explain that playback can be resumed in the footer.
- Their operation/design controls remain available for static inspection.
- Clearing the page-wide pause preserves a locally selected pause; system reduced motion remains authoritative.
- Files: putter.js, carabiner.js, their regression tests, the two case pages' content-hash references, and README.md.
- Verification: 13 putter checks and 13 carabiner checks passed. At 390px, browser checks confirmed disabled playback, enabled manual choices, the selected source reference, and retained local pause after page resume.

### Durable project memory

- Added this change record, a complete historical commit index, a README pointer, and a short root AGENTS.md instruction to consult the record and maintain it.
- The historical index below contains every repository commit returned through c096d2cbe7bc7458ff1e195b93341b9adf7f87d8, including intermediate and retired experiments. Each link opens the exact patch; a historical title does not mean its approach is still active.
- This entry is included in the commit introducing this document. Later batches should append their own dated entries rather than rewriting this baseline.

## 2026-10-19 — Keep focused report images stable during playback

- Confirmed a keyboard defect in the automatic carabiner sequence: advancing to another design hid the focused report-image enlargement button and returned focus to the page body. The putter used the same changing-reference pattern.
- Both sequences now hold their current frame while a report reference contains focus. Moving within a reference retains the hold; leaving it resumes only playback that was already running, without catching up the time spent inspecting it.
- Opening and closing the figure viewer returns focus to the same visible reference. The temporary hold does not clear a local pause, the page-wide pause, or system reduced motion, and it does not prevent manual operation/design selection.
- Files: putter.js, carabiner.js, both illustration tests, the two case pages' content-hash references, README.md, and this record.
- Verification: 16 putter and 16 carabiner checks passed, including focus retention, resume timing, and pause precedence. The 24 figure-viewer and 20 engineering checks passed, along with all 13 pages, 392 references, 15 images, metadata, and 70 asset references. Real browser checks at 390px for the carabiner and 1280px for the putter confirmed stable image focus and viewer return focus; the desktop putter had no root overflow.
- Deployment gate: GitHub Actions and Pages runs were still queued before this batch. The change is locally verified; successful deployment and live verification remain required.

## 2026-10-19 — Reduce repeated work in the machining sequence

- Putter labels, selected-operation attributes, and report visibility now update when the stage changes. Constant toolpath dash lengths are initialized once. Per-frame geometry and the existing 18-second timing remain intact.
- An instrumented unchanged-stage check previously counted 61 label writes, 366 selection writes, 366 reference-visibility writes, and 183 constant dash-length writes across 61 frame callbacks. Those 976 repeated writes now remain at zero until a stage changes: 16 measured redundant writes removed per unchanged frame. This is a DOM-work measurement, not an FPS or battery-life benchmark.
- A local comparison against the preceding committed script matched all 1,081 sampled geometry/control/reference states over the full 18-second cycle at 60 Hz. The one-time comparison fixture stays outside the published repository.
- Files: putter.js, tests/putter.test.cjs, the putter case's content-hash reference, and this record.
- Verification: 17 putter checks, 20 engineering checks, all 13 pages/392 references/15 images, metadata, and 70 asset references passed. Browser inspection confirmed exactly one selected operation and one visible report for each of all six manual stages.
- Deployment gate: the preceding focus-retention commit passed Portfolio Checks; its Pages deployment was still pending when this batch was prepared. This optimization needs its own successful checks/deployment and live verification.

### Deployment verified after recovery

- The focus fix is [31a91d4](https://github.com/Dustin07/DustinPortfolio/commit/31a91d4fad1d57ba257cf7acfd4e1402c55aa2ac); the machining optimization is [d3888e3](https://github.com/Dustin07/DustinPortfolio/commit/d3888e3385adda43c1cee64006783a8e37cfbc14).
- The optimization's full [Portfolio Checks run](https://github.com/Dustin07/DustinPortfolio/actions/runs/39288109739) and [Pages deployment](https://github.com/Dustin07/DustinPortfolio/actions/runs/39288108696) both completed successfully on 2026-10-19. This supersedes the pending gates for these code changes above.
- Live browser inspection confirmed putter.js?v=4116476f2a1a and carabiner.js?v=177b7847e64f, matching the committed sources. The putter at 1280px and carabiner at 390px retained visible report-image focus through opening/closing the modal, with no root overflow. The live putter also disabled playback during page pause, retained the local pause after page resume, and allowed playback after explicit local resume. The page-wide preference was restored to unpaused after the checks.
- The earlier selection-aware navigation is also verified live: the Boeing filter showed two projects, Next Result advanced from protective covers to ergonomic attachments, and the last matching case wrapped to protective covers.
- No paid hosting, services, dependencies, or usage-credit purchase was introduced. The original PDFs were not changed.

## 2026-10-24 — Match table keyboard stops to actual scrolling

- The aircraft case had four fully visible desktop tables that still added noninteractive Tab stops. Table regions now enter the sequential keyboard order only while their content overflows horizontally. Their names, captions, and native table semantics remain available in both layouts.
- The existing overflow measurement and ResizeObserver update the scroll hint, description, and tabindex together. Layout changes do not move focus. The window-resize fallback preserves this behavior; the original HTML still supplies keyboard access when JavaScript is unavailable.
- Files: portfolio.js, tests/portfolio.test.cjs, README.md, and all 13 pages' content-hash references. No table data, original documents, or visual styles changed.
- Verification: 93 portfolio checks include fitted/overflowing regions, layout changes, existing descriptions, and the resize fallback. All 14 JavaScript suites, all 13 pages/392 references/15 images, 10 asset-version tests, 70 asset references, original-document integrity, and related-work checks passed.
- Browser verification: at 1280px, Tab after the aircraft contribution heading skipped the four fitted tables and reached the project-report link. At 390px, the wider carabiner results table retained tabindex=0 and ArrowRight panned it by 40px. Returning to 1280px changed it to tabindex=-1 without moving its existing focus; the next Tab reached the chart's enlargement button.
- Deployment gate: locally verified; successful GitHub checks, Pages deployment, and live verification remain required for this batch.
- Deployment verified: [88db256](https://github.com/Dustin07/DustinPortfolio/commit/88db256c20d4eef2cab3001c53a7cd07cb55932e) passed [Portfolio Checks](https://github.com/Dustin07/DustinPortfolio/actions/runs/40073923572) and [Pages deployment](https://github.com/Dustin07/DustinPortfolio/actions/runs/40073922987). Live pages served portfolio.js?v=8ddd0e039d04. The live phone table panned by 40px; the refreshed desktop aircraft page skipped its fitted tables and reached the project-report link. This supersedes the pending gate above.

## 2026-10-24 — Keep figure inspection usable in short windows

- At 667×320, the actual-size vector viewer had a 60px outer media limit, leaving only 45px of visible image height after the horizontal scrollbar. It now preserves a 140px minimum media limit, providing 125px of visible image height in the same case. The surrounding dialog can scroll to the caption, and Close stays available.
- The same review found native vertical arrow keys scrolling the surrounding dialog while the focused image remained still. Unmodified arrows now pan the actual-size detail area directly in 40px increments. Fit mode, modified arrows, Page Up/Down, Home/End, Tab, and Escape retain their existing behavior.
- Files: styles.css, figures.js, tests/figures.test.cjs, README.md, and all 13 pages' content-hash references. No source images, chart descriptions, engineering claims, or original PDFs changed.
- Verification: all 14 JavaScript suites passed, including 27 figure-viewer and 93 portfolio checks; all 13 pages/392 references/15 images and 70 asset references passed. Existing original-document checks passed.
- Browser checks covered vector and raster images at 667×320, actual-size layouts at 844×390, 390×844, and 1280×800, horizontal/vertical keyboard panning, visible Close controls, Escape, and return focus. The three additional viewport layouts had no root overflow; full-height layouts continued to fit the original figure dimensions.
- Deployment gate: locally verified; successful GitHub checks, Pages deployment, and live verification remain required for this batch.
- Deployment verified: [d7b641a](https://github.com/Dustin07/DustinPortfolio/commit/d7b641a22f8a92532ca13c7f19a063e474dac56c) passed [Portfolio Checks](https://github.com/Dustin07/DustinPortfolio/actions/runs/40074635736) and [Pages deployment](https://github.com/Dustin07/DustinPortfolio/actions/runs/40074635147). Live inspection confirmed styles.css?v=9911ac4debc6 and figures.js?v=e81470620e53. At 667×320, the live vector viewer had a 125px visible image area, horizontal and vertical arrows moved the drawing, a repeated arrow advanced its pan from 40px to 80px without changing the surrounding dialog's scroll position, Close remained visible, and Escape from the focused image restored the original trigger. This supersedes the pending gate above.

## 2026-10-24 — Land shared project filters at their results

- Confirmed that searching from the native library disclosure generated a URL such as ?q=FEA without a results fragment. Opening it in another tab showed the introduction at scroll position 0, with the filtered library 1,424px below the viewport top.
- Search, category, clear, and widen interactions now keep the generated address at #project-library. Typing updates the address without scripted scrolling or focus changes.
- Older active-filter links without a fragment or using #work are normalized with history replacement and positioned once at the library after header clearance is ready. Explicit destinations such as #experience, #contact, #about, and #top remain authoritative. Plain/unfiltered entries and subsequent Back/Forward restoration do not receive this initial repositioning.
- Files: portfolio.js, tests/portfolio.test.cjs, README.md, and all 13 pages' content-hash references. Existing categories, search matching, remembered selections, case links, and original documents remain intact.
- Verification: all 14 JavaScript suites passed, including 100 portfolio regression checks, plus all 13 pages/392 references/15 images, metadata, 70 asset references, original-document integrity, and related-work checks.
- Browser checks: a legacy FEA link at 1280px landed with the library at 108px below an 84px header, retaining body focus. At 390px, typing FEA retained the search focus and scroll position and generated #project-library; reloading the shared link showed two results below the header with no root overflow. An explicit Experience link remained at Experience. Back and Forward restored the two Boeing and three PCC results respectively.
- Deployment gate: locally verified; successful GitHub checks, Pages deployment, and live verification remain required for this batch.

### Shared-filter deployment and follow-up

- [25b42ab](https://github.com/Dustin07/DustinPortfolio/commit/25b42abd2dd90b7660f24a16ad60e273f44b2504) passed [Portfolio Checks](https://github.com/Dustin07/DustinPortfolio/actions/runs/40075569203) and [Pages deployment](https://github.com/Dustin07/DustinPortfolio/actions/runs/40075568095). Live phone inspection confirmed portfolio.js?v=23ef2beb8a33, the normalized FEA address, two results below the header, body focus on entry, and unchanged search focus/scroll during typing.
- The live explicit-section check exposed a separate initial disclosure-animation shift. The follow-up below completes the downstream-positioning verification rather than treating the initial URL's unchanged fragment as sufficient proof.

## 2026-10-24 — Stabilize section links during library restoration

- The filtered library's opening transition could move a downstream fragment destination after the browser initially positioned it. A fresh live FEA + Experience link left the Experience section around 598px below the viewport top rather than just below the header.
- The library now suppresses its disclosure transition during initial setup, through the first rendered frame. Later user-triggered opening/closing retains the existing optional motion. This stabilizes initial geometry without scripted repositioning of explicit section links.
- Added deferred-frame regressions for the setup lifecycle and for a newer explicit destination taking precedence over a queued legacy-result repositioning.
- Files: portfolio.js, styles.css, tests/portfolio.test.cjs, README.md, and all 13 pages' content-hash references. No content, claims, documents, or hosting services changed.
- Verification: all 14 JavaScript suites passed, including 102 portfolio checks, plus all 13 pages/392 references/15 images, 70 asset references, original-document integrity, and related-work checks.
- Browser checks: desktop Experience stayed at approximately 108px below an 84px header on fresh entry, after settling, and after reload, with body focus retained. The setup class was removed and the ordinary disclosure transition returned to 0.4s. At 390px, a legacy FEA link still landed at approximately 104px below an 80px header.
- Deployment gate: locally verified; successful GitHub checks, Pages deployment, and live verification remain required for this follow-up.
- Deployment verified: [ae1ea9a](https://github.com/Dustin07/DustinPortfolio/commit/ae1ea9a2c9f505f36aaf63edf35523822e775ead) passed [Portfolio Checks](https://github.com/Dustin07/DustinPortfolio/actions/runs/40076162631) and [Pages deployment](https://github.com/Dustin07/DustinPortfolio/actions/runs/40076162534). Fresh live entries served portfolio.js?v=bce1dd541c05 and styles.css?v=9f9840482a0d. At 1280px, Experience stayed at approximately 108px below an 84px header after settling, while ordinary disclosure transitions were available at 0.4s. At 390px, the legacy FEA entry normalized to the library, showed two results at approximately 104px below an 80px header, and retained body focus. This completes the shared-filter and downstream-positioning gates above.

## 2026-10-24 — Skip identical held-pose geometry updates

- This extends the earlier stage-only metadata optimization. The putter and carabiner still advance on the same schedules, but completed poses no longer rewrite identical geometry during their hold intervals.
- Before the change, instrumented held frames counted 72 geometry writes across four putter callbacks and 145 writes across 29 carabiner callbacks. Both checks now record zero repeated geometry writes, and the next scheduled stage still updates its selection, reference, and pose. These are DOM-work counts, not FPS or battery-life measurements.
- The putter includes reduced motion in its render key. Preference changes refresh the static cutter even while locally paused; restoring motion no longer leaves that cutter stale or restarts playback.
- An offline comparison against the exact preceding scripts matched 1,081 putter and 721 carabiner sampled cycle states at 60 Hz, all six machining operations and three design selections, and enabled reduced-motion states. Comparison sources and fixtures remain outside the published repository.
- Files: putter.js, carabiner.js, their two regression suites, the two case pages' content-hash references, README.md, and this record. No CSS, source images, engineering values, original PDFs, or hosting services changed.
- Verification: all 14 JavaScript suites passed, including 19 putter, 17 carabiner, and 102 portfolio checks; all 13 pages/392 references/15 images, 70 asset references, original-document integrity, and related-work checks passed. Browser checks covered all six operations at 1280px, all three designs at 390px, page-pause/manual-inspection behavior, retained local pause, and no phone root overflow.
- Print review: a temporary screen emulation of the print stylesheet confirmed that navigation and enlargement cues were already hidden. No print-style change was needed. Pagination/system printing was not tested, and both temporary repository preview files were removed before publication.
- Deployment gate: locally verified; successful GitHub checks, Pages deployment, and live verification remain required for this batch.
- Deployment verified: [4d3698c](https://github.com/Dustin07/DustinPortfolio/commit/4d3698cd5c26590f922a8730ca79826666b71f2d) passed [Portfolio Checks](https://github.com/Dustin07/DustinPortfolio/actions/runs/40077897663) and [Pages deployment](https://github.com/Dustin07/DustinPortfolio/actions/runs/40077897643). Live pages served putter.js?v=6b9cae430522 and carabiner.js?v=12f864bad3b5. At 1280px, putter playback advanced beyond the held bottom-machining pose to later operations, then paused with one selected operation and one visible reference. At 390px, carabiner playback advanced to Whole Tube with the documented 1251.5 mm³ volume and a drawing stroke-width of 32. Neither live page had root overflow. This supersedes the pending gate above.

## 2026-10-24 — Preserve comfortable phone playback targets

- At the 520px compact breakpoint, the putter playback button measured 39.1px high and the carabiner button 38.6px. Both illustration control groups now retain a 44px minimum height when compact padding and type are applied.
- Files: putter.css, carabiner.css, the two case pages' content-hash references, README.md, and this record. Existing larger controls retain their natural height; no illustration timing, geometry, content, documents, or services changed.
- Browser verification: both playback targets measured 44px at 520px. Wrapped controls at 320px and desktop controls at 1280px retained their larger natural heights. Neither case had root overflow at any of those three widths.
- Deployment gate: local layout verified; repository checks, Pages deployment, and live asset/target measurements remain required.
- Deployment verified: [69aefe3](https://github.com/Dustin07/DustinPortfolio/commit/69aefe3cba2e3002bfd0f04574312f96b1269d74) passed [Portfolio Checks](https://github.com/Dustin07/DustinPortfolio/actions/runs/40078734302) and [Pages deployment](https://github.com/Dustin07/DustinPortfolio/actions/runs/40078734180). Live inspection confirmed putter.css?v=c6bd3da8ab81 and carabiner.css?v=c7349e1a7ef6, both 44px playback targets at 520px, working putter pause, and no root overflow. Local checks also passed 19 putter, 17 carabiner, 20 engineering, original-document integrity, all 13 pages/392 references/15 images, and 70 asset references. This supersedes the pending gate above.

## 2026-10-24 — Final narrow-layout review

- Reviewed all eleven published case studies at 320px viewport width. None had root horizontal overflow or overflowing visible paragraph, heading, list-item, link, or button text in the DOM measurements. Wide table regions retain their intended internal scrolling; this check is not a claim of complete assistive-technology coverage.
- On the live home page, the Experience & Education descriptive paragraph occupied its full 1,100px desktop heading container with no maximum-width constraint. At 320px, the section and timeline occupied the same 273px content width without root overflow.
- The live body and its pseudo-elements reported no background image, the ambient preference element had no decorative children, and both home-page document actions used the unaccented label Download Resume.
- This was a verification pass against the deployed site, with no product source changes. Temporary viewport sizing was reset afterward. The earlier successful code deployments and their verification remain authoritative.

## Verification and deployment notes

- The previously committed selection-aware navigation passed 89 portfolio regression checks and real local browser flows for Boeing and FEA selections. Clearing filters restored the original project order.
- The full suite with this record passed all 14 JavaScript suites, including 89 portfolio, 24 figure-viewer, 15 motion-preference, 13 putter, and 13 carabiner checks. It also passed original-document integrity, all 13 pages, 392 references, 15 images, related-work generation, asset-version behavior, and content-hash references.
- Cleanup of 65 unused CSS selector branches removed 3,412 bytes; 24 desktop/phone render comparisons matched before and after.
- Expanded reading-spacing checks covered all 13 pages at 320px and 1280px with no root overflow or cropped reading text after the heading fix. Compact title sizing was also checked at 320, 360, 390, and 600px.
- Native-transition fixtures confirmed 180ms animations, suppression while paused, and latest preference restoration through Back/Forward. Those local-only fixtures were removed after verification.
- GitHub Actions was still reporting the selection commit's checks and Pages deployment as queued when this record was prepared. Source implementation is complete; production verification must follow successful deployment. Check the live Actions state rather than reimplementing the feature.
- README.md lists the current commands. Run checks appropriate to each new change and review real desktop/phone behavior; script checks do not constitute a full accessibility or physical-engineering certification.

## Complete historical commit index

Dates below use the commit's UTC author timestamp. This index records 183 commits through [c096d2c](https://github.com/Dustin07/DustinPortfolio/commit/c096d2cbe7bc7458ff1e195b93341b9adf7f87d8), back to the initial portfolio commit. Later work is recorded in dated entries above this index.


### 2026-10-19

- [c096d2c](https://github.com/Dustin07/DustinPortfolio/commit/c096d2cbe7bc7458ff1e195b93341b9adf7f87d8) — Keep case-study Next links within saved filtered results
- [7466e1e](https://github.com/Dustin07/DustinPortfolio/commit/7466e1e755dfe5c8776858184f924a1b13081ab6) — Dismiss navigation disclosures when keyboard focus returns to page content
- [b05886f](https://github.com/Dustin07/DustinPortfolio/commit/b05886f689ea2fd8a12b80891db5d2ceaeb15627) — Decode existing technical images asynchronously while preserving their layout dimensions
- [9bd694e](https://github.com/Dustin07/DustinPortfolio/commit/9bd694ea39ce8296a5ff0696f83cfa371eeb459b) — Scale compact case-study headings smoothly across phone widths
- [7b22bc2](https://github.com/Dustin07/DustinPortfolio/commit/7b22bc20d3988ba2607acf4518cc5bf4ceda682b) — Preserve vector chart descriptions in the enlarged figure viewer
- [9971e7f](https://github.com/Dustin07/DustinPortfolio/commit/9971e7fabd194cd5afe0dd8991831d8009b8b96e) — Keep long case-study titles readable on compact screens and with custom text spacing
- [f101e7e](https://github.com/Dustin07/DustinPortfolio/commit/f101e7e1bc6869bd3831bc2cedd0ead9d2a7e626) — Improve hero link touch areas and expose a named project-search landmark
- [d50c413](https://github.com/Dustin07/DustinPortfolio/commit/d50c41360958c8096991c1abfd52af2116243be1) — Keep page alignment stable while technical figures are enlarged
- [e010b90](https://github.com/Dustin07/DustinPortfolio/commit/e010b90041f1578d3d690cd4117c3fef7e17b4e1) — Add restrained native page transitions with motion-safe history restoration
- [7b726d3](https://github.com/Dustin07/DustinPortfolio/commit/7b726d349a01dbc210988a666a352440f5e5e720) — Explain ergonomic and casting design processes with concise workflow summaries
- [b82ce38](https://github.com/Dustin07/DustinPortfolio/commit/b82ce3897885220bf49d8d6d11e7a334533686d6) — Remove unused legacy portfolio styles without changing active layouts
- [bc66b13](https://github.com/Dustin07/DustinPortfolio/commit/bc66b13174b0bc02f2cd57ff50c6c3d0b92edce5) — Preserve keyboard focus across responsive navigation layouts
- [ed509d7](https://github.com/Dustin07/DustinPortfolio/commit/ed509d7747f0619e3075f36e4bd2fdb3ad677add) — Present project documents as readable rows with verified file sizes
- [91e71e9](https://github.com/Dustin07/DustinPortfolio/commit/91e71e9c5b7690f5cf68c9ffe07b96c13df6be9c) — Return case studies directly to the saved project library view

### 2026-10-16

- [8db9046](https://github.com/Dustin07/DustinPortfolio/commit/8db904664c88b483b792aa2df8c2c579658d1933) — Open timeline project links directly at filtered library results
- [049d5a2](https://github.com/Dustin07/DustinPortfolio/commit/049d5a2f701b881037e09a651dc46205ac78271a) — Keep figure enlargement controls clear of engineering data
- [327a204](https://github.com/Dustin07/DustinPortfolio/commit/327a20474765f761262b7553583e3751039c4d90) — Clarify engineering analysis hierarchy and table navigation
- [7330db5](https://github.com/Dustin07/DustinPortfolio/commit/7330db5855e9a1c1784c4812daf2dbb493270c7b) — Keep compact case-study contents accessible while reading
- [4aacd7e](https://github.com/Dustin07/DustinPortfolio/commit/4aacd7e4aa70d98b61933abb2902f8006abca1ca) — Improve capability readability and simplify contact actions
- [2bfab6b](https://github.com/Dustin07/DustinPortfolio/commit/2bfab6b623fed87224cb4024aee7994ca461699f) — Improve phone card spacing and keep project result counts visible
- [d4a57a5](https://github.com/Dustin07/DustinPortfolio/commit/d4a57a50f0699833ef69bada37da3a0ac55bf85e) — Align desktop experience timeline markers with their dates and cards
- [c4a4958](https://github.com/Dustin07/DustinPortfolio/commit/c4a49587a3c6b48fe9cd3f8c6b96b7d706fd2f92) — Replace wave backdrop with clean surfaces and fix experience text width

### 2026-10-15

- [390410d](https://github.com/Dustin07/DustinPortfolio/commit/390410df7db16947ce533aec8a365a2300eb11ef) — Clarify horizontal scrolling for wide engineering tables
- [de282d7](https://github.com/Dustin07/DustinPortfolio/commit/de282d701834e26cabd1c8ece584b329de17a767) — Keep card entrances one-time when toggling page motion
- [9258616](https://github.com/Dustin07/DustinPortfolio/commit/925861615b996d6efbb73e81d2024973227af36f) — Polish responsive project discovery and respect motion preferences throughout
- [4aee929](https://github.com/Dustin07/DustinPortfolio/commit/4aee929d21456ac300da0fa819a9e205bcfb9be2) — Refine case-study reading rhythm and technical figure presentation
- [e770f6c](https://github.com/Dustin07/DustinPortfolio/commit/e770f6c64d0788514a9c626793ebddf630c7fea1) — Add lightweight visual previews to featured engineering projects
- [44d4e5e](https://github.com/Dustin07/DustinPortfolio/commit/44d4e5e85fe1322348058713b847c0763a0f125f) — Refine portfolio spacing and add accessible progressive motion

### 2026-10-14

- [9ffc850](https://github.com/Dustin07/DustinPortfolio/commit/9ffc85003ae37ca019c0725fc5195e1d119893be) — Clarify page animation controls and synchronize tensile pause state
- [7c1caf2](https://github.com/Dustin07/DustinPortfolio/commit/7c1caf22113a6d809c51e5a3186bd93709d51b84) — Simplify portfolio surfaces and typography for a cleaner presentation
- [2bdec36](https://github.com/Dustin07/DustinPortfolio/commit/2bdec36be0c59b5e9aae6163d37bdcb8c933a8af) — Animate engineering workflows with accessible motion controls
- [e8e8105](https://github.com/Dustin07/DustinPortfolio/commit/e8e8105a3a7f64eb853063b338667b305249944b) — Improve mobile introduction, project discovery, and recent experience

### 2026-10-13

- [4e5a7f4](https://github.com/Dustin07/DustinPortfolio/commit/4e5a7f4c65f83c529fa1be07b295672f1aef49bf) — Use unaccented Resume labels and consolidate shared card styles

### 2026-10-06

- [015457e](https://github.com/Dustin07/DustinPortfolio/commit/015457e73491c28b52566b2761f7aef05ef83256) — Clarify carabiner model evidence and three-metric design trade-offs
- [bb458a8](https://github.com/Dustin07/DustinPortfolio/commit/bb458a8cea1d8a8923b9e6430638e9cd117a16ad) — Clarify rocket material testing method, findings, and validation scope
- [04a5e29](https://github.com/Dustin07/DustinPortfolio/commit/04a5e297b7a3ee6018333d2cd616cbde54eea95f) — Unify project previews and tighten case-study narratives
- [2905743](https://github.com/Dustin07/DustinPortfolio/commit/2905743eba21ae589656d90ac5652b3fe223fb28) — Preserve exact asset bytes for content-version checks
- [b60a6af](https://github.com/Dustin07/DustinPortfolio/commit/b60a6aff1e0c6a2da796cb8da14589e875808d19) — Feature strongest engineering work and simplify portfolio presentation
- [a78a71f](https://github.com/Dustin07/DustinPortfolio/commit/a78a71f6a25228037eafe3738951574895e179d9) — Correct reduced-spine animation to show front-face flattening
- [1838bc6](https://github.com/Dustin07/DustinPortfolio/commit/1838bc61bb1278b493b01ad2d98bc2b9e08da10f) — Add an illustrated carabiner geometry and result comparison
- [388a458](https://github.com/Dustin07/DustinPortfolio/commit/388a4584fcff01f94ebe67418bfcd2a0becf971f) — Expand putter animation into a report-backed manufacturing sequence
- [c59a76f](https://github.com/Dustin07/DustinPortfolio/commit/c59a76fcde17ca54703d62037143aef6baad31c0) — Add an illustrated putter machining loop with original CAM references
- [0b56266](https://github.com/Dustin07/DustinPortfolio/commit/0b5626672f473da156f7e4fc8a917690c48df448) — Add a motion-accessible dogbone tensile test illustration

### 2026-10-05

- [e72992e](https://github.com/Dustin07/DustinPortfolio/commit/e72992e9745fbe29c2270d6f38ae3c1de2600521) — Clarify engineering trade-offs and improve recruiter evidence paths
- [7893970](https://github.com/Dustin07/DustinPortfolio/commit/7893970ce7c083af2df80e2cf5d05d126dbc108b) — Connect related engineering cases and polish compact navigation
- [b0b98e5](https://github.com/Dustin07/DustinPortfolio/commit/b0b98e56c89fd1422de83910c5754b145ace30e8) — Add original-size figure inspection and prevent stale assets
- [b725768](https://github.com/Dustin07/DustinPortfolio/commit/b725768dba526e9fb0d4f17a0ec93f8f1bf1a216) — Improve technical figure viewing, project navigation, and portfolio sharing

### 2026-10-04

- [1bbf1de](https://github.com/Dustin07/DustinPortfolio/commit/1bbf1def2d0c0b647f4d8cf0fcfc9a6778a48096) — Use the current official IREC competition name
- [eb91276](https://github.com/Dustin07/DustinPortfolio/commit/eb91276b02e74e0161a5f62d0b011543b6723bc3) — Clean up styling experiments and preserve accessible list semantics
- [52abd5d](https://github.com/Dustin07/DustinPortfolio/commit/52abd5d9b56e4ac0e234044823fa7442b0e648f4) — Protect original project documents with integrity checks
- [3a2a59d](https://github.com/Dustin07/DustinPortfolio/commit/3a2a59dfff3a1533f9758d1df453f274834c3658) — Improve engineering search relevance and document accessibility
- [731eff9](https://github.com/Dustin07/DustinPortfolio/commit/731eff9ddb3b16b257792999dfd469c53eb31706) — Run dependency-free portfolio checks on repository changes
- [c6bddbb](https://github.com/Dustin07/DustinPortfolio/commit/c6bddbbba75261115ccd351ca55a6d346672b8e6) — Clarify engineering ownership and improve case-study reading layouts
- [019513e](https://github.com/Dustin07/DustinPortfolio/commit/019513e56eaeebc2f6dfd2065c162fcbc8eb8938) — Make every case study discoverable and add visitor motion control
- [8a9bf40](https://github.com/Dustin07/DustinPortfolio/commit/8a9bf40836fab40b6588f1ec1fc60148dd0cfb03) — Improve reading contrast, mobile tables, and technical wording
- [034150a](https://github.com/Dustin07/DustinPortfolio/commit/034150ad5bf1fbb2755f44c6ea1ad1e4188186b8) — Improve recruiter review tools, mobile navigation, and portfolio reliability
- [c442003](https://github.com/Dustin07/DustinPortfolio/commit/c442003b19e476711949c93d012514884234f0d7) — Polish engineering evidence, mobile access, and search metadata
- [5a73d32](https://github.com/Dustin07/DustinPortfolio/commit/5a73d323db6eb9c3dbf46fd913f4ccf77a153e7a) — Build evidence-first aerospace portfolio and NASA research case study

### 2026-10-01

- [27e9d3f](https://github.com/Dustin07/DustinPortfolio/commit/27e9d3f0f7310f923036d0cdb7d0b45ada7c9932) — Introduce aerospace airflow background behind glass panels
- [112d66c](https://github.com/Dustin07/DustinPortfolio/commit/112d66c5854e89a94a15e62baf68960ca8d1c67c) — Standardize title capitalization throughout portfolio
- [e93cc0f](https://github.com/Dustin07/DustinPortfolio/commit/e93cc0f3cb9f4ffc458e5e61004cbb74c502c82f) — Capitalize Mechanical Engineering in portfolio footers
- [5c55f8f](https://github.com/Dustin07/DustinPortfolio/commit/5c55f8f547b3c2581489b1e8512262ccdd2c0991) — Strengthen liquid glass surfaces and flowing water highlights
- [9bf7969](https://github.com/Dustin07/DustinPortfolio/commit/9bf796917fce4aa76b60ade31f7a22ca5174293d) — Add flowing gradient and frosted glass portfolio surfaces
- [9a4a074](https://github.com/Dustin07/DustinPortfolio/commit/9a4a0745e8769455cfd6a057aff14ee82f376dc6) — Remove background gradients for sleeker portfolio
- [6b08ff0](https://github.com/Dustin07/DustinPortfolio/commit/6b08ff0a111c258d50972a12a1293f16f89217fc) — Refine engineering portfolio layout and equalize project cards
- [2f4be4a](https://github.com/Dustin07/DustinPortfolio/commit/2f4be4a3d95f303f9edcfc758eb4e556ad011c91) — Restore clean circular DL badge
- [65f0aa3](https://github.com/Dustin07/DustinPortfolio/commit/65f0aa37e8648d07a7b0af221d570f26905d3b44) — Restore original DL logo across portfolio
- [076e921](https://github.com/Dustin07/DustinPortfolio/commit/076e921d468da9361350a62d4b7811aae1c0c75f) — Publish clean DL logo for comparison
- [4af36dd](https://github.com/Dustin07/DustinPortfolio/commit/4af36dd448946f73d6c864bbb2a1a4dd00d47845) — Try clean DL header monogram
- [c7d3376](https://github.com/Dustin07/DustinPortfolio/commit/c7d33767e1e99b13a5a87c9e0af3efb967c2e89b) — Publish polished professional DL mark
- [1caf464](https://github.com/Dustin07/DustinPortfolio/commit/1caf4642791c006df5d604ff3bae735fceaca9fa) — Polish DL logo spacing and visual balance
- [15e7791](https://github.com/Dustin07/DustinPortfolio/commit/15e779186df226a48cabe694f3a5f790efad9b74) — Publish symmetric curved DL logo
- [33e8600](https://github.com/Dustin07/DustinPortfolio/commit/33e8600a956a89f545e93890aac719eb2467cfac) — Rebuild DL mark with symmetric curve and line geometry

### 2026-09-30

- [7d1e305](https://github.com/Dustin07/DustinPortfolio/commit/7d1e305dfb7f22bf74f60ce103f93817cf2afdb7) — Publish balanced 45-degree DL monogram
- [43bb085](https://github.com/Dustin07/DustinPortfolio/commit/43bb085f47b46869879bcb8ccb3bfd508fefe23d) — Replace abstract mark with balanced recognizable DL monogram
- [02a3c05](https://github.com/Dustin07/DustinPortfolio/commit/02a3c0558b45b28b01e3a9611c87e5b1a005c04a) — Publish sharp geometric DL logo
- [0af040d](https://github.com/Dustin07/DustinPortfolio/commit/0af040d35e59762f0d131670fb76bc051c9dd509) — Refine logo into sharp geometric aerospace mark
- [5c60119](https://github.com/Dustin07/DustinPortfolio/commit/5c601193544bf1036aab53987423468af1d0585a) — Publish diagonal orange and green DL logo
- [9c7f4e3](https://github.com/Dustin07/DustinPortfolio/commit/9c7f4e398d6b6c9fba270c4ed9cac827b9f2af37) — Rebuild DL logo around diagonal symmetry
- [48e6a5e](https://github.com/Dustin07/DustinPortfolio/commit/48e6a5eeae7a9d43765b3f7cc266a37859b69f8e) — Publish balanced 45-degree DL logo
- [b9e34ec](https://github.com/Dustin07/DustinPortfolio/commit/b9e34eca028e3efadd6b81fe2b39e21bde60d000) — Rotate D monogram to 45 degrees
- [44613db](https://github.com/Dustin07/DustinPortfolio/commit/44613db10c87b910582ca7524dc2256c1e759952) — Publish satellite orbit DL logo
- [4ed8c7f](https://github.com/Dustin07/DustinPortfolio/commit/4ed8c7f07ab74d3e07410ab87bc9f1aabc8bb450) — Place logo satellite dot on circular orbit
- [cb51f7d](https://github.com/Dustin07/DustinPortfolio/commit/cb51f7d7a5be1807337ba9d8c3fe69f128870f14) — Publish separated 3 o'clock DL logo
- [948d7b4](https://github.com/Dustin07/DustinPortfolio/commit/948d7b4683c65c8ee6b60162219915a6d929b12a) — Separate timer hand from circular logo rim
- [4528c8a](https://github.com/Dustin07/DustinPortfolio/commit/4528c8a3ee96ac3b85cb4f89f06b4ad11181e6df) — Publish timer-style DL logo and favicon
- [c85e57c](https://github.com/Dustin07/DustinPortfolio/commit/c85e57c96380c16c0da64ea95d97b4e2e5d51f9d) — Create sketch-led timer DL logo
- [7a2d199](https://github.com/Dustin07/DustinPortfolio/commit/7a2d1996bc9e9c6014e4aa33f8827b7d1b536f33) — Publish orbital DL logo and favicon
- [4e79a90](https://github.com/Dustin07/DustinPortfolio/commit/4e79a908c3306e0fb6ae0cde506a2d1adac9f084) — Apply orbital logo across project pages
- [418b178](https://github.com/Dustin07/DustinPortfolio/commit/418b1786ff15ee9be033ae893da7fa5b6cf4c75c) — Apply orbital logo across project pages
- [01881d8](https://github.com/Dustin07/DustinPortfolio/commit/01881d826ac93f6dd4e18718964de486d97ee93e) — Apply orbital logo across project pages
- [f6246f8](https://github.com/Dustin07/DustinPortfolio/commit/f6246f8cb015bcff67604e733a07ea6e91d559a5) — Apply orbital logo across project pages
- [c42071b](https://github.com/Dustin07/DustinPortfolio/commit/c42071b0cff3724be3c8ad9cb05ac6321585dee8) — Apply orbital logo across project pages
- [ac0bf32](https://github.com/Dustin07/DustinPortfolio/commit/ac0bf329f6d638cab3f497db68f7b5d66064f411) — Apply orbital logo across project pages
- [ba128ae](https://github.com/Dustin07/DustinPortfolio/commit/ba128ae756a6032079a801abd386aee654ede82c) — Apply orbital logo across project pages
- [6d739c4](https://github.com/Dustin07/DustinPortfolio/commit/6d739c485796f419c0ffb4351510401c5a5de8ee) — Apply orbital logo across project pages
- [0a3e11f](https://github.com/Dustin07/DustinPortfolio/commit/0a3e11fd5aaa599fadb257b957e3fb10dca30225) — Apply orbital logo across project pages
- [75aad8e](https://github.com/Dustin07/DustinPortfolio/commit/75aad8ee77c43dac9246184f7bd1f12efb1109f0) — Apply orbital logo across project pages
- [56421d1](https://github.com/Dustin07/DustinPortfolio/commit/56421d16f7e83488cada89ba6ac2ffd68890e446) — Create softer orbital DL mark
- [2ddf4dc](https://github.com/Dustin07/DustinPortfolio/commit/2ddf4dc8a74095cc09444b326f8b57e8c8a75d70) — Publish capitalized heading and new DL logo
- [6ad970d](https://github.com/Dustin07/DustinPortfolio/commit/6ad970d5ca272e4dc377329c0e7df7a625440370) — Refresh project page logo
- [5f1f998](https://github.com/Dustin07/DustinPortfolio/commit/5f1f99845822f20d584cc5e9b2cc292197719800) — Refresh project page logo
- [7663af3](https://github.com/Dustin07/DustinPortfolio/commit/7663af35e251994c66ab54af7569d904063fa310) — Refresh project page logo
- [b7c54da](https://github.com/Dustin07/DustinPortfolio/commit/b7c54da9d30691cbe92a37ec4193659c6351b4a0) — Refresh project page logo
- [488e98a](https://github.com/Dustin07/DustinPortfolio/commit/488e98abdd8b0d2f07988bfca3b1e6581188e64a) — Refresh project page logo
- [c21a664](https://github.com/Dustin07/DustinPortfolio/commit/c21a6647d9a1ed5c7f394e144a8044f6ac6f0830) — Refresh project page logo
- [f40be56](https://github.com/Dustin07/DustinPortfolio/commit/f40be5643ebe0a6635adb49c2a304de9febd4f3f) — Refresh project page logo
- [968548a](https://github.com/Dustin07/DustinPortfolio/commit/968548ad0e1dd99a6e5474381d356a6e136e637d) — Refresh project page logo
- [d7d6ff1](https://github.com/Dustin07/DustinPortfolio/commit/d7d6ff1dca6948ce7908cac9f22504af380266bf) — Refresh project page logo
- [b48b06d](https://github.com/Dustin07/DustinPortfolio/commit/b48b06da790307c71ff5fb6f529338ef39d9239c) — Refresh project page logo
- [5ff9f27](https://github.com/Dustin07/DustinPortfolio/commit/5ff9f277b2e8f5c5c2dbaec9a13b0efd0ab41b85) — Add DL engineering monogram
- [7cb394b](https://github.com/Dustin07/DustinPortfolio/commit/7cb394b8788e47ffd374fde4ec2112fa1a25981a) — Use NASA in homepage experience strip
- [fd7c1e9](https://github.com/Dustin07/DustinPortfolio/commit/fd7c1e9225c310313e826d058747850889c36eac) — Publish consistent portfolio spacing
- [41a2240](https://github.com/Dustin07/DustinPortfolio/commit/41a22401deca970b209a64e75d49c37b275d2e11) — Apply consistent project page spacing
- [e0d95c3](https://github.com/Dustin07/DustinPortfolio/commit/e0d95c3e56183ce5129fcc8b0bdc201fda793444) — Apply consistent project page spacing
- [969fd01](https://github.com/Dustin07/DustinPortfolio/commit/969fd01fb7d6632996d88edc5252dda7fcda8235) — Apply consistent project page spacing
- [3d78c9c](https://github.com/Dustin07/DustinPortfolio/commit/3d78c9cdf9bd7e4241cd53cd292ba1f393e1ba75) — Apply consistent project page spacing
- [48ad69a](https://github.com/Dustin07/DustinPortfolio/commit/48ad69af9ddbc7012f467d9eed3e434b90beb1c5) — Apply consistent project page spacing
- [3225601](https://github.com/Dustin07/DustinPortfolio/commit/3225601c5b39a53c5142208df26ec2495c09577e) — Apply consistent project page spacing
- [e4e1fb8](https://github.com/Dustin07/DustinPortfolio/commit/e4e1fb882e4ed027d978cf9c282f78f9a687804a) — Apply consistent project page spacing
- [9acbced](https://github.com/Dustin07/DustinPortfolio/commit/9acbcedb70e92324fd95b46e24f75bfcb3b3c916) — Apply consistent project page spacing
- [14a3582](https://github.com/Dustin07/DustinPortfolio/commit/14a3582ae63f44d06674b3e592fe2fd3f8427cb1) — Apply consistent project page spacing
- [25986b5](https://github.com/Dustin07/DustinPortfolio/commit/25986b585f70b7b6ef82030bc79a51d291549a2c) — Apply consistent project page spacing
- [a2efe90](https://github.com/Dustin07/DustinPortfolio/commit/a2efe90bf159be3379f2d2043478acb3ed2b209a) — Standardize spacing and aerospace curves
- [318c3a5](https://github.com/Dustin07/DustinPortfolio/commit/318c3a54570d5ac9e230b375d00d5ea3a3c730f5) — Publish engineering journey timeline
- [bbe6d7f](https://github.com/Dustin07/DustinPortfolio/commit/bbe6d7ff1a56671bb6ebc6734f632112ada40e94) — Add responsive engineering journey timeline
- [5dab634](https://github.com/Dustin07/DustinPortfolio/commit/5dab6344149c8d521994c281aaba76f107f91ca0) — Publish softer portfolio design
- [fa93dfc](https://github.com/Dustin07/DustinPortfolio/commit/fa93dfc6cf036e819a1bbef08e5727e229e287c0) — Apply softer portfolio styling
- [71c3e60](https://github.com/Dustin07/DustinPortfolio/commit/71c3e603b3274450c6a15686d21aae55b1b49fc0) — Apply softer portfolio styling
- [9c31923](https://github.com/Dustin07/DustinPortfolio/commit/9c31923db1c45eb8f125333a8e87b391ede9e27f) — Apply softer portfolio styling
- [56c2ba5](https://github.com/Dustin07/DustinPortfolio/commit/56c2ba5c4c8d7a5777d1da5f1eaed1fcb54895e6) — Apply softer portfolio styling
- [7aceae4](https://github.com/Dustin07/DustinPortfolio/commit/7aceae461b9523c9739d39ca2add9a478020b929) — Apply softer portfolio styling
- [c51f96c](https://github.com/Dustin07/DustinPortfolio/commit/c51f96cb551117fcff6d3c99714d00749bc1d8c6) — Apply softer portfolio styling
- [61162d8](https://github.com/Dustin07/DustinPortfolio/commit/61162d85d52845691a50bc3a136712aed4f8c833) — Apply softer portfolio styling
- [0e19859](https://github.com/Dustin07/DustinPortfolio/commit/0e198591c2e6b22da7650a6b4c70c01258e3b034) — Apply softer portfolio styling
- [0ab61ef](https://github.com/Dustin07/DustinPortfolio/commit/0ab61ef6fe11f47c747aeecb8c66e058b918ba82) — Apply softer portfolio styling
- [e247b53](https://github.com/Dustin07/DustinPortfolio/commit/e247b53d64ab55e94e2ceca494b2ad233f1736fc) — Apply softer portfolio styling
- [f99ca22](https://github.com/Dustin07/DustinPortfolio/commit/f99ca22aedc5acd59b0db0ddbf23be191d5326bd) — Soften portfolio layout and card styling
- [fc8bad5](https://github.com/Dustin07/DustinPortfolio/commit/fc8bad58ade426538693273938f2691bd547c667) — Deploy final portfolio cleanup and project files
- [9cee949](https://github.com/Dustin07/DustinPortfolio/commit/9cee94936e8a16298845ce26b86e529576ffdb92) — Remove small portfolio disclaimer text
- [11d70ac](https://github.com/Dustin07/DustinPortfolio/commit/11d70ac842ce7027e1b554d757556988f4ee56c5) — Remove small portfolio disclaimer text
- [8f658b1](https://github.com/Dustin07/DustinPortfolio/commit/8f658b117305694b8d2b5d89a5bbcea6e77016e9) — Remove small portfolio disclaimer text
- [1351e40](https://github.com/Dustin07/DustinPortfolio/commit/1351e40a5d439334dd7bee5dbe6931ddbaa57d48) — Remove small portfolio disclaimer text
- [3e5dcf8](https://github.com/Dustin07/DustinPortfolio/commit/3e5dcf8dd9b4c30d8f0d34db75e673abe92ce83b) — Remove small portfolio disclaimer text
- [7422cd1](https://github.com/Dustin07/DustinPortfolio/commit/7422cd196e85cc6a80bc543bcdb62bddcefeaee9) — Remove small portfolio disclaimer text
- [6e04944](https://github.com/Dustin07/DustinPortfolio/commit/6e049445ee044f97a18538cebbafe7a23bbd78e9) — Refresh project file styling
- [3fd2987](https://github.com/Dustin07/DustinPortfolio/commit/3fd2987b8a67782c17470b10d663c1a19b1cf0cf) — Refresh project file styling
- [1508960](https://github.com/Dustin07/DustinPortfolio/commit/150896001033f30c34de7b31fc34852ccad8908c) — Refresh project file styling
- [48c336d](https://github.com/Dustin07/DustinPortfolio/commit/48c336dd45704b4abcbc5f9f3086c48756c71bda) — Refresh project file styling
- [75d69ee](https://github.com/Dustin07/DustinPortfolio/commit/75d69ee185371d1322f36ffa50e8376120175f8b) — Refresh project file styling
- [58a10cb](https://github.com/Dustin07/DustinPortfolio/commit/58a10cb8f29332947b026b97e3738fa2f4adc23e) — Add project files and simplify education text
- [55d332f](https://github.com/Dustin07/DustinPortfolio/commit/55d332faba60f973ae3e619d7035f13bdb1bca69) — Add project files and simplify education text
- [570d5cc](https://github.com/Dustin07/DustinPortfolio/commit/570d5cc81c29f924fdeed96e39a2be9712166942) — Add project files and simplify education text
- [ee8da96](https://github.com/Dustin07/DustinPortfolio/commit/ee8da96eddf4ff9dde0d87866df6010abf5769a0) — Add project files and simplify education text
- [726e32f](https://github.com/Dustin07/DustinPortfolio/commit/726e32f1a04f00674e54e97e87d0bffb80af913f) — Add project files and simplify education text
- [faf7d78](https://github.com/Dustin07/DustinPortfolio/commit/faf7d787b208abfdaf745371935d05950b900e7a) — Add project files and simplify education text
- [3db319e](https://github.com/Dustin07/DustinPortfolio/commit/3db319e7dc222da192406820d520ded36a311501) — Add project files and simplify education text
- [38801eb](https://github.com/Dustin07/DustinPortfolio/commit/38801eb1c5076e7270328a07480dcea9be5ed343) — Add project files and simplify education text
- [094658c](https://github.com/Dustin07/DustinPortfolio/commit/094658cdc9c3bde538c702728284c41198329730) — Add project files and simplify education text
- [104720a](https://github.com/Dustin07/DustinPortfolio/commit/104720aff94abe0838ee812e371d57cf1d3232e7) — Add project files and simplify education text
- [730152c](https://github.com/Dustin07/DustinPortfolio/commit/730152ca4b609a3ead3e64e77df371f0286eb594) — Add project files and simplify education text
- [3700ed8](https://github.com/Dustin07/DustinPortfolio/commit/3700ed84e15b6a238fd034077c51c13275ce9e9a) — Add project files and simplify education text
- [50c7ff4](https://github.com/Dustin07/DustinPortfolio/commit/50c7ff433751f761cc93d96ee47f9df1ec661623) — Add academic project reports and notebooks
- [67b9aa5](https://github.com/Dustin07/DustinPortfolio/commit/67b9aa584024c4c12d2edd0e092ca5986ca3154f) — Connect full project case study navigation
- [61e7c9b](https://github.com/Dustin07/DustinPortfolio/commit/61e7c9ba3f4580057579c7a469849a91a846ad3e) — Connect full project case study navigation
- [0790314](https://github.com/Dustin07/DustinPortfolio/commit/0790314553ca1486808b4137e8248d8ab2c7669b) — Link every portfolio card to its case study
- [84e0263](https://github.com/Dustin07/DustinPortfolio/commit/84e02638e068ea7ce71b076523c32f58e44a8042) — Publish cleared industry project case study
- [9d5ea69](https://github.com/Dustin07/DustinPortfolio/commit/9d5ea694a10a50c8bca0ee16e0eaaaaa644382db) — Publish cleared industry project case study
- [3186031](https://github.com/Dustin07/DustinPortfolio/commit/3186031e5b9d6341d93f9c8e12734d9aafecacf5) — Publish cleared industry project case study
- [0994423](https://github.com/Dustin07/DustinPortfolio/commit/0994423eff083529932c7db1bedc74e899f9bf4d) — Publish cleared industry project case study
- [a0d94e7](https://github.com/Dustin07/DustinPortfolio/commit/a0d94e7138062a5fa1ca05d39ecd8f9fd104533e) — Publish cleared industry project case study
- [2546aab](https://github.com/Dustin07/DustinPortfolio/commit/2546aab56333d6ca14699c21c68ba19c4b4f8c7b) — Keep next-project navigation within published academic case studies
- [1d15c8b](https://github.com/Dustin07/DustinPortfolio/commit/1d15c8bb0f1551e989dbda105c472187ba6cf929) — Keep next-project navigation within published academic case studies
- [7a4bedc](https://github.com/Dustin07/DustinPortfolio/commit/7a4bedc96aed836eb185150112b0a243f6668cee) — Apply Oregon State and Michigan colors and link academic project case studies
- [6ab6e9a](https://github.com/Dustin07/DustinPortfolio/commit/6ab6e9a66b62d2e258a8bf504ad0f35ac33d72d3) — Add academic engineering case study
- [f987794](https://github.com/Dustin07/DustinPortfolio/commit/f987794cba67a412f1d0827a7a0cf49e4961c2ea) — Add academic engineering case study
- [a6d891f](https://github.com/Dustin07/DustinPortfolio/commit/a6d891fadcd1b97321f6c92477a610d4f57b5303) — Add school-inspired portfolio styles and project case studies
- [e617930](https://github.com/Dustin07/DustinPortfolio/commit/e617930989ce2d9d342bcef3891c30c1bb5a06ca) — Add school-inspired portfolio styles and project case studies
- [6feaf3d](https://github.com/Dustin07/DustinPortfolio/commit/6feaf3dc1f2f88ccbab6b59a90f355c0229b935a) — Add school-inspired portfolio styles and project case studies
- [9c76073](https://github.com/Dustin07/DustinPortfolio/commit/9c760735c42c9f6b0dcee452b6f1cfe736affa46) — Add school-inspired portfolio styles and project case studies
- [dbf4ada](https://github.com/Dustin07/DustinPortfolio/commit/dbf4ada9968ccecb1266b8fae1f8b1131df87ae5) — Redesign portfolio with clear project cards, results, and compact layout
- [f8ac0cf](https://github.com/Dustin07/DustinPortfolio/commit/f8ac0cff503fef9049162d6a692f66f7db78ceea) — Serve portfolio as plain static HTML
- [6049203](https://github.com/Dustin07/DustinPortfolio/commit/6049203f5bd884784d5d0c1e6ef36a2d38702e69) — Add Dustin Leung engineering portfolio


## 2026-11-13 — Link Michigan research lab

- Added a Visit S2A Lab link beneath the existing University of Michigan graduate-research entry, using the existing timeline link style and an accessible new-tab label.
- Files: index.html and CHANGELOG.md. No new research claims were added; a description of Dustin's own research awaits his supplied details.
- Verification: all 14 JavaScript test suites, site checks (13 pages, 393 references, 15 images), 10 asset tests, related-work checks, and 70 content-hash asset references passed. Windows checkout line endings were normalized for the asset check without changing published assets.
- Deployment gate: GitHub Actions, Pages deployment, and live verification remain pending.

## 2026-11-13 — Add Michigan WAAM research case study

- Added a manufacturing-first research case based on Dustin’s supplied public-copy handoff. Includes thermal modeling, CAD/path workflows, sequence studies, numerical verification, experimental preparation, and current limitations.
- At Dustin’s request, results and performance figures are omitted from the page and project card. The copy covers methods and current status, with physical validation pending. No confidential workspace references, partner settings, or private figures are published.
- Linked the case from the Michigan timeline and the 12-project library; extended related-work generation, next-project navigation, sitemap, and content checks. The earlier S2A link addition passed GitHub checks and Pages deployment and was verified live.
- Verification: all 14 JavaScript suites, including 21 engineering checks; 10 asset tests; 14 pages/422 references/15 images; 24 related links; and 75 asset references passed. Original documents remain unchanged.
- Deployment gate: local browser preview was unreachable from the connected browser. GitHub checks, Pages deployment, and live desktop/phone review are required before reporting the research update live.

## 2026-11-13 — Add portrait to the introduction

- Added Dustin’s supplied headshot beside the desktop introduction and above it on phones, with responsive sizing, descriptive alternative text, reserved dimensions, and a web-sized JPEG copy. The original source photo is unchanged.
- The research page without results passed Portfolio Checks and Pages deployment and was reviewed live on desktop and phone. The ongoing review goal preserves the instruction to keep research results unpublished.
- Files: home page, shared stylesheet, all page asset-version references, portrait asset, and this record.
- Verification: all 14 JavaScript suites and site checks (14 pages, 423 references, 16 images) passed. No original documents changed. Live desktop/phone crop and layout review remains the deployment gate.

## 2026-11-13 — Add WAAM context photos and repair publishing transfer

- Added example print and gantry-machine photo panels from Arthur, Liu, and Oliveira (2025), Figures 9(a) and 8(a), under CC BY 4.0. Captions credit the authors, link the original figures and license, and identify the examples as another group’s work. Surrounding figure panels are clipped from view. No project research results are added.
- Corrected a transfer parsing error that omitted HTML prefixes during the headshot publication. Complete document headers are restored; future transfer reads use an explicit marker and verify the doctype before publication.
- Files: WAAM case, two source figure images, shared styles, all asset-version references, and this record.
- Deployment gate: repository checks and live responsive verification remain required.
- Responsive review: the live desktop portrait fits beside the introduction. The first phone version used 300px of height before the name; the compact portrait now uses 180px to bring identity and actions higher. The repaired publication passed both Portfolio Checks and Pages deployment.

## 2026-11-13 — Add current-research spotlight and About introduction

- Added a dedicated Current Research section before Selected Work so visitors can discover the Michigan WAAM work directly. It introduces the research question and methods, links the case and S2A Lab, and reuses the credited published example photo. Research results and performance figures remain unpublished.
- Added an About introduction connecting the existing public Michigan, NASA, Boeing, and PCC background, with a link to the experience timeline. This batch follows Dustin’s request to prioritize useful additions and sections.
- Files: index.html, styles.css, README.md, all stylesheet-version references, and this record. No new external requests, original-document changes, or paid services.
- Verification: all 14 JavaScript suites, 10 asset tests, 14 pages/435 references/19 images, related-work generation, and 75 asset versions passed. Real local browser review covered desktop (1280px), phone (390px), and narrow phone (320px) layouts with no root overflow. The new research action opened the correct case study.
- Previous batch verified: 0f5e4acc35db3784a8026bbf591b1c29a0fcce50 passed Portfolio Checks and Pages deployment. Live review confirmed both example photos, their credits, and the 144×180px compact portrait. This supersedes its pending deployment gate above.
- Deployment gate: successful GitHub checks, Pages deployment, and live verification remain required for these new sections.

## 2026-11-13 — Add cross-employer engineering-focus browsing

- Added an Engineering Focus selector to the project library for additive manufacturing, design/tooling, simulation/analysis, testing/inspection, and software/automation. Curated subject memberships combine with existing employer filters and keyword search; they add no engineering-result claims.
- Focus selections use shareable URLs, browser history, tab-local preferences, explicit case-study return links, and matching Next Result order. Clear Filters clears all restrictions; an empty keyword search can widen across focus and employer restrictions.
- Added Research to the main navigation on the home page and all case studies, and added the WAAM example photos to that case’s contents menu. Compact navigation now uses two columns with larger tap areas.
- Files: index.html, portfolio.js, styles.css, case headers, the WAAM contents menu, navigation tests, README.md, asset-version references, and this record. Original documents and unpublished WAAM results remain unchanged.
- Verification: all 14 JavaScript suites passed, including 115 portfolio checks, plus 10 asset tests, 14 pages/449 references/19 images, 24 related-work links, and 75 asset references. The sandbox shell stalled before commands started; host-shell verification completed successfully.
- Browser review confirmed five additive projects across organizations; four Academic + Simulation/Analysis projects; focus-preserving return and Next Result links; fresh 320px shared-link positioning at approximately 104px below the page top; no root overflow; 121.5×44px phone-menu targets; and a WAAM photo heading below the sticky controls. Desktop controls and the five-link navigation also fit.
- Previous additions verified: d15b5a03a11db30b5fc9d04515b46bde0d283589 passed Portfolio Checks and Pages deployment. Live review confirmed the Current Research and About sections. This supersedes their pending gate above.
- Deployment gate: GitHub checks, Pages deployment, and live verification remain required for this focus-browsing update.

## 2026-11-13 — Explain the WAAM research workflow visually

- Added a three-stage visual to Research Approach: Plan Paths, Model Heat Flow, and Prepare Tests. The captions and text use the supplied public research methods; physical validation remains explicitly pending.
- Added decorative schematic path, heat-flow, and measurement icons without numerical outputs, simulated temperature fields, partner details, or performance claims. The existing static workflow component supplies desktop columns and phone stacking; no scripts or shared assets changed.
- Files: projects/waam-thermal-planning.html, README.md, and this record.
- Verification: all 14 JavaScript suites, site links/metadata, asset checks, related-work checks, and original-PDF integrity passed. Local browser review covered desktop, 320px phone stacking, and the 601px three-column breakpoint with no horizontal overflow.
- Previous batch verified: 1c60a736aaf6290c402320c359dd2581ad1712a6 passed Portfolio Checks and Pages deployment. Live phone review confirmed five additive-focus projects, preserved return/Next Result context, and direct filtered-library positioning. This supersedes its pending deployment gate above.
- Deployment gate: GitHub checks, Pages deployment, and live review remain required for this visual addition.

## 2026-11-13 — Add Copy Email with a manual fallback

- Added a secondary Copy Email action beside the existing primary email link. Success is announced without moving focus or disabling the focused button. Overlapping requests are ignored while a copy is pending.
- If clipboard access is unavailable or denied, the contact section reveals a labeled readonly field and selects the address for the visitor’s device Copy command. The original email link remains available without JavaScript; the new action is hidden until its script is ready.
- Added small homepage-only contact assets and registered their content-hash versions. Added contact behavior and markup checks to Portfolio Checks, including unsupported/denied access, retry, and focus behavior. No clipboard reads, external services, analytics, or contact-form backend were added.
- Files: index.html, contact.js, contact.css, contact tests, asset-version tool/tests, validation workflow, README.md, and this record.
- Verification: all 15 JavaScript suites passed, including nine contact-copy checks and 115 project checks; all 11 asset tests, site links/metadata (14 pages, 451 references, 19 images), related-work checks, and 77 asset references passed. Original PDFs remain unchanged. Real local browser copying succeeded on desktop and a 320px phone layout; a temporary manual-fallback layout preview fit without root overflow and was removed before publication.
- Previous batch verified: 5bf1c0a2c234cde683981a0890feb5d1d420e9bc passed Portfolio Checks and Pages deployment. Live review confirmed all three schematic workflow steps and the pending-validation caption, superseding its pending gate above.
- Deployment gate: GitHub checks, Pages deployment, and live copy-action review remain required for this update.

## 2026-11-13 — Keep copy confirmation from shifting the contact row

- Live verification exposed a horizontal reflow when the copy-status text changed the contact group’s intrinsic width. The desktop group now has a stable flex basis, while compact layouts use the full available width.
- Files: contact.css, its homepage content-hash reference, and this record. Copy behavior and the original email destination are unchanged.
- Verification: local before/after copying measurements retained exactly the same email and contact-group rectangles at desktop size. The contact area also fit 761px and 320px layouts without root overflow. Site and asset-version checks passed.
- The preceding Copy Email commit f2482853843d65a686d5ef8c0246f3f0d5d13761 passed all GitHub checks and Pages deployment; real live copying succeeded. This entry completes the layout issue found during that live review.
- Deployment gate: GitHub checks, Pages deployment, and live stable-layout verification remain required for this correction.

## 2026-11-13 — Connect WAAM photos to a process schematic

- Added an original static vector schematic showing wire feed, torch travel, a deposition bead, earlier layers, and a build plate. An accessible title, detailed description, and visible caption explain the general manufacturing process; the figure is explicitly not to scale and contains no research results.
- Kept this illustration separate from the existing methods workflow and credited example photographs. Page-local presentation requires no new shared assets, network requests, or scripts.
- Files: projects/waam-thermal-planning.html, README.md, and this record.
- Verification: engineering-content checks (21), figure behavior checks (27), site links/metadata (14 pages, 451 references, 19 images), and 77 asset versions passed. A broad unpublished-results check initially matched an inline CSS width percentage; presentation moved into the page head, retaining the original check unchanged. Real desktop, 390px, and 320px browser layouts fit; the narrow view had equal 305px client and scroll widths.
- Previous correction verified: 4fe689258fa090ec666f13a558325cfb54b1281d passed Portfolio Checks and Pages deployment. Live Copy Email kept the email and contact-group rectangles unchanged and retained button focus, superseding its pending gate above.
- Deployment gate: GitHub checks, Pages deployment, and live schematic verification remain required for this addition.

## 2026-11-13 — Offer direct recovery from unmatched project searches

- Added Show All Projects beside an empty library message when keyword-preserving widening cannot find alternatives. It clears category, focus, and query, preserves unrelated URL parameters, updates the shareable library address, and returns focus to search. Only one empty-state recovery action appears at a time.
- Reused the existing Clear Filters handler. Added three regression cases for full reset, exclusive recovery choices, and an empty category/focus intersection without a keyword.
- Corrected the WAAM schematic accessible name to reference only its concise title, with the longer explanation associated as its description. Updated the README spotlight label to Michigan.
- Files: portfolio.js, homepage markup, portfolio tests, asset-version references on 14 pages, WAAM visual accessibility attributes, README.md, and this record.
- Local browser review at 320px confirmed the recovery action fits, restores all 12 projects, clears the filtered address, returns focus to search, and retains zero root overflow. The prior keyword-preserving action was also verified live. Browser accessibility inspection resolved the schematic by its exact concise name.
- Previous addition verified: 98f1af1139cc1b320b88f17238cd2918160fa5d9 passed Portfolio Checks and Pages deployment; live review confirmed the original process schematic and its explanation, superseding its pending gate above.
- Deployment gate: required checks and live recovery verification remain pending for this update.
- Verification completed: all 15 JavaScript suites passed, including 118 portfolio cases, plus 11 asset tests, 14-page link/metadata checks, 77 asset references, 24 related-work links, and original-PDF integrity.

## 2026-11-13 — Browse complete project groups from capabilities

- Each Technical Capabilities group now keeps its representative case-study link and adds a quieter link to its complete Engineering Focus selection: design/tooling, simulation/analysis, software/automation, or testing/inspection. Native links support sharing and opening in another tab; the existing library logic handles the selections.
- Added 44px-minimum targets with the existing muted text palette. Direct #capabilities links now clear the sticky header, fixing the obscured heading found during visual review.
- Files: homepage links, styles.css, all stylesheet-version references, README.md, and this record. No new scripts, dependencies, claims, or external requests.
- Verification: site checks cover 14 pages, 455 references, and 19 images; 118 portfolio tests, stylesheet safeguards, and contrast checks passed. Desktop and 320px phone review confirmed readable links and a capabilities heading at approximately 104px below an 80px header. Each link opened the correct group (7 design, 5 analysis, 4 software, 2 testing projects). The settled phone library retained equal 305px client and scroll widths; transient width during the established crossfade was not persistent overflow.
- Previous update verified: d74e137d280e129f64681b387a3f38ca0b387b65 passed Portfolio Checks and Pages deployment. Live Show All Projects restored 12 projects, cleared the filtered address, and focused search on a 320px phone view. Live WAAM reload confirmed concise title/description associations. This supersedes its pending deployment gate.
- Deployment gate: required GitHub checks, Pages deployment, and live capability-link review remain pending for this update.

## 2026-11-13 — Keep the portrait beside the introduction on small tablets

- Visual review at 700px showed a small portrait in its own full-width row with a large blank area beside it. The 521–700px range now keeps the portrait and introduction together in two columns. The 521–600px range uses a 144px portrait and a slightly smaller title; 601–700px uses 180px. Phones through 520px retain the stacked layout.
- Files: styles.css, all stylesheet content-hash references, README.md, and this record. No headshot edits, content claims, scripts, document changes, or external requests.
- Verification: visual review at 521px and 700px confirmed a more compact, readable introduction. Measurements at 320, 520, 521, 600, 601, 700, and 701px found no clipped heading and equal client/scroll widths. Broader tablet review also confirmed readable research columns, fitting navigation, capabilities, and library controls. Stylesheet safeguards, contrast checks, 11 asset tests, 14-page/455-reference site checks, and 77 asset versions passed.
- Previous addition verified: 78526e3955ea539b3eb6992081dcd5800204c064 passed Portfolio Checks and Pages deployment. Live review showed all four capability links; Software & Automation opened its four matching projects. This supersedes its pending gate above.
- Deployment gate: GitHub checks, Pages deployment, and live small-tablet portrait review remain required for this correction.

## 2026-11-13 — Return from case-study endings to their overview

- Added Back to Project Overview beside the ending actions on all 12 case studies. Readers of long cases can return to the title and summary without leaving the project or scrolling through several screens manually.
- Uses a native fragment link to the existing main element, the existing 44px target styling, and the existing keyboard-focus handler. Native scrolling retains the site pause/reduced-motion behavior. No new styles, scripts, animation, or content claims were introduced.
- Files: all 12 case studies, README.md, and this record.
- Verification: site checks validated 14 pages, 467 references, 19 images, and all return targets; 21 engineering checks, 118 portfolio cases, 24 related-work links, and 77 asset references passed. Local 320px review confirmed the 44px target and fitting ending actions. Activation retained the case URL, focused project-content, and returned to the title after the native smooth scroll settled.
- Previous correction verified: 27de1ea5c4c10b71c18e5a62dd5efbe1888dba02 passed Portfolio Checks and Pages deployment. Live 700px and 521px review confirmed the intended side portraits and equal client/scroll widths. This supersedes its pending deployment gate above.
- Deployment gate: GitHub checks, Pages deployment, and live overview-return review remain required for this addition.

## 2026-11-13 — Recover missing links into the full project library

- Live testing of a nested missing project address confirmed that the recovery page rendered correctly, but its Explore Projects action landed at Selected Work with the library still closed. Renamed the action Browse Project Library and pointed it directly to the library fragment, so all 12 projects are immediately available.
- Added Research to recovery-page navigation, matching the rest of the site. Kept absolute project-site addresses for nested missing URLs and the existing noindex directive.
- Files: 404.html, README.md, and this record. No shared assets, scripts, research claims, or documents changed.
- Verification: local 320px review showed fitting recovery actions. The primary link opened the live full library with 12 projects and zero overflow. Site checks validated 14 pages, 468 references, 19 images, and metadata; 118 portfolio tests and 77 asset references passed.
- Previous addition verified: d77e554a3eb14c28604b77e69dd5762f8a13fbe1 passed Portfolio Checks and Pages deployment. Live phone activation of Back to Project Overview retained the case, focused project-content, and returned to its visible heading. This supersedes its pending deployment gate above.
- Deployment gate: GitHub checks, Pages deployment, and live nested-missing-address recovery remain required for this update.

## 2026-11-14 — Reflect on every project and lead with current WAAM research

- At Dustin’s request, added a distinct What I Learned section to all 12 case studies and linked each from its contents menu. The reflections synthesize the decisions, methods, and limitations already documented on the public pages; they add no new outcomes, private process details, or undocumented setbacks. The ongoing WAAM reflection discusses baselines, assumptions, path review, and pending physical validation without publishing results.
- Moved WAAM to position 01 in the full library and made it the first featured project. The featured row now introduces current Michigan research, Boeing production design, and experimental material testing. NASA remains available immediately after WAAM in the library. Renumbered the remaining cards and verified the circular Next Project order remains consistent.
- Added content safeguards for WAAM-first priority and one unique, contents-linked reflection per project; updated the featured-project expectation. Files: homepage, all 12 case studies, engineering/portfolio tests, README.md, and this record. Original PDFs, images, scripts, styles, hosting, and asset versions are unchanged.
- Verification: all 15 JavaScript suites passed, including 23 engineering and 118 portfolio checks; 11 asset tests, 14 pages/480 references/19 images, 77 asset versions, and related-work generation passed. Desktop review confirmed the current-research feature and reflection layout. All 12 direct reflection anchors fit a 320px phone with zero root/paragraph overflow and headings approximately 184px below the page top. Additive-filter browsing showed WAAM first, retained the return filter, and offered NASA as Next Result.
- Previous recovery update verified: 4a97a468702d5616ce14f5706783abd15d4453dd passed Pages deployment and the delayed push-triggered Portfolio Checks run (43464139634). Live nested-missing-page review confirmed Research navigation and immediate access to all 12 projects. This supersedes its pending deployment gate above.
- Deployment gate: GitHub checks, Pages deployment, and live reflection/order verification remain required for this update.

## 2026-11-14 — Connect aerospace leadership ambitions with the DEng path

- Updated the introduction, About heading/copy, and homepage descriptions to make engineering leadership in aerospace innovation and development a clear career direction. The narrative connects existing NASA, Boeing, and PCC experience with current graduate research and the leadership Dustin wants to develop.
- Dustin clarified that the M.S. is earned along the way within his DEng path. The Michigan timeline now leads with the ongoing DEng pathway, retains the existing May 2028 M.S. expectation, and uses 2026–Present so no completion date is assigned to the DEng.
- Files: index.html, README.md, and this record. No unsupported past leadership roles, degree completion, curriculum, research results, or private technical details were added. Original PDFs, headshot, project order, scripts, and styles are unchanged.
- Verification: homepage link/metadata checks (14 pages, 480 references, 19 images), 118 portfolio tests, social metadata checks, and original-PDF integrity passed. Desktop review confirmed the introduction and clarified degree entry. At 320px, the aerospace leadership heading and About paragraphs fit with equal 305px client and scroll widths.
- Previous update verified: bd590c857d49cab960b54649c491ef12ee815a73 passed Portfolio Checks and Pages deployment. Live review confirmed all 12 contents-linked reflections, WAAM as featured/library position 01, and unpublished WAAM results. This supersedes its pending gate above.
- Deployment gate: GitHub checks, Pages deployment, and live leadership/degree-path review remain required for this update.

## 2026-11-14 — Separate personal interests and NASA research systems

- Added Outside Engineering as a separate page about Dustin’s stated interests in basketball/sports statistics and bouldering. At his request, the homepage contains only a quieter About link, with no scrolling interests section. The personal page has regular site navigation, return links, descriptive metadata, and decorative vector icons; no teams, sporting achievements, or sports-analysis projects were invented.
- Split the NASA research into real-time manufacturing monitoring and a local manufacturing-documentation assistant. The existing nasa-manufacturing.html address now focuses on Jetson/Holoscan sensing, inference, and LED feedback. A new nasa-documentation-assistant.html case covers the Raspberry Pi/local-LLM/RAG documentation work, with its own methods, lessons, library card, and project-specific contact link. Both cases use the existing supplied public facts without adding performance, privacy, or production-deployment claims.
- Updated NASA timeline links, related-work generation, search expectations, the 13-project library count/numbering, and the circular Next Project sequence. WAAM remains first and its results remain unpublished. Removed the Mechanical Engineering Portfolio eyebrow above Dustin’s name.
- Reviewed the current cool gray (#F7F8FA) against a local-only warm off-white (#F7F6F2) preview. Recommended the warmer option with existing navy accents, but kept the public background unchanged pending Dustin’s preference. Removed the temporary preview fixture before publishing.
- Files: homepage, separate personal page, new/updated NASA cases, other case navigation/asset references, styles.css, sitemap, related-work tool, engineering/portfolio/social tests, README.md, and this record. Original PDFs and raster images are unchanged; no new external services or scripts were added.
- Verification: all 15 JavaScript suites passed, including 24 engineering, 120 portfolio, 15 related-work, and 17 social checks; all 11 asset tests, 16 pages/525 references/19 images, 85 asset versions, and 26 generated related-work links passed. Browser review confirmed the quiet About link and return path, a separate interests page on desktop/phone, no automatic case-study print button on that page, the simplified introduction, the new assistant workflow at 320px without overflow, and two NASA results with preserved filtered return/Next Result navigation.
- Previous leadership update verified: c1c48af387e2af3f5268ccbfe48c87f9fa0f75e2 passed Portfolio Checks and Pages deployment. Live review confirmed the aerospace leadership narrative and ongoing DEng pathway with the M.S. expected in May 2028. This supersedes its pending deployment gate above.
- Deployment gate: GitHub checks, Pages deployment, and live verification remain required for this batch.

## 2026-11-14 — Preserve saved NASA documentation links after the split

- Live review confirmed that the old nasa-manufacturing.html#documentation address no longer had a fragment target and landed at the top of the monitoring case. Restored that ID on its related documentation-assistant card, allowing saved links to reveal the new destination without adding another content section or script redirect.
- The generator retains the alias only for this source/destination pair. The card uses existing navigation-clearance values with a small local scroll offset, preserving its visual styling. Added a regression check for the unique alias and correct destination.
- Files: related-work generator, related-work tests, NASA monitoring case, README.md, and this record. No shared styles, scripts, documents, or research claims changed.
- Verification: 16 related-work checks, 16-page/525-reference site checks, and 85 asset references passed. Desktop and 320px review placed the destination card below the sticky header (approximately 188px and 184px respectively). The narrow page had no root overflow, and pressing Enter on the focused card opened the separate assistant case.
- Previous batch verified: 2ff3de320164852f65936f9920de1e6694766b38 passed Portfolio Checks and Pages deployment. Live review confirmed the quiet personal-page link, separate interests page, removed hero eyebrow, and two NASA projects with preserved filtered navigation. This supersedes its pending deployment gate above.
- Deployment gate: GitHub checks, Pages deployment, and live bookmark verification remain required for this compatibility fix.

## 2026-11-14 — Give personal interests a consistent heading hierarchy

- Corrected the separate Outside Engineering page from H1 → H3 to H1 → H2 for its basketball/statistics and bouldering sections. Screen-reader heading navigation now reflects the actual page structure.
- Updated the interest-heading selector to preserve the existing 16.8px appearance, spacing, and restrained styling. Refreshed stylesheet content-hash references across 16 pages.
- Verification: desktop and 320px browser review confirmed H1/H2/H2 semantics and unchanged visual hierarchy; the phone document had matching 305px client/scroll widths. Site checks passed for 16 pages, 525 references, and 19 images; stylesheet safeguards, 11 asset tests, 17 sharing checks, 85 asset versions, and related-work generation passed.
- Previous compatibility fix verified: 207742d77a351b43117d8fef486eed072532259f passed Portfolio Checks and Pages deployment; live review confirmed the legacy documentation link reaches the separate assistant card. This supersedes its pending deployment gate above.
- Deployment gate: GitHub checks, Pages deployment, and live heading verification remain required for this correction.

## 2026-11-14 — Adopt the selected warm canvas and fit short-screen menus

- Dustin selected warm off-white #F7F6F2 after comparing it with the prior cool gray. Applied it to the shared screen background while retaining navy accents and white content surfaces. This supersedes the earlier pending background choice.
- Fixed a verified compact-navigation issue at 568×200: the expanded menu placed Contact below the viewport. The enhanced menu now has a viewport-bounded scrolling area with vh/dvh fallbacks. Keyboard traversal scrolls Contact into view; ordinary phone menus retain their natural height.
- Verification: local desktop review confirmed the warm portrait canvas and white project surface. At 568×200, keyboard focus reached Contact at approximately 169px with internal menu scrolling; at 390×844, the 146px menu needed no internal scrolling. 120 navigation tests, stylesheet safeguards, representative contrast checks, 16-page/525-reference site checks, and 85 asset versions passed.
- Files: styles.css, stylesheet version references on 16 pages, and this record. No research results, original documents, or scripts changed.
- Previous correction verified: 5f93093e1909a20bbbfd14db498c3ca76ec51477 passed Portfolio Checks and Pages deployment; live personal-page headings are H1/H2/H2. This supersedes its pending gate above.
- Deployment gate: GitHub checks, Pages deployment, and live palette/menu verification remain required for this batch.

## 2026-11-14 — Align shared-link artwork with aerospace leadership positioning

- Replaced the outdated Aerospace Manufacturing / Experimental Research share-image tagline with the homepage's Mechanical Design / Aerospace Innovation / Engineering Leadership direction. Removed the old portfolio eyebrow and decorative curves, adopted the selected warm off-white canvas, and retained the DL mark and navy university footer.
- The Michigan footer now names the DEng pathway with the M.S. along the way. Existing NASA/Boeing/PCC industry experience appears as context, without adding leadership roles or degree-completion claims.
- Updated matching Open Graph and Twitter image descriptions on the homepage, personal page, and all 13 case studies. Rendered the editable SVG into a verified 1200×630 JPEG (51,827 bytes) using the existing browser fixture; retained page-specific titles and descriptions.
- Verification: inspected the rendered artwork at its declared size; all 17 sharing checks, 16-page/525-reference site checks, and 85 asset versions passed. No original PDFs, research results, scripts, or styles changed.
- Previous palette/menu batch verified: 86fbaa788c788b093e461ea0ee922a97dd69e27f passed Portfolio Checks and Pages deployment. Live background resolves to #F7F6F2, and Contact remains keyboard-reachable inside the bounded menu at 568×200. This supersedes its pending gate above.
- Deployment gate: GitHub checks, Pages deployment, and live artwork/metadata verification remain required. Social platforms may retain their own cached previews.

## 2026-11-14 — Find current research with plain-language heat searches

- Reproduced a live discovery gap: searching heat returned zero projects despite heat buildup being central to the current WAAM case. Added heat buildup, temperature, cooling, and welding to that card's search aliases, grounded in its existing process and methods descriptions.
- Added a behavior regression covering five plain-language searches and the saved WAAM destination. No search algorithm, visible copy, layout, styles, research results, or external service changed.
- Verification: local browser searches for heat and cooling each returned the WAAM case and retained the shareable query. All 121 portfolio tests, 24 engineering checks, site checks (16 pages, 525 references, 19 images), related-work generation, and 85 asset references passed.
- Previous share-artwork batch verified: 61ff4bfdf59e799b35c56011c80bb6eebb0ebb1e passed Portfolio Checks and Pages deployment; live review confirmed the new image and leadership-focused alternative description after reload. This supersedes its pending gate above.
- Files: index.html, tests/portfolio.test.cjs, and this record. Deployment gate: GitHub checks, Pages deployment, and live plain-language search verification remain required.

## 2026-11-14 — Match the homepage title to current positioning

- Updated the browser and Open Graph homepage title from Mechanical Engineering Portfolio to Aerospace Innovation & Engineering Leadership, matching the user's stated direction, visible introduction, and refreshed sharing artwork. The Person structured data remains Mechanical Engineering Graduate Student, preserving the distinction between current role and career direction.
- Verification: 17 sharing checks, 16-page/525-reference site checks, and 85 asset references passed. No body copy, navigation, styling, degrees, documents, or research claims changed.
- Previous search batch verified: b7d404f4de3089427b0dc6dc644377b33cd84b7d passed Portfolio Checks and Pages deployment; live heat/cooling queries returned WAAM on desktop and a 320px phone with zero settled overflow. This supersedes its pending gate above.
- Files: index.html and this record. Deployment gate: GitHub checks, Pages deployment, and live title verification remain required.

## 2026-11-14 — Improve contrast for small workflow step labels

- A rendered solid-surface text review across all 13 cases identified 24 small orange workflow labels on eight pages below the normal-text contrast threshold. Changed only those labels from the general orange accent to darker burnt orange #B93608; navigation accents, diagrams, workflow animation, and other typography remain unchanged.
- Added contrast guards for both the ordinary #F3F6F9 and highlighted #E3EDF5 workflow backgrounds. These protect the small-label color pair rather than asserting whole-site accessibility conformance.
- Verification: repeated rendered checks on the eight affected pages found no remaining issue in the sampled opaque HTML text pairs. Desktop visual review and 320px label-fit checks passed with matching 305px client/scroll widths. All 15 representative contrast/focus safeguards, six workflow behavior checks, stylesheet safeguards, 16-page/525-reference site checks, and asset refresh passed.
- Previous title batch verified: 5813778863d9431907f3500367589513bcaab116 passed Portfolio Checks and Pages deployment; live browser and Open Graph titles match the aerospace innovation/engineering leadership wording. This supersedes its pending gate above.
- Files: styles.css, tests/contrast.test.cjs, stylesheet-version references on 16 pages, and this record. No content claims, original PDFs, or research results changed. Deployment gate: GitHub checks, Pages deployment, and live label verification remain required.

## 2026-11-14 — Clarify the wing-sweep diagram annotation

- Reviewed SVG text separately from the prior HTML contrast audit. The aircraft planform's small orange sweep label fell just below the text-contrast threshold on its #FBFDFF surface. Applied the darker #B93608 text color and added a contrast guard using the actual SVG fill.
- Enlarged visual review also showed that label crossing the leading-edge outline. Moved it into clear space above the left wing while preserving all geometric paths and numerical values.
- Verification: desktop enlarged-diagram review confirmed clear text placement and the updated color. At 320px, the existing four metric labels remain readable below the diagram while inline text stays hidden; matching 305px client/scroll widths confirmed no root overflow. All 16 contrast/focus safeguards, 24 engineering checks, site checks, and asset versions passed.
- Previous workflow contrast batch verified: 9033a405c56c79be11f97f381c8892535966a3c6 passed Portfolio Checks and Pages deployment; live WAAM workflow labels use #B93608. This supersedes its pending gate above.
- Files: aircraft-aerodynamics case, tests/contrast.test.cjs, and this record. No original documents, diagrams' engineering values, scripts, or shared styles changed. Deployment gate: GitHub checks, Pages deployment, and live diagram verification remain required.

## 2026-11-14 — Separate concise diagram names from full descriptions

- Six native technical diagrams combined their title and full explanation in aria-labelledby, producing unnecessarily long image names. Updated the aircraft planform, carabiner comparison/trade-off, putter sequence, and tensile sequence/strength plot to use their title as the name and their existing desc as aria-describedby.
- Kept every description, visible label, technical value, and illustration qualifier intact. The figure viewer still supplies its detailed enlarged-image alternative text. WAAM already used this naming pattern.
- Verification: browser role queries resolved all six updated images by their exact short titles. Added a semantic check for title/description associations across native technical diagrams and updated three existing illustration checks. All 25 engineering checks, 27 figure-viewer checks, 17 carabiner, 19 putter, and 10 tensile checks passed, alongside site checks and 85 asset references. This is browser/markup verification, not a claim of testing every screen reader.
- Previous wing annotation batch verified: d58f15d788e130961ccee5a12ed1a692db380d12 passed Portfolio Checks and Pages deployment; live enlarged-diagram review confirmed the darker sweep label clear of the outline. This supersedes its pending gate above.
- Files: four case pages, engineering and three illustration test files, and this record. No scripts, styles, original PDFs, or research results changed. Deployment gate: GitHub checks, Pages deployment, and live accessible-name verification remain required.

## 2026-11-14 — Make case-study return links easier to tap

- Measured the top Project Library return link at approximately 23px high, smaller than the site's other primary touch controls. Added a case-hero-only 44px minimum target and reduced its prior bottom margin so the existing empty space accommodates the larger target.
- Kept the link's typography and destination, personal-page return styling, and case-study reading structure. No new controls or scripts were added.
- Verification: all 13 case studies measured 44px return targets at a 320px viewport, with fitting titles and matching 305px document client/scroll widths. A representative 390px introduction retained its prior vertical position within approximately 1px. Keyboard-focus review showed the complete larger target. All 121 portfolio tests, stylesheet safeguards, site checks, and refreshed asset references passed.
- Previous diagram naming batch verified: ac91577b8e6f2c0c30065293ee01b4c939cd7893 passed Portfolio Checks and Pages deployment; live browser queries resolved all six diagrams by their concise names with descriptions retained. This supersedes its pending gate above.
- Files: styles.css, stylesheet content-hash references on 16 pages, and this record. Original PDFs and research content are unchanged. Deployment gate: GitHub checks, Pages deployment, and live return-target verification remain required.

## 2026-11-14 — Fit compact menus below wrapped headers

- Combined expanded text spacing with a 320×200 viewport and reproduced Contact extending below the viewport despite keyboard focus. The prior CSS limit assumed a single-row header and did not account for the wrapped brand/menu controls.
- The existing navigation-clearance routine now measures the rendered links' top position and bounds their scrolling area to the remaining viewport space. Opening the menu refits immediately; header observation and viewport resize updates retain the fit. CSS vh/dvh limits remain a fallback.
- Added three regressions for wrapped-header room, height-only resize with a ResizeObserver, and avoiding hidden-menu measurements. Corrected the navigation fixture to retain multiple resize listeners, matching browser event behavior rather than overwriting earlier listeners.
- Verification: the combined spacing/short-screen fixture kept focused Contact fully visible. Resizing the same open menu to 260px and 844px refitted correctly, with no internal scrolling needed at normal height; Escape closed it. The ordinary 568×200 menu also kept Contact visible. All 124 portfolio regressions, motion-preference checks, entrance-motion checks, stylesheet safeguards, site checks, and asset versions passed. Removed the temporary spacing fixture before publication.
- Previous return-target batch verified: 9f9b1c18630bdc0cdf83a4262d1225b7717a0585 passed Portfolio Checks and Pages deployment; live return links measured 44px and opened the complete 13-project library. This supersedes its pending gate above.
- Files: portfolio.js, styles.css, portfolio tests, asset-version references on 16 pages, README.md, and this record. No research results, original documents, or external services changed. Deployment gate: GitHub checks, Pages deployment, and live measured-menu verification remain required.

## 2026-11-14 — Keep figure previews visible on short screens

- Reproduced an open figure viewer at 568×200 where the fitted image computed to 0px high: its viewport-minus-controls height limit became negative. Added an 80px floor to both desktop and compact fit-image limits. The outer dialog remains viewport-bounded and scrollable.
- Preserved the existing Actual Size mode for detail inspection and retained the sticky Close/control bar. No image assets, diagram values, or viewer scripts changed.
- Verification: the same short-screen wing preview now measured 160×80 rather than 0×0. Actual Size keyboard panning moved 40px horizontally and vertically; returning to fit restored the 80px preview. Normal desktop fitting retained the original 640×320 proportions, and Escape closed the viewer. All 27 figure-viewer checks, stylesheet safeguards, site checks, and asset-version refresh passed.
- Previous measured-menu batch verified: b62906dc5ae4546d5c6c7fd1c5388014d01ba93a passed Portfolio Checks and Pages deployment. Live short-screen menu bounds, resize refitting, and Contact navigation passed without runtime log errors. This supersedes its pending gate above.
- Files: styles.css, stylesheet-version references on 16 pages, README.md, and this record. Original PDFs and research content remain unchanged. Deployment gate: GitHub checks, Pages deployment, and live short-screen figure verification remain required.

## 2026-11-14 — Give short landscape previews more room

- The nonzero preview fix revealed another avoidable space cost: compact viewer titles and controls always stacked, even in landscape widths where they fit together. Added a short-viewport toolbar layout from 480px wide, with a wrapping title beside the unchanged 44px controls and tighter content padding.
- Extended the short-height rule across the compact/desktop width boundary after review found that the old desktop padding still clipped the preview at 601px. Normal-height portrait viewers keep the stacked layout.
- Verification: at 200px height, widths 480, 568, 600, 601, and 1280 all showed the complete wing preview below a 69px toolbar, without toolbar overflow. At 390×844, the title and controls retained their full-width stacked rows and did not overflow. All 27 viewer checks, stylesheet safeguards, site checks, and asset refresh passed.
- Previous nonzero-preview batch verified: 3b8842a1aff50d2c07e8b572451b6041630d12f8 passed Portfolio Checks and Pages deployment; live short-screen preview measured 160×80 and Escape dismissed it. This supersedes its pending gate above.
- Files: styles.css, stylesheet-version references on 16 pages, README.md, and this record. No scripts, image assets, original documents, or research results changed. Deployment gate: GitHub checks, Pages deployment, and live landscape-preview verification remain required.

## 2026-11-14 — Personalize Outside Engineering with Dustin's own details

- Dustin supplied specific interests: a longstanding love of playing basketball, following his hometown Portland Trail Blazers, interest in how statistics changed basketball/football/baseball, and bouldering as his current favorite workout. Replaced the generic personal-page copy with these details.
- Separated Basketball, Sports Statistics, and Bouldering into three short entries. Added a decorative statistics icon consistent with the existing line icons. Desktop uses three columns; layouts through 800px stack the entries for comfortable reading. Updated that page's description metadata.
- The homepage still has only its quiet About link to this separate page. No favorite metrics, playing/climbing achievements, analytical projects, teams beyond the one supplied, or personal photos were invented.
- Verification: desktop visual review and 320px/800px/801px responsive checks confirmed all three headings and fitting paragraphs. Site checks (16 pages, 525 references, 19 images), 17 sharing checks, stylesheet safeguards, and asset refresh passed.
- Previous landscape viewer batch verified: cdb48e9d971c259575d9262598a99f4ba0157f4f passed Portfolio Checks and Pages deployment; live 568×200 review confirmed the complete preview beneath a 69px toolbar. This supersedes its pending gate above.
- Files: personal page, styles.css, stylesheet-version references on 16 pages, README.md, and this record. Deployment gate: GitHub checks, Pages deployment, and live personal-copy/layout verification remain required.
