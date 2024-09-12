import { useIntl } from "react-intl";
import pick from "lodash/pick";

import { graphql, FragmentType, getFragment } from "@gc-digital-talent/graphql";
import {
  commonMessages,
  getLocale,
  getLocalizedName,
} from "@gc-digital-talent/i18n";
import { Link } from "@gc-digital-talent/ui";

import { getClassificationName } from "~/utils/poolUtils";

import sections from "../sections";

const JobPosterTemplateBasicDetails_Fragment = graphql(/* GraphQL */ `
  fragment JobPosterTemplateBasicDetails on JobPosterTemplate {
    id
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
    stream {
      label {
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
      <div>{intl.formatMessage(sections.basicDetails.title)}</div>
      <div>
        {intl.formatMessage({
          defaultMessage: "Job title",
          id: "HBuWZ0",
          description: "Title for job title for a position",
        })}
        {getLocalizedName(jobPosterTemplate.name, intl)}
      </div>
      <div>
        {intl.formatMessage({
          defaultMessage: "Description",
          id: "9yGJ6k",
          description:
            "Title displayed for the skill table Description column.",
        })}
        {getLocalizedName(jobPosterTemplate.description, intl)}
      </div>
      <div>
        {intl.formatMessage({
          defaultMessage: "Classification",
          id: "YmWKlv",
          description: "Label for a process' classification",
        })}
        {jobPosterTemplate.classification?.group &&
        jobPosterTemplate.classification?.level
          ? getClassificationName(
              pick(jobPosterTemplate.classification, ["group", "level"]),
              intl,
            )
          : intl.formatMessage(commonMessages.notFound)}
      </div>
      <div>
        {intl.formatMessage({
          defaultMessage: "Work stream",
          id: "UKw7sB",
          description:
            "Label displayed on the pool form stream/job title field.",
        })}
        {getLocalizedName(jobPosterTemplate.stream?.label, intl)}
      </div>
      <div>
        {intl.formatMessage({
          defaultMessage: "Type of role",
          id: "+yB0EH",
          description:
            "Label displayed on the job poster template 'type of role' field.",
        })}
        {getLocalizedName(jobPosterTemplate.supervisoryStatus?.label, intl)}
      </div>
      <div>
        {intl.formatMessage({
          defaultMessage: "Generic work description",
          id: "EJN/zZ",
          description:
            "Label displayed on the job poster template 'generic work description' field.",
        })}
        {workDescriptionUrl ? (
          <Link href={workDescriptionUrl} external newTab>
            {intl.formatMessage({
              defaultMessage: "View on GCPedia*",
              id: "FAioB7",
              description:
                "Link text displayed on the job poster template 'generic work description' field. With an asterisk for fine print.",
            })}
          </Link>
        ) : (
          intl.formatMessage(commonMessages.notFound)
        )}
      </div>
      <div>
        {intl.formatMessage({
          defaultMessage: "Reference ID",
          id: "UoOv/g",
          description:
            "Label displayed on the job poster template 'reference id' field.",
        })}
        {jobPosterTemplate.referenceId}
      </div>
      <div>
        {intl.formatMessage({
          defaultMessage:
            "* Please note that this resource is only available to Government of Canada employees on official networks.",
          id: "XRqYGj",
          description:
            "Fine print displayed on the job poster template about a resource only being available on official networks",
        })}
      </div>
    </>
  );
};

export default BasicDetails;
