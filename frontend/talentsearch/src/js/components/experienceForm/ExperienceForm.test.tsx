/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { screen, fireEvent, waitFor, within } from "@testing-library/react";
import React from "react";
import { fakeSkills } from "@common/fakeData";
import { act } from "react-dom/test-utils";
import fakeExperiences from "@common/fakeData/fakeExperiences";
import { render } from "../../tests/testUtils";
import { ExperienceForm, ExperienceFormProps } from "./ExperienceForm";
import type { ExperienceQueryData, ExperienceType } from "./types";

const mockSkills = fakeSkills(50);
const mockExperiences = fakeExperiences(5);

const renderExperienceForm = (props: ExperienceFormProps) =>
  render(<ExperienceForm {...props} />);

describe("ExperienceForm", () => {
  it("should render award fields", () => {
    const mockSave = jest.fn();
    const mockDelete = jest.fn();
    renderExperienceForm({
      experienceType: "award",
      onUpdateExperience: mockSave,
      deleteExperience: mockDelete,
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
    const mockDelete = jest.fn();
    renderExperienceForm({
      experienceType: "community",
      onUpdateExperience: mockSave,
      deleteExperience: mockDelete,
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
    const mockDelete = jest.fn();
    renderExperienceForm({
      experienceType: "education",
      onUpdateExperience: mockSave,
      deleteExperience: mockDelete,
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
    const mockDelete = jest.fn();
    renderExperienceForm({
      experienceType: "personal",
      onUpdateExperience: mockSave,
      deleteExperience: mockDelete,
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
    const mockDelete = jest.fn();
    renderExperienceForm({
      experienceType: "work",
      onUpdateExperience: mockSave,
      deleteExperience: mockDelete,
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
    const mockDelete = jest.fn();
    renderExperienceForm({
      experienceType: "work", // Type of form shouldn't matter here
      onUpdateExperience: mockSave,
      deleteExperience: mockDelete,
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
    const mockDelete = jest.fn();
    renderExperienceForm({
      experienceType: "work", // Type of form shouldn't matter here
      onUpdateExperience: mockSave,
      deleteExperience: mockDelete,
      skills: mockSkills,
    });

    expect(screen.getByRole("textbox", { name: /additional information/i }));
  });

  it("should not submit award with empty fields", async () => {
    const mockSave = jest.fn();
    const mockDelete = jest.fn();
    renderExperienceForm({
      experienceType: "award",
      onUpdateExperience: mockSave,
      deleteExperience: mockDelete,
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
    const mockDelete = jest.fn();
    const experience = mockExperiences[0];
    let experienceType: ExperienceType = "award";
    // eslint-disable-next-line no-underscore-dangle
    if (experience.__typename) {
      // eslint-disable-next-line no-underscore-dangle
      experienceType = experience.__typename
        ?.replace("Experience", "")
        .toLowerCase() as ExperienceType;
    }

    renderExperienceForm({
      experienceType,
      onUpdateExperience: mockSave,
      deleteExperience: mockDelete,
      skills: mockSkills,
      experience: experience as ExperienceQueryData,
    });

    act(() => {
      fireEvent.submit(screen.getByRole("button", { name: /save/i }));
    });

    await waitFor(() => {
      expect(mockSave).toHaveBeenCalled();
    });
  });

  it("should add skill", async () => {
    const mockSave = jest.fn();
    const mockDelete = jest.fn();
    renderExperienceForm({
      experienceType: "award",
      onUpdateExperience: mockSave,
      deleteExperience: mockDelete,
      skills: mockSkills,
    });

    const mainstreamSkills = screen.getByRole("tab", {
      name: /mainstream skills/i,
    });
    expect(mainstreamSkills).toBeInTheDocument();

    fireEvent.click(mainstreamSkills);
    const skillChecklist = await screen.getAllByTestId("skillChecklist");
    const checklistParent = skillChecklist[0].parentElement;
    expect(checklistParent).toHaveStyle("display:block;");

    if (checklistParent) {
      const checkboxes = await within(checklistParent).queryAllByRole(
        "checkbox",
      );
      if (checkboxes.length) {
        const checkbox = checkboxes[0] as HTMLInputElement;
        fireEvent.click(checkboxes[0]);
        await expect(checkbox.checked).toEqual(true);

        const skillResults = screen.getAllByRole("button", { name: /save/i });
        fireEvent.click(skillResults[0]);
        expect(
          await screen.findByRole("textbox", { name: /skill in details/i }),
        ).toBeInTheDocument();
      }
    }
  });
});
