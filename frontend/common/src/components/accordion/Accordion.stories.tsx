import React from "react";
import { Story, Meta } from "@storybook/react";
import { AcademicCapIcon } from "@heroicons/react/solid";
import { Accordion as AccordionComponent, AccordionProps } from "./Accordion";
import Button from "../Button";

export default {
  component: AccordionComponent,
  title: "Components/Accordion",
} as Meta;

const TemplateAccordion: Story<AccordionProps> = (args) => {
  const { title, subtitle, context, simple, defaultOpen, children } = args;

  return (
    <AccordionComponent
      title={title}
      subtitle={subtitle}
      context={context}
      Icon={AcademicCapIcon}
      defaultOpen={defaultOpen}
      simple={simple}
    >
      {children}
    </AccordionComponent>
  );
};

export const AccordionFull = TemplateAccordion.bind({});
export const AccordionSimple = TemplateAccordion.bind({});
export const AccordionNested = TemplateAccordion.bind({});
export const AccordionDefaultOpen = TemplateAccordion.bind({});

AccordionFull.args = {
  title: "Full Accordion With Borders",
  subtitle: "subtitle",
  context: "context",
  children: "Lorem ipsum dolor sit amet.",
};

AccordionSimple.args = {
  title: "Simple Accordion",
  subtitle: "subtitle",
  context: "context",
  simple: true,
  children: "Lorem ipsum dolor sit amet.",
};

AccordionNested.args = {
  title: "title",
  subtitle: "subtitle",
  context: "context",
  children: (
    <AccordionComponent
      title="nested title"
      subtitle="nested subtitle"
      context="nested context"
      Icon={AcademicCapIcon}
      defaultOpen={false}
      simple={false}
    >
      <Button mode="outline" color="primary">
        <span>SUBMIT </span>
      </Button>
    </AccordionComponent>
  ),
};

AccordionDefaultOpen.args = {
  title: "title",
  subtitle: "subtitle",
  context: "context",
  defaultOpen: true,
  children: "Lorem ipsum dolor sit amet.",
};
