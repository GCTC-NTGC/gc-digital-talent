import * as React from "react";
import { useState } from "react";
import TableOfContents from "@common/components/TableOfContents";
import { useIntl } from "react-intl";
import SkillPicker from "@common/components/SkillPicker";
import { getLocalizedName } from "@common/helpers/localize";
import Chip, { Chips } from "@common/components/Chip";
import {
  AdvertisementStatus,
  PoolAdvertisement,
  Skill,
  UpdatePoolAdvertisementInput,
} from "../../../api/generated";
import { SectionMetadata } from "./EditPool";
import { useEditPoolContext } from "./EditPoolContext";

export type EssentialSkillsSubmitData = Pick<
  UpdatePoolAdvertisementInput,
  "essentialSkills"
>;

interface EssentialSkillsSectionProps {
  poolAdvertisement: PoolAdvertisement;
  skills: Array<Skill>;
  sectionMetadata: SectionMetadata;
  onSave: (submitData: EssentialSkillsSubmitData) => void;
}

export const EssentialSkillsSection = ({
  poolAdvertisement,
  skills,
  sectionMetadata,
  onSave,
}: EssentialSkillsSectionProps): JSX.Element => {
  const intl = useIntl();
  const { isSubmitting } = useEditPoolContext();

  const [selectedSkills, setSelectedSkills] = useState<Array<Skill>>(
    poolAdvertisement.essentialSkills ? poolAdvertisement.essentialSkills : [],
  );

  const handleChangeSelectedSkills = (changedSelectedSkills: Array<Skill>) => {
    setSelectedSkills(changedSelectedSkills);
  };

  const handleSave = () => {
    onSave({
      essentialSkills: {
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
            handleSave={handleSave}
            headingLevel="h3"
            submitButtonText={intl.formatMessage({
              defaultMessage: "Save essential skills",
              id: "2asU3k",
              description: "Text on a button to save the pool essential skills",
            })}
            isSubmitting={isSubmitting}
            skillType="essential"
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

export default EssentialSkillsSection;
