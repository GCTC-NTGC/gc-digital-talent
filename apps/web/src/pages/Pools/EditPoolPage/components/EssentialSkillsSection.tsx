import * as React from "react";
import { useState } from "react";
import { useIntl } from "react-intl";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";

import { TableOfContents, Chip, Chips } from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";
import { Submit } from "@gc-digital-talent/forms";

import SkillPicker from "~/components/SkillPicker";
import {
  PoolStatus,
  Pool,
  Scalars,
  Skill,
  UpdatePoolInput,
} from "~/api/generated";
import { EditPoolSectionMetadata } from "~/types/pool";

import { useEditPoolContext } from "./EditPoolContext";

export type EssentialSkillsSubmitData = Pick<
  UpdatePoolInput,
  "essentialSkills"
>;

type FormValues = {
  currentEssentialSkills: {
    id: Scalars["ID"];
  }[];
};

interface EssentialSkillsSectionProps {
  pool: Pool;
  skills: Array<Skill>;
  sectionMetadata: EditPoolSectionMetadata;
  onSave: (submitData: EssentialSkillsSubmitData) => void;
}

const EssentialSkillsSection = ({
  pool,
  skills,
  sectionMetadata,
  onSave,
}: EssentialSkillsSectionProps): JSX.Element => {
  const intl = useIntl();
  const { isSubmitting } = useEditPoolContext();
  const defaultSkills = pool.essentialSkills ? pool.essentialSkills : [];
  const methods = useForm<FormValues>({
    defaultValues: {
      currentEssentialSkills: defaultSkills.map(({ id }) => ({ id })),
    },
  });
  const { fields } = useFieldArray({
    name: "currentEssentialSkills",
    control: methods.control,
  });

  const [selectedSkills, setSelectedSkills] =
    useState<Array<Skill>>(defaultSkills);

  const handleChangeSelectedSkills = (changedSelectedSkills: Array<Skill>) => {
    methods.setValue(
      "currentEssentialSkills",
      changedSelectedSkills.map(({ id }) => ({ id })),
      { shouldDirty: true, shouldTouch: true },
    );
    setSelectedSkills(changedSelectedSkills);
  };

  const handleSave = () => {
    onSave({
      essentialSkills: {
        sync: selectedSkills.map((skill) => skill.id),
      },
    });
    methods.reset(
      { currentEssentialSkills: selectedSkills.map(({ id }) => ({ id })) },
      {
        keepDirty: false,
      },
    );
  };

  // disabled unless status is draft
  const formDisabled = pool.status !== PoolStatus.Draft;

  return (
    <TableOfContents.Section id={sectionMetadata.id}>
      <TableOfContents.Heading data-h2-margin="base(x3, 0, x1, 0)">
        {sectionMetadata.title}
      </TableOfContents.Heading>

      {!formDisabled ? (
        <>
          <p data-h2-margin="base(x1, 0)">
            {intl.formatMessage({
              defaultMessage:
                "Select the skills that you are looking for in applicants. Any skill selected here will be required for any applicant to apply. To increase the diversity of applications try to keep the selected number of skills to a minimum.",
              id: "Om6ZoW",
              description:
                "Helper message for filling in the pool essential skills",
            })}
          </p>
          <SkillPicker
            selectedSkills={selectedSkills}
            skills={skills}
            onUpdateSelectedSkills={handleChangeSelectedSkills}
            headingLevel="h3"
            skillType="essential"
          />
          <FormProvider {...methods}>
            {fields.map((field, index) => (
              <input
                key={field.id}
                type="hidden"
                {...methods.register(`currentEssentialSkills.${index}.id`)}
              />
            ))}
            <p data-h2-margin="base(x1, 0)">
              <Submit
                text={intl.formatMessage({
                  defaultMessage: "Save essential skills",
                  id: "2asU3k",
                  description:
                    "Text on a button to save the pool essential skills",
                })}
                color="cta"
                mode="solid"
                isSubmitting={isSubmitting}
                onClick={methods.handleSubmit(handleSave)}
              />
            </p>
          </FormProvider>
        </>
      ) : (
        <Chips>
          {selectedSkills.map((skill) => (
            <Chip
              key={skill.id}
              label={getLocalizedName(skill.name, intl)}
              color="primary"
              mode="outline"
            />
          ))}
        </Chips>
      )}
    </TableOfContents.Section>
  );
};

export default EssentialSkillsSection;
