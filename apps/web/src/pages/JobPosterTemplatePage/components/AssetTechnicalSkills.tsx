import { useIntl } from "react-intl";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { getLocalizedName } from "@gc-digital-talent/i18n";

import sections from "../sections";

const JobPosterTemplateAssetTechnicalSkills_Fragment = graphql(/* GraphQL */ `
  fragment JobPosterTemplateAssetTechnicalSkills on JobPosterTemplate {
    skills {
      id
    }
    nonessentialTechnicalSkillsNotes {
      en
      fr
    }
  }
`);

interface AssetTechnicalSkillsProps {
  jobPosterTemplateQuery: FragmentType<
    typeof JobPosterTemplateAssetTechnicalSkills_Fragment
  >;
}

const AssetTechnicalSkills = ({
  jobPosterTemplateQuery,
}: AssetTechnicalSkillsProps) => {
  const intl = useIntl();
  const jobPosterTemplate = getFragment(
    JobPosterTemplateAssetTechnicalSkills_Fragment,
    jobPosterTemplateQuery,
  );
  const note = getLocalizedName(
    jobPosterTemplate.nonessentialTechnicalSkillsNotes,
    intl,
    true,
  );
  return (
    <>
      <div>{intl.formatMessage(sections.assetTechnicalSkills.longTitle)}</div>
      <div>
        {intl.formatMessage({
          defaultMessage:
            "Finally, asset or optional technical skills allow you to elaborate on skills that aren’t absolutely required but would benefit the role. These skills might represent a gap on your team or related skills that might bolster the candidate’s work. We encourage you to include whatever skills you feel are a good fit for this type of position, however, it’s important to remember that candidates aren’t obligated to have these skills in order to apply (and qualify) for the position you’re describing.",
          id: "0UAx0q",
          description:
            "Description displayed on the job poster template 'asset technical skills' section.",
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

export default AssetTechnicalSkills;
