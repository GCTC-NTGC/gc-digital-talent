import { defineMessage, useIntl } from "react-intl";
import BoltIcon from "@heroicons/react/24/outline/BoltIcon";
import Cog8ToothIcon from "@heroicons/react/24/outline/Cog8ToothIcon";
import { useQuery } from "urql";
import { ReactNode } from "react";

import {
  TableOfContents,
  Pending,
  Link,
  ThrowNotFound,
  Container,
} from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { navigationMessages } from "@gc-digital-talent/i18n";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero";
import SkillRankCard from "~/components/SkillRankCard/SkillRankCard";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import profileMessages from "~/messages/profileMessages";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import skillMessages from "~/messages/skillMessages";

interface PageSection {
  id: string;
  title: ReactNode;
}
type PageSections = Record<string, PageSection>;

export const SkillShowcase_Fragment = graphql(/** GraphQL */ `
  fragment SkillShowcase on User {
    topTechnicalSkillsRanking {
      ...SkillRankCard
    }
    topBehaviouralSkillsRanking {
      ...SkillRankCard
    }
    improveTechnicalSkillsRanking {
      ...SkillRankCard
    }
    improveBehaviouralSkillsRanking {
      ...SkillRankCard
    }
  }
`);

const subTitle = defineMessage({
  defaultMessage:
    "Curate your top skills and highlight skills you'd like to improve.",
  id: "w5mV/m",
  description: "Subtitle for the skill showcase page",
});

interface SkillShowcaseProps {
  query: FragmentType<typeof SkillShowcase_Fragment>;
}

export const SkillShowcase = ({ query }: SkillShowcaseProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const user = getFragment(SkillShowcase_Fragment, query);

  const pageTitle = intl.formatMessage(navigationMessages.skillShowcase);
  const formattedSubTitle = intl.formatMessage(subTitle);

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(navigationMessages.applicantDashboard),
        url: paths.applicantDashboard(),
      },
      {
        label: intl.formatMessage(navigationMessages.skillPortfolio),
        url: paths.skillPortfolio(),
      },
      {
        label: pageTitle,
        url: paths.skillShowcase(),
      },
    ],
  });

  const sections: PageSections = {
    topSkills: {
      id: "top-skills",
      title: intl.formatMessage({
        defaultMessage: "Your top skills",
        id: "/YaoWc",
        description:
          "Title for the top skills section of a users skill showcase",
      }),
    },
    improveSkills: {
      id: "skills-to-improve",
      title: intl.formatMessage({
        defaultMessage: "Skills you'd like to improve",
        id: "sgaZcd",
        description:
          "Title for the skills to improve section of a users skill showcase",
      }),
    },
  };

  return (
    <>
      <SEO title={pageTitle} description={formattedSubTitle} />
      <Hero title={pageTitle} crumbs={crumbs} subtitle={formattedSubTitle} />
      <Container className="my-18">
        <TableOfContents.Wrapper>
          <TableOfContents.Navigation>
            <TableOfContents.List>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink id={sections.topSkills.id}>
                  {sections.topSkills.title}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink id={sections.improveSkills.id}>
                  {sections.improveSkills.title}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
            </TableOfContents.List>
            <Link
              href={paths.skillPortfolio()}
              color="primary"
              mode="solid"
              block={false}
            >
              {intl.formatMessage({
                defaultMessage: "Return to skill portfolio",
                id: "mwVSMJ",
                description:
                  "Link text to navigate from skill showcase to the skill portfolio page",
              })}
            </Link>
          </TableOfContents.Navigation>
          <TableOfContents.Content>
            <TableOfContents.Section id={sections.topSkills.id}>
              <div className="mt-9 mb-6 flex flex-col items-center justify-between xs:flex-row sm:mt-0">
                <TableOfContents.Heading
                  icon={BoltIcon}
                  color="warning"
                  className="mt-0"
                >
                  {sections.topSkills.title}
                </TableOfContents.Heading>
              </div>
              <p className="my-6">
                {intl.formatMessage({
                  defaultMessage:
                    "This section allows you to feature the skills that you're strongest in. You're able to specify up to 5 behavioural skills and up to 10 technical skills to help create a holistic picture of your talent. The skills you showcase here help potential hiring managers better understand your core strengths and how you might fit their team's needs.",
                  id: "EB70Il",
                  description:
                    "Description of the top skills section and how to use it.",
                })}
              </p>
              <div className="mb-18 grid gap-3 sm:grid-cols-2">
                <SkillRankCard
                  editable
                  type="top"
                  query={unpackMaybes(user.topBehaviouralSkillsRanking)}
                  title={intl.formatMessage(skillMessages.behaviouralSkills)}
                  description={intl.formatMessage({
                    defaultMessage:
                      'This list allows you to highlight <strong>up to 5 behavioural or "soft" skills</strong> that you\'re strong in. Show us what makes you, you!',
                    id: "8W/am2",
                    description:
                      "Description of a users top behavioural skills",
                  })}
                  editLink={{
                    href: paths.topBehaviouralSkills(),
                    label: intl.formatMessage({
                      defaultMessage: "Edit top behavioural skills",
                      id: "EVkmeA",
                      description:
                        "Link text for editing a users top behavioural skills",
                    }),
                  }}
                />
                <SkillRankCard
                  editable
                  type="top"
                  query={unpackMaybes(user.topTechnicalSkillsRanking)}
                  title={intl.formatMessage(skillMessages.technicalSkills)}
                  description={intl.formatMessage({
                    defaultMessage:
                      "This list offers space to highlight <strong>up to 10 technical skills</strong> that provide a clear picture of your skillset. Show us what you're best at!",
                    id: "2yvjfA",
                    description: "Description of a users top technical skills",
                  })}
                  editLink={{
                    href: paths.topTechnicalSkills(),
                    label: intl.formatMessage({
                      defaultMessage: "Edit top technical skills",
                      id: "N6DlK/",
                      description:
                        "Link text for editing a users top technical skills",
                    }),
                  }}
                />
              </div>
            </TableOfContents.Section>
            <TableOfContents.Section id={sections.improveSkills.id}>
              <div className="mt-18 mb-6 flex flex-col items-center justify-between xs:flex-row">
                <TableOfContents.Heading
                  icon={Cog8ToothIcon}
                  color="secondary"
                  className="mt-0"
                >
                  {sections.improveSkills.title}
                </TableOfContents.Heading>
              </div>
              <p className="my-6">
                {intl.formatMessage({
                  defaultMessage:
                    "Where your top skills highlight your strengths, this section allows you to provide us with a bit of insight on the skills you're actively working to improve. These skills don't necessarily have to be weaknesses - if you’re interested in improving the skill through experience or training, include it here.",
                  id: "K73zGq",
                  description:
                    "Description of the skills to improve section and how to use it.",
                })}
              </p>
              <div className="mb-18 grid gap-3 xs:grid-cols-2">
                <SkillRankCard
                  editable
                  type="improve"
                  query={unpackMaybes(user.improveBehaviouralSkillsRanking)}
                  title={intl.formatMessage(skillMessages.behaviouralSkills)}
                  description={intl.formatMessage({
                    defaultMessage:
                      'This list allows you to specify <strong>up to 3 behavioural or "soft" skills</strong> that you\'re actively working to grow and improve through experience or opportunities.',
                    id: "qBHA+W",
                    description:
                      "Description of a users behavioural skills to improve",
                  })}
                  editLink={{
                    href: paths.improveBehaviouralSkills(),
                    label: intl.formatMessage({
                      defaultMessage: "Edit behavioural skills to improve",
                      id: "YV3EoS",
                      description:
                        "Link text for editing a users behavioural skills to be improved",
                    }),
                  }}
                />
                <SkillRankCard
                  editable
                  type="improve"
                  query={unpackMaybes(user.improveTechnicalSkillsRanking)}
                  title={intl.formatMessage(skillMessages.technicalSkills)}
                  description={intl.formatMessage({
                    defaultMessage:
                      "Sometimes the Government of Canada offers training opportunities. This section allows you to highlight <strong>up to 5 technical skills</strong> that you want to learn or sharpen.",
                    id: "JWAyQT",
                    description:
                      "Description of a users technical skills to be improved",
                  })}
                  editLink={{
                    href: paths.improveTechnicalSkills(),
                    label: intl.formatMessage({
                      defaultMessage: "Edit technical skills to improve",
                      id: "Iw+DU/",
                      description:
                        "Link text for editing a users technical skills to improve",
                    }),
                  }}
                />
              </div>
            </TableOfContents.Section>
          </TableOfContents.Content>
        </TableOfContents.Wrapper>
      </Container>
    </>
  );
};

const UserSkillShowcase_Query = graphql(/* GraphQL */ `
  query UserSkillShowcase {
    me {
      id
      ...SkillShowcase
    }
  }
`);

const SkillShowcasePage = () => {
  const intl = useIntl();
  const [{ data, fetching, error }] = useQuery({
    query: UserSkillShowcase_Query,
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.me ? (
        <SkillShowcase query={data.me} />
      ) : (
        <ThrowNotFound
          message={intl.formatMessage(profileMessages.userNotFound)}
        />
      )}
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.Applicant]}>
    <SkillShowcasePage />
  </RequireAuth>
);

Component.displayName = "SkillShowcasePage";

export default Component;
