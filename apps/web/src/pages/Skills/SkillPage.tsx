import { defineMessage, useIntl } from "react-intl";
import { ReactNode, useState } from "react";
import FolderOpenIcon from "@heroicons/react/24/outline/FolderOpenIcon";
import WrenchScrewdriverIcon from "@heroicons/react/24/outline/WrenchScrewdriverIcon";

import {
  Notice,
  Container,
  Heading,
  Link,
  ScrollToLink,
  Accordion,
  Button,
} from "@gc-digital-talent/ui";
import { navigationMessages, uiMessages } from "@gc-digital-talent/i18n";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import Hero from "~/components/Hero";
import { INITIAL_STATE } from "~/components/Table/ResponsiveTable/constants";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";

import SkillTable from "./components/SkillTable";

const suggestionLink = (chunks: ReactNode, href: string) => (
  <Link href={href} state={{ referrer: window.location.href }}>
    {chunks}
  </Link>
);

const internalLink = (chunks: ReactNode, href: string) => (
  <Link href={href}>{chunks}</Link>
);

const DEFINING_SKILLS_ID = {
  DESCRIPTIONS: "skills-descriptions",
  FAMILIES: "skill-families",
  CATEGORIES: "skills-categories",
} as const;

const definingSkillsArr = Object.values(DEFINING_SKILLS_ID);

const pageTitle = defineMessage(navigationMessages.skillsLibrary);
const pageSubtitle = defineMessage({
  defaultMessage: "Explore all the skills on our site.",
  id: "eTOg2E",
  description: "Subtitle for explore skills page",
});

export const Component = () => {
  const intl = useIntl();
  const routes = useRoutes();
  const [openSkillsAccordions, setOpenSkillsAccordions] = useState<string[]>(
    [],
  );

  const formattedPageTitle = intl.formatMessage(pageTitle);
  const formattedPageSubtitle = intl.formatMessage(pageSubtitle);

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: formattedPageTitle,
        url: routes.skills(),
      },
    ],
  });

  const toggleSkillsAccordions = () => {
    if (openSkillsAccordions.length > 0) {
      setOpenSkillsAccordions([]);
    } else {
      setOpenSkillsAccordions(definingSkillsArr);
    }
  };

  return (
    <>
      <SEO title={formattedPageTitle} description={formattedPageSubtitle} />
      <Hero
        title={formattedPageTitle}
        subtitle={formattedPageSubtitle}
        crumbs={crumbs}
      />
      <Container className="my-18">
        <ScrollToLink to="skills-library" color="primary" mode="inline">
          {intl.formatMessage({
            defaultMessage: "Skip to the skills library",
            id: "Ju88zP",
            description: "Link to scroll down to skills library",
          })}
        </ScrollToLink>

        <Heading color="primary" icon={FolderOpenIcon} className="font-normal">
          {intl.formatMessage({
            defaultMessage: "Purpose of the skills library",
            id: "vc9lfk",
            description:
              "Heading for section describing the purpose of the skills library",
          })}
        </Heading>
        <p className="mb-6">
          {intl.formatMessage({
            defaultMessage:
              "The skills library is a centralized resource that defines and organizes key skills of the functional communities using the platform. It provides clear definitions of each skill, helping create a shared understanding for hiring managers, HR professionals, and candidates alike.",
            id: "RH4/pQ",
            description:
              "Paragraph one, describing purpose of the skills library",
          })}
        </p>
        <p className="my-6">
          {intl.formatMessage({
            defaultMessage:
              "It can also help you plan training, build new competencies, and prepare for future opportunities.",
            id: "J/G3S2",
            description:
              "Paragraph two, describing purpose of the skills library",
          })}
        </p>

        <Accordion.Root type="multiple" mode="card">
          <Accordion.Item value="skills-based-recruitment">
            <Accordion.Trigger as="h3">
              {intl.formatMessage({
                defaultMessage: "Skills-based recruitment",
                id: "26f07o",
                description:
                  "Heading for section describing skills-based recruitment",
              })}
            </Accordion.Trigger>
            <Accordion.Content>
              <p className="mb-6">
                {intl.formatMessage({
                  defaultMessage:
                    "Skills are front and centre in the recruitment processes run on GC Digital Talent. Skills-based recruitment focuses on identifying talent by emphasizing specific skills.",
                  id: "tFTgMt",
                  description:
                    "Paragraph one, describing skills-based recruitment",
                })}
              </p>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "By focusing on measurable skills, the platform reduces bias, removes barriers, and promotes diversity and equity by valuing abilities gained through non-traditional education, lived experience, and previous industry experience.",
                  id: "q/yawx",
                  description:
                    "Paragraph two, describing skills-based recruitment",
                })}
              </p>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>

        <Heading
          color="primary"
          icon={WrenchScrewdriverIcon}
          className="font-normal"
          id="platform-skills"
        >
          {intl.formatMessage({
            defaultMessage: "Skills on GC Digital Talent",
            id: "gauaKV",
            description:
              "Heading for section describing the skills of the platform",
          })}
        </Heading>

        <Notice.Root className="mb-6">
          <Notice.Content>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "On GC Digital Talent, a skill refers to the demonstrated ability, competency, or proficiency to meet the skill description, gained through practice, education, or experience.",
                id: "oX+gRz",
                description: "Important information defining the term 'skills'",
              })}
            </p>
          </Notice.Content>
        </Notice.Root>

        <p className="my-6">
          {intl.formatMessage(
            {
              defaultMessage:
                "Browse the full list of skills on our platform and familiarize yourself with the variety of skills available to add to <link>your skills portfolio</link>.",
              id: "MchJcM",
              description:
                "Paragraph one, describing the skills on the platform",
            },
            {
              link: (chunks) => internalLink(chunks, routes.skillPortfolio()),
            },
          )}
        </p>
        <p className="my-6">
          {intl.formatMessage(
            {
              defaultMessage:
                "If you can't find a skill, it may not have been added to our library yet. We're regularly adding new skills and welcome your input. <link>Get in touch with us</link> to share your suggestion.",
              id: "Gcxuw9",
              description:
                "Paragraph two, describing the skills on the platform",
            },
            {
              link: (chunks) => suggestionLink(chunks, routes.support()),
            },
          )}
        </p>
        <p className="my-6">
          {intl.formatMessage({
            defaultMessage:
              "We avoid adding multiple skills with very similar descriptions. This is because skills are used as a way of matching qualified candidates to requests for talent from hiring managers. If there are too many overlapping skills, it reduces the possibility of a match.",
            id: "iJHGQw",
            description:
              "Paragraph three, describing the skills on the platform",
          })}
        </p>

        <div className="mb-3 flex flex-col flex-wrap items-baseline gap-x-6 gap-y-3 sm:flex-row sm:justify-between">
          <Heading className="mb-0 font-normal">
            {intl.formatMessage({
              defaultMessage: "Defining and organizing skills",
              id: "YIszvd",
              description: "Heading for more info on skills",
            })}
          </Heading>
          <Button mode="inline" onClick={toggleSkillsAccordions}>
            {openSkillsAccordions.length > 0
              ? intl.formatMessage(uiMessages.collapseAll)
              : intl.formatMessage(uiMessages.expandAll)}
          </Button>
        </div>

        <Accordion.Root
          mode="card"
          type="multiple"
          value={openSkillsAccordions}
          onValueChange={setOpenSkillsAccordions}
        >
          <Accordion.Item value={DEFINING_SKILLS_ID.DESCRIPTIONS}>
            <Accordion.Trigger>
              {intl.formatMessage({
                defaultMessage: "Descriptions",
                id: "fugmiC",
                description: "Heading for skill descriptions",
              })}
            </Accordion.Trigger>
            <Accordion.Content>
              <p className="mb-6">
                {intl.formatMessage({
                  defaultMessage:
                    "The description of a skill offers a clear explanation of its scope. We aim to keep descriptions broad and generic to ensure they’re relevant across all government departments.",
                  id: "00j3Hy",
                  description:
                    "Paragraph one, information on skill descriptions",
                })}
              </p>
              <p className="mb-6">
                {intl.formatMessage({
                  defaultMessage:
                    "Specialized skills with more detailed descriptions are added to address specific operational requirements, as needed. ",
                  id: "8sqysp",
                  description:
                    "Paragraph two, information on skill descriptions",
                })}
              </p>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value={DEFINING_SKILLS_ID.FAMILIES}>
            <Accordion.Trigger>
              {intl.formatMessage(navigationMessages.skillFamilies)}
            </Accordion.Trigger>
            <Accordion.Content>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "To help you find relevant skills more easily, we’ve grouped them together in what we call <strong>skill families</strong>. Skill families are typically named after areas of work as described by the functional communities.",
                  id: "0Vto/s",
                  description: "Description of skill families",
                })}
              </p>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value={DEFINING_SKILLS_ID.CATEGORIES}>
            <Accordion.Trigger>
              {intl.formatMessage({
                defaultMessage: "Categories",
                id: "jjyMUr",
                description: "Heading of section describing skill categories",
              })}
            </Accordion.Trigger>
            <Accordion.Content>
              <p className="mb-6">
                {intl.formatMessage({
                  defaultMessage:
                    "Skills are divided into two categories: technical skills and behavioural skills.",
                  id: "jjI+kS",
                  description: "Lead-in text for skill category definitions",
                })}
              </p>
              <p className="mb-6">
                {intl.formatMessage({
                  defaultMessage:
                    "<strong>Technical skills</strong> are specific, teachable abilities that are relevant to specific jobs or roles within an organization. They’re typically acquired through formal education, training programs, or hands-on work experience.",
                  id: "cgLdec",
                  description: "Definition of technical skills",
                })}
              </p>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "<strong>Behavioural skills</strong> encompass interpersonal, emotional, and cognitive attributes that are essential across roles and help shape your contribution to organizational culture and team success.",
                  id: "wWG23z",
                  description: "Definition of behavioural skills",
                })}
              </p>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>

        <Heading className="font-normal" id="skills-library">
          {formattedPageTitle}
        </Heading>

        <SkillTable
          title={formattedPageTitle}
          paginationState={{ ...INITIAL_STATE.paginationState, pageSize: 20 }}
          csvDownload
          isPublic
        />
      </Container>
    </>
  );
};

Component.displayName = "SkillPage";

export default Component;
