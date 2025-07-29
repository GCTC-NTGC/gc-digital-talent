import { useIntl } from "react-intl";

import { Heading } from "@gc-digital-talent/ui";

const NonessentialTechnicalSkillsFrontMatter = () => {
  const intl = useIntl();

  return (
    <div className="flex flex-col gap-1">
      <Heading level="h3" size="h6" className="m-0">
        {intl.formatMessage({
          defaultMessage: "Asset technical skills",
          id: "XNzRga",
          description: "Title for the nonessential technical skills",
        })}
      </Heading>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "Examples of asset technical skills will provide the user with a general understanding of the types of specialized work a person in this role can perform.",
          id: "4WhB1k",
          description: "Lead in for a list of nonessential technical skills",
        })}
      </p>
    </div>
  );
};

export default NonessentialTechnicalSkillsFrontMatter;
