import { useState } from "react";
import type { Direction, LocaleContent, Project, ProjectTranslation, ThemeColors } from "../../content/content.types";
import { ContentImage, SectionShell } from "./SectionPrimitives";
import { ProjectDetailsSheet } from "./ProjectDetailsSheet";

export function ProjectsSection({ items, heading, labels, direction, language, themeColors, imageRadii }: { items: Array<{ entity: Project; content: ProjectTranslation }>; heading: string; labels: LocaleContent["labels"]; direction: Direction; language: string; themeColors: ThemeColors; imageRadii: Record<string, number> }) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const selectedProject = items.find(({ entity }) => entity.id === selectedProjectId);
  return (
    <>
      <SectionShell id="projects" title={heading}>
        <div className="grid gap-8 md:grid-cols-2">
          {items.map(({ entity, content }) => (
            <article key={entity.id} className="portfolio-card border border-gray-200 bg-white p-4">
              <ContentImage key={entity.image || `${entity.id}-placeholder`} src={entity.image} alt={content.title} className="aspect-video w-full bg-gray-100 object-cover" placeholderLabel={labels.imagePlaceholder} radius={entity.image ? imageRadii[entity.image] ?? 12 : 12} />
              <div className="pt-5">
                <p className="text-xs uppercase tracking-wide text-gray-500">{[content.category, content.year].filter(Boolean).join(" · ")}</p>
                <h3 className="mt-2 text-lg font-semibold text-gray-950">{content.title}</h3>
                {content.shortDescription ? <p className="mt-2 text-gray-600">{content.shortDescription}</p> : null}
                {content.technologies.length ? <p className="mt-3 text-sm text-gray-500">{content.technologies.join(" · ")}</p> : null}
                <button type="button" onClick={() => setSelectedProjectId(entity.id)} className="portfolio-action mt-5 inline-flex min-h-10 items-center border px-4 py-2 text-sm font-medium" aria-label={`${labels.viewDetails}: ${content.title}`}>{labels.viewDetails}</button>
              </div>
            </article>
          ))}
        </div>
      </SectionShell>
      {selectedProject ? <ProjectDetailsSheet entity={selectedProject.entity} content={selectedProject.content} labels={labels} direction={direction} language={language} themeColors={themeColors} imageRadii={imageRadii} onClose={() => setSelectedProjectId(null)} /> : null}
    </>
  );
}
