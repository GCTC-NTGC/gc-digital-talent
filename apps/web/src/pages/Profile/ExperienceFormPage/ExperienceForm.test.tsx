/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { Provider as GraphqlProvider } from "urql";
import { screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { never, fromValue } from "wonka";

import { fakeSkills } from "@gc-digital-talent/fake-data";
import {
  axeTest,
  renderWithProviders,
  updateDate,
} from "@gc-digital-talent/jest-helpers";
import {
  AwardedScope,
  AwardedTo,
  makeFragmentData,
} from "@gc-digital-talent/graphql";

import type { ExperienceType } from "~/types/experience";

import {
  ExperienceForm,
  ExperienceFormProps,
  ExperienceFormSkill_Fragment,
} from "./ExperienceFormPage";

const mockUserId = "user-id";
const mockSkills = fakeSkills(50);
const mockClient = {
  executeMutation: jest.fn(() => never),
  executeQuery: jest.fn(() =>
    fromValue({
      data: {
        awardedTo: [{ value: AwardedTo.Me, label: { en: "Me", fr: "Me" } }],
        awardedScopes: [
          { value: AwardedScope.Local, label: { en: "Local", fr: "Local" } },
        ],
      },
    }),
  ),
};

const skillFragments = mockSkills.map((skill) =>
  makeFragmentData(skill, ExperienceFormSkill_Fragment),
);

const renderExperienceForm = (props: ExperienceFormProps) =>
  renderWithProviders(
    <GraphqlProvider value={mockClient}>
      <ExperienceForm {...props} />
    </GraphqlProvider>,
  );

describe("ExperienceForm", () => {
  const user = userEvent.setup();

  it("award type should have no accessibility errors", async () => {
    const { container } = renderExperienceForm({
      userId: mockUserId,
      experienceType: "award",
      skillsQuery: skillFragments,
    });
    await axeTest(container);
  });

  it("community type should have no accessibility errors", async () => {
    const { container } = renderExperienceForm({
      userId: mockUserId,
      experienceType: "community",
      skillsQuery: skillFragments,
    });
    await axeTest(container);
  });

  it("education type should have no accessibility errors", async () => {
    const { container } = renderExperienceForm({
      userId: mockUserId,
      experienceType: "education",
      skillsQuery: skillFragments,
    });
    await axeTest(container);
  });

  it("personal type should have no accessibility errors", async () => {
    const { container } = renderExperienceForm({
      userId: mockUserId,
      experienceType: "personal",
      skillsQuery: skillFragments,
    });
    await axeTest(container);
  });

  it("work type should have no accessibility errors", async () => {
    const { container } = renderExperienceForm({
      userId: mockUserId,
      experienceType: "work",
      skillsQuery: skillFragments,
    });
    await axeTest(container);
  });

  it("should render award fields", async () => {
    renderExperienceForm({
      userId: mockUserId,
      experienceType: "award",
      skillsQuery: skillFragments,
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
      skillsQuery: skillFragments,
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
      skillsQuery: skillFragments,
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
      skillsQuery: skillFragments,
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
      skillsQuery: skillFragments,
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
      skillsQuery: skillFragments,
    });

    expect(
      screen.getByRole("heading", { name: /highlight additional details/i }),
    ).toBeInTheDocument();
  });

  it("should render link featured skills", async () => {
    renderExperienceForm({
      userId: mockUserId,
      experienceType: "work", // Type of form shouldn't matter here
      skillsQuery: skillFragments,
    });

    expect(
      screen.getByRole("heading", { name: /link featured skills/i }),
    ).toBeInTheDocument();
  });

  it("should not submit award with empty fields", async () => {
    renderExperienceForm({
      userId: mockUserId,
      experienceType: "award",
      skillsQuery: skillFragments,
    });

    expect(await screen.findByText(/save and return/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /save and return/i }));

    expect(mockClient.executeMutation).not.toHaveBeenCalled();
  });

  it("should submit with required fields", async () => {
    const experienceType: ExperienceType = "award";
    renderExperienceForm({
      userId: mockUserId,
      experienceType,
      skillsQuery: skillFragments,
    });

    expect(await screen.findByText(/save and return/i)).toBeInTheDocument();

    const awardTitle = screen.getByRole("textbox", { name: /award title/i });
    await user.type(awardTitle, "AwardTitle");
    expect(awardTitle).toHaveValue("AwardTitle");

    const awardedTo = screen.getByRole("combobox", { name: /awarded to/i });
    await user.selectOptions(awardedTo, "ME");
    expect(awardedTo).toHaveValue("ME");

    const organization = screen.getByRole("textbox", {
      name: /issuing organization/i,
    });
    await user.clear(organization);
    expect(organization).toHaveValue("");
    await user.type(organization, "Org");
    expect(organization).toHaveValue("Org");

    const dateAwarded = screen.getByRole("group", { name: /date awarded/i });
    await updateDate(dateAwarded, {
      year: "1111",
      month: "11",
    });
    expect(screen.getByRole("spinbutton", { name: /year/i })).toHaveValue(1111);
    expect(screen.getByRole("combobox", { name: /month/i })).toHaveValue("11");

    const scope = screen.getByRole("combobox", { name: /award scope/i });
    await user.selectOptions(scope, "LOCAL");
    expect(scope).toHaveValue("LOCAL");

    const details = screen.getByRole("textbox", {
      name: /additional details/i,
    });
    await user.clear(details);
    await user.type(details, "details");
    expect(details).toHaveValue("details");

    await user.click(screen.getByRole("button", { name: /save and return/i }));

    await waitFor(() => expect(screen.queryAllByRole("alert")).toHaveLength(0));
  });

  // TODO: Commenting out test below until the <SkillBrowserDialog /> error is resolved... When skill dialog is opened this console.error() appears -> "Warning: Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?"
  // it("should add skill", async () => {
  //   renderExperienceForm({
  //     userId: mockUserId,
  //     experienceType: "award",
  //     skillsQuery: skillFragments,
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
      skillsQuery: skillFragments,
      edit: false,
    });
    expect(screen.queryByText("Delete this experience")).toBeFalsy();
  });

  it("delete should render when edit is true and be called properly", async () => {
    renderExperienceForm({
      userId: mockUserId,
      experienceType: "award",
      skillsQuery: skillFragments,
      edit: true,
    });
    // get and open Dialog Component
    const deleteButton = screen.getByRole("button", {
      name: /delete this experience/i,
    });
    expect(deleteButton).toBeTruthy();

    await user.click(deleteButton);
    // get and click on Delete in Dialog
    const deleteSubmit = screen.getByRole("button", { name: /delete/i });
    expect(deleteSubmit).toBeTruthy();
    await user.click(deleteSubmit);

    expect(mockClient.executeMutation).toHaveBeenCalled();
  });
});
