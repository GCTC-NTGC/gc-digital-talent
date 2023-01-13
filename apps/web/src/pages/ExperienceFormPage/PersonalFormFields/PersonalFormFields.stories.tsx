import React from "react";
import { useIntl } from "react-intl";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";

import Form from "@common/components/form/BasicForm";
import Submit from "@common/components/form/Submit";

import PersonalFormFields from "./PersonalFormFields";
import getExperienceFormLabels from "../labels";

export default {
  component: PersonalFormFields,
  title: "Forms/Experience Form/Personal Form Fields",
} as Meta;

const TemplatePersonalFormFields: Story = () => {
  const intl = useIntl();
  const labels = getExperienceFormLabels(intl, "personal");
  return (
    <Form onSubmit={action("submit")}>
      <PersonalFormFields labels={labels} />
      <Submit />
    </Form>
  );
};

export const Default = TemplatePersonalFormFields.bind({});
