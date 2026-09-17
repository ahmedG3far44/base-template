import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import type { ReactNode } from "react";

export interface SortableEntry {
  id: string;
  content: ReactNode;
}

function SortableRow({ entry }: { entry: SortableEntry }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: entry.id });
  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} className={`flex items-start gap-2 rounded-md border border-gray-200 bg-white p-2 ${isDragging ? "z-10 shadow-lg" : ""}`}>
      <button type="button" className="mt-1 touch-none rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700" aria-label="Drag to reorder" {...attributes} {...listeners}><GripVertical size={17} /></button>
      <div className="min-w-0 flex-1">{entry.content}</div>
    </div>
  );
}

export function SortableList({ entries, onReorder }: { entries: SortableEntry[]; onReorder: (ids: string[]) => void }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event: DragEndEvent) {
    if (!event.over || event.active.id === event.over.id) return;
    const oldIndex = entries.findIndex((entry) => entry.id === event.active.id);
    const newIndex = entries.findIndex((entry) => entry.id === event.over!.id);
    onReorder(arrayMove(entries, oldIndex, newIndex).map((entry) => entry.id));
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={entries.map((entry) => entry.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">{entries.map((entry) => <SortableRow key={entry.id} entry={entry} />)}</div>
      </SortableContext>
    </DndContext>
  );
}
