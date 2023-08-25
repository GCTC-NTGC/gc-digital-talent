import React from "react";
import { useIntl } from "react-intl";

import { ThrowNotFound, Pending } from "@gc-digital-talent/ui";
import { notEmpty } from "@gc-digital-talent/helpers";
import { useAuthorization } from "@gc-digital-talent/auth";

import { useGetAllApplicantExperiencesQuery } from "~/api/generated";
import profileMessages from "~/messages/profileMessages";

import CareerTimelineAndRecruitment from "./components/CareerTimelineAndRecruitment";

const CareerTimelineAndRecruitmentPage = () => {
  const intl = useIntl();
  const { user } = useAuthorization();
  const [{ data, fetching, error }] = useGetAllApplicantExperiencesQuery({
    variables: { id: user?.id || "" },
  });

  const experiences = data?.applicant?.experiences?.filter(notEmpty);
  const applications = data?.applicant?.poolCandidates?.filter(notEmpty);

  return (
    <Pending fetching={fetching} error={error}>
      {data?.applicant ? (
        <CareerTimelineAndRecruitment
          applicantId={data?.applicant.id}
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

export default CareerTimelineAndRecruitmentPage;
