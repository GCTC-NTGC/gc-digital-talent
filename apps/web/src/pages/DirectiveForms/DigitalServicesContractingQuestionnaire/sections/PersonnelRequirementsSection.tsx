import { useIntl } from "react-intl";
import { useFieldArray, useFormContext } from "react-hook-form";

import { Heading, TableOfContents, Well } from "@gc-digital-talent/ui";
import { Repeater } from "@gc-digital-talent/forms";
import { Skill } from "@gc-digital-talent/graphql";

import { getSectionTitle, PAGE_SECTION_ID } from "../navigation";
import PersonnelRequirementFieldset from "../fieldsSets/PersonnelRequirementFieldset";

interface PersonnelRequirementsSectionProps {
  skills: Skill[];
}

const PersonnelRequirementsSection = ({
  skills,
}: PersonnelRequirementsSectionProps) => {
  const intl = useIntl();
  const { control } = useFormContext();

  const { remove, move, append, fields } = useFieldArray({
    control,
    name: "personnelRequirements",
    // rules: { required: true, minLength: 1 },  // no error message possible  #7888
  });

  return (
    <TableOfContents.Section
      id={PAGE_SECTION_ID.PERSONNEL_REQUIREMENTS}
      data-h2-padding-top="base(x2)"
    >
      <Heading data-h2-margin="base(0, 0, x1, 0)" level="h4" size="h5">
        {intl.formatMessage(
          getSectionTitle(PAGE_SECTION_ID.PERSONNEL_REQUIREMENTS),
        )}
      </Heading>
      <p data-h2-margin-bottom="base(x.5)">
        {intl.formatMessage({
          defaultMessage:
            "Provide information on each type of personnel required under the contract. Add more as needed.",
          id: "iZ922O",
          description: "Context for the personnel requirements section",
        })}
      </p>
      <Repeater.Root
        data-h2-margin-bottom="base(1rem)"
        name="personnelRequirements"
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
              name="personnelRequirements"
              index={index}
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
              isLast={index === fields.length - 1}
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
                defaultMessage: "You have no personnel requirements.",
                id: "+C20lR",
                description:
                  "Message that appears when there are no screening messages for a pool",
              })}
            </p>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "Start adding some requirements using the following button.",
                id: "QRnkPO",
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
