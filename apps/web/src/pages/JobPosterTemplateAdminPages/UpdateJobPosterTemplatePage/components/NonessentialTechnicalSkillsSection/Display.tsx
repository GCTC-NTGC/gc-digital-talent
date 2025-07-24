import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import { FragmentType, getFragment } from "@gc-digital-talent/graphql";
import { Ul } from "@gc-digital-talent/ui";
import { sortAlphaBy } from "@gc-digital-talent/helpers";

import { InitialData_Fragment } from "./NonessentialTechnicalSkillsSection";
import { filterNonessentialTechnicalSkills } from "../../utils";
import messages from "../../../messages";

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
      <div className="flex flex-col gap-1">
        <h3 className="font-bold">
          {intl.formatMessage({
            defaultMessage: "Asset technical skills",
            id: "XNzRga",
            description: "Title for the nonessential technical skills",
          })}
        </h3>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "Examples of asset technical skills will provide the user with a general understanding of the types of specialized work a person in this role can perform.",
            id: "4WhB1k",
            description: "Lead in for a list of nonessential technical skills",
          })}
        </p>
      </div>
      {nonessentialTechnicalSkills?.length ? (
        <Ul space="md">
          {nonessentialTechnicalSkills.map((s) => (
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
