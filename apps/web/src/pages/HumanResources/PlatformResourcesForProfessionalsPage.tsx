import BriefcaseIcon from "@heroicons/react/24/outline/BriefcaseIcon";
import WrenchScrewdriverIcon from "@heroicons/react/24/outline/WrenchScrewdriverIcon";
import PresentationChartBarIcon from "@heroicons/react/24/outline/PresentationChartBarIcon";
import CloudIcon from "@heroicons/react/24/outline/CloudIcon";
import QuestionMarkCircleIcon from "@heroicons/react/24/outline/QuestionMarkCircleIcon";
import { useIntl } from "react-intl";
import { ReactNode, useState } from "react";

import {
  Accordion,
  Button,
  CardFlat,
  Container,
  Heading,
  Link,
  Ul,
} from "@gc-digital-talent/ui";
import {
  getLocale,
  navigationMessages,
  uiMessages,
} from "@gc-digital-talent/i18n";

import Hero from "~/components/Hero";
import SEO from "~/components/SEO/SEO";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import pageTitles from "~/messages/pageTitles";

const externalLink = (chunks: ReactNode, href: string) => (
  <Link newTab external href={href}>
    {chunks}
  </Link>
);

const internalLink = (chunks: ReactNode, href: string) => (
  <Link href={href}>{chunks}</Link>
);

const FAQ_ID = {
  PSC_GCDT: "psc-gcdt-aware",
  SKILLS_BASED: "skills-based-recruitment",
  TEMPLATES: "job-advertisement-templates",
  PREQUALIFIED_TALENT: "prequalified-talent",
  RECRUITMENT_PROCESS: "recruitment-process",
  COMMUNITIES: "functional-communities",
} as const;

const faqIds = Object.values(FAQ_ID);

export const Component = () => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useRoutes();
  const [openFaq, setOpenFaq] = useState<string[]>([]);

  const pageTitle = intl.formatMessage(pageTitles.hrResources);

  const desc = intl.formatMessage({
    defaultMessage:
      "Discover the tools available to support HR and recruitment experts across the Government of Canada.",
    id: "kr35e/",
    description: "Description of professional HR resources page",
  });

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        url: paths.professionalHRResources(),
        label: pageTitle,
      },
    ],
  });

  const toggleFaq = () => {
    if (openFaq.length > 0) {
      setOpenFaq([]);
    } else {
      setOpenFaq(faqIds);
    }
  };

  return (
    <>
      <SEO title={pageTitle} description={desc} />
      <Hero title={pageTitle} subtitle={desc} crumbs={crumbs} />
      <Container>
        <Heading icon={BriefcaseIcon} color="primary" className="font-normal">
          {intl.formatMessage({
            defaultMessage: "Recruitment on GC Digital Talent",
            id: "o+07TS",
            description:
              "Title for information about recruitment on the platform",
          })}
        </Heading>
        <p className="mb-6">
          {intl.formatMessage({
            defaultMessage:
              "GC Digital Talent offers departments modern and user-friendly tools to support hiring. The platform aligns with Government of Canada objectives and human resources policies. Departments are encouraged to use these tools to fill digital and IT roles.",
            id: "A2D/lZ",
            description:
              "Paragraph one, information about recruitment on the platform",
          })}
        </p>
        <p className="mb-6">
          {intl.formatMessage(
            {
              defaultMessage:
                "GC Digital Talent was <link>officially launched in January 2024</link> by Minister Anand, President of the Treasury Board. The platform contributes to the Government of Canada’s efforts to improve recruitment, development, and deployment of digital talent across the public service to better deliver modern and effective digital services to Canadians.",
              id: "Pmqvqa",
              description:
                "Paragraph two, information about recruitment on the platform",
            },
            {
              link: (chunks) =>
                externalLink(
                  chunks,
                  locale === "en"
                    ? "https://www.canada.ca/en/treasury-board-secretariat/news/2024/01/minister-anand-announces-the-launch-of-the-gc-digital-talent-platform-to-build-a-strong-and-diverse-digital-public-service.html"
                    : "https://www.canada.ca/fr/secretariat-conseil-tresor/nouvelles/2024/01/la-ministre-anand-annonce-le-lancement-de-la-plateforme-talents-numeriques-du-gc-pour-batir-une-fonction-publique-numerique-forte-et-diversifiee.html",
                ),
            },
          )}
        </p>
        <Heading
          icon={WrenchScrewdriverIcon}
          color="primary"
          className="font-normal"
        >
          {intl.formatMessage({
            defaultMessage: "Tools",
            id: "sM+ImG",
            description:
              "Title for information about tools for HR professionals",
          })}
        </Heading>
        <div className="grid gap-12 xs:gap-18 sm:grid-cols-2">
          <CardFlat
            color="secondary"
            title={intl.formatMessage(navigationMessages.skillLibrary)}
            links={[
              {
                href: paths.skills(),
                mode: "solid",
                label: intl.formatMessage(navigationMessages.skillLibrary),
              },
            ]}
          >
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "The skills library is a centralized resource that defines and organizes key skills of the functional communities using the platform. It provides clear descriptions of each skill, helping create a shared understanding for hiring managers, HR professionals, and candidates alike.",
                id: "sTPYhS",
                description: "Description of the skills library",
              })}
            </p>
          </CardFlat>
          <CardFlat
            color="primary"
            title={intl.formatMessage(pageTitles.jobAdvertisementTemplates)}
            links={[
              {
                href: paths.jobPosterTemplates(),
                mode: "solid",
                label: intl.formatMessage(pageTitles.jobAdvertisementTemplates),
              },
            ]}
          >
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "This growing collection of templates for common digital roles includes suggested job titles, typical tasks, and key skills (essential and asset). The templates support hiring managers in creating clear and consistent job postings. They also help job seekers understand the requirements and opportunities for roles across government.",
                id: "4VO5Ed",
                description: "Description of job advertisement templates",
              })}
            </p>
          </CardFlat>
        </div>
        <Heading
          icon={PresentationChartBarIcon}
          color="primary"
          className="font-normal"
        >
          {intl.formatMessage({
            defaultMessage: "Analytics and planning support",
            id: "xhJI+V",
            description:
              "Title for information about analytics and planning for HR professionals",
          })}
        </Heading>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "The platform collects data for workforce planning by highlighting in-demand skills, identifying gaps across teams, and showing where candidates are applying. This information helps HR and leadership align hiring, training, and development with future digital priorities.",
            id: "cU+2HB",
            description:
              "Description of analytics and planning for HR professionals",
          })}
        </p>
        <Heading icon={CloudIcon} color="primary" className="font-normal">
          {intl.formatMessage({
            defaultMessage: "Talent Cloud research",
            id: "/8hZcv",
            description:
              "Title for information about the talent cloud research",
          })}
        </Heading>
        <p className="mb-6">
          {intl.formatMessage({
            defaultMessage:
              "GC Digital Talent grew out of a pilot project called Talent Cloud. The team behind it explored new ways to optimize the fit between talent and team, increase inclusion and diversity in recruitment, and reduce the time it takes to fill an open position.",
            id: "/YFHwu",
            description: "Paragraph one, describing the talent cloud research",
          })}
        </p>
        <p className="mb-6">
          {intl.formatMessage({
            defaultMessage:
              "Learn more about the experiments and research conducted under Talent Cloud, as well as the ideas, designs, and philosophy that shaped it.",
            id: "cBBalt",
            description: "Paragraph two, describing the talent cloud research",
          })}
        </p>
        <p className="mb-6">
          <Link mode="inline" newTab external href={paths.tcReport()}>
            {intl.formatMessage({
              defaultMessage: "Talent Cloud report",
              id: "jHqtjc",
              description: "Link text for the talent cloud report",
            })}
          </Link>
        </p>

        <div className="mb-3 flex flex-col flex-wrap items-baseline gap-x-6 gap-y-3 sm:flex-row sm:justify-between">
          <Heading
            color="primary"
            className="mb-0 font-normal"
            icon={QuestionMarkCircleIcon}
          >
            {intl.formatMessage({
              defaultMessage: "Frequently asked questions",
              id: "n57E6J",
              description: "Heading for the FAQ",
            })}
          </Heading>
          <Button mode="inline" onClick={toggleFaq}>
            {openFaq.length > 0
              ? intl.formatMessage(uiMessages.collapseAll)
              : intl.formatMessage(uiMessages.expandAll)}
          </Button>
        </div>

        <Accordion.Root
          mode="card"
          type="multiple"
          value={openFaq}
          onValueChange={setOpenFaq}
          className="mb-18"
        >
          <Accordion.Item value={FAQ_ID.PSC_GCDT}>
            <Accordion.Trigger>
              {intl.formatMessage({
                defaultMessage:
                  "Is the Public Service Commission aware of the GC Digital Talent platform?",
                id: "JGRer4",
                description: "Heading for FAQ about PSC",
              })}
            </Accordion.Trigger>
            <Accordion.Content>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "Yes, the platform has been developed with regular policy reviews from the Public Service Commission (PSC). While some things on the GC Talent platform may look different than the Public Service Recruitment System at the PSC, the language and platform features are policy compliant and ready for use.",
                  id: "jPolbP",
                  description: "Answer to FAQ about PSC",
                })}
              </p>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value={FAQ_ID.SKILLS_BASED}>
            <Accordion.Trigger>
              {intl.formatMessage({
                defaultMessage: "What is skills-based recruitment?",
                id: "W/8gtM",
                description: "Question about skills-based recruitment",
              })}
            </Accordion.Trigger>
            <Accordion.Content>
              <p className="mb-6">
                {intl.formatMessage({
                  defaultMessage:
                    "The Government of Canada is modernizing how it attracts and hires digital talent by shifting from traditional experience-based staffing to a skills-based recruitment approach. Skills-based recruitment focuses on identifying talent by emphasizing the ability to demonstrate specific skills rather than more traditional approaches.",
                  id: "0R9I+p",
                  description:
                    "Paragraph one, answer about skills-based recruitment",
                })}
              </p>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "By focusing on measurable skills, the platform reduces bias, removes barriers, and promotes diversity and equity by valuing abilities gained through non-traditional education, lived experience, and previous industry experience.",
                  id: "GtfN41",
                  description:
                    "Paragraph two, answer about skills-based recruitment",
                })}
              </p>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value={FAQ_ID.TEMPLATES}>
            <Accordion.Trigger>
              {intl.formatMessage({
                defaultMessage:
                  "How do the job advertisement templates support hiring?",
                id: "0PRZVb",
                description: "Question about job advertisement templates",
              })}
            </Accordion.Trigger>
            <Accordion.Content>
              <p className="mb-6">
                {intl.formatMessage({
                  defaultMessage:
                    "The templates make it easier to attract the right digital talent by aligning job descriptions with current needs, best practices, and skills-based staffing principles. They also help bridge the gap between HR language and contractor terminology, supporting more consistent staffing approaches and improved workforce analytics.",
                  id: "Dl4qi/",
                  description:
                    "Paragraph one, answer about job advertisement templates",
                })}
              </p>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "Templates can be used as-is or customized to meet specific departmental requirements, with new templates added regularly to reflect evolving roles and emerging skills in the digital landscape.",
                  id: "1x9cCE",
                  description:
                    "Paragraph two, answer about job advertisement templates",
                })}
              </p>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value={FAQ_ID.PREQUALIFIED_TALENT}>
            <Accordion.Trigger>
              {intl.formatMessage({
                defaultMessage: "How do I find prequalified talent?",
                id: "z+VHtR",
                description: "Question about prequalified talent",
              })}
            </Accordion.Trigger>
            <Accordion.Content>
              <p className="mb-6">
                {intl.formatMessage({
                  defaultMessage:
                    "Through the recruitment processes advertised on our platform, we’ve established a broad database of prequalified talent. Candidates are screened and assessed for a specific classification, and those who qualify are placed in talent pools that departments can draw from to fill open positions.",
                  id: "B+3gE4",
                  description:
                    "Paragraph one, answer about prequalified talent",
                })}
              </p>
              <p>
                {intl.formatMessage(
                  {
                    defaultMessage:
                      "To connect with talent in our database, hiring managers can submit a request through <link>the find talent page</link>.",
                    id: "xDfpkE",
                    description:
                      "Paragraph two, answer about prequalified talent",
                  },
                  {
                    link: (chunks) => internalLink(chunks, paths.search()),
                  },
                )}
              </p>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value={FAQ_ID.RECRUITMENT_PROCESS}>
            <Accordion.Trigger>
              {intl.formatMessage({
                defaultMessage:
                  "How do I launch a recruitment process on GC Digital Talent?",
                id: "zLTray",
                description: "Question about recruitment processes",
              })}
            </Accordion.Trigger>
            <Accordion.Content>
              <p className="mb-6">
                {intl.formatMessage({
                  defaultMessage:
                    "If the right candidate isn’t already in our database, hiring managers can work with a functional community to launch a new recruitment process. The platform supports both internal and external job advertisements.",
                  id: "j8c+Ze",
                  description: "Answer about recruitment processes",
                })}
              </p>
              <Ul space="sm">
                <li>
                  <Link
                    external
                    href="mailto:recruitmentimit-recrutementgiti@tbs-sct.gc.ca"
                  >
                    {intl.formatMessage({
                      defaultMessage: "Contact the Digital Community",
                      id: "8+j5O+",
                      description: "Link text to email the digital community",
                    })}
                  </Link>
                </li>
                <li>
                  <Link
                    external
                    href="mailto:ocio-apcdo-bdpi-bpcap@tbs-sct.gc.ca"
                  >
                    {intl.formatMessage({
                      defaultMessage:
                        "Contact the Access to Information and Privacy (ATIP) Community",
                      id: "II4Ehd",
                      description: "Link text to email the ATIP community",
                    })}
                  </Link>
                </li>
                <li>
                  <Link href={paths.support()}>
                    {intl.formatMessage({
                      defaultMessage: "Contact our support team",
                      id: "NiAtY6",
                      description: "Link text to email the support team",
                    })}
                  </Link>
                </li>
              </Ul>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value={FAQ_ID.COMMUNITIES}>
            <Accordion.Trigger>
              {intl.formatMessage({
                defaultMessage:
                  "Which functional communities are using the platform?",
                id: "hR7Cxv",
                description: "Question about functional communities",
              })}
            </Accordion.Trigger>
            <Accordion.Content>
              <Ul space="sm">
                <li>
                  {intl.formatMessage({
                    defaultMessage: "Digital Community",
                    id: "HyNnHG",
                    description: "Name of the digital community",
                  })}
                </li>
                <li>
                  {intl.formatMessage({
                    defaultMessage:
                      "Access to Information and Privacy (ATIP) Community",
                    id: "wKsza4",
                    description: "Name of the ATIP community",
                  })}
                </li>
                <li>
                  {intl.formatMessage({
                    defaultMessage: "Financial Management Community",
                    id: "Wss2iW",
                    description: "Name of the financial management community",
                  })}
                </li>
              </Ul>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </Container>
    </>
  );
};

Component.displayName = "PlatformResourcesForProfessionalsPage";

export default Component;
