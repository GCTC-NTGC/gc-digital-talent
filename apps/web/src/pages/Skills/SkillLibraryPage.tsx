import React from "react";
import { useIntl } from "react-intl";
import GlobeAmericasIcon from "@heroicons/react/24/outline/GlobeAmericasIcon";
import CpuChipIcon from "@heroicons/react/24/outline/CpuChipIcon";

import { TableOfContents, Pending, Button } from "@gc-digital-talent/ui";
import {
  Skill,
  SkillCategory,
  UserSkill,
  useUserSkillsQuery,
} from "@gc-digital-talent/graphql";
import { notEmpty } from "@gc-digital-talent/helpers/src/utils/util";

import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero/Hero";
import useRoutes from "~/hooks/useRoutes";
import { categorizeSkill, categorizeUserSkill } from "~/utils/skillUtils";

import SkillLibraryTable from "./components/SkillLibraryTable";

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
        defaultMessage: "Your behavioural skills",
        id: "6Uyhp2",
        description: "Title for the skill library behavioural skills section",
      }),
    },
    technical: {
      id: "technical",
      title: intl.formatMessage({
        defaultMessage: "Your technical skills",
        id: "GxBGcz",
        description: "Title for the skill library technical skills section",
      }),
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
      label: intl.formatMessage({
        defaultMessage: "Profile and applications",
        id: "wDc+F3",
        description: "Breadcrumb for profile and applications page.",
      }),
      url: paths.profileAndApplications(),
    },
    {
      label: intl.formatMessage({
        defaultMessage: "Skill library",
        id: "Oi6fll",
        description: "Breadcrumb for skill library page.",
      }),
      url: paths.skillLibrary(),
    },
  ];

  const pageTitle = intl.formatMessage({
    defaultMessage: "Skill library",
    description: "Page title for the skill library page",
    id: "ySkRmX",
  });

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
            </TableOfContents.List>
          </TableOfContents.Navigation>
          <TableOfContents.Content>
            <TableOfContents.Section id={sections.behavioural.id}>
              <TableOfContents.Heading
                icon={GlobeAmericasIcon}
                data-h2-margin-top="base(0)"
              >
                {sections.behavioural.title}
              </TableOfContents.Heading>
              <p data-h2-margin="base(x1 0)">
                {intl.formatMessage({
                  defaultMessage:
                    "This section allows you to manage all the behavioural skills linked to your profile, experiences, and showcase. Click on a skill's name to view further details.",
                  id: "C1wuXs",
                  description: "Description on how to use behavioural skills",
                })}
              </p>
              <p data-h2-margin="base(x1 0)">
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
              <TableOfContents.Heading icon={CpuChipIcon}>
                {sections.technical.title}
              </TableOfContents.Heading>
              <p data-h2-margin="base(x1 0)">
                {intl.formatMessage({
                  defaultMessage:
                    "This section allows you to manage all the technical skills linked to your profile, experiences, and showcase. Click on a skill's name to view further details.",
                  id: "6cFJ2w",
                  description: "Description on how to use technical skills",
                })}
              </p>
              <p data-h2-margin="base(x1 0)">
                {intl.formatMessage({
                  defaultMessage:
                    "Technical skills refer to the technical knowledge and abilities that are relevant to specific jobs or roles across the organization. Technical skills are usually acquired through specific learning or work experience in applying the knowledge and skill.",
                  id: "5Z/SAX",
                  description: "Definition of technical skills",
                })}
              </p>
              <SkillLibraryTable
                caption={sections.technical.title}
                data={categorizedUserSkills[SkillCategory.Technical] ?? []}
                allSkills={categorizedSkills[SkillCategory.Technical] ?? []}
              />
            </TableOfContents.Section>
          </TableOfContents.Content>
        </TableOfContents.Wrapper>
      </div>
    </>
  );
};

const SkillLibraryPage = () => {
  const [{ data, fetching, error }] = useUserSkillsQuery();

  const userSkills = data?.me?.userSkills?.filter(notEmpty);
  const skills = data?.skills.filter(notEmpty);

  return (
    <Pending fetching={fetching} error={error}>
      <SkillLibrary userSkills={userSkills ?? []} skills={skills ?? []} />
    </Pending>
  );
};

export default SkillLibraryPage;
