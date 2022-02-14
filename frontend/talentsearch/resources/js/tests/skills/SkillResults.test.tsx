/**
 * @jest-environment jsdom
 */

import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import { fakeSkills } from "@common/fakeData";
import { Skill } from "../../api/generated";
import { render } from "../testUtils";
import SkillResults, { SkillBlock } from "../../components/skills/SkillResults";

const skills = fakeSkills();

function renderSkillResults(title: string) {
  return render(
    <SkillResults
      addedSkills={[skills[0], skills[1]]}
      skills={skills}
      title={title}
      handleAddSkill={async () => {}}
      handleRemoveSkill={async () => {}}
    />,
  );
}

function renderSkillBlock(
  isAdded: boolean,
  skill: Skill,
  handleAddSkill?: () => Promise<void>,
  handleRemoveSkill?: () => Promise<void>,
) {
  return render(
    <SkillBlock
      isAdded={isAdded}
      skill={skill}
      handleAddSkill={handleAddSkill || (async () => {})}
      handleRemoveSkill={handleRemoveSkill || (async () => {})}
    />,
  );
}

describe("Skill Results Tests", () => {
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
    const handleAddSkill = jest.fn();
    renderSkillBlock(isAdded, skill, handleAddSkill);

    const button = screen.getByText("Add skill");
    fireEvent.click(button); // Click add skill button
    expect(handleAddSkill).toHaveBeenCalledTimes(1);
  });

  test("should handle removing skill correctly", async () => {
    const isAdded = true;
    const skill = skills[0];
    const handleRemoveSkill = jest.fn();
    renderSkillBlock(isAdded, skill, async () => {}, handleRemoveSkill);

    const button = screen.getByText("Remove skill");
    fireEvent.click(button); // Click remove skill button
    expect(handleRemoveSkill).toHaveBeenCalledTimes(1);
  });
});
