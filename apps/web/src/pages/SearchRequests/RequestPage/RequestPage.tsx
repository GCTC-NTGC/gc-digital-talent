/* eslint-disable no-underscore-dangle */
import * as React from "react";
import { useIntl } from "react-intl";
import { useLocation } from "react-router-dom";

import Hero from "@common/components/Hero/Hero";

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
    <>
      <Hero
        title={intl.formatMessage({
          defaultMessage: "Search the Digital Talent Pool",
          id: "NXzsK4",
          description: "Main heading displayed at the top of request page.",
        })}
      />
      <section
        data-h2-background-color="base(gray.15)"
        data-h2-border-top="base(1px solid gray)"
      >
        <div
          data-h2-background="base(main-linear)"
          data-h2-margin="base(x3, 0, 0, 0) p-tablet(x6, 0, 0, 0)"
          data-h2-position="base(relative)"
        >
          <div
            data-h2-container="base(center, medium, x1) p-tablet(center, medium, x2)"
            data-h2-position="base(relative)"
          >
            <div
              data-h2-background-color="base(white)"
              data-h2-radius="base(s)"
              data-h2-shadow="base(m)"
              data-h2-padding="base(x1) p-tablet(x2)"
              data-h2-position="base(relative)"
              data-h2-location="base(-x2, auto, auto, auto) p-tablet(-x4, auto, auto, auto)"
            >
              <CreateRequest
                applicantFilter={applicantFilter as ApplicantFilterInput}
                searchFormInitialValues={initialValues}
                candidateCount={candidateCount}
                selectedClassifications={selectedClassifications}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default RequestPage;
