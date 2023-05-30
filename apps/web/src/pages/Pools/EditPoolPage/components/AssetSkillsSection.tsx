import * as React from "react";
import { useState } from "react";
import { useIntl } from "react-intl";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";

import { TableOfContents, Chip, Chips } from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";
import { Submit } from "@gc-digital-talent/forms";

import {
  AdvertisementStatus,
  Pool,
  Scalars,
  Skill,
  UpdatePoolInput,
} from "~/api/generated";
import { EditPoolSectionMetadata } from "~/types/pool";
import SkillPicker from "~/components/SkillPicker";

import { useEditPoolContext } from "./EditPoolContext";

export type AssetSkillsSubmitData = Pick<UpdatePoolInput, "nonessentialSkills">;

type FormValues = {
  currentAssetSkills: {
    id: Scalars["ID"];
  }[];
};

interface AssetSkillsSectionProps {
  poolAdvertisement: Pool;
  skills: Array<Skill>;
  sectionMetadata: EditPoolSectionMetadata;
  onSave: (submitData: AssetSkillsSubmitData) => void;
}

const AssetSkillsSection = ({
  poolAdvertisement,
  skills,
  sectionMetadata,
  onSave,
}: AssetSkillsSectionProps): JSX.Element => {
  const intl = useIntl();
  const { isSubmitting } = useEditPoolContext();
  const defaultSkills = poolAdvertisement.nonessentialSkills
    ? poolAdvertisement.nonessentialSkills
    : [];
  const methods = useForm<FormValues>({
    defaultValues: {
      currentAssetSkills: defaultSkills.map(({ id }) => ({ id })),
    },
  });
  const { fields } = useFieldArray({
    name: "currentAssetSkills",
    control: methods.control,
  });

  const [selectedSkills, setSelectedSkills] =
    useState<Array<Skill>>(defaultSkills);

  const handleChangeSelectedSkills = (changedSelectedSkills: Array<Skill>) => {
    methods.setValue(
      "currentAssetSkills",
      changedSelectedSkills.map(({ id }) => ({ id })),
      { shouldDirty: true, shouldTouch: true },
    );
    setSelectedSkills(changedSelectedSkills);
  };

  const handleSave = () => {
    onSave({
      nonessentialSkills: {
        sync: selectedSkills.map((skill) => skill.id),
      },
    });
    methods.reset(
      { currentAssetSkills: selectedSkills.map(({ id }) => ({ id })) },
      {
        keepDirty: false,
      },
    );
  };

  // disabled unless status is draft
  const formDisabled =
    poolAdvertisement.advertisementStatus !== AdvertisementStatus.Draft;

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
                "Select skills that will improve the chances of quality matches with managers. These can typically be learned on the job and are not necessary to be accepted into the pool.",
              id: "xGjm2A",
              description:
                "Helper message for filling in the pool asset skills",
            })}
          </p>
          <SkillPicker
            selectedSkills={selectedSkills}
            skills={skills}
            onUpdateSelectedSkills={handleChangeSelectedSkills}
            headingLevel="h3"
            skillType="asset"
          />
          <FormProvider {...methods}>
            {fields.map((field, index) => (
              <input
                key={field.id}
                type="hidden"
                {...methods.register(`currentAssetSkills.${index}.id`)}
              />
            ))}
            <p data-h2-margin="base(x1, 0)">
              <Submit
                text={intl.formatMessage({
                  defaultMessage: "Save asset skills",
                  id: "j4G/wv",
                  description: "Text on a button to save the pool asset skills",
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

export default AssetSkillsSection;
