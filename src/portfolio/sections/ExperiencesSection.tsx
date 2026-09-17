import type { Experience, ExperienceTranslation } from "../../content/content.types";
import { SectionShell } from "./SectionPrimitives";

export function ExperiencesSection({ items, heading, presentLabel }: { items: Array<{ entity: Experience; content: ExperienceTranslation }>; heading: string; presentLabel: string }) {
  return (
    <SectionShell id="experiences" title={heading}>
      <div className="divide-y divide-gray-200 border-y border-gray-200">
        {items.map(({ entity, content }) => (
          <article key={entity.id} className="grid gap-3 py-7 md:grid-cols-[12rem_1fr]">
            <p className="text-sm text-gray-500">{entity.startDate || "—"} – {entity.current ? presentLabel : entity.endDate || "—"}</p>
            <div>
              <h3 className="font-semibold text-gray-950">{content.role}</h3>
              <p className="mt-1 text-gray-700">{content.company}{content.location ? ` · ${content.location}` : ""}</p>
              {content.description ? <p className="mt-3 max-w-3xl text-gray-600">{content.description}</p> : null}
              {content.achievements.length ? <ul className="mt-3 list-disc space-y-1 ps-5 text-sm text-gray-600">{content.achievements.map((item) => <li key={item}>{item}</li>)}</ul> : null}
              {content.technologies.length ? <p className="mt-3 text-sm text-gray-500">{content.technologies.join(" · ")}</p> : null}
            </div>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
