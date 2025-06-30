import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import { FragmentType, getFragment } from "@gc-digital-talent/graphql";
import { Chip, Chips, Link } from "@gc-digital-talent/ui";

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
  } = getFragment(InitialData_Fragment, initialDataQuery);

  // I don't want the name appended so not using the helper
  const classificationString =
    classification?.group && classification?.level
      ? `${classification.group}-${classification.level.toString().padStart(2, "0")}`
      : null;

  const titleEn = `${classificationString} ${name?.en}`.trim();
  const subtitleEn = `${supervisoryStatus?.label.en} in the ${workStream?.community?.name?.en}, ${workStream?.name?.en}`;

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="flex flex-col gap-6">
        <p className="font-bold">
          {intl.formatMessage({
            defaultMessage: "English job details",
            id: "elnOtk",
            description: "Title for the English job details section",
          })}
        </p>
        <div>
          <p className="font-bold text-primary-600">{titleEn ?? notProvided}</p>
          <p className="text-sm text-gray-600">{subtitleEn}</p>
        </div>
        <p>{description?.en ?? notProvided}</p>
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
        {keywords?.en?.length ? (
          <Chips>
            {keywords.en.map((keyword) => (
              <Chip key={keyword}>{keyword}</Chip>
            ))}
          </Chips>
        ) : null}
      </div>
      <div className="flex flex-col gap-6">french</div>
    </div>
  );
};

export default Display;
