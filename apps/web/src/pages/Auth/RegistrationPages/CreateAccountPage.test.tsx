/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { fireEvent, screen, waitFor } from "@testing-library/react";
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
  CreateAccountForm,
  CreateAccountFormProps,
  CreateAccount_QueryFragment,
} from "./GettingStartedPage";

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
  CreateAccount_QueryFragment,
);

const renderCreateAccountForm = ({
  query,
  handleCreateAccount,
}: CreateAccountFormProps) =>
  renderWithProviders(
    <GraphqlProvider value={mockClient}>
      <CreateAccountForm
        query={query}
        handleCreateAccount={handleCreateAccount}
      />
    </GraphqlProvider>,
  );

describe("Create Account Form tests", () => {
  const user = userEvent.setup();

  it("should have no accessibility errors", async () => {
    const { container } = renderCreateAccountForm({
      query: mockFragmentData,
      handleCreateAccount: mockSave,
    });

    await axeTest(container);
  });

  it("should render fields", async () => {
    renderCreateAccountForm({
      query: mockFragmentData,
      handleCreateAccount: mockSave,
    });

    expect(
      screen.getByRole("textbox", { name: /first name/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("textbox", { name: /last name/i }),
    ).toBeInTheDocument();

    expect(screen.getByRole("textbox", { name: /email/i })).toBeInTheDocument();

    expect(
      screen.getByRole("group", { name: /preferred contact language/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("group", {
        name: /currently work for the government of canada/i,
      }),
    ).toBeInTheDocument();

    // Ensure conditional form elements don't exist yet.
    expect(
      screen.queryByRole("combobox", {
        name: /which department do you work for/i,
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("group", {
        name: /employment status/i,
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("textbox", {
        name: /priority number/i,
      }),
    ).not.toBeInTheDocument();

    // Open second round of form elements
    await user.click(
      screen.getByRole("radio", {
        name: /i am a government of canada employee/i,
      }),
    );

    expect(
      screen.getByRole("radio", {
        name: /i am a student/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", {
        name: /select a department/i,
      }),
    ).toBeInTheDocument();

    // Open the last round of form elements
    await user.click(
      screen.getByRole("radio", {
        name: /i have a term position/i,
      }),
    );

    expect(
      screen.getByRole("combobox", {
        name: /current classification group/i,
      }),
    ).toBeInTheDocument();

    await user.selectOptions(
      screen.getByRole("combobox", {
        name: /current classification group/i,
      }),
      "IT",
    );

    expect(
      screen.getByRole("combobox", {
        name: /current classification level/i,
      }),
    ).toBeInTheDocument();

    // open priority number
    await user.click(
      screen.getByRole("radio", {
        name: /i have a priority entitlement/i,
      }),
    );

    expect(
      screen.getByRole("textbox", {
        name: /priority number/i,
      }),
    ).toBeInTheDocument();
  });

  it("should not render with empty fields.", async () => {
    renderCreateAccountForm({
      query: mockFragmentData,
      handleCreateAccount: mockSave,
    });

    fireEvent.submit(screen.getByRole("button", { name: /save/i }));
    expect(await screen.findAllByRole("alert")).toHaveLength(6);
    expect(mockSave).not.toHaveBeenCalled();
  });

  it("should submit successfully with required fields", async () => {
    renderCreateAccountForm({
      query: mockFragmentData,
      handleCreateAccount: mockSave,
    });

    const firstName = screen.getByRole("textbox", { name: /first name/i });
    fireEvent.change(firstName, { target: { value: "FirstName" } });

    const lastName = screen.getByRole("textbox", { name: /last name/i });
    fireEvent.change(lastName, { target: { value: "LastName" } });

    const email = screen.getByRole("textbox", { name: /email/i });
    fireEvent.change(email, { target: { value: "email@test.com" } });

    const preferredLangEnglish = screen.getByRole("radio", {
      name: /english/i,
    });
    fireEvent.click(preferredLangEnglish);

    const isGovEmployee = screen.getByRole("radio", {
      name: /i am a government of canada employee/i,
    });
    fireEvent.click(isGovEmployee);

    const department = screen.getByRole("combobox", {
      name: /which department do you work for/i,
    }) as HTMLSelectElement;

    const option = screen.getByRole("option", {
      name: /treasury board secretariat/i,
    }) as HTMLOptionElement;
    fireEvent.change(department, { target: { value: option.value } }); // Set to second value after null selection.

    const isStudent = screen.getByRole("radio", {
      name: /i am a student/i,
    });
    fireEvent.click(isStudent);

    fireEvent.click(
      screen.getByRole("radio", {
        name: /i have a priority entitlement/i,
      }),
    );

    fireEvent.submit(screen.getByRole("button", { name: /save/i }));
    await waitFor(() => {
      expect(mockSave).toHaveBeenCalled();
    });
  });
});
