/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { fakeSkills } from "@common/fakeData";
import { act } from "react-dom/test-utils";
import fakeExperiences from "@common/fakeData/fakeExperiences";
import { AwardedScope, AwardedTo } from "@common/api/generated";
import { render } from "../../tests/testUtils";
import { ExperienceForm, ExperienceFormProps } from "./ExperienceForm";
import type { ExperienceQueryData, ExperienceType } from "./types";

const mockSkills = fakeSkills(3);
const mockExperiences = fakeExperiences(5);

const renderExperienceForm = (props: ExperienceFormProps) =>
  render(<ExperienceForm {...props} />);

describe("ExperienceForm", () => {
  it("should render award fields", () => {
    const mockSave = jest.fn();
    renderExperienceForm({
      experienceType: "award",
      onUpdateExperience: mockSave,
      skills: mockSkills,
    });

    expect(
      screen.getByRole("textbox", { name: /award title/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: /awarded to/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: /issuing/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: /award scope/i }),
    ).toBeInTheDocument();
    // Note: Date inputs have no role by default
    expect(screen.getByLabelText("Date Awarded")).toBeInTheDocument();
  });

  it("should render community fields", () => {
    const mockSave = jest.fn();
    renderExperienceForm({
      experienceType: "community",
      onUpdateExperience: mockSave,
      skills: mockSkills,
    });

    expect(
      screen.getByRole("textbox", { name: /my role/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /group/i })).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: /project/i }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText("Start Date")).toBeInTheDocument();
    expect(screen.getByLabelText("End Date")).toBeInTheDocument();
  });

  it("should render education fields", () => {
    const mockSave = jest.fn();
    renderExperienceForm({
      experienceType: "education",
      onUpdateExperience: mockSave,
      skills: mockSkills,
    });

    expect(
      screen.getByRole("combobox", { name: /type of education/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: /area of study/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: /institution/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: /status/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: /thesis title/i }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText("Start Date")).toBeInTheDocument();
    expect(screen.getByLabelText("End Date")).toBeInTheDocument();
  });

  it("should render personal fields", () => {
    const mockSave = jest.fn();
    renderExperienceForm({
      experienceType: "personal",
      onUpdateExperience: mockSave,
      skills: mockSkills,
    });

    expect(
      screen.getByRole("textbox", { name: /short title/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: /experience description/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: /i agree/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: /currently active/i }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText("Start Date")).toBeInTheDocument();
    expect(screen.getByLabelText("End Date")).toBeInTheDocument();
  });

  it("should render work fields", () => {
    const mockSave = jest.fn();
    renderExperienceForm({
      experienceType: "work",
      onUpdateExperience: mockSave,
      skills: mockSkills,
    });

    expect(
      screen.getByRole("textbox", { name: /my role/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: /organization/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /team/i })).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: /currently active/i }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText("Start Date")).toBeInTheDocument();
    expect(screen.getByLabelText("End Date")).toBeInTheDocument();
  });

  it("should render work fields", async () => {
    const mockSave = jest.fn();
    renderExperienceForm({
      experienceType: "work", // Type of form shouldn't matter here
      onUpdateExperience: mockSave,
      skills: mockSkills,
    });

    expect(
      screen.getByRole("heading", { name: /skills displayed/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: /skills in detail/i }),
    ).toBeInTheDocument();

    const mainstreamSkills = screen.getByRole("tab", {
      name: /mainstream skills/i,
    });
    expect(mainstreamSkills).toBeInTheDocument();

    fireEvent.click(mainstreamSkills);
    expect(
      await screen.getByTestId("skillChecklist").parentElement,
    ).toHaveStyle("display:block;");
  });

  it("should render additional information", () => {
    const mockSave = jest.fn();
    renderExperienceForm({
      experienceType: "work", // Type of form shouldn't matter here
      onUpdateExperience: mockSave,
      skills: mockSkills,
    });

    expect(screen.getByRole("textbox", { name: /additional information/i }));
  });

  it("should not submit award with empty fields", async () => {
    const mockSave = jest.fn();
    renderExperienceForm({
      experienceType: "award",
      onUpdateExperience: mockSave,
      skills: mockSkills,
    });

    act(() => {
      fireEvent.submit(screen.getByRole("button", { name: /save/i }));
    });

    await waitFor(() => {
      expect(mockSave).not.toHaveBeenCalled();
    });
  });

  it("should submit with required fields", async () => {
    const mockSave = jest.fn();
    // const experience = mockExperiences[0];
    // let experienceType: ExperienceType = "award";
    // // eslint-disable-next-line no-underscore-dangle
    // if (experience.__typename) {
    //   // eslint-disable-next-line no-underscore-dangle
    //   experienceType = experience.__typename
    //     ?.replace("Experience", "")
    //     .toLowerCase() as ExperienceType;
    // }

    renderExperienceForm({
      experienceType: "award",
      onUpdateExperience: mockSave,
      skills: mockSkills,
      experience: {
        title: "Fake Award",
        details: "fake experience",
        issuedBy: "John Doe",
        awardedDate: "2021-05-23",
        awardedTo: AwardedTo.Me,
        awardedScope: AwardedScope.Community,
      } as ExperienceQueryData,
    });

    act(() => {
      fireEvent.submit(screen.getByRole("button", { name: /save/i }));
    });

    await waitFor(() => {
      expect(mockSave).toHaveBeenCalled();
    });
  });
});
