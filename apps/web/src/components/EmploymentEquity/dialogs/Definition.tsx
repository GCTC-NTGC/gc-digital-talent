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
      <p className="mb-6 font-bold">
        {intl.formatMessage(
          {
            defaultMessage:
              "According to the <link>Statistics Canada definition</link>, this group:",
            id: "0nP0Wj",
            description:
              "Link to Statistics Canada's employment equity definitions",
          },
          {
            link: (chunks: ReactNode) => statCanLink(url, chunks),
          },
        )}
      </p>
      <p>{quotedDefinition}</p>
    </Well>
  );
};

export default Definition;
