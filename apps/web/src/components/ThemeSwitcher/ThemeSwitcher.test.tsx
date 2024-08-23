/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { screen, fireEvent } from "@testing-library/react";

import { renderWithProviders } from "@gc-digital-talent/jest-helpers";
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
  Object.setPrototypeOf(void window.localStorage.setItem, jest.fn());

  it("should change theme to light mode", () => {
    renderThemeSwitcher();
    fireEvent.click(
      screen.getByRole("radio", { name: /activate light mode/i }),
    );

    expect(void window.localStorage.setItem).toHaveBeenCalledWith(
      "theme",
      JSON.stringify({
        key: "default",
        mode: "light",
      }),
    );

    expect(
      screen.getByRole("radio", { name: /activate light mode/i }),
    ).toHaveAttribute("data-state", "on");
  });

  it("should change theme to dark mode", () => {
    renderThemeSwitcher();
    fireEvent.click(screen.getByRole("radio", { name: /activate dark mode/i }));

    expect(void window.localStorage.setItem).toHaveBeenCalledWith(
      "theme",
      JSON.stringify({
        key: "default",
        mode: "dark",
      }),
    );

    expect(
      screen.getByRole("radio", { name: /activate dark mode/i }),
    ).toHaveAttribute("data-state", "on");
  });

  it("should change theme to pref mode", () => {
    renderThemeSwitcher();
    fireEvent.click(
      screen.getByRole("radio", {
        name: /allow your browser preferences to dictate/i,
      }),
    );

    expect(
      screen.getByRole("radio", {
        name: /allow your browser preferences to dictate/i,
      }),
    ).toHaveAttribute("data-state", "on");
  });
});
