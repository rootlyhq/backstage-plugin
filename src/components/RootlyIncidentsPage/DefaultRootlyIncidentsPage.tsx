import React, { useEffect, useState } from 'react';
import { RootlyServiceIncidentsPageLayout } from './RootlyServiceIncidentsPageLayout';
import { RootlyFunctionalityIncidentsPageLayout } from './RootlyFunctionalityIncidentsPageLayout';
import { RootlyTeamIncidentsPageLayout } from './RootlyTeamIncidentsPageLayout';

import { catalogApiRef, useEntity } from '@backstage/plugin-catalog-react';
import { ROOTLY_ANNOTATION_FUNCTIONALITY_ID, ROOTLY_ANNOTATION_FUNCTIONALITY_SLUG, ROOTLY_ANNOTATION_SERVICE_ID, ROOTLY_ANNOTATION_SERVICE_SLUG, ROOTLY_ANNOTATION_TEAM_ID, ROOTLY_ANNOTATION_TEAM_SLUG } from '@rootly/backstage-plugin-common';
import { Entity } from '@backstage/catalog-model';
import { useApi } from '@backstage/core-plugin-api';

export const DefaultRootlyIncidentsPage = ({ organizationId }: { organizationId?: string }) => {
  const [entities, setEntities] = useState<Entity[]>([]);
  const { entity } = useEntity();
  const catalogApi = useApi(catalogApiRef); // Use the catalog API

  useEffect(() => {
    const fetchEntities = async () => {
      let fetchedEntities: Entity[] = [];

      if (entity.kind === 'System') {
        const hasPartRelation = entity.relations?.filter(relation => relation.type === "hasPart");
        if (hasPartRelation) {
          for (const relation of hasPartRelation) {
            const _entity = await catalogApi.getEntityByRef(relation.targetRef);
            if (_entity) {
              fetchedEntities.push(_entity);
            }
          }
        }
      } else {
        fetchedEntities = [entity];
      }

      setEntities(fetchedEntities);
    };

    fetchEntities();
  }, [entity, catalogApi]);

  return (
    <>
      {entities.map((_entity) => {
        return buildEntity(_entity, organizationId);
      })}
    </>
  );
};

function buildEntity(entity: Entity, organizationId?: string) {
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
      return <RootlyServiceIncidentsPageLayout entity={entity} organizationId={organizationId} />;
    } else if (functionality_id_annotation) {
      return <RootlyFunctionalityIncidentsPageLayout entity={entity} organizationId={organizationId} />;
    } else if (team_id_annotation) {
      return <RootlyTeamIncidentsPageLayout entity={entity} organizationId={organizationId} />;
    }
    return <div>No Rootly annotations found</div>;
  };

  return <div>{resource()}</div>;
}
