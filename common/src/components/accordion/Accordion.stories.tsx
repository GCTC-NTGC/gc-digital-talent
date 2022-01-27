import React from "react";
import { Story, Meta } from "@storybook/react";
import { AcademicCapIcon } from "@heroicons/react/solid";
import { Accordion as AccordionComponent, AccordionProps } from "./Accordion";

export default {
  component: AccordionComponent,
  title: "Components/Accordion",
} as Meta;

const TemplateAccordion: Story<AccordionProps & { title: string }> = (args) => {
  const { title, subtitle, ...rest } = args;

  return (
    <AccordionComponent
      title={title}
      subtitle={subtitle}
      Icon={AcademicCapIcon}
      defaultOpen
      simple={false}
    >
      Lorem ipsum dolor sit amet.
    </AccordionComponent>
  );
};

export const Accordion = TemplateAccordion.bind({});
Accordion.args = {
  title: "title",
  subtitle: "subtitle",
};
