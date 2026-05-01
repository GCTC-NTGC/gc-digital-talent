import type { ReactNode } from "react";
import { useIntl } from "react-intl";

import { navigationMessages } from "@gc-digital-talent/i18n";
import { CardFlat, Container } from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";
import { wrapAbbr } from "~/utils/nameUtils";

const ConversionFeatures = () => {
  const intl = useIntl();
  const paths = useRoutes();
  return (
    <div className="border-t border-t-black/50 bg-white py-18 text-black dark:border-t-white/50 dark:bg-gray-700 dark:text-white">
      <Container className="relative">
        <div className="grid gap-12 xs:grid-cols-2 xs:gap-18">
          <CardFlat
            color="secondary"
            title={intl.formatMessage(
              {
                defaultMessage:
                  "Browse <abbreviation>IT</abbreviation> opportunities for the Indigenous community",
                id: "drDPf3",
                description:
                  "Title for Indigenous community job opportunities on Browse IT jobs page",
              },
              {
                abbreviation: (text: ReactNode) => wrapAbbr(text, intl),
              },
            )}
            links={[
              {
                href: `${paths.home()}/indigenous-it-apprentice`,
                mode: "solid",
                external: true,
                label: intl.formatMessage({
                  defaultMessage:
                    "Apply<hidden> to the IT Apprenticeship Program for Indigenous Peoples</hidden> now",
                  description:
                    "Link text to go to IAP homepage on Browse IT jobs page",
                  id: "NSHPIJ",
                }),
              },
            ]}
          >
            <p>
              {intl.formatMessage(
                {
                  defaultMessage:
                    "Designed by, with, and for the Indigenous community, the program recruits First Nations, Inuit, and Métis applicants who have a passion for <abbreviation>IT</abbreviation>, for entry level employment, learning and development opportunities.",
                  id: "OvL68O",
                  description:
                    "Summary for Indigenous community job opportunities on Browse IT jobs page",
                },
                {
                  abbreviation: (text: ReactNode) => wrapAbbr(text, intl),
                },
              )}
            </p>
          </CardFlat>
          <CardFlat
            color="secondary"
            title={intl.formatMessage({
              defaultMessage: "Hire talent for your team",
              id: "jTN0bg",
              description:
                "Title for to go to the search page on Browse IT jobs page",
            })}
            links={[
              {
                href: paths.search(),
                mode: "solid",
                label: intl.formatMessage(navigationMessages.findTalent),
              },
            ]}
          >
            <p>
              {intl.formatMessage(
                {
                  defaultMessage:
                    "Let our team save you time and energy by matching your needs to pre-qualified <abbreviation>IT</abbreviation> professionals with the right skills for the job. All the talent in our pools has been qualified through a competitive process, so you can jump straight to the interview and decide if they are a good fit for your team.",
                  id: "6UVZOY",
                  description:
                    "Summary for to go to the search page on Browse IT jobs page",
                },
                {
                  abbreviation: (text: ReactNode) => wrapAbbr(text, intl),
                },
              )}
            </p>
          </CardFlat>
        </div>
      </Container>
    </div>
  );
};

export default ConversionFeatures;
