import { useIntl } from "react-intl";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { getLocalizedName } from "@gc-digital-talent/i18n";

import sections from "../sections";

const JobPosterTemplateEssentialTechnicalSkills_Fragment = graphql(
  /* GraphQL */ `
    fragment JobPosterTemplateEssentialTechnicalSkills on JobPosterTemplate {
      skills {
        id
      }
      essentialTechnicalSkillsNotes {
        en
        fr
      }
    }
  `,
);

interface EssentialTechnicalSkillsProps {
  jobPosterTemplateQuery: FragmentType<
    typeof JobPosterTemplateEssentialTechnicalSkills_Fragment
  >;
}

const EssentialTechnicalSkills = ({
  jobPosterTemplateQuery,
}: EssentialTechnicalSkillsProps) => {
  const intl = useIntl();
  const jobPosterTemplate = getFragment(
    JobPosterTemplateEssentialTechnicalSkills_Fragment,
    jobPosterTemplateQuery,
  );
  const note = getLocalizedName(
    jobPosterTemplate.essentialTechnicalSkillsNotes,
    intl,
    true,
  );
  return (
    <>
      <div>
        {intl.formatMessage(sections.essentialTechnicalSkills.longTitle)}
      </div>
      <div>
        {intl.formatMessage({
          defaultMessage:
            "Essential or required skills (also known as merit criteria) are the core skill requirements a candidate must absolutely meet in order to perform the job. This list suggests common skills that are often required for this role, but please note that we recommend choosing only skills that are absolutely essential to the role. Fewer skills translates to higher quality applications and provides candidates with more opportunity to expand on the key skills you need.",
          id: "kk+ohL",
          description:
            "Description displayed on the job poster template 'essential technical skills' section.",
        })}
      </div>
      <div>
        {jobPosterTemplate.skills?.map((skill) => {
          return skill.id;
        })}
      </div>
      {note ? <div>{note}</div> : null}
    </>
  );
};

export default EssentialTechnicalSkills;
