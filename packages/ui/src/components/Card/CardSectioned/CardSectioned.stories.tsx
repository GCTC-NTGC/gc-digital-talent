import type { Meta, StoryFn } from "@storybook/react";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import CardSectioned from "./CardSectioned";

export default {
  component: CardSectioned.Root,
  parameters: {
    chromatic: {
      modes: {
        light: allModes.light,
        dark: allModes.dark,
      },
    },
  },
} satisfies Meta<typeof CardSectioned.Root>;

const Template: StoryFn<typeof CardSectioned.Root> = (args) => {
  const { children } = args;

  return <CardSectioned.Root>{children}</CardSectioned.Root>;
};

export const Default = Template.bind({});
Default.args = {
  children: (
    <>
      <CardSectioned.Item>Item 1</CardSectioned.Item>
      <CardSectioned.Item>Item 2</CardSectioned.Item>
      <CardSectioned.Item>Item 3</CardSectioned.Item>
    </>
  ),
};
