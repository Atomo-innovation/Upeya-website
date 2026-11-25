# Upeya Electronics LLP website

A static website for Upeya Electronics LLP, presenting its software and electronics services, technology stack, client regions, company information, process, and contact details.

## Project structure

| File or folder | What it does |
| --- | --- |
| `dist/index.html` | Main website page. Contains the page content, sections, navigation, metadata, and references to the styles, scripts, and images. |
| `dist/styles.css` | Site layout, typography, colors, responsive behavior, and visual styling. |
| `dist/navigation.js` | Handles the responsive navigation menu and its interaction states. |
| `dist/technology-strip.js` | Provides behavior for the technology logo strip. |
| `dist/motion.js` | Adds motion and scroll-related visual effects. |
| `dist/hero-particles.js` | Draws the animated particle effect in the hero section. |
| `dist/assets/` | Images, logo, favicon, font, and technology icons used by the site. |
| `dist/assets/technologies/` | SVG logos for the technologies shown on the site, plus their license notice. |
| `dist/project-assets/branding/` | Source branding files for the Upeya logo. |
| `dist/project-assets/references/` | Design reference screenshot used while preparing the site. |
| `.openai/hosting.json` | Hosting configuration. It sets `dist/` as the static site directory. |
| `.gitignore` | Keeps local environment files, credentials folders, dependencies, and operating-system files out of Git. |

## Preview locally

The site is static, so no package installation or build step is required. From the repository root, run a local web server, for example:

```bash
python3 -m http.server 8000 --directory dist
```

Then open <http://localhost:8000> in a browser.

## Deployment

The hosting configuration serves the contents of `dist/` as the website. Keep `index.html`, its linked scripts and stylesheet, and the referenced assets together in that directory.
