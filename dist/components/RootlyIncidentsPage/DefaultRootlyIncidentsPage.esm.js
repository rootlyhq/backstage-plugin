import React, { useState, useEffect } from 'react';
import { RootlyServiceIncidentsPageLayout } from './RootlyServiceIncidentsPageLayout.esm.js';
import { RootlyFunctionalityIncidentsPageLayout } from './RootlyFunctionalityIncidentsPageLayout.esm.js';
import { RootlyTeamIncidentsPageLayout } from './RootlyTeamIncidentsPageLayout.esm.js';
import { useEntity, catalogApiRef } from '@backstage/plugin-catalog-react';
import { ROOTLY_ANNOTATION_ORG_ID, ROOTLY_ANNOTATION_SERVICE_ID, ROOTLY_ANNOTATION_SERVICE_SLUG, ROOTLY_ANNOTATION_FUNCTIONALITY_ID, ROOTLY_ANNOTATION_FUNCTIONALITY_SLUG, ROOTLY_ANNOTATION_TEAM_ID, ROOTLY_ANNOTATION_TEAM_SLUG } from '@rootly/backstage-plugin-common';
import { Progress } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { RootlySystemIncidentsPageLayout } from './RootlySystemIncidentsPageLayout.esm.js';

const DefaultRootlyIncidentsPage = ({
  organizationId
}) => {
  const [entities, setEntities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { entity } = useEntity();
  const rootlyEntity = entity;
  const catalogApi = useApi(catalogApiRef);
  useEffect(() => {
    const fetchEntities = async () => {
      if (entity.kind === "System") {
        const hasPartRelations = entity.relations?.filter(
          (relation) => relation.type === "hasPart"
        );
        if (hasPartRelations && hasPartRelations.length > 0) {
          const entityPromises = hasPartRelations.map(async (relation) => {
            const _entity = await catalogApi.getEntityByRef(
              relation.targetRef
            );
            if (_entity && _entity.metadata.annotations?.[ROOTLY_ANNOTATION_ORG_ID]) {
              _entity.rootlyKind = kindOf(_entity);
              return _entity;
            }
            return null;
          });
          const fetchedEntities = (await Promise.all(entityPromises)).filter(
            // eslint-disable-next-line @typescript-eslint/no-shadow
            (entity2) => entity2 !== null
          );
          setEntities(fetchedEntities);
        }
      } else {
        rootlyEntity.rootlyKind = kindOf(rootlyEntity);
        setEntities([rootlyEntity]);
      }
      setIsLoading(false);
    };
    fetchEntities();
  }, [entity, rootlyEntity, catalogApi]);
  if (isLoading) {
    return /* @__PURE__ */ React.createElement(Progress, null);
  }
  if (entities.length === 1) {
    return buildEntity(entities[0], organizationId);
  } else if (entities.length > 1) {
    return buildEntities(entities);
  }
  return /* @__PURE__ */ React.createElement("div", null, "No Rootly annotations found");
};
function kindOf(entity) {
  const service_id_annotation = entity.metadata.annotations?.[ROOTLY_ANNOTATION_SERVICE_ID] || entity.metadata.annotations?.[ROOTLY_ANNOTATION_SERVICE_SLUG];
  const functionality_id_annotation = entity.metadata.annotations?.[ROOTLY_ANNOTATION_FUNCTIONALITY_ID] || entity.metadata.annotations?.[ROOTLY_ANNOTATION_FUNCTIONALITY_SLUG];
  const team_id_annotation = entity.metadata.annotations?.[ROOTLY_ANNOTATION_TEAM_ID] || entity.metadata.annotations?.[ROOTLY_ANNOTATION_TEAM_SLUG];
  if (service_id_annotation) {
    return "Service";
  } else if (functionality_id_annotation) {
    return "Functionality";
  } else if (team_id_annotation) {
    return "Team";
  }
  return void 0;
}
function buildEntities(entities) {
  return /* @__PURE__ */ React.createElement(RootlySystemIncidentsPageLayout, { entities });
}
function buildEntity(entity, organizationId) {
  const resource = () => {
    if (entity.rootlyKind === "Service") {
      return /* @__PURE__ */ React.createElement(
        RootlyServiceIncidentsPageLayout,
        {
          entity,
          organizationId: organizationId || entity.metadata.annotations?.[ROOTLY_ANNOTATION_ORG_ID]
        }
      );
    } else if (entity.rootlyKind === "Functionality") {
      return /* @__PURE__ */ React.createElement(
        RootlyFunctionalityIncidentsPageLayout,
        {
          entity,
          organizationId: organizationId || entity.metadata.annotations?.[ROOTLY_ANNOTATION_ORG_ID]
        }
      );
    } else if (entity.rootlyKind === "Team") {
      return /* @__PURE__ */ React.createElement(
        RootlyTeamIncidentsPageLayout,
        {
          entity,
          organizationId: organizationId || entity.metadata.annotations?.[ROOTLY_ANNOTATION_ORG_ID]
        }
      );
    }
    return /* @__PURE__ */ React.createElement("div", null, "No Rootly annotations found");
  };
  return /* @__PURE__ */ React.createElement("div", null, resource());
}

export { DefaultRootlyIncidentsPage };
//# sourceMappingURL=DefaultRootlyIncidentsPage.esm.js.map
