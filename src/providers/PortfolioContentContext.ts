import { createContext } from "react";
import type { PortfolioContent } from "../content/content.types";

export type SaveStatus = "idle" | "modified" | "saving" | "saved" | "error";

export interface PortfolioContentContextValue {
  content: PortfolioContent;
  savedContent: PortfolioContent;
  activeLocale: string;
  setActiveLocale: (locale: string) => void;
  updateContent: (mutator: (draft: PortfolioContent) => void) => void;
  isDirty: boolean;
  saveStatus: SaveStatus;
  error: string | null;
  save: () => Promise<void>;
  reset: () => void;
}

export const PortfolioContentContext = createContext<PortfolioContentContextValue | null>(null);
