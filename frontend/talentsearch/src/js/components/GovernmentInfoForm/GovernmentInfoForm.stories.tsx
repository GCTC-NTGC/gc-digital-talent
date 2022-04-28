/* eslint-disable react/destructuring-assignment */
// needed for line 20 to operate as intended for Storybook
import React from "react";
import { Meta, Story } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { fakeClassifications, fakeUsers } from "@common/fakeData";
import pick from "lodash/pick";
import GovInfoFormContainer, { GovernmentInfoForm } from "./GovernmentInfoForm";

const fakeClass = fakeClassifications();
const fakeUser = fakeUsers(1)[0];

export default {
  component: GovInfoFormContainer,
  title: "Government Info Form",
} as Meta;

const TemplateGovInfoForm: Story = (args) => (
  <GovernmentInfoForm
    initialData={args.initialData}
    classifications={fakeClass}
    submitHandler={async (...data) => {
      action("Submit")(data);
    }}
  />
);

export const ADefaultArgs = TemplateGovInfoForm.bind({});
ADefaultArgs.args = {
  initialData: pick(fakeUser, [
    "id",
    "isGovEmployee",
    "interestedInLaterOrSecondment",
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

// TODO: implement when govEmployeeType added to api
// export const DCasualNoClass = TemplateGovInfoForm.bind({});
// DCasualNoClass.args = {
//   initialData: {
//     ...CStatusYes.args.initialData,
//     govEmployeeType: "casual",
//   },
// };

export const ECasualClassGroup = TemplateGovInfoForm.bind({});
ECasualClassGroup.args = {
  initialData: {
    ...CStatusYes.args.initialData,
    currentClassification: { group: "CS" },
  },
};

export const FCasualClassGroupLevel = TemplateGovInfoForm.bind({});
FCasualClassGroupLevel.args = {
  initialData: {
    ...ECasualClassGroup.args.initialData,
    currentClassification: { group: "CS", level: 3 },
  },
};
