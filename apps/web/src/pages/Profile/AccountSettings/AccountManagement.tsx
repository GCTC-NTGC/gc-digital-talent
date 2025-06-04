import { useIntl } from "react-intl";

import { Accordion, Link } from "@gc-digital-talent/ui";

const AccountManagement = () => {
  const intl = useIntl();

  const gcKeyURL =
    intl.locale === "en"
      ? "https://www.canada.ca/en/government/sign-in-online-account/gckey.html"
      : "https://www.canada.ca/fr/gouvernement/ouvrir-session-dossier-compte-en-ligne/clegc.html";

  return (
    <Accordion.Root mode="card" type="multiple" size="sm">
      <Accordion.Item value="your_gc_key">
        <Accordion.Trigger
          as="h3"
          subtitle={intl.formatMessage({
            defaultMessage:
              "Find out about GCKey and find links to account information.",
            id: "d3HIMV",
            description:
              "Introductory text displayed in login and authentication accordion.",
          })}
        >
          {intl.formatMessage({
            defaultMessage: "Your GCKey account",
            id: "i4EMJm",
            description: "Accordion trigger for your GCKey account info.",
          })}
        </Accordion.Trigger>
        <Accordion.Content>
          <p data-h2-margin-bottom="base(x1)">
            {intl.formatMessage({
              defaultMessage:
                "GC Digital Talent partners with the Government of Canada's credential service, GCKey, to provide you with account access using a single username and password. You can manage your username and password on the GCKey website, and those changes will automatically work when signing in to the GC Digital Talent platform.",
              id: "bzcV2Q",
              description:
                "Description of how we use GCKey for authentication.",
            })}
          </p>
          <Link newTab external href={gcKeyURL} mode="solid" color="primary">
            {intl.formatMessage({
              defaultMessage: "Visit GCKey",
              id: "aVp6q7",
              description: "Link text for visiting the GCKey website",
            })}
          </Link>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
};

export default AccountManagement;
