import { useState, type ChangeEvent } from "react";
import { useIntl } from "react-intl";
import { useQuery, type OperationContext } from "urql";
import { FormProvider, useForm } from "react-hook-form";
import { tv } from "tailwind-variants";
import EllipsisHorizontalIcon from "@heroicons/react/24/outline/EllipsisHorizontalIcon";
import ArrowDownTrayIcon from "@heroicons/react/24/outline/ArrowDownTrayIcon";
import ChevronDownIcon from "@heroicons/react/24/outline/ChevronDownIcon";

import {
  graphql,
  type TalentRequestTrackedUserFilterInput,
  TalentRequestTrackedUserStatus,
} from "@gc-digital-talent/graphql";
import { CheckButton, Input, Select } from "@gc-digital-talent/forms";
import {
  Button,
  DropdownMenu,
  IconButton,
  Loading,
  Notice,
  Tooltip,
} from "@gc-digital-talent/ui";
import {
  commonMessages,
  ENUM_SORT_ORDER,
  narrowEnumType,
  sortLocalizedEnumOptions,
  uiMessages,
} from "@gc-digital-talent/i18n";
import {
  notEmpty,
  unpackMaybes,
  uniqueItems,
} from "@gc-digital-talent/helpers";

import adminMessages from "~/messages/adminMessages";
import talentRequestMessages from "~/messages/talentRequestMessages";
import tableMessages from "~/components/Table/tableMessages";
import Pagination from "~/components/Pagination";
import useSelectedRows from "~/hooks/useSelectedRows";
import useUserDownloads from "~/hooks/useUserDownloads";

import type { TalentRequestReferralDialogOptions } from "../TalentRequestReferralDialogs/ReferralFormFields";
import Inbox from "./Inbox";
import TrackedUserListItem from "./TrackedUserListItem";
import ReferTrackedUsersDialog from "./dialogs/ReferTrackedUsersDialog";
import NotReferTrackedUsersDialog from "./dialogs/NotReferTrackedUsersDialog";
import NotSelectTrackedUsersDialog from "./dialogs/NotSelectTrackedUsersDialog";
import { statusIcons } from "./utils";

const TalentRequestTrackedUsersInbox_Query = graphql(/* GraphQL */ `
  query TalentRequestTrackedUsersInbox(
    $talentRequestId: UUID!
    $where: TalentRequestTrackedUserFilterInput
    $first: Int
    $page: Int
  ) {
    statuses: localizedEnumOptions(enumName: "TalentRequestTrackedUserStatus") {
      ... on LocalizedTalentRequestTrackedUserStatus {
        value
        label {
          localized
        }
      }
    }
    talentRequestTrackedUsers(
      talentRequestId: $talentRequestId
      where: $where
      first: $first
      page: $page
    ) {
      data {
        id
        user {
          id
        }
        ...TalentRequestTrackedUserInboxItem
      }
      paginatorInfo {
        total
        lastPage
      }
    }
  }
`);

const trackedUsersContext: Partial<OperationContext> = {
  additionalTypenames: ["TalentRequestTrackedUser"],
};

const selectionCounter = tv({
  base: "rounded-md px-2 py-0.5 text-sm font-medium",
  variants: {
    hasSelection: {
      true: "bg-primary-500 text-white dark:bg-primary-300 dark:text-black",
      false: "bg-gray-300 text-white dark:bg-gray-700",
    },
  },
});

type DialogKind = "refer" | "notRefer" | "notSelect";

interface FilterFormValues {
  search: string;
  status?: TalentRequestTrackedUserStatus;
}

interface TalentRequestTrackedUsersInboxProps {
  talentRequestId: string;
  optionsQuery?: TalentRequestReferralDialogOptions;
  requestedSkillsCount: number;
}

const TalentRequestTrackedUsersInbox = ({
  talentRequestId,
  requestedSkillsCount,
  optionsQuery,
}: TalentRequestTrackedUsersInboxProps) => {
  const intl = useIntl();
  const methods = useForm<FilterFormValues>({
    defaultValues: {
      search: "",
      status: TalentRequestTrackedUserStatus.Referred,
    },
  });
  const selectedStatus = methods.watch("status");
  const { selectedRows, setSelectedRows } = useSelectedRows<string>([]);
  const { downloadDoc, downloadZip, downloadExcel, downloadTrackedUsersExcel } =
    useUserDownloads();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState<DialogKind | null>(null);

  const statuses = Object.values(TalentRequestTrackedUserStatus).filter(
    (value: TalentRequestTrackedUserStatus) => value === selectedStatus,
  );
  const where: TalentRequestTrackedUserFilterInput = {
    statuses: statuses.length ? statuses : undefined,
    generalSearch: searchTerm.length ? searchTerm : undefined,
  };

  const [{ data, fetching }] = useQuery({
    query: TalentRequestTrackedUsersInbox_Query,
    variables: { talentRequestId, where, first: pageSize, page },
    context: trackedUsersContext,
  });

  const rows = unpackMaybes(data?.talentRequestTrackedUsers.data);
  const paginator = data?.talentRequestTrackedUsers.paginatorInfo;
  const statusOptions = sortLocalizedEnumOptions(
    ENUM_SORT_ORDER.TRACKED_USER_STATUS,
    narrowEnumType(
      unpackMaybes(data?.statuses),
      "TalentRequestTrackedUserStatus",
    ),
  ).map((option) => ({
    value: option.value,
    label:
      option.label?.localized ??
      intl.formatMessage(commonMessages.notAvailable),
  }));

  const selectedUserIds = uniqueItems(
    selectedRows
      .map((rowId) => rows.find((row) => row.id === rowId)?.user.id)
      .filter(notEmpty),
  );
  const allSelected = rows.length > 0 && selectedRows.length === rows.length;
  const hasSelection = selectedRows.length > 0;

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPage(1);
    setSearchTerm(event.target.value);
  };

  const handleToggleAll = (checked: boolean) => {
    setSelectedRows(checked ? rows.map((row) => row.id) : []);
  };

  const handleRowCheckedChange = (rowId: string) => (checked: boolean) => {
    setSelectedRows(
      checked
        ? [...selectedRows, rowId]
        : selectedRows.filter((id) => id !== rowId),
    );
  };

  const handleDownloadAll = () => {
    downloadTrackedUsersExcel({ talentRequestId, where });
  };

  const handleDownloadSpreadsheet = () => {
    downloadExcel({ ids: selectedUserIds });
  };

  const handleDownloadDocument = (anonymous: boolean) => {
    if (selectedUserIds.length === 1) {
      downloadDoc({ id: selectedUserIds[0], anonymous });
    } else {
      downloadZip({ ids: selectedUserIds, anonymous });
    }
  };

  const handleMarkAllAs = (dialogKind: DialogKind) => {
    handleToggleAll(true);
    setOpenDialog(dialogKind);
  };

  const handleDialogCompleted = () => {
    setSelectedRows([]);
    setOpenDialog(null);
  };

  const handleDialogOpenChange = (isOpen: boolean) => {
    if (!isOpen) setOpenDialog(null);
  };

  const isEmpty = !fetching && rows.length === 0;

  return (
    <div className="-mx-6 -mt-3 -mb-6">
      <Inbox.Toolbar>
        <FormProvider {...methods}>
          <Input
            type="search"
            id="search"
            name="search"
            label={intl.formatMessage(adminMessages.searchByKeyword)}
            onChange={handleSearchChange}
          />
          <Select
            id="status"
            name="status"
            doNotSort
            nullSelection={intl.formatMessage(uiMessages.nullSelectionOption)}
            label={intl.formatMessage({
              defaultMessage: "View by status",
              id: "iLlbnx",
              description:
                "Label for the status filter on the tracked users inbox",
            })}
            options={statusOptions}
          />
        </FormProvider>
      </Inbox.Toolbar>

      <Inbox.Actions>
        <CheckButton
          checked={allSelected}
          indeterminate={hasSelection && !allSelected}
          onToggle={() => handleToggleAll(!allSelected)}
          label={intl.formatMessage(tableMessages.selectAll)}
        />
        <span className={selectionCounter({ hasSelection })}>
          <span aria-hidden>{selectedRows.length}</span>
          <span className="sr-only">
            {intl.formatMessage(
              {
                defaultMessage:
                  "{count, plural, =0 {# selected} one {# selected} other {# selected}}",
                id: "0oeDL5",
                description: "Count of selected tracked users in the inbox",
              },
              { count: selectedRows.length },
            )}
          </span>
        </span>

        {hasSelection ? (
          <>
            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger
                  render={
                    <IconButton
                      color="black"
                      icon={
                        statusIcons.outline[
                          TalentRequestTrackedUserStatus.Referred
                        ]
                      }
                      label={intl.formatMessage(talentRequestMessages.markAs, {
                        status: intl.formatMessage(
                          talentRequestMessages.referred,
                        ),
                      })}
                      onClick={() => setOpenDialog("refer")}
                    />
                  }
                />
                <Tooltip.Popup>
                  {intl.formatMessage(talentRequestMessages.markAs, {
                    status: intl.formatMessage(talentRequestMessages.referred),
                  })}
                </Tooltip.Popup>
              </Tooltip.Root>
              <Tooltip.Root>
                <Tooltip.Trigger
                  render={
                    <IconButton
                      color="black"
                      icon={
                        statusIcons.outline[
                          TalentRequestTrackedUserStatus.NotReferred
                        ]
                      }
                      label={intl.formatMessage(talentRequestMessages.markAs, {
                        status: intl.formatMessage(commonMessages.notReferred),
                      })}
                      onClick={() => setOpenDialog("notRefer")}
                    />
                  }
                />
                <Tooltip.Popup>
                  {intl.formatMessage(talentRequestMessages.markAs, {
                    status: intl.formatMessage(commonMessages.notReferred),
                  })}
                </Tooltip.Popup>
              </Tooltip.Root>
              <Tooltip.Root>
                <Tooltip.Trigger
                  render={
                    <IconButton
                      color="black"
                      icon={
                        statusIcons.outline[
                          TalentRequestTrackedUserStatus.NotSelected
                        ]
                      }
                      label={intl.formatMessage(talentRequestMessages.markAs, {
                        status: intl.formatMessage(commonMessages.notSelected),
                      })}
                      onClick={() => setOpenDialog("notSelect")}
                    />
                  }
                />
                <Tooltip.Popup>
                  {intl.formatMessage(talentRequestMessages.markAs, {
                    status: intl.formatMessage(commonMessages.notSelected),
                  })}
                </Tooltip.Popup>
              </Tooltip.Root>
            </Tooltip.Provider>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger
                render={
                  <Button
                    mode="inline"
                    color="black"
                    icon={ArrowDownTrayIcon}
                    utilityIcon={ChevronDownIcon}
                  >
                    <span className="sr-only">
                      {intl.formatMessage(commonMessages.download)}
                    </span>
                  </Button>
                }
              />
              <DropdownMenu.Popup positionerProps={{ align: "start" }}>
                <DropdownMenu.Item
                  onClick={() => handleDownloadDocument(false)}
                >
                  {intl.formatMessage({
                    defaultMessage: "Download full profiles (.docx)",
                    id: "KF5u2L",
                    description:
                      "Button label for downloading selected user profiles",
                  })}
                </DropdownMenu.Item>
                <DropdownMenu.Item onClick={() => handleDownloadDocument(true)}>
                  {intl.formatMessage({
                    defaultMessage:
                      "Download profiles without contact information (.docx)",
                    id: "EYqGpP",
                    description:
                      "Button label for downloading anonymized selected user profiles",
                  })}
                </DropdownMenu.Item>
                <DropdownMenu.Item onClick={handleDownloadSpreadsheet}>
                  {intl.formatMessage({
                    defaultMessage: "Download as spreadsheet (.xlsx)",
                    id: "0YApeN",
                    description:
                      "Menu option to download selected tracked users as a spreadsheet",
                  })}
                </DropdownMenu.Item>
              </DropdownMenu.Popup>
            </DropdownMenu.Root>
          </>
        ) : (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger
              render={
                <IconButton
                  color="black"
                  icon={EllipsisHorizontalIcon}
                  label={intl.formatMessage(tableMessages.actions)}
                />
              }
            />
            <DropdownMenu.Popup positionerProps={{ align: "start" }}>
              <DropdownMenu.Item onClick={() => handleMarkAllAs("notSelect")}>
                {intl.formatMessage(talentRequestMessages.markAllAs, {
                  status: intl.formatMessage(commonMessages.notSelected),
                })}
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={handleDownloadAll}>
                {intl.formatMessage({
                  defaultMessage: "Download all as spreadsheet (.xlsx)",
                  id: "2Ttne4",
                  description:
                    "Menu option to download all tracked users as a spreadsheet",
                })}
              </DropdownMenu.Item>
            </DropdownMenu.Popup>
          </DropdownMenu.Root>
        )}
      </Inbox.Actions>

      {fetching && (
        <Loading inline live="polite">
          {intl.formatMessage(commonMessages.loading)}
        </Loading>
      )}

      {isEmpty && (
        <Notice.Root className="m-6">
          <Notice.Title>
            {intl.formatMessage(talentRequestMessages.trackedUsersNullTitle)}
          </Notice.Title>
          <Notice.Content>
            {intl.formatMessage(
              talentRequestMessages.trackedUsersNullDescription,
            )}
          </Notice.Content>
        </Notice.Root>
      )}

      {!fetching && !isEmpty && (
        <Inbox.List>
          {rows.map((row) => (
            <TrackedUserListItem
              key={row.id}
              query={row}
              requestedSkillsCount={requestedSkillsCount}
              optionsQuery={optionsQuery}
              checked={selectedRows.includes(row.id)}
              onCheckedChange={handleRowCheckedChange(row.id)}
              onCompleted={handleDialogCompleted}
            />
          ))}
        </Inbox.List>
      )}

      <Inbox.Footer>
        <Pagination
          color="black"
          ariaLabel={intl.formatMessage(
            talentRequestMessages.candidateTracking,
          )}
          currentPage={page}
          pageSize={pageSize}
          pageSizes={[10, 20, 50]}
          totalCount={paginator?.total ?? 0}
          totalPages={paginator?.lastPage ?? 1}
          onCurrentPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      </Inbox.Footer>

      <ReferTrackedUsersDialog
        open={openDialog === "refer"}
        onOpenChange={handleDialogOpenChange}
        selectedIds={selectedRows}
        onCompleted={handleDialogCompleted}
      />
      <NotReferTrackedUsersDialog
        open={openDialog === "notRefer"}
        onOpenChange={handleDialogOpenChange}
        selectedIds={selectedRows}
        onCompleted={handleDialogCompleted}
      />
      <NotSelectTrackedUsersDialog
        open={openDialog === "notSelect"}
        onOpenChange={handleDialogOpenChange}
        selectedIds={selectedRows}
        onCompleted={handleDialogCompleted}
      />
    </div>
  );
};

export default TalentRequestTrackedUsersInbox;
