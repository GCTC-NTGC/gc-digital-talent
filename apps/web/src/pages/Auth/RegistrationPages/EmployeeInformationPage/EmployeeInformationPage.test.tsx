/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { Provider as GraphqlProvider } from "urql";
import { pipe, fromValue, delay } from "wonka";

import {
  fakeClassifications,
  fakeDepartments,
} from "@gc-digital-talent/fake-data";
import { axeTest, renderWithProviders } from "@gc-digital-talent/jest-helpers";
import { Language, makeFragmentData } from "@gc-digital-talent/graphql";

import {
  EmployeeInformationForm,
  EmployeeInformationFormProps,
  EmployeeInformation_QueryFragment,
} from "./EmployeeInformationPage";

const mockDepartments = fakeDepartments();
const mockClassifications = fakeClassifications();
const mockSave = jest.fn();

const mockClient = {
  executeQuery: jest.fn(() => pipe(fromValue({}), delay(0))),
};

const mockFragmentData = makeFragmentData(
  {
    departments: mockDepartments,
    classifications: mockClassifications,
    languages: [
      {
        value: Language.En,
        label: {
          en: "English",
          fr: "",
        },
      },
      {
        value: Language.Fr,
        label: {
          en: "French",
          fr: "",
        },
      },
    ],
  },
  EmployeeInformation_QueryFragment,
);

const renderEmployeeInformationForm = ({
  query,
  onSubmit,
}: EmployeeInformationFormProps) =>
  renderWithProviders(
    <GraphqlProvider value={mockClient}>
      <EmployeeInformationForm query={query} onSubmit={onSubmit} />
    </GraphqlProvider>,
  );

describe("Create Account Form tests", () => {
  const user = userEvent.setup();

  it("should have no accessibility errors", async () => {
    const { container } = renderEmployeeInformationForm({
      query: mockFragmentData,
      onSubmit: mockSave,
    });

    await axeTest(container);
  });

  it("should render fields", async () => {
    renderEmployeeInformationForm({
      query: mockFragmentData,
      onSubmit: mockSave,
    });

    expect(
      screen.getByRole("group", {
        name: /employee status/i,
      }),
    ).toBeInTheDocument();

    // Ensure conditional form elements don't exist yet.
    expect(
      screen.queryByRole("group", {
        name: /contract type/i,
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("combobox", {
        name: /home department/i,
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("combobox", {
        name: /group/i,
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("combobox", {
        name: /level/i,
      }),
    ).not.toBeInTheDocument();

    // Open conditional form elements
    await user.click(
      screen.getByRole("radio", {
        name: /i am a government of canada employee/i,
      }),
    );

    expect(
      screen.getByRole("group", {
        name: /contract type/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", {
        name: /home department/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", {
        name: /group/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", {
        name: /level/i,
      }),
    ).toBeInTheDocument();
  });

  it("should not submit with empty fields.", async () => {
    renderEmployeeInformationForm({
      query: mockFragmentData,
      onSubmit: mockSave,
    });

    fireEvent.submit(screen.getByRole("button", { name: /save/i }));
    expect(await screen.findAllByRole("alert")).toHaveLength(2);
    expect(mockSave).not.toHaveBeenCalled();
  });

  it("should submit successfully with required fields", async () => {
    renderEmployeeInformationForm({
      query: mockFragmentData,
      onSubmit: mockSave,
    });

    const isGovEmployee = screen.getByRole("radio", {
      name: /i am a government of canada employee/i,
    });
    fireEvent.click(isGovEmployee);

    const isStudent = screen.getByRole("radio", {
      name: /i am a student/i,
    });
    fireEvent.click(isStudent);

    const department = screen.getByRole("combobox", {
      name: /home department/i,
    }) as HTMLSelectElement;

    const departmentOption = screen.getByRole("option", {
      name: mockDepartments[0].name.en || "",
    }) as HTMLOptionElement;
    await act(async () => {
      await user.click(department);
      await user.click(departmentOption);
    });

    const group = screen.getByRole("combobox", {
      name: /group/i,
    }) as HTMLSelectElement;

    const groupOption = screen.getByRole("option", {
      name: mockClassifications[0].group,
    }) as HTMLOptionElement;
    await act(async () => {
      await user.click(group);
      await user.click(groupOption);
    });

    const level = screen.getByRole("combobox", {
      name: /level/i,
    }) as HTMLSelectElement;

    const levelOption = screen.queryByRole("option", {
      name: mockClassifications[0].level.toString(),
    }) as HTMLOptionElement;
    fireEvent.change(level, { target: { value: levelOption.value } });

    fireEvent.submit(screen.getByRole("button", { name: /save/i }));
    await waitFor(() => {
      expect(mockSave).toHaveBeenCalled();
    });
  });
});