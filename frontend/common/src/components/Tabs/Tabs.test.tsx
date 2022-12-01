/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import React from "react";

import { render, axeTest } from "../../helpers/testUtils";

import Tabs from ".";

type TabsRootPrimitivePropsWithoutRef = React.ComponentPropsWithoutRef<
  typeof Tabs.Root
>;

const renderTabs = ({ ...rest }: TabsRootPrimitivePropsWithoutRef) => {
  return render(
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

  it("should only render opened tabpanel", async () => {
    renderTabs({
      defaultValue: "one",
    });

    const tabOne = await screen.queryByRole("tabpanel", { name: /One/i });
    const tabTwo = await screen.queryByRole("tabpanel", {
      name: /Two/i,
    });
    const tabThree = await screen.queryByRole("tabpanel", {
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
    expect(
      await screen.queryByRole("tabpanel", { name: /one/i }),
    ).toBeInTheDocument();
    expect(
      await screen.queryByRole("tabpanel", { name: /two/i }),
    ).not.toBeInTheDocument();

    await user.click(await screen.getByRole("tab", { name: /two/i }));

    expect(
      await screen.queryByRole("tabpanel", { name: /two/i }),
    ).toBeInTheDocument();
    expect(
      await screen.queryByRole("tabpanel", { name: /one/i }),
    ).not.toBeInTheDocument();
  });
});
