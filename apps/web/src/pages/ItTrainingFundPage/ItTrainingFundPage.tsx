import { defineMessage, useIntl } from "react-intl";
import MapIcon from "@heroicons/react/24/outline/MapIcon";
import BookmarkSquareIcon from "@heroicons/react/24/outline/BookmarkSquareIcon";
import LightBulbIcon from "@heroicons/react/24/outline/LightBulbIcon";

import { CardFlat, Heading } from "@gc-digital-talent/ui";

import Hero from "~/components/Hero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";

const pageTitle = defineMessage({
  defaultMessage: "IT Community Training and Development Fund",
  id: "wOITol",
  description: "page title for the IT training fund page",
});

const pageSubtitle = defineMessage({
  defaultMessage:
    "Explore learning opportunities for IT employees to build and strengthen skills.",
  id: "A94Zgi",
  description: "Page subtitle for the IT training fund page",
});

export const Component = () => {
  const intl = useIntl();
  const paths = useRoutes();

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(pageTitle),
        url: paths.itTrainingFund(),
      },
    ],
  });

  return (
    <>
      <Hero
        title={intl.formatMessage(pageTitle)}
        subtitle={intl.formatMessage(pageSubtitle)}
        crumbs={crumbs}
        centered
      />
      <div data-h2-padding="base(x3, 0)">
        <div data-h2-wrapper="base(center, large, x1) p-tablet(center, large, x2)">
          <div
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column)"
            data-h2-gap="base(x3)"
          >
            <div>
              <Heading
                Icon={MapIcon}
                size="h2"
                color="primary"
                data-h2-margin="base(0, 0, x1.5, 0)"
              >
                {intl.formatMessage({
                  defaultMessage: "Investing in the future of IT talent",
                  id: "v6/BRI",
                  description:
                    "Heading for section describing investing in future talent",
                })}
              </Heading>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "The Government of Canada is committed to supporting the development of its IT professionals. With the IT Community Training and Development Fund, employees represented by Professional Institute of the Public Service of Canada (PIPSC) in the IT group now have increased access to a wide range of learning opportunities to build and deepen their IT skills.",
                  id: "+2iWm1",
                  description:
                    "First paragraph describing investing in future talent",
                })}
              </p>
            </div>
            <div
              data-h2-display="base(flex)"
              data-h2-flex-direction="base(column)"
              data-h2-gap="base(x1.5)"
            >
              <Heading
                Icon={BookmarkSquareIcon}
                size="h2"
                color="tertiary"
                data-h2-margin="base(0)"
              >
                {intl.formatMessage({
                  defaultMessage:
                    "What is the IT Community Training and Development Fund?",
                  id: "8p4ty0",
                  description:
                    "Heading for section describing the training fund",
                })}
              </Heading>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "The IT Training and Development Fund is a financial commitment to support the professional growth of the Government of Canada's IT staff. It was established under the IT collective agreement signed between PIPSC’s IT Group and the Treasury Board of Canada Secretariat in December 2023. The Fund allocates $4.725 million each year for training and development for the duration of the agreement.",
                  id: "w3vTtS",
                  description: "First paragraph describing the training fund",
                })}
              </p>
              <div
                data-h2-display="base(flex)"
                data-h2-flex-direction="base(column)"
                data-h2-gap="base(x2) p-tablet(x3)"
              >
                <CardFlat
                  color="quaternary"
                  title={intl.formatMessage({
                    defaultMessage: "Objectives of the Fund",
                    id: "R9jFeX",
                    description: "Heading for the fund objectives card",
                  })}
                >
                  <p data-h2-margin-bottom="base(x0.5)">
                    {intl.formatMessage({
                      defaultMessage:
                        "The goal is to deliver additional comprehensive, consistent, and high-quality training opportunities to:",
                      id: "VmXu0a",
                      description: "title for a list of fund objectives",
                    })}
                  </p>
                  <ul data-h2-margin-bottom="base:children[:not(:last-child)](x0.5)">
                    <li>
                      {intl.formatMessage({
                        defaultMessage: "close critical skills gaps",
                        id: "DeFQGH",
                        description: "an item in a list of fund objectives",
                      })}
                    </li>
                    <li>
                      {intl.formatMessage({
                        defaultMessage:
                          "reduce reliance on external contractors",
                        id: "fCgDxi",
                        description: "an item in a list of fund objectives",
                      })}
                    </li>
                    <li>
                      {intl.formatMessage({
                        defaultMessage:
                          "equip IT employees to drive digital transformation",
                        id: "3I8R7b",
                        description: "an item in a list of fund objectives",
                      })}
                    </li>
                  </ul>
                </CardFlat>
                <CardFlat
                  color="secondary"
                  title={intl.formatMessage({
                    defaultMessage: "Employee eligibility",
                    id: "3deIgM",
                    description: "Heading for the employee eligibility card",
                  })}
                >
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "Training opportunities supported by the Fund are only available to employees represented by PIPSC in the IT group. This includes IT05 individual contributors but not IT05 directors who aren’t represented. The training is not available to employees whose substantive position is not classified as IT.",
                      id: "vF2OFC",
                      description:
                        "Description for the employee eligibility card",
                    })}
                  </p>
                </CardFlat>
                <CardFlat
                  color="tertiary"
                  title={intl.formatMessage({
                    defaultMessage: "Fund management",
                    id: "/ANsjm",
                    description: "Heading for the fund management card",
                  })}
                >
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "The management of the Fund is the responsibility of the Interdepartmental Joint Consultation Committee (IJCC), co-chaired by the Office of the Chief Information Officer (OCIO) and PIPSC’s IT Group.",
                      id: "x/bqCj",
                      description: "Description for the fund management card",
                    })}
                  </p>
                </CardFlat>
              </div>
            </div>
            <div>
              <Heading
                Icon={LightBulbIcon}
                size="h2"
                color="quaternary"
                data-h2-margin="base(0, 0, x1.5, 0)"
              >
                {intl.formatMessage({
                  defaultMessage: "Three types of learning opportunities",
                  id: "Zewopw",
                  description:
                    "Heading for section describing learning opportunities",
                })}
              </Heading>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "The Fund offers 3 types of training programs to IT employees.",
                  id: "nxTNzG",
                  description:
                    "First paragraph describing learning opportunities",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

Component.displayName = "ItTrainingFundPage";

export default Component;
