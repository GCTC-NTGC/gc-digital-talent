import { useIntl } from "react-intl";
import { useMutation } from "urql";
import type { OperationContext } from "@urql/core";

import type {
  TalentRequestTrackedUserNotReferredReason,
  TalentRequestTrackedUserNotSelectedReason,
} from "@gc-digital-talent/graphql";
import { graphql } from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";

import talentRequestMessages from "~/messages/talentRequestMessages";

const CreateTrackedUsersReferred_Mutation = graphql(/* GraphQL */ `
  mutation CreateTrackedUsersReferred(
    $userIds: [UUID!]!
    $talentRequestId: UUID!
  ) {
    createTrackedUsersReferred(
      userIds: $userIds
      talentRequestId: $talentRequestId
    )
  }
`);

const CreateTrackedUsersNotReferred_Mutation = graphql(/* GraphQL */ `
  mutation CreateTrackedUsersNotReferred(
    $userIds: [UUID!]!
    $talentRequestId: UUID!
    $notReferredReason: TalentRequestTrackedUserNotReferredReason!
  ) {
    createTrackedUsersNotReferred(
      userIds: $userIds
      talentRequestId: $talentRequestId
      notReferredReason: $notReferredReason
    )
  }
`);

const UpdateTrackedUsersReferred_Mutation = graphql(/* GraphQL */ `
  mutation UpdateTrackedUsersReferred($ids: [UUID!]!) {
    updateTrackedUsersReferred(ids: $ids) {
      id
    }
  }
`);

const UpdateTrackedUsersNotReferred_Mutation = graphql(/* GraphQL */ `
  mutation UpdateTrackedUsersNotReferred(
    $ids: [UUID!]!
    $notReferredReason: TalentRequestTrackedUserNotReferredReason!
  ) {
    updateTrackedUsersNotReferred(
      ids: $ids
      notReferredReason: $notReferredReason
    ) {
      id
    }
  }
`);

const UpdateTrackedUsersSelected_Mutation = graphql(/* GraphQL */ `
  mutation UpdateTrackedUsersSelected($ids: [UUID!]!) {
    updateTrackedUsersSelected(ids: $ids) {
      id
    }
  }
`);

const UpdateTrackedUsersNotSelected_Mutation = graphql(/* GraphQL */ `
  mutation UpdateTrackedUsersNotSelected(
    $ids: [UUID!]!
    $notSelectedReason: TalentRequestTrackedUserNotSelectedReason!
  ) {
    updateTrackedUsersNotSelected(
      ids: $ids
      notSelectedReason: $notSelectedReason
    ) {
      id
    }
  }
`);

const trackedUsersMutationContext: Partial<OperationContext> = {
  // Invalidate talent-request tracking/matching lists after bulk status mutations.
  additionalTypenames: ["TalentRequest", "TalentRequestTrackedUser", "User"],
  requestPolicy: "cache-first",
};

interface CreateTrackedUsersReferredArgs {
  userIds: string[];
  talentRequestId: string;
}

interface CreateTrackedUsersNotReferredArgs {
  userIds: string[];
  talentRequestId: string;
  notReferredReason: TalentRequestTrackedUserNotReferredReason;
}

interface UpdateTrackedUsersReferredArgs {
  ids: string[];
}

interface UpdateTrackedUsersNotReferredArgs {
  ids: string[];
  notReferredReason: TalentRequestTrackedUserNotReferredReason;
}

interface UpdateTrackedUsersSelectedArgs {
  ids: string[];
}

interface UpdateTrackedUsersNotSelectedArgs {
  ids: string[];
  notSelectedReason: TalentRequestTrackedUserNotSelectedReason;
}

const useTrackedUsersMutations = () => {
  const intl = useIntl();

  const [
    { fetching: creatingTrackedUsersReferred },
    executeCreateReferredMutation,
  ] = useMutation(CreateTrackedUsersReferred_Mutation);
  const [
    { fetching: creatingTrackedUsersNotReferred },
    executeCreateNotReferredMutation,
  ] = useMutation(CreateTrackedUsersNotReferred_Mutation);
  const [
    { fetching: updatingTrackedUsersReferred },
    executeUpdateReferredMutation,
  ] = useMutation(UpdateTrackedUsersReferred_Mutation);
  const [
    { fetching: updatingTrackedUsersNotReferred },
    executeUpdateNotReferredMutation,
  ] = useMutation(UpdateTrackedUsersNotReferred_Mutation);
  const [
    { fetching: updatingTrackedUsersSelected },
    executeUpdateSelectedMutation,
  ] = useMutation(UpdateTrackedUsersSelected_Mutation);
  const [
    { fetching: updatingTrackedUsersNotSelected },
    executeUpdateNotSelectedMutation,
  ] = useMutation(UpdateTrackedUsersNotSelected_Mutation);

  const handleUpdateError = () => {
    toast.error(intl.formatMessage(talentRequestMessages.updateError));

    return Promise.reject(new Error("Failed to update tracked users."));
  };

  const handleUpdateSuccess = () => {
    toast.success(intl.formatMessage(talentRequestMessages.updateSuccess));
  };

  const createTrackedUsersReferred = async ({
    userIds,
    talentRequestId,
  }: CreateTrackedUsersReferredArgs) => {
    return executeCreateReferredMutation(
      { userIds, talentRequestId },
      trackedUsersMutationContext,
    )
      .then((res) => {
        if (!res.error && res.data?.createTrackedUsersReferred === true) {
          handleUpdateSuccess();
          return Promise.resolve();
        }

        return handleUpdateError();
      })
      .catch(handleUpdateError);
  };

  const createTrackedUsersNotReferred = async ({
    userIds,
    talentRequestId,
    notReferredReason,
  }: CreateTrackedUsersNotReferredArgs) => {
    return executeCreateNotReferredMutation(
      {
        userIds,
        talentRequestId,
        notReferredReason,
      },
      trackedUsersMutationContext,
    )
      .then((res) => {
        if (!res.error && res.data?.createTrackedUsersNotReferred === true) {
          handleUpdateSuccess();
          return Promise.resolve();
        }

        return handleUpdateError();
      })
      .catch(handleUpdateError);
  };

  const updateTrackedUsersReferred = async ({
    ids,
  }: UpdateTrackedUsersReferredArgs) => {
    return executeUpdateReferredMutation({ ids }, trackedUsersMutationContext)
      .then((res) => {
        if (
          !res.error &&
          (res.data?.updateTrackedUsersReferred?.length ?? 0) > 0
        ) {
          handleUpdateSuccess();
          return Promise.resolve();
        }

        return handleUpdateError();
      })
      .catch(handleUpdateError);
  };

  const updateTrackedUsersNotReferred = async ({
    ids,
    notReferredReason,
  }: UpdateTrackedUsersNotReferredArgs) => {
    return executeUpdateNotReferredMutation(
      { ids, notReferredReason },
      trackedUsersMutationContext,
    )
      .then((res) => {
        if (
          !res.error &&
          (res.data?.updateTrackedUsersNotReferred?.length ?? 0) > 0
        ) {
          handleUpdateSuccess();
          return Promise.resolve();
        }

        return handleUpdateError();
      })
      .catch(handleUpdateError);
  };

  const updateTrackedUsersSelected = async ({
    ids,
  }: UpdateTrackedUsersSelectedArgs) => {
    return executeUpdateSelectedMutation({ ids }, trackedUsersMutationContext)
      .then((res) => {
        if (
          !res.error &&
          (res.data?.updateTrackedUsersSelected?.length ?? 0) > 0
        ) {
          handleUpdateSuccess();
          return Promise.resolve();
        }

        return handleUpdateError();
      })
      .catch(handleUpdateError);
  };

  const updateTrackedUsersNotSelected = async ({
    ids,
    notSelectedReason,
  }: UpdateTrackedUsersNotSelectedArgs) => {
    return executeUpdateNotSelectedMutation(
      { ids, notSelectedReason },
      trackedUsersMutationContext,
    )
      .then((res) => {
        if (
          !res.error &&
          (res.data?.updateTrackedUsersNotSelected?.length ?? 0) > 0
        ) {
          handleUpdateSuccess();
          return Promise.resolve();
        }

        return handleUpdateError();
      })
      .catch(handleUpdateError);
  };

  return {
    createTrackedUsersReferred,
    creatingTrackedUsersReferred,
    createTrackedUsersNotReferred,
    creatingTrackedUsersNotReferred,
    updateTrackedUsersReferred,
    updatingTrackedUsersReferred,
    updateTrackedUsersNotReferred,
    updatingTrackedUsersNotReferred,
    updateTrackedUsersSelected,
    updatingTrackedUsersSelected,
    updateTrackedUsersNotSelected,
    updatingTrackedUsersNotSelected,
    updatingTrackedUsers:
      creatingTrackedUsersReferred ||
      creatingTrackedUsersNotReferred ||
      updatingTrackedUsersReferred ||
      updatingTrackedUsersNotReferred ||
      updatingTrackedUsersSelected ||
      updatingTrackedUsersNotSelected,
  };
};

export default useTrackedUsersMutations;
