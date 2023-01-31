import React from "react";
import { useIntl } from "react-intl";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";

import Form from "@common/components/form/BasicForm";
import Submit from "@common/components/form/Submit";

import CommunityFormFields from "./CommunityFormFields";
import getExperienceFormLabels from "../labels";

export default {
  component: CommunityFormFields,
  title: "Forms/Experience Form/Community Fields",
} as Meta;

const TemplateCommunityFormFields: Story = () => {
  const intl = useIntl();
  const labels = getExperienceFormLabels(intl, "community");
  return (
    <Form onSubmit={action("submit")}>
      <CommunityFormFields labels={labels} />
      <Submit />
    </Form>
  );
};

export const Default = TemplateCommunityFormFields.bind({});
