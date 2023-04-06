import React from "react";
import { useWatch } from "react-hook-form";
import { useIntl } from "react-intl";

import { notEmpty } from "@gc-digital-talent/helpers";
import { Heading } from "@gc-digital-talent/ui";

import { getExperienceFormLabels } from "~/utils/experienceUtils";

import AwardFields from "./AwardFields";
import CommunityFields from "./CommunityFields";
import EducationFields from "./EducationFields";
import PersonalFields from "./PersonalFields";
import WorkFields from "./WorkFields";
import NullExperienceType from "./NullExperienceType";
import { ExperienceType } from "../../types/experience";

interface ExperienceDetailsProps {
  experienceType?: ExperienceType;
}

const ExperienceDetails = ({ experienceType }: ExperienceDetailsProps) => {
  const intl = useIntl();
  const type = useWatch({ name: "type" });
  const labels = getExperienceFormLabels(intl, type);
  const derivedType = type || experienceType;

  return (
    <>
      <Heading level="h3" size="h5">
        {intl.formatMessage({
          defaultMessage: "Experience Details",
          id: "PyAtIt",
          description: "Heading for the details section of the experience form",
        })}
      </Heading>
      <div data-h2-margin="base(0, 0, x2, 0)">
        {notEmpty(type) ? (
          <>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "Please provide related details about the experience.",
                id: "CB2LXg",
                description: "Help text for the experience details section",
              })}
            </p>
            {derivedType === "award" && <AwardFields labels={labels} />}
            {derivedType === "community" && <CommunityFields labels={labels} />}
            {derivedType === "education" && <EducationFields labels={labels} />}
            {derivedType === "personal" && <PersonalFields labels={labels} />}
            {derivedType === "work" && <WorkFields labels={labels} />}
          </>
        ) : (
          <NullExperienceType />
        )}
      </div>
    </>
  );
};

export default ExperienceDetails;
