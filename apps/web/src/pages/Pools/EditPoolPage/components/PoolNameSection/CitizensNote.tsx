import { ReactNode } from "react";
import { useIntl } from "react-intl";

import { getLocale, Locales } from "@gc-digital-talent/i18n";
import { Link, Notice } from "@gc-digital-talent/ui";

const pseaUrl: Record<Locales, string> = {
  en: "https://laws-lois.justice.gc.ca/eng/acts/p-33.01/",
  fr: "https://laws-lois.justice.gc.ca/fra/lois/p-33.01/",
} as const;

const CitizensNote = () => {
  const intl = useIntl();
  const locale = getLocale(intl);

  return (
    <Notice.Root color="warning" className="xs:col-span-2">
      <Notice.Content>
        {intl.formatMessage(
          {
            defaultMessage:
              "By selecting “Only Canadian citizens can apply”, you’re confirming that this job opportunity is with a department or agency that is not subject to the <a><italic>Public Service Employment Act</italic></a>.",
            id: "4f81Y1",
            description:
              "Warning message when selecting the only-canadian-citizens limitation option",
          },
          {
            a: (chunks: ReactNode) => (
              <Link href={pseaUrl[locale]} color="warning" newTab external>
                {chunks}
              </Link>
            ),
          },
        )}
      </Notice.Content>
    </Notice.Root>
  );
};

export default CitizensNote;
