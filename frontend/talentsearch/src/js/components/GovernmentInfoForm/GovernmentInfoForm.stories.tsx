/* eslint-disable react/destructuring-assignment */
// needed for line 20 to operate as intended for Storybook
import React from "react";
import { Meta, Story } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import {
  fakeClassifications,
  fakeDepartments,
  fakeUsers,
} from "@common/fakeData";
import pick from "lodash/pick";
import { GovEmployeeType } from "../../api/generated";
import GovInfoFormContainer, {
  GovInfoFormWithProfileWrapper,
} from "./GovernmentInfoForm";

export default {
  component: GovInfoFormContainer,
  title: "Government Info Form",
} as Meta;

const TemplateGovInfoForm: Story = (args) => (
  <GovInfoFormWithProfileWrapper
    departments={fakeDepartments()}
    classifications={fakeClassifications()}
    initialData={args.initialData}
    submitHandler={async (...data) => {
      action("Submit")(data);
    }}
  />
);

export const ADefaultArgs = TemplateGovInfoForm.bind({});
ADefaultArgs.args = {
  initialData: pick(fakeUsers(1)[0], [
    "id",
    "isGovEmployee",
    "govEmployeeType",
    "department",
    "currentClassification",
  ]),
};

export const BStatusNo = TemplateGovInfoForm.bind({});
BStatusNo.args = {
  initialData: {
    ...ADefaultArgs.args.initialData,
    isGovEmployee: false,
  },
};

export const CStatusYes = TemplateGovInfoForm.bind({});
CStatusYes.args = {
  initialData: {
    ...ADefaultArgs.args.initialData,
    isGovEmployee: true,
  },
};

export const DCasualNoClass = TemplateGovInfoForm.bind({});
DCasualNoClass.args = {
  initialData: {
    ...CStatusYes.args.initialData,
    govEmployeeType: GovEmployeeType.Casual,
    currentClassification: {},
  },
};

export const ECasualClassGroup = TemplateGovInfoForm.bind({});
ECasualClassGroup.args = {
  initialData: {
    ...DCasualNoClass.args.initialData,
    currentClassification: { group: "IT" },
  },
};

export const FCasualClassGroupLevel = TemplateGovInfoForm.bind({});
FCasualClassGroupLevel.args = {
  initialData: {
    ...ECasualClassGroup.args.initialData,
    currentClassification: { group: "IT", level: 3 },
  },
};
