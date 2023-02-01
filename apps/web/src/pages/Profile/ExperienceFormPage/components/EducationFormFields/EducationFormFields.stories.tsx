import React from "react";
import { useIntl } from "react-intl";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";

import Form from "@common/components/form/BasicForm";
import Submit from "@common/components/form/Submit";

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
    <Form onSubmit={action("submit")}>
      <EducationFormFields labels={labels} />
      <Submit />
    </Form>
  );
};

export const Default = TemplateEducationFormFields.bind({});
