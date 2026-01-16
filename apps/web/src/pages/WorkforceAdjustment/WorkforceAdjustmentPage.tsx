import { useIntl } from "react-intl";
import BriefcaseIcon from "@heroicons/react/24/outline/BriefcaseIcon";
import ClipboardDocumentIcon from "@heroicons/react/24/outline/ClipboardDocumentIcon";
import FingerPrintIcon from "@heroicons/react/24/outline/FingerPrintIcon";
import IdentificationIcon from "@heroicons/react/24/outline/IdentificationIcon";
import KeyIcon from "@heroicons/react/24/outline/KeyIcon";
import LifebuoyIcon from "@heroicons/react/24/outline/LifebuoyIcon";
import PuzzlePieceIcon from "@heroicons/react/24/outline/PuzzlePieceIcon";
import UserGroupIcon from "@heroicons/react/24/outline/UserGroupIcon";
import { ReactNode } from "react";

import { commonMessages, getLocale } from "@gc-digital-talent/i18n";
import {
  Container,
  Heading,
  Link,
  Ul,
  Image,
  LinkProps,
} from "@gc-digital-talent/ui";
import { useTheme } from "@gc-digital-talent/theme";
import { getFeatureFlags } from "@gc-digital-talent/env";
import { NotFoundError } from "@gc-digital-talent/helpers";

import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero";
import Instructions from "~/components/Instructions";
import FeatureBlock from "~/components/FeatureBlock/FeatureBlock";
import personDrawingOnClipboardDark from "~/assets/img/person-drawing-on-clipboard-dark.webp";
import personDrawingOnClipboardLight from "~/assets/img/person-drawing-on-clipboard-light.webp";
import stepOne from "~/assets/img/wfa-step-1.webp";
import stepTwo from "~/assets/img/wfa-step-2.webp";
import stepThree from "~/assets/img/wfa-step-3.webp";
import stepFour from "~/assets/img/wfa-step-4.webp";
import stepFive from "~/assets/img/wfa-step-5.webp";
import stepSix from "~/assets/img/wfa-step-6.webp";
import stepOneDark from "~/assets/img/wfa-dark-step-1.webp";
import stepTwoDark from "~/assets/img/wfa-dark-step-2.webp";
import stepThreeDark from "~/assets/img/wfa-dark-step-3.webp";
import stepFourDark from "~/assets/img/wfa-dark-step-4.webp";
import stepFiveDark from "~/assets/img/wfa-dark-step-5.webp";
import stepSixDark from "~/assets/img/wfa-dark-step-6.webp";
import digitalImg from "~/assets/img/wfa-digital-community-card.webp";
import atipImg from "~/assets/img/wfa-atip-card.webp";
import financeImg from "~/assets/img/wfa-finance-card.webp";
import auditImg from "~/assets/img/wfa-audit-card.webp";
import propertyImg from "~/assets/img/wfa-property-card.webp";
import procurementImg from "~/assets/img/wfa-procurement-card.webp";

const commonFeatureImgProps = {
  height: 300,
  loading: "lazy",
  width: 400,
};

const inlineLink = (chunks: ReactNode, props: LinkProps) => (
  <Link {...props}>{chunks}</Link>
);

export const clientLoader = () => {
  // You can move this loader to the module if preferred
  const featureFlags = getFeatureFlags();
  if (!featureFlags.workforceAdjustment) {
    throw new NotFoundError();
  }
  return null;
};

export const Component = () => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useRoutes();
  const { mode } = useTheme();

  const pageTitle = intl.formatMessage({
    defaultMessage: "Functional community support for workforce adjustment",
    id: "9NuEKb",
    description: "Title for the workforce adjustment information page",
  });

  const desc = intl.formatMessage({
    defaultMessage:
      "Get support from our platform while navigating changes to the public service workforce. ",
    id: "7IXqsn",
    description: "Subtitle for the workforce adjustment information page",
  });

  const comingInNovember = intl.formatMessage({
    defaultMessage: "Coming in November",
    id: "ibiCQI",
    description: "Denoting that information will be added in November",
  });

  const crumbs = useBreadcrumbs({
    crumbs: [{ label: pageTitle, url: paths.wfaInfo() }],
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
              "While workforce adjustment is usually associated with times of fiscal constraint in the public sector, it’s not as uncommon as people might think. Workforce adjustment can be triggered in individual departments by things like organizational restructuring, sunsetting programs, and changing mandate priorities. Because of this, mobility and matching tools to support workforce adjustment are valuable on an ongoing basis, not just once in a while.",
            id: "Lt8TKR",
            description: "Paragraph one, describing workforce adjustment",
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
              "Our platform has released a new service to better support employees facing workforce adjustment. This is also useful for those in indeterminate positions who might be looking to leave the public service while leveraging the benefits package that workforce adjustment can offer.",
            id: "WTjusd",
            description:
              "Introduction paragraph to support with workforce adjustment",
          })}
        </p>
        <div className="sm:flex sm:flex-row sm:items-center sm:gap-6">
          <div className="hidden sm:block">
            <Image
              loading="lazy"
              src={
                mode == "dark"
                  ? personDrawingOnClipboardDark
                  : personDrawingOnClipboardLight
              }
              width={209}
              height={167}
              className="block h-auto w-full object-cover object-center"
              alt=""
            />
          </div>
          <div className="sm:grow">
            <p className="mb-3">
              {intl.formatMessage({
                defaultMessage:
                  "These tools might be for you if your job falls under one of the <strong>functional communities</strong> supported by this platform and",
                id: "xle1Ng",
                description: "Lead in text for who these tools can help",
              })}
              {intl.formatMessage(commonMessages.dividingColon)}
            </p>
            <Ul space="sm">
              <li>
                {intl.formatMessage({
                  defaultMessage:
                    "you have a <strong>term position</strong> that isn't being renewed or is being terminated early ",
                  id: "9ewyqo",
                  description: "Indicator one, your term is not being renewed",
                })}
              </li>
              <li>
                {intl.formatMessage({
                  defaultMessage:
                    "you're an <strong>indeterminate employee</strong> who has received <strong>a workforce adjustment letter</strong> and you’re looking to stay",
                  id: "5XkQs9",
                  description:
                    "Indicator two, you received a letter but would like to stay",
                })}
              </li>
              <li>
                {intl.formatMessage({
                  defaultMessage:
                    "you're an <strong>indeterminate employee</strong> interested in <strong>a package to leave the public service voluntarily</strong>",
                  id: "N/c1Yg",
                  description:
                    "Indicator three, you would like to leave voluntarily",
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
              "At this time, our services are available for employees whose current job falls under one of the functional communities supported by this platform. Basically, some functional community offices manage talent through this platform, and they won’t have roles to offer employees outside the scope of their mandate areas. (For those in other functional communities, we encourage you to explore options through GCXchange.)",
            id: "hXgwp/",
            description:
              "Paragraph describing the users who are supported by the workforce adjustment tools",
          })}
        </p>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          <FeatureBlock
            content={{
              img: {
                path: digitalImg,
                ...commonFeatureImgProps,
              },
              title: intl.formatMessage({
                defaultMessage: "Digital community",
                id: "Z1sN3o",
                description: "Title for digital community WFA section",
              }),
              summary: (
                <>
                  <p className="mb-6">
                    {intl.formatMessage({
                      defaultMessage:
                        "This service is available to employees who meet one of the following criteria",
                      id: "K1PlrC",
                      description:
                        "Lead in text describing WFA for the digital community",
                    }) + intl.formatMessage(commonMessages.dividingColon)}
                  </p>
                  <Ul space="sm">
                    <li>
                      {intl.formatMessage({
                        defaultMessage: "you’re an IT-classified employee",
                        id: "6Nz7xW",
                        description: "Criteria one, WFA for digital community",
                      })}
                    </li>
                    <li>
                      {intl.formatMessage(
                        {
                          defaultMessage:
                            "you’re an employee that falls under the definition of “digital talent” in the <link>Directive on Digital Talent</link>, including specified EX roles",
                          id: "RA6QAP",
                          description:
                            "Criteria two, WFA for digital community",
                        },
                        {
                          link: (chunks) =>
                            inlineLink(chunks, {
                              href:
                                locale === "fr"
                                  ? "https://www.tbs-sct.canada.ca/pol/doc-fra.aspx?id=32749"
                                  : "https://www.tbs-sct.canada.ca/pol/doc-eng.aspx?id=32749",
                              external: true,
                            }),
                        },
                      )}
                    </li>
                  </Ul>
                </>
              ),
            }}
          />
          <FeatureBlock
            content={{
              img: {
                path: atipImg,
                ...commonFeatureImgProps,
              },
              title: intl.formatMessage({
                defaultMessage: "Access to Information and Privacy community",
                id: "KM8u46",
                description: "Title for ATIP community WFA section",
              }),
              summary: (
                <>
                  <p className="mb-6">
                    {intl.formatMessage({
                      defaultMessage:
                        "This service is available to employees who meet the following criterion",
                      id: "tRkamq",
                      description: "Lead in text for ATIP WFA criteria",
                    }) + intl.formatMessage(commonMessages.dividingColon)}
                  </p>
                  <Ul space="sm">
                    <li>
                      {intl.formatMessage({
                        defaultMessage:
                          "you’re an AS- or PM-classified employee whose primary role is to deliver Government of Canada access to information services or privacy policy operations",
                        id: "60WdXS",
                        description: "Criteria one, WFA for ATIP community",
                      })}
                    </li>
                  </Ul>
                </>
              ),
            }}
          />
          <FeatureBlock
            content={{
              img: {
                path: financeImg,
                ...commonFeatureImgProps,
              },
              title: intl.formatMessage({
                defaultMessage: "Finance management community",
                id: "qPx0RO",
                description: "Title for finance community WFA section",
              }),
              summary: (
                <>
                  <p className="mb-6">
                    {intl.formatMessage({
                      defaultMessage:
                        "This service is available to employees who meet one of the following criteria",
                      id: "tomKhn",
                      description:
                        "Lead in text for finance community WFA criteria",
                    }) + intl.formatMessage(commonMessages.dividingColon)}
                  </p>
                  <Ul space="sm">
                    <li>
                      {intl.formatMessage({
                        defaultMessage: "you’re a CT-FIN-classified employee",
                        id: "xa9uZU",
                        description: "Criteria one, WFA for finance community",
                      })}
                    </li>
                    <li>
                      {intl.formatMessage({
                        defaultMessage:
                          "you’re an EX-classified employee whose role makes you eligible to participate in the annual financial management EX talent management exercise run by the Office of the Comptroller General",
                        id: "U+/Gvv",
                        description: "Criteria two, WFA for finance community",
                      })}
                    </li>
                  </Ul>
                </>
              ),
            }}
          />
          <FeatureBlock
            content={{
              img: {
                path: auditImg,
                ...commonFeatureImgProps,
              },
              title: intl.formatMessage({
                defaultMessage: "Internal audit community",
                id: "3paKuD",
                description: "Title for audit community WFA section",
              }),
              summary: <p>{comingInNovember}</p>,
            }}
          />
          <FeatureBlock
            content={{
              img: {
                path: propertyImg,
                ...commonFeatureImgProps,
              },
              title: intl.formatMessage({
                defaultMessage: "Real property community",
                id: "u8tKFI",
                description: "Title for real property community WFA section",
              }),
              summary: <p>{comingInNovember}</p>,
            }}
          />
          <FeatureBlock
            content={{
              img: {
                path: procurementImg,
                ...commonFeatureImgProps,
              },
              title: intl.formatMessage({
                defaultMessage: "Procurement community",
                id: "7owCVU",
                description: "Title for procurement community WFA section",
              }),
              summary: <p>{comingInNovember}</p>,
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
              "An alternation is a process available to indeterminate employees in the core public administration who have been informed through an official letter from their department that their current position will be discontinued. These employees are then referred to as “affected employees.”",
            id: "yTHS2m",
            description: "Paragraph one, describing alternations",
          })}
        </p>
        <p className="my-6">
          {intl.formatMessage({
            defaultMessage:
              "One of the many options available to affected employees is the option of an alternation, which allows an affected employee to swap jobs with another employee in a stable indeterminate role (pending management approval of the match).",
            id: "DswRdx",
            description: "Paragraph two, describing alternations",
          })}
        </p>
        <p className="my-6">
          {intl.formatMessage({
            defaultMessage:
              "Alternations can be a useful tool for helping those who want to stay in government find new jobs. It can also be a great option for those who are ready to leave the public service and are looking to maximize the financial benefits of departure. Employees are encouraged to speak directly to their departmental HR authority to understand the financial benefits available in their specific circumstance.",
            id: "7KDWkQ",
            description: "Paragraph three, describing alternations",
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
            id: "WHpmzr",
            description:
              "Title for information about core public administration employees related to workforce adjustment",
          })}
        </Heading>
        <p className="my-6">
          {intl.formatMessage({
            defaultMessage:
              "Government of Canada employees inside and outside the core public administration (CPA) can take advantage of job pools and new opportunities on the platform and can put themselves forward as a workforce affected employee in search of a new role (if they have received a workforce adjustment letter from their department). That said, alternations are available only between employees with indeterminate positions within the CPA.",
            id: "wWLIot",
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
          <Instructions.Step img={{ src: stepOne, darkSrc: stepOneDark }}>
            <p className="font-bold">
              {intl.formatMessage(
                {
                  defaultMessage:
                    "1. <createLink>Create an account</createLink> or <signInLink>sign in</signInLink>.",
                  id: "Eb/yFU",
                  description: "Text for workforce adjustment -> create step.",
                },
                {
                  createLink: (chunks) =>
                    inlineLink(chunks, {
                      href: paths.register(),
                      className: "font-bold",
                    }),
                  signInLink: (chunks) =>
                    inlineLink(chunks, {
                      href: paths.login(),
                      className: "font-bold",
                    }),
                },
              )}
            </p>
          </Instructions.Step>
          <Instructions.Step img={{ src: stepTwo, darkSrc: stepTwoDark }}>
            <p className="mb-6 font-bold">
              {intl.formatMessage(
                {
                  defaultMessage:
                    "2. Add your current government position to your <link>career experience</link>.",
                  id: "mtK0Lu",
                  description:
                    "Text for workforce adjustment -> work experience step.",
                },
                {
                  link: (chunks) =>
                    inlineLink(chunks, {
                      href: paths.careerTimeline(),
                      className: "font-bold",
                    }),
                },
              )}
            </p>
            <p className="indent-0">
              {intl.formatMessage({
                defaultMessage:
                  "As a minimum, add the details around your current role, but information on past roles may increase your chances of a job match.",
                id: "3ufutA",
                description:
                  "Instructions for adding work experience for workforce adjustment",
              })}
            </p>
          </Instructions.Step>
          <Instructions.Step img={{ src: stepThree, darkSrc: stepThreeDark }}>
            <p className="mb-6 font-bold">
              {intl.formatMessage(
                {
                  defaultMessage:
                    "3. <link>Verify your work email address</link>.",
                  id: "4IQkkv",
                  description:
                    "Text for workforce adjustment ->  verifying email step.",
                },
                {
                  link: (chunks) =>
                    inlineLink(chunks, {
                      href: `${paths.profile()}#government-section`,
                      className: "font-bold",
                    }),
                },
              )}
            </p>
            <p className="indent-0">
              {intl.formatMessage({
                defaultMessage:
                  "This will unlock employee tools that will be accessible for as long as you’re a Government of Canada employee.",
                id: "RRg/WX",
                description:
                  "Description of what verifying email does for users",
              })}
            </p>
          </Instructions.Step>
          <Instructions.Step img={{ src: stepFour, darkSrc: stepFourDark }}>
            <p className="mb-6 font-bold">
              {intl.formatMessage(
                {
                  defaultMessage:
                    "4. <link>Complete the workforce adjustment section</link> under Career Planning.",
                  id: "f/hhwB",
                  description:
                    "Text for workforce adjustment -> completing workforce adjustment step.",
                },
                {
                  link: (chunks) =>
                    inlineLink(chunks, {
                      href: `${paths.employeeProfile()}#wfa-section`,
                      className: "font-bold",
                    }),
                },
              )}
            </p>
            <p className="indent-0">
              {intl.formatMessage({
                defaultMessage:
                  "The workforce adjustment tools are found in your employee profile. Be sure to confirm all the details needed in this section.",
                id: "iTOQmE",
                description:
                  "Instructions on where to find workforce adjustment tools",
              })}
            </p>
          </Instructions.Step>
          <Instructions.Step img={{ src: stepFive, darkSrc: stepFiveDark }}>
            <p className="mb-6 font-bold">
              {intl.formatMessage(
                {
                  defaultMessage:
                    "5. <link>Add the relevant functional community to your profile</link>.",
                  id: "gNxa7i",
                  description:
                    "Text for workforce adjustment -> adding communities step.",
                },
                {
                  link: (chunks) =>
                    inlineLink(chunks, {
                      href: paths.createCommunityInterest(),
                      className: "font-bold",
                    }),
                },
              )}
            </p>
            <p className="indent-0">
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
            img={{ src: stepSix, darkSrc: stepSixDark }}
            includeArrow={false}
          >
            <p className="mb-6 font-bold">
              {intl.formatMessage({
                defaultMessage: "6. Wait for our team to reach out.",
                id: "FxQ2qX",
                description: "Text for workforce adjustment -> waiting step.",
              })}
            </p>
            <p className="indent-0">
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
              "Employees must understand that <strong>there is no guarantee of a new opportunity</strong>. All matches depend on the employee’s skills, current role, and the availability of alternations and new opportunities. That said, our functional community admins and client services team are here to support. Employees are not alone in this.",
            id: "u/LI10",
            description: "Paragraph one, describing the alternation process",
          })}
        </p>
        <p className="my-6">
          {intl.formatMessage({
            defaultMessage:
              "Once the workforce adjustment section of your profile is updated, it becomes visible for functional community admins. They monitor this on an ongoing basis and use the platform’s matching functions to pair employees with new opportunities and alternations, if possible.",
            id: "tvA/yP",
            description: "Paragraph two, describing the alternation process",
          })}
        </p>
        <p className="my-6">
          {intl.formatMessage({
            defaultMessage:
              "Once a potential match appears, the employee is contacted to see if they’re willing to share their information with a potential match. The functional community admin then connects employees by email to potential job openings or alternations matches.",
            id: "2tRVJE",
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
              "When you create a profile, your information will only be visible to <strong>a small group of authorized administrators</strong>, including members of the GC Digital Talent client services team and the recruitment team of the functional communities you add to your profile. They will not share your information with your manager without your explicit consent.",
            id: "/3m5C5",
            description:
              "Paragraph two, describing how we protect privacy for workforce adjustment",
          })}
        </p>
      </Container>
    </>
  );
};

export default Component;
