/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import React from "react";
import SideMenu from "./SideMenu";
import type { SideMenuProps } from "./SideMenu";
import SideMenuItem from "./SideMenuItem";

const defaultProps = {
  isOpen: true,
  label: "Main Menu",
  onToggle: jest.fn(() => null),
};

const icon = () => <>Icon</>;
const openClass = "side-menu--open";

const renderSideMenu = (props: SideMenuProps) => {
  return render(
    <SideMenu {...props}>
      <SideMenuItem href="#" icon={icon}>
        Test
      </SideMenuItem>
    </SideMenu>,
  );
};

describe("SideMenu", () => {
  it("Should be closed if isOpen false", async () => {
    renderSideMenu({
      ...defaultProps,
      isOpen: false,
    });

    const container = await screen.getByRole("navigation", {
      name: /main menu/i,
    }).parentElement?.parentElement;

    expect(container).not.toHaveClass(openClass);
  });

  it("Should be open if isOpen true", async () => {
    renderSideMenu(defaultProps);

    const container = await screen.getByRole("navigation", {
      name: /main menu/i,
    }).parentElement?.parentElement;

    expect(container).toHaveClass(openClass);
  });
});
