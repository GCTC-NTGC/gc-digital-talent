import { Meta, StoryObj } from "@storybook/react";

import { Container } from "./Container";

const meta = {
  component: Container,
} satisfies Meta<typeof Container>;

export default meta;

export const Default: StoryObj<typeof Container> = {
  render: (args) => (
    <>
      <p>Tailwind</p>
      <div className="flex flex-col gap-y-6 *:h-12 *:bg-gray">
        <Container {...args} size="sm">
          SM
        </Container>
        <Container {...args} size="md">
          MD
        </Container>
        <Container {...args} size="lg">
          LG
        </Container>
        <Container {...args} size="full">
          Full
        </Container>
        <Container
          {...args}
          size={{ base: "full", sm: "sm", md: "md", lg: "lg" }}
        >
          Variable
        </Container>
      </div>
      <p>Hydrogen</p>
      <div className="flex flex-col gap-y-6 *:h-12 *:bg-gray">
        <div data-h2-wrapper="base(left, small, x1)">SM</div>
        <div data-h2-wrapper="base(left, medium, x1)">MD</div>
        <div data-h2-wrapper="base(left, large, x1)">LG</div>
        <div data-h2-wrapper="base(left, full, x1)">Full</div>
      </div>
    </>
  ),
};
