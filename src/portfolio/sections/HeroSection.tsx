import type { HeroContent } from "../../content/content.types";
import { ContentImage, TextLink } from "./SectionPrimitives";

export function HeroSection({ content, image, imagePlaceholder, imageRadius }: { content: HeroContent; image?: string; imagePlaceholder: string; imageRadius: number }) {
  return (
    <section id="hero" className="border-b border-gray-200 px-6 py-20 sm:px-10 lg:px-16">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.4fr_1fr] md:items-center">
        <div>
          {content.eyebrow ? <p className="mb-4 text-sm font-medium text-gray-500">{content.eyebrow}</p> : null}
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-gray-950 sm:text-5xl">{content.title}</h1>
          {content.subtitle ? <p className="mt-5 text-lg text-gray-700">{content.subtitle}</p> : null}
          {content.description ? <p className="mt-4 max-w-2xl leading-7 text-gray-600">{content.description}</p> : null}
          <div className="mt-7 flex flex-wrap gap-3">
            {content.primaryCTA ? <TextLink href={content.primaryCTA.href}>{content.primaryCTA.label}</TextLink> : null}
            {content.secondaryCTA ? <TextLink href={content.secondaryCTA.href}>{content.secondaryCTA.label}</TextLink> : null}
          </div>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500">
            {content.availability ? <span>{content.availability}</span> : null}
            {content.location ? <span>{content.location}</span> : null}
          </div>
        </div>
        <ContentImage key={image || "hero-placeholder"} src={image} alt={content.title} className="aspect-square w-full bg-gray-100 object-cover" placeholderLabel={imagePlaceholder} radius={imageRadius} square />
      </div>
    </section>
  );
}
