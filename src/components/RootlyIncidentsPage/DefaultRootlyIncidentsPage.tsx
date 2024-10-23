import React, { useEffect, useState } from 'react';
import { RootlyServiceIncidentsPageLayout } from './RootlyServiceIncidentsPageLayout';
import { RootlyFunctionalityIncidentsPageLayout } from './RootlyFunctionalityIncidentsPageLayout';
import { RootlyTeamIncidentsPageLayout } from './RootlyTeamIncidentsPageLayout';

import { catalogApiRef, useEntity } from '@backstage/plugin-catalog-react';
import {
  ROOTLY_ANNOTATION_FUNCTIONALITY_ID,
  ROOTLY_ANNOTATION_FUNCTIONALITY_SLUG,
  ROOTLY_ANNOTATION_SERVICE_ID,
  ROOTLY_ANNOTATION_SERVICE_SLUG,
  ROOTLY_ANNOTATION_TEAM_ID,
  ROOTLY_ANNOTATION_TEAM_SLUG,
  RootlyEntity,
} from '@rootly/backstage-plugin-common';
import { useApi } from '@backstage/core-plugin-api';
import { RootlySystemIncidentsPageLayout } from './RootlySystemIncidentsPageLayout';

export const DefaultRootlyIncidentsPage = ({
  organizationId,
}: {
  organizationId?: string;
}) => {
  const [entities, setEntities] = useState<RootlyEntity[]>([]);
  const { entity } = useEntity();
  const rootlyEntity = entity as RootlyEntity;
  const catalogApi = useApi(catalogApiRef); // Use the catalog API

  useEffect(() => {
    const fetchEntities = async () => {
      let fetchedEntities: RootlyEntity[] = [];

      if (entity.kind === 'System') {
        const hasPartRelation = entity.relations?.filter(
          relation => relation.type === 'hasPart',
        );
        if (hasPartRelation) {
          for (const relation of hasPartRelation) {
            const _entity = (await catalogApi.getEntityByRef(
              relation.targetRef,
            )) as RootlyEntity;
            if (_entity) {
              _entity.rootlyKind = kindOf(_entity);
              fetchedEntities.push(_entity as RootlyEntity);
            }
          }
        }
      } else {
        rootlyEntity.rootlyKind = kindOf(rootlyEntity);
        fetchedEntities = [entity as RootlyEntity];
      }

      setEntities(fetchedEntities);
    };

    fetchEntities();
  }, [entity, rootlyEntity, catalogApi]);

  if (entities.length === 1) {
    return buildEntity(entities[0], organizationId)
  } else if (entities.length > 1) {
    return buildEntities(entities, organizationId);
  }
  return <div>No Rootly annotations found</div>;
};

function kindOf(entity: RootlyEntity): string | undefined {
  const service_id_annotation =
    entity.metadata.annotations?.[ROOTLY_ANNOTATION_SERVICE_ID] ||
    entity.metadata.annotations?.[ROOTLY_ANNOTATION_SERVICE_SLUG];

  const functionality_id_annotation =
    entity.metadata.annotations?.[ROOTLY_ANNOTATION_FUNCTIONALITY_ID] ||
    entity.metadata.annotations?.[ROOTLY_ANNOTATION_FUNCTIONALITY_SLUG];

  const team_id_annotation =
    entity.metadata.annotations?.[ROOTLY_ANNOTATION_TEAM_ID] ||
    entity.metadata.annotations?.[ROOTLY_ANNOTATION_TEAM_SLUG];

  if (service_id_annotation) {
    return 'Service';
  } else if (functionality_id_annotation) {
    return 'Functionality';
  } else if (team_id_annotation) {
    return 'Team';
  }
  return undefined;
}

function buildEntities(
  entities: RootlyEntity[],
  organizationId?: string,
) {
  return (
    <RootlySystemIncidentsPageLayout
      entities={entities}
      organizationId={organizationId}
    />
  );
}

function buildEntity(entity: RootlyEntity, organizationId?: string) {
  const resource = () => {
    if (entity.rootlyKind === 'Service') {
      return (
        <RootlyServiceIncidentsPageLayout
          entity={entity}
          organizationId={organizationId}
        />
      );
    } else if (entity.rootlyKind === 'Functionality') {
      return (
        <RootlyFunctionalityIncidentsPageLayout
          entity={entity}
          organizationId={organizationId}
        />
      );
    } else if (entity.rootlyKind === 'Team') {
      return (
        <RootlyTeamIncidentsPageLayout
          entity={entity}
          organizationId={organizationId}
        />
      );
    }
    return <div>No Rootly annotations found</div>;
  };

  return <div>{resource()}</div>;
}
