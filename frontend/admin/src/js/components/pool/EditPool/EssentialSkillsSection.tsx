import * as React from "react";
import { useState } from "react";
import TableOfContents from "@common/components/TableOfContents";
import { useIntl } from "react-intl";
import { Button } from "@common/components";
import {
  AdvertisementStatus,
  PoolAdvertisement,
  Skill,
  UpdatePoolAdvertisementInput,
} from "../../../api/generated";

import { SectionMetadata } from "./EditPool";
import AddSkillsToPool from "./AddSkillsToPool";
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

  const handleChangeSelectedSkills = (changedSelectedSkills: Array<Skill>) =>
    setSelectedSkills(changedSelectedSkills);

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
      <TableOfContents.Heading>
        <h2 data-h2-margin="base(x3, 0, x1, 0)" data-h2-font-size="base(p)">
          {sectionMetadata.title}
        </h2>
      </TableOfContents.Heading>
      <p data-h2-margin="base(x1, 0)">
        {intl.formatMessage({
          defaultMessage:
            "Select the skills that you are looking for in applicants. Any skill selected here will be required for any applicant to apply. To increase the diversity of applications try to keep the selected number of skills to a minimum.",
          description:
            "Helper message for filling in the pool essential skills",
        })}
      </p>
      <AddSkillsToPool
        selectedSkills={selectedSkills}
        skills={skills}
        onChangeSelectedSkills={handleChangeSelectedSkills}
        idPrefix="essential"
        disabled={formDisabled}
      />

      {!formDisabled && (
        <Button
          onClick={handleSave}
          color="cta"
          mode="solid"
          disabled={isSubmitting}
        >
          {intl.formatMessage({
            defaultMessage: "Save essential skills",
            description: "Text on a button to save the pool essential skills",
          })}
        </Button>
      )}
    </TableOfContents.Section>
  );
};

export default EssentialSkillsSection;
