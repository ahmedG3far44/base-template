# Development-only portfolio content editor

This project is a React 19, TypeScript, Vite, and Tailwind CSS portfolio template
whose content is stored in `src/content/content.json`.

## Use it

```bash
npm install
npm run dev
```

Open the local URL and use the pencil button in the bottom-right corner. Edits
update the preview immediately. **Save Changes** validates the complete content
document in the browser and in Vite's development server before replacing
`content.json`.

Build the static portfolio with:

```bash
npm run build
```

The editor is lazily imported behind `import.meta.env.DEV`. Production builds do
not include its UI, drag-and-drop code, save endpoint, or editor copy.

## Images

Image fields accept a URL/path or a dragged local image. During development the
editor validates PNG, JPEG, WebP, GIF, and AVIF files up to 8 MB, renames them
from the owning section slug or stable ID, and writes them to `public/images`.
The saved content path uses Vite's public URL form, such as
`/images/operations-platform.png`. A new drop replaces the referenced image;
**Remove image** clears the content reference without deleting the local file.
The Hero image is global rather than translated, so one upload is used across
every selected language while Hero text remains independently editable.

## Content architecture

Layout order and visibility are global. Page-level translated copy lives under
`translations[locale]`. Reorderable collections are normalized under
`collections`: every entity has one stable ID and a `translations` record keyed
by locale. This avoids creating unrelated projects, skills, or experiences for
each language while keeping non-translated fields—dates, URLs, images, and sort
order—in one place.

The locale code determines text direction automatically: `ar` and Arabic
regional codes use RTL, while every other locale defaults to LTR. The language
manager offers common presets and still accepts custom locale codes.

When a collection item has no translation for the selected locale, the renderer
uses the default locale, then the first available translation. Editing that item
creates an independent translation for the active locale. New languages begin
with a copy of the default page-level copy; collection copy continues to use the
fallback until edited.

The Zod schema in `src/content/content.schema.ts` is shared by the client and the
development-only Vite middleware. Saving uses a temporary UTF-8 file followed by
a rename so a partially written request does not corrupt the main JSON file.


<!-- Design Lang -->

| Portfolio         | Possible Design Language                      |
| ----------------- | --------------------------------------------- |
| Software Engineer | technical / systems / terminal / architecture |
| AI Engineer       | futuristic / research / data visualization    |
| UI/UX Designer    | editorial / product-showcase / case-study     |
| Graphic Designer  | experimental / typography-heavy               |
| Photographer      | immersive / image-first / gallery             |
| Video Editor      | cinematic / dark / timeline                   |
| Motion Designer   | animation-heavy / kinetic                     |
| 3D Artist         | immersive / large canvases                    |
| Game Developer    | game UI / HUD / cinematic                     |
| Architect         | grid / Swiss / editorial                      |
| Copywriter        | typography / editorial                        |
| Content Creator   | social/media driven                           |
| Freelancer        | conversion-focused                            |


<!-- Different Art Styles -->
01 Editorial
02 Swiss Minimal
03 Brutalist
04 Neo-Brutalist
05 Technical
06 Futuristic
07 Luxury
08 Retro
09 Playful
10 Cinematic
11 Monochrome
12 Experimental
13 Corporate Premium
14 Glass / Digital
15 Organic


<!-- Prompt Way -->


18. The Creative Director prompt is the critical part

I would give your first AI agent instructions approximately like this:

You are the creative director for a premium portfolio-template marketplace.

Analyze the provided content.json, but do not alter its schema.

Your task is to create a distinctive visual identity for a portfolio targeting {profession}.

First define the creative concept before writing code.

Define:

visual concept
art direction
typography system
maximum two font families
color palette
spacing system
grid
section rhythm
border/radius language
image treatment
iconography
motion language
Header composition
Hero composition
Experience composition
Skills composition
Projects composition
Project Details composition
Services composition
Testimonials composition
Contact composition
Footer composition
Mobile behavior
Tablet behavior
Laptop behavior
Desktop behavior
Large-screen behavior
RTL behavior

Avoid generic SaaS aesthetics.

Do not make every section a grid of rounded cards.

Do not use gradients unless they materially support the creative concept.

Each section must feel related to the same design system while having its own composition.

Use typography, spacing, layout, imagery and composition as the primary means of differentiation rather than decorative effects.
