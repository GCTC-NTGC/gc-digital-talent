/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import React from "react";
import { act, screen, fireEvent } from "@testing-library/react";

import { renderWithProviders, axeTest } from "@gc-digital-talent/jest-helpers";
import { ThemeProvider } from "@gc-digital-talent/theme";

import ThemeSwitcher from "./ThemeSwitcher";

const renderThemeSwitcher = () => {
  return renderWithProviders(
    <ThemeProvider>
      <ThemeSwitcher />
    </ThemeProvider>,
  );
};

describe("ThemeSwitcher", () => {
  // Spy on local storage methods to allow for testing them
  jest.spyOn(Object.getPrototypeOf(window.localStorage), "setItem");
  jest.spyOn(Object.getPrototypeOf(window.localStorage), "removeItem");
  Object.setPrototypeOf(window.localStorage.setItem, jest.fn());
  Object.setPrototypeOf(window.localStorage.removeItem, jest.fn());

  it("should have no accessibility errors", async () => {
    await act(async () => {
      const { container } = renderThemeSwitcher();
      await axeTest(container);
    });
  });

  it("should change theme to light mode", async () => {
    renderThemeSwitcher();
    fireEvent.click(
      await screen.getByRole("radio", { name: /activate light mode/i }),
    );

    expect(window.localStorage.setItem).toHaveBeenCalledWith("theme", "light");

    expect(
      await screen.getByRole("radio", { name: /activate light mode/i }),
    ).toHaveAttribute("data-state", "on");
  });

  it("should change theme to dark mode", async () => {
    renderThemeSwitcher();
    fireEvent.click(
      await screen.getByRole("radio", { name: /activate dark mode/i }),
    );

    expect(window.localStorage.setItem).toHaveBeenCalledWith("theme", "dark");

    expect(
      await screen.getByRole("radio", { name: /activate dark mode/i }),
    ).toHaveAttribute("data-state", "on");
  });

  it("should change theme to pref mode", async () => {
    renderThemeSwitcher();
    fireEvent.click(
      await screen.getByRole("radio", {
        name: /allow your browser preferences to dictate/i,
      }),
    );

    expect(window.localStorage.removeItem).toHaveBeenCalledWith("theme");

    expect(
      await screen.getByRole("radio", {
        name: /allow your browser preferences to dictate/i,
      }),
    ).toHaveAttribute("data-state", "on");
  });
});
