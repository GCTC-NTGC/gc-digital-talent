import React from "react";
import { Story, Meta } from "@storybook/react";
import ProfileFormWrapper, {
  ProfileFormWrapperProps,
} from "./ProfileFormWrapper";

export default {
  component: ProfileFormWrapper,
  title: "ApplicantProfile/ProfileFormWrapper",
  args: {
    links: [],
  },
} as Meta;

const TemplateProfileFormWrapper: Story<ProfileFormWrapperProps> = (args) => {
  return <ProfileFormWrapper {...args} />;
};

export const CancelButton = TemplateProfileFormWrapper.bind({});
export const SaveButton = TemplateProfileFormWrapper.bind({});
export const BothButtons = TemplateProfileFormWrapper.bind({});

CancelButton.args = {
  crumbs: [{ title: "About Me" }],
  title: "About me",
  description:
    "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Odit eligendi ut minima alias voluptates? Magni, nulla qui veritatis architecto ipsam magnam tenetur in eos! Omnis optio ex itaque possimus aut.",
};

SaveButton.args = {
  crumbs: [{ title: "About Me" }],
  title: "About me",
  description:
    "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Odit eligendi ut minima alias voluptates? Magni, nulla qui veritatis architecto ipsam magnam tenetur in eos! Omnis optio ex itaque possimus aut.",
  bottomButton: "save",
};

BothButtons.args = {
  crumbs: [{ title: "About Me" }],
  title: "About me",
  description:
    "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Odit eligendi ut minima alias voluptates? Magni, nulla qui veritatis architecto ipsam magnam tenetur in eos! Omnis optio ex itaque possimus aut.",
  bottomButton: "both",
};
