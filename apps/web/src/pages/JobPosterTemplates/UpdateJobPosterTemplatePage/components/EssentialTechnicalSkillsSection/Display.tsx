import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import { FragmentType, getFragment } from "@gc-digital-talent/graphql";
import { Ul } from "@gc-digital-talent/ui";
import { sortAlphaBy } from "@gc-digital-talent/helpers";

import { InitialData_Fragment } from "./EssentialTechnicalSkillsSection";
import { filterEssentialTechnicalSkills } from "./utils";

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
      <div className="flex flex-col gap-1">
        <h3 className="font-bold">
          {intl.formatMessage({
            defaultMessage: "Essential technical skills",
            id: "1KMmdT",
            description: "Title for the essential technical skills",
          })}
        </h3>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "Essential technical skills should cover the core competencies of the role. The number of technical skills selected here, combined with the essential behavioural skills in the next section, contribute to the overall total of essential skills.",
            id: "pfCFQ+",
            description: "Lead in for a list of essential technical skills",
          })}
        </p>
      </div>
      {essentialTechnicalSkills?.length ? (
        <Ul space="md">
          {essentialTechnicalSkills.map((s) => (
            <li key={s.id}>
              <p>{s.skill?.name.localized}</p>
              <p className="text-sm text-gray-500">
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
            {intl.formatMessage({
              defaultMessage: "Special note",
              id: "ZCgEiA",
              description: "Title for a special note",
            })}
          </h3>
          <p>{essentialTechnicalSkillsNotes.localized}</p>
        </div>
      ) : null}
    </div>
  );
};

export default Display;
