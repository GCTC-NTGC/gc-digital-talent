import { useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";
import { useMutation } from "urql";

import { toast } from "@gc-digital-talent/toast";
import {
  graphql,
  UpdatePoolInput,
  Scalars,
  CreatePoolSkillInput,
  UpdatePoolSkillInput,
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

const ExtendPool_Mutation = graphql(/* GraphQL */ `
  mutation ExtendPool($id: ID!, $closingDate: DateTime!) {
    changePoolClosingDate(id: $id, newClosingDate: $closingDate) {
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
  mutation ClosePool($id: ID!) {
    closePool(id: $id) {
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
  mutation DuplicatePool($id: ID!, $teamId: ID!) {
    duplicatePool(id: $id, teamId: $teamId) {
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
  mutation CreatePoolSkill(
    $poolId: ID!
    $skillId: ID!
    $poolSkill: CreatePoolSkillInput!
  ) {
    createPoolSkill(poolId: $poolId, skillId: $skillId, poolSkill: $poolSkill) {
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

  const navigateBack = () => navigate(returnPath ?? paths.poolTable());

  const [{ fetching: updateFetching }, executeUpdateMutation] =
    useMutation(UpdatePool_Mutation);

  const handleUpdateError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage: "Error: updating pool failed",
        id: "2TrYLI",
        description:
          "Message displayed to user after pool fails to get updated.",
      }),
    );

    return Promise.reject();
  };

  const update = async (id: string, pool: UpdatePoolInput) => {
    return executeUpdateMutation({ id, pool })
      .then((result) => {
        if (result.data?.updatePool) {
          toast.success(
            intl.formatMessage({
              defaultMessage: "Pool updated successfully!",
              id: "nPUAz5",
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
              defaultMessage: "Pool updated successfully!",
              id: "nPUAz5",
              description: "Message displayed to user after pool is updated",
            }),
          );
        } else {
          handleUpdateError();
        }
      })
      .catch(handleUpdateError);
  };

  const [{ fetching: publishFetching }, executePublishMutation] =
    useMutation(PublishPool_Mutation);

  const handlePublishError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage: "Error: publishing pool failed",
        id: "TkTpzk",
        description:
          "Message displayed to user after pool fails to get publish.",
      }),
    );
  };

  const publish = (id: string) => {
    executePublishMutation({ id })
      .then((result) => {
        if (result.data?.publishPool) {
          navigateBack();
          toast.success(
            intl.formatMessage({
              defaultMessage: "Pool published successfully!",
              id: "P5+9Wy",
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
        defaultMessage: "Error: closing pool failed",
        id: "dYBwCh",
        description:
          "Message displayed to user after pool fails to get closed.",
      }),
    );
  };

  const close = (id: string) => {
    executeCloseMutation({ id })
      .then((result) => {
        if (result.data?.closePool) {
          navigateBack();
          toast.success(
            intl.formatMessage({
              defaultMessage: "Pool closed successfully!",
              id: "JJB5Yd",
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
        defaultMessage: "Error: closing pool failed",
        id: "RXoZOS",
        description:
          "Message displayed to user after pool fails to get deleted.",
      }),
    );
  };

  const deletePool = async (id: string) => {
    await executeDeleteMutation({ id })
      .then((result) => {
        if (result.data?.deletePool) {
          navigateBack();
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
        defaultMessage: "Error: archiving pool failed",
        id: "zotZ6j",
        description:
          "Message displayed to user after pool fails to get archived.",
      }),
    );
  };

  const archivePool = async (id: string) => {
    await executeArchiveMutation({ id })
      .then((result) => {
        if (result.data?.archivePool) {
          navigateBack();
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

  const duplicatePool = async (id: string, teamId: string) => {
    await executeDuplicateMutation({ id, teamId })
      .then((result) => {
        if (result.data?.duplicatePool?.id) {
          toast.success(
            intl.formatMessage({
              defaultMessage:
                "Success: This process has been duplicated successfully.",
              id: "MwWYDJ",
              description: "Message displayed to user after pool is deleted",
            }),
          );
          navigate(paths.poolUpdate(result.data.duplicatePool.id));
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
        defaultMessage: "Error: un-archiving pool failed",
        id: "H9fzdi",
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
              defaultMessage: "Pool un-archived successfully!",
              id: "5it7iX",
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

  const createPoolSkill = async (
    poolId: string,
    skillId: string,
    poolSkill: CreatePoolSkillInput,
  ) => {
    return executeCreatePoolSkillMutation({ poolId, skillId, poolSkill })
      .then((result) => {
        if (result.data?.createPoolSkill) {
          toast.success(
            intl.formatMessage({
              defaultMessage: "Pool updated successfully!",
              id: "nPUAz5",
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
              defaultMessage: "Pool updated successfully!",
              id: "nPUAz5",
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
              defaultMessage: "Pool updated successfully!",
              id: "nPUAz5",
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
