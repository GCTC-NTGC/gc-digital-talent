import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import { FragmentType, getFragment } from "@gc-digital-talent/graphql";
import { Chip, Chips, Heading, Link } from "@gc-digital-talent/ui";

import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import messages from "~/messages/jobPosterTemplateMessages";

import { InitialData_Fragment } from "./JobDetailsSection";

interface DisplayProps {
  initialDataQuery: FragmentType<typeof InitialData_Fragment>;
}

const Display = ({ initialDataQuery }: DisplayProps) => {
  const intl = useIntl();
  const notProvided = intl.formatMessage(commonMessages.notProvided);

  const {
    name,
    description,
    supervisoryStatus,
    workStream,
    workDescription,
    keywords,
    classification,
    referenceId,
  } = getFragment(InitialData_Fragment, initialDataQuery);

  // I don't want the name appended so not using the helper
  const classificationString =
    classification?.group && classification?.level
      ? `${classification.group}-${classification.level.toString().padStart(2, "0")}`
      : null;

  const titleEn = `${classificationString} ${name?.en}`.trim();
  const subtitleEn = `${supervisoryStatus?.label.en} in the ${workStream?.community?.name?.en}, ${workStream?.name?.en}`;

  const titleFr = `${classificationString} ${name?.fr}`.trim();
  const subtitleFr = `${supervisoryStatus?.label.fr} au ${workStream?.community?.name?.fr}, ${workStream?.name?.fr}`;

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <Heading level="h3" size="h6" className="order-1 m-0 sm:order-1">
        {intl.formatMessage({
          defaultMessage: "Job details (English)",
          id: "uM3mmt",
          description: "Title for the English job details section",
        })}
      </Heading>
      <div className="order-2 sm:order-3">
        <p className="font-bold text-primary-600 dark:text-primary-200">
          {titleEn ?? notProvided}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-200">{subtitleEn}</p>
      </div>
      <p className="order-3 sm:order-5">{description?.en ?? notProvided}</p>
      <div className="order-4 sm:order-7">
        {workDescription?.en ? (
          <Link
            external
            newTab
            href={workDescription.en}
            className="text-black"
          >
            {workDescription.en}
          </Link>
        ) : null}
      </div>
      <div className="order-5 sm:order-9">
        {keywords?.en?.length ? (
          <Chips>
            {keywords.en.map((keyword) => (
              <Chip key={keyword}>{keyword}</Chip>
            ))}
          </Chips>
        ) : null}
      </div>
      <Heading level="h3" size="h6" className="order-6 m-0 sm:order-2">
        {intl.formatMessage({
          defaultMessage: "Job details (French)",
          id: "Bftenr",
          description: "Title for the French job details section",
        })}
      </Heading>
      <div className="order-7 sm:order-4">
        <p className="font-bold text-primary-600 dark:text-primary-200">
          {titleFr ?? notProvided}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-200">{subtitleFr}</p>
      </div>
      <p className="order-8 sm:order-6">{description?.fr ?? notProvided}</p>
      <div className="order-9 sm:order-8">
        {workDescription?.fr ? (
          <Link
            external
            newTab
            href={workDescription.fr}
            className="text-black"
          >
            {workDescription.fr}
          </Link>
        ) : null}
      </div>
      <div className="order-10 sm:order-10">
        {keywords?.fr?.length ? (
          <Chips>
            {keywords.fr.map((keyword) => (
              <Chip key={keyword}>{keyword}</Chip>
            ))}
          </Chips>
        ) : null}
      </div>
      <FieldDisplay
        label={intl.formatMessage(messages.referenceId)}
        className="order-11"
      >
        {referenceId ?? notProvided}
      </FieldDisplay>
    </div>
  );
};

export default Display;
