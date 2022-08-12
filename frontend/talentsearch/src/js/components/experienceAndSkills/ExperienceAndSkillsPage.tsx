import React from "react";
import { useIntl } from "react-intl";

import useAuthorizationContext from "@common/hooks/useAuthorizationContext";

import NotFound from "@common/components/NotFound";
import Pending from "@common/components/Pending";
import { commonMessages } from "@common/messages";
import { notEmpty } from "@common/helpers/util";

import { parseUrlQueryParameters, useLocation } from "@common/helpers/router";
import {
  useGetAllApplicantExperiencesQuery,
  useGetApplicationPoolSkillsQuery,
} from "../../api/generated";
import profileMessages from "../profile/profileMessages";
import { ExperienceAndSkills } from "./ExperienceAndSkills";

const ExperienceAndSkillsPage = () => {
  const intl = useIntl();
  const location = useLocation();
  const queryParams = parseUrlQueryParameters(location);
  const { loggedInUser } = useAuthorizationContext();
  const [{ data, fetching, error }] = useGetAllApplicantExperiencesQuery({
    variables: { id: loggedInUser?.id || "" },
  });
  const [
    {
      data: applicationData,
      fetching: applicationFetching,
      error: applicationError,
    },
  ] = useGetApplicationPoolSkillsQuery({
    variables: { id: queryParams.application || "" },
  });
  return (
    <Pending fetching={fetching || applicationFetching} error={error}>
      {data?.applicant ? (
        <ExperienceAndSkills
          {...(applicationData &&
            !applicationError && {
              missingSkills: {
                requiredSkills:
                  applicationData?.poolCandidate?.poolAdvertisement
                    ?.essentialSkills || [],
                optionalSkills:
                  applicationData?.poolCandidate?.poolAdvertisement
                    ?.nonessentialSkills || [],
              },
            })}
          experiences={data.applicant.experiences?.filter(notEmpty)}
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
