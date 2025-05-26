/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { screen, waitFor, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import type { FieldValues, SubmitHandler } from "react-hook-form";
import { ReactNode } from "react";

import { axeTest, renderWithProviders } from "@gc-digital-talent/jest-helpers";

import Input, { InputProps } from "../Input/Input";
import Repeater, { RepeaterProps, RepeaterFieldsetProps } from "./Repeater";

interface RenderRepeaterProps {
  formProps: Omit<FormProps, "children">;
  repeaterProps: Omit<RepeaterProps, "children">;
  repeaterFieldsetProps: Omit<
    RepeaterFieldsetProps,
    "legend" | "hideLegend" | "index" | "children"
  >;
  inputProps: InputProps;
}

type RepeaterWrapperProps = Pick<
  RenderRepeaterProps,
  "inputProps" | "repeaterProps" | "repeaterFieldsetProps"
>;

const RepeaterWrapper = ({
  inputProps,
  repeaterProps,
  repeaterFieldsetProps,
}: RepeaterWrapperProps) => {
  const { control } = useFormContext();
  const { remove, move, append, fields } = useFieldArray({
    control,
    name: "repeater",
  });

  const handleAdd = () => {
    const addedValue = {
      [inputProps.name]: "",
    };
    append(addedValue);
    if (repeaterProps.onAdd) repeaterProps.onAdd();
  };

  const handleRemove = (index: number) => {
    remove(index);
    repeaterFieldsetProps.onRemove?.(index);
  };

  const handleMove = (from: number, to: number) => {
    move(from, to);
    repeaterFieldsetProps.onMove(from, to);
  };

  return (
    <Repeater.Root {...repeaterProps} onAdd={handleAdd}>
      {fields.map((item, index) => (
        <Repeater.Fieldset
          key={item.id}
          index={index}
          name="repeater"
          legend={`Test Repeater ${index + 1}`}
          onRemove={handleRemove}
          onMove={handleMove}
          isLast={index === fields.length - 1}
        >
          <Input
            {...inputProps}
            id={`repeater.${index}.${inputProps.name}`}
            name={`repeater.${index}.${inputProps.name}`}
          />
        </Repeater.Fieldset>
      ))}
    </Repeater.Root>
  );
};

interface FormProps {
  onSubmit: SubmitHandler<FieldValues>;
  defaultValues: FieldValues;
  children: ReactNode;
}

const Form = ({ onSubmit, defaultValues, children }: FormProps) => {
  const methods = useForm({ defaultValues, mode: "onSubmit" });
  const handleSubmit = (data: FieldValues) => onSubmit(data);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)}>{children}</form>
    </FormProvider>
  );
};

const renderRepeater = ({ formProps, ...rest }: RenderRepeaterProps) =>
  renderWithProviders(
    <Form {...formProps}>
      <RepeaterWrapper {...rest} />
      <button type="submit">Submit</button>
    </Form>,
  );

const mockFn = jest.fn();

const defaultProps: RenderRepeaterProps = {
  formProps: {
    onSubmit: mockFn,
    defaultValues: {
      repeater: [],
    },
  },
  inputProps: {
    type: "text",
    id: "value",
    name: "value",
    label: "Value",
  },
  repeaterProps: {
    name: "value",
    max: 5,
    onAdd: mockFn,
    addText: "Add item",
  },
  repeaterFieldsetProps: {
    name: "value",
    onMove: mockFn,
    onRemove: mockFn,
  },
};

describe("Repeater", () => {
  const user = userEvent.setup();

  it("should have no accessibility errors", async () => {
    const { container } = renderRepeater(defaultProps);

    await axeTest(container);
  });

  it("should add an item", async () => {
    const addFn = jest.fn();

    renderRepeater({
      ...defaultProps,
      repeaterProps: {
        ...defaultProps.repeaterProps,
        onAdd: addFn,
      },
    });

    await user.click(screen.getByRole("button", { name: /add item/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("group", { name: /test repeater/i }),
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(addFn).toHaveBeenCalled();
    });
  });

  it("should remove an item", async () => {
    const removeFn = jest.fn();

    renderRepeater({
      ...defaultProps,
      formProps: {
        ...defaultProps.formProps,
        defaultValues: {
          repeater: [{ value: "One" }, { value: "Two" }],
        },
      },
      repeaterFieldsetProps: {
        ...defaultProps.repeaterFieldsetProps,
        onRemove: removeFn,
      },
    });

    await waitFor(() => {
      expect(
        screen.getAllByRole("group", { name: /test repeater/i }),
      ).toHaveLength(2);
    });

    await user.click(screen.getByRole("button", { name: /remove item 1/i }));

    await waitFor(() => {
      expect(
        screen.getAllByRole("group", { name: /test repeater/i }),
      ).toHaveLength(1);
    });

    await waitFor(() => {
      expect(removeFn).toHaveBeenCalledWith(0);
    });
  });

  it("should move an item", async () => {
    const addFn = jest.fn();

    renderRepeater({
      ...defaultProps,
      formProps: {
        ...defaultProps.formProps,
        defaultValues: {
          repeater: [{ value: "One" }, { value: "Two" }],
        },
      },
      repeaterProps: {
        ...defaultProps.repeaterProps,
        onAdd: addFn,
      },
    });

    await user.click(
      screen.getByRole("button", { name: /change order from 1 to 2/i }),
    );

    const items = screen.getAllByRole("group", {
      name: /test repeater/i,
    });

    expect(
      within(items[0]).getByRole("textbox", { name: "Value" }),
    ).toHaveValue("Two");

    expect(
      within(items[1]).getByRole("textbox", { name: "Value" }),
    ).toHaveValue("One");
  });
});
