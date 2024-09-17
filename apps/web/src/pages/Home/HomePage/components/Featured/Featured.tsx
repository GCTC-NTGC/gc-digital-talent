import { useIntl } from "react-intl";
import MagnifyingGlassCircleIcon from "@heroicons/react/24/outline/MagnifyingGlassCircleIcon";

import { Heading } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

import FeatureBlock from "~/components/FeatureBlock/FeatureBlock";
import FlourishContainer from "~/components/FlourishContainer/FlourishContainer";
import useRoutes from "~/hooks/useRoutes";
import glassesOnBooks from "~/assets/img/glasses-on-books.webp";
// import digitalAmbitionImg from "~/assets/img/check_it_out_digital_ambition.webp";
import iapManagerImg from "~/assets/img/check_it_out_IAP_manager_callout.webp";

const Featured = () => {
  const intl = useIntl();
  const paths = useRoutes();

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
              "Learn more about the Directive on Digital Talent. Connected to the Policy on Service and Digital, the Directive sets out reporting and coordination requirements for departments related to digital talent sourcing, from early planning to hiring and contracting.",
            id: "L0ugLs",
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
      title: intl.formatMessage(commonMessages.iapTitle),
      summary: (
        <p data-h2-margin-bottom="base(x1)">
          {intl.formatMessage({
            defaultMessage:
              "Designed by the Indigenous community for the Indigenous community, this program recruits entry-level applicants for learning and development IT opportunities across government.",
            id: "TUi+jx",
            description:
              "Summary of the IT Apprenticeship Program for Indigenous Peoples for the homepage",
          })}
        </p>
      ),
      img: { path: iapManagerImg },
      link: {
        path: paths.iap(),
        label: intl.formatMessage({
          defaultMessage:
            "Learn more<hidden> about the IT Apprenticeship Program for Indigenous Peoples</hidden>",
          id: "6tqGpT",
          description:
            "Link text to the IT Apprenticeship Program for Indigenous Peoples",
        }),
      },
    },
  ];

  return (
    <FlourishContainer>
      <Heading
        level="h2"
        size="h3"
        data-h2-font-weight="base(400)"
        data-h2-margin="base(0)"
        color="quinary"
        Icon={MagnifyingGlassCircleIcon}
      >
        {intl.formatMessage({
          defaultMessage: "Check it out",
          id: "1q/MmU",
          description: "Heading for featured items on the homepage",
        })}
      </Heading>
      <div
        data-h2-display="base(grid)"
        data-h2-grid-template-columns="base(1fr) p-tablet(repeat(2, minmax(0, 1fr)))"
        data-h2-gap="base(x1)"
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
