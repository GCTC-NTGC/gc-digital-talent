import { useIntl } from "react-intl";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { getLocalizedName } from "@gc-digital-talent/i18n";

import sections from "../sections";

const JobPosterTemplateEssentialBehaviouralSkills_Fragment = graphql(
  /* GraphQL */ `
    fragment JobPosterTemplateEssentialBehaviouralSkills on JobPosterTemplate {
      skills {
        id
      }
      essentialBehaviouralSkillsNotes {
        en
        fr
      }
    }
  `,
);

interface EssentialBehaviouralSkillsProps {
  jobPosterTemplateQuery: FragmentType<
    typeof JobPosterTemplateEssentialBehaviouralSkills_Fragment
  >;
}

const EssentialBehaviouralSkills = ({
  jobPosterTemplateQuery,
}: EssentialBehaviouralSkillsProps) => {
  const intl = useIntl();
  const jobPosterTemplate = getFragment(
    JobPosterTemplateEssentialBehaviouralSkills_Fragment,
    jobPosterTemplateQuery,
  );
  const note = getLocalizedName(
    jobPosterTemplate.essentialBehaviouralSkillsNotes,
    intl,
    true,
  );
  return (
    <>
      <div>
        {intl.formatMessage(sections.essentialBehaviouralSkills.longTitle)}
      </div>
      <div>
        {intl.formatMessage({
          defaultMessage:
            "In similar fashion to the essential technical skills suggested above, this list offers recommendations for behavioural skills this role commonly requires. Again, we recommend keeping essential behavioural skills limited to the exact requirements for your position or team to ensure candidates have the opportunity to properly describe their experience for the skills that really matter.",
          id: "qmkRCA",
          description:
            "Description displayed on the job poster template 'essential behavioural skills' section.",
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

export default EssentialBehaviouralSkills;
