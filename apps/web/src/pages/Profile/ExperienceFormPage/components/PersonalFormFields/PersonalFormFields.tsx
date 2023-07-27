import React from "react";
import { useIntl } from "react-intl";

import { SubExperienceFormProps } from "~/types/experience";
import PersonalFields from "~/components/ExperienceFormFields/PersonalFields";

const PersonalExperienceForm = ({ labels }: SubExperienceFormProps) => {
  const intl = useIntl();

  return (
    <div>
      <h2 data-h2-font-size="base(h3, 1)" data-h2-margin="base(x2, 0, x1, 0)">
        {intl.formatMessage({
          defaultMessage: "1. Personal Experience Details",
          id: "UDpZ1q",
          description: "Title for Personal Experience Details form",
        })}
      </h2>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "People are more than just education and work experiences. We want to make space for you to share your learning from other experiences. To protect your privacy, please don't share sensitive information about yourself or others. A good measure would be if you are comfortable with all your colleagues knowing it.",
          id: "knmaAL",
          description: "Description blurb for Personal Experience Details form",
        })}
      </p>
      <PersonalFields labels={labels} />
    </div>
  );
};

export default PersonalExperienceForm;
