import { refresh } from "@common/helpers/router";
import { useIntl } from "react-intl";
import { toast } from "@common/components/Toast";
import {
  Scalars,
  useArchiveApplicationMutation,
  useDeleteApplicationMutation,
} from "../../../api/generated";

const useMutations = () => {
  const intl = useIntl();

  const [, executeDeleteMutation] = useDeleteApplicationMutation();

  const deleteApplication = (id: Scalars["ID"]) => {
    executeDeleteMutation({
      id,
    }).then((result) => {
      if (result.data?.deleteApplication) {
        refresh();
        toast.success(
          intl.formatMessage({
            defaultMessage: "Application deleted successfully!",
            id: "xdGPxT",
            description:
              "Message displayed to user after application is deleted successfully.",
          }),
        );
      } else {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: deleting application failed",
            id: "M3c9Yo",
            description:
              "Message displayed to user after application fails to get deleted.",
          }),
        );
      }
    });
  };

  const [, executeArchiveMutation] = useArchiveApplicationMutation();

  const archiveApplication = (id: Scalars["ID"]) => {
    executeArchiveMutation({
      id,
    }).then((result) => {
      if (result.data?.archiveApplication) {
        refresh();
        toast.success(
          intl.formatMessage({
            defaultMessage: "Application archived successfully!",
            id: "KEhCJX",
            description:
              "Message displayed to user after application is archived successfully.",
          }),
        );
      } else {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: archiving application failed",
            id: "i3IjQt",
            description:
              "Message displayed to user after application fails to get archived.",
          }),
        );
      }
    });
  };

  return {
    delete: deleteApplication,
    archive: archiveApplication,
  };
};

export default useMutations;
