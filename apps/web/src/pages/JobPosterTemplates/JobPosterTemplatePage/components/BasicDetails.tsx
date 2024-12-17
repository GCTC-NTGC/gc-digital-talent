import { useIntl } from "react-intl";
import pick from "lodash/pick";
import QueueListIcon from "@heroicons/react/24/outline/QueueListIcon";

import { graphql, FragmentType, getFragment } from "@gc-digital-talent/graphql";
import {
  commonMessages,
  getLocale,
  getLocalizedName,
} from "@gc-digital-talent/i18n";
import { CardBasic, Heading, Link } from "@gc-digital-talent/ui";

import { getClassificationName } from "~/utils/poolUtils";
import FieldDisplay from "~/components/ToggleForm/FieldDisplay";

import sections from "../sections";

const JobPosterTemplateBasicDetails_Fragment = graphql(/* GraphQL */ `
  fragment JobPosterTemplateBasicDetails on JobPosterTemplate {
    name {
      en
      fr
    }
    description {
      en
      fr
    }
    classification {
      group
      level
    }
    workStream {
      name {
        en
        fr
      }
    }
    supervisoryStatus {
      label {
        en
        fr
      }
    }
    workDescription {
      en
      fr
    }
    referenceId
  }
`);

interface BasicDetailsProps {
  jobPosterTemplateQuery: FragmentType<
    typeof JobPosterTemplateBasicDetails_Fragment
  >;
}

const BasicDetails = ({ jobPosterTemplateQuery }: BasicDetailsProps) => {
  const intl = useIntl();
  const jobPosterTemplate = getFragment(
    JobPosterTemplateBasicDetails_Fragment,
    jobPosterTemplateQuery,
  );

  const workDescriptionUrl =
    jobPosterTemplate.workDescription?.[getLocale(intl)];

  return (
    <>
      <Heading
        Icon={QueueListIcon}
        size="h2"
        color="primary"
        data-h2-margin="base(0, 0, x1, 0)"
      >
        {intl.formatMessage(sections.basicDetails.title)}
      </Heading>
      <CardBasic data-h2-padding="base(x1.5)">
        {/* Fieldset */}
        <div
          data-h2-display="base(grid)"
          data-h2-gap="base(x1)"
          data-h2-grid-template-columns="p-tablet(repeat(2, 1fr)) l-tablet(repeat(3, 1fr))"
        >
          <FieldDisplay
            label={intl.formatMessage({
              defaultMessage: "Job title",
              id: "HBuWZ0",
              description: "Title for job title for a position",
            })}
            data-h2-grid-column="p-tablet(span 2) l-tablet(span 3)"
          >
            {getLocalizedName(jobPosterTemplate.name, intl)}
          </FieldDisplay>
          <FieldDisplay
            label={intl.formatMessage(commonMessages.description)}
            data-h2-grid-column="p-tablet(span 2) l-tablet(span 3)"
          >
            {getLocalizedName(jobPosterTemplate.description, intl)}
          </FieldDisplay>
          <FieldDisplay
            label={intl.formatMessage({
              defaultMessage: "Classification",
              id: "YmWKlv",
              description: "Label for a process' classification",
            })}
          >
            {jobPosterTemplate.classification?.group &&
            jobPosterTemplate.classification?.level
              ? getClassificationName(
                  pick(jobPosterTemplate.classification, ["group", "level"]),
                  intl,
                )
              : intl.formatMessage(commonMessages.notFound)}
          </FieldDisplay>
          <FieldDisplay
            label={intl.formatMessage({
              defaultMessage: "Work stream",
              id: "UKw7sB",
              description:
                "Label displayed on the pool form stream/job title field.",
            })}
          >
            {getLocalizedName(jobPosterTemplate.workStream?.name, intl)}
          </FieldDisplay>
          <FieldDisplay
            label={intl.formatMessage({
              defaultMessage: "Type of role",
              id: "+yB0EH",
              description:
                "Label displayed on the job poster template 'type of role' field.",
            })}
          >
            {getLocalizedName(jobPosterTemplate.supervisoryStatus?.label, intl)}
          </FieldDisplay>
          <FieldDisplay
            label={intl.formatMessage({
              defaultMessage: "Generic work description",
              id: "EJN/zZ",
              description:
                "Label displayed on the job poster template 'generic work description' field.",
            })}
          >
            {workDescriptionUrl ? (
              <Link href={workDescriptionUrl} external newTab>
                <span data-h2-font-weight="base(bold)">
                  {intl.formatMessage({
                    defaultMessage: "View on GCPedia*",
                    id: "FAioB7",
                    description:
                      "Link text displayed on the job poster template 'generic work description' field. With an asterisk for fine print.",
                  })}
                </span>
              </Link>
            ) : (
              intl.formatMessage(commonMessages.notFound)
            )}
          </FieldDisplay>
          <FieldDisplay
            label={intl.formatMessage({
              defaultMessage: "Reference ID",
              id: "UoOv/g",
              description:
                "Label displayed on the job poster template 'reference id' field.",
            })}
          >
            {jobPosterTemplate.referenceId}
          </FieldDisplay>
        </div>
        <div
          data-h2-color="base(black.light)"
          data-h2-font-size="base(caption)"
          data-h2-margin-top="base(x1)"
        >
          {intl.formatMessage({
            defaultMessage:
              "* Please note that this resource is only available to Government of Canada employees on official networks.",
            id: "XRqYGj",
            description:
              "Fine print displayed on the job poster template about a resource only being available on official networks",
          })}
        </div>
      </CardBasic>
    </>
  );
};

export default BasicDetails;
