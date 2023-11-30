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
  const { userAuthInfo } = useAuthorization();
  const [{ data, fetching, error }] = useGetAllApplicantExperiencesQuery({
    variables: { id: userAuthInfo?.id || "" },
  });

  const experiences = data?.user?.experiences?.filter(notEmpty);
  const applications = data?.user?.poolCandidates?.filter(notEmpty);

  return (
    <Pending fetching={fetching} error={error}>
      {data?.user ? (
        <CareerTimelineAndRecruitment
          userId={data?.user.id}
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
