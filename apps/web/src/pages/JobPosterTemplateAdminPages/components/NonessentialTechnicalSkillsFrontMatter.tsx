import { useIntl } from "react-intl";

const NonessentialTechnicalSkillsFrontMatter = () => {
  const intl = useIntl();

  return (
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
  );
};

export default NonessentialTechnicalSkillsFrontMatter;
