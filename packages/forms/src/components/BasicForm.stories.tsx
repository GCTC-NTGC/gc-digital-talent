import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { useFieldArray, useFormContext } from "react-hook-form";

import BasicForm from "./BasicForm";
import Repeater from "./Repeater/Repeater";
import Submit from "./Submit";
import Input from "./Input";

const labels = {
  requiredField: "Required field",
  optionalField: "Optional field",
  fieldArray: "Field array",
  "fieldArray.*.requiredArrayField": "Required array field",
  "fieldArray.*.optionalArrayField": "Option array field",
  "fieldArray.*.nestedFieldArray.*.requiredNestedArrayField":
    "Mock deeply nested field",
};

export default {
  component: BasicForm,
  title: "Form/Basic Form",
  args: {
    onSubmit: async (values) => action("onSubmit")(values),
    labels,
  },
} as Meta<typeof BasicForm>;

const FieldWrapper = ({ children }: { children: React.ReactNode }) => (
  <div
    data-h2-display="base(flex)"
    data-h2-flex-direction="base(column)"
    data-h2-gap="base(x1 0)"
  >
    {children}
  </div>
);

const NestedFieldArray = ({ parentIndex }: { parentIndex: number }) => {
  const { control } = useFormContext();

  const { remove, move, append, fields } = useFieldArray({
    control,
    name: "nestedFieldArray",
  });

  return (
    <Repeater.Root
      name="nestedFieldArray"
      addText="Add nested item"
      total={fields.length}
      onAdd={() => {
        append({});
      }}
    >
      {fields.length ? (
        fields.map((item, index) => (
          <Repeater.Fieldset
            key={item.id}
            name="nestedFieldArray"
            index={index}
            total={fields.length}
            onMove={move}
            onRemove={remove}
            legend={`Nested field ${index + 1}`}
          >
            <FieldWrapper>
              <Input
                name={`fieldArray.${parentIndex}.nestedFieldArray.${index}.requiredNestedArrayField`}
                id={`fieldArray.${parentIndex}.nestedFieldArray.${index}.requiredNestedArrayField`}
                label={
                  labels[
                    "fieldArray.*.nestedFieldArray.*.requiredNestedArrayField"
                  ]
                }
                type="text"
                rules={{ required: "This array field must be filled out" }}
              />
            </FieldWrapper>
          </Repeater.Fieldset>
        ))
      ) : (
        <p>Add some fields to get started.</p>
      )}
    </Repeater.Root>
  );
};

const FieldArray = () => {
  const { control } = useFormContext();

  const { remove, move, append, fields } = useFieldArray({
    control,
    name: "fieldArray",
    rules: { required: "Add at least one item", minLength: 1 },
  });

  return (
    <Repeater.Root
      name="fieldArray"
      total={fields.length}
      addText="Add"
      onAdd={() => {
        append({});
      }}
    >
      {fields.length ? (
        fields.map((item, index) => (
          <Repeater.Fieldset
            key={item.id}
            index={index}
            name="fieldArray"
            total={fields.length}
            onMove={move}
            onRemove={remove}
            legend={`Field ${index + 1}`}
          >
            <FieldWrapper>
              <Input
                name={`fieldArray.${index}.requiredArrayField`}
                id={`fieldArray.${index}.requiredArrayField`}
                label={labels["fieldArray.*.requiredArrayField"]}
                type="text"
                rules={{ required: "This array field must be filled out" }}
              />
              <Input
                name={`fieldArray.${index}.optionalArrayField`}
                id={`fieldArray.${index}.optionalArrayField`}
                label={labels["fieldArray.*.optionalArrayField"]}
                type="text"
              />
              <NestedFieldArray parentIndex={index} />
            </FieldWrapper>
          </Repeater.Fieldset>
        ))
      ) : (
        <p>Add some fields to get started.</p>
      )}
    </Repeater.Root>
  );
};

const Template: StoryFn<typeof BasicForm> = (args) => (
  <BasicForm {...args}>
    <FieldWrapper>
      <Input
        name="requiredField"
        id="requiredField"
        label={labels.requiredField}
        type="text"
        rules={{ required: "This field must be filled out" }}
      />
      <Input
        name="optionsField"
        id="optionalField"
        label={labels.optionalField}
        type="text"
      />
      <FieldArray />
      <Submit />
    </FieldWrapper>
  </BasicForm>
);

export const Default = Template.bind({});
Default.args = {
  options: {
    defaultValues: {
      requiredField: "",
    },
  },
};
