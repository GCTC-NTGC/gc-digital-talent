import { useIntl } from "react-intl";

import { commonMessages, getSkillLevelName } from "@gc-digital-talent/i18n";
import {
  FragmentType,
  getFragment,
  SkillCategory,
} from "@gc-digital-talent/graphql";
import { Ul } from "@gc-digital-talent/ui";
import { sortAlphaBy } from "@gc-digital-talent/helpers";

import messages from "~/messages/jobPosterTemplateMessages";

import { InitialData_Fragment } from "./NonessentialTechnicalSkillsSection";
import { filterNonessentialTechnicalSkills } from "../../utils";
import NonessentialTechnicalSkillsFrontMatter from "../../../components/NonessentialTechnicalSkillsFrontMatter";

interface DisplayProps {
  initialDataQuery: FragmentType<typeof InitialData_Fragment>;
}

const Display = ({ initialDataQuery }: DisplayProps) => {
  const intl = useIntl();
  const notProvided = intl.formatMessage(commonMessages.notProvided);

  const { jobPosterTemplateSkills, nonessentialTechnicalSkillsNotes } =
    getFragment(InitialData_Fragment, initialDataQuery);

  const nonessentialTechnicalSkills = filterNonessentialTechnicalSkills(
    jobPosterTemplateSkills,
  );
  nonessentialTechnicalSkills.sort(sortAlphaBy((s) => s.skill?.name.localized));

  return (
    <div className="flex flex-col gap-6">
      <NonessentialTechnicalSkillsFrontMatter />
      {nonessentialTechnicalSkills?.length ? (
        <Ul space="md">
          {nonessentialTechnicalSkills.map((s) => (
            <li key={s.id}>
              <p>{s.skill?.name.localized}</p>
              {s.requiredLevel?.value ? (
                <p className="text-sm text-gray-500 dark:text-gray-300">
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
      {nonessentialTechnicalSkillsNotes?.localized ? (
        <div className="flex flex-col gap-1">
          <h3 className="font-bold">
            {intl.formatMessage(messages.specialNote)}
          </h3>
          <p>{nonessentialTechnicalSkillsNotes.localized}</p>
        </div>
      ) : null}
    </div>
  );
};

export default Display;
