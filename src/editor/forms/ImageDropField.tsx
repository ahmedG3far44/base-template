import {
  ImagePlus,
  LoaderCircle,
  LockKeyhole,
  Plus,
  Square,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useId, useRef, useState, type DragEvent } from "react";
import { usePortfolioContent } from "../../hooks/usePortfolioContent";
import { acceptedImageTypesLabel, uploadPortfolioImage } from "../imageUpload";
import { Button, Input } from "./FormControls";

interface ImageDropFieldProps {
  label: string;
  value: string;
  fileNameBase: string;
  onChange: (path: string) => void;
  showPathInput?: boolean;
  defaultRadius?: number;
  showRadiusControl?: boolean;
}

function ImagePreview({
  src,
  label,
  radius,
  onRemove,
}: {
  src: string;
  label: string;
  radius: number;
  onRemove: () => void;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div
      className="relative overflow-hidden border border-gray-200 bg-gray-50"
      style={{ borderRadius: `${radius}px` }}
    >
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label.toLowerCase()}`}
        title="Remove image"
        className="absolute right-2 top-2 z-10 inline-flex size-7 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-700 shadow-sm backdrop-blur-sm transition-colors hover:border-gray-200 hover:bg-gray-50 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
      >
        <X size={14} />
      </button>
      {failed ? (
        <div className="flex aspect-video items-center justify-center px-4 text-center text-xs text-gray-500">
          Image not found. Drop a replacement below.
        </div>
      ) : (
        <img
          src={src}
          alt={`${label} preview`}
          className="aspect-video w-full object-contain"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

function clampRadius(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(200, Math.max(0, Math.round(value)));
}

function ImageRadiusControl({
  value,
  onChange,
}: {
  value: number;
  onChange: (radius: number) => void;
}) {
  const radiusId = useId();
  return (
    <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
      <div className="flex items-center justify-between gap-3">
        <label
          htmlFor={`${radiusId}-range`}
          className="text-xs font-medium text-gray-700"
        >
          Corner radius
        </label>
        <span className="rounded bg-white px-1.5 py-0.5 font-mono text-[11px] text-gray-600 shadow-sm ring-1 ring-gray-200">
          {value}px
        </span>
      </div>
      <input
        id={`${radiusId}-range`}
        type="range"
        min="0"
        max="200"
        step="1"
        value={value}
        onChange={(event) => onChange(clampRadius(event.target.valueAsNumber))}
        className="mt-3 h-1.5 w-full cursor-pointer accent-gray-950"
      />
      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          aria-pressed={value === 0}
          onClick={() => onChange(0)}
          className={`inline-flex min-h-8 items-center gap-1.5 rounded-md border px-2.5 text-xs font-medium transition-colors ${value === 0 ? "border-gray-950 bg-gray-950 text-white" : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"}`}
        >
          <Square size={13} />
          Square
        </button>
        <label
          htmlFor={`${radiusId}-number`}
          className="ms-auto text-xs text-gray-500"
        >
          Pixels
        </label>
        <input
          id={`${radiusId}-number`}
          type="number"
          min="0"
          max="200"
          step="1"
          value={value}
          onChange={(event) =>
            onChange(clampRadius(event.target.valueAsNumber))
          }
          className="w-20 rounded-md border border-gray-300 bg-white px-2 py-1.5 text-right text-xs text-gray-950 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
        />
      </div>
    </div>
  );
}

export function ImageDropField({
  label,
  value,
  fileNameBase,
  onChange,
  showPathInput = true,
  defaultRadius = 0,
  showRadiusControl = true,
}: ImageDropFieldProps) {
  const { content, updateContent } = usePortfolioContent();
  const inputId = useId();
  const fileInput = useRef<HTMLInputElement>(null);
  const uploadedPath = useRef<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isEditingPath, setIsEditingPath] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (uploadedPath.current && uploadedPath.current !== value) {
      setPreviewUrl((current) => {
        if (current) URL.revokeObjectURL(current);
        return null;
      });
      uploadedPath.current = null;
    }
  }, [value]);

  useEffect(
    () => () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl],
  );

  async function upload(file: File) {
    const previousPath = value;
    const previousRadius = previousPath
      ? (content.media.imageRadii[previousPath] ?? defaultRadius)
      : defaultRadius;
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return objectUrl;
    });
    setIsUploading(true);
    setError(null);
    try {
      const path = await uploadPortfolioImage(file, fileNameBase);
      uploadedPath.current = path;
      setIsEditingPath(false);
      if (showRadiusControl) {
        updateContent((draft) => {
          if (previousPath && previousPath !== path)
            delete draft.media.imageRadii[previousPath];
          draft.media.imageRadii[path] = previousRadius;
        });
      }
      onChange(path);
    } catch (reason) {
      setPreviewUrl((current) => {
        if (current) URL.revokeObjectURL(current);
        return null;
      });
      setError(
        reason instanceof Error ? reason.message : "Could not upload image",
      );
    } finally {
      setIsUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  function handleDrop(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) void upload(file);
  }

  function removeImage() {
    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return null;
    });
    uploadedPath.current = null;
    setIsEditingPath(false);
    setError(null);
    if (value)
      updateContent((draft) => {
        delete draft.media.imageRadii[value];
      });
    onChange("");
  }

  const preview = previewUrl ?? value;
  const isPathReadOnly = Boolean(value) && !isEditingPath;
  const radius = value
    ? (content.media.imageRadii[value] ?? defaultRadius)
    : defaultRadius;
  const updateRadius = (nextRadius: number) => {
    if (!value) return;
    updateContent((draft) => {
      draft.media.imageRadii[value] = clampRadius(nextRadius);
    });
  };
  return (
    <fieldset className="space-y-3 rounded-md border border-gray-200 p-3">
      <legend className="px-1 text-sm font-semibold text-gray-800">
        {label}
      </legend>
      {preview ? (
        <ImagePreview
          key={preview}
          src={preview}
          label={label}
          radius={radius}
          onRemove={removeImage}
        />
      ) : null}
      {showRadiusControl && value && isPathReadOnly ? (
        <ImageRadiusControl value={radius} onChange={updateRadius} />
      ) : null}
      {showPathInput ? (
        <div>
          {isPathReadOnly ? (
            <p
              id={`${inputId}-path-lock`}
              className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-500"
            >
              <LockKeyhole size={12} aria-hidden="true" />
              Remove the current image to edit its path.
            </p>
          ) : null}
        </div>
      ) : null}
      {/* <div className="text-red-600 font-black">{preview}</div> */}

      <>
        <input
          ref={fileInput}
          id={inputId}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/avif,image/x-icon,image/vnd.microsoft.icon,.ico"
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void upload(file);
          }}
        />

        {!preview && (
          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInput.current?.click()}
            onDragEnter={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`flex min-h-28 w-full flex-col items-center justify-center rounded-md border-2 border-dashed px-4 py-5 text-center transition-colors disabled:opacity-60 ${isDragging ? "border-gray-900 bg-gray-100" : "border-gray-300 bg-gray-50 hover:border-gray-500 hover:bg-gray-100"}`}
            aria-describedby={`${inputId}-hint`}
          >
            {isUploading ? (
              <LoaderCircle size={22} className="animate-spin text-gray-500" />
            ) : preview ? (
              <Upload size={22} className="text-gray-500" />
            ) : (
              <ImagePlus size={22} className="text-gray-500" />
            )}
            <span className="mt-2 text-sm font-medium text-gray-800">
              {isUploading
                ? "Saving image…"
                : preview
                  ? "Drop or choose a replacement"
                  : "Drop an image or choose a file"}
            </span>
            <span id={`${inputId}-hint`} className="mt-1 text-xs text-gray-500">
              Saved as {fileNameBase}.ext · {acceptedImageTypesLabel}
            </span>
          </button>
        )}
      </>

      {error ? (
        <p role="alert" className="text-xs text-red-700">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

export function ImageGalleryEditor({
  value,
  fileNameBase,
  onChange,
}: {
  value: string[];
  fileNameBase: string;
  onChange: (paths: string[]) => void;
}) {
  const [newPath, setNewPath] = useState("");
  return (
    <fieldset className="space-y-3 rounded-md border border-gray-200 p-3">
      <legend className="px-1 text-sm font-semibold text-gray-800">
        Gallery images
      </legend>
      {value.map((path, index) => (
        <ImageDropField
          key={`${path}-${index}`}
          label={`Gallery image ${index + 1}`}
          value={path}
          fileNameBase={`${fileNameBase}-gallery-${index + 1}`}
          defaultRadius={12}
          onChange={(nextPath) =>
            onChange(
              nextPath
                ? value.map((item, itemIndex) =>
                    itemIndex === index ? nextPath : item,
                  )
                : value.filter((_, itemIndex) => itemIndex !== index),
            )
          }
        />
      ))}
      <ImageDropField
        key={`gallery-add-${value.length}`}
        label="Add gallery image"
        value=""
        fileNameBase={`${fileNameBase}-gallery-${value.length + 1}`}
        defaultRadius={12}
        showPathInput={false}
        onChange={(path) => {
          if (path) onChange([...value, path]);
        }}
      />

      <div className="space-y-2 border-t border-gray-100 pt-3">
        <Input
          label="Or add an image path or URL"
          value={newPath}
          onChange={(event) => setNewPath(event.target.value)}
          placeholder="/images/project-detail.png"
        />

        <Button
          type="button"
          disabled={!newPath.trim()}
          onClick={() => {
            onChange([...value, newPath.trim()]);
            setNewPath("");
          }}
        >
          <Plus size={15} />
          Add URL
        </Button>
      </div>
    </fieldset>
  );
}
