import React from "react";
import { useIntl } from "react-intl";

import { ExternalLink } from "@common/components/Link";

const statCanLink = (href: string, chunks: string[]) => (
  <ExternalLink newTab href={href}>
    {...chunks}
  </ExternalLink>
);

interface DefinitionProps {
  url: string;
}

const Definition: React.FC<DefinitionProps> = ({ url }) => {
  const intl = useIntl();

  return (
    <p data-h2-margin="base(x1, 0)">
      {intl.formatMessage(
        {
          defaultMessage:
            "According to <link>Statistics Canada's definition.</link>",
          description:
            "Link to Statistics Canada's employment equity definitions",
        },
        {
          link: (chunks) => statCanLink(url, chunks),
        },
      )}
    </p>
  );
};

export default Definition;
