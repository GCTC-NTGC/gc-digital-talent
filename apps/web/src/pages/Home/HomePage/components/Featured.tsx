import { useIntl } from "react-intl";
import MagnifyingGlassCircleIcon from "@heroicons/react/24/outline/MagnifyingGlassCircleIcon";
import MegaphoneIcon from "@heroicons/react/24/outline/MegaphoneIcon";

import { CardFlat, Heading } from "@gc-digital-talent/ui";

import FeatureBlock from "~/components/FeatureBlock/FeatureBlock";
import FlourishContainer from "~/components/FlourishContainer/FlourishContainer";
import useRoutes from "~/hooks/useRoutes";
import glassesOnBooks from "~/assets/img/glasses-on-books.webp";
import wfaImg from "~/assets/img/wfa-hero-card.webp";
import dndImg from "~/assets/img/dnd-hero-card.webp";
import pageTitles from "~/messages/pageTitles";

const Featured = () => {
  const intl = useIntl();
  const paths = useRoutes();

  const featured = [
    {
      key: "dnd",
      title: intl.formatMessage(pageTitles.dnd),
      summary: intl.formatMessage({
        defaultMessage:
          "Explore digital career opportunities with Canada's National Defence (DND) and contribute your expertise to projects that support national security and help strengthen the digital foundations of DND and the Canadian Armed Forces.",
        id: "DOZYQ5",
        description: "Summary for career opportunities with DND",
      }),
      img: {
        path: dndImg,
        position: "center",
        width: 400,
        height: 300,
      },
      link: {
        path: paths.dndDigitalCareers(),
        label: intl.formatMessage({
          defaultMessage:
            "Learn more<hidden> about digital careers at National Defence</hidden>",
          id: "iERL9L",
          description: "Link text for the digital careers at DND page",
        }),
      },
    },
    {
      key: "workforce-adjustment",
      title: intl.formatMessage({
        defaultMessage: "Workforce adjustment and new opportunities",
        id: "/QXIF+",
        description: "Heading for the WFA section",
      }),
      summary: (
        <p className="mb-6">
          {intl.formatMessage({
            defaultMessage:
              "The Government of Canada is undergoing changes as it pivots to new priorities. For some employees, this may mean a change in work situation. If this is you and you’re in one of the functional communities supported by our platform, we might be able to help.",
            id: "EtIovH",
            description: "Summary of WFA section",
          })}
        </p>
      ),
      img: { path: wfaImg, width: 400, height: 300 },
      link: {
        path: paths.wfaInfo(),
        label: intl.formatMessage({
          defaultMessage:
            "Learn more<hidden> about workforce adjustment</hidden>",
          id: "bzZnxS",
          description: "Link text to the workforce adjustment info page",
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

      img: {
        path: glassesOnBooks,
        position: "bottom right",
        width: 400,
        height: 300,
      },
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
  ];

  return (
    <FlourishContainer show={[]}>
      <Heading
        level="h2"
        size="h3"
        className="mt-0 mb-12 font-normal"
        color="primary"
        icon={MagnifyingGlassCircleIcon}
      >
        {intl.formatMessage({
          defaultMessage: "Check it out",
          id: "1q/MmU",
          description: "Heading for featured items on the homepage",
        })}
      </Heading>
      <div className="grid gap-6 sm:grid-cols-3">
        {featured.map((item) => (
          <FeatureBlock key={item.key} content={item} />
        ))}
      </div>
      <Heading
        level="h2"
        size="h3"
        icon={MegaphoneIcon}
        color="primary"
        className="mt-18 font-normal"
      >
        {intl.formatMessage({
          defaultMessage: "Resources for employees in the Digital Community",
          id: "WcGmlt",
          description: "Heading for the resources section of the homepage",
        })}
      </Heading>
      <div className="grid gap-12 pt-12 xs:gap-18 sm:grid-cols-3">
        <CardFlat
          color="primary"
          title={intl.formatMessage({
            defaultMessage: "Directive on Digital Talent",
            id: "xXwUGs",
            description: "Title for the digital talent directive page",
          })}
          links={[
            {
              external: true,
              mode: "solid",
              href: paths.directive(),
              label: intl.formatMessage({
                defaultMessage: "Check out the Directive",
                id: "sGPKUt",
                description:
                  "Link text to read the directive on digital talent",
              }),
            },
          ]}
        >
          <p>
            {intl.formatMessage({
              defaultMessage:
                "Learn more about the Directive on Digital Talent. Connected to the Policy on Service and Digital, the Directive sets out reporting and coordination requirements for departments related to digital talent sourcing, from early planning to hiring and contracting.",
              id: "L0ugLs",
              description:
                "Summary of the directive on digital talent featured item",
            })}
          </p>
        </CardFlat>
        <CardFlat
          color="primary"
          title={intl.formatMessage({
            defaultMessage: "IT Community Training and Development Fund",
            id: "030Tsr",
            description: "Title for the it training fund page",
          })}
          links={[
            {
              mode: "solid",
              href: paths.itTrainingFund(),
              label: intl.formatMessage({
                defaultMessage:
                  "Learn more<hidden> about the IT Community Training and Development Fund</hidden>",
                id: "g1YoPl",
                description: "Link text to the IT training fund",
              }),
            },
          ]}
        >
          <p>
            {intl.formatMessage({
              defaultMessage:
                "Through this fund, IT employees can access a variety of training opportunities, including self-paced learning, instructor-led courses, and certification exam vouchers.",
              id: "dOs1f3",
              description: "Summary of the it training fund featured item",
            })}
          </p>
        </CardFlat>
        <CardFlat
          color="primary"
          title={intl.formatMessage({
            defaultMessage: "Platform resources for HR professionals",
            id: "T+oEYC",
            description: "Title for HR resources was created",
          })}
          links={[
            {
              href: paths.skills(),
              mode: "solid",
              label: intl.formatMessage({
                defaultMessage:
                  "Learn more<hidden> resources for human resource professionals</hidden>",
                id: "31yjJ1",
                description: "Link text to learn more about platform resources",
              }),
            },
          ]}
        >
          <p>
            {intl.formatMessage({
              defaultMessage:
                "Explore the resources available to support HR and recruitment experts across the government, including resources such as the skills library and job advertisement templates.",
              id: "Osh6TL",
              description: "Description of platform resources for HR.",
            })}
          </p>
        </CardFlat>
      </div>
    </FlourishContainer>
  );
};

export default Featured;
