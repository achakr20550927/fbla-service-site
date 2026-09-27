# Silence the Violence

A student-led Maryland community safety resource from Centennial High School FBLA.

## Develop and verify

Use Node.js 22.18+ (Node 24 recommended).

```sh
npm ci
npm run dev
npm run test
npm run lint
npm run build
```

The site uses React, TypeScript, Vite, and hash routing. Netlify builds `dist` using `netlify.toml`; other static hosts can serve the same build. Generated build files are not source files.

## Data

`src/lib/data.ts` contains source-linked county rates, statewide trends, Census context, modeled interface previews, and resource listings. See `docs/DATA_SOURCES.md` and the website’s Sources & Methodology page before editing any figure. Missing/suppressed rates must remain `null`, never zero. Modeled fields must retain their visible preview labels until replaced by official dashboard exports.

`src/data/boundaries.json` contains simplified MD iMAP geometry in display coordinates. `scripts/build-boundaries.py` reproduces the paths from the documented GeoJSON query.

ZIP lookup is inherited project data, not an authoritative postal crosswalk. Search shows a suggested county for confirmation; county-name selection is always available.

## Contact and privacy

The contact form retains the project’s existing public Web3Forms access key. It sends a name, email, subject, and message to the configured recipient. Test delivery with the project owner before launch; automated checks do not send messages. The direct email link remains available if the service fails.

The resource guide filters the local directory. It makes no AI requests, requires no API secret, and stores no conversation. The former AI proxy and its dependencies have been removed. The existing local `.env` is ignored and unused by the application; do not commit it.

## Publishing

Build and lint must pass before publishing. The repository’s current hosting configuration targets Netlify. No hosting migration is required for the redesign. The contact form provider and external service links operate independently of the static host.
