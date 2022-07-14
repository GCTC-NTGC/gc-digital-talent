/**
 * @jest-environment jsdom
 */

import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import { fakeSkills } from "../../../fakeData";
import { Skill } from "../../../api/generated";
import { axeTest, render } from "../../../../tests/testUtils";

import SkillResults, { SkillBlock } from "./SkillResults";

const skills = fakeSkills();

function renderSkillResults(title: string) {
  return render(
    <SkillResults
      addedSkills={[skills[0], skills[1]]}
      skills={skills}
      title={title}
      onAddSkill={async () => {
        /* do nothing */
      }}
      onRemoveSkill={async () => {
        /* do nothing */
      }}
    />,
  );
}

function renderSkillBlock(
  isAdded: boolean,
  skill: Skill,
  onAddSkill?: () => Promise<void>,
  onRemoveSkill?: () => Promise<void>,
) {
  return render(
    <SkillBlock
      isAdded={isAdded}
      skill={skill}
      onAddSkill={
        onAddSkill ||
        (async () => {
          /* do nothing */
        })
      }
      onRemoveSkill={
        onRemoveSkill ||
        (async () => {
          /* do nothing */
        })
      }
    />,
  );
}

describe("Skill Results Tests", () => {
  it("should have no accessibility errors", async () => {
    const { container } = renderSkillResults("Results");

    await axeTest(container);
  });

  test("should display the correct title", async () => {
    const title = "Results";
    renderSkillResults(title);

    const element = screen.getByText(`${title}`);
    expect(element).toBeTruthy();
  });

  test("should open and close the skill block correctly", async () => {
    const isAdded = false;
    const skill = skills[0];
    const skillDescription = skill.description?.en;
    renderSkillBlock(isAdded, skill);

    const button = screen.getByText("See definition");
    fireEvent.click(button); // Open skill block to view skill description
    expect(screen.getByText("Hide definition")).toBeTruthy();
    expect(screen.queryByText(`${skillDescription}`)).toBeTruthy();
    fireEvent.click(button); // Close skill block to hide skill description
    expect(screen.getByText("See definition")).toBeTruthy();
    expect(screen.queryByText(`${skillDescription}`)).toBeNull();
  });

  test("should handle adding skill correctly", async () => {
    const isAdded = false;
    const skill = skills[0];
    const onAddSkill = jest.fn();
    renderSkillBlock(isAdded, skill, onAddSkill);

    const button = screen.getByText("Add skill");
    fireEvent.click(button); // Click add skill button
    expect(onAddSkill).toHaveBeenCalledTimes(1);
  });

  test("should handle removing skill correctly", async () => {
    const isAdded = true;
    const skill = skills[0];
    const onRemoveSkill = jest.fn();
    renderSkillBlock(
      isAdded,
      skill,
      async () => {
        /* do nothing */
      },
      onRemoveSkill,
    );

    const button = screen.getByText("Remove skill");
    fireEvent.click(button); // Click remove skill button
    expect(onRemoveSkill).toHaveBeenCalledTimes(1);
  });
});
