import React from "react";
import { useIntl } from "react-intl";
import BoltIcon from "@heroicons/react/24/outline/BoltIcon";
import Cog8ToothIcon from "@heroicons/react/24/outline/Cog8ToothIcon";
import PencilSquareIcon from "@heroicons/react/24/outline/PencilSquareIcon";

import {
  TableOfContents,
  Pending,
  Well,
  Link,
  ThrowNotFound,
} from "@gc-digital-talent/ui";
import {
  UserSkill,
  useUserSkillShowcaseQuery,
} from "@gc-digital-talent/graphql";
import { notEmpty } from "@gc-digital-talent/helpers";

import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero/Hero";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import profileMessages from "~/messages/profileMessages";

interface ManageLinkProps {
  asButton?: boolean;
}

const ManageLink = ({ asButton = false }: ManageLinkProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  return (
    <Link
      href={paths.skillLibrary()}
      color="secondary"
      {...(asButton
        ? {
            mode: "solid",
            block: true,
            icon: PencilSquareIcon,
          }
        : { mode: "inline" })}
    >
      {intl.formatMessage({
        defaultMessage: "Manage all skills",
        id: "RcMbGk",
        description:
          "Link text to navigate from skill showcase to the skill library page",
      })}
    </Link>
  );
};

type PageSection = {
  id: string;
  title: React.ReactNode;
};
type PageSections = Record<string, PageSection>;

interface SkillShowcaseProps {
  topBehaviouralSkills: UserSkill[];
  topTechnicalSkills: UserSkill[];
  improveTechnicalSkills: UserSkill[];
  improveBehaviouralSkills: UserSkill[];
}

const SkillShowcase = ({
  topBehaviouralSkills,
  topTechnicalSkills,
  improveTechnicalSkills,
  improveBehaviouralSkills,
}: SkillShowcaseProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  const pageTitle = intl.formatMessage({
    defaultMessage: "Skill showcase",
    id: "F6Rwd+",
    description: "Title for the skill showcase page",
  });

  const subtitle = intl.formatMessage({
    defaultMessage:
      "Curate your top skills and highlight skills you'd like to improve.",
    id: "w5mV/m",
    description: "Subtitle for the skill showcase page",
  });

  const crumbs = useBreadcrumbs([
    {
      label: intl.formatMessage({
        defaultMessage: "Profile and applications",
        id: "wDc+F3",
        description: "Breadcrumb for profile and applications page.",
      }),
      url: paths.profileAndApplications(),
    },
    {
      label: pageTitle,
      url: paths.skillShowcase(),
    },
  ]);

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
      id: "improve-skills",
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
      <SEO title={pageTitle} />
      <Hero title={pageTitle} crumbs={crumbs} subtitle={subtitle} />
      <div data-h2-container="base(center, large, x1) p-tablet(center, large, x2)">
        <TableOfContents.Wrapper data-h2-margin-top="base(x3)">
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
            <ManageLink asButton />
          </TableOfContents.Navigation>
          <TableOfContents.Content>
            <TableOfContents.Section id={sections.topSkills.id}>
              <div
                data-h2-display="base(flex)"
                data-h2-align-items="base(center)"
                data-h2-justify-content="base(space-between)"
                data-h2-flex-direction="base(column) p-tablet(row)"
                data-h2-margin-bottom="base(x1)"
              >
                <TableOfContents.Heading
                  icon={BoltIcon}
                  color="quaternary"
                  data-h2-margin="base(0)"
                >
                  {sections.topSkills.title}
                </TableOfContents.Heading>
                <ManageLink />
              </div>
              <p data-h2-margin="base(x1 0)">
                {intl.formatMessage({
                  defaultMessage:
                    "This section allows you to feature the skills that you're strongest in. You're able to specify up to 5 behavioural skills and up to 10 technical skills to help create a holistic picture of your talent. The skills you showcase here help potential hiring managers better understand your core strengths and how you might fit their team's needs.",
                  id: "EB70Il",
                  description:
                    "Description of the top skills section and how to use it.",
                })}
              </p>
            </TableOfContents.Section>
            <TableOfContents.Section id={sections.improveSkills.id}>
              <div
                data-h2-display="base(flex)"
                data-h2-align-items="base(center)"
                data-h2-justify-content="base(space-between)"
                data-h2-flex-direction="base(column) p-tablet(row)"
                data-h2-margin="base(x3 0 x1 0)"
              >
                <TableOfContents.Heading
                  icon={Cog8ToothIcon}
                  color="secondary"
                  data-h2-margin="base(0)"
                >
                  {sections.improveSkills.title}
                </TableOfContents.Heading>
                <ManageLink />
              </div>
              <p data-h2-margin="base(x1 0)">
                {intl.formatMessage({
                  defaultMessage:
                    "Where your top skills highlight your strengths, this section allows you to provide us with a bit of insight on the skills you're actively working to improve. The skills listed below don't necessarily have to be weaknesses - if you’re interested in improving the skill through experience or training, include it here.",
                  id: "gn1vl8",
                  description:
                    "Description of the skills to improve section and how to use it.",
                })}
              </p>
            </TableOfContents.Section>
          </TableOfContents.Content>
        </TableOfContents.Wrapper>
      </div>
    </>
  );
};

const SkillShowcasePage = () => {
  const intl = useIntl();

  const [{ data, fetching, error }] = useUserSkillShowcaseQuery();

  const topBehaviouralSkills =
    data?.me?.topBehaviouralSkillsRanking?.filter(notEmpty) ?? [];
  const topTechnicalSkills =
    data?.me?.topTechnicalSkillsRanking?.filter(notEmpty) ?? [];
  const improveBehaviouralSkills =
    data?.me?.improveBehaviouralSkillsRanking?.filter(notEmpty) ?? [];
  const improveTechnicalSkills =
    data?.me?.improveTechnicalSkillsRanking?.filter(notEmpty) ?? [];

  return (
    <Pending fetching={fetching} error={error}>
      {data?.me ? (
        <SkillShowcase
          {...{
            topBehaviouralSkills,
            topTechnicalSkills,
            improveBehaviouralSkills,
            improveTechnicalSkills,
          }}
        />
      ) : (
        <ThrowNotFound
          message={intl.formatMessage(profileMessages.userNotFound)}
        />
      )}
    </Pending>
  );
};

export default SkillShowcasePage;
