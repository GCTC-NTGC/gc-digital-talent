import React from "react";
import { useIntl } from "react-intl";

import useAuthorizationContext from "@common/hooks/useAuthorizationContext";

import NotFound from "@common/components/NotFound";
import Pending from "@common/components/Pending";
import { commonMessages } from "@common/messages";
import { notEmpty } from "@common/helpers/util";

import { useGetAllApplicantExperiencesQuery } from "../../api/generated";
import profileMessages from "../profile/profileMessages";
import { ExperienceAndSkills } from "./ExperienceAndSkills";

const ExperienceAndSkillsPage = () => {
  const intl = useIntl();
  const { loggedInUser } = useAuthorizationContext();
  const [{ data, fetching, error }] = useGetAllApplicantExperiencesQuery({
    variables: { id: loggedInUser?.id || "" },
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.applicant ? (
        <ExperienceAndSkills
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
