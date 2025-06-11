import { StoryFn } from "@storybook/react-vite";
import { action } from "@storybook/addon-actions";
import { faker } from "@faker-js/faker/locale/en";

import { VIEWPORT, allModes } from "@gc-digital-talent/storybook-helpers";
import { Link } from "@gc-digital-talent/ui";

import Form from "../BasicForm";
import Submit from "../Submit";
import RadioGroup from "./RadioGroup";

faker.seed(0);

export default {
  component: RadioGroup,
};

const Template: StoryFn<typeof RadioGroup> = (args) => (
  <Form onSubmit={action("Submit Form")}>
    <RadioGroup {...args} />
    <Submit className="mt-6" />
  </Form>
);

export const Default = Template.bind({});
Default.args = {
  idPrefix: "radiogroup",
  legend: "Which item do you want to check?",
  name: "radiogroup",
  items: [
    { value: "one", label: "Box One" },
    { value: "two", label: "Box Two" },
    { value: "three", label: "Box Three" },
  ],
};
Default.parameters = {
  chromatic: {
    modes: {
      light: allModes.light,
      "light mobile": allModes["light mobile"],
      dark: allModes.dark,
    },
  },
};

export const WithContext = Template.bind({});
WithContext.args = {
  ...Default.args,
  context:
    "Check the action tab after submitting to see how the form values are represented.",
};

export const Elements = Template.bind({});
Elements.args = {
  idPrefix: "elements",
  legend: "Look at these elements",
  name: "elements",
  items: [
    {
      value: "one",
      label: (
        <span className="bg-error-200 dark:bg-error-500">Red Selection</span>
      ),
    },
    {
      value: "two",
      label: <span className="bg-white">White Selection</span>,
    },
    {
      value: "three",
      label: <span className="font-bold">Bold Selection</span>,
    },
  ],
};

export const Large = Template.bind({});
Large.parameters = {
  viewport: {
    defaultViewport: VIEWPORT.PHONE,
  },
};
Large.args = {
  idPrefix: "radiogroup",
  legend: "Which item do you want to check?",
  name: "radiogroup",
  items: [
    { value: "one", label: "This is the first item" },
    { value: "two", label: "This is the second item" },
    { value: "three", label: "This is the third item" },
    { value: "four", label: "This is the fourth item" },
    { value: "five", label: "This is the fifth item" },
    { value: "six", label: "This is the sixth item" },
    { value: "seven", label: "This is the seventh item" },
  ],
  columns: 2,
};

export const LongLegend = Template.bind({});
LongLegend.args = {
  ...Default.args,
  legend:
    "This is a super, super long title which will wrap around to a second line at some point. Fusce lacinia sollicitudin nulla, sit amet semper metus mattis id. Suspendisse nisl enim, bibendum sed sem eget, porttitor ultrices metus.",
};

export const ContentBelow = Template.bind({});
ContentBelow.args = {
  ...Default.args,
  items: [
    {
      value: "one",
      label: "Box One",
      contentBelow: faker.lorem.lines(6),
    },
    {
      value: "two",
      label: "Box Two",
      contentBelow: (
        <p>
          Wrapped in a p.
          <br />
          {faker.lorem.lines(6)}
        </p>
      ),
    },
    {
      value: "three",
      label: "Box three",
      contentBelow: (
        <p>
          Wrapped in a p with link and a ul.
          <br />
          {faker.lorem.lines(6)}{" "}
          <Link href="#" color="black" newTab external>
            An external link with a lot of words
          </Link>
          . {faker.lorem.lines(2)}
          <ul className="list-disc pl-8">
            <li>List item 1</li>
            <li>List item 2</li>
            <li>List item 3</li>
            <li>List item 4</li>
          </ul>
        </p>
      ),
    },
  ],
};
