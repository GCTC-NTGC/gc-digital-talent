import { useIntl } from "react-intl";
import SparklesIcon from "@heroicons/react/24/outline/SparklesIcon";
import { ReactNode } from "react";

import { Heading, CardFlat } from "@gc-digital-talent/ui";
import { navigationMessages } from "@gc-digital-talent/i18n";

import SkewedContainer from "~/components/SkewedContainer/SkewedContainer";
import useRoutes from "~/hooks/useRoutes";
import { wrapAbbr } from "~/utils/nameUtils";

const Opportunities = () => {
  const intl = useIntl();
  const paths = useRoutes();

  return (
    <SkewedContainer>
      <Heading
        level="h2"
        size="h3"
        data-h2-font-weight="base(400)"
        icon={SparklesIcon}
        color="secondary"
        data-h2-margin="base(0)"
      >
        {intl.formatMessage({
          defaultMessage: "Build your digital career",
          id: "KS1jGw",
          description: "Heading for the recruitment opportunities",
        })}
      </Heading>
      <div
        data-h2-display="base(grid)"
        data-h2-grid-template-columns="base(1fr) p-tablet(1fr) l-tablet(repeat(3, minmax(0, 1fr)))"
        data-h2-gap="base(x2) p-tablet(x3)"
        data-h2-padding="base(x2, 0, 0, 0)"
      >
        <CardFlat
          color="warning"
          title={intl.formatMessage({
            defaultMessage: "Jobs in digital government",
            id: "+cBKDC",
            description: "Heading for the digital government job opportunities",
          })}
          links={[
            {
              href: paths.browsePools(),
              mode: "solid",
              label: intl.formatMessage(navigationMessages.browseJobs),
            },
          ]}
        >
          <p>
            {intl.formatMessage(
              {
                defaultMessage:
                  "Check out the latest <abbreviation>GC</abbreviation> opportunities in digital and tech, from entry level to management. Find a team, make a difference, and be inspired.",
                id: "jAFzzR",
                description:
                  "Description for the digital government job opportunities",
              },
              {
                abbreviation: (text: ReactNode) => wrapAbbr(text, intl),
              },
            )}
          </p>
        </CardFlat>
        <CardFlat
          color="primary"
          title={intl.formatMessage({
            defaultMessage: "Managers community",
            id: "l75mNg",
            description: "Title for Managers community",
          })}
          links={[
            {
              href: paths.manager(),
              mode: "solid",
              label: intl.formatMessage({
                defaultMessage:
                  "Learn more<hidden> about the managers community</hidden>",
                description: "Link text to the managers community",
                id: "4V/DsD",
              }),
            },
          ]}
        >
          <p data-h2-margin-bottom="base(x1)">
            {intl.formatMessage({
              defaultMessage:
                "Find pre-qualified talent for your team or plan your own next career move.",
              id: "e6hj69",
              description:
                "Paragraph one, description of the managers community",
            })}
          </p>
          <p>
            {intl.formatMessage({
              defaultMessage:
                "Want to do more? Gain management experience on a hiring panel or try leading your own recruitment process.",
              id: "NV+5pq",
              description:
                "Paragraph two, description of the managers community",
            })}
          </p>
        </CardFlat>
        <CardFlat
          color="error"
          title={intl.formatMessage({
            defaultMessage: "Executive community",
            id: "/zVZCP",
            description: "Heading for executive jobs in government",
          })}
          links={[
            {
              href: paths.executive(),
              mode: "solid",
              label: intl.formatMessage({
                defaultMessage:
                  "Learn more<hidden> about the executive community</hidden>",
                id: "K9YLac",
                description: "Link text to the executive community",
              }),
            },
          ]}
        >
          <p>
            {intl.formatMessage({
              defaultMessage:
                "From entry-level executive roles to CIO opportunities across the Government of Canada, this is the place to come if you're ready to take your next step in digital leadership.",
              id: "xnNnwu",
              description: "Description of the executive community",
            })}
          </p>
        </CardFlat>
      </div>
    </SkewedContainer>
  );
};

export default Opportunities;
