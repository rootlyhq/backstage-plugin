/** @jsxRuntime automatic */
import { render, screen } from "@testing-library/react";
import { Fragment, type ReactNode } from "react";

import { DefaultRootlyPageLayout } from "./DefaultRootlyPageLayout";

const mockRoutedTabs = jest.fn(
  ({
    routes,
  }: {
    routes: Array<{ path: string; tabProps?: object; title: string }>;
  }) => (
    <div>
      {routes.map((route) => (
        <div key={route.path}>{`${route.title}:${route.path}`}</div>
      ))}
    </div>
  ),
);

jest.mock("@backstage/core-components", () => ({
  Header: ({ title }: { title: string }) => <h1>{title}</h1>,
  Page: ({ children }: { children: ReactNode }) => <main>{children}</main>,
  RoutedTabs: (props: unknown) => mockRoutedTabs(props as never),
}));

describe("DefaultRootlyPageLayout", () => {
  beforeEach(() => mockRoutedTabs.mockClear());

  it("turns Route children into routed tabs", () => {
    render(
      <DefaultRootlyPageLayout>
        <DefaultRootlyPageLayout.Route path="/incidents" title="Incidents">
          <div>Incident content</div>
        </DefaultRootlyPageLayout.Route>
        <DefaultRootlyPageLayout.Route path="/services" title="Services">
          <div>Service content</div>
        </DefaultRootlyPageLayout.Route>
      </DefaultRootlyPageLayout>,
    );

    expect(screen.getByRole("heading", { name: "Rootly" })).toBeInTheDocument();
    expect(screen.getByText("Incidents:/incidents")).toBeInTheDocument();
    expect(screen.getByText("Services:/services")).toBeInTheDocument();
    expect(mockRoutedTabs.mock.calls[0][0].routes).toEqual([
      expect.objectContaining({ path: "/incidents", title: "Incidents" }),
      expect.objectContaining({ path: "/services", title: "Services" }),
    ]);
  });

  it("flattens fragments and ignores non-elements", () => {
    render(
      <DefaultRootlyPageLayout>
        text is ignored
        <Fragment>
          <DefaultRootlyPageLayout.Route path="/teams" title="Teams">
            <div>Team content</div>
          </DefaultRootlyPageLayout.Route>
        </Fragment>
      </DefaultRootlyPageLayout>,
    );

    expect(screen.getByText("Teams:/teams")).toBeInTheDocument();
  });

  it("preserves tab properties", () => {
    render(
      <DefaultRootlyPageLayout>
        <DefaultRootlyPageLayout.Route
          path="/services"
          title="Services"
          tabProps={{ disabled: true }}
        >
          <div />
        </DefaultRootlyPageLayout.Route>
      </DefaultRootlyPageLayout>,
    );

    expect(mockRoutedTabs.mock.calls[0][0].routes[0].tabProps).toEqual({
      disabled: true,
    });
  });

  it("rejects arbitrary element children with a Rootly-specific error", () => {
    expect(() =>
      render(
        <DefaultRootlyPageLayout>
          <div>Invalid child</div>
        </DefaultRootlyPageLayout>,
      ),
    ).toThrow(
      "Child of DefaultRootlyPageLayout must be a DefaultRootlyPageLayout.Route",
    );
  });
});
