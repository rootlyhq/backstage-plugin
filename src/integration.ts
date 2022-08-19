import { Entity } from '@backstage/catalog-model';

export const ROOTLY_ANNOTATION_APP_NAME = 'rootly.com/app-name';

export const isRootlyAvailable = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[ROOTLY_ANNOTATION_APP_NAME]);
