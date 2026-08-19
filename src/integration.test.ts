import type { Entity } from "@backstage/catalog-model";
import {
  ROOTLY_ANNOTATION_CATALOG_ENTITY_ID,
  ROOTLY_ANNOTATION_CATALOG_ENTITY_SLUG,
  ROOTLY_ANNOTATION_FUNCTIONALITY_ID,
  ROOTLY_ANNOTATION_FUNCTIONALITY_SLUG,
  ROOTLY_ANNOTATION_SERVICE_ID,
  ROOTLY_ANNOTATION_SERVICE_SLUG,
  ROOTLY_ANNOTATION_TEAM_ID,
  ROOTLY_ANNOTATION_TEAM_SLUG,
} from "@rootly/backstage-plugin-common";

import { isRootlyAvailable } from "./integration";

const rootlyAnnotations = [
  ROOTLY_ANNOTATION_SERVICE_ID,
  ROOTLY_ANNOTATION_SERVICE_SLUG,
  ROOTLY_ANNOTATION_FUNCTIONALITY_ID,
  ROOTLY_ANNOTATION_FUNCTIONALITY_SLUG,
  ROOTLY_ANNOTATION_TEAM_ID,
  ROOTLY_ANNOTATION_TEAM_SLUG,
  ROOTLY_ANNOTATION_CATALOG_ENTITY_ID,
  ROOTLY_ANNOTATION_CATALOG_ENTITY_SLUG,
];

const entityWithAnnotations = (
  annotations?: Record<string, string>,
): Entity => ({
  apiVersion: "backstage.io/v1alpha1",
  kind: "Component",
  metadata: {
    name: "example",
    annotations,
  },
});

describe("isRootlyAvailable", () => {
  it.each(rootlyAnnotations)(
    "is available for the %s annotation",
    (annotation) => {
      expect(
        isRootlyAvailable(entityWithAnnotations({ [annotation]: "rootly-id" })),
      ).toBe(true);
    },
  );

  it("is unavailable when annotations are missing", () => {
    expect(isRootlyAvailable(entityWithAnnotations())).toBe(false);
  });

  it.each(rootlyAnnotations)(
    "is unavailable when the %s annotation is empty",
    (annotation) => {
      expect(
        isRootlyAvailable(entityWithAnnotations({ [annotation]: "" })),
      ).toBe(false);
    },
  );

  it("ignores unrelated annotations", () => {
    expect(
      isRootlyAvailable(
        entityWithAnnotations({ "example.com/unrelated": "value" }),
      ),
    ).toBe(false);
  });
});
