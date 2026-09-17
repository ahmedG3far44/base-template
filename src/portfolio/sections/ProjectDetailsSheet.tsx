import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Direction, LocaleContent, Project, ProjectTranslation, ThemeColors } from "../../content/content.types";
import { themeStyle } from "../../theme/theme";
import { ContentImage } from "./SectionPrimitives";

const animationDuration = 300;
const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

function CloseIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="size-[17px]"><path d="M18 6 6 18M6 6l12 12" /></svg>;
}

function ExternalLinkIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5"><path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></svg>;
}

interface ProjectDetailsSheetProps {
  entity: Project;
  content: ProjectTranslation;
  labels: LocaleContent["labels"];
  direction: Direction;
  language: string;
  themeColors: ThemeColors;
  imageRadii: Record<string, number>;
  onClose: () => void;
}

export function ProjectDetailsSheet({ entity, content, labels, direction, language, themeColors, imageRadii, onClose }: ProjectDetailsSheetProps) {
  const [isVisible, setIsVisible] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const closeTimerRef = useRef<number | null>(null);
  const isClosingRef = useRef(false);

  const requestClose = useCallback(() => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;
    setIsVisible(false);
    closeTimerRef.current = window.setTimeout(onClose, animationDuration);
  }, [onClose]);

  useEffect(() => {
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const animationFrame = requestAnimationFrame(() => {
      setIsVisible(true);
      closeButtonRef.current?.focus();
    });

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        requestClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>(focusableSelector));
      if (!focusable.length) return;
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      cancelAnimationFrame(animationFrame);
      if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [requestClose]);

  const titleId = `project-details-${entity.id}`;
  return createPortal(
    <div className="portfolio-theme fixed inset-0 z-50" style={themeStyle(themeColors)} dir={direction} lang={language}>
      <button
        type="button"
        aria-label={labels.close}
        onClick={requestClose}
        className={`absolute inset-0 bg-black/45 transition-opacity duration-300 motion-reduce:transition-none ${isVisible ? "opacity-100" : "opacity-0"}`}
      />
      <section
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`portfolio-card absolute bottom-0 left-1/2 flex h-[90vh] w-[90vw] max-w-[1440px] -translate-x-1/2 flex-col overflow-hidden rounded-t-2xl border border-b-0 border-gray-200 bg-white shadow-[0_-24px_70px_rgba(0,0,0,0.24)] transition-transform duration-300 ease-out motion-reduce:transition-none ${isVisible ? "translate-y-0" : "translate-y-full"}`}
      >
        <header className="flex flex-none items-start justify-between gap-6 border-b border-gray-200 bg-white px-5 py-4 sm:px-8">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">{labels.projectDetails}</p>
            <h2 id={titleId} className="mt-1 truncate text-xl font-semibold text-gray-950 sm:text-2xl">{content.title}</h2>
          </div>
          <button ref={closeButtonRef} type="button" onClick={requestClose} className="inline-flex min-h-10 flex-none items-center gap-2 rounded-full border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-100" aria-label={labels.close}>
            <CloseIcon />
            <span className="hidden sm:inline">{labels.close}</span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto scroll-smooth overscroll-contain px-5 py-8 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-6xl pb-16">
            <ContentImage key={entity.image || `${entity.id}-details-placeholder`} src={entity.image} alt={content.title} className="aspect-video w-full bg-gray-100 object-cover" placeholderLabel={labels.imagePlaceholder} radius={entity.image ? imageRadii[entity.image] ?? 12 : 12} />

            <div className="grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
              <div>
                {content.shortDescription ? <p className="text-xl leading-8 text-gray-800 sm:text-2xl">{content.shortDescription}</p> : null}
                {content.description ? <p className="mt-6 whitespace-pre-line leading-7 text-gray-600">{content.description}</p> : null}
              </div>
              <aside className="space-y-6 border-t border-gray-200 pt-6 lg:border-s lg:border-t-0 lg:ps-8 lg:pt-0">
                {content.category ? <div><p className="text-xs font-medium uppercase tracking-wider text-gray-500">{labels.category}</p><p className="mt-1 text-sm font-medium text-gray-900">{content.category}</p></div> : null}
                {content.role ? <div><p className="text-xs font-medium uppercase tracking-wider text-gray-500">{labels.role}</p><p className="mt-1 text-sm font-medium text-gray-900">{content.role}</p></div> : null}
                {content.year ? <div><p className="text-xs font-medium uppercase tracking-wider text-gray-500">{labels.year}</p><p className="mt-1 text-sm font-medium text-gray-900">{content.year}</p></div> : null}
                {content.technologies.length ? <div><p className="text-xs font-medium uppercase tracking-wider text-gray-500">{labels.technologies}</p><div className="mt-2 flex flex-wrap gap-2">{content.technologies.map((technology) => <span key={technology} className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-700">{technology}</span>)}</div></div> : null}
                <div className="flex flex-col gap-2">
                  {entity.liveUrl ? <a href={entity.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-between border-b border-gray-200 py-2 text-sm font-medium text-gray-900">{labels.liveSite}<ExternalLinkIcon /></a> : null}
                  {entity.repositoryUrl ? <a href={entity.repositoryUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-between border-b border-gray-200 py-2 text-sm font-medium text-gray-900">{labels.repository}<ExternalLinkIcon /></a> : null}
                  {entity.caseStudyUrl ? <a href={entity.caseStudyUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-between border-b border-gray-200 py-2 text-sm font-medium text-gray-900">{labels.caseStudy}<ExternalLinkIcon /></a> : null}
                </div>
              </aside>
            </div>

            {entity.gallery.length ? (
              <section aria-labelledby={`${titleId}-gallery`} className="border-t border-gray-200 pt-10">
                <h3 id={`${titleId}-gallery`} className="text-xl font-semibold text-gray-950">{labels.gallery}</h3>
                <div className="mt-6 space-y-6">
                  {entity.gallery.map((image, index) => <ContentImage key={image} src={image} alt={`${content.title} ${index + 1}`} className="aspect-video w-full bg-gray-100 object-cover" radius={imageRadii[image] ?? 12} showPlaceholder={false} />)}
                </div>
              </section>
            ) : null}
          </div>
        </div>
      </section>
    </div>,
    document.body,
  );
}
