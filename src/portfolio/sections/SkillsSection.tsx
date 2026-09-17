import type { Skill, SkillTranslation } from "../../content/content.types";
import { ContentImage, SectionShell } from "./SectionPrimitives";

export function SkillsSection({ items, heading, fallbackCategory, showCategory }: { items: Array<{ entity: Skill; content: SkillTranslation; imageRadius: number }>; heading: string; fallbackCategory: string; showCategory: boolean }) {
  return (
    <SectionShell id="skills" title={heading}>
      <div className="grid gap-px border border-gray-200 bg-gray-200 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ entity, content, imageRadius }) => (
          <article key={entity.id} className="portfolio-card bg-white p-5">
            <ContentImage key={entity.icon || entity.id} src={entity.icon} alt="" className="mb-4 size-10 object-contain" radius={imageRadius} showPlaceholder={false} />
            {showCategory ? <p className="text-xs uppercase tracking-wide text-gray-500">{content.category || fallbackCategory}</p> : null}
            <h3 className={`${showCategory ? "mt-2" : ""} font-semibold text-gray-950`}>{content.name}</h3>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
