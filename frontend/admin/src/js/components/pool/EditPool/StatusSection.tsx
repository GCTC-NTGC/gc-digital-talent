import * as React from "react";
import TableOfContents from "@common/components/TableOfContents";
import { useIntl } from "react-intl";
import { Button } from "@common/components";
import { heavyPrimary } from "@common/helpers/format";
import {
  FolderOpenIcon,
  LockClosedIcon,
  PencilIcon,
  MegaphoneIcon,
} from "@heroicons/react/24/outline";
import { PoolAdvertisement, AdvertisementStatus } from "../../../api/generated";
import { SectionMetadata } from "./EditPool";
import PublishDialog from "./PublishDialog";
import CloseDialog from "./CloseDialog";
import DeleteDialog from "./DeleteDialog";
import ArchiveDialog from "./ArchiveDialog";
import ExtendDialog, { type ExtendSubmitData } from "./ExtendDialog";

export type { ExtendSubmitData };

interface StatusSectionProps {
  poolAdvertisement: PoolAdvertisement;
  sectionMetadata: SectionMetadata;
  onPublish: () => void;
  onDelete: () => void;
  onClose: () => void;
  onExtend: (submitData: ExtendSubmitData) => void;
  onArchive: () => void;
}

export const StatusSection = ({
  poolAdvertisement,
  sectionMetadata,
  onPublish,
  onDelete,
  onClose,
  onExtend,
  onArchive,
}: StatusSectionProps): JSX.Element => {
  const intl = useIntl();
  const [isPublishDialogOpen, setPublishDialogOpen] =
    React.useState<boolean>(false);
  const [isCloseDialogOpen, setCloseDialogOpen] =
    React.useState<boolean>(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] =
    React.useState<boolean>(false);
  const [isArchiveDialogOpen, setArchiveDialogOpen] =
    React.useState<boolean>(false);
  const [isExtendDialogOpen, setExtendDialogOpen] =
    React.useState<boolean>(false);

  return (
    <TableOfContents.Section id={sectionMetadata.id}>
      <TableOfContents.Heading>
        <h2 data-h2-margin="base(x3, 0, x1, 0)">{sectionMetadata.title}</h2>
      </TableOfContents.Heading>
      <p data-h2-margin="base(x1, 0)">
        {intl.formatMessage({
          defaultMessage:
            "Use these options to publish or close your advertisement. A live advertisement will allow applicants to submit applications to this pool.",
          id: "y9tCKP",
          description:
            "Helper message for changing the pool advertisement status",
        })}
      </p>

      <div data-h2-display="base(flex)" style={{ gap: "0.5rem" }}>
        {/* Draft status */}
        {poolAdvertisement.advertisementStatus === AdvertisementStatus.Draft ? (
          <>
            <div
              data-h2-background-color="base(dt-gray.light)"
              data-h2-padding="base(x.5)"
              data-h2-radius="base(s)"
              style={{ flexGrow: 2 }} // to push buttons to the right side
            >
              <div
                data-h2-display="base(flex)"
                data-h2-align-items="base(center)"
                style={{ gap: "0.5rem" }}
              >
                <PencilIcon
                  style={{
                    width: "1rem",
                    height: "1rem",
                    marginRight: "0.5rem",
                  }}
                />
                <span>
                  {intl.formatMessage(
                    {
                      defaultMessage: "<heavyPrimary>Draft</heavyPrimary>",
                      id: "4yBTfg",
                      description: "Status name of a pool in DRAFT status",
                    },
                    { heavyPrimary },
                  )}
                </span>
                <span>
                  {intl.formatMessage({
                    defaultMessage: "This pool has not been advertised yet.",
                    id: "kHKFAH",
                    description: "Status description of a pool in DRAFT status",
                  })}
                </span>
              </div>
            </div>
            <Button
              onClick={() => setPublishDialogOpen(true)}
              color="secondary"
              mode="solid"
            >
              {intl.formatMessage({
                defaultMessage: "Publish",
                id: "t4WPUU",
                description: "Text on a button to publish the pool",
              })}
            </Button>
            <Button
              onClick={() => setDeleteDialogOpen(true)}
              color="secondary"
              mode="solid"
            >
              {intl.formatMessage({
                defaultMessage: "Delete",
                id: "IFGKCz",
                description: "Text on a button to delete the pool",
              })}
            </Button>
          </>
        ) : undefined}

        {/* Published status */}
        {poolAdvertisement.advertisementStatus ===
        AdvertisementStatus.Published ? (
          <>
            <div
              data-h2-background-color="base(dt-gray.light)"
              data-h2-padding="base(x.5)"
              data-h2-radius="base(s)"
              style={{ flexGrow: 2 }} // to push buttons to the right side
            >
              <div
                data-h2-display="base(flex)"
                data-h2-align-items="base(center)"
                style={{ gap: "0.5rem" }}
              >
                <MegaphoneIcon
                  style={{
                    width: "1rem",
                    height: "1rem",
                    marginRight: "0.5rem",
                  }}
                />
                <span>
                  {intl.formatMessage(
                    {
                      defaultMessage: "<heavyPrimary>Published</heavyPrimary>",
                      id: "NwpZNj",
                      description: "Status name of a pool in PUBLISHED status",
                    },
                    { heavyPrimary },
                  )}
                </span>
                <span>
                  {intl.formatMessage({
                    defaultMessage:
                      "This pool is currently being advertised and open to receiving new applications.",
                    id: "0qKFaP",
                    description:
                      "Status description of a pool in PUBLISHED status",
                  })}
                </span>
              </div>
            </div>
            <Button
              onClick={() => setCloseDialogOpen(true)}
              color="secondary"
              mode="solid"
            >
              {intl.formatMessage({
                defaultMessage: "Close",
                id: "BhtXXY",
                description: "Text on a button to close the pool",
              })}
            </Button>
            <Button
              onClick={() => setExtendDialogOpen(true)}
              color="secondary"
              mode="solid"
            >
              {intl.formatMessage({
                defaultMessage: "Extend the date",
                id: "jiUwae",
                description:
                  "Text on a button to extend the expiry date the pool",
              })}
            </Button>
          </>
        ) : undefined}

        {/* Expired status */}
        {poolAdvertisement.advertisementStatus ===
        AdvertisementStatus.Expired ? (
          <>
            <div
              data-h2-background-color="base(dt-gray.light)"
              data-h2-padding="base(x.5)"
              data-h2-radius="base(s)"
              style={{ flexGrow: 2 }} // to push buttons to the right side
            >
              <div
                data-h2-display="base(flex)"
                data-h2-align-items="base(center)"
                style={{ gap: "0.5rem" }}
              >
                <LockClosedIcon
                  style={{
                    width: "1rem",
                    height: "1rem",
                    marginRight: "0.5rem",
                  }}
                />
                <span>
                  {intl.formatMessage(
                    {
                      defaultMessage: "<heavyPrimary>Expired</heavyPrimary>",
                      id: "uBA5mM",
                      description: "Status name of a pool in EXPIRED status",
                    },
                    { heavyPrimary },
                  )}
                </span>
                <span>
                  {intl.formatMessage({
                    defaultMessage:
                      "This pool is being advertised but no longer accepting applications.",
                    id: "dG1EJO",
                    description:
                      "Status description of a pool in EXPIRED status",
                  })}
                </span>
              </div>
            </div>
            <Button
              onClick={() => setExtendDialogOpen(true)}
              color="secondary"
              mode="solid"
            >
              {intl.formatMessage({
                defaultMessage: "Extend the date",
                id: "jiUwae",
                description:
                  "Text on a button to extend the expiry date the pool",
              })}
            </Button>
            <Button
              onClick={() => setArchiveDialogOpen(true)}
              color="secondary"
              mode="solid"
              disabled
            >
              {intl.formatMessage({
                defaultMessage: "Archive",
                id: "P8NuMo",
                description: "Text on a button to archive the pool",
              })}
            </Button>
          </>
        ) : undefined}

        {/* Archived status */}
        {poolAdvertisement.advertisementStatus ===
        AdvertisementStatus.Archived ? (
          <div
            data-h2-background-color="base(dt-gray.light)"
            data-h2-padding="base(x.5)"
            data-h2-radius="base(s)"
            style={{ flexGrow: 2 }} // to push buttons to the right side
          >
            <div
              data-h2-display="base(flex)"
              data-h2-align-items="base(center)"
              style={{ gap: "0.5rem" }}
            >
              <FolderOpenIcon
                style={{
                  width: "1rem",
                  height: "1rem",
                  marginRight: "0.5rem",
                }}
              />
              <span>
                {intl.formatMessage(
                  {
                    defaultMessage: "<heavyPrimary>Archived</heavyPrimary>",
                    id: "+5da+V",
                    description: "Status name of a pool in ARCHIVED status",
                  },
                  { heavyPrimary },
                )}
              </span>
              <span>
                {intl.formatMessage({
                  defaultMessage: "This pool is no longer advertised.",
                  id: "HxTuuy",
                  description:
                    "Status description of a pool in ARCHIVED status",
                })}
              </span>
            </div>
          </div>
        ) : undefined}
      </div>
      <PublishDialog
        isOpen={isPublishDialogOpen}
        onDismiss={() => setPublishDialogOpen(false)}
        expiryDate={poolAdvertisement.expiryDate}
        onPublish={onPublish}
      />
      <CloseDialog
        isOpen={isCloseDialogOpen}
        onDismiss={() => setCloseDialogOpen(false)}
        expiryDate={poolAdvertisement.expiryDate}
        onClose={onClose}
      />
      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onDismiss={() => setDeleteDialogOpen(false)}
        onDelete={onDelete}
      />
      <ArchiveDialog
        isOpen={isArchiveDialogOpen}
        onDismiss={() => setArchiveDialogOpen(false)}
        onArchive={onArchive}
      />
      <ExtendDialog
        isOpen={isExtendDialogOpen}
        onDismiss={() => setExtendDialogOpen(false)}
        expiryDate={poolAdvertisement.expiryDate}
        onExtend={onExtend}
      />
    </TableOfContents.Section>
  );
};

export default StatusSection;
