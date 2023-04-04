import React from "react";
import { Meta, ComponentStory } from "@storybook/react";
import { faker } from "@faker-js/faker";
import TreeView from "./TreeView";
import Button from "../Button";
import Accordion from "../Accordion";

export default {
  component: TreeView.Root,
  title: "Components/TreeView",
} as Meta;

const InitialModeView: ComponentStory<typeof TreeView.Root> = () => {
  return (
    <>
      <TreeView.Root
        title="Communication of technical information to non-technical audiences"
        subtitle="Communication of technical information is defined as the ability to share information in plain language so anyone can understand, regardless of technical knowledge."
        error="This required skill must have at least 1 résumé experience associated with it."
      >
        <TreeView.Item>
          <Button color="blue" mode="solid" type="button">
            <p>Connect a résumé experience</p>
          </Button>
        </TreeView.Item>
      </TreeView.Root>
      <TreeView.Root
        data-h2-margin-top="base(x2)"
        title="IT troubleshooting"
        subtitle="IT troubleshooting is defined as the ability to determine causes of operating errors and decide what to do about them."
        error="This required skill must have at least 1 résumé experience associated with it."
      >
        <TreeView.Item>
          <Button color="blue" mode="solid" type="button">
            <p>Connect a résumé experience</p>
          </Button>
        </TreeView.Item>
      </TreeView.Root>
    </>
  );
};

const DisplayModeView: ComponentStory<typeof TreeView.Root> = () => {
  return (
    <TreeView.Root
      title="Communication of technical information to non-technical audiences"
      subtitle="Communication of technical information is defined as the ability to share information in plain language so anyone can understand, regardless of technical knowledge."
    >
      <TreeView.Item>
        <Accordion.Root type="single" collapsible data-h2-margin-top="base(x1)">
          <Accordion.Item value="one">
            <Accordion.Trigger subtitle="Fortune 500 company">
              Junior Developer
            </Accordion.Trigger>
            <Accordion.Content>
              <p>{faker.lorem.sentences(5)}</p>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </TreeView.Item>
      <TreeView.Item>
        <Button color="blue" mode="solid" type="button">
          <p>Connect a résumé experience</p>
        </Button>
      </TreeView.Item>
    </TreeView.Root>
  );
};

export const InitialMode = InitialModeView.bind({});
export const DisplayMode = DisplayModeView.bind({});
