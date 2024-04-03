import React from "react";
import { useIntl } from "react-intl";

import { Accordion, Link } from "@gc-digital-talent/ui";

type AccordionItems = Array<"your_gc_key" | "">;

const AccountManagement = () => {
  const intl = useIntl();
  const [currentAccordionItems, setCurrentAccordionItems] =
    React.useState<AccordionItems>([]); // Start with accordion closed

  const gcKeyURL =
    intl.locale === "en"
      ? "https://www.canada.ca/en/government/sign-in-online-account/gckey.html"
      : "https://www.canada.ca/fr/gouvernement/ouvrir-session-dossier-compte-en-ligne/clegc.html";

  return (
    <Accordion.Root
      mode="card"
      type="multiple"
      size="sm"
      value={currentAccordionItems}
      onValueChange={(value: AccordionItems) => setCurrentAccordionItems(value)}
    >
      <Accordion.Item value="your_gc_key">
        <Accordion.Trigger
          as="h3"
          subtitle={intl.formatMessage({
            defaultMessage:
              "Find out about GC Key and find links to account information.",
            id: "nEOzEg",
            description:
              "Introductory text displayed in login and authentication accordion.",
          })}
        >
          {intl.formatMessage({
            defaultMessage: "Your GC Key account",
            id: "zyYdOd",
            description: "Accordion trigger for your GC Key account info.",
          })}
        </Accordion.Trigger>
        <Accordion.Content>
          <p data-h2-margin-bottom="base(x1)">
            {intl.formatMessage({
              defaultMessage:
                "GC Digital Talent partners with the Government of Canada's credential service, GC Key, to provide you with account access using a single username and password. You can manage related data on the GC Key website and it will automatically reflect here when you access your account.",
              id: "izDsim",
              description:
                "Description of how we use GC Key for authentication.",
            })}
          </p>
          <Link newTab external href={gcKeyURL} mode="solid" color="secondary">
            {intl.formatMessage({
              defaultMessage: "Visit GC Key",
              id: "XOUxAJ",
              description: "Link text for visiting the GC Key website",
            })}
          </Link>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
};

export default AccountManagement;
