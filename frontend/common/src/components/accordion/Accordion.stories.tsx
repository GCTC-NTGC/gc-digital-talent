import React from "react";
import { Story, Meta } from "@storybook/react";
import { AcademicCapIcon } from "@heroicons/react/solid";
import {
  Accordion as AccordionComponent,
  Section,
  AccordionProps,
} from "./Accordion";

export default {
  component: AccordionComponent,
  title: "Components/Accordion",
} as Meta;

const TemplateAccordion: Story<AccordionProps & { title: string }> = (args) => {
  const { SectionTitle1, SectionTitle2, SectionTitle3, ...rest } = args;

  return (
    <AccordionComponent defaultOpenIndex="undefined" {...rest}>
      <Section title={SectionTitle1} subtitle="subtitle" Icon={AcademicCapIcon}>
        first section
      </Section>
      <Section title={SectionTitle2} subtitle="" Icon={AcademicCapIcon}>
        Lorem ipsum dolor sit amet.
      </Section>
      <Section title={SectionTitle3} subtitle="" Icon={AcademicCapIcon}>
        Lorem ipsum dolor sit amet.
      </Section>
    </AccordionComponent>
  );
};

export const Accordion = TemplateAccordion.bind({});
Accordion.args = {
  SectionTitle1: "Section 1 title",
  SectionTitle2: "Section 2 title",
  SectionTitle3: "Section 3 title",
};
