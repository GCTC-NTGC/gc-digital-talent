import * as React from "react";
import { useState } from "react";
import TableOfContents from "@common/components/TableOfContents";
import { useIntl } from "react-intl";
import { Button } from "@common/components";
import { PoolAdvertisement, Skill } from "../../../api/generated";

import { SectionMetadata } from "./EditPool";
import AddSkillsToPool from "./AddSkillsToPool";

interface AssetSkillsSectionProps {
  poolAdvertisement: PoolAdvertisement;
  skills: Array<Skill>;
  sectionMetadata: SectionMetadata;
  onSave: (submitData: unknown) => void;
}

export const AssetSkillsSection = ({
  poolAdvertisement,
  skills,
  sectionMetadata,
  onSave,
}: AssetSkillsSectionProps): JSX.Element => {
  const intl = useIntl();

  const [selectedSkills, setSelectedSkills] = useState<Array<Skill>>(
    poolAdvertisement.nonessentialSkills
      ? poolAdvertisement.nonessentialSkills
      : [],
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
            "Select skills that will improve the chances of quality matches with managers. These can typically be learned on the job and are not necessary to be accepted into the pool.",
          description: "Helper message for filling in the pool asset skills",
        })}
      </p>
      <AddSkillsToPool
        selectedSkills={selectedSkills}
        skills={skills}
        onChangeSelectedSkills={handleChangeSelectedSkills}
        idPrefix="asset"
      />
      <Button onClick={() => onSave(selectedSkills)} color="cta" mode="solid">
        {intl.formatMessage({
          defaultMessage: "Save asset skills",
          description: "Text on a button to save the pool asset skills",
        })}
      </Button>
    </TableOfContents.Section>
  );
};

export default AssetSkillsSection;
