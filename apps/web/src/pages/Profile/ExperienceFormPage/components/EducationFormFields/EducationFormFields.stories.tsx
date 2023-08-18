import React from "react";
import { useIntl } from "react-intl";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";

import { BasicForm, Submit } from "@gc-digital-talent/forms";

import getExperienceFormLabels from "../../labels";
import EducationFormFields from "./EducationFormFields";

export default {
  component: EducationFormFields,
  title: "Forms/Experience Form/Education Fields",
} as Meta;

const TemplateEducationFormFields: Story = () => {
  const intl = useIntl();
  const labels = getExperienceFormLabels(intl, "education");
  return (
    <BasicForm onSubmit={action("submit")}>
      <EducationFormFields labels={labels} />
      <p data-h2-margin-top="base(x1)">
        <Submit />
      </p>
    </BasicForm>
  );
};

export const Default = TemplateEducationFormFields.bind({});
