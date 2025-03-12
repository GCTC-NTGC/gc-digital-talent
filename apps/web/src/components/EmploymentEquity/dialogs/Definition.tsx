import { useIntl } from "react-intl";
import { ReactNode } from "react";

import { Link, Well } from "@gc-digital-talent/ui";

const statCanLink = (href: string, chunks: ReactNode) => (
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
      <p>
        <span data-h2-font-weight="base(700)">
          {intl.formatMessage(
            {
              defaultMessage:
                "According to the <link>Statistics Canada definition</link>, this group ",
              id: "X3pHUD",
              description:
                "Link to Statistics Canada's employment equity definitions",
            },
            {
              link: (chunks: ReactNode) => statCanLink(url, chunks),
            },
          )}
        </span>
        {quotedDefinition}
      </p>
    </Well>
  );
};

export default Definition;
