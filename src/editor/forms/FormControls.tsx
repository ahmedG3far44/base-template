import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

export const inputClass = "mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-950 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900";

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return <label className="block text-sm font-medium text-gray-700">{label}{children}{hint ? <span className="mt-1 block text-xs font-normal text-gray-500">{hint}</span> : null}</label>;
}

export function Input({ label, ...props }: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return <Field label={label}><input {...props} className={`${inputClass} ${props.className ?? ""}`} /></Field>;
}

export function Textarea({ label, ...props }: { label: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <Field label={label}><textarea {...props} className={`${inputClass} min-h-24 resize-y ${props.className ?? ""}`} /></Field>;
}

export function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return <label className="flex items-center gap-2 text-sm font-medium text-gray-700"><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="size-4 rounded border-gray-300" />{label}</label>;
}

export function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 flex-none items-center rounded-full border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 ${checked ? "border-gray-950 bg-gray-950" : "border-gray-300 bg-gray-200"}`}
      >
        <span aria-hidden="true" className={`size-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${checked ? "translate-x-5" : "translate-x-1"}`} />
      </button>
    </div>
  );
}

export function Button({ children, variant = "secondary", size = "default", ...props }: Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "size"> & { variant?: "primary" | "secondary" | "danger" | "ghost"; size?: "default" | "compact" }) {
  const styles = {
    primary: "border-gray-950 bg-gray-950 text-white hover:bg-gray-800",
    secondary: "border-gray-300 bg-white text-gray-800 hover:bg-gray-50",
    danger: "border-red-200 bg-white text-red-700 hover:bg-red-50",
    ghost: "border-transparent bg-transparent text-gray-600 hover:bg-gray-100",
  }[variant];
  const sizing = size === "compact" ? "min-h-7 gap-1.5 px-2 py-1 text-xs" : "min-h-9 gap-2 px-3 py-1.5 text-sm";
  return <button {...props} className={`inline-flex items-center justify-center rounded-md border font-medium disabled:cursor-not-allowed disabled:opacity-50 ${sizing} ${styles} ${props.className ?? ""}`}>{children}</button>;
}

export function EditorSection({ title, children, defaultOpen = false }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  return (
    <details open={defaultOpen} className="border-b border-gray-200 py-1">
      <summary className="cursor-pointer select-none py-4 text-sm font-semibold text-gray-950">{title}</summary>
      <div className="space-y-4 pb-5">{children}</div>
    </details>
  );
}
