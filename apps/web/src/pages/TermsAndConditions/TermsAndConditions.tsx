import { useIntl } from "react-intl";
import uniqueId from "lodash/uniqueId";
import { ReactNode } from "react";

import {
  Container,
  Flourish,
  Heading,
  Link,
  TableOfContents,
  Ul,
} from "@gc-digital-talent/ui";
import { Locales, getLocale } from "@gc-digital-talent/i18n";

import Hero from "~/components/Hero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import heroImg from "~/assets/img/diverse-group-of-people-grouped-around-laptop.webp";

export type SectionKey =
  | "usingFiles"
  | "providingContent"
  | "linkingToGov"
  | "ownershipAndUsage"
  | "trademarkNotice"
  | "accessibilityCommitment"
  | "socialMedia";

interface Section {
  id: string;
  title: ReactNode;
}

const privacyPolicyLink = (path: string, chunks: ReactNode) => (
  <Link href={path}>{chunks}</Link>
);

const langActLink = (locale: Locales, chunks: ReactNode) => (
  <Link
    newTab
    external
    href={
      locale === "en"
        ? "https://laws-lois.justice.gc.ca/eng/acts/O-3.01/"
        : "https://laws-lois.justice.gc.ca/fra/lois/o-3.01/"
    }
  >
    {chunks}
  </Link>
);

const langRegulationsLink = (locale: Locales, chunks: ReactNode) => (
  <Link
    newTab
    external
    href={
      locale === "en"
        ? "https://laws.justice.gc.ca/eng/regulations/SOR-92-48/index.html"
        : "https://laws.justice.gc.ca/fra/reglements/DORS-92-48/index.html"
    }
  >
    {chunks}
  </Link>
);

const privacyActLink = (locale: Locales, chunks: ReactNode) => (
  <Link
    newTab
    external
    href={
      locale === "en"
        ? "https://laws-lois.justice.gc.ca/eng/acts/P-21/index.html"
        : "https://laws-lois.justice.gc.ca/fra/lois/p-21/index.html"
    }
  >
    {chunks}
  </Link>
);

const questionsLink = (locale: Locales, chunks: ReactNode) => (
  <Link
    newTab
    external
    href={
      locale === "en"
        ? "https://www.canada.ca/en/contact/questions.html"
        : "https://www.canada.ca/fr/contact/questions.html"
    }
  >
    {chunks}
  </Link>
);

const copyrightLink = (locale: Locales, chunks: ReactNode) => (
  <Link
    newTab
    external
    href={
      locale === "en"
        ? "https://laws-lois.justice.gc.ca/eng/acts/C-42/index.html"
        : "https://laws-lois.justice.gc.ca/fra/lois/c-42/index.html"
    }
  >
    {chunks}
  </Link>
);

const trademarkLink = (locale: Locales, chunks: ReactNode) => (
  <Link
    newTab
    external
    href={
      locale === "en"
        ? "https://www.canada.ca/en/government/system/government-communications/federal-identity-requirements/legal-protection-official-symbols-government-canada.html"
        : "https://www.canada.ca/fr/gouvernement/systeme/communications-gouvernementales/exigences-image-marque/protection-juridique-symboles-officiels-gouvernement-canada.html"
    }
  >
    {chunks}
  </Link>
);

const accessibilityLink = (locale: Locales, chunks: ReactNode) => (
  <Link
    newTab
    external
    href={
      locale === "en"
        ? "https://www.tbs-sct.canada.ca/pol/doc-eng.aspx?id=23601"
        : "https://www.tbs-sct.canada.ca/pol/doc-fra.aspx?id=23601"
    }
  >
    {chunks}
  </Link>
);

const optimizeLink = (locale: Locales, chunks: ReactNode) => (
  <Link
    newTab
    external
    href={
      locale === "en"
        ? "https://www.tbs-sct.canada.ca/pol/doc-eng.aspx?id=27088"
        : "https://www.tbs-sct.canada.ca/pol/doc-fra.aspx?id=27088"
    }
  >
    {chunks}
  </Link>
);

export const Component = () => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useRoutes();

  const pageTitle = intl.formatMessage({
    defaultMessage: "Terms and conditions",
    id: "tvQYG5",
    description: "Title for the websites terms and conditions",
  });

  const subtitle = intl.formatMessage({
    defaultMessage:
      "Learn more about GC Digital Talent's terms and conditions.",
    id: "uIUSdN",
    description: "Subtitle for the terms and conditions page.",
  });

  const sections: Record<SectionKey, Section> = {
    usingFiles: {
      id: "using-files",
      title: intl.formatMessage({
        defaultMessage:
          "Using files located on non-Government of Canada servers",
        id: "MLrQQy",
        description: "Title for the using files section",
      }),
    },
    providingContent: {
      id: "providing-content",
      title: intl.formatMessage({
        defaultMessage: "Providing content in Canada’s official languages",
        id: "j8DE64",
        description: "Title for the providing content section",
      }),
    },
    linkingToGov: {
      id: "linking-to-gov",
      title: intl.formatMessage({
        defaultMessage: "Linking to non-Government of Canada websites",
        id: "pwsDVe",
        description: "Title for the linking to gov section",
      }),
    },
    ownershipAndUsage: {
      id: "ownership-and-usage",
      title: intl.formatMessage({
        defaultMessage: "Ownership and usage of content provided on this site",
        id: "Dsa/aH",
        description: "Title for the ownership and usage section.",
      }),
    },
    trademarkNotice: {
      id: "trademark-notice",
      title: intl.formatMessage({
        defaultMessage: "Trademark notice",
        id: "issrI6",
        description: "Title for the trademark notice section.",
      }),
    },
    accessibilityCommitment: {
      id: "accessibility-commitment",
      title: intl.formatMessage({
        defaultMessage: "Our commitment to accessibility",
        id: "QQXvOh",
        description: "Title for the accessibility commitment section.",
      }),
    },
    socialMedia: {
      id: "social-media",
      title: intl.formatMessage({
        defaultMessage: "Interacting with us on social media",
        id: "tZsKb7",
        description: "Title for the social media section.",
      }),
    },
  };

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: pageTitle,
        url: paths.termsAndConditions(),
      },
    ],
  });

  const comments = [
    intl.formatMessage({
      defaultMessage: "include personal information",
      id: "z8b14H",
      description: "Comments or contributions list item",
    }),
    intl.formatMessage({
      id: "LDrXbc",
      defaultMessage:
        "include protected or classified information of the Government of Canada",
      description: "Comments or contributions list item",
    }),
    intl.formatMessage({
      id: "wvxZxx",
      defaultMessage:
        "infringe upon intellectual property or proprietary rights",
      description: "Comments or contributions list item",
    }),
    intl.formatMessage({
      id: "z6omvn",
      defaultMessage:
        "are contrary to the principles of the Canadian Charter of Rights and Freedoms, Constitution Act, 1982",
      description: "Comments or contributions list item",
    }),
    intl.formatMessage({
      id: "dxwgXw",
      defaultMessage:
        "are racist, hateful, sexist, homophobic or defamatory, or contain or refer to any obscenity or pornography",
      description: "Comments or contributions list item",
    }),
    intl.formatMessage({
      id: "TPw/0u",
      defaultMessage: "are threatening, violent, intimidating or harassing",
      description: "Comments or contributions list item",
    }),
    intl.formatMessage({
      id: "Xe39xZ",
      defaultMessage:
        "are contrary to any federal, provincial or territorial laws of Canada",
      description: "Comments or contributions list item",
    }),
    intl.formatMessage({
      id: "QnfjbI",
      defaultMessage: "constitute impersonation, advertising or spam",
      description: "Comments or contributions list item",
    }),
    intl.formatMessage({
      id: "x4HViJ",
      defaultMessage: "encourage or incite any criminal activity",
      description: "Comments or contributions list item",
    }),
    intl.formatMessage({
      id: "nZ8ZLR",
      defaultMessage: "are written in a language other than English or French",
      description: "Comments or contributions list item",
    }),
    intl.formatMessage({
      id: "GTqXN1",
      defaultMessage: "otherwise violate this notice",
      description: "Comments or contributions list item",
    }),
  ];

  return (
    <>
      <Hero
        imgPath={heroImg}
        title={pageTitle}
        subtitle={subtitle}
        crumbs={crumbs}
      />
      <Container>
        <TableOfContents.Wrapper className="mt-18">
          <TableOfContents.Navigation>
            <TableOfContents.List>
              {Object.values(sections).map((section) => (
                <TableOfContents.ListItem key={section.id}>
                  <TableOfContents.AnchorLink id={section.id}>
                    {section.title}
                  </TableOfContents.AnchorLink>
                </TableOfContents.ListItem>
              ))}
            </TableOfContents.List>
          </TableOfContents.Navigation>
          <TableOfContents.Content>
            <TableOfContents.Section id={sections.usingFiles.id}>
              <TableOfContents.Heading size="h3" className="mt-0 mb-6">
                {sections.usingFiles.title}
              </TableOfContents.Heading>
              <p className="my-6">
                {intl.formatMessage(
                  {
                    defaultMessage:
                      "To improve the functionality of Government of Canada websites, certain files (such as open source libraries, images and scripts) may be delivered automatically to your browser via a trusted third-party server or content delivery network. The delivery of these files is intended to provide a seamless user experience by speeding response times and avoiding the need for each visitor to download these files. Where applicable, specific privacy statements covering these files are included in our <privacyPolicyLink>Privacy policy</privacyPolicyLink>.",
                    id: "yGwPBd",
                    description: "Paragraph describing using files section",
                  },
                  {
                    privacyPolicyLink: (chunks: ReactNode) =>
                      privacyPolicyLink(paths.privacyPolicy(), chunks),
                  },
                )}
              </p>
            </TableOfContents.Section>
            <TableOfContents.Section id={sections.providingContent.id}>
              <TableOfContents.Heading size="h3" className="mt-18 mb-6">
                {sections.providingContent.title}
              </TableOfContents.Heading>
              <p className="my-6">
                {intl.formatMessage(
                  {
                    id: "wsNG8a",
                    defaultMessage:
                      "The <langActLink>Official Languages Act</langActLink>, the <langRegulationsLink>Official Languages (Communications with and Services to the Public) Regulations</langRegulationsLink> and Treasury Board policy requirements establish when we use both English and French to provide services to or communicate with members of the public. When there is no obligation to provide information in both official languages, content may be available in one official language only. Information provided by organizations not subject to the <langActLink>Official Languages Act</langActLink> is in the language(s) provided. Information provided in a language other than English or French is only for the convenience of our visitors.",
                    description:
                      "Paragraph describing providing content section",
                  },
                  {
                    langActLink: (chunks: ReactNode) =>
                      langActLink(locale, chunks),
                    langRegulationsLink: (chunks: ReactNode) =>
                      langRegulationsLink(locale, chunks),
                  },
                )}
              </p>
            </TableOfContents.Section>
            <TableOfContents.Section id={sections.linkingToGov.id}>
              <TableOfContents.Heading size="h3" className="mt-18 mb-6">
                {sections.linkingToGov.title}
              </TableOfContents.Heading>
              <p className="my-3">
                {intl.formatMessage({
                  defaultMessage:
                    "Links to websites not under the control of the Government of Canada, including those to our social media accounts, are provided solely for the convenience of our website visitors. We are not responsible for the accuracy, currency or reliability of the content of such websites. The Government of Canada does not offer any guarantee in that regard and is not responsible for the information found through these links, and does not endorse the sites and their content.",
                  id: "Jz7jAF",
                  description: "Paragraph describing linking to gov section",
                })}
              </p>
              <p className="my-3">
                {intl.formatMessage(
                  {
                    defaultMessage:
                      "Visitors should also be aware that information offered by non-Government of Canada sites to which this website links is not subject to the <privacyActLink>Privacy Act</privacyActLink> or the <langActLink>Official Languages Act</langActLink> and may not be accessible to persons with disabilities. The information offered may be available only in the language(s) used by the sites in question. With respect to privacy, visitors should research the privacy policies of these non-government websites before providing personal information.",
                    id: "1e84jV",
                    description:
                      "Paragraph two describing linking to gov section",
                  },
                  {
                    privacyActLink: (chunks: ReactNode) =>
                      privacyActLink(locale, chunks),
                    langActLink: (chunks: ReactNode) =>
                      langActLink(locale, chunks),
                  },
                )}
              </p>
            </TableOfContents.Section>
            <TableOfContents.Section id={sections.ownershipAndUsage.id}>
              <TableOfContents.Heading size="h3" className="mt-18 mb-6">
                {sections.ownershipAndUsage.title}
              </TableOfContents.Heading>
              <p className="my-3">
                {intl.formatMessage({
                  id: "p8o9cO",
                  defaultMessage:
                    "Materials on this website were produced and/or compiled for the purpose of providing Canadians with access to information about the programs and services offered by the Government of Canada. You may use and reproduce the materials as follows:",
                  description:
                    "Paragraph describing ownership and usage section",
                })}
              </p>
              <Ul space="lg">
                <li>
                  <p className="font-bold">
                    {intl.formatMessage({
                      defaultMessage: "Non-commercial reproduction",
                      id: "PerY/b",
                      description:
                        "Non commercial reproduction list in ownership and usage section",
                    })}
                  </p>
                  <p className="my-3">
                    {intl.formatMessage({
                      defaultMessage:
                        "Unless otherwise specified you may reproduce the materials in whole or in part for non-commercial purposes, and in any format, without charge or further permission, provided you do the following:",
                      id: "UnAF+3",
                      description:
                        "Non commercial reproduction list description in ownership and usage section",
                    })}
                  </p>
                  <Ul space="md">
                    <li>
                      {intl.formatMessage({
                        defaultMessage:
                          "exercise due diligence in ensuring the accuracy of the materials reproduced",
                        id: "laYGvQ",
                        description: "Non commercial reproduction list item",
                      })}
                    </li>
                    <li>
                      {intl.formatMessage({
                        defaultMessage:
                          "indicate both the complete title of the materials reproduced, as well as the author (where available)",
                        id: "Y5Z216",
                        description: "Non commercial reproduction list item",
                      })}
                    </li>
                    <li>
                      {intl.formatMessage({
                        defaultMessage:
                          "indicate that the reproduction is a copy of the version available at [URL where original document is available]",
                        id: "WhtOLT",
                        description: "Non commercial reproduction list item",
                      })}
                    </li>
                  </Ul>
                </li>
                <li>
                  <p className="my-3 font-bold">
                    {intl.formatMessage({
                      defaultMessage: "Commercial reproduction",
                      id: "gMaDG/",
                      description:
                        "Commercial reproduction list in ownership and usage section",
                    })}
                  </p>
                  <p className="my-3">
                    {intl.formatMessage({
                      defaultMessage:
                        "Unless otherwise specified, you may not reproduce materials on this site, in whole or in part, for the purposes of commercial redistribution without prior written permission from the copyright administrator. To obtain permission to reproduce Government of Canada materials on this site for commercial purposes, contact:",
                      id: "BA5yoE",
                      description:
                        "Commercial reproduction list description in ownership and usage section",
                    })}
                  </p>
                  <Ul space="sm">
                    <li>
                      {intl.formatMessage({
                        defaultMessage:
                          "Canada.ca Web Services 200 Promenade du Portage Gatineau, QC K1A 0J9 Canada, or",
                        id: "qsI2b1",
                        description: "Commercial reproduction list item",
                      })}
                    </li>
                    <li>
                      {intl.formatMessage(
                        {
                          defaultMessage:
                            "complete the <questionsLink>Questions and comments form</questionsLink>",
                          id: "8ZIao3",
                          description: "Commercial reproduction list item",
                        },
                        {
                          questionsLink: (chunks: ReactNode) =>
                            questionsLink(locale, chunks),
                        },
                      )}
                    </li>
                  </Ul>
                  <p className="mt-3">
                    {intl.formatMessage(
                      {
                        defaultMessage:
                          "Some of the content on this site may be subject to the copyright of another party. Where information has been produced or copyright is not held by the Government of Canada, the materials are protected under the <copyrightLink>Copyright Act</copyrightLink>, and international agreements. Details concerning copyright ownership are indicated on the relevant page(s).",
                        id: "g2We9g",
                        description:
                          "Commercial reproduction list description in ownership and usage section",
                      },
                      {
                        copyrightLink: (chunks: ReactNode) =>
                          copyrightLink(locale, chunks),
                      },
                    )}
                  </p>
                </li>
              </Ul>
            </TableOfContents.Section>
            <TableOfContents.Section id={sections.trademarkNotice.id}>
              <TableOfContents.Heading size="h3" className="mt-18 mb-6">
                {sections.trademarkNotice.title}
              </TableOfContents.Heading>
              <p className="my-6">
                {intl.formatMessage(
                  {
                    id: "zcr51k",
                    defaultMessage:
                      "The official symbols of the Government of Canada, including the Canada wordmark, the Arms of Canada, and the flag symbol may not be reproduced, whether for commercial or non-commercial purposes, without prior <trademarkLink>written authorization</trademarkLink>.",
                    description:
                      "Paragraph describing trademark notice section",
                  },
                  {
                    trademarkLink: (chunks: ReactNode) =>
                      trademarkLink(locale, chunks),
                  },
                )}
              </p>
            </TableOfContents.Section>
            <TableOfContents.Section id={sections.accessibilityCommitment.id}>
              <TableOfContents.Heading size="h3" className="mt-18 mb-6">
                {sections.accessibilityCommitment.title}
              </TableOfContents.Heading>
              <p className="my-6">
                {intl.formatMessage(
                  {
                    id: "4jMHwL",
                    defaultMessage:
                      "The Government of Canada is committed to achieving a high standard of accessibility as defined in the <accessibilityLink>Standard on Web Accessibility</accessibilityLink> and the <optimizeLink>Standard on Optimizing Websites and Applications for Mobile Devices</optimizeLink>. In the event of difficulty using our web pages, applications or device-based mobile applications, contact us for assistance or to obtain alternative formats such as regular print, Braille or another appropriate format.",
                    description:
                      "Paragraph describing accessibility commitment section",
                  },
                  {
                    accessibilityLink: (chunks: ReactNode) =>
                      accessibilityLink(locale, chunks),
                    optimizeLink: (chunks: ReactNode) =>
                      optimizeLink(locale, chunks),
                  },
                )}
              </p>
            </TableOfContents.Section>
            <TableOfContents.Section id={sections.socialMedia.id}>
              <TableOfContents.Heading size="h3" className="mt-18 mb-6">
                {sections.socialMedia.title}
              </TableOfContents.Heading>
              <p className="my-6">
                {intl.formatMessage({
                  id: "nxAw/X",
                  defaultMessage:
                    "This notice has been written to explain how the Government of Canada interacts with the public on social media platforms.",
                  description: "Paragraph describing social media section",
                })}
              </p>
              <p className="mb-18">
                {intl.formatMessage({
                  id: "Tq0ZKw",
                  defaultMessage:
                    "Your engagement with the Government of Canada via social media is in part governed by the Terms of Service/Use of the relevant third-party social media platform providers, as well as the following Terms and Conditions. The Government of Canada has no control over the social media platform providers’ Terms of Service/Use, but you are strongly encouraged to read them in addition to those that follow.",
                  description: "Paragraph describing social media section",
                })}
              </p>
              <Heading level="h3" size="h4" className="mb-6 font-bold">
                {intl.formatMessage({
                  id: "6f2bWo",
                  defaultMessage: "Content and frequency",
                  description: "Heading for content and frequency section",
                })}
              </Heading>
              <p className="my-3">
                {intl.formatMessage({
                  id: "Lt7tcM",
                  defaultMessage:
                    "The Government of Canada uses social media accounts as an alternative method of interacting with Canadians and of sharing the content posted on its website, facilitating access to Government of Canada information and services, and providing stakeholders with an opportunity to interact in an informative and respectful environment.",
                  description: "Paragraph for content and frequency section",
                })}
              </p>
              <p className="my-3">
                {intl.formatMessage({
                  id: "VIZAgj",
                  defaultMessage:
                    "Because social media platforms and their computer servers are managed by a third party, social media accounts are subject to downtime that may be out of the Government of Canada’s control. The government accepts no responsibility for platforms becoming unresponsive or unavailable.",
                  description: "Paragraph for content and frequency section",
                })}
              </p>
              <Heading level="h3" size="h4" className="mb-6 font-bold">
                {intl.formatMessage({
                  id: "L7Pe9h",
                  defaultMessage: "Links to other websites and ads",
                  description: "Heading for link to others section",
                })}
              </Heading>
              <p>
                {intl.formatMessage({
                  id: "hyBNpJ",
                  defaultMessage:
                    "Social media accounts may post or display links or ads for websites that are not under the control of the government of Canada. These links are provided solely for the convenience of users. The government is not responsible for the information found through these links or ads; neither does it endorse the sites or their content.",
                  description: "Paragraph for link to others section",
                })}
              </p>
              <Heading level="h3" size="h4" className="mb-6 font-bold">
                {intl.formatMessage({
                  id: "+lxGIT",
                  defaultMessage: "Following, “liking” and subscribing",
                  description: "Heading for following section",
                })}
              </Heading>
              <p>
                {intl.formatMessage({
                  id: "mSdBi1",
                  defaultMessage:
                    "The Government of Canada’s decision to follow, “like” or subscribe to another social media account does not imply an endorsement of that account, channel, page or site, and neither does sharing (re-tweeting, reposting or linking to) content from another user.",
                  description: "Paragraph for following section",
                })}
              </p>
              <Heading level="h3" size="h4" className="font-bold">
                {intl.formatMessage({
                  id: "lPuC3S",
                  defaultMessage: "Comments and interaction",
                  description: "Heading for comments and interaction section",
                })}
              </Heading>
              <p className="mb-3">
                {intl.formatMessage({
                  id: "zbmWLG",
                  defaultMessage:
                    "The Government of Canada will read comments and participate in discussions when appropriate. Your comments and contributions must be relevant and respectful.",
                  description: "Paragraph for comments and interaction section",
                })}
              </p>
              <p className="mb-3">
                {intl.formatMessage({
                  id: "8L9eJ3",
                  defaultMessage:
                    "The Government of Canada will not engage in partisan or political issues or respond to questions that violate these Terms and Conditions.",
                  description: "Paragraph for comments and interaction section",
                })}
              </p>
              <p className="mb-3">
                {intl.formatMessage({
                  id: "clzYpT",
                  defaultMessage:
                    "The Government of Canada reserves the right to remove comments and contributions, and to block users based on the following criteria:",
                  description: "Paragraph for comments and interaction section",
                })}
              </p>
              <p className="mb-3">
                {intl.formatMessage({
                  id: "I2CtZJ",
                  defaultMessage: "The comments or contributions:",
                  description: "Comments or contributions list title",
                })}
              </p>
              <Ul space="md">
                {comments.map((comment) => (
                  <li key={uniqueId()}>{comment}</li>
                ))}
              </Ul>
              <p className="mb-3">
                {intl.formatMessage({
                  id: "6yxxP6",
                  defaultMessage:
                    "The Government of Canada reserves the right to report users and/or their comments and contributions to third-party social media service providers to - prevent or remove the posting of content that is contrary to these Terms and Conditions, or to the Terms of Service/Use of the third-party social media platform.",
                  description:
                    "Paragraph of comments and interactions sections",
                })}
              </p>
              <Heading level="h3" size="h4" className="mt-18 mb-6 font-bold">
                {intl.formatMessage({
                  id: "9CAhAX",
                  defaultMessage: "Accessibility of social media platforms",
                  description: "Heading for comments and interaction section",
                })}
              </Heading>
              <p>
                {intl.formatMessage({
                  id: "TKONR6",
                  defaultMessage:
                    "Social media platforms are third-party service providers and are not bound by Government of Canada standards for web accessibility.",
                  description: "Paragraph for comments and interaction section",
                })}
              </p>
              <Heading level="h3" size="h4" className="mt-18 mb-6 font-bold">
                {intl.formatMessage({
                  id: "FAEU2d",
                  defaultMessage: "Copyright",
                  description: "Heading for comments and interaction section",
                })}
              </Heading>
              <p>
                {intl.formatMessage(
                  {
                    id: "sB7wVn",
                    defaultMessage:
                      "Information posted by the Government of Canada is subject to the <copyrightLink>Copyright Act</copyrightLink>.",
                    description:
                      "Paragraph for comments and interaction section",
                  },
                  {
                    copyrightLink: (chunks: ReactNode) =>
                      copyrightLink(locale, chunks),
                  },
                )}
              </p>
              <Heading level="h3" size="h4" className="mt-18 mb-6 font-bold">
                {intl.formatMessage({
                  id: "V0jG33",
                  defaultMessage: "Privacy",
                  description: "Heading for comments and interaction section",
                })}
              </Heading>
              <p>
                {intl.formatMessage({
                  id: "RmcS7J",
                  defaultMessage:
                    "Social media accounts are not Government of Canada websites and represent only their presence on third-party service providers.",
                  description: "Paragraph for comments and interaction section",
                })}
              </p>
              <Heading level="h3" size="h4" className="mt-18 mb-3 font-bold">
                {intl.formatMessage({
                  id: "diSBjl",
                  defaultMessage: "Official languages",
                  description: "Heading for comments and interaction section",
                })}
              </Heading>
              <p>
                {intl.formatMessage(
                  {
                    id: "cx7pV4",
                    defaultMessage:
                      "Many social media platforms have multiple language options and provide instructions on how to set your preferences. The Government of Canada respects the <langActLink>Official Languages Act</langActLink> and is committed to ensuring that our information is available in both French and English and that both versions are of equal quality.",
                    description:
                      "Paragraph for comments and interaction section",
                  },
                  {
                    langActLink: (chunks: ReactNode) =>
                      langActLink(locale, chunks),
                  },
                )}
              </p>
            </TableOfContents.Section>
          </TableOfContents.Content>
        </TableOfContents.Wrapper>
      </Container>
      <Flourish />
    </>
  );
};

Component.displayName = "TermsAndConditionsPage";

export default Component;
