/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { TabSetProps } from ".";
import { Simple, SkillsToExperience, SortExperience } from "./tabs.stories";

describe("Tab tests", () => {
  test("Test if the component starts with the first tab and can click over to the second tab", () => {
    const firstTabContents = "Contents of Tab 1";
    const secondTabLabel = "Tab 2";
    const secondTabContents = "Contents of Tab 2";
    const props = Simple.args as TabSetProps;
    render(<Simple {...props} />);
    expect(screen.queryByText(firstTabContents)).toBeVisible();
    expect(screen.queryByText(secondTabContents)).not.toBeVisible();
    fireEvent.click(screen.getByText(secondTabLabel));
    expect(screen.queryByText(firstTabContents)).not.toBeVisible();
    expect(screen.queryByText(secondTabContents)).toBeVisible();
  });
  test("Test if the component starts open and can be closed", () => {
    const firstTabContents = "I'm the frequent skills page!";
    const closeTabLabel = "Close";
    const props = SkillsToExperience.args as TabSetProps;
    render(<SkillsToExperience {...props} />);
    expect(screen.queryByText(firstTabContents)).toBeVisible();
    fireEvent.click(screen.getByText(closeTabLabel));
    expect(screen.queryByText(firstTabContents)).not.toBeVisible();
  });
  test("Test if the component starts on the second tab when the first is just a label", () => {
    const firstTabLabel = "See Experience:";
    const secondTabContents = "I'm the By Date page!";
    const props = SortExperience.args as TabSetProps;
    render(<SortExperience {...props} />);
    expect(screen.queryByText(secondTabContents)).toBeVisible();
    fireEvent.click(screen.getByText(firstTabLabel));
    expect(screen.queryByText(secondTabContents)).toBeVisible(); // nothing should have changed
  });
});
