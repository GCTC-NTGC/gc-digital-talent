import type { ComponentType } from "react";
import { useIntl } from "react-intl";
import type { OperationContext } from "urql";
import { useQuery } from "urql";

import { Pending, ThrowNotFound } from "@gc-digital-talent/ui";
import { graphql } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { useAuthorization } from "@gc-digital-talent/auth";
import { useFeatureFlags } from "@gc-digital-talent/env";

import type { ExperienceType } from "~/types/experience";
import { organizationSuggestionsFromExperiences } from "~/utils/experienceUtils";

import type { ExperienceTypeFormProps } from "./components/ExperienceFormLayout";
import AwardExperienceForm from "./AwardExperienceForm";
import CommunityExperienceForm from "./CommunityExperienceForm";
import EducationExperienceForm from "./EducationExperienceForm";
import PersonalExperienceForm from "./PersonalExperienceForm";
import WorkExperienceForm from "./WorkExperienceForm";

const forms: Record<ExperienceType, ComponentType<ExperienceTypeFormProps>> = {
  award: AwardExperienceForm,
  community: CommunityExperienceForm,
  education: EducationExperienceForm,
  personal: PersonalExperienceForm,
  work: WorkExperienceForm,
};

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

const CreateExperienceTypeFormData_Query = graphql(/* GraphQL */ `
  query CreateExperienceTypeFormData {
    skills {
      ...ExperienceFormSkill
    }
    me {
      id
      experiences {
        id
        ... on AwardExperience {
          issuedBy
        }
        ... on CommunityExperience {
          organization
        }
        ... on EducationExperience {
          institution
        }
        ... on PersonalExperience {
          organization
        }
        ... on WorkExperience {
          organization
        }
      }
    }
  }
`);

interface CreateExperienceTypeFormContainerProps {
  experienceType: ExperienceType;
}

const CreateExperienceTypeFormContainer = ({
  experienceType,
}: CreateExperienceTypeFormContainerProps) => {
  const intl = useIntl();
  const { careerExperience } = useFeatureFlags();
  const { userAuthInfo } = useAuthorization();

  const [{ data, fetching, error }] = useQuery({
    query: CreateExperienceTypeFormData_Query,
    context,
    pause: !careerExperience,
  });

  if (!careerExperience) {
    return <ThrowNotFound />;
  }

  const skills = unpackMaybes(data?.skills);
  const organizationSuggestions = organizationSuggestionsFromExperiences(
    unpackMaybes(data?.me?.experiences),
  );
  const Form = forms[experienceType];

  return (
    <Pending fetching={fetching} error={error}>
      {skills.length > 0 ? (
        <Form
          skillsQuery={skills}
          userId={userAuthInfo?.id ?? ""}
          organizationSuggestions={organizationSuggestions}
        />
      ) : (
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

export default CreateExperienceTypeFormContainer;
