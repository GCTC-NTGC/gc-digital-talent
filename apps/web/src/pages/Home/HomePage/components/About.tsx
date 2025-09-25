import { useIntl } from "react-intl";
import NewspaperIcon from "@heroicons/react/24/outline/NewspaperIcon";
import { ReactNode } from "react";

import { CardFlat, Container, Heading } from "@gc-digital-talent/ui";
import { commonMessages, getLocale } from "@gc-digital-talent/i18n";

import { wrapAbbr } from "~/utils/nameUtils";
import useRoutes from "~/hooks/useRoutes";

const About = () => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useRoutes();

  return (
    <div className="relative z-[2] -mt-[3%] bg-linear-120 from-primary via-success to-warning">
      <Container className="relative pt-24 pb-18 text-black xs:pt-36 xs:pb-24 sm:pt-48 sm:pb-36">
        <Heading
          level="h2"
          size="h3"
          icon={NewspaperIcon}
          className="mt-0 font-normal"
        >
          {intl.formatMessage({
            defaultMessage: "Learn more",
            id: "87FqAO",
            description: "Heading for the about section of the homepage",
          })}
        </Heading>
        <div className="grid gap-12 pt-12 xs:gap-18 sm:grid-cols-3">
          <CardFlat
            color="black"
            title={intl.formatMessage({
              defaultMessage: "Office of the Chief Information Officer",
              id: "i9cA5V",
              description:
                "Title for the Office of the Chief Information Officer",
            })}
            links={[
              {
                external: true,
                mode: "solid",
                href:
                  locale === "en"
                    ? "https://www.canada.ca/en/treasury-board-secretariat/corporate/mandate/chief-information-officer.html"
                    : "https://www.canada.ca/fr/secretariat-conseil-tresor/organisation/mandat/dirigeante-principale-information.html",
                label: intl.formatMessage({
                  defaultMessage:
                    "Learn more<hidden> about the Office of the Chief Information Officer</hidden>",
                  id: "NjHXGh",
                  description:
                    "Link text for the Office of the Chief Information Officer",
                }),
              },
            ]}
          >
            <p>
              {intl.formatMessage(
                {
                  defaultMessage:
                    "<abbreviation>GC</abbreviation> Digital Talent is only one of the many initiatives being led by the Office of the Chief Information Officer of Canada (OCIO). Learn more about OCIO's role in the Government of Canada.",
                  id: "AFE4wk",
                  description:
                    "Description of the Office of the Chief Information Officer",
                },
                {
                  abbreviation: (text: React.ReactNode) => wrapAbbr(text, intl),
                },
              )}
            </p>
          </CardFlat>
          <CardFlat
            color="black"
            title={intl.formatMessage(commonMessages.iapTitle)}
            links={[
              {
                mode: "solid",
                href: paths.iap(),
                label: intl.formatMessage({
                  defaultMessage:
                    "Learn more<hidden> about the IT Apprenticeship Program for Indigenous Peoples</hidden>",
                  id: "6tqGpT",
                  description:
                    "Link text to the IT Apprenticeship Program for Indigenous Peoples",
                }),
              },
            ]}
          >
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "Designed by the Indigenous community for the Indigenous community, this program recruits entry-level applicants for learning and development IT opportunities across government.",
                id: "TUi+jx",
                description:
                  "Summary of the IT Apprenticeship Program for Indigenous Peoples for the homepage",
              })}
            </p>
          </CardFlat>
          <CardFlat
            color="black"
            title={intl.formatMessage({
              defaultMessage: "From concept to code",
              id: "kHypfJ",
              description: "Title for how the platform was created",
            })}
            links={[
              {
                href: paths.tcReport(),
                external: true,
                mode: "solid",
                label: intl.formatMessage({
                  defaultMessage:
                    "Learn more<hidden> about how the platform was created</hidden>",
                  id: "jDv8lx",
                  description:
                    "Link text to learn more about the platform creation",
                }),
              },
            ]}
          >
            <p>
              {intl.formatMessage(
                {
                  defaultMessage:
                    "Curious about how the <abbreviation>GC</abbreviation> Digital Talent platform was developed? Want to learn more about the ideas, designs, and philosophy going on behind the scenes? Check out the path from Talent Cloud's experimental pilot to today's full-scale platform.",
                  id: "bKRX6C",
                  description: "Description of how the platform was created.",
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

// Export the component
export default About;
