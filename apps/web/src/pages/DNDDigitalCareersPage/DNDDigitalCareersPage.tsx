import { useIntl } from "react-intl";
import MagnifyingGlassCircleIcon from "@heroicons/react/24/outline/MagnifyingGlassCircleIcon";
import UserPlusIcon from "@heroicons/react/24/outline/UserPlusIcon";
import IdentificationIcon from "@heroicons/react/24/outline/IdentificationIcon";
import { ReactNode } from "react";
import ChatBubbleLeftRightIcon from "@heroicons/react/24/outline/ChatBubbleLeftRightIcon";

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

import getJobFairs from "./jobFairs";

interface NoteProps {
  children: ReactNode;
}

const Note = ({ children }: NoteProps) => (
  <p className="font-sm my-6 text-gray-500 dark:text-gray-300">{children}</p>
);

export const Component = () => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useRoutes();

  const pageTitle = intl.formatMessage({
    defaultMessage: "Digital careers at the Department of National Defence",
    id: "HaBv3n",
    description: "Title for the DND digital careers page",
  });

  const desc = intl.formatMessage({
    defaultMessage:
      "Explore digital career opportunities with the Digital Services Group at the Department of National Defence and contribute your expertise to projects that support national security.",
    id: "gnogU9",
    description: "Description for digital careers at DND",
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
              "The Department of National Defence (DND) is preparing to grow and adapt as the international landscape becomes more complex. The government has announced plans to increase and accelerate its <strong>investment in defence</strong>, reinforcing its commitments to <strong>Canada’s sovereignty, security, and prosperity</strong>.",
            id: "5nvTNI",
            description: "Paragraph one, describing DND recruitment campaign",
          })}
        </p>
        <p className="my-6">
          {intl.formatMessage({
            defaultMessage:
              "To support this effort, DND’s Digital Services Group (DSG) is increasing its recruitment to ensure it has the talent needed to fulfill DND’s mission. The DSG leads DND and the Canadian Armed Forces in advancing digital transformation. In the coming years, DSG aims to hire more <strong>civilian professionals</strong> to help strengthen the digital foundations of DND and the Canadian Armed Forces.",
            id: "hNSdAT",
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
        <div className="my-6 flex flex-wrap items-center gap-6">
          <Link mode="solid" href={paths.browsePools()}>
            {intl.formatMessage({
              defaultMessage: "View available jobs",
              id: "ivG/Sh",
              description: "Link text to the page to find jobs",
            })}
          </Link>
          <Link external newTab href="">
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
        <Heading level="h3" size="h6" className="mt-0">
          {intl.formatMessage({
            defaultMessage: "Internal candidates",
            id: "1wRiVj",
            description: "Heading for creating profiles if a GC employee",
          })}
        </Heading>
        <p className="my-6">
          {intl.formatMessage({
            defaultMessage:
              "Are you a Government of Canada employee interested in a secondment with DSG? GC Digital Talent can help you achieve your next career goals. Creating your account, adding the Digital Community to your profile, and expressing interest in lateral movements are the first steps towards starting a fulfilling position at DND.",
            id: "MBGDqn",
            description:
              "Description of how applications work for government employees.",
          })}
        </p>
        <Heading level="h3" size="h6" className="mt-0">
          {intl.formatMessage({
            defaultMessage: "External candidates",
            id: "A0KjaS",
            description: "Heading for creating profiles if not a GC employee",
          })}
        </Heading>
        <p className="my-6">
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
              "Check out the latest DSG opportunities in digital and tech, from entry level to management. Find a team, make a difference, and be inspired.",
            id: "PNdaFP",
            description: "Description about roles with DSG",
          })}
        </p>
        <p className="my-6">
          {intl.formatMessage({
            defaultMessage:
              "The Digital Services Group is looking for digital professionals with strongly developed skills in",
            id: "Kg+qsx",
            description: "Lead-in text for specific skills DSG is looking for",
          }) + intl.formatMessage(commonMessages.dividingColon)}
        </p>
        <Ul space="md" className="grid max-w-md sm:grid-cols-2 sm:gap-6">
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
        <Note>
          {intl.formatMessage({
            defaultMessage:
              "It’s an asset if you’re familiar with military IT infrastructure and protocols, though this is not essential.",
            id: "tQxwgs",
            description: "Note about military IT being an asset",
          })}
        </Note>
        <Heading level="h3" size="h4">
          {intl.formatMessage({
            defaultMessage: "A glimpse into digital roles at DND",
            id: "FRPkzV",
            description: "Heading for digital roles available",
          })}
        </Heading>
        <Card>
          <Card.Separator />
          <div className="flex flex-wrap items-center gap-6">
            <Link mode="solid" href={paths.browsePools()}>
              {intl.formatMessage({
                defaultMessage: "Browse jobs on GC Digital Talent",
                id: "2jApk/",
                description: "Link text to browse jobs on GC Digital Talent",
              })}
            </Link>
            <Link mode="inline" href="#" external newTab>
              {intl.formatMessage({
                defaultMessage: "Browse GC Jobs",
                id: "ya6mF1",
                description: "Link text to the GC Jobs site",
              })}
            </Link>
            <Link mode="inline" href="#" external newTab>
              {intl.formatMessage({
                defaultMessage: "Other jobs at DND",
                id: "CiDOEM",
                description: "Link text to the DND jobs site",
              })}
            </Link>
          </div>
        </Card>
        <Heading level="h3" size="h5">
          {intl.formatMessage({
            defaultMessage: "The Innovation Corps",
            id: "FclnNa",
            description: "Heading for innovation corps",
          })}
        </Heading>
        <p className="my-6">
          {intl.formatMessage({
            defaultMessage:
              "Join the Innovation Corps! DSG is recruiting high-demand, adaptable talent with strong digital skills from across government. Selected participants will spend a year building their network and gaining diverse experience through temporary assignments across DND. Find your perfect fit within Defence or build valuable skills for your next opportunity.",
            id: "cuaSaD",
            description: "Paragraph describing the innovation corps",
          })}
        </p>
        <Note>
          {intl.formatMessage({
            defaultMessage:
              "Successful candidates are expected to work on site in the National Capital Region.",
            id: "qQ9ziR",
            description: "Note for innovation corps candidates about location",
          })}
        </Note>
        <Heading level="h4" size="h6">
          {intl.formatMessage({
            defaultMessage: "Innovation Corps roles include",
            id: "3GAO9z",
            description: "Heading for roles within innovation corps",
          })}
        </Heading>
        <Card>
          <Card.Separator />
          <div className="flex flex-wrap items-center gap-6">
            <Link
              mode="solid"
              href="DSGDigitalUpskilling-GSNPerfectionnementnumerique@forces.gc.ca"
              external
            >
              {intl.formatMessage({
                defaultMessage: "Contact the Innovation Corps team",
                id: "BM8p9E",
                description:
                  "Link text to start an email to the innovation corps",
              })}
            </Link>
            <Link mode="inline" href={paths.browsePools()}>
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
              "Meet DSG at job fairs for students and recent graduates",
            id: "YBq69c",
            description: "Heading for DSG job fairs section",
          })}
        </Heading>
        <p className="my-6">
          {intl.formatMessage({
            defaultMessage:
              "Members of the Digital Services Group will be attending job fairs at universities and colleges in the coming months. Stop by to introduce yourself, ask questions, and discuss how you can start your career at DND.",
            id: "xlwz2n",
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
                <div className="flex flex-col flex-wrap gap-3 text-sm sm:flex-row">
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
