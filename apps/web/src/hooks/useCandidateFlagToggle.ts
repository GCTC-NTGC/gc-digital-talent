import { useMutation } from "urql";
import { useIntl } from "react-intl";

import {
  Classification,
  graphql,
  LocalizedPublishingGroup,
  LocalizedString,
  Maybe,
  Scalars,
  WorkStream,
} from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";
import { useControllableState } from "@gc-digital-talent/ui";

import { getFullNameLabel } from "~/utils/nameUtils";
import { getShortPoolTitleLabel } from "~/utils/poolUtils";

const PoolCandidate_ToggleFlagMutation = graphql(/* GraphQL */ `
  mutation ToggleFlag_Mutation($id: ID!) {
    togglePoolCandidateFlag(id: $id)
  }
`);

interface CandidateInfo {
  firstName: string | null | undefined;
  lastName: string | null | undefined;
  workStream: Maybe<WorkStream> | undefined;
  name: Maybe<LocalizedString> | undefined;
  publishingGroup: Maybe<LocalizedPublishingGroup> | undefined;
  classification: Maybe<Pick<Classification, "group" | "level">> | undefined;
}

interface UseCandidateFlagToggleArgs {
  id: Scalars["UUID"]["output"];
  defaultValue?: boolean;
  value?: boolean;
  onChange?: (newIsFlagged: boolean) => void;
  showToast?: boolean;
  candidateInfo: CandidateInfo;
}

interface CandidateFlagResult {
  isFlagged: boolean;
  isUpdating: boolean;
}

type UseCandidateFlagToggleReturn = [
  result: CandidateFlagResult,
  toggle: () => void,
];

const useCandidateFlagToggle = ({
  id,
  defaultValue,
  onChange,
  value,
  showToast = true,
  candidateInfo,
}: UseCandidateFlagToggleArgs): UseCandidateFlagToggleReturn => {
  const intl = useIntl();
  const [isFlagged, setIsFlagged] = useControllableState({
    defaultValue: defaultValue ?? false,
    controlledProp: value,
    onChange,
  });

  const [{ fetching: isUpdating }, executeToggleFlagMutation] = useMutation(
    PoolCandidate_ToggleFlagMutation,
  );

  const candidateName = getFullNameLabel(
    candidateInfo.firstName,
    candidateInfo.lastName,
    intl,
  );
  const processTitle = getShortPoolTitleLabel(intl, {
    workStream: candidateInfo.workStream,
    name: candidateInfo.name,
    publishingGroup: candidateInfo.publishingGroup,
    classification: candidateInfo.classification,
  });

  const toggleFlag = async () => {
    if (id) {
      await executeToggleFlagMutation({
        id,
      })
        .then((res) => {
          if (!res.error) {
            const newIsFlagged = res.data?.togglePoolCandidateFlag === true;
            if (showToast) {
              if (newIsFlagged) {
                toast.success(
                  intl.formatMessage(
                    {
                      defaultMessage:
                        "You've flagged {candidateName} in {processTitle}. Other authorized users can also view or remove this flag.",
                      id: "NRX2CA",
                      description:
                        "Alert displayed to the user when they mark a candidate as flagged.",
                    },
                    {
                      candidateName,
                      processTitle,
                    },
                  ),
                );
              } else {
                toast.success(
                  intl.formatMessage(
                    {
                      defaultMessage:
                        "You've removed the flag for {candidateName} in {processTitle}.",
                      id: "idwHJf",
                      description:
                        "Alert displayed to the user when they un-flag a candidate.",
                    },
                    {
                      candidateName,
                      processTitle,
                    },
                  ),
                );
              }
            }

            setIsFlagged(newIsFlagged);
          }
        })
        .catch(() => {
          toast.error(
            intl.formatMessage({
              defaultMessage: "Error: failed to update a candidate's flag.",
              id: "07pYaF",
              description:
                "Alert displayed to the user when failing to (un-)flag a candidate.",
            }),
          );
        });
    }
  };

  return [{ isFlagged: isFlagged ?? false, isUpdating }, toggleFlag];
};

export default useCandidateFlagToggle;
