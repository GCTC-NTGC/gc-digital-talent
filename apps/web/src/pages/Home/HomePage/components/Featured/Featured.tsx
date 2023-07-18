import React from "react";
import { useIntl } from "react-intl";

import { Heading } from "@gc-digital-talent/ui";

import FeatureBlock from "~/components/FeatureBlock/FeatureBlock";
import FlourishContainer from "~/components/FlourishContainer/FlourishContainer";
import { wrapAbbr } from "~/utils/nameUtils";
import useRoutes from "~/hooks/useRoutes";

import glassesOnBooks from "~/assets/img/glasses-on-books.jpg";
// import digitalAmbitionImg from "~/assets/img/check_it_out_digital_ambition.jpg";
import iapManagerImg from "~/assets/img/check_it_out_IAP_manager_callout.jpg";

const Featured = () => {
  const intl = useIntl();
  const paths = useRoutes();

  const iapEmail = {
    subject: encodeURIComponent(
      intl.formatMessage({
        defaultMessage:
          "I'm interested in hiring Indigenous IT apprentices for my team",
        id: "E4PMGL",
        description:
          "Subject of email for info on IT Apprenticeship Program for Indigenous Peoples",
      }),
    ),
    body: encodeURIComponent(
      intl.formatMessage({
        defaultMessage:
          "I discovered the IT Apprenticeship Program for Indigenous Peoples on talent.canada.ca and I'd like to learn more about how I can hire apprentices to my team.",
        id: "02aheT",
        description:
          "Body of email for info on IT Apprenticeship Program for Indigenous Peoples",
      }),
    ),
  };

  // TEMP: Removed in https://github.com/GCTC-NTGC/gc-digital-talent/pull/6143
  // const digitalAmbition = {
  //   key: "digital-ambition",
  //   title: intl.formatMessage({
  //     defaultMessage: "The Digital Ambition",
  //     id: "tTuBmE",
  //     description: "Title for the digital ambition featured item",
  //   }),
  //   summary: intl.formatMessage({
  //     defaultMessage:
  //       'The Digital Ambition outlines the Government of Canada\'s commitment to create modern, accessible digital services. Achieving these priorities will result in a government that provides improved "digital-first," user-centred, and barrier-free services and programs.',
  //     id: "CbzWqJ",
  //     description: "Summary of the digital ambition featured item",
  //   }),
  //   img: { path: digitalAmbitionImg },
  //   link: {
  //     path:
  //       locale === "en"
  //         ? "https://www.canada.ca/en/government/system/digital-government/government-canada-digital-operations-strategic-plans/canada-digital-ambition.html"
  //         : "https://www.canada.ca/fr/gouvernement/systeme/gouvernement-numerique/plans-strategiques-operations-numeriques-gouvernement-canada/ambition-numerique-canada.html",
  //     label: intl.formatMessage({
  //       defaultMessage: "Read the Digital Ambition",
  //       id: "Gil1Zj",
  //       description: "Link text to read the Digital Ambition",
  //     }),
  //   },
  // };

  const featured = [
    {
      key: "directive-on-digital-talent",
      title: intl.formatMessage({
        defaultMessage: "Directive on Digital Talent",
        id: "xXwUGs",
        description: "Title for the digital talent directive page",
      }),
      summary: (
        <p>
          {intl.formatMessage({
            defaultMessage:
              "Learn more about the new Directive on Digital Talent. Connected to the Policy on Service and Digital, the Directive sets out new reporting and coordination requirements for departments related to digital talent sourcing, from early planning to hiring and contracting.",
            id: "jO2uif",
            description:
              "Summary of the directive on digital talent featured item",
          })}
        </p>
      ),

      img: { path: glassesOnBooks, position: "bottom right" },
      link: {
        path: paths.directive(),
        label: intl.formatMessage({
          defaultMessage: "Check out the Directive",
          id: "sGPKUt",
          description: "Link text to read the directive on digital talent",
        }),
      },
    },
    {
      key: "hiring-indigenous-talent",
      title: intl.formatMessage({
        defaultMessage: "Hiring Indigenous Tech Talent",
        id: "nYA+Tj",
        description: "Title for the Indigenous tech talent feature item",
      }),
      summary: (
        <p>
          {intl.formatMessage(
            {
              defaultMessage:
                "Are you looking for entry-level <abbreviation>IT</abbreviation> talent and want to support diversity, inclusion, and reconciliation? Connect with the <abbreviation>IT</abbreviation> Apprenticeship Program for Indigenous Peoples and start the process to hire Indigenous apprentices today!",
              id: "Q0G/5L",
              description:
                "Summary of the IT Apprenticeship Program for Indigenous Peoples for the homepage",
            },
            {
              abbreviation: (text: React.ReactNode) => wrapAbbr(text, intl),
            },
          )}
        </p>
      ),
      img: { path: iapManagerImg },
      link: {
        external: true,
        path: `mailto:edsc.pda-iap.esdc@hrsdc-rhdcc.gc.ca?subject=${iapEmail.subject}&body=${iapEmail.body}`,
        label: intl.formatMessage({
          defaultMessage: "Contact the Apprenticeship Program",
          id: "71f/uH",
          description:
            "Link text to email about the IT Apprenticeship Program for Indigenous Peoples",
        }),
      },
    },
  ];

  return (
    <FlourishContainer>
      <Heading level="h2" data-h2-margin="base(0, 0, x0.5, 0)">
        {intl.formatMessage({
          defaultMessage: "Check it out",
          id: "1q/MmU",
          description: "Heading for featured items on the homepage",
        })}
      </Heading>
      <div
        data-h2-display="base(grid)"
        data-h2-grid-template-columns="base(1fr) p-tablet(repeat(2, minmax(0, 1fr)))"
        data-h2-gap="base(x1) p-tablet(x2) laptop(x3)"
        data-h2-padding="base(x2, 0, 0, 0)"
      >
        {featured.map((item) => (
          <FeatureBlock key={item.key} content={item} />
        ))}
      </div>
    </FlourishContainer>
  );
};

export default Featured;
