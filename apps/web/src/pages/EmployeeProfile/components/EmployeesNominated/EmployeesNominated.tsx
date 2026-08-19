import { useIntl } from "react-intl";
import { useState } from "react";
import PlusIcon from "@heroicons/react/20/solid/PlusCircleIcon";
import { endOfDay } from "date-fns/endOfDay";
import { isPast } from "date-fns/isPast";

import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";
import { Link, PreviewList, ToggleGroup } from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { commonMessages } from "@gc-digital-talent/i18n";

import useRoutes from "~/hooks/useRoutes";

import EmployeesNominatedListItem from "./EmployeesNominatedListItem";

export const EmployeesNominated_Fragment = graphql(/* GraphQL */ `
  fragment EmployeesNominated on User {
    talentNominationsAsSubmitter {
      id
      createdAt
      submittedAt
      nominee {
        id
      }
      talentNominationEvent {
        closeDate
      }
      ...EmployeeProfilePreviewListItemTalentNomination
    }
  }
`);

interface EmployeesNominatedProps {
  userQuery: FragmentType<typeof EmployeesNominated_Fragment>;
  showView?: boolean;
}

// a nomination is closed once close date has fully passed
const isNominationClosed = (closeDate: string | null | undefined) =>
  closeDate ? isPast(endOfDay(parseDateTimeUtc(closeDate))) : false;

type NominationView = "open" | "closed";

const EmployeesNominated = ({
  userQuery,
  showView = true,
}: EmployeesNominatedProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const [view, setView] = useState<NominationView>("open");
  const user = getFragment(EmployeesNominated_Fragment, userQuery);

  // Sort nominations
  const nominations = unpackMaybes(user?.talentNominationsAsSubmitter).sort(
    (a, b) => {
      const aDate = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bDate = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bDate - aDate;
    },
  );

  const hasClosedNominations = nominations.some((nomination) =>
    isNominationClosed(nomination.talentNominationEvent?.closeDate),
  );
  const hasOpenNominations = nominations.some(
    (nomination) =>
      !isNominationClosed(nomination.talentNominationEvent?.closeDate),
  );

  const showViewToggle = showView && hasClosedNominations && hasOpenNominations;

  const visibleNominations = showViewToggle
    ? nominations.filter((nomination) =>
        view === "closed"
          ? isNominationClosed(nomination.talentNominationEvent?.closeDate)
          : !isNominationClosed(nomination.talentNominationEvent?.closeDate),
      )
    : nominations;

  return (
    <div className="mt-6.75 flex flex-col gap-y-1.5">
      {showView && (
        <Link
          href={paths.talentManagementEvents()}
          icon={PlusIcon}
          color="primary"
          mode="placeholder"
          block
        >
          {intl.formatMessage({
            defaultMessage: "Browse open talent events",
            id: "QIRY9D",
            description:
              "Link to browse open talent events when an employee has not submitted any nominations",
          })}
        </Link>
      )}
      {nominations.length > 0 && (
        <>
          {showViewToggle && (
            <ToggleGroup.Root
              className="inline-flex items-center gap-x-1.5 border-none p-1.5"
              type="single"
              color="secondary"
              value={view}
              onValueChange={(value) => {
                if (value) setView(value as NominationView);
              }}
              label={
                intl.formatMessage({
                  defaultMessage: "View",
                  id: "N7/ui3",
                  description: "Label for the nominations view toggle",
                }) + intl.formatMessage(commonMessages.dividingColon)
              }
              aria-label={intl.formatMessage({
                defaultMessage: "View nominations",
                id: "EG+jnD",
                description: "Accessible label for the nominations view toggle",
              })}
            >
              <ToggleGroup.Item
                value="open"
                className="cursor-pointer p-1.5 underline outline-none data-[state=on]:font-bold data-[state=on]:no-underline"
              >
                {intl.formatMessage({
                  defaultMessage: "Open nominations",
                  id: "S9eqVM",
                  description: "Toggle option to view open nominations",
                })}
              </ToggleGroup.Item>
              <ToggleGroup.Item
                value="closed"
                className="cursor-pointer p-1.5 underline outline-none data-[state=on]:font-bold data-[state=on]:no-underline"
              >
                {intl.formatMessage({
                  defaultMessage: "Closed nominations",
                  id: "I+Kr8Q",
                  description: "Toggle option to view closed nominations",
                })}
              </ToggleGroup.Item>
            </ToggleGroup.Root>
          )}
          <PreviewList.Root>
            {visibleNominations.map((nomination) => (
              <EmployeesNominatedListItem
                key={nomination.id}
                talentNominationListItemQuery={nomination}
              />
            ))}
          </PreviewList.Root>
        </>
      )}
    </div>
  );
};

export default EmployeesNominated;
