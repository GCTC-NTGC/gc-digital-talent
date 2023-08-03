import React from "react";
import { useIntl } from "react-intl";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";

import { BasicForm, Submit } from "@gc-digital-talent/forms";

import PersonalFormFields from "./PersonalFormFields";
import getExperienceFormLabels from "../../labels";

export default {
  component: PersonalFormFields,
  title: "Forms/Experience Form/Personal Form Fields",
} as Meta;

const TemplatePersonalFormFields: Story = () => {
  const intl = useIntl();
  const labels = getExperienceFormLabels(intl, "personal");
  return (
    <BasicForm onSubmit={action("submit")}>
      <PersonalFormFields labels={labels} />
      <p data-h2-margin-top="base(x1)">
        <Submit />
      </p>
    </BasicForm>
  );
};

export const Default = TemplatePersonalFormFields.bind({});
