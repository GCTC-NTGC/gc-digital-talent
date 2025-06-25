import { useIntl } from "react-intl";
import { useLocation } from "react-router";

import {
  ApplicantFilterInput,
  Classification,
} from "@gc-digital-talent/graphql";
import { Card } from "@gc-digital-talent/ui";

import Hero from "~/components/Hero";
import { FormValues as SearchFormValues } from "~/types/searchRequest";

import CreateRequest from "./components/RequestForm";

interface LocationState {
  applicantFilter: ApplicantFilterInput;
  initialValues: SearchFormValues;
  candidateCount: number;
  selectedClassifications?: Pick<Classification, "group" | "level">[];
}

export const Component = () => {
  const intl = useIntl();
  const location = useLocation();
  const state = location.state as LocationState;

  const applicantFilter = state ? state.applicantFilter : null;
  const initialValues = state ? state.initialValues : undefined;
  const candidateCount = state ? state.candidateCount : null;
  const selectedClassifications = state ? state.selectedClassifications : [];

  return (
    <Hero
      title={intl.formatMessage({
        defaultMessage: "Find digital talent",
        id: "9Jkoms",
        description: "Title displayed on hero for Search and Request pages.",
      })}
      subtitle={intl.formatMessage({
        defaultMessage: "Submit your filtered request for talent.",
        id: "TU9sk7",
        description: "Subtitle displayed on hero for Search and Request pages.",
      })}
      centered
      overlap
    >
      <Card className="mb-18" space="lg">
        <CreateRequest
          applicantFilter={applicantFilter}
          searchFormInitialValues={initialValues}
          candidateCount={candidateCount}
          selectedClassifications={selectedClassifications}
        />
      </Card>
    </Hero>
  );
};

Component.displayName = "RequestPage";

export default Component;
