/* eslint-disable no-underscore-dangle */
import * as React from "react";
import { useIntl } from "react-intl";
import { useLocation } from "react-router-dom";
import { checkFeatureFlag } from "@common/helpers/runtimeVariable";
import { ApplicantFilterInput, PoolCandidateFilter } from "../../api/generated";
import { CreateRequest } from "./CreateRequest";
import { CreateRequest as OldCreateRequest } from "./deprecated/CreateRequest";
import { FormValues as SearchFormValues } from "../search/SearchForm";
import { SimpleClassification } from "../../types/poolUtils";

type LocationState = {
  applicantFilter: ApplicantFilterInput;
  candidateFilter: PoolCandidateFilter; // TODO: Remove candidateFilter when deprecated
  initialValues: SearchFormValues;
  candidateCount: number;
  selectedClassifications: SimpleClassification[];
};

const RequestPage = () => {
  const intl = useIntl();
  const location = useLocation();
  const state = location.state as LocationState;

  const applicantFilter = state ? state.applicantFilter : null;
  const candidateFilter = state ? state.candidateFilter : null; // TODO: Remove candidateFilter when deprecated
  const initialValues = state ? state.initialValues : undefined;
  const candidateCount = state ? state.candidateCount : null;
  const selectedClassifications = state ? state.selectedClassifications : [];

  const CreateRequestForm = checkFeatureFlag("FEATURE_APPLICANTSEARCH") ? (
    <CreateRequest
      applicantFilter={applicantFilter as ApplicantFilterInput}
      searchFormInitialValues={initialValues}
      candidateCount={candidateCount}
      selectedClassifications={selectedClassifications}
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
      data-h2-background-color="base(dt-gray.15)"
      data-h2-border="base(top, 1px, solid, dt-gray)"
    >
      <div data-h2-container="base(center, medium, x1) p-tablet(center, medium, x2)">
        <h1
          data-h2-padding="base(x2.5, 0, 0, 0) p-tablet(x4, 0, 0, 0)"
          data-h2-font-size="base(h1, 1)"
          data-h2-font-weight="base(700)"
          data-h2-text-align="base(center)"
          style={{ letterSpacing: "-2px" }}
        >
          {intl.formatMessage({
            defaultMessage: "Search the Digital Talent Pool",
            id: "NXzsK4",
            description: "Main heading displayed at the top of request page.",
          })}
        </h1>
      </div>
      <div
        data-h2-background-color="base(dt-linear)"
        data-h2-margin="base(x3, 0, 0, 0) p-tablet(x6, 0, 0, 0)"
        data-h2-position="base(relative)"
      >
        <div
          data-h2-container="base(center, medium, x1) p-tablet(center, medium, x2)"
          data-h2-position="base(relative)"
        >
          <div
            data-h2-background-color="base(dt-white)"
            data-h2-radius="base(s)"
            data-h2-shadow="base(m)"
            data-h2-padding="base(x1) p-tablet(x2)"
            data-h2-position="base(relative)"
            data-h2-offset="base(-x2, auto, auto, auto) p-tablet(-x4, auto, auto, auto)"
          >
            {CreateRequestForm}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RequestPage;
