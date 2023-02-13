import * as React from "react";
import { useState } from "react";
import { useIntl } from "react-intl";

import { TableOfContents, Chip, Chips } from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";

import {
  AdvertisementStatus,
  PoolAdvertisement,
  Skill,
  UpdatePoolAdvertisementInput,
} from "~/api/generated";
import { EditPoolSectionMetadata } from "~/types/pool";
import SkillPicker from "~/components/SkillPicker";

import { useEditPoolContext } from "./EditPoolContext";

export type AssetSkillsSubmitData = Pick<
  UpdatePoolAdvertisementInput,
  "nonessentialSkills"
>;

interface AssetSkillsSectionProps {
  poolAdvertisement: PoolAdvertisement;
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

  const [selectedSkills, setSelectedSkills] = useState<Array<Skill>>(
    poolAdvertisement.nonessentialSkills
      ? poolAdvertisement.nonessentialSkills
      : [],
  );

  const handleChangeSelectedSkills = (changedSelectedSkills: Array<Skill>) =>
    setSelectedSkills(changedSelectedSkills);

  const handleSave = () => {
    onSave({
      nonessentialSkills: {
        sync: selectedSkills.map((skill) => skill.id),
      },
    });
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
          {" "}
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
            handleSave={handleSave}
            headingLevel="h3"
            submitButtonText={intl.formatMessage({
              defaultMessage: "Save asset skills",
              id: "j4G/wv",
              description: "Text on a button to save the pool asset skills",
            })}
            isSubmitting={isSubmitting}
            skillType="asset"
          />
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
