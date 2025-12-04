import { useIntl } from "react-intl";
import { ReactNode } from "react";

import { Link, Notice } from "@gc-digital-talent/ui";

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
    <Notice.Root>
      <Notice.Content>
        <p>
          <span className="font-bold">
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
      </Notice.Content>
    </Notice.Root>
  );
};

export default Definition;
