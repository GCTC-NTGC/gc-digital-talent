import React from "react";
import { useIntl } from "react-intl";

import { SubExperienceFormProps } from "~/types/experience";
import CommunityFields from "~/components/ExperienceFormFields/CommunityFields";

export const CommunityExperienceForm = ({ labels }: SubExperienceFormProps) => {
  const intl = useIntl();

  return (
    <div>
      <h2 data-h2-font-size="base(h3, 1)" data-h2-margin="base(x2, 0, x1, 0)">
        {intl.formatMessage({
          defaultMessage: "1. Community Experience Details",
          id: "OUKOBH",
          description: "Title for Community Experience form",
        })}
      </h2>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "People learn skills from a wide range of experiences like volunteering or being part of non-profit organizations, Indigenous communities, or virtual collaborations. Have you gained experience by being part of or giving back to a community? This could be anything from: helping during events and ceremonies, bartering, DJing at a friend's wedding, to gaming and streaming.",
          id: "6XVNkV",
          description: "Description blurb for Community Experience form",
        })}
      </p>
      <CommunityFields labels={labels} />
    </div>
  );
};

export default CommunityExperienceForm;
