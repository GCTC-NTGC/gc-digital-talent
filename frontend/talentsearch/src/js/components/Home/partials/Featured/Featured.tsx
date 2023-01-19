import React from "react";
import { useIntl } from "react-intl";

import imageUrl from "@common/helpers/imageUrl";

import Heading from "@common/components/Heading";
import { getLocale } from "@common/helpers/localize";
import TALENTSEARCH_APP_DIR from "../../../../talentSearchConstants";

import Block from "./Block";

// Create the page component
const Featured = () => {
  const intl = useIntl();
  const locale = getLocale(intl);

  const iapEmail = {
    subject: encodeURIComponent(
      intl.formatMessage({
        defaultMessage:
          "I'm interested in hiring Indigenous IT apprentices for my team",
        id: "p/dXxz",
        description:
          "Subject of email for info on Indigenous Apprenticeship Program",
      }),
    ),
    body: encodeURIComponent(
      intl.formatMessage({
        defaultMessage:
          "I discovered the Indigenous Apprenticeship Program on talent.canada.ca and I'd like to learn more about how I can hire apprentices to my team.",
        id: "dIIccA",
        description:
          "Body of email for info on Indigenous Apprenticeship Program",
      }),
    ),
  };

  // This array is just a temporary data object representing the content required by the feature blocks. This data will need to be migrated to wherever makes sense, and we'll also need dynamic routes and translated strings
  const featured = [
    {
      key: "digital-ambition",
      title: intl.formatMessage({
        defaultMessage: "The Digital Ambition",
        id: "tTuBmE",
        description: "Title for the digital ambition featured item",
      }),
      summary: intl.formatMessage({
        defaultMessage:
          'The Digital Ambition outlines the Government of Canada\'s commitment to create modern, accessible digital services. Achieving these priorities will result in a government that provides improved "digital-first," user-centred, and barrier-free services and programs.',
        id: "CbzWqJ",
        description: "Summary of the digital ambition featured item",
      }),

      img: {
        path: imageUrl(
          TALENTSEARCH_APP_DIR,
          "check_it_out_digital_ambition.jpg",
        ),
      },
      link: {
        path:
          locale === "en"
            ? "https://www.canada.ca/en/government/system/digital-government/government-canada-digital-operations-strategic-plans/canada-digital-ambition.html"
            : "https://www.canada.ca/fr/gouvernement/systeme/gouvernement-numerique/plans-strategiques-operations-numeriques-gouvernement-canada/ambition-numerique-canada.html",
        label: intl.formatMessage({
          defaultMessage: "Read the Digital Ambition",
          id: "Gil1Zj",
          description: "Link text to read the Digital Ambition",
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
      summary: intl.formatMessage({
        defaultMessage:
          "Are you looking for entry-level IT talent and want to support diversity, inclusion, and reconciliation? Connect with the IT Apprenticeship Program for Indigenous Peoples and start the process to hire Indigenous apprentices today!",
        id: "cYg+l1",
        description:
          "Summary of the Indigenous Apprenticeship Program for the homepage",
      }),
      img: {
        path: imageUrl(
          TALENTSEARCH_APP_DIR,
          "check_it_out_IAP_manager_callout.jpg",
        ),
      },
      link: {
        path: `mailto:edsc.pda-iap.esdc@hrsdc-rhdcc.gc.ca?subject=${iapEmail.subject}&body=${iapEmail.body}`,
        label: intl.formatMessage({
          defaultMessage: "Contact the Apprenticeship Program",
          id: "gG5eAt",
          description:
            "Link text to email about the Indigenous Apprenticeship Program",
        }),
      },
    },
  ];
  // Return the component
  return (
    <div data-h2-layer="base(2, relative)">
      <div
        data-h2-height="base(100%)"
        data-h2-width="base(100%)"
        data-h2-background-color="base(white) base:dark(black.light)"
        data-h2-position="base(absolute)"
        data-h2-transform="base(skewY(-3deg))"
        data-h2-overflow="base(hidden)"
      >
        <img
          data-h2-display="base(block) base:dark(none)"
          data-h2-position="base(absolute)"
          data-h2-location="base(0, 0, auto, auto)"
          data-h2-transform="base(skew(3deg))"
          data-h2-height="base(auto) p-tablet(50%)"
          data-h2-width="base(150%) p-tablet(auto)"
          data-h2-max-width="base(initial)"
          src={imageUrl(TALENTSEARCH_APP_DIR, "Desktop_Graphics_light_2.png")}
          alt=""
        />
        <img
          data-h2-display="base(none) base:dark(block)"
          data-h2-position="base(absolute)"
          data-h2-location="base(0, 0, auto, auto)"
          data-h2-transform="base(skew(3deg))"
          data-h2-height="base(auto) p-tablet(50%)"
          data-h2-width="base(150%) p-tablet(auto)"
          data-h2-max-width="base(initial)"
          src={imageUrl(TALENTSEARCH_APP_DIR, "Desktop_Graphics_dark_2.png")}
          alt=""
        />
        <img
          data-h2-display="base(block) base:dark(none)"
          data-h2-position="base(absolute)"
          data-h2-location="base(auto, auto, 0, 0)"
          data-h2-transform="base(skew(3deg))"
          data-h2-height="base(auto) desktop(90%)"
          data-h2-width="base(150%) p-tablet(100%) desktop(auto)"
          data-h2-max-width="base(initial)"
          src={imageUrl(TALENTSEARCH_APP_DIR, "Desktop_Graphics_light_3.png")}
          alt=""
        />
        <img
          data-h2-display="base(none) base:dark(block)"
          data-h2-position="base(absolute)"
          data-h2-location="base(auto, auto, 0, 0)"
          data-h2-transform="base(skew(3deg))"
          data-h2-height="base(auto) desktop(90%)"
          data-h2-width="base(150%) p-tablet(100%) desktop(auto)"
          data-h2-max-width="base(initial)"
          src={imageUrl(TALENTSEARCH_APP_DIR, "Desktop_Graphics_dark_3.png")}
          alt=""
        />
      </div>
      <div
        data-h2-position="base(relative)"
        data-h2-container="base(center, large, x1) p-tablet(center, large, x2)"
      >
        <div data-h2-padding="base(x3, 0) p-tablet(x5, 0, x4, 0) l-tablet(x7, 0, x6, 0)">
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
              <Block key={item.key} content={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Export the component
export default Featured;
