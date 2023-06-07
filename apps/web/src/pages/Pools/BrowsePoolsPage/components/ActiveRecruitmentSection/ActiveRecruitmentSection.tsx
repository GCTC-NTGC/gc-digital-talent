import React from "react";
import RocketLaunchIcon from "@heroicons/react/24/outline/RocketLaunchIcon";
import { useIntl } from "react-intl";

import { Heading } from "@gc-digital-talent/ui";

import { Pool } from "~/api/generated";

import PoolCard from "../PoolCard/PoolCard";

export interface ActiveRecruitmentSectionProps {
  pools: Pool[];
}

const ActiveRecruitmentSection = ({ pools }: ActiveRecruitmentSectionProps) => {
  const intl = useIntl();

  pools.sort(
    (p1, p2) =>
      (p1.closingDate ?? "").localeCompare(p2.closingDate ?? "") || // first level sort: by closing date whichever one closes first should appear first on the list
      (p1.publishedAt ?? "").localeCompare(p2.publishedAt ?? ""), // second level sort: whichever one was published first should appear first
  );

  return (
    <>
      <Heading
        level="h2"
        Icon={RocketLaunchIcon}
        color="blue"
        data-h2-margin="base(0, 0, x0.5, 0)"
      >
        {intl.formatMessage({
          defaultMessage: "Active talent recruitment processes",
          id: "YImugL",
          description: "Title for the current jobs recruiting candidates",
        })}
      </Heading>
      <p data-h2-margin="base(x1, 0)">
        {intl.formatMessage({
          id: "C7sYnb",
          defaultMessage:
            "This platform allows you to apply to recruitment processes that make it easy for hiring managers to find you. This page offers you a snapshot of our open recruitment processes. Come back and check this page often!",
          description:
            "Description of how the application process works, paragraph one",
        })}
      </p>
      <p>
        {intl.formatMessage({
          id: "vNFHWp",
          defaultMessage:
            "Your application to a process will be reviewed by our team and if it's a match, you will be invited to an assessment. Once accepted, managers can contact you about job opportunities.",
          description:
            "Description of how the application process works, paragraph two",
        })}
      </p>
      <div data-h2-padding="base(x2, 0, 0, 0) p-tablet(x3, 0, 0, 0)">
        {pools.length ? (
          <ul
            data-h2-margin="base(0)"
            data-h2-padding="base(0)"
            data-h2-list-style="base(none)"
          >
            {pools.map((pool) => (
              <li key={pool.id}>
                <PoolCard pool={pool} />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </>
  );
};

export default ActiveRecruitmentSection;
