/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import React from "react";
import { createIntl, createIntlCache } from "react-intl";

import Accordion from "../../Accordion";
import { fakeSkills } from "../../../fakeData";
import { generators as experienceGenerator } from "../../../fakeData/fakeExperiences";
import { render, screen, axeTest, fireEvent } from "../../../helpers/testUtils";
import { getDateRange } from "../accordionUtils";
import { Maybe, Skill } from "../../../api/generated";
import SkillAccordion from "./SkillAccordion";

const skills = fakeSkills();
const testSkill = skills[0];
function renderSkillAccordion(skill: Skill) {
  return render(
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

  const openAccordion = async (name: Maybe<string>) => {
    fireEvent.click(
      await screen.getByRole("button", {
        name: new RegExp(name || "", "i"),
      }),
    );
  };

  it("should have no accessibility errors", async () => {
    const { container } = renderSkillAccordion(testSkill);

    await axeTest(container);
  });

  it("renders Skill Accordion without any issues", async () => {
    renderSkillAccordion(testSkill);
    expect(
      await screen.getByRole("button", {
        name: new RegExp(testSkill.name.en || "", "i"),
      }),
    ).toBeInTheDocument();
  });

  it("renders proper context and detail when no experience provided", async () => {
    renderSkillAccordion(testSkill);

    await openAccordion(testSkill.name.en);

    expect(
      await screen.getByRole("region", {
        name: new RegExp(testSkill.name.en || "", "i"),
      }),
    ).toContainHTML(
      "<p>You do not have any experiences attached to this skill</p>",
    );
  });

  it("renders proper context and detail when an award experience is provided", async () => {
    const experience = experienceGenerator.awardExperiences()[0];
    testSkill.experiences = [experience];
    renderSkillAccordion(testSkill);

    await openAccordion(testSkill.name.en);

    expect(await screen.getByText("1 Experience")).toBeInTheDocument();
    expect(
      await screen.getByRole("region", {
        name: new RegExp(testSkill.name.en || "", "i"),
      }),
    ).toBeInTheDocument();
  });

  it("renders proper context and detail when a work experience is provided", async () => {
    const experience = experienceGenerator.workExperiences()[0];
    testSkill.experiences = [experience];
    const dateRange = getDateRange({
      endDate: experience.endDate,
      startDate: experience.startDate,
      intl,
    });
    renderSkillAccordion(testSkill);
    await openAccordion(testSkill.name.en);

    expect(await screen.getByText("1 Experience")).toBeInTheDocument();

    const detail = await screen.getByRole("region", {
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

  it("renders proper context and detail when a community experience is provided", async () => {
    const experience = experienceGenerator.communityExperiences()[0];
    testSkill.experiences = [experience];
    renderSkillAccordion(testSkill);

    await openAccordion(testSkill.name.en);

    expect(await screen.getByText("1 Experience")).toBeInTheDocument();

    const detail = await screen.getByRole("region", {
      name: new RegExp(testSkill.name.en || "", "i"),
    });

    expect(detail).toBeInTheDocument();
    expect(detail).toHaveTextContent(experience.details || "");
    expect(detail).toHaveTextContent(experience.organization || "");
    expect(detail).toHaveTextContent(experience.project || "");
    expect(detail).toHaveTextContent(experience.organization || "");
    expect(detail).toHaveTextContent(experience.title || "");
  });

  it("renders proper context and detail when a education experience is provided", async () => {
    const experience = experienceGenerator.educationExperiences()[0];
    testSkill.experiences = [experience];
    const dateRange = getDateRange({
      endDate: experience.endDate,
      startDate: experience.startDate,
      intl,
    });
    renderSkillAccordion(testSkill);

    await openAccordion(testSkill.name.en);

    expect(await screen.getByText("1 Experience")).toBeInTheDocument();

    const detail = await screen.getByRole("region", {
      name: new RegExp(testSkill.name.en || "", "i"),
    });

    expect(detail).toBeInTheDocument();
    expect(detail).toHaveTextContent(experience.details || "");
    expect(detail).toHaveTextContent(experience.institution || "");
    expect(detail).toHaveTextContent(experience.areaOfStudy || "");
    expect(detail).toHaveTextContent(experience.thesisTitle || "");
    expect(detail).toHaveTextContent(`${dateRange}`.replace(/ {3}/g, " "));
  });

  it("renders proper context and detail when a personal experience is provided", async () => {
    const experience = experienceGenerator.personalExperiences()[0];
    testSkill.experiences = [experience];
    const dateRange = getDateRange({
      endDate: experience.endDate,
      startDate: experience.startDate,
      intl,
    });
    renderSkillAccordion(testSkill);

    await openAccordion(testSkill.name.en);

    expect(await screen.getByText("1 Experience")).toBeInTheDocument();

    const detail = await screen.getByRole("region", {
      name: new RegExp(testSkill.name.en || "", "i"),
    });

    expect(detail).toBeInTheDocument();
    expect(detail).toHaveTextContent(experience.details || "");
    expect(detail).toHaveTextContent(experience.description || "");
    expect(detail).toHaveTextContent(dateRange);
    expect(detail).toHaveTextContent(experience.title || "");
  });

  it("renders proper context and detail when more than one experiences provided", async () => {
    const experience1 = experienceGenerator.workExperiences()[0];
    const experience2 = experienceGenerator.educationExperiences(2)[1];

    testSkill.experiences = [experience1, experience2];
    renderSkillAccordion(testSkill);

    await openAccordion(testSkill.name.en);

    expect(await screen.getByText("2 Experiences")).toBeInTheDocument();

    const detail = await screen.getByRole("region", {
      name: new RegExp(testSkill.name.en || "", "i"),
    });

    expect(detail).toBeInTheDocument();
    expect(detail).toHaveTextContent(experience1.details || "");
    expect(detail).toHaveTextContent(experience2.details || "");
  });
});
