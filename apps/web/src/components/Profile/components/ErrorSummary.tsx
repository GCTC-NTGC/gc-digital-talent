import React from "react";
import { useIntl } from "react-intl";

import { Heading, Well, ScrollToLink } from "@gc-digital-talent/ui";

import { Applicant, PoolCandidate, User } from "~/api/generated";
import { hasEmptyRequiredFields as hasEmptyPersonalRequiredFields } from "~/validators/profile/about";
import { hasEmptyRequiredFields as hasEmptyGovernmentRequiredFields } from "~/validators/profile/governmentInformation";
import { hasEmptyRequiredFields as hasEmptyWorkPrefRequiredFields } from "~/validators/profile/workPreferences";
import { hasEmptyRequiredFields as hasEmptyWorkLocRequiredFields } from "~/validators/profile/workLocation";
import { hasEmptyRequiredFields as hasEmptyDEIRequiredFields } from "~/validators/profile/diversityEquityInclusion";
import {
  hasEmptyRequiredFields as hasEmptyLanguageRequiredFields,
  hasUnsatisfiedRequirements,
} from "~/validators/profile/languageInformation";

import { sectionTitles } from "../utils";
import { SectionKey } from "../types";

type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

interface ErrorSummaryProps {
  user: User;
  application: PoolCandidate;
}

const ErrorSummary = ({ user, application }: ErrorSummaryProps) => {
  const intl = useIntl();
  const errors: Record<SectionKey, boolean> = {
    personal: hasEmptyPersonalRequiredFields(user),
    dei: hasEmptyDEIRequiredFields(user, application.pool),
    work:
      hasEmptyWorkLocRequiredFields(user) ||
      hasEmptyWorkPrefRequiredFields(user),
    government: hasEmptyGovernmentRequiredFields(user),
    language:
      hasEmptyLanguageRequiredFields(user) ||
      hasUnsatisfiedRequirements(user as Applicant, application.pool),
  };

  const hasErrors = Object.values(errors).some((hasError) => hasError);

  if (!hasErrors) {
    return null;
  }

  const entries = Object.entries(errors) as Entries<typeof errors>;

  return (
    <Well color="error" role="alert">
      <Heading level="h3" size="h6" data-h2-margin-top="base(0)">
        {intl.formatMessage({
          defaultMessage: "Just a heads up!",
          id: "q/OZDK",
          description: "Heading for profile review page error summary",
        })}
      </Heading>
      <p data-h2-margin-bottom="base(x.5)">
        {intl.formatMessage({
          defaultMessage:
            "We found a few errors on the page. You can jump to the specified section directly using the following links, where you'll be provided more detailed information about what's wrong.",
          id: "Mcpbc1",
          description:
            "Descriptive text indicating there are errors in one or more forms and how to fix them",
        })}
      </p>
      <ul>
        {entries.map(([key, value]) => {
          const title = sectionTitles.get(key);
          return (
            <React.Fragment key={key}>
              {value && title ? (
                <li>
                  <ScrollToLink to={`${key}-section`}>
                    {intl.formatMessage(title)}
                  </ScrollToLink>
                </li>
              ) : null}
            </React.Fragment>
          );
        })}
      </ul>
    </Well>
  );
};

export default ErrorSummary;
