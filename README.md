# Sogilex

The Sogilex company site, served at https://sogilex.com/ via GitHub Pages.

- Plain HTML and CSS, no build step, no cookies, no analytics.
- Pages: `/` (home), `/menus/`, `/flyers/`. The waitlist forms (`assets/waitlist.js`) insert into the `waitlist` table in Supabase (`supabase/waitlist.sql`); read signups in the Supabase dashboard.
- `assets/scene.js` draws the background scene (sunset over a particle sea). Decoration only: the page works without it, and it shows a still frame when reduced motion is on.
- Fonts are self-hosted in `assets/fonts` (SIL Open Font License): Unbounded, Inter, JetBrains Mono, Montserrat (wordmark).
- Contact: hello@sogilex.com (Porkbun email forwarding).
- Tools live on their own subdomains, e.g. Build, Menus and Flyers at https://build.sogilex.com/.
- Services: everything Sogilex offers is listed once in `assets/services.js`; the menu's Services tab, the homepage cards and /services/ are built from it. To add a service, add an entry there.
