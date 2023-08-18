/**
 * @jest-environment jsdom
 */
import React from "react";
import "@testing-library/jest-dom";
import { Provider as GraphqlProvider } from "urql";
import { screen, fireEvent, act, waitFor } from "@testing-library/react";

import { fakeSkills } from "@gc-digital-talent/fake-data";
import {
  axeTest,
  renderWithProviders,
  updateDate,
} from "@gc-digital-talent/jest-helpers";

import type { ExperienceType } from "~/types/experience";

import { ExperienceForm, ExperienceFormProps } from "./ExperienceFormPage";

const mockUserId = "user-id";
const mockSkills = fakeSkills(50);
const mockClient = {
  executeMutation: jest.fn(),
  // See: https://github.com/FormidableLabs/urql/discussions/2057#discussioncomment-1568874
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

const renderExperienceForm = (props: ExperienceFormProps) =>
  renderWithProviders(
    <GraphqlProvider value={mockClient}>
      <ExperienceForm {...props} />
    </GraphqlProvider>,
  );

describe("ExperienceForm", () => {
  jest.setTimeout(30000); // TODO: remove in #4755
  it("award type should have no accessibility errors", async () => {
    const { container } = renderExperienceForm({
      userId: mockUserId,
      experienceType: "award",
      skills: mockSkills,
    });
    await axeTest(container);
  });
  it("community type should have no accessibility errors", async () => {
    const { container } = renderExperienceForm({
      userId: mockUserId,
      experienceType: "community",
      skills: mockSkills,
    });
    await axeTest(container);
  });
  it("education type should have no accessibility errors", async () => {
    const { container } = renderExperienceForm({
      userId: mockUserId,
      experienceType: "education",
      skills: mockSkills,
    });
    await axeTest(container);
  });
  it("personal type should have no accessibility errors", async () => {
    const { container } = renderExperienceForm({
      userId: mockUserId,
      experienceType: "personal",
      skills: mockSkills,
    });
    await axeTest(container);
  });
  it("work type should have no accessibility errors", async () => {
    const { container } = renderExperienceForm({
      userId: mockUserId,
      experienceType: "work",
      skills: mockSkills,
    });
    await axeTest(container);
  });
  it("should render award fields", async () => {
    renderExperienceForm({
      userId: mockUserId,
      experienceType: "award",
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
    expect(
      screen.getByRole("group", { name: /date awarded/i }),
    ).toBeInTheDocument();
  });
  it("should render community fields", async () => {
    renderExperienceForm({
      userId: mockUserId,
      experienceType: "community",
      skills: mockSkills,
    });
    expect(
      screen.getByRole("textbox", { name: /my role/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /group/i })).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: /project/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: /start date/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: /end date/i }),
    ).toBeInTheDocument();
  });
  it("should render education fields", async () => {
    renderExperienceForm({
      userId: mockUserId,
      experienceType: "education",
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
    expect(
      screen.getByRole("group", { name: /start date/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: /end date/i }),
    ).toBeInTheDocument();
  });
  it("should render personal fields", async () => {
    renderExperienceForm({
      userId: mockUserId,
      experienceType: "personal",
      skills: mockSkills,
    });
    expect(
      screen.getByRole("textbox", { name: /short title/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: /experience description/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: /disclaimer/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: /current experience/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: /start date/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: /end date/i }),
    ).toBeInTheDocument();
  });
  it("should render work fields", async () => {
    renderExperienceForm({
      userId: mockUserId,
      experienceType: "work",
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
      screen.getByRole("group", { name: /current role/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: /start date/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: /end date/i }),
    ).toBeInTheDocument();
  });
  it("should render additional details", async () => {
    renderExperienceForm({
      userId: mockUserId,
      experienceType: "work", // Type of form shouldn't matter here
      skills: mockSkills,
    });

    expect(
      screen.getByRole("heading", { name: /highlight additional details/i }),
    ).toBeInTheDocument();
  });
  it("should render link featured skills", async () => {
    renderExperienceForm({
      userId: mockUserId,
      experienceType: "work", // Type of form shouldn't matter here
      skills: mockSkills,
    });
    expect(
      screen.getByRole("heading", { name: /link featured skills/i }),
    ).toBeInTheDocument();
  });
  it("should not submit award with empty fields", async () => {
    renderExperienceForm({
      userId: mockUserId,
      experienceType: "award",
      skills: mockSkills,
    });
    await act(() => {
      screen.getByRole("button", { name: /save and return/i }).click();
    });
    expect(mockClient.executeMutation).not.toHaveBeenCalled();
  });
  it("should submit with required fields", async () => {
    const experienceType: ExperienceType = "award";
    renderExperienceForm({
      userId: mockUserId,
      experienceType,
      skills: mockSkills,
    });
    const awardTitle = screen.getByRole("textbox", { name: /award title/i });
    fireEvent.change(awardTitle, { target: { value: "AwardTitle" } });
    const dateAwarded = screen.getByRole("group", { name: /date awarded/i });
    updateDate(dateAwarded, {
      year: "1111",
      month: "11",
    });
    const awardedTo = screen.getByRole("combobox", {
      name: /awarded to/i,
    }) as HTMLSelectElement;
    const awardedToOptions = Array.from(
      awardedTo.querySelectorAll("option"),
    ) as HTMLOptionElement[];
    fireEvent.change(awardedTo, {
      target: { value: awardedToOptions[1].value },
    }); // Set to second value after null selection.
    const org = screen.getByRole("textbox", { name: /organization/i });
    fireEvent.change(org, { target: { value: "Org" } });
    const awardScope = screen.getByRole("combobox", {
      name: /award scope/i,
    }) as HTMLSelectElement;
    const awardScopeOptions = Array.from(
      awardScope.querySelectorAll("option"),
    ) as HTMLOptionElement[];
    fireEvent.change(awardScope, {
      target: { value: awardScopeOptions[1].value },
    }); // Set to second value after null selection.
    const additionalDetails = screen.getByRole("textbox", { name: /details/i });
    fireEvent.change(additionalDetails, {
      target: { value: "Additional details" },
    });
    await act(() => {
      fireEvent.submit(
        screen.getByRole("button", { name: /save and return/i }),
      );
    });
    await waitFor(() => {
      expect(mockClient.executeMutation).toHaveBeenCalled();
    });
  });
  // TODO: Commenting out test below until the <SkillDialog /> error is resolved... When skill dialog is opened this console.error() appears -> "Warning: Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?"
  // it("should add skill", async () => {
  //   renderExperienceForm({
  //     userId: mockUserId,
  //     experienceType: "award",
  //     skills: mockSkills,
  //   });

  //   await act(() => {
  //     screen
  //       .getAllByRole("button", {
  //         name: /add a skill/i,
  //       })[0]
  //       .click();
  //   });
  // });
  it("delete should not render when edit is false", async () => {
    renderExperienceForm({
      userId: mockUserId,
      experienceType: "award",
      skills: mockSkills,
      edit: false,
    });
    expect(screen.queryByText("Delete this experience")).toBeFalsy();
  });
  it("delete should render when edit is true and be called properly", async () => {
    renderExperienceForm({
      userId: mockUserId,
      experienceType: "award",
      skills: mockSkills,
      edit: true,
    });
    // get and open Dialog Component
    const deleteButton = screen.getByRole("button", {
      name: /delete this experience/i,
    });
    expect(deleteButton).toBeTruthy();
    await act(() => {
      deleteButton.click();
    });
    // get and click on Delete in Dialog
    const deleteSubmit = screen.getByRole("button", { name: /delete/i });
    expect(deleteSubmit).toBeTruthy();
    await act(() => {
      deleteSubmit.click();
    });
    expect(mockClient.executeMutation).toHaveBeenCalled();
  });
});
