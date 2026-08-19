/** @jsxRuntime automatic */
import { render, screen } from "@testing-library/react";

import { RootlyIncidentsPage } from "./RootlyIncidentsPage/RootlyIncidentsPage";
import { RootlyPage } from "./RootlyPage/RootlyPage";

const mockUseOutlet = jest.fn();

jest.mock("react-router", () => ({
  useOutlet: () => mockUseOutlet(),
}));
jest.mock("./RootlyPage/DefaultRootlyPage", () => ({
  DefaultRootlyPage: ({ organizationId }: { organizationId?: string }) => (
    <div>Default Rootly page {organizationId}</div>
  ),
}));
jest.mock("./RootlyIncidentsPage/DefaultRootlyIncidentsPage", () => ({
  DefaultRootlyIncidentsPage: ({
    organizationId,
  }: {
    organizationId?: string;
  }) => <div>Default incidents page {organizationId}</div>,
}));

describe.each([
  {
    Component: RootlyPage,
    defaultText: "Default Rootly page organization-id",
  },
  {
    Component: RootlyIncidentsPage,
    defaultText: "Default incidents page organization-id",
  },
])("page outlet handling", ({ Component, defaultText }) => {
  beforeEach(() => mockUseOutlet.mockReset());

  it("renders its default page and forwards the organization", () => {
    mockUseOutlet.mockReturnValue(null);

    render(<Component organizationId="organization-id" />);

    expect(screen.getByText(defaultText)).toBeInTheDocument();
  });

  it("renders a nested route outlet instead of the default page", () => {
    mockUseOutlet.mockReturnValue(<div>Nested route</div>);

    render(<Component organizationId="organization-id" />);

    expect(screen.getByText("Nested route")).toBeInTheDocument();
    expect(screen.queryByText(defaultText)).not.toBeInTheDocument();
  });
});
