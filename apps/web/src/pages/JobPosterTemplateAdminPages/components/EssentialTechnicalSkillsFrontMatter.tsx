import { useIntl } from "react-intl";

const EssentialTechnicalSkillsFrontMatter = () => {
  const intl = useIntl();

  return (
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
  );
};

export default EssentialTechnicalSkillsFrontMatter;
