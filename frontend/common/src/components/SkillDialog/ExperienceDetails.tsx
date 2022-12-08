import React from "react";
import { useIntl } from "react-intl";

import Heading from "../Heading";
import { Skill } from "../../api/generated";
import { getLocalizedName } from "../../helpers/localize";

import ExperienceHelpMessage from "./ExperienceHelpMessage";
import DetailsTextArea from "./DetailsTextArea";

interface AddExperiencesProps {
  selectedSkill: Skill | null;
}

const ExperienceDetails = ({ selectedSkill }: AddExperiencesProps) => {
  const intl = useIntl();

  if (!selectedSkill) {
    return null;
  }

  const skillName = getLocalizedName(selectedSkill.name, intl);

  return (
    <>
      <Heading level="h2" size="h5">
        {intl.formatMessage(
          {
            defaultMessage: '2. Highlight your experiences in "{skillName}"',
            id: "Ps49w5",
            description: "Title for third step of claiming a skill",
          },
          {
            skillName,
          },
        )}
      </Heading>
      <ExperienceHelpMessage />
      <DetailsTextArea id="details" name="details" skillName={skillName} />
    </>
  );
};

export default ExperienceDetails;
