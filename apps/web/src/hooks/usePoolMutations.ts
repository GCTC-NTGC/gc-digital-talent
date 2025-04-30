import { useNavigate } from "react-router";
import { useIntl } from "react-intl";
import { useMutation } from "urql";

import { toast } from "@gc-digital-talent/toast";
import {
  graphql,
  UpdatePoolInput,
  Scalars,
  CreatePoolSkillInput,
  UpdatePoolSkillInput,
  UpdatePublishedPoolInput,
} from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";

const UpdatePool_Mutation = graphql(/* GraphQL */ `
  mutation UpdatePool($id: ID!, $pool: UpdatePoolInput!) {
    updatePool(id: $id, pool: $pool) {
      id
      generalQuestions {
        id
      }
    }
  }
`);

const UpdatePublishedPool_Mutation = graphql(/* GraphQL */ `
  mutation UpdatePublishedPool($id: ID!, $pool: UpdatePublishedPoolInput!) {
    updatePublishedPool(id: $id, pool: $pool) {
      id
    }
  }
`);

const ExtendPool_Mutation = graphql(/* GraphQL */ `
  mutation ExtendPool($id: ID!, $closingDate: DateTime!) {
    changePoolClosingDate(id: $id, closingDate: $closingDate) {
      id
    }
  }
`);

const PublishPool_Mutation = graphql(/* GraphQL */ `
  mutation PublishPool($id: ID!) {
    publishPool(id: $id) {
      id
      publishedAt
    }
  }
`);

const ClosePool_Mutation = graphql(/* GraphQL */ `
  mutation ClosePool($id: ID!, $reason: String!) {
    closePool(id: $id, reason: $reason) {
      id
      closingDate
    }
  }
`);

const DeletePool_Mutation = graphql(/* GraphQL */ `
  mutation DeletePool($id: ID!) {
    deletePool(id: $id) {
      id
    }
  }
`);

const DuplicatePool_Mutation = graphql(/* GraphQL */ `
  mutation DuplicatePool($id: ID!, $pool: DuplicatePoolInput!) {
    duplicatePool(id: $id, pool: $pool) {
      id
    }
  }
`);

const ArchivePool_Mutation = graphql(/* GraphQL */ `
  mutation ArchivePool($id: ID!) {
    archivePool(id: $id) {
      id
    }
  }
`);

const UnarchivePool_Mutation = graphql(/* GraphQL */ `
  mutation UnarchivePool($id: ID!) {
    unarchivePool(id: $id) {
      id
    }
  }
`);

const CreatePoolSkill_Mutation = graphql(/* GraphQL */ `
  mutation CreatePoolSkill($poolSkill: CreatePoolSkillInput!) {
    createPoolSkill(poolSkill: $poolSkill) {
      id
    }
  }
`);

const UpdatePoolSkill_Mutation = graphql(/* GraphQL */ `
  mutation UpdatePoolSkill($id: ID!, $poolSkill: UpdatePoolSkillInput!) {
    updatePoolSkill(id: $id, poolSkill: $poolSkill) {
      id
    }
  }
`);

const DeletePoolSkill_Mutation = graphql(/* GraphQL */ `
  mutation DeletePoolSkill($id: ID!) {
    deletePoolSkill(id: $id) {
      id
    }
  }
`);

const usePoolMutations = (returnPath?: string) => {
  const intl = useIntl();
  const paths = useRoutes();
  const navigate = useNavigate();

  const navigateBack = async () =>
    await navigate(returnPath ?? paths.poolTable());

  const [{ fetching: updateFetching }, executeUpdateMutation] =
    useMutation(UpdatePool_Mutation);
  const [
    { fetching: updatePublishedFetching },
    executeUpdatePublishedMutation,
  ] = useMutation(UpdatePublishedPool_Mutation);

  const handleUpdateError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage: "Error: process update failed",
        id: "xnlBSd",
        description:
          "Message displayed to user after pool fails to get updated.",
      }),
    );

    return Promise.reject(new Error());
  };

  const update = async (id: string, pool: UpdatePoolInput) => {
    return executeUpdateMutation({ id, pool })
      .then((result) => {
        if (result.data?.updatePool) {
          toast.success(
            intl.formatMessage({
              defaultMessage: "Process updated successfully!",
              id: "/ZlzNi",
              description: "Message displayed to user after pool is updated",
            }),
          );

          return Promise.resolve();
        }
        return handleUpdateError();
      })
      .catch(handleUpdateError);
  };

  const updatePublished = async (
    id: string,
    pool: UpdatePublishedPoolInput,
  ) => {
    return executeUpdatePublishedMutation({ id, pool })
      .then((result) => {
        if (result.data?.updatePublishedPool) {
          toast.success(
            intl.formatMessage({
              defaultMessage: "Process updated successfully!",
              id: "/ZlzNi",
              description: "Message displayed to user after pool is updated",
            }),
          );

          return Promise.resolve();
        }
        return handleUpdateError();
      })
      .catch(handleUpdateError);
  };

  const [{ fetching: extendFetching }, executeExtendMutation] =
    useMutation(ExtendPool_Mutation);

  const extend = async (
    id: string,
    closingDate: Scalars["DateTime"]["input"],
  ) => {
    await executeExtendMutation({ id, closingDate })
      .then((result) => {
        if (result.data?.changePoolClosingDate) {
          toast.success(
            intl.formatMessage({
              defaultMessage: "Process updated successfully!",
              id: "/ZlzNi",
              description: "Message displayed to user after pool is updated",
            }),
          );
        } else {
          void handleUpdateError();
        }
      })
      .catch(handleUpdateError);
  };

  const [{ fetching: publishFetching }, executePublishMutation] =
    useMutation(PublishPool_Mutation);

  const handlePublishError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage: "Error: process publishing failed",
        id: "RHwGy2",
        description:
          "Message displayed to user after pool fails to get publish.",
      }),
    );
  };

  const publish = async (id: string) => {
    await executePublishMutation({ id })
      .then(async (result) => {
        if (result.data?.publishPool) {
          await navigateBack();
          toast.success(
            intl.formatMessage({
              defaultMessage: "Process published successfully!",
              id: "RauOed",
              description: "Message displayed to user after pool is published",
            }),
          );
        } else {
          handlePublishError();
        }
      })
      .catch(handlePublishError);
  };

  const [{ fetching: closeFetching }, executeCloseMutation] =
    useMutation(ClosePool_Mutation);

  const handleCloseError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage: "Error: closing process failed",
        id: "Et46bc",
        description:
          "Message displayed to user after pool fails to get closed.",
      }),
    );
  };

  const close = async (id: string, reason: string) => {
    await executeCloseMutation({ id, reason })
      .then(async (result) => {
        if (result.data?.closePool) {
          await navigateBack();
          toast.success(
            intl.formatMessage({
              defaultMessage: "Process closed successfully!",
              id: "bSFeLf",
              description: "Message displayed to user after pool is closed",
            }),
          );
        } else {
          handleCloseError();
        }
      })
      .catch(handleCloseError);
  };

  const [{ fetching: deleteFetching }, executeDeleteMutation] =
    useMutation(DeletePool_Mutation);

  const handleDeleteError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage: "Error: deleting process failed",
        id: "idv7rY",
        description:
          "Message displayed to user after pool fails to get deleted.",
      }),
    );
  };

  const deletePool = async (id: string) => {
    await executeDeleteMutation({ id })
      .then(async (result) => {
        if (result.data?.deletePool) {
          await navigateBack();
          toast.success(
            intl.formatMessage({
              defaultMessage: "Process deleted successfully!",
              id: "LVQu1R",
              description: "Message displayed to user after pool is deleted",
            }),
          );
        } else {
          handleDeleteError();
        }
      })
      .catch(handleDeleteError);
  };

  const [{ fetching: archiveFetching }, executeArchiveMutation] =
    useMutation(ArchivePool_Mutation);

  const handleArchiveError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage: "Error: archiving process failed",
        id: "qhws/V",
        description:
          "Message displayed to user after pool fails to get archived.",
      }),
    );
  };

  const archivePool = async (id: string) => {
    await executeArchiveMutation({ id })
      .then(async (result) => {
        if (result.data?.archivePool) {
          await navigateBack();
          toast.success(
            intl.formatMessage({
              defaultMessage: "Process archived successfully!",
              id: "s3JBjM",
              description: "Message displayed to user after pool is archived",
            }),
          );
        } else {
          handleArchiveError();
        }
      })
      .catch(handleArchiveError);
  };

  const [{ fetching: duplicateFetching }, executeDuplicateMutation] =
    useMutation(DuplicatePool_Mutation);

  const handleDuplicateError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage:
          "Error: Something went wrong, please try again in a minute or contact your administrator.",
        id: "hHYn/8",
        description:
          "Message displayed to user after pool fails to get duplicated.",
      }),
    );
  };

  const duplicatePool = async (
    id: string,
    teamId: string,
    departmentId: string | undefined,
  ) => {
    await executeDuplicateMutation({ id, teamId, pool: { departmentId } })
      .then(async (result) => {
        if (result.data?.duplicatePool?.id) {
          toast.success(
            intl.formatMessage({
              defaultMessage: "Process duplicated successfully!",
              id: "qXnXKH",
              description: "Message displayed to user after pool is duplicated",
            }),
          );
          await navigate(paths.poolUpdate(result.data.duplicatePool.id));
        } else {
          handleDuplicateError();
        }
      })
      .catch(handleDuplicateError);
  };

  const [{ fetching: unarchiveFetching }, executeUnarchiveMutation] =
    useMutation(UnarchivePool_Mutation);

  const handleUnarchiveError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage: "Error: un-archiving process failed",
        id: "DqM+mu",
        description:
          "Message displayed to user after pool fails to get un-archived.",
      }),
    );
  };

  const unarchivePool = async (id: string) => {
    await executeUnarchiveMutation({ id })
      .then((result) => {
        if (result.data?.unarchivePool) {
          toast.success(
            intl.formatMessage({
              defaultMessage: "Process un-archived successfully!",
              id: "pR/Xr2",
              description:
                "Message displayed to user after pool is un-archived",
            }),
          );
        } else {
          handleUnarchiveError();
        }
      })
      .catch(handleUnarchiveError);
  };

  const [
    { fetching: createPoolSkillFetching },
    executeCreatePoolSkillMutation,
  ] = useMutation(CreatePoolSkill_Mutation);

  const createPoolSkill = async (poolSkill: CreatePoolSkillInput) => {
    return executeCreatePoolSkillMutation({ poolSkill })
      .then((result) => {
        if (result.data?.createPoolSkill) {
          toast.success(
            intl.formatMessage({
              defaultMessage: "Process updated successfully!",
              id: "/ZlzNi",
              description: "Message displayed to user after pool is updated",
            }),
          );

          return Promise.resolve();
        }
        return handleUpdateError();
      })
      .catch(handleUpdateError);
  };

  const [
    { fetching: updatePoolSkillFetching },
    executeUpdatePoolSkillMutation,
  ] = useMutation(UpdatePoolSkill_Mutation);

  const updatePoolSkill = async (
    id: string,
    poolSkill: UpdatePoolSkillInput,
  ) => {
    return executeUpdatePoolSkillMutation({ id, poolSkill })
      .then((result) => {
        if (result.data?.updatePoolSkill) {
          toast.success(
            intl.formatMessage({
              defaultMessage: "Process updated successfully!",
              id: "/ZlzNi",
              description: "Message displayed to user after pool is updated",
            }),
          );

          return Promise.resolve();
        }
        return handleUpdateError();
      })
      .catch(handleUpdateError);
  };

  const [
    { fetching: deletePoolSkillFetching },
    executeDeletePoolSkillMutation,
  ] = useMutation(DeletePoolSkill_Mutation);

  const deletePoolSkill = async (id: string) => {
    return executeDeletePoolSkillMutation({ id })
      .then((result) => {
        if (result.data?.deletePoolSkill) {
          toast.success(
            intl.formatMessage({
              defaultMessage: "Process updated successfully!",
              id: "/ZlzNi",
              description: "Message displayed to user after pool is updated",
            }),
          );

          return Promise.resolve();
        }
        return handleUpdateError();
      })
      .catch(handleUpdateError);
  };

  return {
    isFetching:
      updateFetching ||
      updatePublishedFetching ||
      extendFetching ||
      publishFetching ||
      closeFetching ||
      deleteFetching ||
      duplicateFetching ||
      archiveFetching ||
      unarchiveFetching ||
      createPoolSkillFetching ||
      updatePoolSkillFetching ||
      deletePoolSkillFetching,
    mutations: {
      update,
      updatePublished,
      extend,
      publish,
      close,
      delete: deletePool,
      duplicate: duplicatePool,
      archive: archivePool,
      unarchive: unarchivePool,
      createPoolSkill,
      updatePoolSkill,
      deletePoolSkill,
    },
  };
};

export default usePoolMutations;
