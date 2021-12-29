/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import IntlProvider from "react-intl/src/components/provider";
import HomePage from "../../resources/js/components/HomePage";

function renderHomePage() {
  return render(
    <IntlProvider locale="en">
      <HomePage />
    </IntlProvider>,
  );
}

describe("Home Page Tests", () => {
  test("should display the home page div", async () => {
    renderHomePage();
    const element = screen.getByTestId("homePage");
    expect(element).toBeTruthy();
  });

  test("should display the welcome message", async () => {
    renderHomePage();
    const element = screen.getByText("Welcome to GC Talent Home page");
    expect(element).toBeTruthy();
  });
});
