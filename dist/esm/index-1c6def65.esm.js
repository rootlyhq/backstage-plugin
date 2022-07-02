import React from 'react';
import { useOutlet } from 'react-router';
import { c as RootlyIncidentsPageLayout } from './index-f62183ad.esm.js';
export { c as RootlyIncidentsPageLayout } from './index-f62183ad.esm.js';
import '@backstage/core-plugin-api';
import '@backstage/catalog-model';
import 'qs';
import '@backstage/plugin-catalog-react';
import '@backstage/core-components';
import '@material-ui/core/Link';
import '@material-ui/lab';
import 'react-use';
import '@material-ui/core';
import '@material-ui/icons/MoreVert';
import '@material-ui/icons/OpenInNew';
import '@material-ui/icons/Sync';
import '@material-ui/icons/Delete';
import '@material-ui/core/Divider';

const DefaultRootlyIncidentsPage = () => {
  return /* @__PURE__ */ React.createElement(RootlyIncidentsPageLayout, null);
};

const RootlyIncidentsPage = () => {
  const outlet = useOutlet();
  return outlet || /* @__PURE__ */ React.createElement(DefaultRootlyIncidentsPage, null);
};

export { RootlyIncidentsPage };
//# sourceMappingURL=index-1c6def65.esm.js.map
