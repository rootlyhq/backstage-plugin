import React from 'react';
import { RootlyServiceIncidentsPageLayout } from './RootlyServiceIncidentsPageLayout.esm.js';
import { RootlyFunctionalityIncidentsPageLayout } from './RootlyFunctionalityIncidentsPageLayout.esm.js';
import { RootlyTeamIncidentsPageLayout } from './RootlyTeamIncidentsPageLayout.esm.js';
import { useEntity } from '@backstage/plugin-catalog-react';
import { ROOTLY_ANNOTATION_SERVICE_ID, ROOTLY_ANNOTATION_SERVICE_SLUG, ROOTLY_ANNOTATION_FUNCTIONALITY_ID, ROOTLY_ANNOTATION_FUNCTIONALITY_SLUG, ROOTLY_ANNOTATION_TEAM_ID, ROOTLY_ANNOTATION_TEAM_SLUG } from '@rootly/backstage-plugin-common';

const DefaultRootlyIncidentsPage = ({ organizationId }) => {
  const { entity } = useEntity();
  const service_id_annotation = entity.metadata.annotations?.[ROOTLY_ANNOTATION_SERVICE_ID] || entity.metadata.annotations?.[ROOTLY_ANNOTATION_SERVICE_SLUG];
  const functionality_id_annotation = entity.metadata.annotations?.[ROOTLY_ANNOTATION_FUNCTIONALITY_ID] || entity.metadata.annotations?.[ROOTLY_ANNOTATION_FUNCTIONALITY_SLUG];
  const team_id_annotation = entity.metadata.annotations?.[ROOTLY_ANNOTATION_TEAM_ID] || entity.metadata.annotations?.[ROOTLY_ANNOTATION_TEAM_SLUG];
  const resource = () => {
    if (service_id_annotation) {
      return /* @__PURE__ */ React.createElement(RootlyServiceIncidentsPageLayout, { organizationId });
    } else if (functionality_id_annotation) {
      return /* @__PURE__ */ React.createElement(RootlyFunctionalityIncidentsPageLayout, { organizationId });
    } else if (team_id_annotation) {
      return /* @__PURE__ */ React.createElement(RootlyTeamIncidentsPageLayout, { organizationId });
    }
    return /* @__PURE__ */ React.createElement("div", null, "No Rootly annotations found");
  };
  return /* @__PURE__ */ React.createElement("div", null, resource());
};

export { DefaultRootlyIncidentsPage };
//# sourceMappingURL=DefaultRootlyIncidentsPage.esm.js.map
