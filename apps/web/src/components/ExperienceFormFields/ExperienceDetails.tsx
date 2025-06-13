import { useWatch } from "react-hook-form";
import { useIntl } from "react-intl";

import { Heading } from "@gc-digital-talent/ui";

import { getExperienceFormLabels } from "~/utils/experienceUtils";
import { AllExperienceFormValues, ExperienceType } from "~/types/experience";

import AwardFields from "./AwardFields";
import CommunityFields from "./CommunityFields";
import EducationFields from "./EducationFields";
import PersonalFields from "./PersonalFields";
import WorkFields from "./WorkFields/WorkFields";
import NullExperienceType from "./NullExperienceType";

interface ExperienceDetailsProps {
  experienceType?: ExperienceType;
  organizationSuggestions: string[];
}

const ExperienceDetails = ({
  experienceType,
  organizationSuggestions,
}: ExperienceDetailsProps) => {
  const intl = useIntl();
  const type = useWatch<AllExperienceFormValues>({
    name: "experienceType",
  }) as ExperienceType;
  const derivedType: ExperienceType = type ?? experienceType;
  const labels = getExperienceFormLabels(intl, derivedType);

  return (
    <>
      <Heading level="h3" size="h4" className="mt-18 mb-6 font-bold">
        {intl.formatMessage({
          defaultMessage: "Provide a few details",
          id: "jIMP76",
          description: "Heading for the details section of the experience form",
        })}
      </Heading>
      <div>
        {derivedType ? (
          <>
            <p className="mb-6">
              {intl.formatMessage({
                defaultMessage:
                  "Provide a few standardized details about your experience to help managers better understand how it’s played a role in your career journey.",
                id: "czThVC",
                description: "Help text for the experience details section",
              })}
            </p>
            {derivedType === "award" && (
              <AwardFields
                labels={labels}
                organizationSuggestions={organizationSuggestions}
              />
            )}
            {derivedType === "community" && (
              <CommunityFields
                labels={labels}
                organizationSuggestions={organizationSuggestions}
              />
            )}
            {derivedType === "education" && (
              <EducationFields
                labels={labels}
                organizationSuggestions={organizationSuggestions}
              />
            )}
            {derivedType === "personal" && <PersonalFields labels={labels} />}
            {derivedType === "work" && (
              <WorkFields
                labels={labels}
                organizationSuggestions={organizationSuggestions}
              />
            )}
          </>
        ) : (
          <NullExperienceType />
        )}
      </div>
    </>
  );
};

export default ExperienceDetails;
