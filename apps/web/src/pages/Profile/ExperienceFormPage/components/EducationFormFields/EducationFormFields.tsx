import React from "react";
import { useIntl } from "react-intl";

import { SubExperienceFormProps } from "~/types/experience";
import EducationFields from "~/components/ExperienceFormFields/EducationFields";

const EducationExperienceForm = ({ labels }: SubExperienceFormProps) => {
  const intl = useIntl();

  return (
    <div>
      <h2 data-h2-font-size="base(h3, 1)" data-h2-margin="base(x2, 0, x1, 0)">
        {intl.formatMessage({
          defaultMessage: "1. Education Details",
          id: "W7LpsW",
          description: "Title for Education Details Form",
        })}
      </h2>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "Got credentials? Share your degree, certificates, online courses, trade apprenticeship, licences or alternative credentials. If you've learned something from a recognized educational provider, include your experiences here.",
          id: "7inIW/",
          description: "Description blurb for Education Details Form",
        })}
      </p>
      <EducationFields labels={labels} />
    </div>
  );
};

export default EducationExperienceForm;
