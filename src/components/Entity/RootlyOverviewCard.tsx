import React from 'react';
import { RootlyOverviewServiceCard } from './RootlyOverviewServiceCard';
import { RootlyOverviewFunctionalityCard } from './RootlyOverviewFunctionalityCard';
import { RootlyOverviewTeamCard } from './RootlyOverviewTeamCard';
import { RootlyOverviewCatalogEntityCard } from './RootlyOverviewCatalogEntityCard';

import {
  ROOTLY_ANNOTATION_SERVICE_ID,
  ROOTLY_ANNOTATION_SERVICE_SLUG,
  ROOTLY_ANNOTATION_FUNCTIONALITY_ID,
  ROOTLY_ANNOTATION_FUNCTIONALITY_SLUG,
  ROOTLY_ANNOTATION_TEAM_ID,
  ROOTLY_ANNOTATION_TEAM_SLUG,
  ROOTLY_ANNOTATION_CATALOG_ENTITY_ID,
  ROOTLY_ANNOTATION_CATALOG_ENTITY_SLUG,
} from '@rootly/backstage-plugin-common';

import { useEntity } from '@backstage/plugin-catalog-react';

export const RootlyOverviewCard = () => {
  const { entity } = useEntity();

  const service_id_annotation =
    entity.metadata.annotations?.[ROOTLY_ANNOTATION_SERVICE_ID] ||
    entity.metadata.annotations?.[ROOTLY_ANNOTATION_SERVICE_SLUG];

  const functionality_id_annotation =
    entity.metadata.annotations?.[ROOTLY_ANNOTATION_FUNCTIONALITY_ID] ||
    entity.metadata.annotations?.[ROOTLY_ANNOTATION_FUNCTIONALITY_SLUG];

  const team_id_annotation =
    entity.metadata.annotations?.[ROOTLY_ANNOTATION_TEAM_ID] ||
    entity.metadata.annotations?.[ROOTLY_ANNOTATION_TEAM_SLUG];

  const catalog_entity_id_annotation =
    entity.metadata.annotations?.[ROOTLY_ANNOTATION_CATALOG_ENTITY_ID] ||
    entity.metadata.annotations?.[ROOTLY_ANNOTATION_CATALOG_ENTITY_SLUG];

  const resource = () => {
    if (service_id_annotation) {
      return <RootlyOverviewServiceCard />;
    } else if (functionality_id_annotation) {
      return <RootlyOverviewFunctionalityCard />;
    } else if (team_id_annotation) {
      return <RootlyOverviewTeamCard />;
    } else if (catalog_entity_id_annotation) {
      return <RootlyOverviewCatalogEntityCard />;
    }
    return <div>No Rootly annotations found</div>;
  };

  return <div>{resource()}</div>;
};
