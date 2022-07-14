/**
 * @jest-environment jsdom
 */
import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import { Scalars, Skill } from "@common/api/generated";
import { fakeSkills } from "@common/fakeData";
import { axeTest, render } from "@common/helpers/testUtils";
import AddedSkills from ".";

function renderContainer(
  skills: Skill[],
  handleRemoveSkill: (id: Scalars["ID"]) => void,
) {
  return render(
    <AddedSkills skills={skills} onRemoveSkill={handleRemoveSkill} />,
  );
}

describe("AddedSkills tests", () => {
  it("should have no accessibility errors", async () => {
    const { container } = renderContainer([], jest.fn());

    await axeTest(container);
  });

  test("If the skills collection is empty then the null message is displayed", () => {
    renderContainer([], jest.fn());
    const message = screen.getByText(
      "There are no skills attached to this experience yet.",
      { exact: false },
    );
    expect(message).toBeTruthy();
  });
  test("If the skills collection is not empty then the matching number of chips should be rendered", async () => {
    const skills = fakeSkills();
    renderContainer(skills, jest.fn());
    const chips = await screen.findAllByRole("listitem");
    expect(chips.length).toEqual(skills.length);
  });
  test("If the skills collection is longer than 6 then _too many skills_ message is displayed", () => {
    const skills = fakeSkills();
    expect(skills.length).toBeGreaterThan(6);
    renderContainer(skills, jest.fn());
    const message = screen.getByText("That's a lot of skills!", {
      exact: false,
    });
    expect(message).toBeTruthy();
  });
  test("The text in a chip should match the skill name", () => {
    const skill = fakeSkills()[0];
    renderContainer([skill], jest.fn());
    const chip = screen.getByRole("listitem");
    expect(chip.textContent).toMatch(skill.name?.en ?? "");
  });
  test("If a chip is dismissed then the callback should be called with the correct ID", () => {
    const onDismiss = jest.fn();
    const skill = fakeSkills()[0];
    renderContainer([skill], onDismiss);
    const chip = screen.getByRole("listitem");
    const dismissButton = chip.querySelector("[role='button']"); // not sure why getByRole doesn't work here
    if (dismissButton) fireEvent.click(dismissButton);
    expect(onDismiss).toHaveBeenCalledWith(skill.id);
  });
});
