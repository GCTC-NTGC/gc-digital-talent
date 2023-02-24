/* eslint-disable no-underscore-dangle */
import * as React from "react";
import { useIntl } from "react-intl";
import { useLocation } from "react-router-dom";

import Hero from "~/components/Hero/Hero";
import { ApplicantFilterInput } from "~/api/generated";
import { SimpleClassification } from "~/types/pool";
import { FormValues as SearchFormValues } from "~/types/searchRequest";

import CreateRequest from "./components/RequestForm";

type LocationState = {
  applicantFilter: ApplicantFilterInput;
  initialValues: SearchFormValues;
  candidateCount: number;
  selectedClassifications: SimpleClassification[];
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
        contentAlignment="left"
        title={intl.formatMessage({
          defaultMessage: "Search the Digital Talent Pool",
          id: "NXzsK4",
          description: "Main heading displayed at the top of request page.",
        })}
      >
        <CreateRequest
          applicantFilter={applicantFilter as ApplicantFilterInput}
          searchFormInitialValues={initialValues}
          candidateCount={candidateCount}
          selectedClassifications={selectedClassifications}
        />
      </Hero>
    </div>
  );
};

export default RequestPage;
