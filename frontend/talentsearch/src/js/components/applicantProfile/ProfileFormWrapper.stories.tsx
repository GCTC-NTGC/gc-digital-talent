import React from "react";
import { action } from "@storybook/addon-actions";
import { Story, Meta } from "@storybook/react";
import { BasicForm, Input } from "@common/components/form";
import { faker } from "@faker-js/faker";
import ProfileFormWrapper, {
  ProfileFormWrapperProps,
} from "./ProfileFormWrapper";
import ProfileFormFooter, { ProfileFormFooterProps } from "./ProfileFormFooter";

export default {
  component: ProfileFormWrapper,
  title: "ApplicantProfile/ProfileFormWrapper",
  args: {
    mode: "cancelButton",
  },
} as Meta;

const TemplateProfileFormWrapper: Story<
  ProfileFormWrapperProps & ProfileFormFooterProps
> = (args) => {
  const { mode } = args;
  return (
    <ProfileFormWrapper {...args}>
      <BasicForm
        onSubmit={async () => {
          await new Promise((resolve) => {
            setTimeout(resolve, 1000);
          });
          action("Save Form")();
          return null;
        }}
      >
        <Input id="email" label="Email" type="email" name="email" />
        <Input id="firstName" label="First Name" type="text" name="firstName" />
        <Input id="lastName" label="Last Name" type="text" name="lastName" />
        <ProfileFormFooter mode={mode} />
      </BasicForm>
    </ProfileFormWrapper>
  );
};

export const CancelButton = TemplateProfileFormWrapper.bind({});
export const SaveButton = TemplateProfileFormWrapper.bind({});
export const BothButtons = TemplateProfileFormWrapper.bind({});

CancelButton.args = {
  crumbs: [{ title: "About Me" }],
  title: "About me",
  description: faker.lorem.sentences(4),
};

SaveButton.args = {
  crumbs: [{ title: "About Me" }],
  title: "About me",
  description: faker.lorem.sentences(4),
  mode: "saveButton",
};

BothButtons.args = {
  crumbs: [{ title: "About Me" }],
  title: "About me",
  description: faker.lorem.sentences(4),
  mode: "bothButtons",
};
