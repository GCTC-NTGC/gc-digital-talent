import { StoryFn, Meta } from "@storybook/react";
import UserPlusIcon from "@heroicons/react/24/solid/UserPlusIcon";
import AcademicCapIcon from "@heroicons/react/24/solid/AcademicCapIcon";
import ChatBubbleBottomCenterIcon from "@heroicons/react/20/solid/ChatBubbleBottomCenterIcon";
import { FormProvider, useForm } from "react-hook-form";

import { allModes } from "@gc-digital-talent/storybook-helpers";
import { Input, Submit } from "@gc-digital-talent/forms";

import Hero from "./Hero";

export default {
  component: Hero,
  args: {
    title: "Hero",
    subtitle: "Subtitle",
    crumbs: [
      {
        label: "Home",
        url: "#home",
      },
      {
        label: "One",
        url: "#one",
      },
      {
        label: "Two",
        url: "#two",
      },
    ],
  },
  parameters: {
    chromatic: {
      modes: {
        light: allModes.light,
        "light mobile": allModes["light mobile"],
        dark: allModes.dark,
        "light iap": allModes["light iap desktop"],
        "dark iap": allModes["dark iap desktop"],
      },
    },
  },
} as Meta<typeof Hero>;

const Template: StoryFn<typeof Hero> = (args) => <Hero {...args} />;

export const ButtonsAndTabs = Template.bind({});
ButtonsAndTabs.args = {
  buttonLinks: [
    { icon: UserPlusIcon, text: "Hello", url: "#one", color: "quinary" },
    {
      icon: AcademicCapIcon,
      text: "Hello hello",
      url: "#two",
      color: "primary",
    },
    {
      icon: ChatBubbleBottomCenterIcon,
      text: "And goodbye",
      url: "#two",
      color: "tertiary",
    },
  ],
  navTabs: [
    { url: "#one", label: "One" },
    { url: "#two", label: "Two" },
    { url: "#three", label: "Three" },
  ],
};

export const Buttons = Template.bind({});
Buttons.args = {
  buttonLinks: [
    {
      icon: UserPlusIcon,
      text: "Hello",
      url: "#one",
      color: "secondaryDarkFixed",
    },
    {
      icon: AcademicCapIcon,
      text: "Hello hello",
      url: "#two",
      color: "warning",
    },
    {
      icon: ChatBubbleBottomCenterIcon,
      text: "And goodbye",
      url: "#two",
      color: "error",
    },
  ],
};

export const Tabs = Template.bind({});
Tabs.args = {
  navTabs: [
    { url: "#one", label: "One" },
    { url: "#two", label: "Two" },
    { url: "#three", label: "Three" },
  ],
};

export const NeitherButtonsOrTabs = Template.bind({});
NeitherButtonsOrTabs.args = {};

export const Overlap = Template.bind({});
Overlap.args = {
  overlap: true,
};

export const ButtonsAndTabsWithCentering = Template.bind({});
ButtonsAndTabsWithCentering.args = {
  buttonLinks: [
    { icon: UserPlusIcon, text: "Hello", url: "#one", color: "primary" },
    {
      icon: AcademicCapIcon,
      text: "Hello hello",
      url: "#two",
      color: "secondary",
    },
    {
      icon: ChatBubbleBottomCenterIcon,
      text: "And goodbye",
      url: "#two",
      color: "tertiary",
    },
  ],
  navTabs: [
    { url: "#one", label: "One" },
    { url: "#two", label: "Two" },
    { url: "#three", label: "Three" },
  ],
  centered: true,
};

// overlap story
interface FormValues {
  one: string;
  two: string;
  three: string;
}
const FormComponent = () => {
  const methods = useForm<FormValues>({});
  return (
    <section data-h2-wrapper="base(center, s)">
      <FormProvider {...methods}>
        <form
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column)"
          data-h2-gap="base(x.5 0)"
        >
          <Input id="one" name="one" label="One" type="number" />
          <Input id="two" name="two" label="Two" type="text" />
          <Input id="three" name="three" label="Three" type="text" />
          <div data-h2-align-self="base(flex-start)">
            <Submit />
          </div>
        </form>
      </FormProvider>
    </section>
  );
};
const TemplateWithContent: StoryFn<typeof Hero> = (args) => (
  <>
    <Hero {...args} />
    <FormComponent data-h2-max-width="base(50%)"></FormComponent>
  </>
);
export const OverlapWithContent = TemplateWithContent.bind({});
OverlapWithContent.args = {
  overlap: true,
};
