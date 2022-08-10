import React from "react";
import type { Meta, Story } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { fakeUsers } from "@common/fakeData";
import type { InputMaybe, UpdateUserAsUserInput } from "../../api/generated";
import {
  DiversityEquityInclusionForm,
  type DiversityEquityInclusionFormProps,
} from "./DiversityEquityInclusionForm";
import { EquityKeys } from "./types";

const userData = fakeUsers();

export default {
  component: DiversityEquityInclusionForm,
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
  DiversityEquityInclusionFormProps
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
    const { isWoman, isIndigenous, isVisibleMinority, hasDisability } = data;

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
    <DiversityEquityInclusionForm
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
