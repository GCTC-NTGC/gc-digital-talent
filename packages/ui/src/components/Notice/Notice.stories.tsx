import { Meta, StoryObj } from "@storybook/react-vite";
import { faker } from "@faker-js/faker/locale/en";
import AcademicCapIcon from "@heroicons/react/24/outline/AcademicCapIcon";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import Notice, { NoticeProps, RootVariants } from "./Notice";
import Button from "../Button";
import Link from "../Link";
import { Container } from "../Container/Container";

faker.seed(0);

const meta = {
  component: Notice.Root,
  parameters: {
    chromatic: {
      modes: {
        light: allModes.light,
        "light mobile": allModes["light mobile"],
        dark: allModes.dark,
      },
    },
  },
} satisfies Meta<typeof Notice.Root>;

export default meta;

const colors: RootVariants["color"][] = [
  "gray",
  "primary",
  "secondary",
  "success",
  "warning",
  "error",
];

const Template = (props: NoticeProps) =>
  colors.map((color) => (
    <Notice.Root key={color} {...props} color={color}>
      <Notice.Title icon={AcademicCapIcon} as="h2">
        {props.mode} {color}
      </Notice.Title>
      <Notice.Content>
        <p>{faker.lorem.sentences(2)}</p>
      </Notice.Content>
      <Notice.Actions>
        <Button mode="inline" color={color === "gray" ? "black" : color}>
          Button
        </Button>
        <Link mode="inline" color={color === "gray" ? "black" : color} href="#">
          Link
        </Link>
      </Notice.Actions>
      <Notice.Footer>
        <p>{faker.lorem.sentence()}</p>
      </Notice.Footer>
    </Notice.Root>
  ));

export const Default: StoryObj<typeof Notice.Root> = {
  render: (args) => (
    <Container>
      <div className="flex flex-col gap-y-6">
        <Template {...args} />
      </div>
    </Container>
  ),
};

export const Card: StoryObj<typeof Notice.Root> = {
  args: {
    mode: "card",
  },
  render: (args) => (
    <Container>
      <div className="flex flex-col gap-y-6">
        <Template {...args} />
      </div>
    </Container>
  ),
};
