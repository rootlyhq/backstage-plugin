import React from 'react';
import { useOutlet } from 'react-router';
import { DefaultRootlyIncidentsPage } from './DefaultRootlyIncidentsPage.esm.js';

const RootlyIncidentsPage = ({ organizationId }) => {
  const outlet = useOutlet();
  return outlet || /* @__PURE__ */ React.createElement(DefaultRootlyIncidentsPage, { organizationId });
};

export { RootlyIncidentsPage };
//# sourceMappingURL=RootlyIncidentsPage.esm.js.map
