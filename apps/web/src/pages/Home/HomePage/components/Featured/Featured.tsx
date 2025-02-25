import { useIntl } from "react-intl";
import MagnifyingGlassCircleIcon from "@heroicons/react/24/outline/MagnifyingGlassCircleIcon";

import { Heading } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

import FeatureBlock from "~/components/FeatureBlock/FeatureBlock";
import FlourishContainer from "~/components/FlourishContainer/FlourishContainer";
import useRoutes from "~/hooks/useRoutes";
import glassesOnBooks from "~/assets/img/glasses-on-books.webp";
import iapManagerImg from "~/assets/img/check_it_out_IAP_manager_callout.webp";
import itTrainingFundImg from "~/assets/img/check_it_out_it_training_fund.webp";

const Featured = () => {
  const intl = useIntl();
  const paths = useRoutes();

  const featured = [
    {
      key: "it-training-fund",
      title: intl.formatMessage({
        defaultMessage: "IT Community Training and Development Fund",
        id: "030Tsr",
        description: "Title for the it training fund page",
      }),
      summary: (
        <p>
          {intl.formatMessage({
            defaultMessage:
              "Through this fund, IT employees can now access a variety of additional training opportunities, including self-paced learning, instructor-led courses, and certification exam vouchers.",
            id: "xfdk0g",
            description: "Summary of the it training fund featured item",
          })}
        </p>
      ),

      img: { path: itTrainingFundImg, position: "center" },
      link: {
        path: paths.itTrainingFund(),
        label: intl.formatMessage({
          defaultMessage:
            "Learn more<hidden> about the IT Community Training and Development Fund</hidden>",
          id: "g1YoPl",
          description: "Link text to the IT training fund",
        }),
      },
    },
    {
      key: "comptrollership-executives",
      title: intl.formatMessage({
        defaultMessage: "Talent management for comptrollership executives",
        id: "vtE73H",
        description:
          "Title for talent management for comptrollership executives callout",
      }),
      summary: (
        <p>
          {intl.formatMessage({
            defaultMessage:
              "Each year, the Financial Management Community gathers information on its executive workforce to maintain leadership excellence and stay ahead of future needs.",
            id: "GxSHuS",
            description:
              "Summary on the talent management for comptrollership executives callout",
          })}
        </p>
      ),

      img: { path: glassesOnBooks, position: "bottom right" },
      link: {
        path: paths.comptrollershipExecutivesPage(),
        label: intl.formatMessage({
          defaultMessage:
            "Learn more<hidden> about Talent management for comptrollership executives</hidden>",
          id: "5Y8vU5",
          description:
            "Link text to the Talent management for comptrollership executives page",
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
        data-h2-grid-template-columns="base(1fr) p-tablet(repeat(3, minmax(0, 1fr)))"
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
