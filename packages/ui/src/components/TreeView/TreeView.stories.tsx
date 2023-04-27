import React from "react";
import { Meta, ComponentStory } from "@storybook/react";
import { faker } from "@faker-js/faker";
import TreeView from "./TreeView";
import Button from "../Button";
import Accordion from "../Accordion";
import Card from "../Card";
import Alert from "../Alert";
import { StandardHeader } from "../Accordion/StandardHeader";

export default {
  component: TreeView.Root,
  title: "Components/TreeView",
} as Meta;

const DefaultView: ComponentStory<typeof TreeView.Root> = () => {
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
        <Accordion.Root type="single" collapsible data-h2-margin="base(0, 0)">
          <Accordion.Item value="one">
            <StandardHeader>Accordion Title</StandardHeader>
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
        <Button color="blue" mode="solid" type="button">
          Button label
        </Button>
      </TreeView.Item>
    </TreeView.Root>
  );
};

export const Default = DefaultView.bind({});
