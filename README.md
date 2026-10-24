# Dustin Leung — Engineering Portfolio

Live site: https://dustin07.github.io/DustinPortfolio/

Project memory: read [CHANGELOG.md](CHANGELOG.md) for completed improvements, retired approaches, verification notes, and the complete historical commit index. [AGENTS.md](AGENTS.md) directs future contributors to consult and maintain that record before making more changes.

## Structure

- `index.html`: introduction, NASA research spotlight, project library, experience timeline, education, capabilities, and contact.
- `projects/`: case studies with contribution, decision, outcome, and evidence summaries.
- `styles.css`: responsive visual system, restrained surfaces, reading panels, and accessibility fallbacks.
- `ambient.js`: site-wide motion preferences on a static neutral background. The tab-local pause control covers explanatory animations, smooth scrolling, and hover movement; system reduced motion takes priority. No decorative waves or scroll-linked background work is rendered.
- `portfolio.js`: searchable project library, shareable filters, tab-local return preferences, compact phone navigation, active sections, and case-study print controls. No data is sent to an analytics service.
- `figures.js`: native modal viewing for existing technical images, preserving source captions, vector descriptions, keyboard controls, and return focus. Unsupported browsers retain the readable inline figures.
- `tensile.js`: lightweight eight-second dogbone loading/separation illustration on the rocket-materials case. It is schematic, not test footage or measured deformation. Local pause, system reduced motion, offscreen/hidden-tab pauses, static/print fallbacks, and the page-animation preference are honored. Run `node tests/tensile.test.cjs` when changing it.
- `motion.js`: one-time, visible-only card entrances and brief project-grid movement after filtering. Results update immediately; focus changes, rapid filtering, hidden tabs, system reduced motion, and the page pause control cancel movement. Content is never hidden pending JavaScript. Shared easing also covers hover feedback, compact navigation, and progressively enhanced native disclosures. Run `node tests/motion.test.cjs` when changing it.
- Same-origin page changes progressively use a native 180 ms crossfade with a separately captured navigation bar. The CSS opt-in is limited to screens without a reduced-motion preference; `ambient.js` skips transitions for page-wide pause and refreshes that preference when browser history restores a page. Browsers without support retain normal links. The implementation follows the [cross-document transition model](https://developer.chrome.com/docs/web-platform/view-transitions/cross-document) without navigation interception, render-blocking scripts, or a client router.
- `workflow.js`: sequential highlights for the NASA, protective-cover, and reverse-engineering workflows. Timing is illustrative; local and page-wide pauses, reduced motion, and offscreen/hidden-tab pauses are honored. Run `node tests/workflow.test.cjs` when changing it.
- The ergonomic-tool, gating, and die-design cases use the same numbered workflow layout as static summaries of their published methods and handoff boundaries.
- `images/portfolio-social.svg` and `.jpg`: editable branded link-preview artwork and the rendered 1200 × 630 sharing image. Page titles and descriptions remain specific to each case study.
- `404.html`: recovery links for missing addresses, including nested project paths.
- `images/`: selected engineering visuals from the original project reports.
- `documents/`: original reports and the publicly approved general resume.
- `sitemap.xml`: canonical public page addresses.
- `tests/`: dependency-free content and behavior checks for future updates.

## Hosting

This project is published from the existing `Dustin07/DustinPortfolio` repository through GitHub Pages. Do not create a replacement user-site repository or move the site to a paid host to update it. Links are relative so the site works at its current project address.

There are no external font requests, analytics trackers, API keys, contact-form backends, or paid services in the site.

`Portfolio Checks` runs the dependency-free test suite on pushes and pull requests to `main`. It uses a standard Ubuntu runner with read-only repository permission, no uploaded artifacts, and no dependency cache. It skips private repositories to preserve the public-repository free-runner assumption. The checks report problems; they do not change GitHub Pages deployment settings or require branch protection.

GitHub documents free use of standard runners for public repositories in its [Actions billing guide](https://docs.github.com/en/billing/concepts/product-billing/github-actions). Do not substitute paid larger runners or add storage-heavy artifacts to this workflow.

## Updating Content

Content is maintained explicitly; it does not automatically synchronize with Notion or the resume. Update the relevant HTML page, verify its sources, and check local links, navigation, mobile layout, and image descriptions before publishing. Every case study belongs in the searchable project library. Use evidence-backed outcomes and distinguish planning, simulation, specimen testing, and production adoption.

After changing a stylesheet or script, run `python tools/version_assets.py --write`. This mechanically refreshes only the referenced asset versions using content hashes, so returning visitors receive the current files. `python tools/version_assets.py` checks without changing anything and also runs in the repository checks.

After changing project-card titles or summaries, run `node tools/build_related.cjs --write`. This refreshes the two curated related-work links on each case study from the existing project library and keeps project-specific email subject lines aligned with their titles. The default command checks without changing files. Keep the curated destinations relevant; these links are not recommendations from a tracking service.

The public resume is the supplied PDF, unchanged and approved for publication. Employer technical details must not be added without public-sharing approval. Original academic reports remain unchanged.

`tests/document-manifest.json` records the sizes and SHA-256 hashes of the original published PDFs. If Dustin approves a replacement, update its matching baseline deliberately; do not bypass the integrity check to accommodate an unexplained file change.

## Verification

From the repository root, run `node tests/portfolio.test.cjs`, `node tests/figures.test.cjs`, `node tests/social.test.cjs`, `node tests/ambient.test.cjs`, `node tests/styles.test.cjs`, `node tests/engineering.test.cjs`, `node tests/documents.test.cjs`, and `python tests/check_site.py`. These check project filtering, URL/session behavior, mobile menu logic, keyboard section focus, active sections, print-control wiring, technical figure controls, link-preview metadata/image format, site motion preferences, reduced motion, inactive-tab pausing, stylesheet safeguards, document integrity, local links, table semantics, image descriptions, page metadata, and the sitemap. The engineering checks also reconcile displayed percentages, geometry calculations, chart data, reference-model attribution, and project sequences. They check internal consistency, not physical validation. Also review real desktop and phone layouts in a browser before publishing; these scripts do not replace visual inspection.

The sharing artwork can be rendered from `tests/render-social.html` at exactly 1200 × 630. Confirm the captured file's actual JPEG format and dimensions before replacing `images/portfolio-social.jpg`; do not merely change the extension of an unknown image format. A social service may retain a cached preview after an update. No account posting or social-platform access is needed for the site metadata itself.

`node tests/contrast.test.cjs` protects representative solid-surface text colors and the inset figure-focus outline using the [W3C contrast thresholds](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html). This is not a full accessibility certification or a pixel-level check of all translucent, gradient, zoom, or assistive-technology states. Review those states directly as well.

Also run `node tests/related.test.cjs`, `python tests/assets.test.py`, `node tools/build_related.cjs`, and `python tools/version_assets.py` to verify related destinations, project-specific contact links, and current asset versions. Compact phone navigation and project contents dismiss on an outside tap; interactions inside the open controls remain available. On compact case-study layouts, contents remain reachable below the main navigation while reading, with bounded scrolling and section offsets that keep headings visible.

Search indexes separated DOM text nodes, not concatenated `textContent` from minified cards. Verify exact acronyms in the real browser as well as in the tests. Empty category searches can widen to all projects while retaining the visitor's keyword; this option appears only when actual matches exist elsewhere.

Case-study return links open the full project library directly. When a tab has a saved category or keyword, the links include that view in their URL so returning visitors see the same results below the header. Fresh visitors and blocked-storage browsers still have a plain library destination.
Filtered views also remember a bounded list of matching project links in that tab. When the current case belongs to a selection with multiple results, its Next link follows that displayed order and wraps to the first match. Plain browsing, single results, and cases outside the selection retain the original project order. Saved paths are restricted to relative case-study addresses; labels are bounded and inserted as plain text.

Project-file rows show PDF format and rounded decimal transfer sizes in both visible text and accessible link labels. The document checks compare those cues with the original files. If an approved document replacement changes size, update its cues along with the integrity baseline.

When a responsive breakpoint hides a focused menu control, focus moves to its visible toggle or first link without scrolling the page. Normal focus changes and leaving the browser retain their native behavior. Verify both directions when changing compact-navigation breakpoints.
Expanded navigation disclosures also close when keyboard focus leaves their contents, while focus continues to its requested destination. Moving between controls inside the disclosure keeps it open.

The putter and carabiner playback buttons are disabled while the page-wide pause is active, with a hint pointing to the footer control. Their operation and design buttons still allow static inspection. Resuming the page retains any pause the visitor chose within an illustration.

Those two sequences also wait while a report-image control has keyboard focus, so automatic stage changes cannot hide the focused control. Leaving the reference resumes only playback that was already running. Opening and closing the figure viewer retains this hold and returns focus to the same reference.

Table regions enter the Tab order when their content needs horizontal scrolling. Fully visible tables retain their names and native table semantics without adding a noninteractive keyboard stop. This follows layout changes without moving an existing focus; the original HTML keeps keyboard scrolling available when JavaScript is unavailable.

In an actual-size figure, unmodified arrow keys pan the focused detail area. Modified arrows, page-scroll keys, fit mode, and Escape retain their native behavior. Short landscape windows preserve a usable detail area while the surrounding dialog remains scrollable to the source caption.

Project-library searches, categories, resets, and widened searches keep their shareable address at #project-library. Older active-filter links without a fragment or using #work land at the library once on entry, after header clearance is ready. Explicit links to other sections keep their destination. Typing and browser-history restoration do not trigger additional scripted scrolling or focus changes.
Initial library restoration skips its opening transition for the first rendered frame so downstream fragment destinations have a stable layout. Normal user-triggered disclosure motion resumes after setup.

Putter and carabiner loops keep their existing timing but skip geometry writes when the rendered stage and progress have not changed. The putter also tracks reduced motion as a render input, refreshing the static cutter when that preference changes without clearing a local pause. This extends the earlier stage-only metadata updates; it is not an FPS benchmark.

The two illustrations' playback and selection controls retain a 44px minimum height, including the compact phone styles. Keep that minimum when adjusting their padding or typography.
