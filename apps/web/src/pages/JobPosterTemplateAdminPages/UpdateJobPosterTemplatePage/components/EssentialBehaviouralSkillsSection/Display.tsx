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

import { InitialData_Fragment } from "./EssentialBehaviouralSkillsSection";
import { filterEssentialBehaviouralSkills } from "../../utils";
import EssentialBehaviouralSkillsFrontMatter from "../../../components/EssentialBehaviouralSkillsFrontMatter";

interface DisplayProps {
  initialDataQuery: FragmentType<typeof InitialData_Fragment>;
}

const Display = ({ initialDataQuery }: DisplayProps) => {
  const intl = useIntl();
  const notProvided = intl.formatMessage(commonMessages.notProvided);

  const { jobPosterTemplateSkills, essentialBehaviouralSkillsNotes } =
    getFragment(InitialData_Fragment, initialDataQuery);

  const essentialBehaviouralSkills = filterEssentialBehaviouralSkills(
    jobPosterTemplateSkills,
  );
  essentialBehaviouralSkills.sort(sortAlphaBy((s) => s.skill?.name.localized));

  return (
    <div className="flex flex-col gap-6">
      <EssentialBehaviouralSkillsFrontMatter />
      {essentialBehaviouralSkills?.length ? (
        <Ul space="md">
          {essentialBehaviouralSkills.map((s) => (
            <li key={s.id}>
              <p>{s.skill?.name.localized}</p>
              {s.requiredLevel?.value ? (
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  {intl.formatMessage(
                    getSkillLevelName(
                      s.requiredLevel.value,
                      SkillCategory.Behavioural,
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
      {essentialBehaviouralSkillsNotes?.localized ? (
        <div className="flex flex-col gap-1">
          <Heading level="h3" size="h6" className="m-0">
            {intl.formatMessage(messages.specialNote)}
          </Heading>
          <p>{essentialBehaviouralSkillsNotes.localized}</p>
        </div>
      ) : null}
    </div>
  );
};

export default Display;
