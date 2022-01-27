import React from "react";
import { Story, Meta } from "@storybook/react";
import { BriefcaseIcon } from "@heroicons/react/solid";
import { Accordion as AccordionComponent, AccordionProps } from "./Accordion";

export default {
  component: AccordionComponent,
  title: "Components/Accordion",
} as Meta;

const TemplateAccordion: Story<AccordionProps> = (args) => {
  const { title, subtitle, ...rest } = args;

  return (
    <AccordionComponent
      title={title}
      subtitle={subtitle}
      defaultOpen
      simple={false}
      Icon={BriefcaseIcon}
    >
      <AccordionComponent
        title={title}
        subtitle={subtitle}
        defaultOpen
        simple={false}
        Icon={BriefcaseIcon}
      />
    </AccordionComponent>
  );
};

export const NestedAccordion = TemplateAccordion.bind({});
NestedAccordion.args = {
  title: "title",
  subtitle: "subtitle",
};
