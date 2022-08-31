/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import React from "react";
import { fakeSkills, fakeSkillFamilies } from "../../../fakeData";
import { axeTest, fireEvent, render } from "../../../helpers/testUtils";

import SkillPicker, { type SkillPickerProps } from "./SkillPicker";

const mockFamilies = fakeSkillFamilies(10);
const mockSkills = fakeSkills(30, mockFamilies);

const defaultProps = {
  skills: mockSkills,
  selectedSkills: [],
  onChange: jest.fn(),
};

const renderSkillPicker = (overrideProps?: SkillPickerProps) => {
  const props = {
    ...defaultProps,
    ...overrideProps,
  };

  return render(<SkillPicker {...props} />);
};

describe("SkillPicker", () => {
  it("should have no accessibility errors", async () => {
    const { container } = renderSkillPicker();

    await axeTest(container);
  });

  it("should render skill results", () => {
    const skillPicker = renderSkillPicker();

    const technicalTab = skillPicker.getByRole("tab", {
      name: /technical skills/i,
    });
    expect(technicalTab).toBeInTheDocument();
    fireEvent.click(technicalTab);

    expect(
      skillPicker.getByRole("tabpanel", {
        name: /technical skills/i,
      }),
    ).toBeInTheDocument();

    const skillResults = skillPicker.queryAllByRole("button", {
      name: /add skill/i,
    });
    expect(skillResults.length).toEqual(5);
  });
});
