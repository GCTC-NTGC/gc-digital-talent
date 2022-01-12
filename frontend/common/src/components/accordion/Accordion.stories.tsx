import React from "react";
import { Story, Meta } from "@storybook/react";
import { Accordion as AccordionComponent, Section } from "./Accordion";

export default {
  component: AccordionComponent,
  title: "Components/Accordion",
} as Meta;

const TemplateAccordion: Story = () => {
  return (
    <AccordionComponent>
      <Section heading="One">
        <AccordionComponent>
          <Section heading="level1">Level 1 </Section>
          <Section heading="level2">Level 2 </Section>
        </AccordionComponent>
      </Section>
      <Section heading="Two">Lorem ipsum dolor sit amet.</Section>
      <Section heading="Three">Lorem ipsum dolor sit amet.</Section>
    </AccordionComponent>
  );
};

export const Accordion = TemplateAccordion.bind({});
