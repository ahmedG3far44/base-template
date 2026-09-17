import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { usePortfolioContent } from "../hooks/usePortfolioContent";
import { Button, Field, Input, inputClass } from "./forms/FormControls";

const languagePresets = [
  { code: "en", name: "English" },
  { code: "ar", name: "العربية" },
  { code: "fr", name: "Français" },
  { code: "es", name: "Español" },
  { code: "de", name: "Deutsch" },
  { code: "it", name: "Italiano" },
  { code: "pt", name: "Português" },
] as const;

export function LocaleSelector() {
  const { content, activeLocale, setActiveLocale } = usePortfolioContent();
  return (
    <Field label="Editing language">
      <select value={activeLocale} onChange={(event) => setActiveLocale(event.target.value)} className={inputClass}>
        {content.settings.locales.map((locale) => <option key={locale.code} value={locale.code}>{locale.name} ({locale.code})</option>)}
      </select>
    </Field>
  );
}

export function LanguageManager() {
  const { content, activeLocale, setActiveLocale, updateContent } = usePortfolioContent();
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  function addLanguageDefinition(localeCode: string, localeName: string) {
    const normalized = localeCode.trim().toLowerCase();
    if (!localeName.trim() || !/^[a-z]{2,3}(?:-[a-z0-9]{2,8})?$/i.test(normalized)) return;
    if (content.settings.locales.some((locale) => locale.code === normalized)) return;
    updateContent((draft) => {
      draft.settings.locales.push({ code: normalized, name: localeName.trim() });
      const fallback = draft.translations[draft.settings.defaultLocale] ?? Object.values(draft.translations)[0];
      if (fallback) draft.translations[normalized] = structuredClone(fallback);
    });
    setActiveLocale(normalized);
    setName(""); setCode(""); setIsAdding(false);
  }

  function removeLanguage(codeToRemove: string) {
    if (codeToRemove === content.settings.defaultLocale) return;
    if (!window.confirm(`Remove ${codeToRemove} and its translations?`)) return;
    updateContent((draft) => {
      draft.settings.locales = draft.settings.locales.filter((locale) => locale.code !== codeToRemove);
      delete draft.translations[codeToRemove];
      for (const collection of Object.values(draft.collections)) for (const item of collection) delete item.translations[codeToRemove];
    });
    if (activeLocale === codeToRemove) setActiveLocale(content.settings.defaultLocale);
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {content.settings.locales.map((locale) => (
          <div key={locale.code} className="flex items-center justify-between rounded-md border border-gray-200 px-3 py-2">
            <div><p className="text-sm font-medium text-gray-900">{locale.name}</p><p className="text-xs text-gray-500">{locale.code.toUpperCase()}{locale.code === content.settings.defaultLocale ? " · Default" : ""}</p></div>
            {locale.code !== content.settings.defaultLocale ? <Button type="button" variant="danger" size="compact" onClick={() => removeLanguage(locale.code)}><Trash2 size={13} />Remove</Button> : null}
          </div>
        ))}
      </div>
      <div>
        <p className="mb-2 text-xs font-medium text-gray-600">Add a supported language</p>
        <div className="flex flex-wrap gap-2">
          {languagePresets.filter((preset) => !content.settings.locales.some((locale) => locale.code === preset.code)).map((preset) => (
            <Button key={preset.code} type="button" onClick={() => addLanguageDefinition(preset.code, preset.name)}><Plus size={15} />{preset.name}</Button>
          ))}
        </div>
      </div>
      {isAdding ? (
        <div className="space-y-3 rounded-md border border-gray-200 p-3">
          <Input label="Language name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Français" />
          <Input label="Locale code" value={code} onChange={(event) => setCode(event.target.value)} placeholder="fr" />
          <p className="text-xs leading-5 text-gray-500">Arabic locale codes use RTL automatically. Every other language defaults to LTR.</p>
          <div className="flex gap-2"><Button type="button" variant="primary" onClick={() => addLanguageDefinition(code, name)} disabled={!name.trim() || !code.trim()}>Add language</Button><Button type="button" onClick={() => setIsAdding(false)}>Cancel</Button></div>
        </div>
      ) : <Button type="button" onClick={() => setIsAdding(true)}><Plus size={15} />Add custom language</Button>}
    </div>
  );
}
