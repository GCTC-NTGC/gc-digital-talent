import { screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { FormProvider, useForm } from "react-hook-form";
import type { FieldValues } from "react-hook-form";

import { renderWithProviders } from "@gc-digital-talent/vitest-helpers";

import type { ComboboxProps } from "./Combobox";
import Combobox from "./Combobox";

const options = [
  { value: "one", label: "Access to Information" },
  { value: "two", label: "Accounting Operations" },
  { value: "three", label: "Software Solutions" },
];

interface FormProps {
  defaultValues: FieldValues;
  comboboxProps: ComboboxProps;
}

/** Mirrors a filter form: the reset button clears the values without unmounting */
const Form = ({ defaultValues, comboboxProps }: FormProps) => {
  const methods = useForm({ defaultValues });

  return (
    <FormProvider {...methods}>
      <Combobox {...comboboxProps} />
      <button type="button" onClick={() => methods.reset({ streams: [] })}>
        Reset all filters
      </button>
    </FormProvider>
  );
};

const renderCombobox = (
  defaultValues: FieldValues,
  overrideProps: Partial<ComboboxProps> = {},
) =>
  renderWithProviders(
    <Form
      defaultValues={defaultValues}
      comboboxProps={{
        id: "streams",
        name: "streams",
        isMulti: true,
        label: "Work streams",
        options,
        ...overrideProps,
      }}
    />,
  );

describe("Combobox", () => {
  it("shows the values the form was initialized with", async () => {
    renderCombobox({ streams: ["one", "two"] });

    expect(await screen.findByText(/2 options selected/i)).toBeInTheDocument();
  });

  it("clears the selection when the form is reset without unmounting", async () => {
    const user = userEvent.setup();
    renderCombobox({ streams: ["one", "two"] });

    expect(await screen.findByText(/2 options selected/i)).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /reset all filters/i }),
    );

    expect(await screen.findByText(/0 options selected/i)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /access to information/i }),
    ).not.toBeInTheDocument();
  });

  it("keeps the selection when the form still holds a value", async () => {
    renderCombobox({ streams: ["one", "two"] });

    expect(await screen.findByText(/2 options selected/i)).toBeInTheDocument();
    // no reset: the chips must survive re-renders
    expect(
      screen.getByRole("button", { name: /access to information/i }),
    ).toBeInTheDocument();
  });

  it("forwards a caller-supplied aria-describedby to the input", async () => {
    renderCombobox({ streams: [] }, { "aria-describedby": "external-help" });

    expect(await screen.findByRole("combobox")).toHaveAttribute(
      "aria-describedby",
      "external-help",
    );
  });

  it("merges a caller-supplied aria-describedby with the internal context id", async () => {
    renderCombobox(
      { streams: [] },
      { "aria-describedby": "external-help", context: "Pick your streams" },
    );

    expect(await screen.findByRole("combobox")).toHaveAttribute(
      "aria-describedby",
      "external-help context-streams",
    );
  });

  it("omits aria-describedby when the caller passes none", async () => {
    renderCombobox({ streams: [] });

    expect(await screen.findByRole("combobox")).not.toHaveAttribute(
      "aria-describedby",
    );
  });
});
