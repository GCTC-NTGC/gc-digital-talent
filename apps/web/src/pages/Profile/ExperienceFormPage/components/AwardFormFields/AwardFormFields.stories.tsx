import React from "react";
import { useIntl } from "react-intl";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";

import { BasicForm, Submit } from "@gc-digital-talent/forms";

import AwardFormFields from "./AwardFormFields";
import getExperienceFormLabels from "../../labels";

export default {
  component: AwardFormFields,
  title: "Forms/Experience Form/Award Fields",
} as Meta;

const TemplateAwardDetailsForm: Story = () => {
  const intl = useIntl();
  const labels = getExperienceFormLabels(intl, "award");
  return (
    <BasicForm onSubmit={action("submit")}>
      <AwardFormFields labels={labels} />
      <p data-h2-margin-top="base(x1)">
        <Submit />
      </p>
    </BasicForm>
  );
};

export const Default = TemplateAwardDetailsForm.bind({});
