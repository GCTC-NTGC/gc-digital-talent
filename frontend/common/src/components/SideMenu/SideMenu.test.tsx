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
const openClass = "side-menu--active";

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
  it("Should be closed if isOpen false", () => {
    renderSideMenu({
      ...defaultProps,
      isOpen: false,
    });

    expect(
      screen.getByRole("navigation", { name: /main menu/i }),
    ).not.toHaveClass(openClass);
  });

  it("Should be open if isOpen true", () => {
    renderSideMenu(defaultProps);

    expect(screen.getByRole("navigation", { name: /main menu/i })).toHaveClass(
      openClass,
    );
  });
});
