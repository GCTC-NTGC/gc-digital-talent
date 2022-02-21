import React from "react";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";
import Form from "@common/components/form/BasicForm";
import Submit from "@common/components/form/Submit";
import CommunityExperienceForm from "./CommunityExperienceForm";

export default {
  component: CommunityExperienceForm,
  title: "CommunityExperienceForm",
} as Meta;

const TemplateCommunityExperienceForm: Story = () => {
  return (
    <Form onSubmit={action("submit")}>
      <CommunityExperienceForm />
      <Submit />
    </Form>
  );
};

export const IndividualCommunityExperience =
  TemplateCommunityExperienceForm.bind({});
