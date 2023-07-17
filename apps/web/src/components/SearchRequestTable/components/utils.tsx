import mapValues from "lodash/mapValues";
import { useIntl } from "react-intl";
import { OperationContext } from "urql";

import {
  getPoolStream,
  getLocalizedName,
  getPoolCandidateSearchStatus,
} from "@gc-digital-talent/i18n";
import { enumToOptions } from "@gc-digital-talent/forms";
import { notEmpty } from "@gc-digital-talent/helpers";
import {
  PoolStream,
  PoolCandidateSearchStatus,
  useGetFilterDataForRequestsQuery,
} from "@gc-digital-talent/graphql";

const context: Partial<OperationContext> = {
  additionalTypenames: ["Classification", "Department"], // This lets urql know when to invalidate cache if request returns empty list. https://formidable.com/open-source/urql/docs/basics/document-caching/#document-cache-gotchas
  requestPolicy: "cache-first",
};

export default function useFilterOptions() {
  const intl = useIntl();
  const [filterRes] = useGetFilterDataForRequestsQuery({ context });

  const optionsData = {
    status: enumToOptions(PoolCandidateSearchStatus, [
      PoolCandidateSearchStatus.New,
      PoolCandidateSearchStatus.InProgress,
      PoolCandidateSearchStatus.Waiting,
      PoolCandidateSearchStatus.Done,
    ]).map(({ value }) => ({
      value,
      label: intl.formatMessage(getPoolCandidateSearchStatus(value)),
    })),
    departments: filterRes?.data?.departments
      ?.filter(notEmpty)
      .map((department) => ({
        value: department.id,
        label: getLocalizedName(department.name, intl),
      })),
    classifications: filterRes.data?.classifications
      ?.filter(notEmpty)
      .map((classification) => ({
        value: classification.id,
        label: `${classification.group}-0${classification.level}`,
      })),
    streams: enumToOptions(PoolStream).map(({ value }) => ({
      value,
      label: intl.formatMessage(getPoolStream(value)),
    })),
  };

  // Creates an object keyed with all fields, each with empty array.
  // Unlike Array.prototype.reduce(), creates clear type. Used for defaults.
  const emptyFormValues = mapValues(optionsData, () => []);

  return {
    optionsData,
    emptyFormValues,
    rawGraphqlResults: {
      departments: filterRes,
      classifications: filterRes,
    },
  };
}
