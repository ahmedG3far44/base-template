import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { useEffect, useId, useState } from "react";
import type { ThemeColors } from "../content/content.types";
import { usePortfolioContent } from "../hooks/usePortfolioContent";
import { contrastRatio, themePresets } from "../theme/theme";

type ColorKey = keyof ThemeColors;

const colorFields: Array<{ key: ColorKey; label: string }> = [
  { key: "background", label: "Main background" },
  { key: "heading", label: "Main headings" },
  { key: "primaryText", label: "Primary text" },
  { key: "secondaryText", label: "Secondary text" },
  { key: "border", label: "Borders" },
  { key: "cardBackground", label: "Card background" },
  { key: "cardText", label: "Card text" },
  { key: "accent", label: "Accent and buttons" },
  { key: "accentText", label: "Accent text" },
];

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (color: string) => void }) {
  const id = useId();
  const [draft, setDraft] = useState(value.toUpperCase());
  const isValid = /^#[0-9a-fA-F]{6}$/.test(draft);

  useEffect(() => setDraft(value.toUpperCase()), [value]);

  function commit() {
    if (isValid) onChange(draft.toUpperCase());
    else setDraft(value.toUpperCase());
  }

  return (
    <div>
      <label htmlFor={`${id}-text`} className="text-xs font-medium text-gray-700">{label}</label>
      <div className="mt-1 flex items-center gap-2">
        <label htmlFor={`${id}-picker`} className="relative size-9 flex-none overflow-hidden rounded-md border border-gray-300 shadow-sm" style={{ backgroundColor: value }}>
          <span className="sr-only">Choose {label.toLowerCase()}</span>
          <input id={`${id}-picker`} type="color" value={value} onChange={(event) => onChange(event.target.value.toUpperCase())} className="absolute inset-[-8px] size-14 cursor-pointer opacity-0" />
        </label>
        <input
          id={`${id}-text`}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commit}
          onKeyDown={(event) => { if (event.key === "Enter") event.currentTarget.blur(); }}
          aria-invalid={!isValid}
          spellCheck={false}
          className={`min-w-0 flex-1 rounded-md border bg-white px-2.5 py-2 font-mono text-xs uppercase text-gray-950 shadow-sm focus:outline-none focus:ring-1 ${isValid ? "border-gray-300 focus:border-gray-900 focus:ring-gray-900" : "border-red-400 focus:border-red-600 focus:ring-red-600"}`}
        />
      </div>
      {!isValid ? <p className="mt-1 text-xs text-red-700">Use a six-digit hex color.</p> : null}
    </div>
  );
}

export function ThemeEditor() {
  const { content, updateContent } = usePortfolioContent();
  const theme = content.settings.theme;
  const colors = theme.colors;
  const checks = [
    { label: "Headings on background", ratio: contrastRatio(colors.heading, colors.background), minimum: 3, standard: "AA large text" },
    { label: "Primary text on background", ratio: contrastRatio(colors.primaryText, colors.background), minimum: 4.5, standard: "AA text" },
    { label: "Secondary text on background", ratio: contrastRatio(colors.secondaryText, colors.background), minimum: 4.5, standard: "AA text" },
    { label: "Text on cards", ratio: contrastRatio(colors.cardText, colors.cardBackground), minimum: 4.5, standard: "AA text" },
    { label: "Text on accent", ratio: contrastRatio(colors.accentText, colors.accent), minimum: 4.5, standard: "AA text" },
  ];
  const passedChecks = checks.filter((check) => check.ratio >= check.minimum).length;
  const isSafe = passedChecks === checks.length;

  function applyPreset(preset: (typeof themePresets)[number]) {
    updateContent((draft) => {
      draft.settings.theme = { preset: preset.id, colors: { ...preset.colors } };
    });
  }

  function updateColor(key: ColorKey, value: string) {
    updateContent((draft) => {
      draft.settings.theme.preset = "custom";
      draft.settings.theme.colors[key] = value;
    });
  }

  return (
    <div className="space-y-6">
      <section aria-labelledby="theme-presets-title">
        <h3 id="theme-presets-title" className="text-sm font-semibold text-gray-950">Theme presets</h3>
        <p className="mt-1 text-xs leading-5 text-gray-500">Choose a starting point. You can adjust any color below.</p>
        <div className="mt-3 grid gap-2">
          {themePresets.map((preset) => {
            const selected = theme.preset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                aria-pressed={selected}
                onClick={() => applyPreset(preset)}
                className={`flex items-center gap-3 rounded-md border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 ${selected ? "border-gray-950 bg-gray-50" : "border-gray-200 bg-white hover:border-gray-400"}`}
              >
                <span aria-hidden="true" className="flex flex-none -space-x-1">
                  {[preset.colors.background, preset.colors.cardBackground, preset.colors.accent].map((color, index) => <span key={`${color}-${index}`} className="size-7 rounded-full border border-black/10" style={{ backgroundColor: color }} />)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-gray-950">{preset.name}</span>
                  <span className="mt-0.5 block text-xs text-gray-500">{preset.description}</span>
                </span>
                {selected ? <CheckCircle2 aria-label="Selected" size={17} className="flex-none text-gray-950" /> : null}
              </button>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="custom-colors-title" className="border-t border-gray-200 pt-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 id="custom-colors-title" className="text-sm font-semibold text-gray-950">Custom colors</h3>
            <p className="mt-1 text-xs leading-5 text-gray-500">Changes update the portfolio preview immediately.</p>
          </div>
          {theme.preset === "custom" ? <span className="rounded-full bg-gray-100 px-2 py-1 text-[11px] font-medium text-gray-600">Custom</span> : null}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-4">
          {colorFields.map((field) => <ColorField key={field.key} label={field.label} value={colors[field.key]} onChange={(value) => updateColor(field.key, value)} />)}
        </div>
      </section>

      <section aria-labelledby="contrast-title" className="border-t border-gray-200 pt-5">
        <div className={`rounded-md border p-3 ${isSafe ? "border-green-200 bg-green-50" : "border-amber-200 bg-amber-50"}`}>
          <div className="flex items-start gap-2">
            {isSafe ? <CheckCircle2 size={17} className="mt-0.5 flex-none text-green-700" /> : <AlertTriangle size={17} className="mt-0.5 flex-none text-amber-700" />}
            <div>
              <h3 id="contrast-title" className={`text-sm font-semibold ${isSafe ? "text-green-900" : "text-amber-900"}`}>{isSafe ? "Contrast looks good" : "Contrast needs attention"}</h3>
              <p className={`mt-1 text-xs ${isSafe ? "text-green-800" : "text-amber-800"}`}>{passedChecks} of {checks.length} essential combinations meet WCAG AA guidance.</p>
            </div>
          </div>
        </div>
        <div className="mt-3 divide-y divide-gray-100 rounded-md border border-gray-200">
          {checks.map((check) => {
            const passes = check.ratio >= check.minimum;
            return (
              <div key={check.label} className="flex items-center justify-between gap-3 px-3 py-2.5 text-xs">
                <div><p className="font-medium text-gray-700">{check.label}</p><p className="mt-0.5 text-gray-500">{check.standard} · minimum {check.minimum}:1</p></div>
                <span className={`flex-none rounded-full px-2 py-1 font-semibold ${passes ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{check.ratio.toFixed(1)}:1 {passes ? "Pass" : "Fail"}</span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
