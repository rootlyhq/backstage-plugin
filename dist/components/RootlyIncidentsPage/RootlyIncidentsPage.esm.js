import React from 'react';
import { useOutlet } from 'react-router';
import { DefaultRootlyIncidentsPage } from './DefaultRootlyIncidentsPage.esm.js';

const RootlyIncidentsPage = () => {
  const outlet = useOutlet();
  return outlet || /* @__PURE__ */ React.createElement(DefaultRootlyIncidentsPage, null);
};

export { RootlyIncidentsPage };
//# sourceMappingURL=RootlyIncidentsPage.esm.js.map
