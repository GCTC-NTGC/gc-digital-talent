/**
 * @jest-environment jsdom
 */

import React from "react";
import { within, screen } from "@testing-library/react";
import { axeTest, renderWithProviders } from "@gc-digital-talent/jest-helpers";
import { fakeSkillFamilies, fakeSkills } from "@gc-digital-talent/fake-data";
import { SkillCategory } from "@gc-digital-talent/graphql";

import MissingSkills, { type MissingSkillsProps } from "./MissingSkills";

const fakedSkillFamilies = fakeSkillFamilies();
const fakeBehaviouralFamily = fakedSkillFamilies[0];
fakeBehaviouralFamily.category = SkillCategory.Behavioural;
const fakeTechnicalFamily = fakedSkillFamilies[1];
fakeTechnicalFamily.category = SkillCategory.Technical;

// the two below skills arrays will be identical except with different skill.families values, therefore select skills carefully
const fakedBehaviouralSkills = fakeSkills(10, [fakeBehaviouralFamily]);
const fakedTechnicalSkills = fakeSkills(10, [fakeTechnicalFamily]);

// skills selected so as to ensure they are completely different and 2 of each category per skill grouping
const fakeRequiredSkills = [
  ...fakedBehaviouralSkills.splice(0, 2),
  ...fakedTechnicalSkills.splice(2, 2),
];
const fakeOptionalSkills = [
  ...fakedBehaviouralSkills.splice(4, 2),
  ...fakedTechnicalSkills.splice(6, 2),
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
    const element = renderMissingSkills();

    const lists = element.getAllByRole("list");
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
    const element = renderMissingSkills({
      addedSkills: defaultProps.optionalSkills,
    });

    const lists = element.getAllByRole("list");
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
        defaultProps.requiredSkills[0], // behavioural
        defaultProps.optionalSkills[0], // behavioural
      ],
    });

    const lists = element.getAllByRole("list");
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
    const element = renderMissingSkills({
      // Adding one from each array to added skills
      addedSkills: [
        {
          ...defaultProps.requiredSkills[0],
          experienceSkillRecord: { details: null },
        },
        {
          ...defaultProps.requiredSkills[0],
          experienceSkillRecord: { details: "" },
        },
        {
          ...defaultProps.optionalSkills[0],
          experienceSkillRecord: { details: null },
        },
        {
          ...defaultProps.optionalSkills[0],
          experienceSkillRecord: { details: "" },
        },
      ],
    });

    const lists = element.getAllByRole("list");
    expect(lists.length).toEqual(4);

    const requiredSkillsListItems = within(lists[0]).queryAllByRole("listitem");
    const requiredDetailsListItems = within(lists[1]).queryAllByRole(
      "listitem",
    );
    expect(
      requiredSkillsListItems.length + requiredDetailsListItems.length,
    ).toEqual(
      4, // Check that we are not missing any items
    );

    const optionSkillsListItems = within(lists[2]).queryAllByRole("listitem");
    const optionDetailsListItems = within(lists[3]).queryAllByRole("listitem");
    expect(
      optionSkillsListItems.length + optionDetailsListItems.length,
    ).toEqual(
      4, // Check that we are not missing any items
    );
  });
});
