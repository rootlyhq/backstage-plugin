import React from 'react';
import { useOutlet } from 'react-router';
import { DefaultRootlyPage } from './DefaultRootlyPage.esm.js';

const RootlyPage = ({ organizationId }) => {
  const outlet = useOutlet();
  return outlet || /* @__PURE__ */ React.createElement(DefaultRootlyPage, { organizationId });
};

export { RootlyPage };
//# sourceMappingURL=RootlyPage.esm.js.map
