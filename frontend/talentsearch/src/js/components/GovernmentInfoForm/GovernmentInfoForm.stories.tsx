/* eslint-disable react/destructuring-assignment */
// needed for line 28 to operate as intended for Storybook
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

const TemplateGovInfoForm: Story = (args) => (
  <ProfileFormWrapper
    description="Please indicate if you are currently an employee in the Government of Canada."
    title="Government Information"
    crumbs={[
      {
        title: "Government Information",
      },
    ]}
  >
    <BasicForm onSubmit={() => null} options={{ defaultValues: args.options }}>
      <GovernmentInfoForm classifications={fakeClass} />
      <ProfileFormFooter mode="saveButton" />
    </BasicForm>
  </ProfileFormWrapper>
);

export const ANoArgs = TemplateGovInfoForm.bind({});
ANoArgs.args = {
  options: {
    govEmployeeYesNo: undefined,
    govEmployeeType: undefined,
    lateralDeployBool: undefined,
    currentClassificationGroup: undefined,
    currentClassificationLevel: undefined,
  },
};

export const BStatusNo = TemplateGovInfoForm.bind({});
BStatusNo.args = {
  options: {
    ...ANoArgs.args.options,
    govEmployeeYesNo: "no",
  },
};

export const CStatusYes = TemplateGovInfoForm.bind({});
CStatusYes.args = {
  options: {
    ...ANoArgs.args.options,
    govEmployeeYesNo: "yes",
  },
};

export const DCasualNoClass = TemplateGovInfoForm.bind({});
DCasualNoClass.args = {
  options: {
    ...CStatusYes.args.options,
    govEmployeeType: "casual",
  },
};

export const ECasualClassGroup = TemplateGovInfoForm.bind({});
ECasualClassGroup.args = {
  options: {
    ...DCasualNoClass.args.options,
    currentClassificationGroup: "CS",
  },
};

export const FCasualClassGroupLevel = TemplateGovInfoForm.bind({});
FCasualClassGroupLevel.args = {
  options: {
    ...ECasualClassGroup.args.options,
    currentClassificationLevel: "3",
  },
};
