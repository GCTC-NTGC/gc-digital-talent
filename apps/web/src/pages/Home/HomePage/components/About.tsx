import { useIntl } from "react-intl";
import NewspaperIcon from "@heroicons/react/24/outline/NewspaperIcon";
import { ReactNode } from "react";

import { CardFlat, Container, Heading } from "@gc-digital-talent/ui";
import { getLocale } from "@gc-digital-talent/i18n";

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
              defaultMessage: "Directive on Digital Talent",
              id: "xXwUGs",
              description: "Title for the digital talent directive page",
            })}
            links={[
              {
                external: true,
                mode: "solid",
                href: paths.directive(),
                label: intl.formatMessage({
                  defaultMessage: "Check out the Directive",
                  id: "sGPKUt",
                  description:
                    "Link text to read the directive on digital talent",
                }),
              },
            ]}
          >
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "Learn more about the Directive on Digital Talent. Connected to the Policy on Service and Digital, the Directive sets out reporting and coordination requirements for departments related to digital talent sourcing, from early planning to hiring and contracting.",
                id: "L0ugLs",
                description:
                  "Summary of the directive on digital talent featured item",
              })}
            </p>
          </CardFlat>
          <CardFlat
            color="black"
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
            color="black"
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
