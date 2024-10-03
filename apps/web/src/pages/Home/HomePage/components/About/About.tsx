import { useIntl } from "react-intl";
import NewspaperIcon from "@heroicons/react/24/outline/NewspaperIcon";
import { ReactNode } from "react";

import { CardFlat, Heading } from "@gc-digital-talent/ui";
import { getLocale } from "@gc-digital-talent/i18n";

import { wrapAbbr } from "~/utils/nameUtils";

const About = () => {
  const intl = useIntl();
  const locale = getLocale(intl);
  return (
    <div
      data-h2-background="base(home-footer-linear)"
      data-h2-layer="base(2, relative)"
      data-h2-margin="base(-3%, 0, 0, 0)"
    >
      <div
        data-h2-position="base(relative)"
        data-h2-padding="base(calc((3rem * var(--h2-line-height-copy)) + 3%), 0, x3, 0) p-tablet(calc((4rem * var(--h2-line-height-copy)) + 3%), 0, x4, 0) l-tablet(calc((6rem * var(--h2-line-height-copy)) + 3%), 0, x6, 0)"
      >
        <div data-h2-wrapper="base(center, large, x1) p-tablet(center, large, x2)">
          <div data-h2-color="base:all(black)">
            <Heading
              level="h2"
              size="h3"
              data-h2-font-weight="base(400)"
              Icon={NewspaperIcon}
              data-h2-margin="base(0)"
            >
              {intl.formatMessage({
                defaultMessage: "Learn more",
                id: "87FqAO",
                description: "Heading for the about section of the homepage",
              })}
            </Heading>
            <div
              data-h2-display="base(grid)"
              data-h2-grid-template-columns="base(1fr) p-tablet(repeat(2, minmax(0, 1fr))) l-tablet(repeat(3, minmax(0, 1fr)))"
              data-h2-gap="base(x2) p-tablet(x3)"
              data-h2-padding="base(x2, 0, 0, 0)"
            >
              <CardFlat
                color="blackFixed"
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
                        : "https://www.canada.ca/fr/secretariat-conseil-tresor/organisation/mandat/dirigeant-principal-information.html",
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
                        "<abbreviation>GC</abbreviation> Digital Talent is only one of the many initiatives being led by the Office of the Chief Information Officer of Canada (OCIO). Learn more about OCIO's role in the Government of Canada. Check out Canada's Digital Ambition 2022 to see where OCIO is heading in the future.",
                      id: "h7URQB",
                      description:
                        "Description of the Office of the Chief Information Officer",
                    },
                    {
                      abbreviation: (text: ReactNode) => wrapAbbr(text, intl),
                    },
                  )}
                </p>
              </CardFlat>
              <CardFlat
                color="blackFixed"
                title={intl.formatMessage({
                  defaultMessage: "Digital Community Management",
                  id: "JRlnNk",
                  description: "Title for the Digital Community Management",
                })}
                links={[
                  {
                    external: true,
                    mode: "solid",
                    href:
                      locale === "en"
                        ? "https://www.canada.ca/en/government/system/digital-government/gcdigital-community/gcdigital-community-about-us.html#dcmo"
                        : "https://www.canada.ca/fr/gouvernement/systeme/gouvernement-numerique/collectivite-gcnumerique/collectivite-gcnumerique-a-propos.html#dcmo",
                    label: intl.formatMessage({
                      defaultMessage:
                        "Learn more<hidden> about Digital Community Management</hidden>",
                      id: "VBsMcq",
                      description: "Link text for Digital Community Management",
                    }),
                  },
                ]}
              >
                <p>
                  {intl.formatMessage(
                    {
                      defaultMessage:
                        "Behind the <abbreviation>GC</abbreviation> Digital Talent platform is a whole team of people designing, developing, screening applicants, talent managing employees, placing executives, and helping managers find the talent they need to deliver services to Canadians.",
                      id: "w1Lego",
                      description:
                        "Description for the Digital Community Management",
                    },
                    {
                      abbreviation: (text: ReactNode) => wrapAbbr(text, intl),
                    },
                  )}
                </p>
              </CardFlat>
              <CardFlat
                color="blackFixed"
                title={intl.formatMessage({
                  defaultMessage: "From concept to code",
                  id: "kHypfJ",
                  description: "Title for how the platform was created",
                })}
                links={[
                  {
                    href: `/${locale}/talent-cloud/report`,
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
                      description:
                        "Description of how the platform was created.",
                    },
                    {
                      abbreviation: (text: ReactNode) => wrapAbbr(text, intl),
                    },
                  )}
                </p>
              </CardFlat>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export the component
export default About;
