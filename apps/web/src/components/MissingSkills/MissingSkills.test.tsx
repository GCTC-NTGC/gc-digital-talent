/**
 * @jest-environment jsdom
 */

import React from "react";
import { within, screen } from "@testing-library/react";

import { axeTest, renderWithProviders } from "@gc-digital-talent/jest-helpers";
import { fakeSkillFamilies, fakeSkills } from "@gc-digital-talent/fake-data";

import { SkillCategory } from "~/api/generated";

import MissingSkills, { type MissingSkillsProps } from "./MissingSkills";

const fakedSkillFamilies = fakeSkillFamilies(2);

// four skills for each category and all different
const fakedBehaviouralSkills = fakeSkills(
  4,
  [fakedSkillFamilies[0]],
  SkillCategory.Behavioural,
);
const fakedTechnicalSkills = fakeSkills(
  8,
  [fakedSkillFamilies[1]],
  SkillCategory.Technical,
).slice(4);

// 2 technical and two behavioural skills for a total of 4 for both required and optional
// behavioural preceding in the arrays
const fakeRequiredSkills = [
  ...fakedBehaviouralSkills.slice(0, 2),
  ...fakedTechnicalSkills.slice(0, 2),
];
const fakeOptionalSkills = [
  ...fakedBehaviouralSkills.slice(2),
  ...fakedTechnicalSkills.slice(2),
];

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
  return renderWithProviders(<MissingSkills {...props} />);
};

describe("MissingSkills", () => {
  it("should have no accessibility errors", async () => {
    const { container } = renderMissingSkills();

    await axeTest(container);
  });

  it("should render all skills when none added", () => {
    renderMissingSkills();

    const lists = screen.getAllByRole("list");
    expect(lists.length).toEqual(3);

    const requiredApplicationSkillsListItems = within(lists[0]).queryAllByRole(
      "listitem",
    );
    expect(requiredApplicationSkillsListItems.length).toEqual(2);

    const requiredTransferableSkillsListItems = within(lists[1]).queryAllByRole(
      "listitem",
    );
    expect(requiredTransferableSkillsListItems.length).toEqual(2);

    const optionalListItems = within(lists[2]).queryAllByRole("listitem");
    expect(optionalListItems.length).toEqual(4);
  });

  it("should only render required skills if not missing optional", () => {
    renderMissingSkills({
      addedSkills: defaultProps.optionalSkills,
    });

    const lists = screen.getAllByRole("list");
    expect(lists.length).toEqual(2);

    const requiredApplicationSkillsListItems = within(lists[0]).queryAllByRole(
      "listitem",
    );
    expect(requiredApplicationSkillsListItems.length).toEqual(2);

    const requiredTransferableSkillsListItems = within(lists[1]).queryAllByRole(
      "listitem",
    );
    expect(requiredTransferableSkillsListItems.length).toEqual(2);

    expect(screen.queryByText(/nice to have skills/i)).toBeFalsy();
  });

  it("should only render optional skills if not missing required", () => {
    renderMissingSkills({
      addedSkills: defaultProps.requiredSkills,
    });

    const lists = screen.getAllByRole("list");
    expect(lists.length).toEqual(1);

    const optionalListItems = within(lists[0]).queryAllByRole("listitem");
    expect(optionalListItems.length).toEqual(
      defaultProps.optionalSkills?.length,
    );
  });

  it("should not render added skills", () => {
    renderMissingSkills({
      // Adding one from each array to added skills
      addedSkills: [
        defaultProps.requiredSkills[0], // behavioural
        defaultProps.optionalSkills[0], // behavioural
      ],
    });

    const lists = screen.getAllByRole("list");
    expect(lists.length).toEqual(3);

    const requiredApplicationSkillsListItems = within(lists[0]).queryAllByRole(
      "listitem",
    );
    expect(requiredApplicationSkillsListItems.length).toEqual(2);

    const requiredTransferableSkillsListItems = within(lists[1]).queryAllByRole(
      "listitem",
    );
    expect(requiredTransferableSkillsListItems.length).toEqual(1); // Missing the added item

    const addedRequiredSkillName = defaultProps.requiredSkills[0].name.en ?? "";
    const skillRegExpRequired = new RegExp(addedRequiredSkillName);
    expect(screen.queryByText(skillRegExpRequired)).toBeFalsy(); // Check it is missing by name

    const optionalListItems = within(lists[2]).queryAllByRole("listitem");
    expect(optionalListItems.length).toEqual(
      3, // Missing the added item
    );

    const addedOptionalSkillName = defaultProps.requiredSkills[0].name.en ?? "";
    const skillRegExpOptional = new RegExp(addedOptionalSkillName);
    expect(screen.queryByText(skillRegExpOptional)).toBeFalsy();
  });

  it("should ignore added skills with empty experienceSkillRecords detail field", () => {
    renderMissingSkills({
      // Adding one from each array to added skills
      addedSkills: [
        {
          ...defaultProps.requiredSkills[0],
          experienceSkillRecord: { details: null },
        },
        {
          ...defaultProps.requiredSkills[1],
          experienceSkillRecord: { details: "details" },
        },
        {
          ...defaultProps.requiredSkills[2],
          experienceSkillRecord: { details: null },
        },
        {
          ...defaultProps.optionalSkills[0],
          experienceSkillRecord: { details: null },
        },
        {
          ...defaultProps.optionalSkills[1],
          experienceSkillRecord: { details: "details" },
        },
        {
          ...defaultProps.optionalSkills[2],
          experienceSkillRecord: { details: null },
        },
      ],
    });

    const lists = screen.getAllByRole("list");
    expect(lists.length).toEqual(5);

    const requiredSkillsListItems = within(lists[0]).queryAllByRole("listitem");
    const requiredDetailsListItems = within(lists[1]).queryAllByRole(
      "listitem",
    );
    expect(
      requiredSkillsListItems.length + requiredDetailsListItems.length,
    ).toEqual(
      2, // Check that we are not missing any items
    );

    const requiredBehaviouralSkills = within(lists[2]).queryAllByRole(
      "listitem",
    );
    expect(requiredBehaviouralSkills.length).toEqual(1);

    const optionSkillsListItems = within(lists[3]).queryAllByRole("listitem");
    const optionDetailsListItems = within(lists[4]).queryAllByRole("listitem");
    expect(
      optionSkillsListItems.length + optionDetailsListItems.length,
    ).toEqual(
      3, // Check that we are not missing any items
    );
  });
});
