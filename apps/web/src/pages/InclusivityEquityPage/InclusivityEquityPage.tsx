import { useIntl } from "react-intl";
import { ReactNode } from "react";
import AdjustmentsHorizontalIcon from "@heroicons/react/24/outline/AdjustmentsHorizontalIcon";
import HandRaisedIcon from "@heroicons/react/24/outline/HandRaisedIcon";
import LightBulbIcon from "@heroicons/react/24/outline/LightBulbIcon";

import { Container, Link, TableOfContents, Ul } from "@gc-digital-talent/ui";
import { Locales, commonMessages, getLocale } from "@gc-digital-talent/i18n";

import Hero from "~/components/Hero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoute from "~/hooks/useRoutes";

const employmentEquityActLink = (locale: Locales, chunks: ReactNode) => (
  <Link
    external
    newTab
    href={
      locale === "en"
        ? "https://laws-lois.justice.gc.ca/eng/acts/e-5.401/page-1.html"
        : "https://laws-lois.justice.gc.ca/fra/lois/e-5.401/page-1.html"
    }
  >
    {chunks}
  </Link>
);

const internalLink = (href: string, chunks: ReactNode) => (
  <Link href={href}>{chunks}</Link>
);

const researchAndDevelopmentLink = (locale: Locales, chunks: ReactNode) => (
  <Link external href={`/${locale}/talent-cloud/report`}>
    {chunks}
  </Link>
);

const Text = ({ children }: { children: ReactNode }) => (
  <p className="my-6">{children}</p>
);

interface Section {
  id: string;
  title: ReactNode;
}

export const Component = () => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useRoute();

  const pageTitle = intl.formatMessage({
    defaultMessage: "Inclusivity and equity",
    id: "PCypnL",
    description: "Title for the websites inclusivity and equity page",
  });

  const sections: Record<string, Section> = {
    importance: {
      id: "importance",
      title: intl.formatMessage({
        defaultMessage: "The importance of self-declaration",
        id: "sJYWPi",
        description: "Title for self-declaration section",
      }),
    },
    howDataIsUsed: {
      id: "how-data-is-used",
      title: intl.formatMessage({
        defaultMessage: "How self-declaration data is used",
        id: "7mdPUJ",
        description: "Title for how self-declaration data is used section",
      }),
    },
    commitment: {
      id: "commitment",
      title: intl.formatMessage({
        defaultMessage: "The GC Digital Talent team's commitment",
        id: "UCv0X2",
        description: "Title for our commitment to inclusivity and equity",
      }),
    },
  };

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: pageTitle,
        url: paths.inclusivityEquity(),
      },
    ],
  });

  return (
    <>
      <Hero
        title={pageTitle}
        crumbs={crumbs}
        subtitle={intl.formatMessage({
          defaultMessage:
            "Learn how our team uses employment equity information to shape equity and diversity in hiring.",
          id: "51BAr3",
          description: "Subtitle for the inclusivity and equity page",
        })}
      />
      <Container className="my-18">
        <TableOfContents.Wrapper>
          <TableOfContents.Navigation>
            <TableOfContents.List>
              {Object.values(sections).map((section) => (
                <TableOfContents.ListItem key={section.id}>
                  <TableOfContents.AnchorLink id={section.id}>
                    {section.title}
                  </TableOfContents.AnchorLink>
                </TableOfContents.ListItem>
              ))}
            </TableOfContents.List>
          </TableOfContents.Navigation>
          <TableOfContents.Content>
            <TableOfContents.Section id={sections.importance.id}>
              <TableOfContents.Heading
                size="h3"
                icon={LightBulbIcon}
                color="primary"
                className="mt-0"
              >
                {sections.importance.title}
              </TableOfContents.Heading>
            </TableOfContents.Section>
            <Text>
              {intl.formatMessage(
                {
                  defaultMessage:
                    "If you're a member of an <link>employment equity group</link>, you can choose to self-declare when you create your profile.",
                  id: "MXZ8Ms",
                  description: "Paragraph 1, importance of self-declaration",
                },
                {
                  link: (chunks: ReactNode) =>
                    employmentEquityActLink(locale, chunks),
                },
              )}
            </Text>
            <Text>
              {intl.formatMessage(
                {
                  defaultMessage:
                    "Providing this information on GC Digital Talent is optional. If you share your personal information, GC Digital Talent <link>commits to protecting it</link>.",
                  id: "Q8hjGZ",
                  description: "Paragraph 2, importance of self-declaration",
                },
                {
                  link: (chunks: ReactNode) =>
                    internalLink(paths.privacyPolicy(), chunks),
                },
              )}
            </Text>
            <Text>
              {intl.formatMessage({
                defaultMessage:
                  "Self-declaration helps our team better understand the applicant pool. Knowing the diversity of the application pool helps GC Digital Talent’s recruitment team and hiring managers break down barriers and make our process more inclusive. It also allows us to track progress on diversity goals and helps make sure that underrepresented groups are given fair opportunities.",
                id: "2ly5G8",
                description: "Paragraph 3, importance of self-declaration",
              })}
            </Text>
            <Text>
              {intl.formatMessage({
                defaultMessage:
                  "Overall, self-declaration promotes transparency, accountability, and diversity in hiring.",
                id: "/ry9OC",
                description: "Paragraph 4, importance of self-declaration",
              })}
            </Text>
            <TableOfContents.Section id={sections.howDataIsUsed.id}>
              <TableOfContents.Heading
                size="h3"
                icon={AdjustmentsHorizontalIcon}
                color="secondary"
              >
                {sections.howDataIsUsed.title}
              </TableOfContents.Heading>
              <Text>
                {intl.formatMessage({
                  defaultMessage:
                    "If you choose to self-declare in your profile, this information is used in an aggregated way to develop insights on how the Government of Canada can build more inclusive practices. In this aggregated data, your personal information is protected, and only collective averages are visible to anyone beyond the platform.",
                  description: "Paragraph 1, how self-declaration data is used",
                  id: "1evugI",
                })}
              </Text>
              <Text>
                {intl.formatMessage({
                  defaultMessage:
                    "If you choose to self-declare in your profile and you apply for a job on GC Digital Talent, this information may be used at any stage of the job process, from initial application to assessment to appointment. This information could be used by hiring managers or the GC Digital Talent recruitment team",
                  description: "Paragraph 2, how self-declaration data is used",
                  id: "ukcsxj",
                })}
                {intl.formatMessage(commonMessages.dividingColon)}
              </Text>
              <Ul>
                <li>
                  {intl.formatMessage({
                    defaultMessage:
                      "To identify people who might be eligible for specific opportunities in organizations with an under representation of an employment equity group;",
                    id: "e9FxXq",
                    description:
                      "List item 1, how self-declaration data is used",
                  })}
                </li>
                <li>
                  {intl.formatMessage({
                    defaultMessage:
                      "To prioritize processing applications from employment equity candidates;",
                    id: "+EINSB",
                    description:
                      "List item 2, how self-declaration data is used",
                  })}
                </li>
                <li>
                  {intl.formatMessage({
                    defaultMessage:
                      "To select a member of an employment equity group for an appointment, if multiple qualified applicants are available.",
                    id: "rmmLVI",
                    description:
                      "List item 3, how self-declaration data is used",
                  })}
                </li>
              </Ul>
            </TableOfContents.Section>
            <TableOfContents.Section id={sections.commitment.id}>
              <TableOfContents.Heading
                size="h3"
                icon={HandRaisedIcon}
                color="error"
              >
                {sections.commitment.title}
              </TableOfContents.Heading>
              <Text>
                {intl.formatMessage({
                  defaultMessage:
                    "At GC Digital Talent, we recognize that people gain skills through different life paths. There are many ways to gain the necessary qualifications for a job.",
                  id: "UuAN//",
                  description:
                    "Paragraph 1, our commitment to inclusivity and equity",
                })}
              </Text>
              <Text>
                {intl.formatMessage({
                  defaultMessage:
                    "Here, we're working to build a recruitment experience where you feel your diverse experiences and skills are valued. While not everyone will land their dream job right away, we want you to have the opportunity to showcase your story in a way that maximizes your chances of success.",
                  id: "yJb1d/",
                  description:
                    "Paragraph 2, our commitment to inclusivity and equity",
                })}
              </Text>
              <Text>
                {intl.formatMessage({
                  defaultMessage:
                    "Our team is committed to continuously learning about how the platform and its recruitment processes are shaping equity and diversity in hiring. We use what we learn to design feature improvements and new functionality, and to fine-tune recruitment efforts to better support an inclusive experience for all.",
                  id: "5i2G4O",
                  description:
                    "Paragraph 3, our commitment to inclusivity and equity",
                })}
              </Text>
              <Text>
                {intl.formatMessage(
                  {
                    defaultMessage:
                      "Learn more about the team's <accessibilityLink>commitment to accessibility</accessibilityLink> and our early <researchLink>research and development</researchLink> on creating an inclusive platform.",
                    id: "TpSJAv",
                    description:
                      "Paragraph 3, our commitment to inclusivity and equity",
                  },
                  {
                    accessibilityLink: (chunks: ReactNode) =>
                      internalLink(paths.accessibility(), chunks),
                    researchLink: (chunks: ReactNode) =>
                      researchAndDevelopmentLink(locale, chunks),
                  },
                )}
              </Text>
            </TableOfContents.Section>
          </TableOfContents.Content>
        </TableOfContents.Wrapper>
      </Container>
    </>
  );
};

Component.displayName = "InclusivityEquityPage";

export default Component;
