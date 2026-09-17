import { useContext } from "react";
import { PortfolioContentContext } from "../providers/PortfolioContentContext";

export function usePortfolioContent() {
  const value = useContext(PortfolioContentContext);
  if (!value) throw new Error("usePortfolioContent must be used inside PortfolioContentProvider");
  return value;
}
