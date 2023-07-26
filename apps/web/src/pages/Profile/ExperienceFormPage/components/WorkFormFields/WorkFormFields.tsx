import React from "react";
import { useIntl } from "react-intl";

import { SubExperienceFormProps } from "~/types/experience";
import WorkFields from "~/components/ExperienceFormFields/WorkFields";

const WorkExperienceForm = ({ labels }: SubExperienceFormProps) => {
  const intl = useIntl();

  return (
    <div>
      <h2 data-h2-font-size="base(h3, 1)" data-h2-margin="base(x2, 0, x1, 0)">
        {intl.formatMessage({
          defaultMessage: "1. Work Experience Details",
          id: "ciWrxr",
          description: "Title for Work Experience form",
        })}
      </h2>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "Share your experiences gained from full-time positions, part-time positions, self-employment, fellowships, and internships. You don't necessarily need to share everything. Instead, focus on experiences related to the opportunity that you are interested in.",
          id: "qjMTk9",
          description: "Description blurb for Work Experience form",
        })}
      </p>
      <WorkFields labels={labels} />
    </div>
  );
};

export default WorkExperienceForm;
