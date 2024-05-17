import { useIntl } from "react-intl";
import uniqueId from "lodash/uniqueId";
import isEmpty from "lodash/isEmpty";
import isArray from "lodash/isArray";
import { ReactNode } from "react";

import { Maybe } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";

interface FilterBlockProps {
  title: string;
  content?: Maybe<string | ReactNode> | Maybe<string[]>;
}

const FilterBlockContent = ({
  content,
}: {
  content: FilterBlockProps["content"];
}) => {
  const intl = useIntl();

  if (isEmpty(content)) {
    return (
      <ul
        className="my-3 list-inside list-disc pl-6"
        data-h2-color="base(black)"
      >
        <li>
          {intl.formatMessage({
            defaultMessage: "(None selected)",
            id: "+O6J4u",
            description: "Text shown when the filter was not selected",
          })}
        </li>
      </ul>
    );
  }

  return (
    <div>
      {isArray(content) && content.length > 0 ? (
        <ul
          className="my-3 list-inside list-disc pl-6"
          data-h2-color="base(black)"
        >
          {content.map((text) => (
            <li key={uniqueId()}>{text}</li>
          ))}
        </ul>
      ) : (
        content
      )}
    </div>
  );
};

const FilterBlock = ({ title, content }: FilterBlockProps) => {
  const intl = useIntl();

  return (
    <div className="mb-6">
      <p className="block pr-1 font-bold sm:inline">
        <span className="inline">{title}</span>
        <span className="hidden sm:inline">
          {intl.formatMessage(commonMessages.dividingColon)}
        </span>
      </p>
      <FilterBlockContent content={content} />
    </div>
  );
};

export default FilterBlock;
