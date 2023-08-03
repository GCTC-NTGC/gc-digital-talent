import React from "react";
import { useIntl } from "react-intl";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";

import { BasicForm, Submit } from "@gc-digital-talent/forms";

import CommunityFormFields from "./CommunityFormFields";
import getExperienceFormLabels from "../../labels";

export default {
  component: CommunityFormFields,
  title: "Forms/Experience Form/Community Fields",
} as Meta;

const TemplateCommunityFormFields: Story = () => {
  const intl = useIntl();
  const labels = getExperienceFormLabels(intl, "community");
  return (
    <BasicForm onSubmit={action("submit")}>
      <CommunityFormFields labels={labels} />
      <p data-h2-margin-top="base(x1)">
        <Submit />
      </p>
    </BasicForm>
  );
};

export const Default = TemplateCommunityFormFields.bind({});
