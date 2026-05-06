import { useMutation } from "urql";
import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";

import type {
  FragmentType,
  Maybe,
  PoolCandidateSearchStatus,
} from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";
import { Select, Submit } from "@gc-digital-talent/forms";
import {
  commonMessages,
  ENUM_SORT_ORDER,
  narrowEnumType,
  sortLocalizedEnumOptions,
  uiMessages,
} from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";
import { unpackMaybes } from "@gc-digital-talent/helpers";

export const TalentRequestStatusOptions_Fragment = graphql(/* GraphQL */ `
  fragment TalentRequestStatusOptions on Query {
    statuses: localizedEnumOptions(enumName: "PoolCandidateSearchStatus") {
      ... on LocalizedPoolCandidateSearchStatus {
        value
        label {
          localized
        }
      }
    }
  }
`);

export type TalentRequestStatusOptions = FragmentType<
  typeof TalentRequestStatusOptions_Fragment
>;

const TalentRequestStatus_Fragment = graphql(/** GraphQL */ `
  fragment TalentRequestStatus on PoolCandidateSearchRequest {
    id
    status {
      value
      label {
        localized
      }
    }
  }
`);

const UpdateTalentRequestStatus_Mutation = graphql(/** GraphQL */ `
  mutation UpdateTalentRequestStatus(
    $id: ID!
    $input: UpdatePoolCandidateSearchRequestInput!
  ) {
    updatePoolCandidateSearchRequest(
      id: $id
      poolCandidateSearchRequest: $input
    ) {
      id
      status {
        value
      }
    }
  }
`);

interface FormValues {
  status?: Maybe<PoolCandidateSearchStatus>;
}

interface TalentRequestStatusProps {
  query: FragmentType<typeof TalentRequestStatus_Fragment>;
  optionsQuery?: TalentRequestStatusOptions;
}

const TalentRequestStatus = ({
  query,
  optionsQuery,
}: TalentRequestStatusProps) => {
  const intl = useIntl();
  const talentRequest = getFragment(TalentRequestStatus_Fragment, query);
  const options = getFragment(
    TalentRequestStatusOptions_Fragment,
    optionsQuery,
  );
  const [, updateStatus] = useMutation(UpdateTalentRequestStatus_Mutation);

  const methods = useForm<FormValues>({
    defaultValues: {
      status: talentRequest?.status?.value,
    },
  });

  const handleSubmit = async (values: FormValues) => {
    return updateStatus({
      id: talentRequest.id,
      input: { status: values.status },
    })
      .then((res) => {
        if (!res.data || res.error) {
          throw new Error();
        }

        methods.resetField("status", {
          keepDirty: false,
          defaultValue: values.status,
        });

        toast.success(
          intl.formatMessage({
            defaultMessage: "Request status updated!",
            id: "+mCsoW",
            description:
              "Message displayed to user after the request status is successfully updated.",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: updating status failed",
            id: "CaDy8n",
            description:
              "Message displayed to user after the request status fails to be updated.",
          }),
        );
      });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)} className="mb-3">
        <Select
          id="status"
          name="status"
          className="mb-1"
          nullSelection={intl.formatMessage(uiMessages.nullSelectionOption)}
          label={intl.formatMessage(commonMessages.status)}
          options={sortLocalizedEnumOptions(
            ENUM_SORT_ORDER.POOL_CANDIDATE_SEARCH_STATUS,
            narrowEnumType(
              unpackMaybes(options?.statuses),
              "PoolCandidateSearchStatus",
            ),
          ).map((status) => ({
            value: status.value,
            label:
              status.label?.localized ??
              intl.formatMessage(commonMessages.notAvailable),
          }))}
          doNotSort
        />
        <Submit
          block
          isSubmitting={methods.formState.isSubmitting}
          text={intl.formatMessage({
            defaultMessage: "Save status change",
            id: "B6SqfX",
            description:
              "Button label displayed that saves the users status selection.",
          })}
          submittedText={intl.formatMessage({
            defaultMessage: "Save status change",
            id: "B6SqfX",
            description:
              "Button label displayed that saves the users status selection.",
          })}
        />
      </form>
    </FormProvider>
  );
};

export default TalentRequestStatus;
