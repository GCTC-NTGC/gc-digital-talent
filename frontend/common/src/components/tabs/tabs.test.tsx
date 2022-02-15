/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import React from "react";
import { TabSet, Tab, TabSetProps } from ".";
import { Simple, SkillsToExperience } from "./tabs.stories";

describe("Tab tests", () => {
  test("Test if the component starts with the first tab and can click over to the second tab", () => {
    const firstTabExpectedContents = "Contents of Tab 1";
    const secondTabLabel = "Tab 2";
    const secondTabExpectedContents = "Contents of Tab 2";
    const props = Simple.args as TabSetProps;
    render(<Simple {...props} />);
    expect(screen.getByText(firstTabExpectedContents)).toBeTruthy();
    const secondTab = screen.getByText(secondTabLabel);
    fireEvent.click(secondTab);
    expect(screen.getByText(secondTabExpectedContents)).toBeTruthy();
  });
  test("Test if the component starts open and can be closed", () => {
    const firstTabExpectedContents = "I'm the frequent skills page!";
    const closeTabLabel = "Close";
    const props = SkillsToExperience.args as TabSetProps;
    render(<SkillsToExperience {...props} />);
    expect(screen.getByText(firstTabExpectedContents)).toBeTruthy();
    const closeTab = screen.getByText(closeTabLabel);
    fireEvent.click(closeTab); // Open skill block to view skill description
    screen.debug();
    expect(screen.getByText(firstTabExpectedContents)).not.toBeVisible();
  });
});
