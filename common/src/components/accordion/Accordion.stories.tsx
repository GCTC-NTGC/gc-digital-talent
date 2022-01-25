import React from "react";
import { Story, Meta } from "@storybook/react";
import { AcademicCapIcon } from "@heroicons/react/solid";
import { Accordion as AccordionComponent, Section } from "./Accordion";
import { ExternalSectionProps } from "./Section";

export default {
  component: AccordionComponent,
  title: "Components/Accordion",
} as Meta;

const TemplateAccordion: Story<ExternalSectionProps & { title: string }> = (
  args,
) => {
  const { title, subtitle, ...rest } = args;
  return (
    <AccordionComponent {...rest}>
      <Section
        title={title}
        subtitle={subtitle}
        Icon={AcademicCapIcon}
        simple={false}
      >
        Lorem ipsum dolor sit amet.
      </Section>
      <Section
        title={title}
        subtitle={subtitle}
        Icon={AcademicCapIcon}
        simple={false}
      >
        Lorem ipsum dolor sit amet.
      </Section>
      <Section title={title} subtitle="" Icon={AcademicCapIcon} simple={false}>
        Lorem ipsum dolor sit amet.
      </Section>
    </AccordionComponent>
  );
};

export const Accordion = TemplateAccordion.bind({});
Accordion.args = {
  title: "title",
  subtitle: "subtitle",
};
