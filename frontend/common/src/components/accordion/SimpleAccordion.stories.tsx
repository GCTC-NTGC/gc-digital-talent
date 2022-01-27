import React from "react";
import { Story, Meta } from "@storybook/react";
import { Accordion as AccordionComponent, AccordionProps } from "./Accordion";

export default {
  component: AccordionComponent,
  title: "Components/Accordion",
} as Meta;

const TemplateAccordion: Story<
  AccordionProps & { title: string; subtitle: string }
> = (args) => {
  const { title, subtitle, ...rest } = args;

  return (
    <AccordionComponent title={title} subtitle={subtitle} defaultOpen simple>
      Lorem ipsum dolor sit amet.
    </AccordionComponent>
  );
};

export const SimpleAccordion = TemplateAccordion.bind({});
SimpleAccordion.args = {
  title: "title",
  subtitle: "subtitle",
};
