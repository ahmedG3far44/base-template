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
