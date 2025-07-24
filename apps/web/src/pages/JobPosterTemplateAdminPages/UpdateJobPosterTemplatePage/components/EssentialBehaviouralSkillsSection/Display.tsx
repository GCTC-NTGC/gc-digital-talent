import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import { FragmentType, getFragment } from "@gc-digital-talent/graphql";
import { Ul } from "@gc-digital-talent/ui";
import { sortAlphaBy } from "@gc-digital-talent/helpers";

import { InitialData_Fragment } from "./EssentialBehaviouralSkillsSection";
import { filterEssentialBehaviouralSkills } from "../../utils";
import messages from "../../../messages";

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
      <div className="flex flex-col gap-1">
        <h3 className="font-bold">
          {intl.formatMessage({
            defaultMessage: "Essential behavioural skills",
            id: "msr1cl",
            description: "Title for the essential behavioural skills",
          })}
        </h3>
        <p className="mb-3">
          {intl.formatMessage({
            defaultMessage:
              "We provide examples only of essential behavioural skills in the job advertisement templates.",
            id: "6aCiD3",
            description: "Lead in for a list of essential behavioural skills",
          })}
        </p>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "The number of behavioural skills selected here, combined with the essential technical skills in the previous section, contribute to the overall total of essential skills.",
            id: "eUnUZo",
            description:
              "Lead in, paragraph 2, for a list of essential behavioural skills",
          })}
        </p>
      </div>
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
