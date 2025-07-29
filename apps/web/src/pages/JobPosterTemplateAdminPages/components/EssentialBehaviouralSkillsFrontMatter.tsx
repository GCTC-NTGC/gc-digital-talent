import { useIntl } from "react-intl";

import { Heading } from "@gc-digital-talent/ui";

const EssentialBehaviouralSkillsFrontMatter = () => {
  const intl = useIntl();

  return (
    <div className="flex flex-col gap-1">
      <Heading level="h3" size="h6" className="m-0">
        {intl.formatMessage({
          defaultMessage: "Essential behavioural skills",
          id: "msr1cl",
          description: "Title for the essential behavioural skills",
        })}
      </Heading>
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
  );
};

export default EssentialBehaviouralSkillsFrontMatter;
