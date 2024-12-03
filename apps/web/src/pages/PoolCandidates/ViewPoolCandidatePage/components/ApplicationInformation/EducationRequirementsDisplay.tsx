import { useIntl } from "react-intl";

import {
  Experience,
  FragmentType,
  getFragment,
  graphql,
  Maybe,
} from "@gc-digital-talent/graphql";
import {
  commonMessages,
  getEducationRequirementOption,
} from "@gc-digital-talent/i18n";
import { TreeView } from "@gc-digital-talent/ui";
import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";

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
    }
  }
`);

interface EducationRequirementsDisplayProps {
  experiences?: Maybe<Maybe<Experience>[]>;
  educationRequirementQuery: FragmentType<
    typeof EducationRequirement_PoolCandidateFragment
  >;
}

const EducationRequirementsDisplay = ({
  educationRequirementQuery,
  experiences,
}: EducationRequirementsDisplayProps) => {
  const intl = useIntl();
  const application = getFragment(
    EducationRequirement_PoolCandidateFragment,
    educationRequirementQuery,
  );

  const classificationGroup = application?.pool.classification?.group ?? "";
  const educationExperiences = unpackMaybes(
    experiences?.filter((experience) => {
      return application?.educationRequirementExperiences?.some(
        (educationExperience) => educationExperience?.id === experience?.id,
      );
    }),
  );

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
              experiences={educationExperiences.filter(notEmpty)}
            />
          </TreeView.Root>
        </>
      ) : null}
    </>
  );
};

export default EducationRequirementsDisplay;
