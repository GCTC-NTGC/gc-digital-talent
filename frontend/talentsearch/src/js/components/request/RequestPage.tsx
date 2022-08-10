/* eslint-disable no-underscore-dangle */
import * as React from "react";
import { useIntl } from "react-intl";
import { useLocation } from "@common/helpers/router";
import { checkFeatureFlag } from "@common/helpers/runtimeVariable";
import { ApplicantFilterInput, PoolCandidateFilter } from "../../api/generated";
import { CreateRequest } from "./CreateRequest";
import { CreateRequest as OldCreateRequest } from "./deprecated/CreateRequest";
import { FormValues as SearchFormValues } from "../search/SearchForm";

type LocationState = {
  some: {
    applicantFilter: ApplicantFilterInput;
    candidateFilter: PoolCandidateFilter; // TODO: Remove candidateFilter when deprecated
    initialValues: SearchFormValues;
    candidateCount: number;
  };
};

const RequestPage: React.FunctionComponent = () => {
  const intl = useIntl();
  const location = useLocation();
  const state = location.state as LocationState;
  const applicantFilter = state ? state.some.applicantFilter : null;
  const candidateFilter = state ? state.some.candidateFilter : null; // TODO: Remove candidateFilter when deprecated
  const initialValues = state ? state.some.initialValues : null;
  const candidateCount = state ? state.some.candidateCount : null;

  const CreateRequestForm = checkFeatureFlag("FEATURE_APPLICANTSEARCH") ? (
    <CreateRequest
      applicantFilter={applicantFilter as ApplicantFilterInput}
      searchFormInitialValues={initialValues}
      candidateCount={candidateCount}
    />
  ) : (
    <OldCreateRequest
      poolCandidateFilter={candidateFilter as PoolCandidateFilter}
      searchFormInitialValues={initialValues}
      candidateCount={candidateCount}
    />
  );

  return (
    <section
      style={{
        background:
          "linear-gradient(to right, rgba(103, 76, 144, 0.9) 0%, rgba(29, 44, 76, 1) 100%) no-repeat",
        backgroundSize: "calc(100%) calc(85%)",
        backgroundPosition: "bottom",
      }}
      data-h2-padding="b(bottom, l)"
    >
      <h1
        data-h2-margin="b(top, s)"
        data-h2-text-align="b(center)"
        data-h2-bg-color="b(white)"
      >
        {intl.formatMessage({
          defaultMessage: "Search the Digital Talent Pool",
          description: "Main heading displayed at the top of request page.",
        })}
      </h1>
      <div
        data-h2-container="b(center, xl)"
        data-h2-radius="b(s)"
        data-h2-shadow="b(s)"
        data-h2-padding="b(all, l) b(right, xxl)"
        data-h2-bg-color="b(white)"
        data-h2-display="b(flex)"
        data-h2-justify-content="b(center)"
        data-h2-align-items="b(center)"
        style={{ minHeight: "70rem" }}
      >
        {CreateRequestForm}
      </div>
    </section>
  );
};

export default RequestPage;
