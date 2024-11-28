import React, { useEffect, useState } from 'react';
import { RootlyServiceIncidentsPageLayout } from './RootlyServiceIncidentsPageLayout';
import { RootlyFunctionalityIncidentsPageLayout } from './RootlyFunctionalityIncidentsPageLayout';
import { RootlyTeamIncidentsPageLayout } from './RootlyTeamIncidentsPageLayout';

import { catalogApiRef, useEntity } from '@backstage/plugin-catalog-react';
import {
  ROOTLY_ANNOTATION_FUNCTIONALITY_ID,
  ROOTLY_ANNOTATION_FUNCTIONALITY_SLUG,
  ROOTLY_ANNOTATION_ORG_ID,
  ROOTLY_ANNOTATION_SERVICE_ID,
  ROOTLY_ANNOTATION_SERVICE_SLUG,
  ROOTLY_ANNOTATION_TEAM_ID,
  ROOTLY_ANNOTATION_TEAM_SLUG,
  RootlyEntity,
} from '@rootly/backstage-plugin-common';
import { Progress } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { RootlySystemIncidentsPageLayout } from './RootlySystemIncidentsPageLayout';

export const DefaultRootlyIncidentsPage = ({
  organizationId,
}: {
  organizationId?: string;
}) => {
  const [entities, setEntities] = useState<RootlyEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const { entity } = useEntity();
  const rootlyEntity = entity as RootlyEntity;
  const catalogApi = useApi(catalogApiRef); // Use the catalog API

  useEffect(() => {
    const fetchEntities = async () => {
      if (entity.kind === 'System') {
        const hasPartRelations = entity.relations?.filter(
          relation => relation.type === 'hasPart',
        );

        if (hasPartRelations && hasPartRelations.length > 0) {
          const entityPromises = hasPartRelations.map(async relation => {
            const _entity = (await catalogApi.getEntityByRef(
              relation.targetRef,
            )) as RootlyEntity;
            if (_entity && _entity.metadata.annotations?.[ROOTLY_ANNOTATION_ORG_ID]) {
              _entity.rootlyKind = kindOf(_entity);
              return _entity;
            }
            return null;
          });

          const fetchedEntities = (await Promise.all(entityPromises)).filter(
            // eslint-disable-next-line @typescript-eslint/no-shadow
            (entity): entity is RootlyEntity => entity !== null,
          );

          setEntities(fetchedEntities);
        }
      } else {
        rootlyEntity.rootlyKind = kindOf(rootlyEntity);
        setEntities([rootlyEntity]);
      }

      setIsLoading(false); // Fetching complete
    };

    fetchEntities();
  }, [entity, rootlyEntity, catalogApi]);

  if (isLoading) {
    // Show progress bar while loading
    return <Progress />;
  }

  if (entities.length === 1) {
    return buildEntity(entities[0], organizationId);
  } else if (entities.length > 1) {
    return buildEntities(entities);
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

function buildEntities(entities: RootlyEntity[]) {
  return <RootlySystemIncidentsPageLayout entities={entities} />;
}

function buildEntity(entity: RootlyEntity, organizationId?: string) {
  const resource = () => {
    if (entity.rootlyKind === 'Service') {
      return (
        <RootlyServiceIncidentsPageLayout
          entity={entity}
          organizationId={organizationId || entity.metadata.annotations?.[ROOTLY_ANNOTATION_ORG_ID]}
        />
      );
    } else if (entity.rootlyKind === 'Functionality') {
      return (
        <RootlyFunctionalityIncidentsPageLayout
          entity={entity}
          organizationId={organizationId || entity.metadata.annotations?.[ROOTLY_ANNOTATION_ORG_ID]}
        />
      );
    } else if (entity.rootlyKind === 'Team') {
      return (
        <RootlyTeamIncidentsPageLayout
          entity={entity}
          organizationId={organizationId || entity.metadata.annotations?.[ROOTLY_ANNOTATION_ORG_ID]}
        />
      );
    }
    return <div>No Rootly annotations found</div>;
  };

  return <div>{resource()}</div>;
}
