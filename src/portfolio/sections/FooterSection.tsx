import type { FooterContent } from "../../content/content.types";

export function FooterSection({ content }: { content: FooterContent }) {
  const links = [...content.navigation, ...content.socialLinks, ...content.additionalLinks];
  return (
    <footer className="px-6 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-6 sm:flex-row">
        <div><p className="font-semibold text-gray-950">{content.name}</p>{content.description ? <p className="mt-2 text-sm text-gray-500">{content.description}</p> : null}<p className="mt-4 text-xs text-gray-500">{content.copyright}</p></div>
        <nav aria-label="Footer navigation" className="flex flex-wrap items-start gap-4 text-sm text-gray-600">{links.map((item) => <a key={item.id} href={item.href}>{item.label}</a>)}</nav>
      </div>
    </footer>
  );
}
