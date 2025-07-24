import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import { FragmentType, getFragment } from "@gc-digital-talent/graphql";
import { Ul } from "@gc-digital-talent/ui";
import { sortAlphaBy } from "@gc-digital-talent/helpers";

import EssentialTechnicalSkillsFrontMatter from "../../../components/EssentialTechnicalSkillsFrontMatter";
import { InitialData_Fragment } from "./EssentialTechnicalSkillsSection";
import { filterEssentialTechnicalSkills } from "../../utils";
import messages from "../../../messages";

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
              <p className="text-sm text-gray-500 dark:text-gray-300">
                {s.requiredLevel?.label.localized}
              </p>
            </li>
          ))}
        </Ul>
      ) : (
        notProvided
      )}
      {essentialTechnicalSkillsNotes?.localized ? (
        <div className="flex flex-col gap-1">
          <h3 className="font-bold">
            {intl.formatMessage(messages.specialNote)}
          </h3>
          <p>{essentialTechnicalSkillsNotes.localized}</p>
        </div>
      ) : null}
    </div>
  );
};

export default Display;
