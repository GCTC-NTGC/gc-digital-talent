import React from "react";
import { useIntl } from "react-intl";

import NotFound from "@common/components/NotFound";
import Pending from "@common/components/Pending";
import { commonMessages } from "@common/messages";
import { notEmpty } from "@common/helpers/util";
import useAuthorizationContext from "@common/hooks/useAuthorizationContext";
import { parseUrlQueryParameters, useLocation } from "@common/helpers/router";

import {
  Experience,
  useGetAllApplicantExperiencesQuery,
  useGetApplicationPoolSkillsQuery,
} from "../../api/generated";
import profileMessages from "../profile/profileMessages";
import { ExperienceAndSkills } from "./ExperienceAndSkills";

interface ExperienceAndSkillsApiProps {
  applicationId: string;
  applicantId: string;
  experiences: Experience[];
}

const ExperienceAndSkillsApi = ({
  applicantId,
  applicationId,
  experiences,
}: ExperienceAndSkillsApiProps) => {
  const intl = useIntl();
  const [{ data, fetching, error }] = useGetApplicationPoolSkillsQuery({
    variables: { id: applicationId },
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.poolCandidate?.poolAdvertisement ? (
        <ExperienceAndSkills
          applicantId={applicantId}
          missingSkills={{
            requiredSkills:
              data?.poolCandidate?.poolAdvertisement?.essentialSkills || [],
            optionalSkills:
              data?.poolCandidate?.poolAdvertisement?.nonessentialSkills || [],
          }}
          experiences={experiences}
        />
      ) : (
        <NotFound headingMessage={intl.formatMessage(commonMessages.notFound)}>
          <p>
            {intl.formatMessage({
              defaultMessage: "Application not found.",
              description:
                "Text displayed when a users application does not exist.",
            })}
          </p>
        </NotFound>
      )}
    </Pending>
  );
};

interface ApiOrContentProps {
  applicationId?: string;
  applicantId: string;
  experiences: Experience[];
}

const ApiOrContent = ({
  applicationId,
  applicantId,
  experiences,
}: ApiOrContentProps) =>
  applicationId ? (
    <ExperienceAndSkillsApi
      applicantId={applicantId}
      applicationId={applicationId}
      experiences={experiences}
    />
  ) : (
    <ExperienceAndSkills applicantId={applicantId} experiences={experiences} />
  );

const ExperienceAndSkillsPage = () => {
  const intl = useIntl();
  const location = useLocation();
  const queryParams = parseUrlQueryParameters(location);
  const { loggedInUser } = useAuthorizationContext();
  const [{ data, fetching, error }] = useGetAllApplicantExperiencesQuery({
    variables: { id: loggedInUser?.id || "" },
  });

  const experiences = data?.applicant?.experiences?.filter(notEmpty);

  return (
    <Pending fetching={fetching} error={error}>
      {data?.applicant ? (
        <ApiOrContent
          applicantId={data?.applicant.id}
          applicationId={queryParams.application || undefined}
          experiences={experiences || []}
        />
      ) : (
        <NotFound headingMessage={intl.formatMessage(commonMessages.notFound)}>
          <p>{intl.formatMessage(profileMessages.userNotFound)}</p>
        </NotFound>
      )}
    </Pending>
  );
};

export default ExperienceAndSkillsPage;
