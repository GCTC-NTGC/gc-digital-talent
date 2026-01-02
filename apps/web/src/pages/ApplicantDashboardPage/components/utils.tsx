import { IntlShape, MessageDescriptor } from "react-intl";
import uniq from "lodash/uniq";
import { ReactNode } from "react";

import {
  CandidateInterest,
  CandidateStatus,
  Maybe,
  PoolCandidateSearchStatus,
} from "@gc-digital-talent/graphql";
import { assertUnreachable, compareStrings } from "@gc-digital-talent/helpers";
import { ChipProps, Link } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

import {
  applicationStatusDescriptions,
  qualifiedRecruitmentStatusDescriptions,
} from "~/utils/poolCandidate";

// figure out what the chip should look like for a given status
export function deriveChipSettings(
  status: PoolCandidateSearchStatus,
  intl: IntlShape,
): { color: ChipProps["color"]; label: string } {
  switch (status) {
    case PoolCandidateSearchStatus.New:
      return {
        color: "secondary",
        label: intl.formatMessage({
          defaultMessage: "Submitted",
          id: "nTPcCF",
          description: "Label for request submitted",
        }),
      };
    case PoolCandidateSearchStatus.InProgress:
      return {
        color: "secondary",
        label: intl.formatMessage({
          defaultMessage: "Under review",
          id: "YYmuJo",
          description:
            "Label for pool candidate search requests that are under review",
        }),
      };
    case PoolCandidateSearchStatus.Waiting:
      return {
        color: "warning",
        label: intl.formatMessage({
          defaultMessage: "Awaiting response",
          id: "MOKBPl",
          description:
            "Label for pool candidate search requests that are awaiting a response",
        }),
      };
    case PoolCandidateSearchStatus.Done:
    case PoolCandidateSearchStatus.DoneNoCandidates:
    case PoolCandidateSearchStatus.NotCompliant:
      return {
        color: "success",
        label: intl.formatMessage(commonMessages.complete),
      };
    default:
      return assertUnreachable(status);
  }
}

// map an array of items to a single unique string
export function deriveSingleString<T>(
  values: T[],
  localizedMapper: (item: T) => string,
): string {
  const localizedStrings = values.map(localizedMapper);
  localizedStrings.sort((a, b) => compareStrings(a, b, "asc"));

  const uniqueStrings = uniq(localizedStrings);
  const joinedStrings = uniqueStrings.join(", ");

  return joinedStrings;
}

const candidateStatusDescMap = new Map<CandidateStatus, MessageDescriptor>([
  [CandidateStatus.Draft, applicationStatusDescriptions.DRAFT],
  [CandidateStatus.Expired, applicationStatusDescriptions.EXPIRED],
  [CandidateStatus.Received, applicationStatusDescriptions.RECEIVED],
  [CandidateStatus.UnderReview, applicationStatusDescriptions.UNDER_REVIEW],
  [
    CandidateStatus.ApplicationReviewed,
    applicationStatusDescriptions.APPLICATION_REVIEWED,
  ],
  [
    CandidateStatus.UnderAssessment,
    applicationStatusDescriptions.UNDER_ASSESSMENT,
  ],
  [CandidateStatus.Qualified, applicationStatusDescriptions.UNDER_ASSESSMENT],
  [CandidateStatus.Withdrew, applicationStatusDescriptions.WITHDREW],
  [CandidateStatus.NotResponsive, applicationStatusDescriptions.NOT_RESPONSIVE],
  [CandidateStatus.Ineligible, applicationStatusDescriptions.INELIGIBLE],
  [CandidateStatus.Removed, applicationStatusDescriptions.REMOVED],
]);

export const contactEmailTag = (chunks: ReactNode, email?: Maybe<string>) => {
  return email ? (
    <Link external href={`mailto:${email}`}>
      {email}
    </Link>
  ) : (
    <>{chunks}</>
  );
};

interface CandidateStatusDescArgs {
  status?: Maybe<CandidateStatus>;
  employeesOnly?: boolean;
  contactEmail?: Maybe<string>;
  intl: IntlShape;
}

export const candidateStatusDesc = ({
  status,
  employeesOnly,
  contactEmail,
  intl,
}: CandidateStatusDescArgs): ReactNode | null => {
  if (!status) return null;
  // Special handling for unsuccessful applications
  if (status === CandidateStatus.Unsuccessful) {
    return employeesOnly
      ? intl.formatMessage(
          applicationStatusDescriptions.UNSUCCESSFUL_EMPLOYEE,
          {
            contactEmail:
              contactEmail ?? intl.formatMessage(commonMessages.notFound),
            link: (chunks) => contactEmailTag(chunks, contactEmail),
          },
        )
      : intl.formatMessage(applicationStatusDescriptions.UNSUCCESSFUL_PUBLIC);
  }

  const msg = candidateStatusDescMap.get(status);

  return msg ? intl.formatMessage(msg) : null;
};

const candidateInterestDescMap = new Map<CandidateInterest, MessageDescriptor>([
  [
    CandidateInterest.NotInterested,
    qualifiedRecruitmentStatusDescriptions.NOT_INTERESTED,
  ],
  [
    CandidateInterest.OpenToJobs,
    qualifiedRecruitmentStatusDescriptions.OPEN_TO_JOBS,
  ],
  [CandidateInterest.Hired, qualifiedRecruitmentStatusDescriptions.HIRED],
]);

interface CandidateInterestDescArgs {
  interest?: Maybe<CandidateInterest>;
  intl: IntlShape;
}

export const candidateInterestDesc = ({
  interest,
  intl,
}: CandidateInterestDescArgs): ReactNode | null => {
  if (!interest) return null;

  const msg = candidateInterestDescMap.get(interest);

  return msg ? intl.formatMessage(msg) : null;
};
