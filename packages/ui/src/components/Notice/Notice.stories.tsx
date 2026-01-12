import { Meta, StoryObj } from "@storybook/react-vite";
import { faker } from "@faker-js/faker/locale/en";
import AcademicCapIcon from "@heroicons/react/24/outline/AcademicCapIcon";
import { action } from "storybook/actions";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import Notice, { NoticeProps } from "./Notice";
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
    design: {
      type: "figma",
      url: "https://www.figma.com/design/guHeIIh8dqFVCks310Wv0G/Component-library?node-id=4849-92336&t=epSg2B3tLfjkZqQi-0",
    },
  },
} satisfies Meta<typeof Notice.Root>;

export default meta;

const Template = (props: NoticeProps) => {
  const mode = props.mode ?? "inline";

  return (
    <div className="flex flex-col gap-y-6">
      <Notice.Root {...props} color="gray">
        <Notice.Title defaultIcon as="h2">
          {mode.charAt(0).toUpperCase() + mode.slice(1)} gray (default)
        </Notice.Title>
        <Notice.Content>
          <p>{faker.lorem.sentences(8)}</p>
        </Notice.Content>
        <Notice.Actions>
          <Button mode="inline" color="black">
            Button
          </Button>
          <Link mode="inline" color="black" href="#">
            Link
          </Link>
        </Notice.Actions>
        <Notice.Footer>
          <p>{faker.lorem.sentence()}</p>
        </Notice.Footer>
      </Notice.Root>
      <Notice.Root {...props} color="primary">
        <Notice.Title icon={AcademicCapIcon} as="h2">
          {mode.charAt(0).toUpperCase() + mode.slice(1)} primary (icon override)
        </Notice.Title>
        <Notice.Content>
          <p>{faker.lorem.sentences(2)}</p>
        </Notice.Content>
        <Notice.Actions>
          <Button mode="inline" color="primary">
            Button
          </Button>
          <Link mode="inline" color="primary" href="#">
            Link
          </Link>
        </Notice.Actions>
        <Notice.Footer>
          <p>{faker.lorem.sentence()}</p>
        </Notice.Footer>
      </Notice.Root>
      <Notice.Root {...props} color="secondary">
        <Notice.Title defaultIcon as="h2">
          {mode.charAt(0).toUpperCase() + mode.slice(1)} secondary
        </Notice.Title>
        <Notice.Content>
          <p>{faker.lorem.sentences(2)}</p>
        </Notice.Content>
        <Notice.Actions>
          <Button mode="inline" color="secondary">
            Button
          </Button>
          <Link mode="inline" color="secondary" href="#">
            Link
          </Link>
        </Notice.Actions>
        <Notice.Footer>
          <p>{faker.lorem.sentence()}</p>
        </Notice.Footer>
      </Notice.Root>
      <Notice.Root {...props} color="success">
        <Notice.Title defaultIcon as="h2">
          {mode.charAt(0).toUpperCase() + mode.slice(1)} success
        </Notice.Title>
        <Notice.Content>
          <p>{faker.lorem.sentences(2)}</p>
        </Notice.Content>
        <Notice.Actions>
          <Button mode="inline" color="success">
            Button
          </Button>
          <Link mode="inline" color="success" href="#">
            Link
          </Link>
        </Notice.Actions>
        <Notice.Footer>
          <p>{faker.lorem.sentence()}</p>
        </Notice.Footer>
      </Notice.Root>
      <Notice.Root {...props} color="warning">
        <Notice.Title defaultIcon as="h2">
          {mode.charAt(0).toUpperCase() + mode.slice(1)} warning
        </Notice.Title>
        <Notice.Content>
          <p>{faker.lorem.sentences(2)}</p>
        </Notice.Content>
        <Notice.Actions>
          <Button mode="inline" color="warning">
            Button
          </Button>
          <Link mode="inline" color="warning" href="#">
            Link
          </Link>
        </Notice.Actions>
        <Notice.Footer>
          <p>{faker.lorem.sentence()}</p>
        </Notice.Footer>
      </Notice.Root>
      <Notice.Root {...props} color="error">
        <Notice.Title defaultIcon as="h2">
          {mode.charAt(0).toUpperCase() + mode.slice(1)} error
        </Notice.Title>
        <Notice.Content>
          <p>{faker.lorem.sentences(2)}</p>
        </Notice.Content>
        <Notice.Actions>
          <Button mode="inline" color="error">
            Button
          </Button>
          <Link mode="inline" color="error" href="#">
            Link
          </Link>
        </Notice.Actions>
        <Notice.Footer>
          <p>{faker.lorem.sentence()}</p>
        </Notice.Footer>
      </Notice.Root>
    </div>
  );
};

export const Default: StoryObj<typeof Notice.Root> = {
  args: {
    onDismiss: () => action("dismiss")(),
  },
  render: (args) => (
    <Container>
      <Template {...args} />
    </Container>
  ),
};

export const Card: StoryObj<typeof Notice.Root> = {
  args: {
    onDismiss: () => action("dismiss")(),
    mode: "card",
  },
  render: (args) => (
    <Container>
      <Template {...args} />
    </Container>
  ),
};

export const Basic: StoryObj<typeof Notice.Root> = {
  render: () => (
    <Container>
      <Notice.Root>
        <Notice.Title>Basic notice</Notice.Title>
        <Notice.Content>
          <p>{faker.lorem.paragraph()}</p>
        </Notice.Content>
      </Notice.Root>
    </Container>
  ),
};

export const Small: StoryObj<typeof Notice.Root> = {
  args: {
    onDismiss: () => action("dismiss")(),
    small: true,
    color: "gray",
  },
  render: (args) => (
    <Container>
      <div className="flex flex-col gap-y-6">
        <Notice.Root {...args} mode="inline">
          <Notice.Title icon={AcademicCapIcon} as="h2">
            Small (inline)
          </Notice.Title>
          <Notice.Content>
            <p>{faker.lorem.paragraph()}</p>
          </Notice.Content>
          <Notice.Actions>
            <Button
              mode="inline"
              size="sm"
              color={args.color === "gray" ? "black" : args.color}
            >
              Button
            </Button>
            <Link
              mode="inline"
              color={args.color === "gray" ? "black" : args.color}
              href="#"
              size="sm"
            >
              Link
            </Link>
          </Notice.Actions>
          <Notice.Footer>
            <p>{faker.lorem.sentence()}</p>
          </Notice.Footer>
        </Notice.Root>
        <Notice.Root {...args} mode="card">
          <Notice.Title icon={AcademicCapIcon} as="h2">
            Small (card)
          </Notice.Title>
          <Notice.Content>
            <p>{faker.lorem.paragraph()}</p>
          </Notice.Content>
          <Notice.Actions>
            <Button
              mode="inline"
              size="sm"
              color={args.color === "gray" ? "black" : args.color}
            >
              Button
            </Button>
            <Link
              mode="inline"
              color={args.color === "gray" ? "black" : args.color}
              href="#"
              size="sm"
            >
              Link
            </Link>
          </Notice.Actions>
          <Notice.Footer>
            <p>{faker.lorem.sentence()}</p>
          </Notice.Footer>
        </Notice.Root>
      </div>
    </Container>
  ),
};

export const NoIcon: StoryObj<typeof Notice.Root> = {
  args: {
    onDismiss: () => action("dismiss")(),
    color: "gray",
  },
  render: (args) => (
    <Container>
      <div className="flex flex-col gap-y-6">
        <Notice.Root {...args} mode="inline">
          <Notice.Title as="h2">No icon (inline)</Notice.Title>
          <Notice.Content>
            <p>{faker.lorem.paragraph()}</p>
          </Notice.Content>
          <Notice.Actions>
            <Button
              mode="inline"
              size="sm"
              color={args.color === "gray" ? "black" : args.color}
            >
              Button
            </Button>
            <Link
              mode="inline"
              color={args.color === "gray" ? "black" : args.color}
              href="#"
              size="sm"
            >
              Link
            </Link>
          </Notice.Actions>
          <Notice.Footer>
            <p>{faker.lorem.sentence()}</p>
          </Notice.Footer>
        </Notice.Root>
        <Notice.Root {...args} mode="card">
          <Notice.Title as="h2">No icon (card)</Notice.Title>
          <Notice.Content>
            <p>{faker.lorem.paragraph()}</p>
          </Notice.Content>
          <Notice.Actions>
            <Button
              mode="inline"
              size="sm"
              color={args.color === "gray" ? "black" : args.color}
            >
              Button
            </Button>
            <Link
              mode="inline"
              color={args.color === "gray" ? "black" : args.color}
              href="#"
              size="sm"
            >
              Link
            </Link>
          </Notice.Actions>
          <Notice.Footer>
            <p>{faker.lorem.sentence()}</p>
          </Notice.Footer>
        </Notice.Root>
      </div>
    </Container>
  ),
};

export const NonDismissible: StoryObj<typeof Notice.Root> = {
  args: {
    small: false,
    color: "gray",
  },
  render: (args) => (
    <Container>
      <div className="flex flex-col gap-y-6">
        <Notice.Root {...args} mode="inline">
          <Notice.Title icon={AcademicCapIcon} as="h2">
            Non-Dismissible (inline)
          </Notice.Title>
          <Notice.Content>
            <p>{faker.lorem.paragraph()}</p>
          </Notice.Content>
          <Notice.Actions>
            <Button
              mode="inline"
              size="sm"
              color={args.color === "gray" ? "black" : args.color}
            >
              Button
            </Button>
            <Link
              mode="inline"
              color={args.color === "gray" ? "black" : args.color}
              href="#"
              size="sm"
            >
              Link
            </Link>
          </Notice.Actions>
          <Notice.Footer>
            <p>{faker.lorem.sentence()}</p>
          </Notice.Footer>
        </Notice.Root>
        <Notice.Root {...args} mode="card">
          <Notice.Title icon={AcademicCapIcon} as="h2">
            Non-Dismissible (card)
          </Notice.Title>
          <Notice.Content>
            <p>{faker.lorem.paragraph()}</p>
          </Notice.Content>
          <Notice.Actions>
            <Button
              mode="inline"
              size="sm"
              color={args.color === "gray" ? "black" : args.color}
            >
              Button
            </Button>
            <Link
              mode="inline"
              color={args.color === "gray" ? "black" : args.color}
              href="#"
              size="sm"
            >
              Link
            </Link>
          </Notice.Actions>
          <Notice.Footer>
            <p>{faker.lorem.sentence()}</p>
          </Notice.Footer>
        </Notice.Root>
      </div>
    </Container>
  ),
};
