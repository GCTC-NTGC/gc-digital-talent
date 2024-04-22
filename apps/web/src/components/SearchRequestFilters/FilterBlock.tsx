import React from "react";
import { useIntl } from "react-intl";
import uniqueId from "lodash/uniqueId";
import isEmpty from "lodash/isEmpty";
import isArray from "lodash/isArray";

import { Maybe } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";

interface FilterBlockProps {
  title: string;
  content?: Maybe<string | React.ReactNode> | Maybe<string[]>;
}

const FilterBlockContent = ({
  content,
}: {
  content: FilterBlockProps["content"];
}) => {
  const intl = useIntl();

  if (isEmpty(content)) {
    return (
      <ul data-h2-color="base(black)">
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
        <ul data-h2-color="base(black)">
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
    <div data-h2-padding="base(0, 0, x1, 0)">
      <p
        data-h2-display="base(block) p-tablet(inline)"
        data-h2-padding="base(0, x.125, 0, 0)"
        data-h2-font-weight="base(600)"
      >
        <span data-h2-display="base(inline)">{title}</span>
        <span data-h2-display="base(none) p-tablet(inline)">
          {intl.formatMessage(commonMessages.dividingColon)}
        </span>
      </p>
      <FilterBlockContent content={content} />
    </div>
  );
};

export default FilterBlock;
