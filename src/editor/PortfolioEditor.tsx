import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Languages,
  LayoutList,
  LoaderCircle,
  Palette,
  Settings2,
  RotateCcw,
  Save,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePortfolioContent } from "../hooks/usePortfolioContent";
import { LanguageManager, LocaleSelector } from "./LanguageManager";
import { SectionManager } from "./SectionManager";
import { ThemeEditor } from "./ThemeEditor";
import { CollectionEditors } from "./forms/CollectionEditors";
import { Button } from "./forms/FormControls";
import { ContentEditors } from "./forms/SingletonEditors";

type Tab = "structure" | "content" | "languages" | "theme";

const tabs = [
  { id: "structure", label: "Structure", Icon: LayoutList },
  { id: "content", label: "Content", Icon: FileText },
  { id: "languages", label: "Languages", Icon: Languages },
  { id: "theme", label: "Theme", Icon: Palette },
] as const;

function StatusMessage() {
  const { isDirty, saveStatus } = usePortfolioContent();
  if (saveStatus === "saving")
    return (
      <span className="flex items-center gap-1.5 text-amber-700">
        <LoaderCircle size={14} className="animate-spin" />
        Saving…
      </span>
    );
  if (saveStatus === "error")
    return (
      <span className="flex items-center gap-1.5 text-red-700">
        <AlertCircle size={14} />
        Save failed
      </span>
    );
  if (saveStatus === "saved" && !isDirty)
    return (
      <span className="flex items-center gap-1.5 text-green-700">
        <CheckCircle2 size={14} />
        Saved
      </span>
    );
  if (isDirty)
    return (
      <span className="flex items-center gap-1.5 text-amber-700">
        <span className="size-2 rounded-full bg-amber-500" />
        Unsaved changes
      </span>
    );
  return <span className="text-gray-500">No unsaved changes</span>;
}

export default function PortfolioEditor() {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("structure");
  const closeButton = useRef<HTMLButtonElement>(null);
  const { activeLocale, isDirty, saveStatus, error, save, reset } =
    usePortfolioContent();

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    closeButton.current?.focus();
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open portfolio content editor"
        className="fixed bottom-6 right-6 z-40 inline-flex size-12 items-center justify-center rounded-full bg-gray-950 text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-white"
      >
        <Settings2 size={19} />
      </button>

      <div
        aria-hidden={!isOpen}
        className={`fixed inset-0 z-50 transition ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        <button
          type="button"
          tabIndex={isOpen ? 0 : -1}
          aria-label="Close editor"
          onClick={() => setIsOpen(false)}
          className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
        />
        <aside
          role="dialog"
          aria-modal="true"
          aria-labelledby="editor-title"
          className={`absolute inset-y-0 right-0 flex w-full max-w-[500px] flex-col border-l border-gray-200 bg-white shadow-xl transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <header className="flex items-start justify-between border-b border-gray-200 px-5 py-4">
            <div>
              <h2 id="editor-title" className="font-semibold text-gray-950">
                Portfolio Editor
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                Development only · changes preview instantly
              </p>
            </div>
            <button
              ref={closeButton}
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close content editor"
              className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-950"
            >
              <X size={18} />
            </button>
          </header>

          <div className="border-b border-gray-200 px-5 py-4">
            <LocaleSelector />
          </div>

          <nav
            aria-label="Editor sections"
            className="grid grid-cols-4 border-b border-gray-200 px-5 pt-3"
          >
            {tabs.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`inline-flex items-center justify-center gap-1.5 border-b-2 px-1 py-2 text-xs font-medium sm:text-sm ${tab === id ? "border-gray-950 text-gray-950" : "border-transparent text-gray-500 hover:text-gray-800"}`}
              >
                <Icon size={14} />
                <span>{label}</span>
              </button>
            ))}
          </nav>

          <div className="flex-1 overflow-y-auto px-5 py-5">
            {tab === "structure" ? (
              <>
                <h3 className="mb-1 text-sm font-semibold text-gray-950">
                  Page structure
                </h3>
                <p className="mb-4 text-xs leading-5 text-gray-500">
                  Drag the middle sections to reorder them. Header and footer
                  stay fixed.
                </p>
                <SectionManager />
              </>
            ) : null}
            {tab === "content" ? (
              <div key={activeLocale}>
                <p className="mb-4 text-xs leading-5 text-gray-500">
                  Open a section to edit its content. Collection order is shared
                  across languages.
                </p>
                <ContentEditors />
                <CollectionEditors />
              </div>
            ) : null}
            {tab === "languages" ? (
              <>
                <h3 className="mb-1 text-sm font-semibold text-gray-950">
                  Languages
                </h3>
                <p className="mb-4 text-xs leading-5 text-gray-500">
                  Choose the languages shown on the portfolio, then use “Editing
                  language” above to enter independent content for every
                  section. Arabic is RTL automatically; all other locales are
                  LTR.
                </p>
                <LanguageManager />
              </>
            ) : null}
            {tab === "theme" ? <ThemeEditor /> : null}
          </div>

          <footer className="border-t border-gray-200 bg-white px-5 py-4">
            {error ? (
              <div
                role="alert"
                className="mb-3 whitespace-pre-wrap rounded-md border border-red-200 bg-red-50 p-3 text-xs leading-5 text-red-800"
              >
                <strong>Could not save content.json.</strong>
                <br />
                {error}
              </div>
            ) : null}
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs">
                <StatusMessage />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={reset}
                  disabled={!isDirty || saveStatus === "saving"}
                >
                  <RotateCcw size={14} />
                  Reset
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => void save()}
                  disabled={!isDirty || saveStatus === "saving"}
                >
                  {saveStatus === "saving" ? (
                    <LoaderCircle size={14} className="animate-spin" />
                  ) : (
                    <Save size={14} />
                  )}
                  {saveStatus === "saving" ? "Saving…" : "Save Changes"}
                </Button>
              </div>
            </div>
          </footer>
        </aside>
      </div>
    </>
  );
}
