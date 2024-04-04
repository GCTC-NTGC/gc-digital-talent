import React from "react";
import { useIntl } from "react-intl";
import uniqueId from "lodash/uniqueId";
import isEmpty from "lodash/isEmpty";

import { Maybe } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";

interface FilterBlockProps {
  title: string;
  content?: Maybe<string | React.ReactNode> | Maybe<string[]>;
  children?: React.ReactNode;
}

const FilterBlock = ({ title, content, children }: FilterBlockProps) => {
  const intl = useIntl();

  const emptyArrayOutput = (
    input: string | React.ReactNode | string[] | null | undefined,
  ) => {
    return input && !isEmpty(input) ? (
      <p data-h2-display="base(inline)" data-h2-color="base(black)">
        {input}
      </p>
    ) : (
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
  };

  return (
    <div data-h2-padding="base(0, 0, x1, 0)">
      <div data-h2-visually-hidden="base(visible) p-tablet(hidden)">
        <p
          data-h2-display="base(inline)"
          data-h2-padding="base(0, x.125, 0, 0)"
          data-h2-font-weight="base(600)"
        >
          {title}:
        </p>
        {content !== undefined && (
          <span>
            {content instanceof Array && content.length > 0 ? (
              <p data-h2-display="base(inline)" data-h2-color="base(black)">
                {content.map((text): string => text).join(", ")}
              </p>
            ) : (
              <p data-h2-display="base(inline)" data-h2-color="base(black)">
                {content && !isEmpty(content)
                  ? content
                  : intl.formatMessage(commonMessages.notApplicable)}
              </p>
            )}
          </span>
        )}
        {children && children}
      </div>
      <div data-h2-visually-hidden="base(hidden) p-tablet(visible)">
        <p
          data-h2-display="base(block)"
          data-h2-padding="base(0, x.125, 0, 0)"
          data-h2-font-weight="base(600)"
        >
          {title}
        </p>
        {content !== undefined && (
          <span>
            {content instanceof Array && content.length > 0 ? (
              <ul data-h2-color="base(black)">
                {content.map((text) => (
                  <li key={uniqueId()}>{text}</li>
                ))}
              </ul>
            ) : (
              emptyArrayOutput(content)
            )}
          </span>
        )}
        {children && children}
      </div>
    </div>
  );
};

export default FilterBlock;
