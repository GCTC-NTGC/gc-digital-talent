import { useIntl } from "react-intl";

import {
  Experience,
  FragmentType,
  getFragment,
  graphql,
  makeFragmentData,
  Scalars,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { commonMessages } from "@gc-digital-talent/i18n";

import ExperienceCard, {
  ExperienceCard_Fragment,
} from "../ExperienceCard/ExperienceCard";
import { DialogType } from "./useDialogType";
import { DIALOG_TYPE } from "./utils";

const ScreeningDialogSupportingEvidence_Fragment = graphql(/** GraphQL */ `
  fragment ScreeningDialogSupportingEvidence on PoolCandidate {
    educationRequirementExperienceIds
  }
`);

interface SupportingEvidenceProps {
  query: FragmentType<typeof ScreeningDialogSupportingEvidence_Fragment>;
  experiences: Omit<Experience, "user">[];
  skillId?: Scalars["UUID"]["output"];
  dialogType: DialogType;
}

const SupportingEvidence = ({
  query,
  experiences,
  skillId,
  dialogType,
}: SupportingEvidenceProps) => {
  const intl = useIntl();
  const candidate = getFragment(
    ScreeningDialogSupportingEvidence_Fragment,
    query,
  );
  const educationRequirementExperienceIds = unpackMaybes(
    candidate.educationRequirementExperienceIds,
  );
  const experiencesFiltered =
    dialogType === DIALOG_TYPE.Education
      ? experiences.filter((experience) =>
          educationRequirementExperienceIds?.includes(experience.id),
        )
      : experiences.filter((experience) =>
          experience.skills?.some((skill) => skill?.id === skillId),
        );

  return (
    <>
      <p className="mb-3">
        {intl.formatMessage({
          defaultMessage: "Supporting evidence:",
          id: "w59dPh",
          description:
            "Header for supporting evidence section in screening decision dialog.",
        })}
      </p>
      {experiencesFiltered.length > 0 ? (
        experiencesFiltered.map((experience) => (
          <div className="mb-3" key={experience.id}>
            <ExperienceCard
              experienceQuery={makeFragmentData(
                experience,
                ExperienceCard_Fragment,
              )}
              headingLevel="h3"
              showEdit={false}
              {...(skillId && {
                showSkills: { id: skillId },
              })}
            />
          </div>
        ))
      ) : (
        <p className="mb-3 ml-1.5">
          {intl.formatMessage(commonMessages.notFound)}
        </p>
      )}
    </>
  );
};

export default SupportingEvidence;
