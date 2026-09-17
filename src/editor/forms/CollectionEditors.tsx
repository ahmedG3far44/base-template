import type { ReactNode } from "react";
import { Plus, Trash2 } from "lucide-react";
import type {
  Experience,
  ExperienceTranslation,
  Project,
  ProjectTranslation,
  Service,
  ServiceTranslation,
  Skill,
  SkillTranslation,
  Testimonial,
  TestimonialTranslation,
} from "../../content/content.types";
import {
  joinList,
  localizedItem,
  newId,
  splitList,
} from "../../content/content.utils";
import { usePortfolioContent } from "../../hooks/usePortfolioContent";
import { SortableList } from "../SortableList";
import {
  Button,
  Checkbox,
  EditorSection,
  Input,
  Textarea,
  Toggle,
} from "./FormControls";
import { ImageDropField, ImageGalleryEditor } from "./ImageDropField";

function CollectionShell({
  title,
  controls,
  items,
  onAdd,
  onDelete,
  onReorder,
}: {
  title: string;
  controls?: ReactNode;
  items: Array<{ id: string; label: string; fields: ReactNode }>;
  onAdd: () => void;
  onDelete: (id: string) => void;
  onReorder: (ids: string[]) => void;
}) {
  return (
    <EditorSection title={title}>
      {controls ? (
        <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
          {controls}
        </div>
      ) : null}
      {items.length ? (
        <SortableList
          entries={items.map((item) => ({
            id: item.id,
            content: (
              <details>
                <summary className="cursor-pointer py-1 text-sm font-medium text-gray-900">
                  {item.label}
                </summary>
                <div className="mt-3 space-y-3 border-t border-gray-100 pt-3">
                  {item.fields}
                  <Button
                    type="button"
                    variant="danger"
                    size="compact"
                    onClick={() => onDelete(item.id)}
                  >
                    <Trash2 size={12} />
                    Remove {title.replace(/s$/, "")}
                  </Button>
                </div>
              </details>
            ),
          }))}
          onReorder={onReorder}
        />
      ) : (
        <p className="rounded-md bg-gray-50 p-3 text-sm text-gray-500">
          No items yet.
        </p>
      )}
      <Button type="button" onClick={onAdd}>
        <Plus size={15} />
        Add {title.replace(/s$/, "")}
      </Button>
    </EditorSection>
  );
}

function confirmRemove(label: string) {
  return window.confirm(
    `Remove ${label}? This removes it from every language.`,
  );
}

export function ExperiencesEditor() {
  const { content, activeLocale, updateContent } = usePortfolioContent();
  const fallback = content.settings.defaultLocale;
  const patchEntity = (
    id: string,
    mutator: (entity: Experience, translation: ExperienceTranslation) => void,
  ) =>
    updateContent((draft) => {
      const entity = draft.collections.experiences.find(
        (item) => item.id === id,
      )!;
      entity.translations[activeLocale] ??= structuredClone(
        localizedItem(entity.translations, activeLocale, fallback),
      );
      mutator(entity, entity.translations[activeLocale]!);
    });
  return (
    <CollectionShell
      title="Experiences"
      items={content.collections.experiences.map((entity) => {
        const value = localizedItem(
          entity.translations,
          activeLocale,
          fallback,
        );
        return {
          id: entity.id,
          label: `${value.role} · ${value.company}`,
          fields: (
            <>
              <Input
                label="Company"
                value={value.company}
                onChange={(event) =>
                  patchEntity(entity.id, (_, item) => {
                    item.company = event.target.value;
                  })
                }
              />
              <Input
                label="Role"
                value={value.role}
                onChange={(event) =>
                  patchEntity(entity.id, (_, item) => {
                    item.role = event.target.value;
                  })
                }
              />
              <Input
                label="Employment type"
                value={value.employmentType ?? ""}
                onChange={(event) =>
                  patchEntity(entity.id, (_, item) => {
                    item.employmentType = event.target.value;
                  })
                }
              />
              <Input
                label="Location"
                value={value.location ?? ""}
                onChange={(event) =>
                  patchEntity(entity.id, (_, item) => {
                    item.location = event.target.value;
                  })
                }
              />
              <Input
                label="Start date"
                value={entity.startDate ?? ""}
                onChange={(event) =>
                  patchEntity(entity.id, (item) => {
                    item.startDate = event.target.value;
                  })
                }
              />
              <Input
                label="End date"
                value={entity.endDate ?? ""}
                disabled={entity.current}
                onChange={(event) =>
                  patchEntity(entity.id, (item) => {
                    item.endDate = event.target.value;
                  })
                }
              />
              <Checkbox
                label="Current role"
                checked={entity.current}
                onChange={(checked) =>
                  patchEntity(entity.id, (item) => {
                    item.current = checked;
                  })
                }
              />
              <Textarea
                label="Description"
                value={value.description ?? ""}
                onChange={(event) =>
                  patchEntity(entity.id, (_, item) => {
                    item.description = event.target.value;
                  })
                }
              />
              <Textarea
                label="Achievements (one per line)"
                value={joinList(value.achievements)}
                onChange={(event) =>
                  patchEntity(entity.id, (_, item) => {
                    item.achievements = splitList(event.target.value);
                  })
                }
              />
              <Textarea
                label="Technologies (one per line or comma-separated)"
                value={joinList(value.technologies)}
                onChange={(event) =>
                  patchEntity(entity.id, (_, item) => {
                    item.technologies = splitList(event.target.value);
                  })
                }
              />
            </>
          ),
        };
      })}
      onAdd={() =>
        updateContent((draft) => {
          draft.collections.experiences.push({
            id: newId("experience"),
            startDate: "",
            endDate: "",
            current: false,
            translations: {
              [activeLocale]: {
                company: "New company",
                role: "New role",
                achievements: [],
                technologies: [],
              },
            },
          });
        })
      }
      onDelete={(id) => {
        if (confirmRemove("this experience"))
          updateContent((draft) => {
            draft.collections.experiences =
              draft.collections.experiences.filter((item) => item.id !== id);
          });
      }}
      onReorder={(ids) =>
        updateContent((draft) => {
          draft.collections.experiences = ids.map(
            (id) =>
              draft.collections.experiences.find((item) => item.id === id)!,
          );
        })
      }
    />
  );
}

export function SkillsEditor() {
  const { content, activeLocale, updateContent } = usePortfolioContent();
  const fallback = content.settings.defaultLocale;
  const patchEntity = (
    id: string,
    mutator: (entity: Skill, translation: SkillTranslation) => void,
  ) =>
    updateContent((draft) => {
      const entity = draft.collections.skills.find((item) => item.id === id)!;
      entity.translations[activeLocale] ??= structuredClone(
        localizedItem(entity.translations, activeLocale, fallback),
      );
      mutator(entity, entity.translations[activeLocale]!);
    });
  return (
    <CollectionShell
      title="Skills"
      controls={
        <Toggle
          label="Show categories on all skill cards"
          checked={content.layout.skills.showCategory}
          onChange={(checked) =>
            updateContent((draft) => {
              draft.layout.skills.showCategory = checked;
            })
          }
        />
      }
      items={content.collections.skills.map((entity) => {
        const value = localizedItem(
          entity.translations,
          activeLocale,
          fallback,
        );
        return {
          id: entity.id,
          label: value.name,
          fields: (
            <>
              <Input
                label="Name"
                value={value.name}
                onChange={(event) =>
                  patchEntity(entity.id, (_, item) => {
                    item.name = event.target.value;
                  })
                }
              />
              <Input
                label="Category"
                value={value.category ?? ""}
                onChange={(event) =>
                  patchEntity(entity.id, (_, item) => {
                    item.category = event.target.value;
                  })
                }
              />
              <ImageDropField
                label="Skill image or icon"
                value={entity.icon ?? ""}
                fileNameBase={entity.id}
                defaultRadius={8}
                onChange={(icon) =>
                  patchEntity(entity.id, (item) => {
                    item.icon = icon;
                  })
                }
              />
            </>
          ),
        };
      })}
      onAdd={() =>
        updateContent((draft) => {
          draft.collections.skills.push({
            id: newId("skill"),
            icon: "",
            translations: {
              [activeLocale]: { name: "New skill", category: "" },
            },
          });
        })
      }
      onDelete={(id) => {
        if (confirmRemove("this skill"))
          updateContent((draft) => {
            draft.collections.skills = draft.collections.skills.filter(
              (item) => item.id !== id,
            );
          });
      }}
      onReorder={(ids) =>
        updateContent((draft) => {
          draft.collections.skills = ids.map(
            (id) => draft.collections.skills.find((item) => item.id === id)!,
          );
        })
      }
    />
  );
}

export function ProjectsEditor() {
  const { content, activeLocale, updateContent } = usePortfolioContent();
  const fallback = content.settings.defaultLocale;
  const patchEntity = (
    id: string,
    mutator: (entity: Project, translation: ProjectTranslation) => void,
  ) =>
    updateContent((draft) => {
      const entity = draft.collections.projects.find((item) => item.id === id)!;
      entity.translations[activeLocale] ??= structuredClone(
        localizedItem(entity.translations, activeLocale, fallback),
      );
      mutator(entity, entity.translations[activeLocale]!);
    });
  return (
    <CollectionShell
      title="Projects"
      items={content.collections.projects.map((entity) => {
        const value = localizedItem(
          entity.translations,
          activeLocale,
          fallback,
        );
        const defaultValue = localizedItem(
          entity.translations,
          fallback,
          fallback,
        );
        const imageFileName = defaultValue.slug || entity.id;
        return {
          id: entity.id,
          label: value.title,
          fields: (
            <>
              <Input
                label="Title"
                value={value.title}
                onChange={(event) =>
                  patchEntity(entity.id, (_, item) => {
                    item.title = event.target.value;
                  })
                }
              />
              <Input
                label="Slug"
                value={value.slug ?? ""}
                onChange={(event) =>
                  patchEntity(entity.id, (_, item) => {
                    item.slug = event.target.value;
                  })
                }
              />
              <Textarea
                label="Short description"
                value={value.shortDescription ?? ""}
                onChange={(event) =>
                  patchEntity(entity.id, (_, item) => {
                    item.shortDescription = event.target.value;
                  })
                }
              />
              <Textarea
                label="Full description"
                value={value.description ?? ""}
                onChange={(event) =>
                  patchEntity(entity.id, (_, item) => {
                    item.description = event.target.value;
                  })
                }
              />
              <Input
                label="Category"
                value={value.category ?? ""}
                onChange={(event) =>
                  patchEntity(entity.id, (_, item) => {
                    item.category = event.target.value;
                  })
                }
              />
              <Input
                label="Role"
                value={value.role ?? ""}
                onChange={(event) =>
                  patchEntity(entity.id, (_, item) => {
                    item.role = event.target.value;
                  })
                }
              />
              <Input
                label="Year"
                value={value.year ?? ""}
                onChange={(event) =>
                  patchEntity(entity.id, (_, item) => {
                    item.year = event.target.value;
                  })
                }
              />
              <Textarea
                label="Technologies"
                value={joinList(value.technologies)}
                onChange={(event) =>
                  patchEntity(entity.id, (_, item) => {
                    item.technologies = splitList(event.target.value);
                  })
                }
              />
              <ImageDropField
                label="Project cover image"
                value={entity.image ?? ""}
                fileNameBase={imageFileName}
                defaultRadius={12}
                onChange={(image) =>
                  patchEntity(entity.id, (item) => {
                    item.image = image;
                  })
                }
              />
              <ImageGalleryEditor
                value={entity.gallery}
                fileNameBase={imageFileName}
                onChange={(gallery) =>
                  patchEntity(entity.id, (item) => {
                    item.gallery = gallery;
                  })
                }
              />
              <Input
                label="Live URL"
                value={entity.liveUrl ?? ""}
                onChange={(event) =>
                  patchEntity(entity.id, (item) => {
                    item.liveUrl = event.target.value;
                  })
                }
              />
              <Input
                label="Repository URL"
                value={entity.repositoryUrl ?? ""}
                onChange={(event) =>
                  patchEntity(entity.id, (item) => {
                    item.repositoryUrl = event.target.value;
                  })
                }
              />
              <Input
                label="Case study URL"
                value={entity.caseStudyUrl ?? ""}
                onChange={(event) =>
                  patchEntity(entity.id, (item) => {
                    item.caseStudyUrl = event.target.value;
                  })
                }
              />
              <Checkbox
                label="Featured project"
                checked={entity.featured}
                onChange={(checked) =>
                  patchEntity(entity.id, (item) => {
                    item.featured = checked;
                  })
                }
              />
            </>
          ),
        };
      })}
      onAdd={() =>
        updateContent((draft) => {
          draft.collections.projects.push({
            id: newId("project"),
            image: "",
            gallery: [],
            liveUrl: "",
            repositoryUrl: "",
            caseStudyUrl: "",
            featured: false,
            translations: {
              [activeLocale]: { title: "New project", technologies: [] },
            },
          });
        })
      }
      onDelete={(id) => {
        if (confirmRemove("this project"))
          updateContent((draft) => {
            draft.collections.projects = draft.collections.projects.filter(
              (item) => item.id !== id,
            );
          });
      }}
      onReorder={(ids) =>
        updateContent((draft) => {
          draft.collections.projects = ids.map(
            (id) => draft.collections.projects.find((item) => item.id === id)!,
          );
        })
      }
    />
  );
}

export function ServicesEditor() {
  const { content, activeLocale, updateContent } = usePortfolioContent();
  const fallback = content.settings.defaultLocale;
  const patchEntity = (
    id: string,
    mutator: (entity: Service, translation: ServiceTranslation) => void,
  ) =>
    updateContent((draft) => {
      const entity = draft.collections.services.find((item) => item.id === id)!;
      entity.translations[activeLocale] ??= structuredClone(
        localizedItem(entity.translations, activeLocale, fallback),
      );
      mutator(entity, entity.translations[activeLocale]!);
    });
  return (
    <CollectionShell
      title="Services"
      items={content.collections.services.map((entity) => {
        const value = localizedItem(
          entity.translations,
          activeLocale,
          fallback,
        );
        return {
          id: entity.id,
          label: value.title,
          fields: (
            <>
              <Input
                label="Title"
                value={value.title}
                onChange={(event) =>
                  patchEntity(entity.id, (_, item) => {
                    item.title = event.target.value;
                  })
                }
              />
              <Textarea
                label="Description"
                value={value.description ?? ""}
                onChange={(event) =>
                  patchEntity(entity.id, (_, item) => {
                    item.description = event.target.value;
                  })
                }
              />
              <Textarea
                label="Features"
                value={joinList(value.features)}
                onChange={(event) =>
                  patchEntity(entity.id, (_, item) => {
                    item.features = splitList(event.target.value);
                  })
                }
              />
              <Checkbox
                label="Show CTA"
                checked={Boolean(value.cta)}
                onChange={(checked) =>
                  patchEntity(entity.id, (_, item) => {
                    item.cta = checked
                      ? { label: "Discuss a project", href: "#contact" }
                      : undefined;
                  })
                }
              />
              {value.cta ? (
                <>
                  <Input
                    label="CTA label"
                    value={value.cta.label}
                    onChange={(event) =>
                      patchEntity(entity.id, (_, item) => {
                        item.cta = { ...item.cta!, label: event.target.value };
                      })
                    }
                  />
                  <Input
                    label="CTA URL"
                    value={value.cta.href}
                    onChange={(event) =>
                      patchEntity(entity.id, (_, item) => {
                        item.cta = { ...item.cta!, href: event.target.value };
                      })
                    }
                  />
                </>
              ) : null}
            </>
          ),
        };
      })}
      onAdd={() =>
        updateContent((draft) => {
          draft.collections.services.push({
            id: newId("service"),
            translations: {
              [activeLocale]: {
                title: "New service",
                description: "",
                features: [],
              },
            },
          });
        })
      }
      onDelete={(id) => {
        if (confirmRemove("this service"))
          updateContent((draft) => {
            draft.collections.services = draft.collections.services.filter(
              (item) => item.id !== id,
            );
          });
      }}
      onReorder={(ids) =>
        updateContent((draft) => {
          draft.collections.services = ids.map(
            (id) => draft.collections.services.find((item) => item.id === id)!,
          );
        })
      }
    />
  );
}

export function TestimonialsEditor() {
  const { content, activeLocale, updateContent } = usePortfolioContent();
  const fallback = content.settings.defaultLocale;
  const patchEntity = (
    id: string,
    mutator: (entity: Testimonial, translation: TestimonialTranslation) => void,
  ) =>
    updateContent((draft) => {
      const entity = draft.collections.testimonials.find(
        (item) => item.id === id,
      )!;
      entity.translations[activeLocale] ??= structuredClone(
        localizedItem(entity.translations, activeLocale, fallback),
      );
      mutator(entity, entity.translations[activeLocale]!);
    });
  return (
    <CollectionShell
      title="Testimonials"
      items={content.collections.testimonials.map((entity) => {
        const value = localizedItem(
          entity.translations,
          activeLocale,
          fallback,
        );
        return {
          id: entity.id,
          label: value.name,
          fields: (
            <>
              <Textarea
                label="Quote"
                value={value.quote}
                onChange={(event) =>
                  patchEntity(entity.id, (_, item) => {
                    item.quote = event.target.value;
                  })
                }
              />
              <Input
                label="Name"
                value={value.name}
                onChange={(event) =>
                  patchEntity(entity.id, (_, item) => {
                    item.name = event.target.value;
                  })
                }
              />
              <Input
                label="Role"
                value={value.role ?? ""}
                onChange={(event) =>
                  patchEntity(entity.id, (_, item) => {
                    item.role = event.target.value;
                  })
                }
              />
              <Input
                label="Company"
                value={value.company ?? ""}
                onChange={(event) =>
                  patchEntity(entity.id, (_, item) => {
                    item.company = event.target.value;
                  })
                }
              />
              <ImageDropField
                label="Testimonial avatar"
                value={entity.avatar ?? ""}
                fileNameBase={entity.id}
                defaultRadius={24}
                onChange={(avatar) =>
                  patchEntity(entity.id, (item) => {
                    item.avatar = avatar;
                  })
                }
              />
            </>
          ),
        };
      })}
      onAdd={() =>
        updateContent((draft) => {
          draft.collections.testimonials.push({
            id: newId("testimonial"),
            avatar: "",
            translations: {
              [activeLocale]: { quote: "New testimonial", name: "New person" },
            },
          });
        })
      }
      onDelete={(id) => {
        if (confirmRemove("this testimonial"))
          updateContent((draft) => {
            draft.collections.testimonials =
              draft.collections.testimonials.filter((item) => item.id !== id);
          });
      }}
      onReorder={(ids) =>
        updateContent((draft) => {
          draft.collections.testimonials = ids.map(
            (id) =>
              draft.collections.testimonials.find((item) => item.id === id)!,
          );
        })
      }
    />
  );
}

export function CollectionEditors() {
  return (
    <>
      <ExperiencesEditor />
      <SkillsEditor />
      <ProjectsEditor />
      <ServicesEditor />
      <TestimonialsEditor />
    </>
  );
}
