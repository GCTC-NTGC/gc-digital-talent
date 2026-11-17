import type { ReactNode } from "react";
import { useParams } from "react-router";
import { useIntl } from "react-intl";
import type { OperationContext } from "urql";
import { useQuery } from "urql";

import { Pending, ThrowNotFound } from "@gc-digital-talent/ui";
import { graphql } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { useAuthorization } from "@gc-digital-talent/auth";

import {
  isAwardExperience,
  isCommunityExperience,
  isEducationExperience,
  isPersonalExperience,
  isWorkExperience,
  organizationSuggestionsFromExperiences,
} from "~/utils/experienceUtils";

import type { ExperienceTypeFormProps } from "./components/ExperienceFormLayout";
import AwardExperienceForm from "./AwardExperienceForm";
import CommunityExperienceForm from "./CommunityExperienceForm";
import EducationExperienceForm from "./EducationExperienceForm";
import PersonalExperienceForm from "./PersonalExperienceForm";
import WorkExperienceForm from "./WorkExperienceForm";

const context: Partial<OperationContext> = {
  additionalTypenames: [
    "Skill",
    "SkillFamily",
    "AwardExperience",
    "CommunityExperience",
    "EducationExperience",
    "PersonalExperience",
    "WorkExperience",
  ],
  requestPolicy: "cache-first",
};

const EditExperienceTypeFormData_Query = graphql(/* GraphQL */ `
  query EditExperienceTypeFormData {
    skills {
      ...ExperienceFormSkill
    }
    me {
      id
      experiences {
        id
        ... on AwardExperience {
          issuedBy
          ...AwardExperienceForm
        }
        ... on CommunityExperience {
          organization
          ...CommunityExperienceForm
        }
        ... on EducationExperience {
          institution
          ...EducationExperienceForm
        }
        ... on PersonalExperience {
          organization
          ...PersonalExperienceForm
        }
        ... on WorkExperience {
          organization
          ...WorkExperienceForm
        }
      }
    }
  }
`);

interface RouteParams extends Record<string, string> {
  experienceId: string;
}

const EditExperienceTypeFormContainer = () => {
  const intl = useIntl();
  const { userAuthInfo } = useAuthorization();
  const { experienceId } = useParams<RouteParams>();

  const [{ data, fetching, error }] = useQuery({
    query: EditExperienceTypeFormData_Query,
    context,
  });

  const skills = unpackMaybes(data?.skills);
  const experiences = unpackMaybes(data?.me?.experiences);
  const experience = experiences.find((exp) => exp.id === experienceId);

  const formProps: ExperienceTypeFormProps = {
    edit: true,
    experienceId,
    skillsQuery: skills,
    userId: userAuthInfo?.id ?? "",
    organizationSuggestions:
      organizationSuggestionsFromExperiences(experiences),
  };

  let form: ReactNode = null;
  if (experience && isAwardExperience(experience)) {
    form = <AwardExperienceForm {...formProps} experienceQuery={experience} />;
  } else if (experience && isCommunityExperience(experience)) {
    form = (
      <CommunityExperienceForm {...formProps} experienceQuery={experience} />
    );
  } else if (experience && isEducationExperience(experience)) {
    form = (
      <EducationExperienceForm {...formProps} experienceQuery={experience} />
    );
  } else if (experience && isPersonalExperience(experience)) {
    form = (
      <PersonalExperienceForm {...formProps} experienceQuery={experience} />
    );
  } else if (experience && isWorkExperience(experience)) {
    form = <WorkExperienceForm {...formProps} experienceQuery={experience} />;
  }

  return (
    <Pending fetching={fetching} error={error}>
      {form ?? (
        <ThrowNotFound
          message={intl.formatMessage({
            defaultMessage: "No experience found.",
            id: "Yhd/hk",
            description:
              "Message displayed when no experience is found for experience form.",
          })}
        />
      )}
    </Pending>
  );
};

export default EditExperienceTypeFormContainer;
