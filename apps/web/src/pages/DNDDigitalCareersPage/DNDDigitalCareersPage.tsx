import { useIntl } from "react-intl";
import MagnifyingGlassCircleIcon from "@heroicons/react/24/outline/MagnifyingGlassCircleIcon";
import UserPlusIcon from "@heroicons/react/24/outline/UserPlusIcon";
import IdentificationIcon from "@heroicons/react/24/outline/IdentificationIcon";
import { ReactNode } from "react";
import ChatBubbleLeftRightIcon from "@heroicons/react/24/outline/ChatBubbleLeftRightIcon";
import { tv } from "tailwind-variants";

import {
  Card,
  Container,
  CTALink,
  Heading,
  Link,
  Ul,
  UNICODE_CHAR,
} from "@gc-digital-talent/ui";
import {
  commonMessages,
  getLocale,
  navigationMessages,
} from "@gc-digital-talent/i18n";

import Hero from "~/components/Hero";
import SEO from "~/components/SEO/SEO";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import SkewedImageContainer from "~/components/SkewedContainer/SkewedImageContainer";
import dndProfileSquare from "~/assets/img/profile-dnd-square.webp";
import dndProfileLandscape from "~/assets/img/profile-dnd-landscape.webp";
import processMessages from "~/messages/processMessages";
import pageTitles from "~/messages/pageTitles";

import getJobFairs from "./jobFairs";

const note = tv({
  base: "font-sm text-gray-600 dark:text-gray-200",
});

interface NoteProps {
  children: ReactNode;
  className?: string;
}

const Note = ({ children, className }: NoteProps) => (
  <p className={note({ class: className })}>{children}</p>
);

export const Component = () => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useRoutes();

  const pageTitle = intl.formatMessage(pageTitles.dnd);

  const desc = intl.formatMessage({
    defaultMessage:
      "Explore digital career opportunities with the Digital Services Group at National Defence and contribute your expertise to projects that support national security.",
    id: "nMipQw",
    description: "Description for digital careers at DND",
  });

  const digitalSalary = intl.formatMessage({
    defaultMessage: "$85,854 - $105,080",
    id: "hrbktt",
    description: "Salary range for a digital role",
  });

  const innovationSalary = intl.formatMessage({
    defaultMessage: "$80,612 - $102,712 · AS classification or equivalent",
    id: "bTkYfa",
    description: "Salary range for a innovation corps role",
  });

  const crumbs = useBreadcrumbs({
    crumbs: [{ label: pageTitle, url: paths.dndDigitalCareers() }],
  });

  const jobFairs = getJobFairs(intl);

  return (
    <>
      <SEO title={pageTitle} description={desc} />
      <Hero title={pageTitle} subtitle={desc} crumbs={crumbs} />
      <Container className="my-18">
        <Heading
          color="secondary"
          level="h2"
          icon={MagnifyingGlassCircleIcon}
          className="mt-0 font-normal"
        >
          {intl.formatMessage({
            defaultMessage: "Recruitment campaign at DND",
            id: "GUAn1O",
            description: "Heading for DND recruitment campaign section",
          })}
        </Heading>
        <p className="my-6">
          {intl.formatMessage({
            defaultMessage:
              "The international landscape is complex. National Defence (DND) is preparing to grow and adapt to meet the challenge. The Government of Canada has announced plans to increase and accelerate its <strong>investment in defence</strong>, reinforcing its commitments to <strong>Canada’s sovereignty, security, and prosperity</strong>.",
            id: "m/9bKR",
            description: "Paragraph one, describing DND recruitment campaign",
          })}
        </p>
        <p className="my-6">
          {intl.formatMessage({
            defaultMessage:
              "To support this effort, DND’s Digital Services Group (DSG) is increasing its recruitment to ensure that it has the talent needed to fulfill DND’s mission. DSG leads DND and the Canadian Armed Forces in advancing digital transformation. In the coming years, DSG aims to hire more <strong>civilian professionals</strong> to help strengthen the digital foundations of DND and the Canadian Armed Forces.",
            id: "mB9+je",
            description: "Paragraph two, describing DND recruitment campaign",
          })}
        </p>
        <p className="my-6">
          {intl.formatMessage({
            defaultMessage:
              "From cyber security specialists to web developers, there will be a wide variety of opportunities available. If you’re looking to advance your career, a job at DND might be the place for you!",
            id: "ZwvEk6",
            description: "Paragraph three, describing DND recruitment campaign",
          })}
        </p>
        <div className="my-6 flex flex-col flex-wrap items-center gap-6 sm:flex-row">
          <Link mode="solid" href={paths.jobs()}>
            {intl.formatMessage({
              defaultMessage: "View available jobs",
              id: "ivG/Sh",
              description: "Link text to the page to find jobs",
            })}
          </Link>
          <Link
            external
            newTab
            mode="inline"
            href={
              locale === "fr"
                ? "https://www.canada.ca/fr/ministere-defense-nationale.html"
                : "https://www.canada.ca/en/department-national-defence.html"
            }
          >
            {intl.formatMessage({
              defaultMessage: "Learn more about DND",
              id: "F3UR4F",
              description: "Link text to go to more information about DND",
            })}
          </Link>
        </div>
      </Container>
      <SkewedImageContainer
        img={{
          src: dndProfileLandscape,
          sources: { sm: dndProfileSquare },
          className: "object-right",
        }}
      >
        <Heading level="h3" size="h6" className="mt-0 mb-0.5">
          {intl.formatMessage({
            defaultMessage: "Internal candidates",
            id: "1wRiVj",
            description: "Heading for creating profiles if a GC employee",
          })}
        </Heading>
        <p className="mb-6">
          {intl.formatMessage({
            defaultMessage:
              "Are you a Government of Canada employee interested in a secondment with DSG? GC Digital Talent can help you achieve your career goals. Create your account, add the Digital Community to your profile, and express interest in lateral movements to take the first steps toward starting a fulfilling position at DND.",
            id: "kq5ByQ",
            description:
              "Description of how applications work for government employees.",
          })}
        </p>
        <Heading level="h3" size="h6" className="mt-0 mb-0.5">
          {intl.formatMessage({
            defaultMessage: "External candidates",
            id: "A0KjaS",
            description: "Heading for creating profiles if not a GC employee",
          })}
        </Heading>
        <p className="mb-6">
          {intl.formatMessage({
            defaultMessage:
              "Your profile is your path to getting found by hiring managers. Tell your story, show how you developed your skills, and apply for jobs at DND.",
            id: "TC5f9/",
            description:
              "Description of how applications work for non-government employees.",
          })}
        </p>
        <CTALink href={paths.profile()} icon={UserPlusIcon}>
          {intl.formatMessage(navigationMessages.createProfile)}
        </CTALink>
      </SkewedImageContainer>
      <Container className="my-18">
        <Heading
          color="secondary"
          level="h2"
          icon={IdentificationIcon}
          className="font-normal"
        >
          {intl.formatMessage({
            defaultMessage: "Find a role that fits your skills",
            id: "6Wl3sQ",
            description: "Heading for finding a role with DND",
          })}
        </Heading>
        <p className="my-6">
          {intl.formatMessage({
            defaultMessage:
              "Check out the latest DSG opportunities in digital and tech, from entry level to management. Find a team, make a difference, and be inspired.",
            id: "GAVpXi",
            description: "Description about roles with DSG",
          })}
        </p>
        <p className="my-6">
          {intl.formatMessage({
            defaultMessage:
              "The DSG is looking for digital professionals with strongly developed skills in",
            id: "kzUjOq",
            description: "Lead-in text for specific skills DSG is looking for",
          }) + intl.formatMessage(commonMessages.dividingColon)}
        </p>
        <Ul space="md" className="grid max-w-md sm:grid-cols-2 sm:gap-x-6">
          <li>
            {intl.formatMessage({
              defaultMessage: "cyber security",
              id: "Jl+oMW",
              description: "The cyber security skill",
            })}
          </li>
          <li>
            {intl.formatMessage({
              defaultMessage: "systems integration",
              id: "xdV1ZI",
              description: "The systems integration skill",
            })}
          </li>
          <li>
            {intl.formatMessage({
              defaultMessage: "network security",
              id: "f2Jqya",
              description: "The network security skill",
            })}
          </li>
          <li>
            {intl.formatMessage({
              defaultMessage: "cloud computing",
              id: "4MAklr",
              description: "The cloud computing skill",
            })}
          </li>
          <li>
            {intl.formatMessage({
              defaultMessage: "software development",
              id: "8vwKjc",
              description: "The software development skill",
            })}
          </li>
          <li>
            {intl.formatMessage({
              defaultMessage: "data analytics",
              id: "yszH29",
              description: "The data analytics skill",
            })}
          </li>
        </Ul>
        <Note className="my-6">
          {intl.formatMessage({
            defaultMessage:
              "It’s an asset if you’re familiar with military IT infrastructure and protocols, though this is not essential.",
            id: "tQxwgs",
            description: "Note about military IT being an asset",
          })}
        </Note>
        <Heading level="h3" size="h5" className="mb-6 font-bold">
          {intl.formatMessage({
            defaultMessage: "A glimpse into digital roles at DND",
            id: "FRPkzV",
            description: "Heading for digital roles available",
          })}
        </Heading>
        <Card className="mb-12 overflow-hidden">
          <Card.Grid columns={3}>
            <Card.GridItem>
              <Heading level="h4" size="h6" className="mt-0">
                {intl.formatMessage({
                  defaultMessage: "Cyber Security Advisor",
                  id: "NIgwRv",
                  description: "Heading for the cyber security advisor role",
                })}
              </Heading>
              <Note className="mb-6">{digitalSalary}</Note>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "Working for DND as a Cyber Security Advisor involves protecting computer systems and networks from cyber threats and may also include monitoring networks, identifying vulnerabilities, implementing security measures, responding to incidents and developing security policies. ",
                  id: "ryDGWN",
                  description: "Description of the cyber security advisor role",
                })}
              </p>
            </Card.GridItem>
            <Card.GridItem>
              <Heading level="h4" size="h6" className="mt-0">
                {intl.formatMessage({
                  defaultMessage: "Network Administrator",
                  id: "agbLpJ",
                  description: "Heading for the network administrator role",
                })}
              </Heading>
              <Note className="mb-6">{digitalSalary}</Note>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "Network Administrators at DND play a key role in managing and maintaining the performance, security, and reliability of network infrastructure. They administer networks and collaborate across teams to ensure the seamless operation of digital systems, helping to support secure and scalable enterprise IT services.",
                  id: "zOw6B0",
                  description: "Description of the network administrator role",
                })}
              </p>
            </Card.GridItem>
            <Card.GridItem>
              <Heading level="h4" size="h6" className="mt-0">
                {intl.formatMessage({
                  defaultMessage: "Web Developer",
                  id: "ZaDwv6",
                  description: "Heading for the web developer role",
                })}
              </Heading>
              <Note className="mb-6">{digitalSalary}</Note>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "A web developer at DND is a more analytical role, focusing on gathering and analyzing requirements and providing critical insights to optimize web development projects. Their expertise contributes to the delivery of high-quality web applications that meet the highest security standards and user expectations.",
                  id: "zkoW6g",
                  description: "Description of the web developer role",
                })}
              </p>
            </Card.GridItem>
          </Card.Grid>
          <Card.Separator className="my-6" />
          <div className="flex flex-col flex-wrap items-center gap-6 sm:flex-row">
            <Link mode="solid" href={paths.jobs()}>
              {intl.formatMessage({
                defaultMessage: "Browse jobs on GC Digital Talent",
                id: "2jApk/",
                description: "Link text to browse jobs on GC Digital Talent",
              })}
            </Link>
            <Link
              mode="inline"
              href={
                locale === "fr"
                  ? "https://emploisfp-psjobs.cfp-psc.gc.ca/psrs-srfp/applicant/page2440?fromMenu=true&toggleLanguage=fr"
                  : "https://emploisfp-psjobs.cfp-psc.gc.ca/psrs-srfp/applicant/page2440?fromMenu=true&toggleLanguage=en"
              }
              external
              newTab
            >
              {intl.formatMessage({
                defaultMessage: "Browse GC Jobs",
                id: "ya6mF1",
                description: "Link text to the GC Jobs site",
              })}
            </Link>
            <Link
              mode="inline"
              href={
                locale === "fr"
                  ? "https://emploisfp-psjobs.cfp-psc.gc.ca/psrs-srfp/applicant/page2440?tab=1&title=&locationsFilter=&departments=&classificationInfos=&officialLanguage=&referenceNumber=&selectionProcessNumber=&search=Search%20jobs&department=40&log=false"
                  : "https://emploisfp-psjobs.cfp-psc.gc.ca/psrs-srfp/applicant/page2440?tab=1&title=&locationsFilter=&departments=&classificationInfos=&officialLanguage=&referenceNumber=&selectionProcessNumber=&search=Search%20jobs&department=40&log=false&toggleLanguage=en"
              }
              external
              newTab
            >
              {intl.formatMessage({
                defaultMessage: "Other jobs at DND",
                id: "CiDOEM",
                description: "Link text to the DND jobs site",
              })}
            </Link>
          </div>
        </Card>
        <Heading level="h3" size="h5" className="font-bold">
          {intl.formatMessage({
            defaultMessage: "The Innovation Corps",
            id: "FclnNa",
            description: "Heading for innovation corps",
          })}
        </Heading>
        <p className="my-6">
          {intl.formatMessage({
            defaultMessage:
              "Join the Innovation Corps! DSG is recruiting high-demand, adaptable talent with strong digital skills from across government. Selected participants will spend a year building their network and gaining diverse experience through temporary assignments across DND. Find your perfect fit in DND or build valuable skills for your next opportunity.",
            id: "rOIBl0",
            description: "Paragraph describing the innovation corps",
          })}
        </p>
        <Note className="my-6">
          {intl.formatMessage({
            defaultMessage:
              "Successful candidates are expected to work on site in the National Capital Region.",
            id: "qQ9ziR",
            description: "Note for innovation corps candidates about location",
          })}
        </Note>
        <Heading level="h4" size="h6" className="mb-6">
          {intl.formatMessage({
            defaultMessage: "Innovation Corps roles include",
            id: "3GAO9z",
            description: "Heading for roles within innovation corps",
          })}
        </Heading>
        <Card className="mb-18 overflow-hidden">
          <Card.Grid columns={2}>
            <Card.GridItem>
              <Heading level="h4" size="h6" className="mt-0">
                {intl.formatMessage({
                  defaultMessage: "Information Governance Specialist",
                  id: "nhWRUg",
                  description:
                    "Heading for the information governance specialist role",
                })}
              </Heading>
              <Note className="mb-6">{innovationSalary}</Note>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "Information Governance Specialists in the Innovation Corps support the creation of ontologies and knowledge graphs to ensure information can be effectively shared or retrieved across the organization. They are strong communicators and help disseminate best practices.",
                  id: "2xDnV4",
                  description:
                    "Description of the information governance specialist role",
                })}
              </p>
            </Card.GridItem>
            <Card.GridItem>
              <Heading level="h4" size="h6" className="mt-0">
                {intl.formatMessage({
                  defaultMessage: "Data Analyst",
                  id: "0VMNWQ",
                  description: "Heading for the data analyst role",
                })}
              </Heading>
              <Note className="mb-6">{innovationSalary}</Note>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "Data Analysts in the Innovation Corps serve as data storytellers in DND. Working closely with clients and stakeholders, they create compelling visuals and narratives that enable others to make better decisions. By providing advice, they help ensure the ethical and sound use of data.",
                  id: "SumvTY",
                  description: "Description of the data analyst role",
                })}
              </p>
            </Card.GridItem>
          </Card.Grid>
          <Card.Separator className="my-6" />
          <div className="flex flex-col flex-wrap items-center gap-6 sm:flex-row">
            <Link
              mode="solid"
              href="mailto:DSGDigitalUpskilling-GSNPerfectionnementnumerique@forces.gc.ca"
              external
            >
              {intl.formatMessage({
                defaultMessage: "Contact the Innovation Corps team",
                id: "BM8p9E",
                description:
                  "Link text to start an email to the innovation corps",
              })}
            </Link>
            <Link mode="inline" href={paths.jobs()}>
              {intl.formatMessage({
                defaultMessage: "Browse jobs on GC Digital Talent",
                id: "2jApk/",
                description: "Link text to browse jobs on GC Digital Talent",
              })}
            </Link>
          </div>
        </Card>
        <Heading
          color="secondary"
          level="h2"
          icon={ChatBubbleLeftRightIcon}
          className="font-normal"
        >
          {intl.formatMessage({
            defaultMessage:
              "Meet the Digital Services Group at job fairs for students and recent graduates",
            id: "waEO78",
            description: "Heading for DSG job fairs section",
          })}
        </Heading>
        <p className="my-6">
          {intl.formatMessage({
            defaultMessage:
              "Members of the DSG will be attending job fairs at universities and colleges in the coming months. Stop by to introduce yourself, ask questions, and discuss how you can start your career at DND.",
            id: "C8Ozfv",
            description: "Lead-in text for list of upcoming job fairs",
          })}
        </p>
        {jobFairs.length > 0 ? (
          <div className="flex flex-col gap-3">
            {jobFairs.map((fair) => (
              <Card key={fair.title}>
                <Heading level="h3" size="h5" className="mt-0 mb-3">
                  <Link
                    external
                    newTab
                    inHeading
                    mode="inline"
                    href={fair.href[locale]}
                  >
                    {fair.title}
                  </Link>
                </Heading>
                <div className="flex flex-col flex-wrap gap-3 text-sm text-gray-600 sm:flex-row dark:text-gray-200">
                  <span>
                    {intl.formatMessage(commonMessages.date) +
                      intl.formatMessage(commonMessages.dividingColon)}
                    <span className="font-bold">{fair.date}</span>
                  </span>
                  <span className="hidden text-center text-gray/50 sm:block">
                    {UNICODE_CHAR.BULLET}
                  </span>
                  <span>
                    {intl.formatMessage(processMessages.location) +
                      intl.formatMessage(commonMessages.dividingColon)}
                    <span className="font-bold">{fair.location}</span>
                  </span>
                </div>
              </Card>
            ))}
          </div>
        ) : null}
      </Container>
    </>
  );
};

Component.displayName = "DNDDigitalCareersPage";

export default Component;
