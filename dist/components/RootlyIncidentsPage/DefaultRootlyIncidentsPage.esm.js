import React, { useState, useEffect } from 'react';
import { RootlyServiceIncidentsPageLayout } from './RootlyServiceIncidentsPageLayout.esm.js';
import { RootlyFunctionalityIncidentsPageLayout } from './RootlyFunctionalityIncidentsPageLayout.esm.js';
import { RootlyTeamIncidentsPageLayout } from './RootlyTeamIncidentsPageLayout.esm.js';
import { useEntity, catalogApiRef } from '@backstage/plugin-catalog-react';
import { ROOTLY_ANNOTATION_SERVICE_ID, ROOTLY_ANNOTATION_SERVICE_SLUG, ROOTLY_ANNOTATION_FUNCTIONALITY_ID, ROOTLY_ANNOTATION_FUNCTIONALITY_SLUG, ROOTLY_ANNOTATION_TEAM_ID, ROOTLY_ANNOTATION_TEAM_SLUG } from '@rootly/backstage-plugin-common';
import { useApi } from '@backstage/core-plugin-api';

const DefaultRootlyIncidentsPage = ({ organizationId }) => {
  const [entities, setEntities] = useState([]);
  const { entity } = useEntity();
  const catalogApi = useApi(catalogApiRef);
  useEffect(() => {
    const fetchEntities = async () => {
      let fetchedEntities = [];
      if (entity.kind === "System") {
        const hasPartRelation = entity.relations?.filter((relation) => relation.type === "hasPart");
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
  return /* @__PURE__ */ React.createElement(React.Fragment, null, entities.map((_entity) => {
    return buildEntity(_entity, organizationId);
  }));
};
function buildEntity(entity, organizationId) {
  const service_id_annotation = entity.metadata.annotations?.[ROOTLY_ANNOTATION_SERVICE_ID] || entity.metadata.annotations?.[ROOTLY_ANNOTATION_SERVICE_SLUG];
  const functionality_id_annotation = entity.metadata.annotations?.[ROOTLY_ANNOTATION_FUNCTIONALITY_ID] || entity.metadata.annotations?.[ROOTLY_ANNOTATION_FUNCTIONALITY_SLUG];
  const team_id_annotation = entity.metadata.annotations?.[ROOTLY_ANNOTATION_TEAM_ID] || entity.metadata.annotations?.[ROOTLY_ANNOTATION_TEAM_SLUG];
  const resource = () => {
    if (service_id_annotation) {
      return /* @__PURE__ */ React.createElement(RootlyServiceIncidentsPageLayout, { entity, organizationId });
    } else if (functionality_id_annotation) {
      return /* @__PURE__ */ React.createElement(RootlyFunctionalityIncidentsPageLayout, { entity, organizationId });
    } else if (team_id_annotation) {
      return /* @__PURE__ */ React.createElement(RootlyTeamIncidentsPageLayout, { entity, organizationId });
    }
    return /* @__PURE__ */ React.createElement("div", null, "No Rootly annotations found");
  };
  return /* @__PURE__ */ React.createElement("div", null, resource());
}

export { DefaultRootlyIncidentsPage };
//# sourceMappingURL=DefaultRootlyIncidentsPage.esm.js.map
