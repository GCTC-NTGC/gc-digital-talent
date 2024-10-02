/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { createIntl, createIntlCache } from "react-intl";
import { screen, fireEvent } from "@testing-library/react";

import { Accordion } from "@gc-digital-talent/ui";
import { fakeSkills, experienceGenerators } from "@gc-digital-talent/fake-data";
import { renderWithProviders, axeTest } from "@gc-digital-talent/jest-helpers";
import { Maybe } from "@gc-digital-talent/graphql";

import { getDateRange } from "~/utils/dateUtils";
import { InvertedSkillExperience } from "~/utils/skillUtils";

import SkillAccordion from "./SkillAccordion";

const skills = fakeSkills();
const testSkill = skills[0] as InvertedSkillExperience;
function renderSkillAccordion(skill: InvertedSkillExperience) {
  return renderWithProviders(
    <Accordion.Root type="single">
      <SkillAccordion skill={skill} />
    </Accordion.Root>,
  );
}

describe("SkillAccordion", () => {
  // https://formatjs.io/docs/react-intl/api/#createintl
  const cache = createIntlCache();
  const intl = createIntl(
    {
      locale: "en",
      messages: {},
    },
    cache,
  );

  const openAccordion = (name: Maybe<string> | undefined) => {
    fireEvent.click(
      screen.getByRole("button", {
        name: new RegExp(name || "", "i"),
      }),
    );
  };

  it("should have no accessibility errors", async () => {
    const { container } = renderSkillAccordion(testSkill);

    await axeTest(container);
  });

  it("renders Skill Accordion without any issues", () => {
    renderSkillAccordion(testSkill);
    expect(
      screen.getByRole("button", {
        name: new RegExp(testSkill.name.en || "", "i"),
      }),
    ).toBeInTheDocument();
  });

  it("renders proper context and detail when no experience provided", () => {
    renderSkillAccordion(testSkill);

    openAccordion(testSkill.name.en);

    expect(
      screen.getByRole("region", {
        name: new RegExp(testSkill.name.en || "", "i"),
      }),
    ).toContainHTML(
      "<p>You do not have any experiences attached to this skill</p>",
    );
  });

  it("renders proper context and detail when an award experience is provided", () => {
    const experience = experienceGenerators.awardExperiences()[0];
    testSkill.experiences = [experience];
    renderSkillAccordion(testSkill);

    openAccordion(testSkill.name.en);

    expect(screen.getByText("1 experience")).toBeInTheDocument();
    expect(
      screen.getByRole("region", {
        name: new RegExp(testSkill.name.en || "", "i"),
      }),
    ).toBeInTheDocument();
  });

  it("renders proper context and detail when a work experience is provided", () => {
    const experience = experienceGenerators.workExperiences()[0];
    testSkill.experiences = [experience];
    const dateRange = getDateRange({
      endDate: experience.endDate,
      startDate: experience.startDate,
      intl,
    });
    renderSkillAccordion(testSkill);
    openAccordion(testSkill.name.en);

    expect(screen.getByText("1 experience")).toBeInTheDocument();

    const detail = screen.getByRole("region", {
      name: new RegExp(testSkill.name.en || "", "i"),
    });

    expect(detail).toBeInTheDocument();
    expect(detail).toHaveTextContent(new RegExp(experience.details || "", "i"));
    expect(detail).toHaveTextContent(
      new RegExp(experience.division || "", "i"),
    );
    expect(detail).toHaveTextContent(
      new RegExp(`${dateRange}`.replace(/ {3}/g, " ") || "", "i"),
    );
    expect(detail).toHaveTextContent(
      new RegExp(experience.organization || "", "i"),
    );
    expect(detail).toHaveTextContent(new RegExp(experience.role || "", "i"));
  });

  it("renders proper context and detail when a community experience is provided", () => {
    const experience = experienceGenerators.communityExperiences()[0];
    testSkill.experiences = [experience];
    renderSkillAccordion(testSkill);

    openAccordion(testSkill.name.en);

    expect(screen.getByText("1 experience")).toBeInTheDocument();

    const detail = screen.getByRole("region", {
      name: new RegExp(testSkill.name.en || "", "i"),
    });

    expect(detail).toBeInTheDocument();
    expect(detail).toHaveTextContent(experience.details || "");
    expect(detail).toHaveTextContent(experience.organization || "");
    expect(detail).toHaveTextContent(experience.project || "");
    expect(detail).toHaveTextContent(experience.organization || "");
    expect(detail).toHaveTextContent(experience.title || "");
  });

  it("renders proper context and detail when a education experience is provided", () => {
    const experience = experienceGenerators.educationExperiences()[0];
    testSkill.experiences = [experience];
    const dateRange = getDateRange({
      endDate: experience.endDate,
      startDate: experience.startDate,
      intl,
    });
    renderSkillAccordion(testSkill);

    openAccordion(testSkill.name.en);

    expect(screen.getByText("1 experience")).toBeInTheDocument();

    const detail = screen.getByRole("region", {
      name: new RegExp(testSkill.name.en || "", "i"),
    });

    expect(detail).toBeInTheDocument();
    expect(detail).toHaveTextContent(experience.details || "");
    expect(detail).toHaveTextContent(experience.institution || "");
    expect(detail).toHaveTextContent(experience.areaOfStudy || "");
    expect(detail).toHaveTextContent(experience.thesisTitle || "");
    expect(detail).toHaveTextContent(`${dateRange}`.replace(/ {3}/g, " "));
  });

  it("renders proper context and detail when a personal experience is provided", () => {
    const experience = experienceGenerators.personalExperiences()[0];
    testSkill.experiences = [experience];
    const dateRange = getDateRange({
      endDate: experience.endDate,
      startDate: experience.startDate,
      intl,
    });
    renderSkillAccordion(testSkill);

    openAccordion(testSkill.name.en);

    expect(screen.getByText("1 experience")).toBeInTheDocument();

    const detail = screen.getByRole("region", {
      name: new RegExp(testSkill.name.en || "", "i"),
    });

    expect(detail).toBeInTheDocument();
    expect(detail).toHaveTextContent(experience.details || "");
    expect(detail).toHaveTextContent(experience.description || "");
    expect(detail).toHaveTextContent(dateRange);
    expect(detail).toHaveTextContent(experience.title || "");
  });

  it("renders proper context and detail when more than one experiences provided", () => {
    const experience1 = experienceGenerators.workExperiences()[0];
    const experience2 = experienceGenerators.educationExperiences(2)[1];

    testSkill.experiences = [experience1, experience2];
    renderSkillAccordion(testSkill);

    openAccordion(testSkill.name.en);

    expect(screen.getByText("2 experiences")).toBeInTheDocument();

    const detail = screen.getByRole("region", {
      name: new RegExp(testSkill.name.en || "", "i"),
    });

    expect(detail).toBeInTheDocument();
    expect(detail).toHaveTextContent(experience1.details || "");
    expect(detail).toHaveTextContent(experience2.details || "");
  });
});
