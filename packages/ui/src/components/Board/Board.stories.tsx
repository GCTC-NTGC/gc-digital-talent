import type { StoryFn } from "@storybook/react";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import Board from "./Board";

export default {
  component: Board.Root,
  parameters: {
    chromatic: {
      modes: {
        light: allModes.light,
        dark: allModes.dark,
      },
    },
  },
};

const ITEMS = Array.from({ length: 50 })
  .map((_, i, a) => `List item ${a.length - i}`)
  .reverse();

const Template: StoryFn<typeof Board.Root> = () => (
  <Board.Root>
    <Board.Column>
      <Board.ColumnHeader prefix="Column 1">Column Header</Board.ColumnHeader>
      <Board.List>
        {ITEMS.map((item) => (
          <Board.ListItem key={`col-1-${item}`}>{item}</Board.ListItem>
        ))}
      </Board.List>
    </Board.Column>
    <Board.Column>
      <Board.ColumnHeader prefix="Column 2">Column Header</Board.ColumnHeader>
      <Board.Info title="Collapsible info" counter={20}>
        <p>
          Any content can go here to provide additional information about this
          column.
        </p>
      </Board.Info>
      <Board.List>
        {ITEMS.slice(0, 10).map((item) => (
          <Board.ListItem key={`col-1-${item}`}>{item}</Board.ListItem>
        ))}
      </Board.List>
    </Board.Column>
    <Board.Column>
      <Board.ColumnHeader prefix="Column 3">Column Header</Board.ColumnHeader>
      <Board.List>
        {ITEMS.map((item) => (
          <Board.ListItem key={`col-1-${item}`}>{item}</Board.ListItem>
        ))}
      </Board.List>
    </Board.Column>
    <Board.Column>
      <Board.ColumnHeader prefix="Column 4">Column Header</Board.ColumnHeader>
      <Board.List>
        {ITEMS.slice(0, 5).map((item) => (
          <Board.ListItem key={`col-1-${item}`}>{item}</Board.ListItem>
        ))}
      </Board.List>
    </Board.Column>
    <Board.Column>
      <Board.ColumnHeader prefix="Column 4">Column Header</Board.ColumnHeader>
      <Board.List>
        {ITEMS.slice(0, 20).map((item) => (
          <Board.ListItem key={`col-1-${item}`}>{item}</Board.ListItem>
        ))}
      </Board.List>
    </Board.Column>
  </Board.Root>
);

export const Default = Template.bind({});
