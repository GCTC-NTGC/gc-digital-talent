import { useIntl } from "react-intl";
import BriefcaseIcon from "@heroicons/react/24/outline/BriefcaseIcon";
import ClipboardDocumentIcon from "@heroicons/react/24/outline/ClipboardDocumentIcon";
import FingerPrintIcon from "@heroicons/react/24/outline/FingerPrintIcon";
import IdentificationIcon from "@heroicons/react/24/outline/IdentificationIcon";
import KeyIcon from "@heroicons/react/24/outline/KeyIcon";
import LifebuoyIcon from "@heroicons/react/24/outline/LifebuoyIcon";
import PuzzlePieceIcon from "@heroicons/react/24/outline/PuzzlePieceIcon";
import UserGroupIcon from "@heroicons/react/24/outline/UserGroupIcon";

import { commonMessages, getLocale } from "@gc-digital-talent/i18n";
import { Container, Heading, Link, Ul } from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero";
import FeatureBlock from "~/components/FeatureBlock/FeatureBlock";
import peopleGatheredAroundLaptop from "~/assets/img/people-gathered-around-laptop.webp";
import createStep1Image from "~/assets/img/sign-up-step-1-light.webp";
import createStep1ImageDark from "~/assets/img/sign-up-step-1-dark.webp";
import Instructions from "~/components/Instructions";

const commonFeatureImgProps = {
  height: 300,
  loading: "lazy",
  width: 400,
};

export const Component = () => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useRoutes();

  const pageTitle = intl.formatMessage({
    defaultMessage: "Functional community support for workforce adjustment",
    id: "+FQFg0",
    description: "Title for the worforce adjustment information page",
  });

  const desc = intl.formatMessage({
    defaultMessage:
      "Get support from our platform while navigating changes to the public service workforce. ",
    id: "Rg49p4",
    description: "Subtitle for the worforce adjustment information page",
  });

  const crumbs = useBreadcrumbs({
    crumbs: [{ label: pageTitle, url: paths.wfa() }],
  });

  return (
    <>
      <SEO title={pageTitle} description={desc} />
      <Hero title={pageTitle} subtitle={desc} crumbs={crumbs} />
      <Container className="my-18">
        <Heading color="primary" icon={BriefcaseIcon} className="font-normal">
          {intl.formatMessage({
            defaultMessage: "Workforce adjustment in the public service",
            id: "vPr23M",
            description: "Title for introduction to workforce adjustment",
          })}
        </Heading>
        <p className="my-6">
          {intl.formatMessage({
            defaultMessage:
              "While workforce adjustment is usually associated with times of fiscal constraint in the public sector, it’s actually not as uncommon as people might think. Workforce adjustment can be triggered in individual departments by things like organizational restructuring, sunsetting programs, and changing mandate priorities. As soon as five indeterminate FTEs in a department are cut at a time, the workforce adjustment protocols come into effect.",
            id: "5OUbOp",
            description: "Paragraph one, describing workforce adjustment",
          })}
        </p>
        <p className="my-6">
          {intl.formatMessage({
            defaultMessage:
              "All that to say, mobility and matching tools to support workforce adjustment are valuable on an ongoing basis, not just once in a while.",
            id: "nCFeYM",
            description: "Paragraph two, describing workforce adjustment",
          })}
        </p>
        <Heading color="primary" icon={LifebuoyIcon} className="font-normal">
          {intl.formatMessage({
            defaultMessage: "Getting support through workforce adjustment",
            id: "XL3TrV",
            description: "Title for support with workforce adjustment",
          })}
        </Heading>
        <p className="my-6">
          {intl.formatMessage({
            defaultMessage:
              "Our platform has released some new tools to better support employees facing workforce adjustment… and for those looking to leave the public service while leveraging the benefits package that workforce adjustment can offer.",
            id: "hEL2JL",
            description:
              "Introduction paragraph to support with worforce adjustment",
          })}
        </p>
        <div className="sm:flex sm:flex-row sm:gap-6">
          <div className="hidden sm:block sm:shrink-0" />
          <div className="sm:grow">
            <p>
              {intl.formatMessage({
                defaultMessage: "These tools might be for you if",
                id: "S0Q5Qh",
                description:
                  "Lead in text for list of indicators workforce adjustment tools maybe be helpful",
              }) + intl.formatMessage(commonMessages.dividingColon)}
            </p>
            <Ul space="sm">
              <li>
                {intl.formatMessage({
                  defaultMessage:
                    "Your job falls under one of the <strong>functional communities</strong> supported by this platform",
                  id: "vKVb4V",
                  description:
                    "Indicator one, functional communities use these tools",
                })}
              </li>
              <li>
                {intl.formatMessage({
                  defaultMessage:
                    "You have a <strong>term position</strong> that isn't being renewed or is being terminated early",
                  id: "qWZblr",
                  description:
                    "Indicator two, your term position is not being renewed",
                })}
              </li>
              <li>
                {intl.formatMessage({
                  defaultMessage:
                    "You're an indeterminate employee who has received a <strong>workforce adjustment letter</strong>",
                  id: "wJiBDR",
                  description: "Indicator three, you received WFA letter",
                })}
              </li>
              <li>
                {intl.formatMessage({
                  defaultMessage:
                    "You're an indeterminate employee interested in <strong>a package to leave the public service voluntarily</strong>",
                  id: "dF2qSb",
                  description:
                    "Indicator four, you are interested in a package",
                })}
              </li>
            </Ul>
          </div>
        </div>
        <Heading color="primary" icon={UserGroupIcon} className="font-normal">
          {intl.formatMessage({
            defaultMessage: "Employees supported by this service",
            id: "c2pcX9",
            description:
              "Title for users supported by workforce adjustment tools",
          })}
        </Heading>
        <p className="my-6">
          {intl.formatMessage({
            defaultMessage:
              "At this time, our services are available for employees whose current job falls under one of the functional communities supported by this platform. Basically, some functional community offices manage talent through this platform, and they won’t have roles to offer employees outside the scope of their mandate areas. (For those in other functional communities, we encourage you to explore options through GCX link.)",
            id: "s2LoqF",
            description:
              "Paragraph describing the users who are supported by the workforce adjustment tools",
          })}
        </p>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          <FeatureBlock
            content={{
              img: {
                path: peopleGatheredAroundLaptop,
                ...commonFeatureImgProps,
              },
              title: intl.formatMessage({
                defaultMessage: "Digital community",
                id: "Z1sN3o",
                description: "Title for digital community WFA section",
              }),
              summary: <p>TO DO</p>,
              link: {
                path: "#",
                label: "TO DO",
              },
            }}
          />
          <FeatureBlock
            content={{
              img: {
                path: peopleGatheredAroundLaptop,
                ...commonFeatureImgProps,
              },
              title: intl.formatMessage({
                defaultMessage: "Digital community",
                id: "Z1sN3o",
                description: "Title for digital community WFA section",
              }),
              summary: <p>TO DO</p>,
              link: {
                path: "#",
                label: "TO DO",
              },
            }}
          />
          <FeatureBlock
            content={{
              img: {
                path: peopleGatheredAroundLaptop,
                ...commonFeatureImgProps,
              },
              title: intl.formatMessage({
                defaultMessage: "Digital community",
                id: "Z1sN3o",
                description: "Title for digital community WFA section",
              }),
              summary: <p>TO DO</p>,
              link: {
                path: "#",
                label: "TO DO",
              },
            }}
          />
          <FeatureBlock
            content={{
              img: {
                path: peopleGatheredAroundLaptop,
                ...commonFeatureImgProps,
              },
              title: intl.formatMessage({
                defaultMessage: "Digital community",
                id: "Z1sN3o",
                description: "Title for digital community WFA section",
              }),
              summary: <p>TO DO</p>,
              link: {
                path: "#",
                label: "TO DO",
              },
            }}
          />
          <FeatureBlock
            content={{
              img: {
                path: peopleGatheredAroundLaptop,
                ...commonFeatureImgProps,
              },
              title: intl.formatMessage({
                defaultMessage: "Digital community",
                id: "Z1sN3o",
                description: "Title for digital community WFA section",
              }),
              summary: <p>TO DO</p>,
              link: {
                path: "#",
                label: "TO DO",
              },
            }}
          />
          <FeatureBlock
            content={{
              img: {
                path: peopleGatheredAroundLaptop,
                ...commonFeatureImgProps,
              },
              title: intl.formatMessage({
                defaultMessage: "Digital community",
                id: "Z1sN3o",
                description: "Title for digital community WFA section",
              }),
              summary: <p>TO DO</p>,
              link: {
                path: "#",
                label: "TO DO",
              },
            }}
          />
        </div>
        <Heading color="primary" icon={KeyIcon} className="font-normal">
          {intl.formatMessage({
            defaultMessage: "Understanding alternations",
            id: "I2bTFm",
            description: "Title for section explaining alternations",
          })}
        </Heading>
        <p className="my-6">
          {intl.formatMessage({
            defaultMessage:
              "An alternation is a process available to indeterminate employees in the core public administration (CPA) who have been informed through an official letter from their department that their current position will be discontinued and they are being workforce adjusted. These employees are then referred to as “affected employees”. One of the many options available to affected employees is the option of an alternation, which allows an affected employee to swap jobs with another employee in a stable indeterminate role (pending management approval of the match).",
            id: "UPyYXO",
            description: "Paragraph one, describing alternations",
          })}
        </p>
        <p className="my-6">
          {intl.formatMessage({
            defaultMessage:
              "Alternations can be a useful tool for helping those who want to stay in government find new jobs. It can also to a great option for those who are ready to leave the public service leave and are looking to maximize the financial benefits of departure. Employees are encouraged to speak directly to their departmental HR authority to understand the financial benefits available in their specific circumstance.",
            id: "zTUeK9",
            description: "Paragraph two, describing alternations",
          })}
        </p>
        <p className="font-bold">
          {intl.formatMessage({
            defaultMessage:
              "Learn more about alternations from official GC sources",
            id: "VjES9l",
            description:
              "Lead in text for government resources on alternations",
          }) + intl.formatMessage(commonMessages.dividingColon)}
        </p>
        <Ul space="sm">
          <li>
            <Link
              external
              href={
                locale === "fr"
                  ? "https://www.njc-cnm.gc.ca/directive/d12/fr"
                  : "https://www.njc-cnm.gc.ca/directive/d12/en"
              }
            >
              {intl.formatMessage({
                defaultMessage: "Work Force Adjustment Directive",
                id: "wdJpUS",
                description: "Link text for work force adjustment directive",
              })}
            </Link>
          </li>
          <li>
            <Link
              external
              href={
                locale === "fr"
                  ? "https://www.canada.ca/fr/services-publics-approvisionnement/services/paye-pension/administration-paye/ressources-centre-services-paye/roles-responsabilites-lies-processus-paye/gerer-reamenagement-effectifs.html"
                  : "https://www.canada.ca/en/public-services-procurement/services/pay-pension/pay-administration/pay-centre-resources/pay-process-roles-responsibilities/managing-work-force-adjustment.html"
              }
            >
              {intl.formatMessage({
                defaultMessage:
                  "Government of Canada resources for managing workforce adjustment",
                id: "hKzP42",
                description: "Link text for managing workforce adjustment",
              })}
            </Link>
          </li>
          <li>
            {intl.formatMessage({
              defaultMessage: "Canada School of Public Service Course",
              id: "KEYurm",
              description:
                "Lead in text for link to workforce adjustment course",
            }) + intl.formatMessage(commonMessages.dividingColon)}
            <Link
              external
              href={
                locale === "fr"
                  ? "https://catalogue.csps-efpc.gc.ca/product?catalog=COR1-J15&cm_locale=fr"
                  : "https://catalogue.csps-efpc.gc.ca/product?catalog=COR1-J15&cm_locale=en"
              }
            >
              {intl.formatMessage({
                defaultMessage: "Workforce Adjustment Process (COR1-J15)",
                id: "XN7vop",
                description: "Link text for workforce adjustment course",
              })}
            </Link>
          </li>
          <li>
            <Link
              external
              href={
                locale === "fr"
                  ? "https://www.canada.ca/fr/secretariat-conseil-tresor/sujets/remuneration/conventions-collectives.html"
                  : "https://www.canada.ca/en/treasury-board-secretariat/topics/pay/collective-agreements.html"
              }
            >
              {intl.formatMessage({
                defaultMessage: "Collective agreements for the public service",
                id: "PqrUAO",
                description:
                  "Link text for public service collective agreements",
              })}
            </Link>
          </li>
        </Ul>
        <Heading
          color="primary"
          icon={IdentificationIcon}
          className="font-normal"
        >
          {intl.formatMessage({
            defaultMessage: "CPA and non-CPA employees",
            id: "edaphB",
            description:
              "Title for information about core public adminiatration employees related to worforce adjustment",
          })}
        </Heading>
        <p className="my-6">
          {intl.formatMessage({
            defaultMessage:
              "GC employees inside and outside the core public administration (CPA) can take advantage of job pools and new opportunities on the platform and can put themselves forward as a workforce affected employee in search of a new role (if they have received a WFA letter from their department). That said, alternations are only available between employees with indeterminate positions within the CPA.",
            id: "GKE4/d",
            description:
              "Description of core public administration employees related to workforce adjustment",
          })}
        </p>
        <Heading color="primary" icon={PuzzlePieceIcon} className="font-normal">
          {intl.formatMessage({
            defaultMessage: "How to use this service",
            id: "9lhQKQ",
            description:
              "Title for how to share workforce adjustment information",
          })}
        </Heading>
        <Instructions.List className="sm:grid-cols-3">
          <Instructions.Step
            img={{ src: createStep1Image, darkSrc: createStep1ImageDark }}
          >
            <p className="font-bold">
              {intl.formatMessage({
                defaultMessage: "1. Create an account or sign in.",
                id: "a7kHDR",
                description: "Text for workfoce adjustment -> create step.",
              })}
            </p>
          </Instructions.Step>
          <Instructions.Step
            img={{ src: createStep1Image, darkSrc: createStep1ImageDark }}
          >
            <p className="mb-6 font-bold">
              {intl.formatMessage({
                defaultMessage:
                  "2. Add your current government position to your career experience.",
                id: "7bijBX",
                description:
                  "Text for workfoce adjustment -> work experience step.",
              })}
            </p>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "As a minimum, add the details around your current role, but info on past roles may increase your chances of a job match.",
                id: "xB2VlY",
                description:
                  "Instructions for adding work experience for workforce adjustmnet",
              })}
            </p>
          </Instructions.Step>
          <Instructions.Step
            img={{ src: createStep1Image, darkSrc: createStep1ImageDark }}
          >
            <p className="mb-6 font-bold">
              {intl.formatMessage({
                defaultMessage: "3. Verify your work email address.",
                id: "nyTeqb",
                description:
                  "Text for workfoce adjustment ->  verifying email step.",
              })}
            </p>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "This will unlock employee tools that will be accessible for as long as you’re a GC employee.",
                id: "NfTF2V",
                description:
                  "Description of what verifying email does for users",
              })}
            </p>
          </Instructions.Step>
          <Instructions.Step
            img={{ src: createStep1Image, darkSrc: createStep1ImageDark }}
          >
            <p className="mb-6 font-bold">
              {intl.formatMessage({
                defaultMessage:
                  "4. Complete the workforce adjustment section under Career Planning.",
                id: "STEQs9",
                description:
                  "Text for workfoce adjustment -> completing workforce adjustment step.",
              })}
            </p>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "The workforce adjustment tools are found in your employee profile. Be sure to confirm all the details needed in this section.",
                id: "iTOQmE",
                description:
                  "Instructions on where to find workforce adjustment tools",
              })}
            </p>
          </Instructions.Step>
          <Instructions.Step
            img={{ src: createStep1Image, darkSrc: createStep1ImageDark }}
          >
            <p className="mb-6 font-bold">
              {intl.formatMessage({
                defaultMessage:
                  "5. Add the relevant functional community to your profile.",
                id: "kKs6C1",
                description:
                  "Text for workfoce adjustment -> adding communities step.",
              })}
            </p>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "This is essential if you want our team to be able to help you find a job or alternations match.",
                id: "OltIDs",
                description:
                  "Description of why adding communities is important",
              })}
            </p>
          </Instructions.Step>
          <Instructions.Step
            img={{ src: createStep1Image, darkSrc: createStep1ImageDark }}
          >
            <p className="mb-6 font-bold">
              {intl.formatMessage({
                defaultMessage: "6. Wait for our team to reach out.",
                id: "3LMOt/",
                description: "Text for workfoce adjustment -> waiting step.",
              })}
            </p>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "Functional community admins are monitoring on an ongoing basis. Expect an email confirming that they’re looking for a match.",
                id: "q+MgTY",
                description:
                  "Description of what to do after completing all steps for workforce adjustment",
              })}
            </p>
          </Instructions.Step>
        </Instructions.List>
        <Heading
          color="primary"
          icon={ClipboardDocumentIcon}
          className="font-normal"
        >
          {intl.formatMessage({
            defaultMessage: "What happens next",
            id: "433KCh",
            description:
              "Title for what happens after submitting workforce adjustment information",
          })}
        </Heading>
        <p className="my-6">
          {intl.formatMessage({
            defaultMessage:
              "Employees must understand, <strong>there is no guarantee of a new opportunity</strong>. All matches depend on the employee’s skills, current role, and the availability of alternations and new opportunities. That said, our functional community admins and client services team are here to support. Employees are not alone in this.",
            id: "bmngvF",
            description: "Paragraph one, describing the alternation process",
          })}
        </p>
        <p className="my-6">
          {intl.formatMessage({
            defaultMessage:
              "Once the workforce adjustment section of your profile is updated, it becomes visible for functional community administrators. They monitor this on an ongoing basis and use the platform’s matching functions to pair terms with new opportunities and support alternations between employees.",
            id: "2rVcq1",
            description: "Paragraph two, describing the alternation process",
          })}
        </p>
        <p className="my-6">
          {intl.formatMessage({
            defaultMessage:
              "Once a potential match appears, the person in the workforce adjustment situation is contacted to see if they’re willing to share their information with a potential match. The functional community admin then connects employees by email to potential job openings or alternations matches.",
            id: "qyqC1P",
            description: "Paragraph three, describing the alternation process",
          })}
        </p>
        <p className="my-6 font-bold">
          {intl.formatMessage({
            defaultMessage:
              "All final job offers and alternations must be approved by the relevant departmental HR and management teams.",
            id: "JpFcnB",
            description: "Notice that alternations must be approved",
          })}
        </p>
        <Heading color="primary" icon={FingerPrintIcon} className="font-normal">
          {intl.formatMessage({
            defaultMessage: "Protecting privacy",
            id: "Y2C4Nc",
            description:
              "Title for protecting privacy related to workforce adjustment",
          })}
        </Heading>
        <p className="my-6">
          {intl.formatMessage({
            defaultMessage:
              "We know that workforce adjustment can be a vulnerable time and we’re committed to treating your information with the utmost care and confidentiality. <strong>Nothing you share will be made public</strong>.",
            id: "sINpeV",
            description:
              "Paragraph one, describing how we protect privacy for workforce adjustment",
          })}
        </p>
        <p className="my-6">
          {intl.formatMessage({
            defaultMessage:
              "When you create a profile, your information will only be visible to <strong>a small group of authorized administrators</strong>, including members of the GC Digital Talent client services team and the recruitment team of the functional communities you add to your profile. They will not share your information with your manager or department without your explicit consent.",
            id: "eeOFt9",
            description:
              "Paragraph two, describing how we protect privacy for workforce adjustment",
          })}
        </p>
      </Container>
    </>
  );
};
