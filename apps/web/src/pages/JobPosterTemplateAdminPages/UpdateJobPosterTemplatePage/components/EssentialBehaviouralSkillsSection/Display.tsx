import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import { FragmentType, getFragment } from "@gc-digital-talent/graphql";
import { Ul } from "@gc-digital-talent/ui";
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
              <p className="text-sm text-gray-500 dark:text-gray-300">
                {s.requiredLevel?.label.localized}
              </p>
            </li>
          ))}
        </Ul>
      ) : (
        notProvided
      )}
      {essentialBehaviouralSkillsNotes?.localized ? (
        <div className="flex flex-col gap-1">
          <h3 className="font-bold">
            {intl.formatMessage(messages.specialNote)}
          </h3>
          <p>{essentialBehaviouralSkillsNotes.localized}</p>
        </div>
      ) : null}
    </div>
  );
};

export default Display;
