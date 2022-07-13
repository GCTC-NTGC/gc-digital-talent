/**
 * @jest-environment jsdom
 */
import React from "react";
import { fakeSkillFamilies, fakeSkills } from "../../../fakeData";
import { render, screen, fireEvent } from "../../../../tests/testUtils";
import SkillFamilyPicker from "./SkillFamilyPicker";

const testData = fakeSkillFamilies(5, fakeSkills(10));
const callback = jest.fn();

const renderSkillFamilyPicker = () => {
  return render(
    <SkillFamilyPicker
      skillFamilies={testData}
      onSelectSkillFamily={callback}
      title="Skill groups"
      nullSelectionLabel="All skills"
    />,
  );
};

describe("Skill Family Picker Tests", () => {
  test("should display the skill FamilyPicker div", async () => {
    renderSkillFamilyPicker();
    const element = screen.getByRole("radiogroup");
    expect(element).toBeTruthy();
  });

  test("get correct response after checking one box", async () => {
    renderSkillFamilyPicker();
    fireEvent.click(
      screen.getByLabelText(
        `${testData[1].name.en} (${testData[1].skills?.length})`,
      ),
    );
    expect(callback).toBeCalledWith(testData[1].id);
  });
});
