import { useIntl } from "react-intl";

import {
  FragmentType,
  getFragment,
  graphql,
  HiringPlatform,
} from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import { Heading, HTMLEntity } from "@gc-digital-talent/ui";

import { wrapAbbr } from "~/utils/nameUtils";
import { getClassificationName } from "~/utils/poolUtils";

import OffPlatformProcessDialog, {
  OffPlatformProcessDialog_Fragment,
} from "./OffPlatformProcessDialog";

const OffPlatformRecruitmentProcessList_Fragment = graphql(/* GraphQL */ `
  fragment OffPlatformRecruitmentProcessList on OffPlatformRecruitmentProcess {
    id
    processNumber
    department {
      id
      departmentNumber
      name {
        localized
      }
    }
    classification {
      id
      group
      level
    }
    platform {
      value
      label {
        localized
      }
    }
    platformOther
  }
`);

interface OffPlatformRecruitmentProcessListProps {
  processesQuery?: FragmentType<
    typeof OffPlatformRecruitmentProcessList_Fragment
  >[];
  editDialogQuery?: FragmentType<typeof OffPlatformProcessDialog_Fragment>;
}

const OffPlatformRecruitmentProcessList = ({
  processesQuery,
  editDialogQuery,
}: OffPlatformRecruitmentProcessListProps) => {
  const intl = useIntl();
  const processes = getFragment(
    OffPlatformRecruitmentProcessList_Fragment,
    processesQuery,
  );

  if (!processes || processes.length === 0) {
    return null;
  }

  return (
    <ul className="mb-6 flex flex-col">
      {processes.map((process) => {
        const classificationTitle = process.classification
          ? wrapAbbr(getClassificationName(process.classification, intl), intl)
          : intl.formatMessage(commonMessages.notFound);

        return (
          <li
            className="group/item relative flex items-center justify-between gap-3 odd:bg-gray-100/30 dark:odd:bg-gray-700/50 dark:even:bg-gray-700/30"
            key={process.id}
          >
            <div className="ml-6 flex flex-col">
              <Heading
                level="h4"
                className="mt-3 mb-3 inline-block text-base group-has-[a:focus-visible,button:focus-visible]/item:bg-focus group-has-[a:focus-visible,button:focus-visible]/item:text-black group-has-[a:hover,button:hover]/item:text-primary-600 xs:mb-0 lg:text-base dark:group-has-[a:hover,button:hover]/item:text-primary-200"
              >
                <span>
                  {process.department
                    ? intl.formatMessage(
                        {
                          defaultMessage:
                            "{classification} with {departmentName} <hidden>off platform process</hidden>",
                          id: "pBRz2q",
                          description:
                            "Title for an off platform recruitment process if department is given.",
                        },
                        {
                          classification: classificationTitle,
                          departmentName: process.department.name.localized,
                        },
                      )
                    : intl.formatMessage(
                        {
                          defaultMessage:
                            "{classification} <hidden>off platform process</hidden>",
                          id: "QtDQkD",
                          description:
                            "Title for an off platform recruitment process if department is not given.",
                        },
                        {
                          classification: classificationTitle,
                        },
                      )}
                </span>
              </Heading>
              <div className="mb-3 flex flex-col flex-nowrap items-start gap-y-3 text-sm xs:flex-row xs:flex-wrap xs:items-center">
                <span className="text-gray-600 dark:text-gray-200">
                  {process.platform &&
                  process.platform.value !== HiringPlatform.Other
                    ? process.platform.label.localized
                    : process.platformOther}
                </span>
                <HTMLEntity
                  name="&bull;"
                  className="mx-3 hidden text-gray-300 xs:inline-block dark:text-gray-200"
                  aria-hidden
                />
                <span className="text-gray-600 dark:text-gray-200">
                  {process.processNumber}
                </span>
              </div>
            </div>
            {editDialogQuery && (
              <OffPlatformProcessDialog
                query={editDialogQuery}
                process={process}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default OffPlatformRecruitmentProcessList;
