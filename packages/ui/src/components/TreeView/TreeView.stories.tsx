import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { faker } from "@faker-js/faker";

import Button from "../Button";
import Accordion from "../Accordion";
import Alert from "../Alert";
import TreeView from "./TreeView";
import { CardBasic } from "../Card";

faker.seed(0);

export default {
  component: TreeView.Root,
  title: "Components/TreeView",
} as Meta;

const DefaultView: StoryFn<typeof TreeView.Root> = () => {
  return (
    <TreeView.Root>
      <TreeView.Head>
        <CardBasic>
          <h2>Heading</h2>
          <p>Subtitle</p>
        </CardBasic>
      </TreeView.Head>
      <TreeView.Item noBranch>
        <Alert.Root type="warning" data-h2-margin="base(0, 0)">
          <Alert.Title>Error/Warning: {faker.lorem.sentences(1)}</Alert.Title>
        </Alert.Root>
      </TreeView.Item>
      <TreeView.Item>
        <Accordion.Root
          type="single"
          mode="card"
          collapsible
          data-h2-margin="base(0, 0)"
        >
          <Accordion.Item value="one">
            <Accordion.Trigger>Accordion Title</Accordion.Trigger>
            <Accordion.Content>
              <p>{faker.lorem.sentences(5)}</p>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </TreeView.Item>
      <TreeView.Item>
        <CardBasic>
          <h3>Card title</h3>
          <p>{faker.lorem.sentences(4)}</p>
        </CardBasic>
      </TreeView.Item>
      <TreeView.Item>
        <Button color="secondary" mode="solid">
          Button label
        </Button>
      </TreeView.Item>
    </TreeView.Root>
  );
};

export const Default = DefaultView.bind({});
