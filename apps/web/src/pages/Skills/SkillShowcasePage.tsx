import React from "react";
import { useIntl } from "react-intl";
import BoltIcon from "@heroicons/react/24/outline/BoltIcon";
import Cog8ToothIcon from "@heroicons/react/24/outline/Cog8ToothIcon";

import {
  TableOfContents,
  Pending,
  Link,
  ThrowNotFound,
} from "@gc-digital-talent/ui";
import { notEmpty } from "@gc-digital-talent/helpers";
import { navigationMessages } from "@gc-digital-talent/i18n";

import { UserSkill, useUserSkillShowcaseQuery } from "~/api/generated";
import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero/Hero";
import SkillRankCard from "~/components/SkillRankCard/SkillRankCard";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import profileMessages from "~/messages/profileMessages";

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

export const SkillShowcase = ({
  topBehaviouralSkills,
  topTechnicalSkills,
  improveTechnicalSkills,
  improveBehaviouralSkills,
}: SkillShowcaseProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  const pageTitle = intl.formatMessage(navigationMessages.skillShowcase);

  const subtitle = intl.formatMessage({
    defaultMessage:
      "Curate your top skills and highlight skills you'd like to improve.",
    id: "w5mV/m",
    description: "Subtitle for the skill showcase page",
  });

  const crumbs = useBreadcrumbs([
    {
      label: intl.formatMessage(navigationMessages.profileAndApplications),
      url: paths.profileAndApplications(),
    },
    {
      label: intl.formatMessage(navigationMessages.skillLibrary),
      url: paths.skillLibrary(),
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
            <Link
              href={paths.skillLibrary()}
              color="secondary"
              mode="solid"
              block={false}
            >
              {intl.formatMessage({
                defaultMessage: "Return to skill library",
                id: "jH5V6M",
                description:
                  "Link text to navigate from skill showcase to the skill library page",
              })}
            </Link>
          </TableOfContents.Navigation>
          <TableOfContents.Content>
            <TableOfContents.Section id={sections.topSkills.id}>
              <div
                data-h2-display="base(flex)"
                data-h2-align-items="base(center)"
                data-h2-justify-content="base(space-between)"
                data-h2-flex-direction="base(column) p-tablet(row)"
                data-h2-margin="base(x1.75 0 x1 0) l-tablet(0 0 x1 0)"
              >
                <TableOfContents.Heading
                  icon={BoltIcon}
                  color="quaternary"
                  data-h2-margin="base(0)"
                >
                  {sections.topSkills.title}
                </TableOfContents.Heading>
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
              <div
                data-h2-margin="base(x1 0 x3 0)"
                data-h2-display="base(grid)"
                data-h2-grid-template-columns="base(1fr) l-tablet(1fr 1fr)"
                data-h2-gap="base(x.5)"
              >
                <SkillRankCard
                  editable
                  type="top"
                  userSkills={topBehaviouralSkills}
                  title={intl.formatMessage({
                    defaultMessage: "Behavioural skills",
                    id: "NzbVyB",
                    description: "Title for the behavioural skill rank card",
                  })}
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
                  userSkills={topTechnicalSkills}
                  title={intl.formatMessage({
                    defaultMessage: "Technical skills",
                    id: "0ox2XB",
                    description: "Title for the technical skill rank card",
                  })}
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
              <div
                data-h2-margin="base(x1 0 x3 0)"
                data-h2-display="base(grid)"
                data-h2-grid-template-columns="base(1fr) l-tablet(1fr 1fr)"
                data-h2-gap="base(x.5)"
              >
                <SkillRankCard
                  editable
                  type="improve"
                  userSkills={improveBehaviouralSkills}
                  title={intl.formatMessage({
                    defaultMessage: "Behavioural skills",
                    id: "NzbVyB",
                    description: "Title for the behavioural skill rank card",
                  })}
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
                  userSkills={improveTechnicalSkills}
                  title={intl.formatMessage({
                    defaultMessage: "Technical skills",
                    id: "0ox2XB",
                    description: "Title for the technical skill rank card",
                  })}
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
