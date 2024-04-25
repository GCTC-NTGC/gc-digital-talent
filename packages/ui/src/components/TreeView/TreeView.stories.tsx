import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { faker } from "@faker-js/faker";

import Button from "../Button";
import Accordion from "../Accordion";
import Card from "../Card";
import Alert from "../Alert";
import TreeView from "./TreeView";

faker.seed(0);

export default {
  component: TreeView.Root,
} as Meta;

const Template: StoryFn<typeof TreeView.Root> = () => {
  return (
    <TreeView.Root>
      <TreeView.Head>
        <Card title="Title" color="white" bold>
          <p>Subtitle</p>
        </Card>
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
        <Card title="Card Title" color="white" bold>
          {faker.lorem.sentences(4)}
        </Card>
      </TreeView.Item>
      <TreeView.Item>
        <Button color="secondary" mode="solid">
          Button label
        </Button>
      </TreeView.Item>
    </TreeView.Root>
  );
};

export const Default = Template.bind({});
