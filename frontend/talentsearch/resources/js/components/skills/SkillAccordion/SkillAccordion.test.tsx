/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import React from "react";
import { IntlProvider, MessageFormatElement } from "react-intl";
import { fakeSkills } from "@common/fakeData";
import generator from "@common/fakeData/fakeExperienceSkills";
import { generators as experienceGenerator } from "@common/fakeData/fakeExperiences";

import { Skill } from "../../../api/generated";
import SkillAccordion from "./SkillAccordion";

const skills = fakeSkills();
const renderWithReactIntl = (
  component: React.ReactNode,
  locale?: "en" | "fr",
  messages?: Record<string, string> | Record<string, MessageFormatElement[]>,
) => {
  return render(
    <IntlProvider locale={locale || "en"} messages={messages}>
      {component}
    </IntlProvider>,
  );
};
const testSkill = skills[0];
function renderSkillAccordion(skill: Skill) {
  return renderWithReactIntl(<SkillAccordion skill={skill} />);
}

describe.only("SkillAccordion tests", () => {
  test("It renders Skill Accordion without any issues", () => {
    renderSkillAccordion(testSkill);
    const accordion = screen.getAllByTestId("skill");
    expect(accordion).not.toBeNull();
  });
  test("It renders proper context and detail when no experience provided", () => {
    renderSkillAccordion(testSkill);
    const accordion = screen.getAllByText("0 Experiences");
    const expectedResult =
      "<p>You do not have any experiences attached to this skill</p>";
    const detail = screen.getAllByTestId("detail");

    expect(accordion).not.toBeNull();
    expect(detail[0].innerHTML).toEqual(expectedResult);
  });
  test("It renders proper context and detail when an experience is provided", () => {
    testSkill.experienceSkills?.push(
      generator.generateExperienceSkill(
        testSkill,
        experienceGenerator.generateAward(),
      ),
    );
    renderSkillAccordion(testSkill);
    const accordion = screen.getAllByText("1 Experience");
    const detail = screen.getAllByTestId("detail");
    expect(accordion).not.toBeNull();
    expect(detail).not.toBeNull();
  });
});
