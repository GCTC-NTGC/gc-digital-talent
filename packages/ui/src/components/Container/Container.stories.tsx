import { Meta, StoryObj } from "@storybook/react";

import { Container } from "./Container";

const meta = {
  component: Container,
} satisfies Meta<typeof Container>;

export default meta;

export const Default: StoryObj<typeof Container> = {
  render: (args) => (
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
  ),
};
