import React from "react";
import { useIntl } from "react-intl";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";

import { BasicForm, Submit } from "@gc-digital-talent/forms";

import EducationFormFields from "./EducationFormFields";
import getExperienceFormLabels from "../../labels";

export default {
  component: EducationFormFields,
  title: "Forms/Experience Form/Community Fields",
} as Meta;

const TemplateEducationFormFields: Story = () => {
  const intl = useIntl();
  const labels = getExperienceFormLabels(intl, "education");
  return (
    <BasicForm onSubmit={action("submit")}>
      <EducationFormFields labels={labels} />
      <Submit />
    </BasicForm>
  );
};

export const Default = TemplateEducationFormFields.bind({});
