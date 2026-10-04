# Dustin Leung — Engineering Portfolio

Live site: https://dustin07.github.io/DustinPortfolio/

## Structure

- `index.html`: introduction, NASA research spotlight, project library, experience timeline, education, capabilities, and contact.
- `projects/`: case studies with contribution, decision, outcome, and evidence summaries.
- `styles.css`: responsive visual system, liquid-glass surfaces, reading panels, and accessibility fallbacks.
- `ambient.js`: decorative airflow geometry and restrained scroll-linked movement; honors reduced-motion preferences and includes a tab-local visitor pause control.
- `portfolio.js`: searchable project library, shareable filters, tab-local return preferences, compact phone navigation, active sections, and case-study print controls. No data is sent to an analytics service.
- `404.html`: recovery links for missing addresses, including nested project paths.
- `images/`: selected engineering visuals from the original project reports.
- `documents/`: original reports and the publicly approved general résumé.
- `sitemap.xml`: canonical public page addresses.
- `tests/`: dependency-free content and behavior checks for future updates.

## Hosting

This project is published from the existing `Dustin07/DustinPortfolio` repository through GitHub Pages. Do not create a replacement user-site repository or move the site to a paid host to update it. Links are relative so the site works at its current project address.

There are no external font requests, analytics trackers, API keys, contact-form backends, or paid services in the site.

## Updating Content

Content is maintained explicitly; it does not automatically synchronize with Notion or the résumé. Update the relevant HTML page, verify its sources, and check local links, navigation, mobile layout, and image descriptions before publishing. Every case study belongs in the searchable project library. Use evidence-backed outcomes and distinguish planning, simulation, specimen testing, and production adoption.

The public résumé is the supplied PDF, unchanged and approved for publication. Employer technical details must not be added without public-sharing approval. Original academic reports remain unchanged.

## Verification

From the repository root, run `node tests/portfolio.test.cjs`, `node tests/ambient.test.cjs`, `node tests/engineering.test.cjs`, and `python tests/check_site.py`. These check project filtering, URL/session behavior, mobile menu logic, keyboard section focus, active sections, print-control wiring, decorative airflow geometry, reduced motion, inactive-tab pausing, local links, table semantics, image descriptions, page metadata, and the sitemap. The engineering checks also reconcile displayed percentages, geometry calculations, chart data, reference-model attribution, and project sequences. They check internal consistency, not physical validation. Also review real desktop and phone layouts in a browser before publishing; these scripts do not replace visual inspection.
