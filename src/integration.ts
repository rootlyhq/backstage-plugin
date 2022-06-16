import { Entity } from '@backstage/catalog-model';

export const ROOTLY_ANNOTATION = 'rootly.com/component-selector';
export const ROOTLY_TEAM_ANNOTATION = 'rootly.com/team';

export const isRootlyAvailable = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[ROOTLY_ANNOTATION]);
