import { useEffect } from "react";
import type { Direction, SEOContent } from "../content/content.types";

function setMeta(attribute: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!content) {
    element?.remove();
    return;
  }
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.append(element);
  }
  element.content = content;
}

function setFavicon(path?: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (!path) {
    element?.remove();
    return;
  }
  if (!element) {
    element = document.createElement("link");
    element.rel = "icon";
    document.head.append(element);
  }
  element.href = path;
}

export function PageMetadata({ seo, locale, direction, favicon, heroImage, themeColor }: {
  seo: SEOContent;
  locale: string;
  direction: Direction;
  favicon?: string;
  heroImage?: string;
  themeColor: string;
}) {
  useEffect(() => {
    const socialTitle = seo.socialTitle || seo.pageTitle;
    const socialDescription = seo.socialDescription || seo.description;
    const socialImage = heroImage ? new URL(heroImage, window.location.href).href : "";

    document.title = seo.pageTitle || "Portfolio";
    document.documentElement.lang = locale;
    document.documentElement.dir = direction;
    setFavicon(favicon);
    setMeta("name", "description", seo.description);
    setMeta("name", "keywords", seo.keywords.join(", "));
    setMeta("name", "author", seo.author ?? "");
    setMeta("name", "robots", "index, follow");
    setMeta("name", "theme-color", themeColor);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:locale", locale);
    setMeta("property", "og:title", socialTitle);
    setMeta("property", "og:description", socialDescription);
    setMeta("property", "og:image", socialImage);
    setMeta("name", "twitter:card", socialImage ? "summary_large_image" : "summary");
    setMeta("name", "twitter:title", socialTitle);
    setMeta("name", "twitter:description", socialDescription);
    setMeta("name", "twitter:image", socialImage);
  }, [seo, locale, direction, favicon, heroImage, themeColor]);

  return null;
}
