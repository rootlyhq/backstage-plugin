import { Entity } from '@backstage/catalog-model';
import { RootlyResourceType as Types } from './types';

export const ROOTLY_ANNOTATION_SERVICE_ID = 'rootly.com/service-id';
export const ROOTLY_ANNOTATION_SERVICE_SLUG = 'rootly.com/service-slug';
export const ROOTLY_ANNOTATION_SERVICE_AUTO_IMPORT = 'rootly.com/service-auto-import';
export const ROOTLY_ANNOTATION_FUNCTIONALITY_ID = 'rootly.com/functionality-id';
export const ROOTLY_ANNOTATION_FUNCTIONALITY_SLUG = 'rootly.com/functionality-slug';
export const ROOTLY_ANNOTATION_FUNCTIONALITY_AUTO_IMPORT = 'rootly.com/functionality-auto-import';

export const RootlyResourceType = Types;

export const isRootlyAvailable = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[ROOTLY_ANNOTATION_SERVICE_ID]) && Boolean(entity.metadata.annotations?.[ROOTLY_ANNOTATION_SERVICE_ID]) ||
  Boolean(entity.metadata.annotations?.[ROOTLY_ANNOTATION_SERVICE_SLUG]) && Boolean(entity.metadata.annotations?.[ROOTLY_ANNOTATION_SERVICE_SLUG]) ||
  Boolean(entity.metadata.annotations?.[ROOTLY_ANNOTATION_FUNCTIONALITY_ID]) && Boolean(entity.metadata.annotations?.[ROOTLY_ANNOTATION_FUNCTIONALITY_ID]) ||
  Boolean(entity.metadata.annotations?.[ROOTLY_ANNOTATION_FUNCTIONALITY_SLUG]) && Boolean(entity.metadata.annotations?.[ROOTLY_ANNOTATION_FUNCTIONALITY_SLUG]);

export const autoImportService = (entity: Entity) =>
Boolean(entity.metadata.annotations?.[ROOTLY_ANNOTATION_SERVICE_AUTO_IMPORT]) && Boolean(entity.metadata.annotations?.[ROOTLY_ANNOTATION_SERVICE_AUTO_IMPORT]);

export const autoImportFunctionality = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[ROOTLY_ANNOTATION_FUNCTIONALITY_AUTO_IMPORT]) && Boolean(entity.metadata.annotations?.[ROOTLY_ANNOTATION_FUNCTIONALITY_AUTO_IMPORT]);
  