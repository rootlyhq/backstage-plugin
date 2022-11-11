import { Entity } from '@backstage/catalog-model';

export const ROOTLY_ANNOTATION_SERVICE_ID = 'rootly.com/service-id';
export const ROOTLY_ANNOTATION_SERVICE_SLUG = 'rootly.com/service-slug';
export const ROOTLY_ANNOTATION_SERVICE_AUTO_IMPORT = 'rootly.com/service-auto-import';

export const isRootlyAvailable = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[ROOTLY_ANNOTATION_SERVICE_ID]) && Boolean(entity.metadata.annotations?.[ROOTLY_ANNOTATION_SERVICE_ID]) ||
  Boolean(entity.metadata.annotations?.[ROOTLY_ANNOTATION_SERVICE_SLUG]) && Boolean(entity.metadata.annotations?.[ROOTLY_ANNOTATION_SERVICE_SLUG]);

export const autoImportService = (entity: Entity) =>
Boolean(entity.metadata.annotations?.[ROOTLY_ANNOTATION_SERVICE_AUTO_IMPORT]) && Boolean(entity.metadata.annotations?.[ROOTLY_ANNOTATION_SERVICE_AUTO_IMPORT]);
