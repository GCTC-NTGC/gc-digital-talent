import React from "react";
import { FormattedMessage } from "react-intl";
import { Link, Button } from "@common/components";
import { poolCandidateCreatePath } from "../../adminRoutes";
import { PoolCandidatesTableApi } from "./PoolCandidatesTable";

export const PoolCandidatePage: React.FC<{ poolId: string }> = ({ poolId }) => {
  return (
    <div>
      <header
        data-h2-bg-color="b(linear-70[lightpurple][lightnavy])"
        data-h2-padding="b(top-bottom, l) b(right-left, xl)"
      >
        <div data-h2-flex-grid="b(middle, expanded, flush, l)">
          <div data-h2-flex-item="b(1of1) m(3of5)">
            <h1
              data-h2-font-color="b(white)"
              data-h2-font-weight="b(800)"
              data-h2-margin="b(all, none)"
              style={{ letterSpacing: "-2px" }}
            >
              <FormattedMessage
                description="Heading displayed above the Pool Candidate Table component."
                defaultMessage="Pool Candidates"
              />
            </h1>
          </div>
          <div
            data-h2-flex-item="b(1of1) m(2of5)"
            data-h2-text-align="m(right)"
          >
            <Button color="white" mode="outline">
              <Link href={poolCandidateCreatePath(poolId)} title="">
                <FormattedMessage
                  description="Heading displayed above the Create Pool Candidate form."
                  defaultMessage="Create Pool Candidate"
                />
              </Link>
            </Button>
          </div>
        </div>
      </header>
      <PoolCandidatesTableApi poolId={poolId} />
    </div>
  );
};

export default PoolCandidatePage;
