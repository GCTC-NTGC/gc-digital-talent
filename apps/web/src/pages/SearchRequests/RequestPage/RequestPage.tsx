import * as React from "react";
import { useIntl } from "react-intl";
import { useLocation } from "react-router-dom";

import {
  ApplicantFilterInput,
  Classification,
} from "@gc-digital-talent/graphql";

import Hero from "~/components/Hero/Hero";
import { FormValues as SearchFormValues } from "~/types/searchRequest";

import CreateRequest from "./components/RequestForm";

type LocationState = {
  applicantFilter: ApplicantFilterInput;
  initialValues: SearchFormValues;
  candidateCount: number;
  selectedClassifications: Classification[];
};

const RequestPage = () => {
  const intl = useIntl();
  const location = useLocation();
  const state = location.state as LocationState;

  const applicantFilter = state ? state.applicantFilter : null;
  const initialValues = state ? state.initialValues : undefined;
  const candidateCount = state ? state.candidateCount : null;
  const selectedClassifications = state ? state.selectedClassifications : [];

  return (
    <div data-h2-padding-bottom="base(x1) p-tablet(x3)">
      <Hero
        centered
        title={intl.formatMessage({
          defaultMessage: "Find digital talent",
          id: "9Jkoms",
          description: "Title displayed on hero for Search and Request pages.",
        })}
        subtitle={intl.formatMessage({
          defaultMessage: "Submit your filtered request for talent.",
          id: "TU9sk7",
          description:
            "Subtitle displayed on hero for Search and Request pages.",
        })}
      >
        <div
          data-h2-background-color="base(foreground)"
          data-h2-radius="base(rounded)"
          data-h2-padding="base(x1) p-tablet(x2)"
          data-h2-shadow="base(large)"
          data-h2-text-align="base(left)"
        >
          <CreateRequest
            applicantFilter={applicantFilter as ApplicantFilterInput}
            searchFormInitialValues={initialValues}
            candidateCount={candidateCount}
            selectedClassifications={selectedClassifications}
          />
        </div>
      </Hero>
    </div>
  );
};

export default RequestPage;
