import React from "react";
import { RocketLaunchIcon } from "@heroicons/react/24/outline";
import { useIntl } from "react-intl";

import Heading from "@common/components/Heading";

import { PoolAdvertisement } from "~/api/generated";

import PoolCard from "../PoolCard/PoolCard";

export interface ActiveRecruitmentSectionProps {
  pools: PoolAdvertisement[];
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
      <p data-h2-margin="base(x1, 0)" data-h2-font-weight="base(700)">
        {intl.formatMessage({
          id: "gtaSs1",
          defaultMessage:
            "This platform allows you to apply to recruitment processes that makes it easy for hiring managers to find you.",
          description:
            "Description of how the application process works, paragraph one",
        })}
      </p>
      <p>
        {intl.formatMessage({
          id: "EIHPGF",
          defaultMessage:
            "Your application to a process will be reviewed by our team and if it's a match, you will be invited to an assessment. Once accepted, managers will be able to contact you about job opportunities based on your skills.",
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
            {pools.map((poolAdvertisement) => (
              <li key={poolAdvertisement.id}>
                <PoolCard pool={poolAdvertisement} />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </>
  );
};

export default ActiveRecruitmentSection;
