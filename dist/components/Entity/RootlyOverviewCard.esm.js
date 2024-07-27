import React from 'react';
import { RootlyOverviewServiceCard } from './RootlyOverviewServiceCard.esm.js';
import { RootlyOverviewFunctionalityCard } from './RootlyOverviewFunctionalityCard.esm.js';
import { RootlyOverviewTeamCard } from './RootlyOverviewTeamCard.esm.js';
import { ROOTLY_ANNOTATION_SERVICE_ID, ROOTLY_ANNOTATION_SERVICE_SLUG, ROOTLY_ANNOTATION_FUNCTIONALITY_ID, ROOTLY_ANNOTATION_FUNCTIONALITY_SLUG, ROOTLY_ANNOTATION_TEAM_ID, ROOTLY_ANNOTATION_TEAM_SLUG } from '../../integration.esm.js';
import { useEntity } from '@backstage/plugin-catalog-react';

const RootlyOverviewCard = () => {
  const { entity } = useEntity();
  const service_id_annotation = entity.metadata.annotations?.[ROOTLY_ANNOTATION_SERVICE_ID] || entity.metadata.annotations?.[ROOTLY_ANNOTATION_SERVICE_SLUG];
  const functionality_id_annotation = entity.metadata.annotations?.[ROOTLY_ANNOTATION_FUNCTIONALITY_ID] || entity.metadata.annotations?.[ROOTLY_ANNOTATION_FUNCTIONALITY_SLUG];
  const team_id_annotation = entity.metadata.annotations?.[ROOTLY_ANNOTATION_TEAM_ID] || entity.metadata.annotations?.[ROOTLY_ANNOTATION_TEAM_SLUG];
  const resource = () => {
    if (service_id_annotation) {
      return /* @__PURE__ */ React.createElement(RootlyOverviewServiceCard, null);
    } else if (functionality_id_annotation) {
      return /* @__PURE__ */ React.createElement(RootlyOverviewFunctionalityCard, null);
    } else if (team_id_annotation) {
      return /* @__PURE__ */ React.createElement(RootlyOverviewTeamCard, null);
    }
    return /* @__PURE__ */ React.createElement("div", null, "No Rootly annotations found");
  };
  return /* @__PURE__ */ React.createElement("div", null, resource());
};

export { RootlyOverviewCard };
//# sourceMappingURL=RootlyOverviewCard.esm.js.map
