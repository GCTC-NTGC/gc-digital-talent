/**
 * @jest-environment jsdom
 */
import React from "react";
import "@testing-library/jest-dom";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import type { FieldValues, SubmitHandler } from "react-hook-form";
import { axeTest, renderWithProviders } from "@gc-digital-talent/jest-helpers";

import Repeater, { RepeaterProps, RepeaterFieldsetProps } from "./Repeater";
import Input, { InputProps } from "../Input";

interface RenderRepeaterProps {
  formProps: Omit<FormProps, "children">;
  repeaterProps: Omit<RepeaterProps, "children">;
  repeaterFieldsetProps: Omit<
    RepeaterFieldsetProps,
    "legend" | "hideLegend" | "index" | "total" | "children"
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
    repeaterProps.onAdd();
  };

  const handleRemove = (index: number) => {
    remove(index);
    repeaterFieldsetProps.onRemove(index);
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
          total={fields.length}
          legend={`Test Repeater ${index + 1}`}
          onRemove={handleRemove}
          onMove={handleMove}
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
  children: React.ReactNode;
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
    onAdd: mockFn,
    addText: "Add item",
  },
  repeaterFieldsetProps: {
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

    user.click(await screen.getByRole("button", { name: /add item/i }));

    await waitFor(async () => {
      expect(
        await screen.getByRole("group", { name: /test repeater/i }),
      ).toBeInTheDocument();
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

    await waitFor(async () => {
      expect(
        await screen.getAllByRole("group", { name: /test repeater/i }),
      ).toHaveLength(2);
    });

    user.click(await screen.getByRole("button", { name: /remove item 1/i }));

    await waitFor(async () => {
      expect(
        await screen.getAllByRole("group", { name: /test repeater/i }),
      ).toHaveLength(1);
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

    user.click(
      await screen.getByRole("button", { name: /change order from 1 to 2/i }),
    );

    await waitFor(async () => {
      const items = await screen.getAllByRole("group", {
        name: /test repeater/i,
      });
      expect(
        await within(items[0]).getByRole("textbox", { name: "Value" }),
      ).toHaveValue("Two");
      expect(
        await within(items[1]).getByRole("textbox", { name: "Value" }),
      ).toHaveValue("One");
    });
  });
});
