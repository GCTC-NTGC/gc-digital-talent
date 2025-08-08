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

const ScreeningDialogSupportingEvidence_Fragment = graphql(/** GraphQL */ `
  fragment ScreeningDialogSupportingEvidence on PoolCandidate {
    user {
      experiences {
        id
        ...ExperienceCard
      }
    }
  }
`);

interface SupportingEvidenceProps {
  query?: FragmentType<typeof ScreeningDialogSupportingEvidence_Fragment>;
  skillId?: Scalars["UUID"]["output"];
}

const SupportingEvidence = ({ query, skillId }: SupportingEvidenceProps) => {
  const intl = useIntl();
  const candidate = getFragment(
    ScreeningDialogSupportingEvidence_Fragment,
    query,
  );

  const experiences = unpackMaybes(candidate?.user.experiences);

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
      {experiences.length > 0 ? (
        experiences.map((experience) => (
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
