/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { userEvent } from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import { ComponentPropsWithoutRef } from "react";

import { renderWithProviders, axeTest } from "@gc-digital-talent/jest-helpers";

import Tabs from "./Tabs";

type TabsRootPrimitivePropsWithoutRef = ComponentPropsWithoutRef<
  typeof Tabs.Root
>;

const renderTabs = ({ ...rest }: TabsRootPrimitivePropsWithoutRef) => {
  return renderWithProviders(
    <Tabs.Root {...rest}>
      <Tabs.List aria-label="Tabs Nav">
        <Tabs.Trigger value="one">One</Tabs.Trigger>
        <Tabs.Trigger value="two">Two</Tabs.Trigger>
        <Tabs.Trigger value="three">Three</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="one">
        <p>One</p>
      </Tabs.Content>
      <Tabs.Content value="two">
        <p>Two</p>
      </Tabs.Content>
      <Tabs.Content value="three">
        <p>Three</p>
      </Tabs.Content>
    </Tabs.Root>,
  );
};

describe("Tabs", () => {
  const user = userEvent.setup();
  window.HTMLElement.prototype.scrollTo = jest.fn();

  it("should not have accessibility errors when closed", async () => {
    const { container } = renderTabs({});
    await axeTest(container);
  });

  it("should not have accessibility errors when open", async () => {
    const { container } = renderTabs({
      defaultValue: "one",
    });
    await axeTest(container);
  });

  it("should only render opened tabpanel", () => {
    renderTabs({
      defaultValue: "one",
    });

    const tabOne = screen.queryByRole("tabpanel", { name: /One/i });
    const tabTwo = screen.queryByRole("tabpanel", {
      name: /Two/i,
    });
    const tabThree = screen.queryByRole("tabpanel", {
      name: /Three/i,
    });

    expect(tabOne).toBeInTheDocument();
    expect(tabOne).toHaveAttribute("data-state", "active");
    expect(tabTwo).not.toBeInTheDocument();
    expect(tabThree).not.toBeInTheDocument();
  });

  it("should change panel when tab clicked", async () => {
    renderTabs({
      defaultValue: "one",
    });

    expect(screen.getByRole("tabpanel", { name: /one/i })).toBeInTheDocument();
    expect(
      screen.queryByRole("tabpanel", { name: /two/i }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: /two/i }));

    expect(screen.getByRole("tabpanel", { name: /two/i })).toBeInTheDocument();
    expect(
      screen.queryByRole("tabpanel", { name: /one/i }),
    ).not.toBeInTheDocument();
  });
});
