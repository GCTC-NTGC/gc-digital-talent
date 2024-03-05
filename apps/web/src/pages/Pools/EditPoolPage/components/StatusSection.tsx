import * as React from "react";
import { useIntl } from "react-intl";
import FolderOpenIcon from "@heroicons/react/24/outline/FolderOpenIcon";
import LockClosedIcon from "@heroicons/react/24/outline/LockClosedIcon";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";
import MegaphoneIcon from "@heroicons/react/24/outline/MegaphoneIcon";

import { TableOfContents, Well } from "@gc-digital-talent/ui";
import { Pool, PoolStatus, Scalars } from "@gc-digital-talent/graphql";

import { EditPoolSectionMetadata } from "~/types/pool";

import PublishDialog from "./PublishDialog";
import CloseDialog from "./CloseDialog";
import DeleteDialog from "./DeleteDialog";
import DuplicateDialog from "./DuplicateDialog";
import ArchiveDialog from "./ArchiveDialog";
import ExtendDialog from "./ExtendDialog";
import UnarchiveDialog from "./UnarchiveDialog";

interface StatusSectionProps {
  pool: Pool;
  sectionMetadata: EditPoolSectionMetadata;
  onPublish: () => void;
  onDelete: () => void;
  onClose: () => void;
  onExtend: (submitData: Scalars["DateTime"]["output"]) => Promise<void>;
  onArchive: () => void;
  onDuplicate: () => void;
  onUnarchive: () => void;
}

const StatusSection = ({
  pool,
  sectionMetadata,
  onPublish,
  onDelete,
  onDuplicate,
  onClose,
  onExtend,
  onArchive,
  onUnarchive,
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
        {pool.status === PoolStatus.Draft ? (
          <>
            <Well data-h2-flex-grow="base(2)">
              <div
                data-h2-display="base(flex)"
                data-h2-align-items="base(center)"
                data-h2-gap="base(x.5)"
              >
                <PencilIcon
                  style={{
                    width: "1rem",
                    height: "1rem",
                    marginRight: "0.5rem",
                  }}
                />
                <span>
                  {intl.formatMessage({
                    defaultMessage: "<heavyPrimary>Draft</heavyPrimary>",
                    id: "4yBTfg",
                    description: "Status name of a pool in DRAFT status",
                  })}
                </span>
                <span>
                  {intl.formatMessage({
                    defaultMessage: "This pool has not been advertised yet.",
                    id: "kHKFAH",
                    description: "Status description of a pool in DRAFT status",
                  })}
                </span>
              </div>
            </Well>
            <PublishDialog
              closingDate={pool.closingDate}
              onPublish={onPublish}
            />
            <DeleteDialog onDelete={onDelete} />
          </>
        ) : undefined}

        {/* Published status */}
        {pool.status === PoolStatus.Published ? (
          <>
            <div
              data-h2-background-color="base(gray.light)"
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
                  {intl.formatMessage({
                    defaultMessage: "<heavyPrimary>Published</heavyPrimary>",
                    id: "NwpZNj",
                    description: "Status name of a pool in PUBLISHED status",
                  })}
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
            <CloseDialog closingDate={pool.closingDate} onClose={onClose} />
            <ExtendDialog closingDate={pool.closingDate} onExtend={onExtend} />
          </>
        ) : undefined}

        {/* Closed status */}
        {pool.status === PoolStatus.Closed ? (
          <>
            <div
              data-h2-background-color="base(gray.light)"
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
                  {intl.formatMessage({
                    defaultMessage: "<heavyPrimary>Closed</heavyPrimary>",
                    id: "VCl+IZ",
                    description: "Status name of a pool in CLOSED status",
                  })}
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
            <ExtendDialog closingDate={pool.closingDate} onExtend={onExtend} />
            <ArchiveDialog pool={pool} onArchive={onArchive} />
          </>
        ) : undefined}

        {/* Archived status */}
        {pool.status === PoolStatus.Archived ? (
          <>
            <div
              data-h2-background-color="base(gray.light)"
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
                  {intl.formatMessage({
                    defaultMessage: "<heavyPrimary>Archived</heavyPrimary>",
                    id: "+5da+V",
                    description: "Status name of a pool in ARCHIVED status",
                  })}
                </span>
                <span>
                  {intl.formatMessage({
                    defaultMessage:
                      "This pool is no longer advertised or visible to the public.",
                    id: "TtX+o7",
                    description:
                      "Status description of a pool in ARCHIVED status",
                  })}
                </span>
              </div>
            </div>
            <UnarchiveDialog pool={pool} onUnarchive={onUnarchive} />
          </>
        ) : undefined}
      </div>
      <DuplicateDialog onDuplicate={onDuplicate} pool={pool} />
    </TableOfContents.Section>
  );
};

export default StatusSection;
