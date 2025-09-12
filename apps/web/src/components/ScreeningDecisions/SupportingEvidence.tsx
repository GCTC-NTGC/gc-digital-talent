import { useIntl } from "react-intl";

import {
  FragmentType,
  getFragment,
  graphql,
  Scalars,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { commonMessages } from "@gc-digital-talent/i18n";

import ExperienceCard from "../ExperienceCard/ExperienceCard";
import { DialogType } from "./useDialogType";
import { DIALOG_TYPE } from "./utils";

const ScreeningDialogSupportingEvidence_Fragment = graphql(/** GraphQL */ `
  fragment ScreeningDialogSupportingEvidence on PoolCandidate {
    educationRequirementExperiences {
      id
    }
    user {
      experiences {
        id
        skills {
          id
        }
        ...ExperienceCard
      }
    }
  }
`);

interface SupportingEvidenceProps {
  query?: FragmentType<typeof ScreeningDialogSupportingEvidence_Fragment>;
  skillId?: Scalars["UUID"]["output"];
  dialogType: DialogType;
}

const SupportingEvidence = ({
  query,
  skillId,
  dialogType,
}: SupportingEvidenceProps) => {
  const intl = useIntl();
  const candidate = getFragment(
    ScreeningDialogSupportingEvidence_Fragment,
    query,
  );

  const experiences = unpackMaybes(candidate?.user.experiences);
  const experiencesFiltered =
    dialogType === DIALOG_TYPE.Education
      ? experiences.filter((experience) =>
          candidate?.educationRequirementExperiences?.some(
            (eduExp) => eduExp?.id === experience.id,
          ),
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
              experienceQuery={experience}
              headingLevel="h5"
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
