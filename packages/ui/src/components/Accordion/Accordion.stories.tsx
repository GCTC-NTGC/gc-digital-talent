import React from "react";
import type { ComponentStory, ComponentMeta } from "@storybook/react";
import { faker } from "@faker-js/faker";

import AccordionDocs from "./Accordion.docs.mdx";
import Accordion from "./Accordion";
import Link from "../Link";

const { Item, Trigger, Content, Root } = Accordion;

const Text = () => {
  faker.seed(0);
  return <p>{faker.lorem.sentences(5)}</p>;
};

export default {
  component: Accordion.Root,
  title: "Components/Accordion",
  subcomponents: {
    Root,
    Item,
    Trigger,
    Content,
  },
  parameters: {
    docs: {
      page: AccordionDocs,
    },
  },
} as ComponentMeta<typeof Accordion.Root>;

const Template: ComponentStory<typeof Accordion.Root> = ({
  children,
  ...rest
}) => {
  return (
    <Accordion.Root {...rest}>
      <Accordion.Item value="one">
        <Accordion.Header>
          <Accordion.Trigger>Accordion One</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>{children}</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="two">
        <Accordion.Header>
          <Accordion.Trigger>Accordion Two</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>{children}</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="three">
        <Accordion.Header>
          <Accordion.Trigger>Accordion Three</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>{children}</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
};

const TemplateWithCustomHeader: ComponentStory<typeof Accordion.Root> = ({
  children,
  ...rest
}) => {
  return (
    <Accordion.Root {...rest}>
      <Accordion.Item value="one">
        <Accordion.Header
          data-h2-flex-grow="base(1)"
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(row)"
          data-h2-gap="base(x.5 0)"
        >
          <Accordion.Trigger>
            <div
              data-h2-flex-grow="base(1)"
              data-h2-display="base(flex)"
              data-h2-flex-direction="base(row)"
              data-h2-gap="base(x.5 0)"
            >
              <div
                data-h2-flex-grow="base(1)"
                data-h2-display="base(flex)"
                data-h2-flex-direction="base(column)"
                data-h2-gap="base(x.5 0)"
              >
                <span
                  data-h2-display="base(block)"
                  data-h2-font-size="base(h6, 1)"
                >
                  <span data-h2-font-weight="base(700)">Custom</span>
                  {" Title"}
                </span>
                <span
                  className="Accordion__Subtitle"
                  data-h2-display="base(block)"
                  data-h2-font-size="base(copy)"
                  data-h2-margin="base(x.25, 0, 0, 0)"
                >
                  <span data-h2-color="base(primary)">Example</span>
                  <span
                    data-h2-margin="base(0,x.5)"
                    data-h2-color="base(gray.lighter)"
                  >
                    |
                  </span>
                  <span>Date Range</span>
                </span>
              </div>
            </div>
          </Accordion.Trigger>
          <div>
            <Link
              href="/"
              data-h2-font-size="base(h6, 1)"
              data-h2-color="base(primary.darker)"
              data-h2-font-weight="base(700)"
            >
              Edit
            </Link>
          </div>
        </Accordion.Header>
        <Accordion.Content>{children}</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
};

export const Default = Template.bind({});
Default.args = {
  type: "single",
  collapsible: true,
  children: <Text />,
};

export const Simple = Template.bind({});
Simple.args = {
  type: "single",
  mode: "simple",
  collapsible: true,
  children: <Text />,
};

export const DefaultOpen = Template.bind({});
DefaultOpen.args = {
  defaultValue: "one",
  type: "single",
  collapsible: true,
  children: <Text />,
};

export const Nested = Template.bind({});
Nested.args = {
  type: "single",
  collapsible: true,
  children: (
    <>
      <Text />
      <Accordion.Root type="single" collapsible mode="simple">
        <Accordion.Item value="two">
          <Accordion.Header>
            <Accordion.Trigger>Accordion Two</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>
            <Text />
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </>
  ),
};

export const WithEditLink = TemplateWithCustomHeader.bind({});
WithEditLink.args = {
  type: "single",
  collapsible: true,
  children: <Text />,
};
