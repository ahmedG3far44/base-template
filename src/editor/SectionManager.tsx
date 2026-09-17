import { LockKeyhole } from "lucide-react";
import type { SectionId } from "../content/content.types";
import { usePortfolioContent } from "../hooks/usePortfolioContent";
import { SortableList } from "./SortableList";

const labels: Record<SectionId, string> = {
  hero: "Hero",
  experiences: "Experiences",
  skills: "Skills",
  projects: "Projects",
  services: "Services",
  testimonials: "Testimonials",
  contact: "Contact",
};

function VisibilityButton({ visible, onChange, label }: { visible: boolean; onChange: () => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={visible}
      aria-label={`${visible ? "Hide" : "Show"} ${label}`}
      title={visible ? "Visible" : "Hidden"}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 flex-none items-center rounded-full border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 ${visible ? "border-gray-950 bg-gray-950" : "border-gray-300 bg-gray-200"}`}
    >
      <span aria-hidden="true" className={`size-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${visible ? "translate-x-5" : "translate-x-1"}`} />
    </button>
  );
}

export function SectionManager() {
  const { content, updateContent } = usePortfolioContent();

  function setFixedVisibility(key: "header" | "footer") {
    updateContent((draft) => { draft.layout[key].visible = !draft.layout[key].visible; });
  }

  const fixedRow = (key: "header" | "footer", label: string) => (
    <div className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 px-3 py-2">
      <span className="flex items-center gap-2 text-sm font-medium"><LockKeyhole size={14} className="text-gray-400" />{label}</span>
      <VisibilityButton label={label} visible={content.layout[key].visible} onChange={() => setFixedVisibility(key)} />
    </div>
  );

  return (
    <div className="space-y-2">
      {fixedRow("header", "Header")}
      <SortableList
        entries={content.layout.sections.map((section) => ({
          id: section.id,
          content: <div className="flex items-center justify-between gap-2"><span className="text-sm font-medium">{labels[section.id]}</span><VisibilityButton label={labels[section.id]} visible={section.visible} onChange={() => updateContent((draft) => { const item = draft.layout.sections.find((entry) => entry.id === section.id); if (item) item.visible = !item.visible; })} /></div>,
        }))}
        onReorder={(ids) => updateContent((draft) => { draft.layout.sections = ids.map((id) => draft.layout.sections.find((section) => section.id === id)!).filter(Boolean); })}
      />
      {fixedRow("footer", "Footer")}
    </div>
  );
}
