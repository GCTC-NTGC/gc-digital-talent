import type { IntlShape, MessageDescriptor } from "react-intl";
import type { ReactNode } from "react";

import { CandidateInterest, CandidateStatus } from "@gc-digital-talent/graphql";
import { compareStrings } from "@gc-digital-talent/helpers";
import { Link } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

import {
  applicationStatusDescriptions,
  qualifiedRecruitmentStatusDescriptions,
} from "~/utils/poolCandidate";

// map an array of items to a single unique string
export function deriveSingleString<T>(
  values: T[],
  localizedMapper: (item: T) => string,
): string {
  const localizedStrings = values.map(localizedMapper);
  localizedStrings.sort((a, b) => compareStrings(a, b, "asc"));

  const uniqueStrings = [...new Set(localizedStrings)];
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

const contactEmailTag = (chunks: ReactNode, email?: string | null) => {
  return email ? (
    <Link external href={`mailto:${email}`}>
      {email}
    </Link>
  ) : (
    <>{chunks}</>
  );
};

interface CandidateStatusDescArgs {
  status?: CandidateStatus | null;
  employeesOnly?: boolean;
  contactEmail?: string | null;
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
  interest?: CandidateInterest | null;
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
