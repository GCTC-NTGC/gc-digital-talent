/**
 * @jest-environment jsdom
 */

import React from "react";
import { axeTest, render, within } from "../../../helpers/testUtils";
import { fakeSkills } from "../../../fakeData";

import MissingSkills, { type MissingSkillsProps } from "./MissingSkills";

const skills = fakeSkills();

const fakeRequiredSkills = skills.splice(0, skills.length / 2);
const fakeOptionalSkills = skills.splice(skills.length / 2, skills.length);

const defaultProps = {
  requiredSkills: fakeRequiredSkills,
  optionalSkills: fakeOptionalSkills,
  addedSkills: [],
};

const renderMissingSkills = (overrideProps?: MissingSkillsProps) => {
  const props = {
    ...defaultProps,
    ...overrideProps,
  };
  return render(<MissingSkills {...props} />);
};

describe("MissingSkills", () => {
  it("should have no accessibility errors", async () => {
    const { container } = renderMissingSkills();

    await axeTest(container);
  });

  it("should render all skills when none added", () => {
    const element = renderMissingSkills();

    const lists = element.getAllByRole("list");
    expect(lists.length).toEqual(2);

    const requiredListItems = within(lists[0]).queryAllByRole("listitem");
    expect(requiredListItems.length).toEqual(
      defaultProps.requiredSkills?.length,
    );

    const optionalListItems = within(lists[1]).queryAllByRole("listitem");
    expect(optionalListItems.length).toEqual(
      defaultProps.optionalSkills?.length,
    );
  });

  it("should only render required skills if not missing optional", () => {
    const element = renderMissingSkills({
      addedSkills: defaultProps.optionalSkills,
    });

    const lists = element.getAllByRole("list");
    expect(lists.length).toEqual(1);

    const requiredListItems = within(lists[0]).queryAllByRole("listitem");
    expect(requiredListItems.length).toEqual(
      defaultProps.requiredSkills?.length,
    );
  });

  it("should only render optional skills if not missing required", () => {
    const element = renderMissingSkills({
      addedSkills: defaultProps.requiredSkills,
    });

    const lists = element.getAllByRole("list");
    expect(lists.length).toEqual(1);

    const optionalListItems = within(lists[0]).queryAllByRole("listitem");
    expect(optionalListItems.length).toEqual(
      defaultProps.optionalSkills?.length,
    );
  });

  it("should not render added skills", () => {
    const element = renderMissingSkills({
      // Adding one from each array to added skills
      addedSkills: [
        ...defaultProps.requiredSkills.slice(0, 1),
        ...defaultProps.optionalSkills.slice(0, 1),
      ],
    });

    const lists = element.getAllByRole("list");
    expect(lists.length).toEqual(2);

    const requiredListItems = within(lists[0]).queryAllByRole("listitem");
    expect(requiredListItems.length).toEqual(
      defaultProps.requiredSkills.length - 1, // Check that we are missing an item
    );

    const optionalListItems = within(lists[1]).queryAllByRole("listitem");
    expect(optionalListItems.length).toEqual(
      defaultProps.optionalSkills.length - 1, // Check that we are missing an item
    );
  });
});
