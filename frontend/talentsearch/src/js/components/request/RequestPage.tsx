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
    <section>
      <div data-h2-container="b(center, medium, x1) p-tablet(center, medium, x2)">
        <h1
          data-h2-margin="b(x2.5, 0, 0, 0) p-tablet(x4, 0, 0, 0)"
          data-h2-font-size="b(h1, 1)"
          data-h2-font-weight="b(700)"
          data-h2-text-align="b(center)"
          style={{ letterSpacing: "-2px" }}
        >
          {intl.formatMessage({
            defaultMessage: "Search the Digital Talent Pool",
            description: "Main heading displayed at the top of request page.",
          })}
        </h1>
      </div>
      <div
        data-h2-background-color="b(dt-linear)"
        data-h2-margin="b(x3, 0, 0, 0) p-tablet(x6, 0, 0, 0)"
        data-h2-position="b(relative)"
      >
        <div
          data-h2-position="b(relative)"
          data-h2-offset="b(-x2, auto, auto, auto) p-tablet(-x4, auto, auto, auto)"
        >
          <div data-h2-container="b(center, medium, x1) p-tablet(center, medium, x2)">
            <div
              data-h2-radius="b(s)"
              data-h2-shadow="b(xl)"
              data-h2-padding="b(x1) p-tablet(x2)"
              data-h2-background-color="b(dt-white)"
            >
              <CreateRequest
                poolCandidateFilter={poolCandidateFilter}
                searchFormInitialValues={initialValues}
                candidateCount={candidateCount}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RequestPage;
