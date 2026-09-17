import { Plus, Trash2 } from "lucide-react";
import type { LinkItem } from "../../content/content.types";
import { newId } from "../../content/content.utils";
import { Button, Input } from "./FormControls";

export function LinkListEditor({ label, value, onChange }: { label: string; value: LinkItem[]; onChange: (value: LinkItem[]) => void }) {
  return (
    <fieldset className="space-y-3 rounded-md border border-gray-200 p-3">
      <legend className="px-1 text-sm font-semibold text-gray-800">{label}</legend>
      {value.map((link) => (
        <div key={link.id} className="space-y-2 border-b border-gray-100 pb-3 last:border-0">
          <Input label="Label" value={link.label} onChange={(event) => onChange(value.map((item) => item.id === link.id ? { ...item, label: event.target.value } : item))} />
          <Input label="URL or anchor" value={link.href} onChange={(event) => onChange(value.map((item) => item.id === link.id ? { ...item, href: event.target.value } : item))} />
          <Button type="button" variant="danger" size="compact" onClick={() => onChange(value.filter((item) => item.id !== link.id))}><Trash2 size={13} />Remove link</Button>
        </div>
      ))}
      <Button type="button" onClick={() => onChange([...value, { id: newId("link"), label: "New link", href: "#" }])}><Plus size={15} />Add link</Button>
    </fieldset>
  );
}
