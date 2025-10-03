import { useIntl } from "react-intl";
import { useState } from "react";
import BriefcaseIcon from "@heroicons/react/24/outline/BriefcaseIcon";
import ClipboardDocumentIcon from "@heroicons/react/24/outline/ClipboardDocumentIcon";
import IdentificationIcon from "@heroicons/react/24/outline/IdentificationIcon";
import LifebuoyIcon from "@heroicons/react/24/outline/LifebuoyIcon";
import ListBulletIcon from "@heroicons/react/24/outline/ListBulletIcon";
import PuzzlePieceIcon from "@heroicons/react/24/outline/PuzzlePieceIcon";
import UserGroupIcon from "@heroicons/react/24/outline/UserGroupIcon";
import UsersIcon from "@heroicons/react/24/outline/UsersIcon";

import { commonMessages, getLocale, uiMessages } from "@gc-digital-talent/i18n";
import {
  Accordion,
  Button,
  CardFlat,
  Container,
  Heading,
  Link,
  Ul,
} from "@gc-digital-talent/ui";

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

export const ALTERNATION_ACCORDION_ID = {
  WHAT_IS_ALTERNATION: "what-is-an-alternation",
  ALTERNATION_RESOURCES: "alternation-resources",
} as const;

export const Component = () => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useRoutes();
  const [expandedAlternations, setExpandedAlternations] = useState<string[]>(
    [],
  );

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

  const toggleAccordions = () => {
    if (expandedAlternations.length > 0) {
      setExpandedAlternations([]);
    } else {
      setExpandedAlternations(Object.values(ALTERNATION_ACCORDION_ID));
    }
  };

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
        <Heading
          color="primary"
          icon={IdentificationIcon}
          className="font-normal"
        >
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
        <Heading color="primary" icon={PuzzlePieceIcon} className="font-normal">
          {intl.formatMessage({
            defaultMessage: "Help us understand your situation",
            id: "Ph+wt8",
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
        <div className="mb-6 flex justify-end">
          <Button onClick={toggleAccordions} mode="inline">
            {expandedAlternations.length > 0
              ? intl.formatMessage(uiMessages.collapseAll)
              : intl.formatMessage(uiMessages.expandAll)}
          </Button>
        </div>
        <Accordion.Root
          value={expandedAlternations}
          onValueChange={setExpandedAlternations}
          type="multiple"
          mode="card"
          size="sm"
          className="my-6"
        >
          <Accordion.Item value={ALTERNATION_ACCORDION_ID.WHAT_IS_ALTERNATION}>
            <Accordion.Trigger as="h3">
              {intl.formatMessage({
                defaultMessage: "What is an alternation",
                id: "ufdN/y",
                description: "Heading to describe what alternations are",
              })}
            </Accordion.Trigger>
            <Accordion.Content>
              <p className="mb-6">
                {intl.formatMessage({
                  defaultMessage:
                    "Alternation is a process <strong>available to indeterminate employees</strong> who have been informed that their current position will be discontinued. It offers a way to remain employed within the Government of Canada.",
                  id: "qZ9iJ7",
                  description:
                    "Paragraph one, describing what an alternation is",
                })}
              </p>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "The process involves an exchange of roles between an employee whose position is affected and another whose position is secure. For employees in secure roles, alternation provides a voluntary path to leave the public service while helping a colleague continue their career.",
                  id: "3gl2t6",
                  description:
                    "Paragraph two, describing what an alternation is",
                })}
              </p>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item
            value={ALTERNATION_ACCORDION_ID.ALTERNATION_RESOURCES}
          >
            <Accordion.Trigger as="h3">
              {intl.formatMessage({
                defaultMessage: "Resources on alternations",
                id: "/8qTk9",
                description: "Heading for resources related to alternations",
              })}
            </Accordion.Trigger>
            <Accordion.Content>
              <p>TO DO</p>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
        <Heading color="primary" icon={UsersIcon} className="font-normal">
          {intl.formatMessage({
            defaultMessage: "Who alternation is for",
            id: "2+Uf4H",
            description: "Title for the target audience of alternations",
          })}
        </Heading>
        <div className="my-6 grid gap-5 sm:grid-cols-2">
          <CardFlat
            color="primary"
            title={intl.formatMessage({
              defaultMessage: "Employees affected by workforce adjustment",
              id: "IOVVUX",
              description:
                "Heading for the employees who are affected by workforce adjustment",
            })}
          >
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "If you’re an indeterminate employee affected by workforce adjustment—meaning you’ve been informed that your position will be discontinued—the alternation process may be a solution to continue your career with the Government of Canada.",
                id: "vrcyAR",
                description:
                  "Description for employees affected by workforce adjustment",
              })}
            </p>
          </CardFlat>
          <CardFlat
            color="primary"
            title={intl.formatMessage({
              defaultMessage: "Non-affected employees ",
              id: "mjejGX",
              description:
                "Heading for the employees who are not affected by workforce adjustment",
            })}
          >
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "If you’re an indeterminate employee whose position is not at risk but are considering leaving the public service, you can express your interest in alternation. By participating, you support a colleague in retaining their employment while choosing one of the available options to transition out of the public service.",
                id: "XmGF8v",
                description:
                  "Description for employees not affected by workforce adjustment",
              })}
            </p>
          </CardFlat>
        </div>
        <p className="my-6">
          <Link href="#" mode="solid">
            {intl.formatMessage({
              defaultMessage: "Check available alternation opportunities",
              id: "GHluON",
              description: "Link text for alternation opportunities",
            })}
          </Link>
        </p>
        <Heading color="primary" icon={ListBulletIcon} className="font-normal">
          {intl.formatMessage({
            defaultMessage:
              "Benefits of choosing alternation for non-affected employees",
            id: "/R2PzO",
            description: "Title for the benefits of alternations",
          })}
        </Heading>
        <p className="my-6">
          {intl.formatMessage({
            defaultMessage:
              "If you exchange your non-affected position through the alternation process, you may benefit from one of the following options",
            id: "Rn+vCQ",
            description: "Lead in text for list of benefits of alternations",
          }) + intl.formatMessage(commonMessages.dividingColon)}
        </p>
        <Ul space="sm">
          <li>
            {intl.formatMessage({
              defaultMessage:
                "a lump-sum payment based on how long you've worked in the public service",
              id: "pfPIW1",
              description: "Benefit one, lump-sum payment",
            })}
          </li>
          <li>
            {intl.formatMessage({
              defaultMessage:
                "a lump-sum payment plus up to $17,000 in reimbursement for education and related expenses ",
              id: "ujHDys",
              description: "Benefit two, education reimbursement",
            })}
          </li>
        </Ul>
        <p className="my-6">
          {intl.formatMessage({
            defaultMessage:
              "For detailed information, refer to the workforce adjustment appendix in the IT collective agreement.",
            id: "ltnxHw",
            description:
              "Direction to more detailed information about workforce adjustment",
          })}
        </p>
      </Container>
    </>
  );
};
