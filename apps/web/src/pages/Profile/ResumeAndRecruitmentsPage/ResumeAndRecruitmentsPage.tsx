import React from "react";
import { useIntl } from "react-intl";
import { useSearchParams } from "react-router-dom";

import { NotFound, ThrowNotFound, Pending } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";
import { useAuthorization } from "@gc-digital-talent/auth";

import {
  Experience,
  useGetAllApplicantExperiencesQuery,
  useGetApplicationDetailsQuery,
} from "~/api/generated";
import profileMessages from "~/messages/profileMessages";
import { Application } from "~/utils/applicationUtils";
import { ResumeAndRecruitments } from "./components/ResumeAndRecruitments";

interface ResumeAndRecruitmentsApiProps {
  applicantId: string;
  experiences: Experience[];
  applications: Application[];
}

const ResumeAndRecruitmentsApi = ({
  applicantId,
  experiences,
  applications,
}: ResumeAndRecruitmentsApiProps) => {
  const intl = useIntl();
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get("applicationId");
  const [{ data, fetching, error }] = useGetApplicationDetailsQuery({
    variables: { id: applicationId || "" },
  });
  const missingSkills = {
    requiredSkills: data?.poolCandidate?.pool.essentialSkills || [],
    optionalSkills: data?.poolCandidate?.pool.nonessentialSkills || [],
  };
  const experiencesOnlyRelevantSkills = experiences.map((experience) => {
    return {
      ...experience,
      skills: experience?.skills?.filter((skill) => {
        return (
          missingSkills.requiredSkills?.find(
            (essentialSkill) => essentialSkill.id === skill.id,
          ) ||
          missingSkills.optionalSkills?.find(
            (assetSkill) => assetSkill.id === skill.id,
          )
        );
      }),
    };
  });
  return (
    <Pending fetching={fetching} error={error}>
      {data?.poolCandidate ? (
        <ResumeAndRecruitments
          applicantId={applicantId}
          pool={data.poolCandidate.pool}
          missingSkills={missingSkills}
          experiences={experiencesOnlyRelevantSkills}
          applications={applications}
        />
      ) : (
        <NotFound headingMessage={intl.formatMessage(commonMessages.notFound)}>
          <p>
            {intl.formatMessage({
              defaultMessage: "Application not found.",
              id: "78ITuW",
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
  applicationId: string | null;
  applicantId: string;
  experiences: Experience[];
  applications: Application[];
}

const ApiOrContent = ({
  applicationId,
  applicantId,
  experiences,
  applications,
}: ApiOrContentProps) =>
  applicationId ? (
    <ResumeAndRecruitmentsApi
      applicantId={applicantId}
      experiences={experiences}
      applications={applications}
    />
  ) : (
    <ResumeAndRecruitments
      applicantId={applicantId}
      experiences={experiences}
      applications={applications}
    />
  );

const ResumeAndRecruitmentsPage = () => {
  const intl = useIntl();
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get("applicationId");
  const { user } = useAuthorization();
  const [{ data, fetching, error }] = useGetAllApplicantExperiencesQuery({
    variables: { id: user?.id || "" },
  });

  const experiences = data?.applicant?.experiences?.filter(notEmpty);
  const applications = data?.applicant?.poolCandidates?.filter(notEmpty);

  return (
    <Pending fetching={fetching} error={error}>
      {data?.applicant ? (
        <ApiOrContent
          applicantId={data?.applicant.id}
          applicationId={applicationId}
          experiences={experiences || []}
          applications={applications || []}
        />
      ) : (
        <ThrowNotFound
          message={intl.formatMessage(profileMessages.userNotFound)}
        />
      )}
    </Pending>
  );
};

export default ResumeAndRecruitmentsPage;
