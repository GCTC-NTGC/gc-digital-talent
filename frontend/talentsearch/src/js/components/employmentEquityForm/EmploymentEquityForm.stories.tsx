import React from "react";
import type { Meta, Story } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { fakeUsers } from "@common/fakeData";
import {
  IndigenousCommunity,
  InputMaybe,
  UpdateUserAsUserInput,
} from "../../api/generated";
import {
  EmploymentEquityForm,
  type EmploymentEquityFormProps,
} from "./EmploymentEquityForm";
import { EquityKeys } from "./types";

const userData = fakeUsers();

export default {
  component: EmploymentEquityForm,
  title: "DiversityEquityInclusionForm",
  args: {
    user: userData[0],
    isMutating: false,
  },
  argTypes: {
    isMutating: {
      label: "Executing Mutation",
      type: { name: "boolean", required: false },
    },
  },
} as Meta;

const TemplateDiversityEquityInclusionForm: Story<
  EmploymentEquityFormProps
> = ({ user, isMutating }) => {
  const [mockUser, setMockUser] = React.useState(user);

  const dataToUpdateUser = (key: EquityKeys, value: InputMaybe<boolean>) => {
    return typeof value !== "undefined"
      ? {
          [key]: value,
        }
      : {};
  };

  const handleUpdate = (data: UpdateUserAsUserInput) => {
    const { isWoman, indigenousCommunities, isVisibleMinority, hasDisability } =
      data;

    const isIndigenous = indigenousCommunities?.includes(
      IndigenousCommunity.LegacyIsIndigenous,
    );
    const newUser = {
      ...dataToUpdateUser("isWoman", isWoman),
      ...dataToUpdateUser("isIndigenous", isIndigenous),
      ...dataToUpdateUser("isVisibleMinority", isVisibleMinority),
      ...dataToUpdateUser("hasDisability", hasDisability),
    };
    action("Setting mock user")(newUser);

    setMockUser({
      ...mockUser,
      ...newUser,
    });
  };

  return (
    <EmploymentEquityForm
      user={mockUser}
      isMutating={isMutating}
      onUpdate={async (_: string, data: UpdateUserAsUserInput) => {
        handleUpdate(data);
        action("Update Diversity, Equity, Inclusion Information")(data);
        return null;
      }}
    />
  );
};

export const IndividualDiversityEquityInclusionForm =
  TemplateDiversityEquityInclusionForm.bind({});

export const LoadingDiversityEquityInclusionForm =
  TemplateDiversityEquityInclusionForm.bind({});

LoadingDiversityEquityInclusionForm.args = {
  isMutating: true,
};
