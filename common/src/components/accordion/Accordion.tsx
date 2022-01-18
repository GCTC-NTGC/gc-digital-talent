import React, { useState } from "react";
import { Section as InternalSection, ExternalSectionProps } from "./Section";
import "../../css/Accordion.css";

interface AccordionProps {
  defaultOpenIndex?: number;
}
export const Accordion: React.FC<AccordionProps> = ({
  children,
  defaultOpenIndex,
}) => {
  const [activeIndex, setActiveIndex] = useState<unknown>(defaultOpenIndex);
  const handleChange = (index: unknown) => {
    setActiveIndex(activeIndex === index ? undefined : index);
  };
  const sectionsWithInjectedProps = React.Children.map(
    children,
    (child, index) => {
      if (
        !React.isValidElement(child) ||
        typeof child.type !== "function" ||
        child.type.name !== InternalSection.name
      ) {
        return false;
      }
      const JSXProps: ExternalSectionProps = child.props;
      const isActive = index === activeIndex;
      return (
        <InternalSection
          index={index}
          isActive={isActive}
          setActiveIndex={handleChange}
          title={JSXProps.title}
          subtitle={JSXProps.subtitle}
          Icon={JSXProps.Icon}
        >
          {React.cloneElement(child)}
        </InternalSection>
      );
    },
  );
  return <div className="accordion">{sectionsWithInjectedProps}</div>;
};

export const Section: React.FC<ExternalSectionProps> = ({ children }) => (
  <> {children} </>
);

export default Accordion;
