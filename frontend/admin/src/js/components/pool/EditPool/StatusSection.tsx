import * as React from "react";
import TableOfContents from "@common/components/TableOfContents";
import { useIntl } from "react-intl";
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
  onExtend: (submitData: ExtendSubmitData) => Promise<void>;
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

  return (
    <TableOfContents.Section id={sectionMetadata.id}>
      <TableOfContents.Heading data-h2-margin="base(x3, 0, x1, 0)">
        {sectionMetadata.title}
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
            <PublishDialog
              closingDate={poolAdvertisement.closingDate}
              onPublish={onPublish}
            />
            <DeleteDialog onDelete={onDelete} />
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
            <CloseDialog
              closingDate={poolAdvertisement.closingDate}
              onClose={onClose}
            />
            <ExtendDialog
              closingDate={poolAdvertisement.closingDate}
              onExtend={onExtend}
            />
          </>
        ) : undefined}

        {/* Closed status */}
        {poolAdvertisement.advertisementStatus ===
        AdvertisementStatus.Closed ? (
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
                      defaultMessage: "<heavyPrimary>Closed</heavyPrimary>",
                      id: "VCl+IZ",
                      description: "Status name of a pool in CLOSED status",
                    },
                    { heavyPrimary },
                  )}
                </span>
                <span>
                  {intl.formatMessage({
                    defaultMessage:
                      "This pool is being advertised but no longer accepting applications.",
                    id: "3AmNSJ",
                    description:
                      "Status description of a pool in CLOSED status",
                  })}
                </span>
              </div>
            </div>
            <ExtendDialog
              closingDate={poolAdvertisement.closingDate}
              onExtend={onExtend}
            />
            <ArchiveDialog onArchive={onArchive} />
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
    </TableOfContents.Section>
  );
};

export default StatusSection;
