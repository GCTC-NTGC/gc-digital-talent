import * as React from "react";
import { useIntl } from "react-intl";

import { Link, Well } from "@gc-digital-talent/ui";

const statCanLink = (href: string, chunks: React.ReactNode) => (
  <Link newTab external href={href} color="black">
    {chunks}
  </Link>
);

interface DefinitionProps {
  url: string;
  quotedDefinition: string;
}

const Definition = ({ url, quotedDefinition }: DefinitionProps) => {
  const intl = useIntl();

  return (
    <Well>
      <p data-h2-margin-bottom="base(x1)" data-h2-font-weight="base(700)">
        {intl.formatMessage(
          {
            defaultMessage:
              "According to the <link>Statistics Canada definition</link>, this group:",
            id: "0nP0Wj",
            description:
              "Link to Statistics Canada's employment equity definitions",
          },
          {
            link: (chunks: React.ReactNode) => statCanLink(url, chunks),
          },
        )}
      </p>
      <p>{quotedDefinition}</p>
    </Well>
  );
};

export default Definition;
