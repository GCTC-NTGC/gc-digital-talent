import { useIntl } from "react-intl";
import pick from "lodash/pick";
import QueueListIcon from "@heroicons/react/24/outline/QueueListIcon";

import { graphql, FragmentType, getFragment } from "@gc-digital-talent/graphql";
import {
  commonMessages,
  getLocale,
  getLocalizedName,
} from "@gc-digital-talent/i18n";
import { Card, Heading, Link } from "@gc-digital-talent/ui";

import { getClassificationName } from "~/utils/poolUtils";
import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import jobPosterTemplateMessages from "~/messages/jobPosterTemplateMessages";

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
        icon={QueueListIcon}
        size="h2"
        color="secondary"
        className="mt-0 mb-6"
      >
        {intl.formatMessage(sections.basicDetails.title)}
      </Heading>
      <Card space="lg">
        {/* Fieldset */}
        <div className="grid gap-6 xs:grid-cols-2 sm:grid-cols-3">
          <FieldDisplay
            label={intl.formatMessage(jobPosterTemplateMessages.jobTitle)}
            className="xs:col-span-2 sm:col-span-3"
          >
            {getLocalizedName(jobPosterTemplate.name, intl)}
          </FieldDisplay>
          <FieldDisplay
            label={intl.formatMessage(jobPosterTemplateMessages.description)}
            className="xs:col-span-2 sm:col-span-3"
          >
            {getLocalizedName(jobPosterTemplate.description, intl)}
          </FieldDisplay>
          <FieldDisplay
            label={intl.formatMessage(jobPosterTemplateMessages.classification)}
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
            label={intl.formatMessage(jobPosterTemplateMessages.workStream)}
          >
            {getLocalizedName(jobPosterTemplate.workStream?.name, intl)}
          </FieldDisplay>
          <FieldDisplay
            label={intl.formatMessage(jobPosterTemplateMessages.typeOfRole)}
          >
            {getLocalizedName(jobPosterTemplate.supervisoryStatus?.label, intl)}
          </FieldDisplay>
          <FieldDisplay
            label={intl.formatMessage(
              jobPosterTemplateMessages.genericWorkDescription,
            )}
          >
            {workDescriptionUrl ? (
              <Link href={workDescriptionUrl} external newTab>
                <span className="font-bold">
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
            label={intl.formatMessage(jobPosterTemplateMessages.referenceId)}
          >
            {jobPosterTemplate.referenceId}
          </FieldDisplay>
        </div>
        <div className="mt-6 text-sm text-gray-500 dark:text-gray-200">
          {intl.formatMessage({
            defaultMessage:
              "* Please note that this resource is only available to Government of Canada employees on official networks.",
            id: "XRqYGj",
            description:
              "Fine print displayed on the job poster template about a resource only being available on official networks",
          })}
        </div>
      </Card>
    </>
  );
};

export default BasicDetails;
