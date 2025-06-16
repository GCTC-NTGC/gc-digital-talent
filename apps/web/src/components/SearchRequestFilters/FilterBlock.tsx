import { useIntl } from "react-intl";
import uniqueId from "lodash/uniqueId";
import isEmpty from "lodash/isEmpty";
import { ReactNode } from "react";

import { Maybe } from "@gc-digital-talent/graphql";
import { Ul } from "@gc-digital-talent/ui";

import FieldDisplay from "../FieldDisplay/FieldDisplay";

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
      <Ul>
        <li>
          {intl.formatMessage({
            defaultMessage: "(None selected)",
            id: "+O6J4u",
            description: "Text shown when the filter was not selected",
          })}
        </li>
      </Ul>
    );
  }

  return (
    <div>
      {Array.isArray(content) && content.length > 0 ? (
        <Ul>
          {content.map((text) => (
            <li key={uniqueId()}>{text}</li>
          ))}
        </Ul>
      ) : (
        content
      )}
    </div>
  );
};

const FilterBlock = ({ title, content }: FilterBlockProps) => {
  return (
    <FieldDisplay label={title} className="mb-6">
      <FilterBlockContent content={content} />
    </FieldDisplay>
  );
};

export default FilterBlock;
