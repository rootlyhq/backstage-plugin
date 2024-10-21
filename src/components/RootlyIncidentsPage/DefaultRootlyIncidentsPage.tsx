import React from 'react';
import { RootlyServiceIncidentsPageLayout } from './RootlyServiceIncidentsPageLayout';
import { RootlyFunctionalityIncidentsPageLayout } from './RootlyFunctionalityIncidentsPageLayout';
import { RootlyTeamIncidentsPageLayout } from './RootlyTeamIncidentsPageLayout';

import { useEntity } from '@backstage/plugin-catalog-react';
import { ROOTLY_ANNOTATION_FUNCTIONALITY_ID, ROOTLY_ANNOTATION_FUNCTIONALITY_SLUG, ROOTLY_ANNOTATION_SERVICE_ID, ROOTLY_ANNOTATION_SERVICE_SLUG, ROOTLY_ANNOTATION_TEAM_ID, ROOTLY_ANNOTATION_TEAM_SLUG } from '@rootly/backstage-plugin-common';

export const DefaultRootlyIncidentsPage = ({ organizationId }: { organizationId?: string }) => {
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

    const resource = () => {
      if (service_id_annotation) {
        return <RootlyServiceIncidentsPageLayout organizationId={organizationId} />;
      } else if (functionality_id_annotation) {
        return  <RootlyFunctionalityIncidentsPageLayout organizationId={organizationId} />;
      } else if (team_id_annotation) {
        return  <RootlyTeamIncidentsPageLayout organizationId={organizationId} />;
      } 
      return <div>No Rootly annotations found</div>;
    };

    return <div>{resource()}</div>;
};
