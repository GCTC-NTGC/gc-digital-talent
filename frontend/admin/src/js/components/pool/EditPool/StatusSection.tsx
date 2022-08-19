import * as React from "react";
import TableOfContents from "@common/components/TableOfContents";
import { useIntl } from "react-intl";
import { Button } from "@common/components";
import { heavyPrimary } from "@common/helpers/format";
import {
  FolderOpenIcon,
  LockClosedIcon,
  PencilIcon,
  SpeakerphoneIcon,
} from "@heroicons/react/outline";
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
        <h2 data-h2-margin="b(top, l)" data-h2-font-size="b(p)">
          {sectionMetadata.title}
        </h2>
      </TableOfContents.Heading>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "Use these options to publish or close your advertisement. A live advertisement will allow applicants to submit applications to this pool.",
          description:
            "Helper message for changing the pool advertisement status",
        })}
      </p>

      <div data-h2-display="b(flex)" style={{ gap: "0.5rem" }}>
        {/* Draft status */}
        {poolAdvertisement.advertisementStatus === AdvertisementStatus.Draft ? (
          <>
            <div
              data-h2-bg-color="b(lightgray)"
              data-h2-padding="b(all, xs)"
              data-h2-radius="b(s)"
              style={{ flexGrow: 2 }} // to push buttons to the right side
            >
              <div
                data-h2-display="b(flex)"
                data-h2-align-items="b(center)"
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
                      description: "Status name of a pool in DRAFT status",
                    },
                    { heavyPrimary },
                  )}
                </span>
                <span>
                  {intl.formatMessage({
                    defaultMessage: "This pool has not been advertised yet.",
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
              data-h2-bg-color="b(lightgray)"
              data-h2-padding="b(all, xs)"
              data-h2-radius="b(s)"
              style={{ flexGrow: 2 }} // to push buttons to the right side
            >
              <div
                data-h2-display="b(flex)"
                data-h2-align-items="b(center)"
                style={{ gap: "0.5rem" }}
              >
                <SpeakerphoneIcon
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
                      description: "Status name of a pool in PUBLISHED status",
                    },
                    { heavyPrimary },
                  )}
                </span>
                <span>
                  {intl.formatMessage({
                    defaultMessage:
                      "This pool is currently being advertised and open to receiving new applications.",
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
              data-h2-bg-color="b(lightgray)"
              data-h2-padding="b(all, xs)"
              data-h2-radius="b(s)"
              style={{ flexGrow: 2 }} // to push buttons to the right side
            >
              <div
                data-h2-display="b(flex)"
                data-h2-align-items="b(center)"
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
                      description: "Status name of a pool in EXPIRED status",
                    },
                    { heavyPrimary },
                  )}
                </span>
                <span>
                  {intl.formatMessage({
                    defaultMessage:
                      "This pool is being advertised but no longer accepting applications.",
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
                description: "Text on a button to archive the pool",
              })}
            </Button>
          </>
        ) : undefined}

        {/* Archived status */}
        {poolAdvertisement.advertisementStatus ===
        AdvertisementStatus.Archived ? (
          <div
            data-h2-bg-color="b(lightgray)"
            data-h2-padding="b(all, xs)"
            data-h2-radius="b(s)"
            style={{ flexGrow: 2 }} // to push buttons to the right side
          >
            <div
              data-h2-display="b(flex)"
              data-h2-align-items="b(center)"
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
                    description: "Status name of a pool in ARCHIVED status",
                  },
                  { heavyPrimary },
                )}
              </span>
              <span>
                {intl.formatMessage({
                  defaultMessage: "This pool is no longer advertised.",
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
