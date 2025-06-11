import { Meta, StoryFn } from "@storybook/react-vite";
import { faker } from "@faker-js/faker/locale/en";

import Button from "../Button";
import Accordion from "../Accordion/Accordion";
import Alert from "../Alert/Alert";
import TreeView from "./TreeView";
import Card from "../Card/Card";
import Heading from "../Heading";

faker.seed(0);

export default {
  component: TreeView.Root,
} as Meta;

const Template: StoryFn<typeof TreeView.Root> = () => {
  return (
    <TreeView.Root>
      <TreeView.Head>
        <Card>
          <Heading level="h2" data-h2-margin-top="base(0)">
            Heading
          </Heading>
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
        <Card>
          <Heading level="h3" data-h2-margin-top="base(0)">
            Card title
          </Heading>
          <p>{faker.lorem.sentences(4)}</p>
        </Card>
      </TreeView.Item>
      <TreeView.Item>
        <Button color="primary" mode="solid">
          Button label
        </Button>
      </TreeView.Item>
    </TreeView.Root>
  );
};

export const Default = {
  render: Template,
};
