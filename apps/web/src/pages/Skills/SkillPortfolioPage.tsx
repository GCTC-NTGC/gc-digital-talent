import { useIntl } from "react-intl";
import { OperationContext, useQuery } from "urql";
import ChartPieIcon from "@heroicons/react/24/outline/ChartPieIcon";
import BoltIcon from "@heroicons/react/24/outline/BoltIcon";

import {
  TableOfContents,
  Pending,
  Link,
  Container,
} from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { navigationMessages } from "@gc-digital-talent/i18n";
import { FragmentType, graphql } from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import SkillPortfolioTable, {
  SkillPortfolioTable_SkillFragment,
  SkillPortfolioTable_UserSkillFragment,
} from "~/components/SkillsPortfolioTable/SkillPortfolioTable";

const SkillPortfolioPage_Query = graphql(/* GraphQL */ `
  query SkillPortfolioPageQuery {
    me {
      id
      userSkills {
        ...SkillPortfolioTable_UserSkill
      }
    }
    skills {
      ...SkillPortfolioTable_Skill
    }
  }
`);

interface PageSection {
  id: string;
  title: string;
}
type PageSections = Record<string, PageSection>;

interface SkillPortfolioProps {
  userSkills: FragmentType<typeof SkillPortfolioTable_UserSkillFragment>[];
  skills: FragmentType<typeof SkillPortfolioTable_SkillFragment>[];
}

const SkillPortfolio = ({ userSkills, skills }: SkillPortfolioProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  const sections: PageSections = {
    manage: {
      id: "manage",
      title: intl.formatMessage({
        defaultMessage: "Manage your skills",
        id: "Mz7sON",
        description: "Title for editing a users skills",
      }),
    },
    showcase: {
      id: "showcase",
      title: intl.formatMessage(navigationMessages.skillShowcase),
    },
  };

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
    ],
  });

  const pageTitle = intl.formatMessage(navigationMessages.skillPortfolio);

  const pageDescription = intl.formatMessage({
    defaultMessage: "Add, edit, and manage the skills on your profile.",
    description: "Page description for the skill library page",
    id: "NlYIHM",
  });

  return (
    <>
      <SEO title={pageTitle} description={pageDescription} />
      <Hero title={pageTitle} subtitle={pageDescription} crumbs={crumbs} />
      <Container className="my-18">
        <TableOfContents.Wrapper>
          <TableOfContents.Navigation>
            <TableOfContents.List>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink id={sections.manage.id}>
                  {sections.manage.title}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink id={sections.showcase.id}>
                  {sections.showcase.title}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
            </TableOfContents.List>
          </TableOfContents.Navigation>
          <TableOfContents.Content>
            <TableOfContents.Section id={sections.manage.id}>
              <TableOfContents.Heading
                icon={BoltIcon}
                color="primary"
                className="mt-0"
              >
                {sections.manage.title}
              </TableOfContents.Heading>
              <p className="my-6">
                {intl.formatMessage({
                  defaultMessage:
                    "This section allows you to manage all the skills linked to your profile, experiences, and showcase. Select a skill's name to manage further details including your level and related career experiences.",
                  id: "Di1aEV",
                  description: "Description on how to use behavioural skills",
                })}
              </p>
              <SkillPortfolioTable
                caption={sections.manage.title}
                userSkillsQuery={userSkills}
                allSkillsQuery={skills}
              />
            </TableOfContents.Section>
            <TableOfContents.Section id={sections.showcase.id}>
              <TableOfContents.Heading
                icon={ChartPieIcon}
                color="error"
                className="mt-18"
              >
                {sections.showcase.title}
              </TableOfContents.Heading>
              <p className="my-6">
                {intl.formatMessage({
                  defaultMessage:
                    "Your skill showcase allows you to curate lists of skills from your portfolio that present a more focused and personalized story about your strengths and areas of interest. While your skills portfolio serves as a central place to manage all the skills you add to your profile, the showcase is paired with your job applications. It's shared with recruiters and managers to give them a fuller picture of your talents.",
                  id: "I9e48q",
                  description: "Description on what the skills showcase is.",
                })}
              </p>
              <Link color="primary" mode="solid" href={paths.skillShowcase()}>
                {intl.formatMessage({
                  defaultMessage: "Visit your skill showcase",
                  id: "iru4oU",
                  description: "Link text to the skill showcase page.",
                })}
              </Link>
            </TableOfContents.Section>
          </TableOfContents.Content>
        </TableOfContents.Wrapper>
      </Container>
    </>
  );
};

const context: Partial<OperationContext> = {
  additionalTypenames: ["UserSkill"], // This lets urql know when to invalidate cache if request returns empty list. https://formidable.com/open-source/urql/docs/basics/document-caching/#document-cache-gotchas
};

const SkillPortfolioPage = () => {
  const [{ data, fetching, error }] = useQuery({
    query: SkillPortfolioPage_Query,
    context,
  });

  const userSkills = unpackMaybes(data?.me?.userSkills);
  const skills = unpackMaybes(data?.skills);

  return (
    <Pending fetching={fetching} error={error}>
      <SkillPortfolio userSkills={userSkills} skills={skills} />
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.Applicant]}>
    <SkillPortfolioPage />
  </RequireAuth>
);

Component.displayName = "SkillPortfolioPage";

export default Component;
