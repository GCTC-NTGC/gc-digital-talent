import { useIntl } from "react-intl";

import { commonMessages, getSkillLevelName } from "@gc-digital-talent/i18n";
import {
  FragmentType,
  getFragment,
  SkillCategory,
} from "@gc-digital-talent/graphql";
import { Heading, Ul } from "@gc-digital-talent/ui";
import { sortAlphaBy } from "@gc-digital-talent/helpers";

import messages from "~/messages/jobPosterTemplateMessages";

import EssentialTechnicalSkillsFrontMatter from "../../../components/EssentialTechnicalSkillsFrontMatter";
import { InitialData_Fragment } from "./EssentialTechnicalSkillsSection";
import { filterEssentialTechnicalSkills } from "../../utils";

interface DisplayProps {
  initialDataQuery: FragmentType<typeof InitialData_Fragment>;
}

const Display = ({ initialDataQuery }: DisplayProps) => {
  const intl = useIntl();
  const notProvided = intl.formatMessage(commonMessages.notProvided);

  const { jobPosterTemplateSkills, essentialTechnicalSkillsNotes } =
    getFragment(InitialData_Fragment, initialDataQuery);

  const essentialTechnicalSkills = filterEssentialTechnicalSkills(
    jobPosterTemplateSkills,
  );
  essentialTechnicalSkills.sort(sortAlphaBy((s) => s.skill?.name.localized));

  return (
    <div className="flex flex-col gap-6">
      <EssentialTechnicalSkillsFrontMatter />
      {essentialTechnicalSkills?.length ? (
        <Ul space="md">
          {essentialTechnicalSkills.map((s) => (
            <li key={s.id}>
              <p>{s.skill?.name.localized}</p>
              {s.requiredLevel?.value ? (
                <p className="text-sm text-gray-500 dark:text-gray-200">
                  {intl.formatMessage(
                    getSkillLevelName(
                      s.requiredLevel.value,
                      SkillCategory.Technical,
                    ),
                  )}
                </p>
              ) : null}
            </li>
          ))}
        </Ul>
      ) : (
        notProvided
      )}
      {essentialTechnicalSkillsNotes?.localized ? (
        <div className="flex flex-col gap-1">
          <Heading level="h3" size="h6" className="m-0">
            {intl.formatMessage(messages.specialNote)}
          </Heading>
          <p>{essentialTechnicalSkillsNotes.localized}</p>
        </div>
      ) : null}
    </div>
  );
};

export default Display;
