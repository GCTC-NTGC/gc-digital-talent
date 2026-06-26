import { useState, type ChangeEvent } from "react";
import { useIntl } from "react-intl";
import { useQuery, type OperationContext } from "urql";
import { FormProvider, useForm } from "react-hook-form";
import { tv } from "tailwind-variants";
import EllipsisVerticalIcon from "@heroicons/react/16/solid/EllipsisVerticalIcon";
import ArrowDownTrayIcon from "@heroicons/react/16/solid/ArrowDownTrayIcon";
import PaperAirplaneIcon from "@heroicons/react/16/solid/PaperAirplaneIcon";
import ArchiveBoxIcon from "@heroicons/react/16/solid/ArchiveBoxIcon";
import CheckIcon from "@heroicons/react/16/solid/CheckIcon";
import XMarkIcon from "@heroicons/react/16/solid/XMarkIcon";

import {
  graphql,
  type TalentRequestTrackedUserFilterInput,
  TalentRequestTrackedUserStatus,
} from "@gc-digital-talent/graphql";
import { CheckButton, Input, Select } from "@gc-digital-talent/forms";
import {
  DropdownMenu,
  IconButton,
  IconLabel,
  Loading,
  Notice,
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
import Pagination from "~/components/Pagination";
import useSelectedRows from "~/hooks/useSelectedRows";
import useUserDownloads from "~/hooks/useUserDownloads";

import type { TalentRequestReferralDialogOptions } from "../TalentRequestReferralDialogs/ReferralFormFields";
import Inbox from "./Inbox";
import TrackedUserListItem from "./TrackedUserListItem";
import ReferTrackedUsersDialog from "./dialogs/ReferTrackedUsersDialog";
import NotReferTrackedUsersDialog from "./dialogs/NotReferTrackedUsersDialog";
import SelectTrackedUsersDialog from "./dialogs/SelectTrackedUsersDialog";
import NotSelectTrackedUsersDialog from "./dialogs/NotSelectTrackedUsersDialog";

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

type DialogKind = "refer" | "notRefer" | "select" | "notSelect";

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
    label: option.label?.localized ?? intl.formatMessage(commonMessages.notAvailable),
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

  const handleDownloadDocument = () => {
    if (selectedUserIds.length === 1) {
      downloadDoc({ id: selectedUserIds[0], anonymous: false });
    } else {
      downloadZip({ ids: selectedUserIds, anonymous: false });
    }
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
          label={intl.formatMessage({
            defaultMessage: "Select all",
            id: "gh6ehW",
            description:
              "Checkbox label to select all tracked users in the inbox",
          })}
        />
        <span className={selectionCounter({ hasSelection })}>
          <span aria-hidden>{selectedRows.length}</span>
          <span className="sr-only">
            {intl.formatMessage(
              {
                defaultMessage: "{count} selected",
                id: "/aTQpq",
                description: "Count of selected tracked users in the inbox",
              },
              { count: selectedRows.length },
            )}
          </span>
        </span>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger
            render={
              <IconButton
                color="black"
                icon={EllipsisVerticalIcon}
                label={intl.formatMessage({
                  defaultMessage: "Actions",
                  id: "o2VwGs",
                  description:
                    "Button to open bulk actions for selected tracked users",
                })}
              />
            }
          />
          <DropdownMenu.Popup positionerProps={{ align: "start" }}>
            <DropdownMenu.Item onClick={() => setOpenDialog("refer")}>
              <IconLabel
                icon={PaperAirplaneIcon}
                label={intl.formatMessage(talentRequestMessages.changeStatus, {
                  status: intl.formatMessage(talentRequestMessages.referred),
                })}
              />
            </DropdownMenu.Item>
            <DropdownMenu.Item onClick={() => setOpenDialog("notRefer")}>
              <IconLabel
                icon={ArchiveBoxIcon}
                label={intl.formatMessage(talentRequestMessages.changeStatus, {
                  status: intl.formatMessage(commonMessages.notReferred),
                })}
              />
            </DropdownMenu.Item>
            <DropdownMenu.Item onClick={() => setOpenDialog("select")}>
              <IconLabel
                icon={CheckIcon}
                label={intl.formatMessage(talentRequestMessages.changeStatus, {
                  status: intl.formatMessage(commonMessages.selected),
                })}
              />
            </DropdownMenu.Item>
            <DropdownMenu.Item onClick={() => setOpenDialog("notSelect")}>
              <IconLabel
                icon={XMarkIcon}
                label={intl.formatMessage(talentRequestMessages.changeStatus, {
                  status: intl.formatMessage(commonMessages.notSelected),
                })}
              />
            </DropdownMenu.Item>
          </DropdownMenu.Popup>
        </DropdownMenu.Root>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger
            render={
              <IconButton
                color="black"
                icon={ArrowDownTrayIcon}
                label={intl.formatMessage({
                  defaultMessage: "Download",
                  id: "lzFj9M",
                  description:
                    "Button to open download options for selected tracked users",
                })}
              />
            }
          />
          <DropdownMenu.Popup positionerProps={{ align: "start" }}>
            <DropdownMenu.Item onClick={handleDownloadAll}>
              {intl.formatMessage({
                defaultMessage: "Download entire dataset",
                id: "Ij9kxd",
                description:
                  "Menu option to download all tracked users as a spreadsheet",
              })}
            </DropdownMenu.Item>
            <DropdownMenu.Item onClick={handleDownloadSpreadsheet}>
              {intl.formatMessage({
                defaultMessage: "Download selected as a spreadsheet (.xlsx)",
                id: "UE5Qag",
                description:
                  "Menu option to download selected tracked users as a spreadsheet",
              })}
            </DropdownMenu.Item>
            <DropdownMenu.Item onClick={handleDownloadDocument}>
              {intl.formatMessage({
                defaultMessage: "Download selected as a document (.docx)",
                id: "g0nMAt",
                description:
                  "Menu option to download selected tracked users as a document",
              })}
            </DropdownMenu.Item>
          </DropdownMenu.Popup>
        </DropdownMenu.Root>
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
      <SelectTrackedUsersDialog
        open={openDialog === "select"}
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
