/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { Provider as GraphqlProvider } from "urql";
import { pipe, fromValue, delay } from "wonka";

import {
  fakeClassifications,
  fakeDepartments,
} from "@gc-digital-talent/fake-data";
import { axeTest, renderWithProviders } from "@gc-digital-talent/jest-helpers";
import { Language, makeFragmentData } from "@gc-digital-talent/graphql";

import {
  GettingStartedForm,
  GettingStartedFormProps,
  GettingStarted_QueryFragment,
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
  GettingStarted_QueryFragment,
);

const renderGettingStartedForm = ({
  query,
  handleSubmit,
}: GettingStartedFormProps) =>
  renderWithProviders(
    <GraphqlProvider value={mockClient}>
      <GettingStartedForm query={query} handleSubmit={handleSubmit} />
    </GraphqlProvider>,
  );

describe("Getting Started Form tests", () => {
  it("should have no accessibility errors", async () => {
    const { container } = renderGettingStartedForm({
      query: mockFragmentData,
      handleSubmit: mockSave,
    });

    await axeTest(container);
  });

  it("should render fields", () => {
    renderGettingStartedForm({
      query: mockFragmentData,
      handleSubmit: mockSave,
    });

    expect(
      screen.getByRole("textbox", { name: /first name/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("textbox", { name: /last name/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("group", { name: /preferred contact language/i }),
    ).toBeInTheDocument();

    expect(screen.getByRole("textbox", { name: /email/i })).toBeInTheDocument();

    expect(
      screen.getByRole("group", {
        name: /email notification consent/i,
      }),
    ).toBeInTheDocument();
  });

  it("should not render with empty fields.", async () => {
    renderGettingStartedForm({
      query: mockFragmentData,
      handleSubmit: mockSave,
    });

    fireEvent.submit(
      screen.getByRole("button", { name: /verify your contact email/i }),
    );
    expect(await screen.findAllByRole("alert")).toHaveLength(4);
    expect(mockSave).not.toHaveBeenCalled();
  });

  it("should submit successfully with required fields", async () => {
    renderGettingStartedForm({
      query: mockFragmentData,
      handleSubmit: mockSave,
    });

    const firstName = screen.getByRole("textbox", { name: /first name/i });
    fireEvent.change(firstName, { target: { value: "FirstName" } });

    const lastName = screen.getByRole("textbox", { name: /last name/i });
    fireEvent.change(lastName, { target: { value: "LastName" } });

    const preferredLangEnglish = screen.getByRole("radio", {
      name: /english/i,
    });
    fireEvent.click(preferredLangEnglish);

    const email = screen.getByRole("textbox", { name: /email/i });
    fireEvent.change(email, { target: { value: "email@test.com" } });

    fireEvent.submit(
      screen.getByRole("button", { name: /verify your contact email/i }),
    );
    await waitFor(() => {
      expect(mockSave).toHaveBeenCalled();
    });
  });
});
