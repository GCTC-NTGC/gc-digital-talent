import React from "react";
import { useWatch } from "react-hook-form";
import { useIntl } from "react-intl";

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
  const derivedType: ExperienceType = type ?? experienceType;
  const labels = getExperienceFormLabels(intl, derivedType);

  return (
    <>
      <Heading
        level="h3"
        size="h4"
        className="font-bold"
        data-h2-margin="base(x3, 0, x1, 0)"
      >
        {intl.formatMessage({
          defaultMessage: "Provide a few details",
          id: "jIMP76",
          description: "Heading for the details section of the experience form",
        })}
      </Heading>
      <div>
        {derivedType ? (
          <>
            <p data-h2-margin="base(0, 0, x1, 0)">
              {intl.formatMessage({
                defaultMessage:
                  "Provide a few standardized details about your experience to help managers better understand how it’s played a role in your career journey.",
                id: "czThVC",
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
