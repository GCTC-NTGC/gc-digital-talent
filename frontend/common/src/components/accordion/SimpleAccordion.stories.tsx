import React from "react";
import { Story, Meta } from "@storybook/react";
import {
  Accordion as AccordionComponent,
  Section,
  AccordionProps,
} from "./Accordion";

export default {
  component: AccordionComponent,
  title: "Components/Accordion",
} as Meta;

const TemplateAccordion: Story<
  AccordionProps & { title: string; subtitle: string }
> = (args) => {
  const { title, subtitle, ...rest } = args;

  return (
    <AccordionComponent {...rest}>
      <Section title={title} subtitle={subtitle} simple>
        Lorem ipsum dolor sit amet.
      </Section>
    </AccordionComponent>
  );
};

export const SimpleAccordion = TemplateAccordion.bind({});
SimpleAccordion.args = {
  title: "title",
  subtitle: "subtitle",
};
