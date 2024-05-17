import { useIntl } from "react-intl";

import { SkillCategory } from "@gc-digital-talent/graphql";

import UserSkillFormFields from "../UserSkillFormFields/UserSkillFormFields";
import { SkillBrowserDialogContext } from "./types";

interface SkillDetailsProps {
  category: SkillCategory;
  context?: SkillBrowserDialogContext;
}

const SkillDetails = ({ category, context }: SkillDetailsProps) => {
  const intl = useIntl();

  return (
    <>
      <p className="my-6">
        {intl.formatMessage({
          defaultMessage:
            "Once you've found a skill, we ask that you give an honest evaluation of your approximate experience level. This level will be provided to hiring managers alongside any official Government of Canada skill evaluations to help provide a more holistic understanding of your abilities.",
          id: "bMY93S",
          description: "Help text for providing a skill level",
        })}
      </p>
      <div className="flex flex-col gap-y-6">
        <UserSkillFormFields category={category} context={context} />
      </div>
    </>
  );
};

export default SkillDetails;
