import { Entity } from '@backstage/catalog-model';


import {
  ROOTLY_ANNOTATION_SERVICE_ID,
  ROOTLY_ANNOTATION_SERVICE_SLUG,
  ROOTLY_ANNOTATION_FUNCTIONALITY_ID,
  ROOTLY_ANNOTATION_FUNCTIONALITY_SLUG,
  ROOTLY_ANNOTATION_TEAM_ID,
  ROOTLY_ANNOTATION_TEAM_SLUG,
  ROOTLY_ANNOTATION_SERVICE_AUTO_IMPORT,
  ROOTLY_ANNOTATION_FUNCTIONALITY_AUTO_IMPORT,
  ROOTLY_ANNOTATION_TEAM_AUTO_IMPORT,
} from '@rootly/backstage-plugin-common';

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
  