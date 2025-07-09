import { useIntl } from "react-intl";

import {
  FragmentType,
  getFragment,
  graphql,
  makeFragmentData,
  Maybe,
} from "@gc-digital-talent/graphql";
import {
  commonMessages,
  getEducationRequirementOption,
} from "@gc-digital-talent/i18n";
import { TreeView } from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import ExperienceTreeItems, {
  ExperienceTreeItems_Fragment,
} from "~/components/ExperienceTreeItems/ExperienceTreeItems";
import { SnapshotExperience } from "~/utils/experienceUtils";

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
  experiences?: Maybe<Maybe<SnapshotExperience>[]>;
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
          <p className="my-6">
            {intl.formatMessage({
              defaultMessage: "Demonstrated with the following experiences:",
              id: "tpTntk",
              description:
                "Lead in text for experiences that demonstrate minimum education experience",
            })}
          </p>
          <TreeView.Root>
            <ExperienceTreeItems
              experiencesQuery={unpackMaybes(educationExperiences).map((e) =>
                makeFragmentData(
                  { ...e, __typename: e.__typename ?? "EducationExperience" },
                  ExperienceTreeItems_Fragment,
                ),
              )}
            />
          </TreeView.Root>
        </>
      ) : null}
    </>
  );
};

export default EducationRequirementsDisplay;
