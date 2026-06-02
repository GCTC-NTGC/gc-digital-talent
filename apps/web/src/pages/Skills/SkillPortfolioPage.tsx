import { useIntl } from "react-intl";
import ChartPieIcon from "@heroicons/react/24/outline/ChartPieIcon";
import BoltIcon from "@heroicons/react/24/outline/BoltIcon";

import { TableOfContents, Link } from "@gc-digital-talent/ui";
import { NotFoundError, unpackMaybes } from "@gc-digital-talent/helpers";
import { navigationMessages } from "@gc-digital-talent/i18n";
import { graphql } from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import useRoutes from "~/hooks/useRoutes";
import SkillPortfolioTable from "~/components/SkillsPortfolioTable/SkillPortfolioTable";
import { requireUser } from "~/routing/auth";
import { graphqlClientContext, intlContext } from "~/routing/context";
import profileMessages from "~/messages/profileMessages";

import type { Route } from "./+types/SkillPortfolioPage";

interface PageSection {
  id: string;
  title: string;
}
type PageSections = Record<string, PageSection>;

export const handle = {
  pageTitle: navigationMessages.skillPortfolio,
};

export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  async ({ context, request }, next) => {
    requireUser(context, request, { roles: [{ name: ROLE_NAME.Applicant }] });
    return await next();
  },
];

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

export async function clientLoader({ context }: Route.ClientLoaderArgs) {
  const intl = context.get(intlContext);
  const client = context.get(graphqlClientContext);

  const res = await client.query(SkillPortfolioPage_Query, {}).toPromise();

  if (!res.data?.me) {
    throw new NotFoundError(intl.formatMessage(profileMessages.userNotFound));
  }

  return {
    user: res.data.me,
    skills: res.data.skills,
  };
}

const SkillPortfolioPage = ({ loaderData }: Route.ComponentProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const { user, skills } = loaderData;

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

  return (
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
            userSkillsQuery={unpackMaybes(user.userSkills)}
            allSkillsQuery={unpackMaybes(skills)}
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
  );
};

export default SkillPortfolioPage;
