import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import initialContentJson from "../content/content.json";
import { formatValidationError, portfolioContentSchema } from "../content/content.schema";
import type { PortfolioContent } from "../content/content.types";
import { cloneContent } from "../content/content.utils";
import { PortfolioContentContext, type PortfolioContentContextValue, type SaveStatus } from "./PortfolioContentContext";

const initialResult = portfolioContentSchema.safeParse(initialContentJson);
if (!initialResult.success) throw new Error(`Invalid content.json:\n${formatValidationError(initialResult.error)}`);
const bundledContent = initialResult.data as PortfolioContent;

export function PortfolioContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<PortfolioContent>(() => cloneContent(bundledContent));
  const [savedContent, setSavedContent] = useState<PortfolioContent>(() => cloneContent(bundledContent));
  const [activeLocale, setActiveLocale] = useState(bundledContent.settings.defaultLocale);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const isDirty = useMemo(() => JSON.stringify(content) !== JSON.stringify(savedContent), [content, savedContent]);

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const controller = new AbortController();
    void fetch("/__portfolio-editor/content", { signal: controller.signal })
      .then(async (response) => {
        const body: unknown = await response.json();
        if (!response.ok) throw new Error(typeof body === "object" && body && "error" in body ? String(body.error) : "Could not load content.json");
        const parsed = portfolioContentSchema.safeParse(body);
        if (!parsed.success) throw new Error(formatValidationError(parsed.error));
        const next = parsed.data as PortfolioContent;
        setContent(cloneContent(next));
        setSavedContent(cloneContent(next));
        setActiveLocale((current) => next.settings.locales.some((locale) => locale.code === current) ? current : next.settings.defaultLocale);
      })
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === "AbortError") return;
        setError(reason instanceof Error ? reason.message : "Could not load content.json");
        setSaveStatus("error");
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (isDirty && saveStatus !== "saving") setSaveStatus("modified");
  }, [isDirty, saveStatus]);

  const updateContent = useCallback((mutator: (draft: PortfolioContent) => void) => {
    setContent((current) => {
      const draft = cloneContent(current);
      mutator(draft);
      return draft;
    });
    setError(null);
  }, []);

  const save = useCallback(async () => {
    if (!import.meta.env.DEV || saveStatus === "saving") return;
    const parsed = portfolioContentSchema.safeParse(content);
    if (!parsed.success) {
      setError(formatValidationError(parsed.error));
      setSaveStatus("error");
      return;
    }

    setSaveStatus("saving");
    setError(null);
    try {
      const response = await fetch("/__portfolio-editor/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const body: unknown = await response.json();
      if (!response.ok) throw new Error(typeof body === "object" && body && "error" in body ? String(body.error) : "Could not save content.json");
      setContent(parsed.data as PortfolioContent);
      setSavedContent(cloneContent(parsed.data as PortfolioContent));
      setSaveStatus("saved");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not save content.json");
      setSaveStatus("error");
    }
  }, [content, saveStatus]);

  const reset = useCallback(() => {
    setContent(cloneContent(savedContent));
    setError(null);
    setSaveStatus("idle");
  }, [savedContent]);

  const value = useMemo<PortfolioContentContextValue>(() => ({
    content,
    savedContent,
    activeLocale,
    setActiveLocale,
    updateContent,
    isDirty,
    saveStatus,
    error,
    save,
    reset,
  }), [content, savedContent, activeLocale, updateContent, isDirty, saveStatus, error, save, reset]);

  return <PortfolioContentContext.Provider value={value}>{children}</PortfolioContentContext.Provider>;
}
