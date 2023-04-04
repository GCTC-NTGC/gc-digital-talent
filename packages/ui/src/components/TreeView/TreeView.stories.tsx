import React from "react";
import { Meta, ComponentStory } from "@storybook/react";
import { faker } from "@faker-js/faker";
import TreeView from "./TreeView";
import Button from "../Button";
import Accordion from "../Accordion";
import Card from "../Card";

export default {
  component: TreeView.Root,
  title: "Components/TreeView",
} as Meta;

const DefaultView: ComponentStory<typeof TreeView.Root> = () => {
  return (
    <TreeView.Root
      title="Title"
      subtitle="Subtitle"
      error="Error/Warning message"
    >
      <TreeView.Item>
        <Accordion.Root type="single" collapsible data-h2-margin-top="base(x1)">
          <Accordion.Item value="one">
            <Accordion.Trigger subtitle="Accordion Subtitle">
              Accordion Title
            </Accordion.Trigger>
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
