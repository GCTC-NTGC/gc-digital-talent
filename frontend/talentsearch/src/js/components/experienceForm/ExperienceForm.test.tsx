/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { fakeSkills } from "@common/fakeData";
import { act } from "react-dom/test-utils";
import fakeExperiences from "@common/fakeData/fakeExperiences";
import { axeTest, render } from "@common/helpers/testUtils";
import { ExperienceForm, ExperienceFormProps } from "./ExperienceForm";
import type { ExperienceQueryData, ExperienceType } from "./types";

const mockUserId = "user-id";
const mockSkills = fakeSkills(50);
const mockExperiences = fakeExperiences(5);
const mockCallback = jest.fn();

const renderExperienceForm = (props: ExperienceFormProps) =>
  render(<ExperienceForm {...props} />);

describe("ExperienceForm", () => {
  jest.setTimeout(10000); // TODO: remove in #4755
  it("award type should have no accessibility errors", async () => {
    const { container } = renderExperienceForm({
      userId: mockUserId,
      experienceType: "award",
      onUpdateExperience: mockCallback,
      deleteExperience: mockCallback,
      skills: mockSkills,
    });

    await axeTest(container);
  });

  it("community type should have no accessibility errors", async () => {
    const { container } = renderExperienceForm({
      userId: mockUserId,
      experienceType: "community",
      onUpdateExperience: mockCallback,
      deleteExperience: mockCallback,
      skills: mockSkills,
    });

    await axeTest(container);
  });

  it("education type should have no accessibility errors", async () => {
    const { container } = renderExperienceForm({
      userId: mockUserId,
      experienceType: "education",
      onUpdateExperience: mockCallback,
      deleteExperience: mockCallback,
      skills: mockSkills,
    });

    await axeTest(container);
  });

  it("personal type should have no accessibility errors", async () => {
    const { container } = renderExperienceForm({
      userId: mockUserId,
      experienceType: "personal",
      onUpdateExperience: mockCallback,
      deleteExperience: mockCallback,
      skills: mockSkills,
    });

    await axeTest(container);
  });

  it("work type should have no accessibility errors", async () => {
    const { container } = renderExperienceForm({
      userId: mockUserId,
      experienceType: "work",
      onUpdateExperience: mockCallback,
      deleteExperience: mockCallback,
      skills: mockSkills,
    });

    await axeTest(container);
  });

  it("should render award fields", async () => {
    const mockSave = jest.fn();
    const mockDelete = jest.fn();
    await act(async () => {
      renderExperienceForm({
        userId: mockUserId,
        experienceType: "award",
        onUpdateExperience: mockSave,
        deleteExperience: mockDelete,
        skills: mockSkills,
      });
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

  it("should render community fields", async () => {
    const mockSave = jest.fn();
    const mockDelete = jest.fn();
    await act(async () => {
      renderExperienceForm({
        userId: mockUserId,
        experienceType: "community",
        onUpdateExperience: mockSave,
        deleteExperience: mockDelete,
        skills: mockSkills,
      });
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

  it("should render education fields", async () => {
    const mockSave = jest.fn();
    const mockDelete = jest.fn();
    await act(async () => {
      renderExperienceForm({
        userId: mockUserId,
        experienceType: "education",
        onUpdateExperience: mockSave,
        deleteExperience: mockDelete,
        skills: mockSkills,
      });
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

  it("should render personal fields", async () => {
    const mockSave = jest.fn();
    const mockDelete = jest.fn();
    await act(async () => {
      renderExperienceForm({
        userId: mockUserId,
        experienceType: "personal",
        onUpdateExperience: mockSave,
        deleteExperience: mockDelete,
        skills: mockSkills,
      });
    });

    expect(
      screen.getByRole("textbox", { name: /short title/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: /experience description/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: /disclaimer/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: /current experience/i }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText("Start Date")).toBeInTheDocument();
    expect(screen.getByLabelText("End Date")).toBeInTheDocument();
  });

  it("should render work fields", async () => {
    const mockSave = jest.fn();
    const mockDelete = jest.fn();
    await act(async () => {
      renderExperienceForm({
        userId: mockUserId,
        experienceType: "work",
        onUpdateExperience: mockSave,
        deleteExperience: mockDelete,
        skills: mockSkills,
      });
    });

    expect(
      screen.getByRole("textbox", { name: /my role/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: /organization/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /team/i })).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: /current role/i }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText("Start Date")).toBeInTheDocument();
    expect(screen.getByLabelText("End Date")).toBeInTheDocument();
  });

  it("should render work fields", async () => {
    const mockSave = jest.fn();
    const mockDelete = jest.fn();
    await act(async () => {
      renderExperienceForm({
        userId: mockUserId,
        experienceType: "work", // Type of form shouldn't matter here
        onUpdateExperience: mockSave,
        deleteExperience: mockDelete,
        skills: mockSkills,
      });
    });

    expect(
      screen.getByRole("heading", { name: /skills displayed/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: /skills in detail/i }),
    ).toBeInTheDocument();
  });

  it("should render additional information", async () => {
    const mockSave = jest.fn();
    const mockDelete = jest.fn();
    await act(async () => {
      renderExperienceForm({
        userId: mockUserId,
        experienceType: "work", // Type of form shouldn't matter here
        onUpdateExperience: mockSave,
        deleteExperience: mockDelete,
        skills: mockSkills,
      });
    });

    expect(screen.getByRole("textbox", { name: /additional information/i }));
  });

  it("should not submit award with empty fields", async () => {
    const mockSave = jest.fn();
    const mockDelete = jest.fn();
    await act(async () => {
      renderExperienceForm({
        userId: mockUserId,
        experienceType: "award",
        onUpdateExperience: mockSave,
        deleteExperience: mockDelete,
        skills: mockSkills,
      });
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

    await act(async () => {
      renderExperienceForm({
        userId: mockUserId,
        experienceType,
        onUpdateExperience: mockSave,
        deleteExperience: mockDelete,
        skills: mockSkills,
        experience: experience as ExperienceQueryData,
      });
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
    await act(async () => {
      renderExperienceForm({
        userId: mockUserId,
        experienceType: "award",
        onUpdateExperience: mockSave,
        deleteExperience: mockDelete,
        skills: mockSkills,
      });
    });

    const skillResults = screen.getAllByRole("button", {
      name: /add this skill/i,
    });
    fireEvent.click(skillResults[0]);
    expect(
      await screen.findByRole("textbox", { name: /skill in detail/i }),
    ).toBeInTheDocument();
  });
});

it("delete should not render when edit is false", async () => {
  const mockSave = jest.fn();
  const mockDelete = jest.fn(() => Promise.resolve());
  await act(async () => {
    renderExperienceForm({
      userId: mockUserId,
      experienceType: "award",
      onUpdateExperience: mockSave,
      deleteExperience: mockDelete,
      skills: mockSkills,
      edit: false,
    });
  });

  expect(screen.queryByText("Delete experience from My Profile")).toBeFalsy();
});

it("delete should render when edit is true and be called properly", async () => {
  const mockSave = jest.fn();
  const mockDelete = jest.fn(() => Promise.resolve());
  await act(async () => {
    renderExperienceForm({
      userId: mockUserId,
      experienceType: "award",
      onUpdateExperience: mockSave,
      deleteExperience: mockDelete,
      skills: mockSkills,
      edit: true,
    });
  });

  // get and open Dialog Component
  const deleteButton = screen.getByText("Delete experience from My Profile");
  expect(deleteButton).toBeTruthy();
  fireEvent.click(deleteButton);

  // get and click on Delete in Dialog
  const deleteSubmit = screen.getByText("Delete");
  expect(deleteSubmit).toBeTruthy();
  fireEvent.click(deleteSubmit);
  await waitFor(() => {
    expect(mockDelete).toHaveBeenCalled();
  });
});
