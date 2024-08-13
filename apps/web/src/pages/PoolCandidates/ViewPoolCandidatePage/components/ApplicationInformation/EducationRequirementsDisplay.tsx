import { useIntl } from "react-intl";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import {
  commonMessages,
  getEducationRequirementOption,
} from "@gc-digital-talent/i18n";
import { TreeView } from "@gc-digital-talent/ui";
import { notEmpty } from "@gc-digital-talent/helpers";

import ExperienceTreeItems from "~/components/ExperienceTreeItems/ExperienceTreeItems";

const EducationRequirement_PoolCandidateFragment = graphql(/* GraphQL */ `
  fragment EducationRequirement_PoolCandidate on PoolCandidate {
    pool {
      classification {
        group
      }
    }
    educationRequirementOption {
      value
    }
    educationRequirementExperiences {
      id
      details
      user {
        id
        email
      }
      skills {
        id
        key
        name {
          en
          fr
        }
        category {
          value
          label {
            en
            fr
          }
        }
        experienceSkillRecord {
          details
        }
      }
      ... on AwardExperience {
        title
        issuedBy
        awardedDate
        awardedTo {
          value
          label {
            en
            fr
          }
        }
        awardedScope {
          value
          label {
            en
            fr
          }
        }
      }
      ... on CommunityExperience {
        title
        organization
        project
        startDate
        endDate
      }
      ... on EducationExperience {
        institution
        areaOfStudy
        thesisTitle
        startDate
        endDate
        type {
          value
          label {
            en
            fr
          }
        }
        status {
          value
          label {
            en
            fr
          }
        }
      }
      ... on PersonalExperience {
        title
        description
        startDate
        endDate
      }
      ... on WorkExperience {
        role
        organization
        division
        startDate
        endDate
      }
    }
  }
`);

interface EducationRequirementsDisplayProps {
  educationRequirementQuery: FragmentType<
    typeof EducationRequirement_PoolCandidateFragment
  >;
}

const EducationRequirementsDisplay = ({
  educationRequirementQuery,
}: EducationRequirementsDisplayProps) => {
  const intl = useIntl();
  const application = getFragment(
    EducationRequirement_PoolCandidateFragment,
    educationRequirementQuery,
  );

  const classificationGroup = application?.pool.classification?.group ?? "";

  return (
    <>
      <p>
        {intl.formatMessage(
          {
            defaultMessage:
              "Requirement selection: <strong>{educationRequirementOption}</strong>.",
            id: "J3Ud6R",
            description:
              "Application snapshot minimum experience section description",
          },
          {
            educationRequirementOption: intl.formatMessage(
              application?.educationRequirementOption
                ? getEducationRequirementOption(
                    application.educationRequirementOption.value,
                    classificationGroup,
                  )
                : commonMessages.notAvailable,
            ),
          },
        )}
      </p>
      {application?.educationRequirementExperiences?.length ? (
        <>
          <p data-h2-margin="base(x1 0)">
            {intl.formatMessage({
              defaultMessage: "Demonstrated with the following experiences:",
              id: "tpTntk",
              description:
                "Lead in text for experiences that demonstrate minimum education experience",
            })}
          </p>
          <TreeView.Root>
            <ExperienceTreeItems
              experiences={application?.educationRequirementExperiences.filter(
                notEmpty,
              )}
            />
          </TreeView.Root>
        </>
      ) : null}
    </>
  );
};

export default EducationRequirementsDisplay;
