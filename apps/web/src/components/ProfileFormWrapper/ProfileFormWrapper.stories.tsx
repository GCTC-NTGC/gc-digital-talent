import React from "react";
import { action } from "@storybook/addon-actions";
import { Story, Meta } from "@storybook/react";
import { faker } from "@faker-js/faker";

import { BasicForm, Input } from "@gc-digital-talent/forms";
import ProfileFormWrapper, {
  ProfileFormWrapperProps,
} from "./ProfileFormWrapper";
import ProfileFormFooter, { ProfileFormFooterProps } from "./ProfileFormFooter";

export default {
  component: ProfileFormWrapper,
  title: "Components/Profile Form Wrapper",
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
        <div
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column)"
          data-h2-gap="base(x1 0)"
        >
          <Input id="email" label="Email" type="email" name="email" />
          <Input
            id="firstName"
            label="First Name"
            type="text"
            name="firstName"
          />
          <Input id="lastName" label="Last Name" type="text" name="lastName" />
        </div>
        <ProfileFormFooter mode={mode} />
      </BasicForm>
    </ProfileFormWrapper>
  );
};

export const CancelButton = TemplateProfileFormWrapper.bind({});
export const SaveButton = TemplateProfileFormWrapper.bind({});
export const BothButtons = TemplateProfileFormWrapper.bind({});

faker.seed(0);

CancelButton.args = {
  crumbs: [{ label: "About me", url: "#about-cancel" }],
  title: "About me",
  description: faker.lorem.sentences(4),
};

SaveButton.args = {
  crumbs: [{ label: "About me", url: "#about-save" }],
  title: "About me",
  description: faker.lorem.sentences(4),
  mode: "saveButton",
};

BothButtons.args = {
  crumbs: [{ label: "About me", url: "#about-both" }],
  title: "About me",
  description: faker.lorem.sentences(4),
  mode: "bothButtons",
};
