import React from "react";
import type { StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useIntl } from "react-intl";

import { LocalizedString } from "@gc-digital-talent/graphql";
import { Announcer } from "@gc-digital-talent/ui";
import { errorMessages } from "@gc-digital-talent/i18n";

import BasicForm from "../BasicForm";
import Submit from "../Submit";
import TextArea from "../TextArea";
import Repeater, { RepeaterFieldsetProps, RepeaterProps } from "./Repeater";

type StoryProps = RepeaterProps &
  Pick<RepeaterFieldsetProps, "hideLegend" | "hideIndex"> & {
    defaultValues: Array<LocalizedString>;
    name: string;
    maxItems?: number;
  };

export default {
  component: Repeater.Fieldset,
  title: "Components/Repeater",
};

const defaultArgs = {
  label: "Screening Questions",
  name: "questions",
  addText: "Add screening question",
};

const Fields = (props: Omit<StoryProps, "defaultValues">) => {
  const intl = useIntl();
  const { name, hideLegend, hideIndex, maxItems, ...rootProps } = props;
  const { control } = useFormContext();
  const { remove, move, append, fields } = useFieldArray({
    control,
    name,
    rules: {
      required: "Please add at least 1 item.",
    },
  });
  const canAdd = maxItems ? fields.length < maxItems : true;

  return (
    <Repeater.Root
      {...rootProps}
      name={name}
      trackUnsaved
      addButtonProps={{
        disabled: !canAdd,
      }}
      onAdd={() => {
        const newValues = {
          en: "",
          fr: "",
        };
        append(newValues);
        action("add")(newValues);
      }}
      maxItems={maxItems}
      total={fields.length}
      showApproachingLimit
      showUnsavedChanges
    >
      {fields.map((item, index) => (
        <Repeater.Fieldset
          key={item.id}
          index={index}
          name={name}
          total={fields.length}
          onMove={move}
          onRemove={remove}
          legend={`Screening Question ${index + 1}`}
          hideLegend={hideLegend}
          hideIndex={hideIndex}
          onEdit={() => {
            action("edit")("Opens edit form dialog.");
          }}
        >
          <div
            data-h2-display="base(grid)"
            data-h2-grid-template-columns="base(1fr 1fr)"
            data-h2-gap="base(x.5)"
          >
            <TextArea
              id={`${name}.${index}.en`}
              name={`${name}.${index}.en`}
              label="Question (EN)"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <TextArea
              id={`${name}.${index}.fr`}
              name={`${name}.${index}.fr`}
              label="Question (FR)"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
          </div>
        </Repeater.Fieldset>
      ))}
    </Repeater.Root>
  );
};

const Template: StoryFn<StoryProps> = (args) => {
  const { defaultValues, name, ...fieldProps } = args;
  const handleSubmit = (data: unknown) => {
    action("Submit form")(data);
  };

  return (
    <Announcer>
      <BasicForm
        onSubmit={handleSubmit}
        options={{
          defaultValues: {
            [name]: defaultValues,
          },
        }}
      >
        <div data-h2-margin-bottom="base(x1)">
          <Fields name={name} {...fieldProps} />
        </div>
        <Submit />
      </BasicForm>
    </Announcer>
  );
};

export const Default = Template.bind({});
Default.args = defaultArgs;

export const WithLegend = Template.bind({});
WithLegend.args = {
  ...defaultArgs,
  hideLegend: false,
};

export const WithDefaultValues = Template.bind({});
WithDefaultValues.args = {
  ...defaultArgs,
  defaultValues: [
    {
      en: "Question 1 (EN)",
      fr: "Question 1 (FR)",
    },
  ],
};

export const WithMaxItems = Template.bind({});
WithMaxItems.args = {
  ...defaultArgs,
  maxItems: 2,
  defaultValues: [
    {
      en: "Question 1 (EN)",
      fr: "Question 1 (FR)",
    },
    {
      en: "Question 2 (EN)",
      fr: "Question 2 (FR)",
    },
  ],
};

export const WithLockedItems = Template.bind({});
WithLockedItems.args = {
  ...defaultArgs,
  maxItems: 4,
  defaultValues: [
    {
      en: "Question 1 (EN)",
      fr: "Question 1 (FR)",
    },
    {
      en: "Question 2 (EN)",
      fr: "Question 2 (FR)",
    },
    {
      en: "Question 3 (EN)",
      fr: "Question 3 (FR)",
    },
  ],
};

export const WithEditButton = Template.bind({});
WithEditButton.args = {
  ...defaultArgs,
  maxItems: 4,
  defaultValues: [
    {
      en: "Question 1 (EN)",
      fr: "Question 1 (FR)",
    },
    {
      en: "Question 2 (EN)",
      fr: "Question 2 (FR)",
    },
    {
      en: "Question 3 (EN)",
      fr: "Question 3 (FR)",
    },
  ],
};

export const HiddenIndex = Template.bind({});
HiddenIndex.args = {
  ...defaultArgs,
  hideIndex: true,
  defaultValues: [
    {
      en: "Question 1 (EN)",
      fr: "Question 1 (FR)",
    },
  ],
};
