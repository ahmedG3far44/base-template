import { useState, type ReactNode } from "react";

export function SectionShell({ id, eyebrow, title, children }: { id: string; eyebrow?: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="border-b border-gray-200 px-6 py-16 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        {eyebrow ? <p className="mb-2 text-sm font-medium text-gray-500">{eyebrow}</p> : null}
        <h2 className="text-2xl font-semibold text-gray-950">{title}</h2>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}

export function ImagePlaceholder({ label = "Image placeholder", square = false, radius }: { label?: string; square?: boolean; radius?: number }) {
  return (
    <div style={radius === undefined ? undefined : { borderRadius: `${radius}px` }} className={`flex items-center justify-center bg-gray-200 text-sm text-gray-500 ${square ? "aspect-square" : "aspect-video"}`}>
      {label}
    </div>
  );
}

export function ContentImage({ src, alt, className, placeholderLabel, square = false, showPlaceholder = true, radius }: {
  src?: string;
  alt: string;
  className: string;
  placeholderLabel?: string;
  square?: boolean;
  showPlaceholder?: boolean;
  radius?: number;
}) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return showPlaceholder ? <ImagePlaceholder label={placeholderLabel} square={square} radius={radius} /> : null;
  return <img src={src} alt={alt} style={radius === undefined ? undefined : { borderRadius: `${radius}px` }} className={className} onError={() => setFailed(true)} />;
}

export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return <a href={href} className="portfolio-action inline-flex min-h-10 items-center border px-4 py-2 text-sm font-medium">{children}</a>;
}
