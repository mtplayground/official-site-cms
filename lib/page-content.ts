export const PAGE_SLUGS = {
  ABOUT: "about",
  LANDING: "landing",
} as const;

export type EditablePageSlug = (typeof PAGE_SLUGS)[keyof typeof PAGE_SLUGS];

export function isEditablePageSlug(value: string): value is EditablePageSlug {
  return value === PAGE_SLUGS.ABOUT || value === PAGE_SLUGS.LANDING;
}
