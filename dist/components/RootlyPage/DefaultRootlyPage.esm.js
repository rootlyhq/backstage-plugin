import React from 'react';
import { EntitiesList } from '../EntitiesTable/EntitiesList.esm.js';
import '@backstage/catalog-model';
import '@backstage/core-components';
import '@backstage/core-plugin-api';
import '@backstage/plugin-catalog-react';
import '@material-ui/core/Link';
import '@material-ui/lab';
import 'react-use';
import '@rootly/backstage-plugin-common';
import { IncidentsTable } from '../IncidentsTable/IncidentsTable.esm.js';
import { ServicesTable } from '../ServicesTable/ServicesTable.esm.js';
import { FunctionalitiesTable } from '../FunctionalitiesTable/FunctionalitiesTable.esm.js';
import { TeamsTable } from '../TeamsTable/TeamsTable.esm.js';
import { DefaultRootlyPageLayout } from './DefaultRootlyPageLayout.esm.js';

const DefaultRootlyPage = ({ organizationId }) => {
  return /* @__PURE__ */ React.createElement(DefaultRootlyPageLayout, null, /* @__PURE__ */ React.createElement(DefaultRootlyPageLayout.Route, { path: "incidents", title: "Incidents" }, /* @__PURE__ */ React.createElement(
    IncidentsTable,
    {
      organizationId,
      params: {
        include: "environments,services,functionalities,groups,incident_types"
      }
    }
  )), /* @__PURE__ */ React.createElement(DefaultRootlyPageLayout.Route, { path: "entities", title: "Entities" }, /* @__PURE__ */ React.createElement(EntitiesList, null)), /* @__PURE__ */ React.createElement(DefaultRootlyPageLayout.Route, { path: "services", title: "Services" }, /* @__PURE__ */ React.createElement(ServicesTable, { organizationId })), /* @__PURE__ */ React.createElement(DefaultRootlyPageLayout.Route, { path: "functionalities", title: "Functionalities" }, /* @__PURE__ */ React.createElement(FunctionalitiesTable, { organizationId })), /* @__PURE__ */ React.createElement(DefaultRootlyPageLayout.Route, { path: "teams", title: "Teams" }, /* @__PURE__ */ React.createElement(TeamsTable, { organizationId })));
};

export { DefaultRootlyPage };
//# sourceMappingURL=DefaultRootlyPage.esm.js.map
