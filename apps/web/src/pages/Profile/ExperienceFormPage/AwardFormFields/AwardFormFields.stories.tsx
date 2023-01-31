import React from "react";
import { useIntl } from "react-intl";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";

import Form from "@common/components/form/BasicForm";
import Submit from "@common/components/form/Submit";

import AwardFormFields from "./AwardFormFields";
import getExperienceFormLabels from "../labels";

export default {
  component: AwardFormFields,
  title: "Forms/Experience Form/Award Fields",
} as Meta;

const TemplateAwardDetailsForm: Story = () => {
  const intl = useIntl();
  const labels = getExperienceFormLabels(intl, "award");
  return (
    <Form onSubmit={action("submit")}>
      <AwardFormFields labels={labels} />
      <Submit />
    </Form>
  );
};

export const Default = TemplateAwardDetailsForm.bind({});
