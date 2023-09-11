import React from "react";
import { useIntl } from "react-intl";

import UserSkillFormFields from "../UserSkillFormFields/UserSkillFormFields";

interface SkillDetailsProps {
  isTechnical?: boolean;
}

const SkillDetails = ({ isTechnical = false }: SkillDetailsProps) => {
  const intl = useIntl();

  return (
    <>
      <p data-h2-margin="base(x1 0)">
        {intl.formatMessage({
          defaultMessage:
            "Once you've found a skill, we ask that you give an honest evaluation of your approximate experience level. This level will be provided to hiring managers alongside any official Government of Canada skill evaluations to help provide a more holistic understanding of your abilities.",
          id: "bMY93S",
          description: "Help text for providing a skill level",
        })}
      </p>
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-gap="base(x1 0)"
      >
        <UserSkillFormFields isTechnical={isTechnical} />
      </div>
    </>
  );
};

export default SkillDetails;
