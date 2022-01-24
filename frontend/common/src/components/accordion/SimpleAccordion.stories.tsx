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
    <AccordionComponent {...rest}>
      <Section title={SectionTitle1} subtitle="subtitle" simple>
        Lorem ipsum dolor sit amet.
      </Section>
      <Section title={SectionTitle2} subtitle="" simple>
        Lorem ipsum dolor sit amet.
      </Section>
      <Section title={SectionTitle3} subtitle="" simple>
        Lorem ipsum dolor sit amet.
      </Section>
    </AccordionComponent>
  );
};

export const SimpleAccordion = TemplateAccordion.bind({});
SimpleAccordion.args = {
  SectionTitle1: "Section 1 title",
  SectionTitle2: "Section 2 title",
  SectionTitle3: "Section 3 title",
};
