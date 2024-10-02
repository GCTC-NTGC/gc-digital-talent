/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { screen } from "@testing-library/react";
import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";

import { renderWithProviders } from "@gc-digital-talent/jest-helpers";

import SideMenu from "./SideMenu";
import type { SideMenuProps } from "./SideMenu";
import SideMenuItem from "./SideMenuItem";

const defaultProps = {
  open: true,
  label: "Main Menu",
  onToggle: jest.fn(() => null),
};

const icon = MagnifyingGlassIcon;

const renderSideMenu = (props: SideMenuProps) => {
  return renderWithProviders(
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
      open: false,
    });

    const nav = screen.getByRole("navigation", {
      name: /main menu/i,
    });

    expect(nav).toHaveAttribute("data-state", "closed");
  });

  it("Should be open if isOpen true", () => {
    renderSideMenu(defaultProps);

    const nav = screen.getByRole("navigation", {
      name: /main menu/i,
    });

    expect(nav).toHaveAttribute("data-state", "open");
  });
});
