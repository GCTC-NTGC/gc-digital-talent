import * as React from "react";
import { useIntl } from "react-intl";
import { useLocation } from "@common/helpers/router";
import { PoolCandidateFilter } from "../../api/generated";
import { CreateRequest } from "./CreateRequest";
import { FormValues as SearchFormValues } from "../search/SearchForm";

type LocationState = {
  some: {
    candidateFilter: PoolCandidateFilter;
    initialValues: SearchFormValues;
    candidateCount: number;
  };
};

const RequestPage: React.FunctionComponent = () => {
  const intl = useIntl();
  const location = useLocation();
  const state = location.state as LocationState;
  const poolCandidateFilter = state ? state.some.candidateFilter : null;
  const initialValues = state ? state.some.initialValues : null;
  const candidateCount = state ? state.some.candidateCount : null;

  return (
    <section
      style={{
        background:
          "linear-gradient(to right, rgba(103, 76, 144, 0.9) 0%, rgba(29, 44, 76, 1) 100%) no-repeat",
        backgroundSize: "calc(100%) calc(85%)",
        backgroundPosition: "bottom",
      }}
      data-h2-padding="b(0, 0, x2, 0)"
    >
      <h1
        data-h2-margin="b(x.5, 0, 0, 0)"
        data-h2-text-align="b(center)"
        data-h2-background-color="b(dt-white)"
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
        data-h2-padding="b(x2, x4, x2, x2)"
        data-h2-background-color="b(dt-white)"
        data-h2-display="b(flex)"
        data-h2-justify-content="b(center)"
        data-h2-align-items="b(center)"
        style={{ minHeight: "70rem" }}
      >
        <CreateRequest
          poolCandidateFilter={poolCandidateFilter}
          searchFormInitialValues={initialValues}
          candidateCount={candidateCount}
        />
      </div>
    </section>
  );
};

export default RequestPage;
