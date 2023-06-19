// Vendor dependencies
import React from "react";
import { useIntl } from "react-intl";
import MagnifyingGlassCircleIcon from "@heroicons/react/24/outline/MagnifyingGlassCircleIcon";

// Local assets
import { Heading, CardFlat } from "@gc-digital-talent/ui";
import { useLocale } from "@gc-digital-talent/i18n";
import { useAuthentication } from "@gc-digital-talent/auth";

import useRoutes from "~/hooks/useRoutes";
import { wrapAbbr } from "~/utils/nameUtils";

import desktopGraphicsLight1 from "~/assets/img/Desktop_Graphics_light_1.png";
import desktopGraphicsDark1 from "~/assets/img/Desktop_Graphics_dark_1.png";

// Create the page component
const Opportunities = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const { locale } = useLocale();
  const { loggedIn } = useAuthentication();

  return (
    <div data-h2-margin="base(-3%, 0, 0, 0)" data-h2-layer="base(2, relative)">
      <div
        data-h2-height="base(100%)"
        data-h2-width="base(100%)"
        data-h2-background-color="base(white) base:dark(black.light)"
        data-h2-position="base(absolute)"
        data-h2-transform="base(skewY(-3deg))"
        data-h2-overflow="base(hidden)"
      >
        <img
          data-h2-display="base(block) base:dark(none)"
          data-h2-position="base(absolute)"
          data-h2-location="base(0, 0, auto, auto)"
          data-h2-transform="base(translate(32%, -52%) skew(3deg)) l-tablet(translate(0, 0) skew(3deg))"
          data-h2-height="base(auto) l-tablet(40%)"
          data-h2-width="base(250%) l-tablet(auto)"
          data-h2-max-width="base(initial)"
          src={desktopGraphicsLight1}
          alt=""
        />
        <img
          data-h2-display="base(none) base:dark(block)"
          data-h2-position="base(absolute)"
          data-h2-location="base(0, 0, auto, auto)"
          data-h2-transform="base(translate(32%, -52%) skew(3deg)) l-tablet(translate(0, 0) skew(3deg))"
          data-h2-height="base(auto) l-tablet(40%)"
          data-h2-width="base(250%) l-tablet(auto)"
          data-h2-max-width="base(initial)"
          src={desktopGraphicsDark1}
          alt=""
        />
        <div
          data-h2-background="base(main-linear)"
          data-h2-location="base(0, 0, auto, 0)"
          data-h2-display="base(block)"
          data-h2-height="base(x1)"
          data-h2-position="base(absolute)"
        />
      </div>
      <div
        data-h2-position="base(relative)"
        data-h2-container="base(center, large, x1) p-tablet(center, large, x2)"
      >
        <div data-h2-padding="base(x3, 0) p-tablet(x5, 0, x4, 0) l-tablet(x7, 0, x6, 0)">
          <Heading
            level="h2"
            Icon={MagnifyingGlassCircleIcon}
            color="quaternary"
            data-h2-margin="base(0, 0, x0.5, 0)"
          >
            {intl.formatMessage({
              defaultMessage: "Ongoing recruitment",
              id: "nEMeaQ",
              description: "Heading for the recruitment opportunities",
            })}
          </Heading>
          <div
            data-h2-display="base(grid)"
            data-h2-grid-template-columns="base(1fr) p-tablet(repeat(2, minmax(0, 1fr))) l-tablet(repeat(3, minmax(0, 1fr)))"
            data-h2-gap="base(x2) p-tablet(x3)"
            data-h2-padding="base(x2, 0, 0, 0) p-tablet(x3, 0, 0, 0)"
          >
            <CardFlat
              color="quaternary"
              title={intl.formatMessage({
                defaultMessage: "Jobs in digital government",
                id: "+cBKDC",
                description:
                  "Heading for the digital government job opportunities",
              })}
              links={[
                {
                  href: paths.browsePools(),
                  mode: "solid",
                  label: intl.formatMessage(
                    {
                      defaultMessage: "Browse jobs",
                      id: "dkHB8N",
                      description:
                        "Link text for IT jobs in government call to action",
                    },
                    {
                      abbreviation: (text: React.ReactNode) =>
                        wrapAbbr(text, intl),
                    },
                  ),
                },
              ]}
            >
              <p>
                {intl.formatMessage(
                  {
                    defaultMessage:
                      "Check out the latest <abbreviation>GC</abbreviation> opportunities in digital and tech, from entry level to management. Find a team, make a difference, and be inspired.",
                    id: "jAFzzR",
                    description:
                      "Description for the digital government job opportunities",
                  },
                  {
                    abbreviation: (text: React.ReactNode) =>
                      wrapAbbr(text, intl),
                  },
                )}
              </p>
            </CardFlat>
            <CardFlat
              color="secondary"
              title={intl.formatMessage({
                defaultMessage:
                  "IT Apprenticeship Program for Indigenous Peoples",
                id: "4N/PxH",
                description:
                  "Heading for the IT Apprenticeship Program for Indigenous Peoples on home page",
              })}
              links={[
                {
                  href: `/${locale}/indigenous-it-apprentice`,
                  mode: "solid",
                  label: intl.formatMessage({
                    defaultMessage:
                      "Apply<hidden> to the IT Apprenticeship Program for Indigenous Peoples</hidden> now",
                    description:
                      "Link text to apply for the IT Apprenticeship Program for Indigenous Peoples",
                    id: "Ew/GPP",
                  }),
                },
              ]}
            >
              <p>
                {intl.formatMessage(
                  {
                    defaultMessage:
                      "Designed by the Indigenous community for the Indigenous community, this program recruits entry-level applicants for learning and development <abbreviation>IT</abbreviation> opportunities across government.",
                    id: "szt3yx",
                    description:
                      "Description for the IT Apprenticeship Program for Indigenous Peoples on home page",
                  },
                  {
                    abbreviation: (text: React.ReactNode) =>
                      wrapAbbr(text, intl),
                  },
                )}
              </p>
            </CardFlat>
            <CardFlat
              color="tertiary"
              title={intl.formatMessage({
                defaultMessage: "Executives in digital government",
                id: "9KOwXq",
                description: "Heading for executive jobs in government",
              })}
              links={[
                {
                  href: paths.myProfile(),
                  mode: "solid",
                  label: loggedIn
                    ? intl.formatMessage({
                        defaultMessage: "Get ready by updating your profile",
                        id: "OMDX09",
                        description:
                          "Link text to update your profile for executive jobs in government",
                      })
                    : intl.formatMessage({
                        defaultMessage: "Get ready by creating a profile",
                        id: "qLYONf",
                        description:
                          "Link text to create a profile for executive jobs in government",
                      }),
                },
              ]}
            >
              <p>
                {intl.formatMessage({
                  defaultMessage: "Coming soon",
                  id: "mI6AeU",
                  description:
                    "Text displayed for executive jobs on homepage, indicating it is not ready",
                })}
              </p>
              <p>
                {intl.formatMessage(
                  {
                    defaultMessage:
                      "From entry-level executives to <cioAbbreviation>CIO</cioAbbreviation> opportunities across the <gcAbbreviation>GC</gcAbbreviation>, this is the place to come if you're ready to take on a digital leadership role making a difference for Canadians.",
                    id: "YEarCb",
                    description: "Description for executive jobs in government",
                  },
                  {
                    cioAbbreviation: (text: React.ReactNode) =>
                      wrapAbbr(
                        text,
                        intl,
                        "Chief Information Officer of Canada",
                      ),
                    gcAbbreviation: (text: React.ReactNode) =>
                      wrapAbbr(text, intl),
                  },
                )}
              </p>
            </CardFlat>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export the component
export default Opportunities;
