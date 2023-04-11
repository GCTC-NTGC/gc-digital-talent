import React from "react";
import { useWatch } from "react-hook-form";
import { useIntl } from "react-intl";

import { notEmpty } from "@gc-digital-talent/helpers";
import { Heading } from "@gc-digital-talent/ui";

import { getExperienceFormLabels } from "~/utils/experienceUtils";
import { ExperienceType } from "~/types/experience";

import AwardFields from "./AwardFields";
import CommunityFields from "./CommunityFields";
import EducationFields from "./EducationFields";
import PersonalFields from "./PersonalFields";
import WorkFields from "./WorkFields";
import NullExperienceType from "./NullExperienceType";

interface ExperienceDetailsProps {
  experienceType?: ExperienceType;
}

const ExperienceDetails = ({ experienceType }: ExperienceDetailsProps) => {
  const intl = useIntl();
  const type = useWatch({ name: "experienceType" });
  const derivedType = type ?? experienceType;
  const labels = getExperienceFormLabels(intl, derivedType);

  console.log({
    experienceType,
    type,
    derivedType,
  });

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
        {notEmpty(derivedType) ? (
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
