import { defineMessage, useIntl } from "react-intl";
import MapIcon from "@heroicons/react/24/outline/MapIcon";
import BookmarkSquareIcon from "@heroicons/react/24/outline/BookmarkSquareIcon";
import LightBulbIcon from "@heroicons/react/24/outline/LightBulbIcon";

import { Heading } from "@gc-digital-talent/ui";

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
            <div>
              <Heading
                Icon={BookmarkSquareIcon}
                size="h2"
                color="tertiary"
                data-h2-margin="base(0, 0, x1.5, 0)"
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
