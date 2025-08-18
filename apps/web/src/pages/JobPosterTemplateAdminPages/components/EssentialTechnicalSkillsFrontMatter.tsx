import { useIntl } from "react-intl";

import { Heading } from "@gc-digital-talent/ui";

const EssentialTechnicalSkillsFrontMatter = () => {
  const intl = useIntl();

  return (
    <div className="flex flex-col gap-1">
      <Heading level="h3" size="h6" className="m-0">
        {intl.formatMessage({
          defaultMessage: "Essential technical skills",
          id: "1KMmdT",
          description: "Title for the essential technical skills",
        })}
      </Heading>
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
