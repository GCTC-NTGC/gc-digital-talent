import React from "react";
import type { StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { useFieldArray, useFormContext } from "react-hook-form";

import { LocalizedString } from "@gc-digital-talent/graphql";
import { Announcer, Well } from "@gc-digital-talent/ui";

import BasicForm from "../BasicForm";
import Submit from "../Submit";
import TextArea from "../TextArea";

import Repeater, { RepeaterFieldsetProps, RepeaterProps } from "./Repeater";

type StoryProps = RepeaterProps &
  Pick<RepeaterFieldsetProps, "hideLegend"> & {
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
  const { name, hideLegend, maxItems, ...rootProps } = props;
  const { control } = useFormContext();
  const { remove, move, append, fields } = useFieldArray({
    control,
    name,
  });
  const canAdd = maxItems ? fields.length < maxItems : true;

  return (
    <Repeater.Root
      {...rootProps}
      showAdd={canAdd}
      onAdd={() => {
        const newValues = {
          en: "",
          fr: "",
        };
        append(newValues);
        action("add")(newValues);
      }}
    >
      <>
        {fields.length ? (
          fields.map((item, index) => (
            <Repeater.Fieldset
              key={item.id}
              index={index}
              total={fields.length}
              onMove={move}
              onRemove={remove}
              legend={`Screening Question ${index + 1}`}
              hideLegend={hideLegend}
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
                />
                <TextArea
                  id={`${name}.${index}.fr`}
                  name={`${name}.${index}.fr`}
                  label="Question (FR)"
                />
              </div>
            </Repeater.Fieldset>
          ))
        ) : (
          <Well>
            <p
              data-h2-font-weight="base(700)"
              data-h2-margin-bottom="base(x.5)"
            >
              You have no questions.
            </p>
            <p>Start adding some questions using the following button.</p>
          </Well>
        )}
        {!canAdd && maxItems && (
          <Well>
            <p
              data-h2-font-weight="base(700)"
              data-h2-margin-bottom="base(x.5)"
            >
              You have reached the maximum amount ({maxItems}) of screening
              questions per poster.
            </p>
            <p>
              Remember, applicants will submit information on how they meet each
              skill requirement through the regular application process.
            </p>
          </Well>
        )}
      </>
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
