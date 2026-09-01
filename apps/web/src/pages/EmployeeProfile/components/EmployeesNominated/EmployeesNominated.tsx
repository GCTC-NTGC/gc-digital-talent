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
import { MAX_DATE } from "@gc-digital-talent/date-helpers/const";

import useRoutes from "~/hooks/useRoutes";

import EmployeesNominatedListItem from "./EmployeesNominatedListItem";

export const EmployeesNominated_Fragment = graphql(/* GraphQL */ `
  fragment EmployeesNominated on User {
    talentNominationsAsSubmitter {
      id
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
      // sort drafts before submitted nominations
      const submittedOrder = (a.submittedAt ? 1 : 0) - (b.submittedAt ? 1 : 0);
      if (submittedOrder !== 0) return submittedOrder;

      // Submitted nominations most recent first
      if (a.submittedAt && b.submittedAt) {
        return (
          parseDateTimeUtc(b.submittedAt).getTime() -
          parseDateTimeUtc(a.submittedAt).getTime()
        );
      }

      // Drafts sort by close date, closest to closing first
      const aCloseDate = a.talentNominationEvent?.closeDate
        ? parseDateTimeUtc(a.talentNominationEvent.closeDate).getTime()
        : MAX_DATE.getTime();
      const bCloseDate = b.talentNominationEvent?.closeDate
        ? parseDateTimeUtc(b.talentNominationEvent.closeDate).getTime()
        : MAX_DATE.getTime();
      return aCloseDate - bCloseDate;
    },
  );

  const hasClosedNominations = nominations.some((nomination) =>
    isNominationClosed(nomination.talentNominationEvent?.closeDate),
  );
  const hasOpenNominations = nominations.some(
    (nomination) =>
      !isNominationClosed(nomination.talentNominationEvent?.closeDate),
  );

  const showViewToggle = hasClosedNominations && hasOpenNominations;

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
          className="mb-3"
        >
          {intl.formatMessage({
            defaultMessage: "Browse active talent events",
            id: "ENdwj1",
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
                  defaultMessage: "View by",
                  id: "MB3J/o",
                  description: "Label for the nominations view toggle",
                }) + intl.formatMessage(commonMessages.dividingColon)
              }
            >
              <ToggleGroup.Item
                value="open"
                className="cursor-pointer p-1.5 underline outline-none data-[state=on]:font-bold data-[state=on]:no-underline"
              >
                {intl.formatMessage({
                  defaultMessage: "Active events",
                  id: "9SO6OE",
                  description: "Title for active events section",
                })}
              </ToggleGroup.Item>
              <ToggleGroup.Item
                value="closed"
                className="cursor-pointer p-1.5 underline outline-none data-[state=on]:font-bold data-[state=on]:no-underline"
              >
                {intl.formatMessage({
                  defaultMessage: "Past events",
                  id: "ixjaCE",
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
