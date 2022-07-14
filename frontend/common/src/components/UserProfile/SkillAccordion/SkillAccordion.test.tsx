/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import React from "react";
import {
  createIntl,
  createIntlCache,
  IntlProvider,
  MessageFormatElement,
} from "react-intl";
import { fakeSkills } from "../../../fakeData";
import { generators as experienceGenerator } from "../../../fakeData/fakeExperiences";

import { getDateRange } from "../../../helpers/dateUtils";
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

describe("SkillAccordion tests", () => {
  // https://formatjs.io/docs/react-intl/api/#createintl
  const cache = createIntlCache();
  const intl = createIntl(
    {
      locale: "en-CA",
      messages: {},
    },
    cache,
  );

  test("It renders Skill Accordion without any issues", () => {
    renderSkillAccordion(testSkill);
    const accordion = screen.getByTestId("skill");
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

  test("It renders proper context and detail when an award experience is provided", () => {
    const experience = experienceGenerator.awardExperiences()[0];
    testSkill.experiences = [experience];
    renderSkillAccordion(testSkill);
    const context = screen.getByText("1 Experience");
    const detail = screen.getByTestId("detail");
    expect(context).not.toBeNull();
    expect(detail).not.toBeNull();
  });
  test("It renders proper context and detail when a work experience is provided", () => {
    const experience = experienceGenerator.workExperiences()[0];

    testSkill.experiences = [experience];
    const dateRange = getDateRange({
      endDate: experience.endDate,
      startDate: experience.startDate,
      intl,
      locale: "en",
    });
    renderSkillAccordion(testSkill);
    const context = screen.getByText("1 Experience");
    const detail = screen.getByTestId("detail");
    expect(context).not.toBeNull();
    expect(detail).not.toBeNull();
    expect(detail.innerHTML).toContain(experience.details);
    expect(detail.innerHTML).toContain(experience.division);
    expect(detail.innerHTML).toContain(dateRange);
    expect(detail.innerHTML).toContain(experience.organization);
    expect(detail.innerHTML).toContain(experience.role);
  });

  test("It renders proper context and detail when a community experience is provided", () => {
    const experience = experienceGenerator.communityExperiences()[0];
    testSkill.experiences = [experience];
    renderSkillAccordion(testSkill);
    const context = screen.getByText("1 Experience");
    const detail = screen.getByTestId("detail");
    expect(context).not.toBeNull();
    expect(detail).not.toBeNull();
    expect(detail.innerHTML).toContain(experience.details);
    expect(detail.innerHTML).toContain(experience.organization);
    expect(detail.innerHTML).toContain(experience.project);
    expect(detail.innerHTML).toContain(experience.organization);
    expect(detail.innerHTML).toContain(experience.title);
  });

  test("It renders proper context and detail when a education experience is provided", () => {
    const experience = experienceGenerator.educationExperiences()[0];
    testSkill.experiences = [experience];
    const dateRange = getDateRange({
      endDate: experience.endDate,
      startDate: experience.startDate,
      intl,
      locale: "en",
    });
    renderSkillAccordion(testSkill);
    const context = screen.getByText("1 Experience");
    const detail = screen.getByTestId("detail");
    expect(context).not.toBeNull();
    expect(detail).not.toBeNull();
    expect(detail.innerHTML).toContain(experience.details);
    expect(detail.innerHTML).toContain(experience.institution);
    expect(detail.innerHTML).toContain(experience.areaOfStudy);
    expect(detail.innerHTML).toContain(experience.thesisTitle);
    expect(detail.innerHTML).toContain(dateRange);
  });

  test("It renders proper context and detail when a personal experience is provided", () => {
    const experience = experienceGenerator.personalExperiences()[0];
    testSkill.experiences = [experience];
    const dateRange = getDateRange({
      endDate: experience.endDate,
      startDate: experience.startDate,
      intl,
      locale: "en",
    });
    renderSkillAccordion(testSkill);
    const context = screen.getByText("1 Experience");
    const detail = screen.getByTestId("detail");
    expect(context).not.toBeNull();
    expect(detail).not.toBeNull();
    expect(detail.innerHTML).toContain(experience.details);
    expect(detail.innerHTML).toContain(experience.description);
    expect(detail.innerHTML).toContain(dateRange);
    expect(detail.innerHTML).toContain(experience.title);
  });

  test("It renders proper context and detail when more than one experiences provided", () => {
    const experience1 = experienceGenerator.workExperiences()[0];
    const experience2 = experienceGenerator.educationExperiences()[0];

    testSkill.experiences = [experience1, experience2];
    renderSkillAccordion(testSkill);
    const accordion = screen.getByText("2 Experiences");
    const detail = screen.getByTestId("detail");
    expect(detail).not.toBeNull();
    expect(detail.innerHTML).toContain(experience1.details);
    expect(detail.innerHTML).toContain(experience2.details);

    expect(accordion).not.toBeNull();
  });
});
