import React, { Children, isValidElement, Fragment } from 'react';
import { attachComponentData } from '@backstage/core-plugin-api';
import { Page, Header, RoutedTabs } from '@backstage/core-components';

const Route = () => null;
attachComponentData(Route, "core.gatherMountPoints", true);
function createSubRoutesFromChildren(childrenProps) {
  const routeType = (/* @__PURE__ */ React.createElement(Route, { path: "", title: "" }, /* @__PURE__ */ React.createElement("div", null))).type;
  return Children.toArray(childrenProps).flatMap((child) => {
    if (!isValidElement(child)) {
      return [];
    }
    if (child.type === Fragment) {
      return createSubRoutesFromChildren(child.props.children);
    }
    if (child.type !== routeType) {
      throw new Error("Child of ExploreLayout must be an ExploreLayout.Route");
    }
    const { path, title, children, tabProps } = child.props;
    return [{ path, title, children, tabProps }];
  });
}
const DefaultRootlyPageLayout = ({ children }) => {
  const routes = createSubRoutesFromChildren(children);
  return /* @__PURE__ */ React.createElement(Page, { themeId: "tool" }, /* @__PURE__ */ React.createElement(Header, { title: "Rootly" }), /* @__PURE__ */ React.createElement(RoutedTabs, { routes }));
};
DefaultRootlyPageLayout.Route = Route;

export { DefaultRootlyPageLayout };
//# sourceMappingURL=DefaultRootlyPageLayout.esm.js.map
