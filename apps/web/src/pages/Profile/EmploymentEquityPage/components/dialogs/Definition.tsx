import React from "react";
import { useIntl } from "react-intl";

import { ExternalLink } from "@gc-digital-talent/ui";

const statCanLink = (href: string, chunks: React.ReactNode) => (
  <ExternalLink newTab href={href}>
    {chunks}
  </ExternalLink>
);

interface DefinitionProps {
  url: string;
}

const Definition = ({ url }: DefinitionProps) => {
  const intl = useIntl();

  return (
    <p data-h2-margin="base(x1, 0)">
      {intl.formatMessage(
        {
          defaultMessage:
            "According to <link>Statistics Canada's definition.</link>",
          id: "z44LTK",
          description:
            "Link to Statistics Canada's employment equity definitions",
        },
        {
          link: (chunks: React.ReactNode) => statCanLink(url, chunks),
        },
      )}
    </p>
  );
};

export default Definition;
