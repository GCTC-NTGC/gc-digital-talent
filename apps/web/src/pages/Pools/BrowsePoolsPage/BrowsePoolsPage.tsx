import { defineMessage, useIntl } from "react-intl";
import { useQuery } from "urql";
import { ReactNode } from "react";
import { tv } from "tailwind-variants";

import {
  Card,
  CardFlat,
  Container,
  Flourish,
  Heading,
  Link,
  Pending,
} from "@gc-digital-talent/ui";
import { useTheme } from "@gc-digital-talent/theme";
import { useAuthentication } from "@gc-digital-talent/auth";
import { nowUTCDateTime } from "@gc-digital-talent/date-helpers";
import { navigationMessages } from "@gc-digital-talent/i18n";
import {
  graphql,
  PoolStatus,
  PublishingGroup,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import { wrapAbbr } from "~/utils/nameUtils";
import browseHeroImg from "~/assets/img/browse_header.webp";
import flourishTopLight from "~/assets/img/browse_top_light.webp";
import flourishBottomLight from "~/assets/img/browse_bottom_light.webp";
import flourishTopDark from "~/assets/img/browse_top_dark.webp";
import flourishBottomDark from "~/assets/img/browse_bottom_dark.webp";

import ActiveRecruitmentSection from "./components/ActiveRecruitmentSection/ActiveRecruitmentSection";

const flourish = tv({
  base: "absolute z-[1] w-[25vw]",
  variants: {
    isTop: {
      true: "top-0 right-0",
      false: "bottom-0 left-0",
    },
  },
});

const BrowsePoolsPage_Query = graphql(/* GraphQL */ `
  query BrowsePoolsPage($closingAfter: DateTime) {
    publishedPools(closingAfter: $closingAfter) {
      id
      publishingGroup {
        value
        label {
          en
          fr
        }
      }
      status {
        value
        label {
          en
          fr
        }
      }

      ...ActiveRecruitmentSectionPool
    }
  }
`);

const now = nowUTCDateTime();

const subTitle = defineMessage({
  defaultMessage:
    "Find and apply to digital talent opportunities in the Government of Canada.",
  id: "2UDONd",
  description: "Subtitle for the browse IT jobs page",
});

export const Component = () => {
  const { mode } = useTheme();
  const intl = useIntl();
  const { loggedIn } = useAuthentication();
  const paths = useRoutes();

  const [{ data, fetching, error }] = useQuery({
    query: BrowsePoolsPage_Query,
    variables: { closingAfter: now }, // pass current dateTime into query argument
  });

  const pools = unpackMaybes(data?.publishedPools);
  const title = intl.formatMessage(navigationMessages.browseJobs);
  const formattedSubTitle = intl.formatMessage(subTitle);

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: title,
        url: paths.browsePools(),
      },
    ],
  });

  const activeRecruitmentPools = pools.filter(
    (p) =>
      p.status?.value === PoolStatus.Published && // list jobs which have the PUBLISHED PoolStatus
      (p.publishingGroup?.value === PublishingGroup.ItJobs ||
        p.publishingGroup?.value === PublishingGroup.ExecutiveJobs),
  );

  // a different footer message is displayed if there are opportunities showing, otherwise a null state message is used
  const areOpportunitiesShowing = activeRecruitmentPools.length;

  const profileLink = {
    href: loggedIn ? paths.profile() : paths.login(),
    label: loggedIn
      ? intl.formatMessage({
          defaultMessage: "Update my profile",
          id: "jfCwes",
          description:
            "Link text to direct users to the profile page when signed in",
        })
      : intl.formatMessage({
          defaultMessage: "Create a profile",
          id: "wPpvvm",
          description:
            "Link text to direct users to the profile page when anonymous",
        }),
  };

  return (
    <Pending fetching={fetching} error={error}>
      <SEO title={title} description={formattedSubTitle} />
      <Hero
        imgPath={browseHeroImg}
        title={title}
        subtitle={formattedSubTitle}
        crumbs={crumbs}
      />

      <div className="relative overflow-hidden py-18">
        <img
          alt=""
          src={mode === "dark" ? flourishTopDark : flourishTopLight}
          className={flourish({ isTop: true })}
        />
        <Container className="relative z-[2]">
          <ActiveRecruitmentSection poolsQuery={activeRecruitmentPools} />
          <Card className="mt-6">
            <div className="items-center justify-between gap-18 xs:flex">
              <div>
                <Heading level="h2" size="h6" className="m-t0 mb-3">
                  {areOpportunitiesShowing
                    ? intl.formatMessage({
                        defaultMessage: "More opportunities are coming soon!",
                        id: "g+JcDC",
                        description:
                          "Heading for message about upcoming opportunities",
                      })
                    : intl.formatMessage({
                        defaultMessage:
                          "No opportunities are available right now, but more are coming soon!",
                        id: "xHjgXz",
                        description:
                          "Text displayed when there are no pool advertisements to display",
                      })}
                </Heading>
                <p>
                  {loggedIn
                    ? intl.formatMessage({
                        defaultMessage:
                          "We're posting new job opportunities all the time. By keeping your profile up to date, you'll be able to submit applications lightning fast when the time comes.",
                        id: "8hnMtx",
                        description:
                          "Text describing upcoming opportunities instructing users to update a profile when signed in",
                      })
                    : intl.formatMessage({
                        defaultMessage:
                          "We're posting new job opportunities all the time. By starting your profile now, you'll be able to submit applications lightning fast when the time comes.",
                        id: "PH5Lah",
                        description:
                          "Text describing upcoming opportunities instructing users to create a profile when anonymous",
                      })}
                </p>
              </div>
              <div className="mt-6 shrink-0 xs:mt-0">
                <Link
                  color="primary"
                  mode="solid"
                  href={profileLink.href}
                  style={{ whiteSpace: "nowrap" }}
                >
                  {profileLink.label}
                </Link>
              </div>
            </div>
          </Card>
        </Container>
        <img
          alt=""
          src={mode === "dark" ? flourishBottomDark : flourishBottomLight}
          className={flourish({ isTop: false })}
        />
      </div>
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
      <Flourish />
    </Pending>
  );
};

Component.displayName = "BrowsePoolsPage";

export default Component;
