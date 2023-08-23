import React from "react";
import { useIntl } from "react-intl";
import { useFieldArray, useFormContext } from "react-hook-form";

import { Heading, TableOfContents, Well } from "@gc-digital-talent/ui";
import { Repeater } from "@gc-digital-talent/forms";
import { Skill } from "@gc-digital-talent/graphql";

import { getSectionTitle, PAGE_SECTION_ID } from "../navigation";
import PersonnelRequirementFieldset from "../fieldsSets/PersonnelRequirementFieldset";

type PersonnelRequirementsSectionProps = {
  skills: Array<Skill>;
};

const PersonnelRequirementsSection = ({
  skills,
}: PersonnelRequirementsSectionProps) => {
  const intl = useIntl();
  const { control } = useFormContext();

  const { remove, move, append, fields } = useFieldArray({
    control,
    name: "personnelRequirements",
  });

  return (
    <TableOfContents.Section
      id={PAGE_SECTION_ID.PERSONNEL_REQUIREMENTS}
      data-h2-padding-top="base(x2)"
    >
      <Heading data-h2-margin="base(0, 0, x1, 0)" level="h4">
        {intl.formatMessage(
          getSectionTitle(PAGE_SECTION_ID.PERSONNEL_REQUIREMENTS),
        )}
      </Heading>
      <Repeater.Root
        data-h2-margin-bottom="base(1rem)"
        onAdd={() => {
          append({});
        }}
        addText={intl.formatMessage({
          defaultMessage: "Add personnel requirement",
          id: "5UBJy7",
          description: "Button text to add a new personnel requirement",
        })}
      >
        {fields.length ? (
          fields.map((item, index) => (
            <Repeater.Fieldset
              key={item.id}
              index={index}
              total={fields.length}
              onMove={move}
              onRemove={remove}
              legend={intl.formatMessage(
                {
                  defaultMessage: "Personnel requirement {index}",
                  id: "hj9jLb",
                  description: "Legend for personnel requirement fieldset",
                },
                {
                  index: index + 1,
                },
              )}
            >
              <PersonnelRequirementFieldset
                fieldsetName={`personnelRequirements.${index}`}
                skills={skills}
              />
            </Repeater.Fieldset>
          ))
        ) : (
          <Well>
            <p
              data-h2-font-weight="base(700)"
              data-h2-margin-bottom="base(x.5)"
            >
              {intl.formatMessage({
                defaultMessage: "You have no questions.",
                id: "izt28e",
                description:
                  "Message that appears when there are no screening messages for a pool",
              })}
            </p>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "Start adding some questions using the following button.",
                id: "vDqzWG",
                description:
                  "Instructions on how to add a question when there are none",
              })}
            </p>
          </Well>
        )}
      </Repeater.Root>
    </TableOfContents.Section>
  );
};

export default PersonnelRequirementsSection;
