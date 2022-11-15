import * as React from "react";
import { useState } from "react";
import TableOfContents from "@common/components/TableOfContents";
import { useIntl } from "react-intl";
import SkillPicker from "@common/components/SkillPicker";
import Chip, { Chips } from "@common/components/Chip";
import { getLocalizedName } from "@common/helpers/localize";
import { Submit } from "@common/components/form";
import {
  AdvertisementStatus,
  PoolAdvertisement,
  Skill,
  UpdatePoolAdvertisementInput,
} from "../../../api/generated";

import { SectionMetadata } from "./EditPool";
import { useEditPoolContext } from "./EditPoolContext";

export type AssetSkillsSubmitData = Pick<
  UpdatePoolAdvertisementInput,
  "nonessentialSkills"
>;

interface AssetSkillsSectionProps {
  poolAdvertisement: PoolAdvertisement;
  skills: Array<Skill>;
  sectionMetadata: SectionMetadata;
  onSave: (submitData: AssetSkillsSubmitData) => void;
}

export const AssetSkillsSection = ({
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
            submitButton={
              <p data-h2-margin="base(x1, 0)">
                <Submit
                  text={intl.formatMessage({
                    defaultMessage: "Save asset skills",
                    id: "j4G/wv",
                    description:
                      "Text on a button to save the pool asset skills",
                  })}
                  color="cta"
                  mode="solid"
                  isSubmitting={isSubmitting}
                />
              </p>
            }
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
