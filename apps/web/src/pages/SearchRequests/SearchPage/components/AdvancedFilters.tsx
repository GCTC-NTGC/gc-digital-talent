import React from "react";
import { motion } from "framer-motion";
import { IntlShape, useIntl } from "react-intl";
import { useFormContext } from "react-hook-form";
import isArray from "lodash/isArray";

import { Accordion, Heading } from "@gc-digital-talent/ui";
import { StandardTrigger as StandardAccordionTrigger } from "@gc-digital-talent/ui/src/components/Accordion/StandardTrigger";
import { Checklist, RadioGroup } from "@gc-digital-talent/forms";
import {
  getOperationalRequirement,
  getEmploymentDuration,
  EmploymentDuration,
  OperationalRequirementV2,
} from "@gc-digital-talent/i18n";

import { NullSelection } from "~/types/searchRequest";

import FilterBlock from "./FilterBlock";

interface FieldOption {
  value: string;
  label: string;
}

const getFieldLabel = (
  value: string | string[],
  options: Array<FieldOption>,
  intl: IntlShape,
) => {
  let label;
  if (isArray(value)) {
    const labels = options
      .filter((option) => value.includes(option.value))
      .map((option) => option.label);

    label = labels.join(", ");
  } else {
    const fieldOption = options.find((option) => option.value === value);

    label = fieldOption?.label;
  }

  return (
    label ||
    intl.formatMessage({
      defaultMessage: "(None selected)",
      id: "+O6J4u",
      description: "Text shown when the filter was not selected",
    })
  );
};

const animationVariants = {
  open: {
    height: "auto",
    opacity: 1,
  },
  closed: {
    height: 0,
    opacity: 0,
  },
};

interface AnimatedContentProps
  extends React.ComponentPropsWithoutRef<typeof Accordion.Content> {
  isOpen: boolean;
}

const AnimatedContent = React.forwardRef<
  React.ElementRef<typeof Accordion.Content>,
  AnimatedContentProps
>(({ isOpen, children, ...rest }, forwardedRef) => (
  <Accordion.Content asChild forceMount ref={forwardedRef} {...rest}>
    <motion.div
      className="Accordion__Content"
      animate={isOpen ? "open" : "closed"}
      variants={animationVariants}
      transition={{ duration: 0.2, type: "tween" }}
    >
      {children}
    </motion.div>
  </Accordion.Content>
));

type AdvancedFilter =
  | "educationRequirement"
  | "employmentDuration"
  | "operationalRequirements";

type AdvancedFilterOptions = Array<AdvancedFilter>;

const AdvancedFilters = () => {
  const intl = useIntl();
  const [currentAdvancedFilters, setCurrentAdvancedFilters] =
    React.useState<AdvancedFilterOptions>([]);
  const { watch } = useFormContext();
  const [educationRequirement, employmentDuration, operationalRequirements] =
    watch([
      "educationRequirement",
      "employmentDuration",
      "operationalRequirements",
    ]);

  const educationRequirementOptions = [
    {
      value: "no_diploma",
      label: intl.formatMessage({
        defaultMessage:
          "Can accept a combination of work experience and education",
        id: "74WtLG",
        description:
          "Radio group option for education requirement filter in search form.",
      }),
    },
    {
      value: "has_diploma",
      label: intl.formatMessage({
        defaultMessage: "Required diploma from post-secondary institution",
        id: "KoPFx4",
        description:
          "Radio group option for education requirement filter in search form.",
      }),
    },
  ];

  const employmentDurationOptions = [
    {
      value: NullSelection,
      label: intl.formatMessage({
        defaultMessage:
          "Any duration (short term, long term or indeterminate) (Recommended)",
        id: "8fQWTc",
        description: "No preference for employment duration - will accept any",
      }),
    },
    {
      value: EmploymentDuration.Term,
      label: intl.formatMessage(getEmploymentDuration(EmploymentDuration.Term)),
    },
    {
      value: EmploymentDuration.Indeterminate,
      label: intl.formatMessage(
        getEmploymentDuration(EmploymentDuration.Indeterminate),
      ),
    },
  ];

  const operationalRequirementOptions = OperationalRequirementV2.map(
    (value) => ({
      value,
      label: intl.formatMessage(getOperationalRequirement(value)),
    }),
  );

  const operationalRequirementOptionsShort = OperationalRequirementV2.map(
    (value) => ({
      value,
      label: intl.formatMessage(getOperationalRequirement(value, "short")),
    }),
  );

  return (
    <>
      <Heading level="h3" size="h6" data-h2-font-weight="base(700)">
        {intl.formatMessage({
          defaultMessage: "Advanced filters",
          id: "eozWFc",
          description: "Title for the additional filters",
        })}
      </Heading>
      <Accordion.Root
        type="multiple"
        mode="simple"
        value={currentAdvancedFilters}
        onValueChange={(newValue: AdvancedFilterOptions) => {
          setCurrentAdvancedFilters(newValue);
        }}
      >
        <Accordion.Item value="educationRequirement">
          <StandardAccordionTrigger
            subtitle={getFieldLabel(
              educationRequirement,
              educationRequirementOptions,
              intl,
            )}
          >
            {intl.formatMessage({
              defaultMessage: "Education requirement for the job",
              id: "AyP6Fr",
              description:
                "Heading for education requirement filter of the search form.",
            })}
          </StandardAccordionTrigger>
          <AnimatedContent
            isOpen={currentAdvancedFilters.includes("educationRequirement")}
          >
            <FilterBlock
              id="educationRequirementFilter"
              text={intl.formatMessage({
                defaultMessage:
                  "Most jobs in the Digital community do not require a diploma, change this only if the job requires a diploma.",
                id: "mhtcMd",
                description:
                  "Message describing the education requirement filter of the search form.",
              })}
            >
              <RadioGroup
                idPrefix="education_requirement"
                legend={intl.formatMessage({
                  defaultMessage: "Education Requirement filter",
                  id: "/JQ6DD",
                  description:
                    "Legend for the Education Requirement filter radio group",
                })}
                name="educationRequirement"
                items={educationRequirementOptions}
                trackUnsaved={false}
              />
            </FilterBlock>
          </AnimatedContent>
        </Accordion.Item>
        <Accordion.Item value="employmentDuration">
          <StandardAccordionTrigger
            subtitle={getFieldLabel(
              employmentDuration,
              employmentDurationOptions,
              intl,
            )}
          >
            {intl.formatMessage({
              defaultMessage: "Employment Duration",
              id: "VwVtqr",
              description:
                "Heading for employment duration section of the search form.",
            })}
          </StandardAccordionTrigger>
          <AnimatedContent
            isOpen={currentAdvancedFilters.includes("employmentDuration")}
          >
            <FilterBlock
              id="employmentDurationFilter"
              text={intl.formatMessage({
                defaultMessage:
                  "The selected duration will be compared to the one chosen by candidates in their applications. Change this only if the job offer has a determined duration.",
                id: "iN2H6J",
                description:
                  "Message describing the employment duration filter in the search form.",
              })}
            >
              <RadioGroup
                idPrefix="employmentDuration"
                legend="Duration"
                name="employmentDuration"
                items={employmentDurationOptions}
                trackUnsaved={false}
              />
            </FilterBlock>
          </AnimatedContent>
        </Accordion.Item>
        <Accordion.Item value="operationalRequirements">
          <StandardAccordionTrigger
            subtitle={getFieldLabel(
              operationalRequirements,
              operationalRequirementOptionsShort,
              intl,
            )}
          >
            {intl.formatMessage({
              defaultMessage:
                "Conditions of employment / Operational requirements",
              id: "laGCzG",
              description:
                "Heading for operational requirements section of the search form.",
            })}
          </StandardAccordionTrigger>
          <AnimatedContent
            isOpen={currentAdvancedFilters.includes("operationalRequirements")}
          >
            <FilterBlock
              id="operationalRequirementFilter"
              text={intl.formatMessage({
                defaultMessage:
                  "The selected conditions of employment will be compared to those chosen by candidates in their applications.",
                id: "IT6Djp",
                description:
                  "Message describing the operational requirements filter in the search form.",
              })}
            >
              <Checklist
                idPrefix="operationalRequirements"
                legend={intl.formatMessage({
                  defaultMessage: "Conditions of employment",
                  id: "bKvvaI",
                  description:
                    "Legend for the Conditions of Employment filter checklist",
                })}
                name="operationalRequirements"
                items={operationalRequirementOptions}
                trackUnsaved={false}
              />
            </FilterBlock>
          </AnimatedContent>
        </Accordion.Item>
      </Accordion.Root>
    </>
  );
};

export default AdvancedFilters;
