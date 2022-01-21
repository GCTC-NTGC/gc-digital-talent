/**
 * @jest-environment jsdom
 */

import React from "react";
import { screen } from "@testing-library/react";
import { render } from "./testUtils";
import HomePage from "../components/HomePage";

function renderHomePage() {
  return render(<HomePage />);
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
