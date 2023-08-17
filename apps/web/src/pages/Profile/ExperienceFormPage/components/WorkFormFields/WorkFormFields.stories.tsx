import React from "react";
import { useIntl } from "react-intl";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";

import { BasicForm, Submit } from "@gc-digital-talent/forms";

import getExperienceFormLabels from "../../labels";
import WorkFormFields from "./WorkFormFields";

export default {
  component: WorkFormFields,
  title: "Forms/Experience Form/Work Form Fields",
} as Meta;

const TemplateWorkFormFields: Story = () => {
  const intl = useIntl();
  const labels = getExperienceFormLabels(intl, "work");
  return (
    <BasicForm onSubmit={action("submit")}>
      <WorkFormFields labels={labels} />
      <p data-h2-margin-top="base(x1)">
        <Submit />
      </p>
    </BasicForm>
  );
};

export const Default = TemplateWorkFormFields.bind({});
