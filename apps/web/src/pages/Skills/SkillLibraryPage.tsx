import React from "react";
import { useIntl } from "react-intl";
import GlobeAmericasIcon from "@heroicons/react/24/outline/GlobeAmericasIcon";
import CpuChipIcon from "@heroicons/react/24/outline/CpuChipIcon";
import { OperationContext, useQuery } from "urql";
import ChartPieIcon from "@heroicons/react/24/outline/ChartPieIcon";

import { TableOfContents, Pending, Link } from "@gc-digital-talent/ui";
import { notEmpty } from "@gc-digital-talent/helpers/src/utils/util";
import { navigationMessages } from "@gc-digital-talent/i18n";
import { Skill, SkillCategory, UserSkill } from "@gc-digital-talent/graphql";

import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero/Hero";
import useRoutes from "~/hooks/useRoutes";
import { categorizeSkill, categorizeUserSkill } from "~/utils/skillUtils";

import SkillLibraryTable from "./components/SkillLibraryTable";
import { UserSkills_Query } from "./operations";

type PageSection = {
  id: string;
  title: string;
};
type PageSections = Record<string, PageSection>;

interface SkillLibraryProps {
  userSkills: UserSkill[];
  skills: Skill[];
}

const SkillLibrary = ({ userSkills, skills }: SkillLibraryProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  const categorizedUserSkills = categorizeUserSkill(userSkills);
  const categorizedSkills = categorizeSkill(skills);

  const sections: PageSections = {
    behavioural: {
      id: "behavioural",
      title: intl.formatMessage({
        defaultMessage: "Behavioural skill library",
        id: "yzqnvb",
        description: "Title for behavioural skill library section",
      }),
    },
    technical: {
      id: "technical",
      title: intl.formatMessage({
        defaultMessage: "Technical skill library",
        id: "FEK54g",
        description: "Title for technical skill library section",
      }),
    },
    showcase: {
      id: "showcase",
      title: intl.formatMessage(navigationMessages.skillShowcase),
    },
  };

  const crumbs = [
    {
      label: intl.formatMessage({
        defaultMessage: "Home",
        id: "EBmWyo",
        description: "Link text for the home link in breadcrumbs.",
      }),
      url: paths.home(),
    },
    {
      label: intl.formatMessage(navigationMessages.profileAndApplications),
      url: paths.profileAndApplications(),
    },
    {
      label: intl.formatMessage(navigationMessages.skillLibrary),
      url: paths.skillLibrary(),
    },
  ];

  const pageTitle = intl.formatMessage(navigationMessages.skillLibrary);

  const pageDescription = intl.formatMessage({
    defaultMessage:
      "Add, edit, and manage behavioural and technical skills on your profile.",
    description: "Page description for the skill library page",
    id: "ERDq0Q",
  });

  return (
    <>
      <SEO title={pageTitle} description={pageDescription} />
      <Hero title={pageTitle} subtitle={pageDescription} crumbs={crumbs} />
      <div data-h2-container="base(center, large, x1) p-tablet(center, large, x2)">
        <TableOfContents.Wrapper data-h2-margin-top="base(x3)">
          <TableOfContents.Navigation>
            <TableOfContents.List>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink id={sections.behavioural.id}>
                  {sections.behavioural.title}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink id={sections.technical.id}>
                  {sections.technical.title}
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
            <TableOfContents.Section id={sections.behavioural.id}>
              <TableOfContents.Heading
                icon={GlobeAmericasIcon}
                color="primary"
                data-h2-margin="base(0, 0, x1, 0)"
              >
                {sections.behavioural.title}
              </TableOfContents.Heading>
              <p data-h2-margin="base(x.5, 0)">
                {intl.formatMessage({
                  defaultMessage:
                    "This section allows you to manage all the behavioural skills linked to your profile, experiences, and showcase. Click on a skill's name to view further details.",
                  id: "C1wuXs",
                  description: "Description on how to use behavioural skills",
                })}
              </p>
              <p data-h2-margin="base(x.5, 0, x1, 0)">
                {intl.formatMessage({
                  defaultMessage:
                    "Behavioural skills refer to the key interpersonal and personal attributes that are necessary for specific jobs across the organization. These competencies generally refer to the way a person acts, communicates and interacts with others.",
                  id: "R4Z9FQ",
                  description: "Definition of behavioural skills",
                })}
              </p>
              <SkillLibraryTable
                caption={sections.behavioural.title}
                data={categorizedUserSkills[SkillCategory.Behavioural] ?? []}
                allSkills={categorizedSkills[SkillCategory.Behavioural] ?? []}
              />
            </TableOfContents.Section>
            <TableOfContents.Section id={sections.technical.id}>
              <TableOfContents.Heading
                icon={CpuChipIcon}
                color="secondary"
                data-h2-margin-top="base(x3)"
              >
                {sections.technical.title}
              </TableOfContents.Heading>
              <p data-h2-margin="base(x.5, 0)">
                {intl.formatMessage({
                  defaultMessage:
                    "This section allows you to manage all the technical skills linked to your profile, experiences, and showcase. Click on a skill's name to view further details.",
                  id: "6cFJ2w",
                  description: "Description on how to use technical skills",
                })}
              </p>
              <p data-h2-margin="base(x.5, 0, x1, 0)">
                {intl.formatMessage({
                  defaultMessage:
                    "Technical skills refer to the technical knowledge and abilities that are relevant to specific jobs or roles across the organization. Technical skills are usually acquired through specific learning or work experience in applying the knowledge and skill.",
                  id: "5Z/SAX",
                  description: "Definition of technical skills",
                })}
              </p>
              <SkillLibraryTable
                isTechnical
                caption={sections.technical.title}
                data={categorizedUserSkills[SkillCategory.Technical] ?? []}
                allSkills={categorizedSkills[SkillCategory.Technical] ?? []}
              />
            </TableOfContents.Section>
            <TableOfContents.Section id={sections.showcase.id}>
              <TableOfContents.Heading
                icon={ChartPieIcon}
                color="error"
                data-h2-margin-top="base(x3)"
              >
                {sections.showcase.title}
              </TableOfContents.Heading>
              <p data-h2-margin="base(x1 0)">
                {intl.formatMessage({
                  defaultMessage:
                    "Your skill showcase allows you to curate lists of skills from your library that present a more targeted story about your strengths and areas of interest. While your skill library acts as a central place to manage all of the skills you add to your profile, the showcases you complete are paired with your job applications to help recruiters and managers see a more complete picture of your talent.",
                  id: "ccR/uJ",
                  description: "Description on what the skills showcase is.",
                })}
              </p>
              <Link color="secondary" mode="solid" href={paths.skillShowcase()}>
                {intl.formatMessage({
                  defaultMessage: "Visit your showcase",
                  id: "Y3rbFp",
                  description: "Link text to the skill showcase page.",
                })}
              </Link>
            </TableOfContents.Section>
          </TableOfContents.Content>
        </TableOfContents.Wrapper>
      </div>
    </>
  );
};

const context: Partial<OperationContext> = {
  additionalTypenames: ["UserSkill"], // This lets urql know when to invalidate cache if request returns empty list. https://formidable.com/open-source/urql/docs/basics/document-caching/#document-cache-gotchas
};

const SkillLibraryPage = () => {
  const [{ data, fetching, error }] = useQuery({
    query: UserSkills_Query,
    context,
  });

  const userSkills = data?.me?.userSkills?.filter(notEmpty);
  const skills = data?.skills.filter(notEmpty);

  return (
    <Pending fetching={fetching} error={error}>
      <SkillLibrary userSkills={userSkills ?? []} skills={skills ?? []} />
    </Pending>
  );
};

export default SkillLibraryPage;
