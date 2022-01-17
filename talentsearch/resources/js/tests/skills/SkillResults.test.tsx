/**
 * @jest-environment jsdom
 */

import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import { fakeSkills } from "@common/fakeData";
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

function renderSkillBlock(isAdded: boolean) {
  return render(
    <SkillBlock
      isAdded={isAdded}
      skill={skills[0]}
      handleAddSkill={async () => {}}
      handleRemoveSkill={async () => {}}
    />,
  );
}

describe("Skill Results Tests", () => {
  test("should display the correct title", async () => {
    const title = "Results";
    renderSkillResults(title);
    const element = screen.findByText(`${title} ${title.length}`);
    expect(element).toBeTruthy();
  });
  test("should open and close the skill block correctly", async () => {
    renderSkillBlock(false);
    const button = screen.getByText("See definition");
    fireEvent.click(button);
    expect(await screen.findByText("Hide definition")).toBeTruthy();
    fireEvent.click(button);
    expect(await screen.findByText("See definition")).toBeTruthy();
  });
  test("should close the skill block correctly", async () => {
    const isOpen = true;
    renderSkillBlock(isOpen);
    const hideDefinition = screen.findByText("Hide definition");
    expect(hideDefinition).toBeTruthy();
  });
  test("should display correct text when adding and removing skill", async () => {
    renderSkillBlock(false);
    const button = screen.getByText("Add skill");
    fireEvent.click(button);
    expect(screen.findByText("Remove skill")).toBeTruthy();
    fireEvent.click(button);
    expect(screen.findByText("Add skill")).toBeTruthy();
  });
});
