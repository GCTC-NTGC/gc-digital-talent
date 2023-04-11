import React from "react";
import { useIntl } from "react-intl";

import AwardFields from "~/components/ExperienceFormFields/AwardFields";

import type { SubExperienceFormProps } from "~/types/experience";

const AwardFormFields = ({ labels }: SubExperienceFormProps) => {
  const intl = useIntl();
  return (
    <div>
      <h2 data-h2-font-size="base(h3, 1)" data-h2-margin="base(x3, 0, x1, 0)">
        {intl.formatMessage({
          defaultMessage: "1. Award Details",
          id: "i55f5L",
          description: "Title for Award Details Form",
        })}
      </h2>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "Did you get recognized for going above and beyond? There are many ways to get recognized, awards are just one of them.",
          id: "a6c/ce",
          description: "Description blurb for Award Details Form",
        })}
      </p>
      <AwardFields labels={labels} />
    </div>
  );
};

export default AwardFormFields;
