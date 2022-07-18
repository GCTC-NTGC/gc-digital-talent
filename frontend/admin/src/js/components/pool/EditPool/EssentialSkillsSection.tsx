import * as React from "react";
import { useState } from "react";
import TableOfContents from "@common/components/TableOfContents";
import { PoolAdvertisement, Skill } from "@common/api/generated";
import { useIntl } from "react-intl";
import { Button } from "@common/components";

import { SectionMetadata } from "./EditPool";
import AddSkillsToPool from "./AddSkillsToPool";

interface EssentialSkillsSectionProps {
  poolAdvertisement: PoolAdvertisement;
  skills: Array<Skill>;
  sectionMetadata: SectionMetadata;
  onSave: (submitData: unknown) => void;
}

export const EssentialSkillsSection = ({
  poolAdvertisement,
  skills,
  sectionMetadata,
  onSave,
}: EssentialSkillsSectionProps): JSX.Element => {
  const intl = useIntl();

  const [selectedSkills, setSelectedSkills] = useState<Array<Skill>>(
    poolAdvertisement.essentialSkills ? poolAdvertisement.essentialSkills : [],
  );

  const handleChangeSelectedSkills = (changedSelectedSkills: Array<Skill>) =>
    setSelectedSkills(changedSelectedSkills);

  return (
    <TableOfContents.Section id={sectionMetadata.id}>
      <TableOfContents.Heading>
        <h2 data-h2-margin="b(top, l)" data-h2-font-size="b(p)">
          {sectionMetadata.title}
        </h2>
      </TableOfContents.Heading>
      <p>
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
      />
      <Button onClick={() => onSave(selectedSkills)} color="cta" mode="solid">
        {intl.formatMessage({
          defaultMessage: "Save essential skills",
          description: "Text on a button to save the pool essential skills",
        })}
      </Button>
    </TableOfContents.Section>
  );
};

export default EssentialSkillsSection;
