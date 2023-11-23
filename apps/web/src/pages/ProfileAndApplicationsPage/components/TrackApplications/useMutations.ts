import { useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";

import { toast } from "@gc-digital-talent/toast";

import { Scalars, useDeleteApplicationMutation } from "~/api/generated";

const useMutations = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const refresh = () => navigate(0);

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

  return {
    delete: deleteApplication,
  };
};

export default useMutations;
