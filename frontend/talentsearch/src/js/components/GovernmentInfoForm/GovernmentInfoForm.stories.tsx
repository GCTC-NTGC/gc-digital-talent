import React from "react";
import { Meta, Story } from "@storybook/react";
import { fakeClassifications } from "@common/fakeData";
import { BasicForm } from "@common/components/form";
import GovInfoFormContainer, { GovernmentInfoForm } from "./GovernmentInfoForm";
import ProfileFormWrapper from "../applicantProfile/ProfileFormWrapper";
import ProfileFormFooter from "../applicantProfile/ProfileFormFooter";

const fakeClass = fakeClassifications();

export default {
  component: GovInfoFormContainer,
  title: "Government Info Form",
} as Meta;

const TemplateGovInfoForm: Story = () => {
  return (
    <ProfileFormWrapper
      description="Please indicate if you are currently an employee in the Government of Canada."
      title="Government Information"
      crumbs={[
        {
          title: "Government Information",
        },
      ]}
    >
      <BasicForm onSubmit={() => null}>
        <GovernmentInfoForm classifications={fakeClass} />
        <ProfileFormFooter mode="saveButton" />
      </BasicForm>
    </ProfileFormWrapper>
  );
};

export const IndividualGovernmentInfo = TemplateGovInfoForm.bind({});
