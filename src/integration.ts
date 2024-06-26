import { Entity } from '@backstage/catalog-model';

export const ROOTLY_ANNOTATION_SERVICE_ID = 'rootly.com/service-id';
export const ROOTLY_ANNOTATION_SERVICE_SLUG = 'rootly.com/service-slug';
export const ROOTLY_ANNOTATION_SERVICE_AUTO_IMPORT = 'rootly.com/service-auto-import';
export const ROOTLY_ANNOTATION_FUNCTIONALITY_ID = 'rootly.com/functionality-id';
export const ROOTLY_ANNOTATION_FUNCTIONALITY_SLUG = 'rootly.com/functionality-slug';
export const ROOTLY_ANNOTATION_FUNCTIONALITY_AUTO_IMPORT = 'rootly.com/functionality-auto-import';
export const ROOTLY_ANNOTATION_TEAM_ID = 'rootly.com/team-id';
export const ROOTLY_ANNOTATION_TEAM_SLUG = 'rootly.com/team-slug';
export const ROOTLY_ANNOTATION_TEAM_AUTO_IMPORT = 'rootly.com/team-auto-import';

export const isRootlyAvailable = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[ROOTLY_ANNOTATION_SERVICE_ID]) && Boolean(entity.metadata.annotations?.[ROOTLY_ANNOTATION_SERVICE_ID]) ||
  Boolean(entity.metadata.annotations?.[ROOTLY_ANNOTATION_SERVICE_SLUG]) && Boolean(entity.metadata.annotations?.[ROOTLY_ANNOTATION_SERVICE_SLUG]) ||
  Boolean(entity.metadata.annotations?.[ROOTLY_ANNOTATION_FUNCTIONALITY_ID]) && Boolean(entity.metadata.annotations?.[ROOTLY_ANNOTATION_FUNCTIONALITY_ID]) ||
  Boolean(entity.metadata.annotations?.[ROOTLY_ANNOTATION_FUNCTIONALITY_SLUG]) && Boolean(entity.metadata.annotations?.[ROOTLY_ANNOTATION_FUNCTIONALITY_SLUG]) ||
  Boolean(entity.metadata.annotations?.[ROOTLY_ANNOTATION_TEAM_ID]) && Boolean(entity.metadata.annotations?.[ROOTLY_ANNOTATION_TEAM_ID]) ||
  Boolean(entity.metadata.annotations?.[ROOTLY_ANNOTATION_TEAM_SLUG]) && Boolean(entity.metadata.annotations?.[ROOTLY_ANNOTATION_TEAM_SLUG]);


export const autoImportService = (entity: Entity) =>
Boolean(entity.metadata.annotations?.[ROOTLY_ANNOTATION_SERVICE_AUTO_IMPORT]) && Boolean(entity.metadata.annotations?.[ROOTLY_ANNOTATION_SERVICE_AUTO_IMPORT]);

export const autoImportFunctionality = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[ROOTLY_ANNOTATION_FUNCTIONALITY_AUTO_IMPORT]) && Boolean(entity.metadata.annotations?.[ROOTLY_ANNOTATION_FUNCTIONALITY_AUTO_IMPORT]);

export const autoImportTeam = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[ROOTLY_ANNOTATION_TEAM_AUTO_IMPORT]) && Boolean(entity.metadata.annotations?.[ROOTLY_ANNOTATION_TEAM_AUTO_IMPORT]);
  