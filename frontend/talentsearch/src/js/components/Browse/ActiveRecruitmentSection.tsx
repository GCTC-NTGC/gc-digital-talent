import React from "react";
import { RocketLaunchIcon } from "@heroicons/react/24/outline";
import { useIntl } from "react-intl";
import Heading from "@common/components/Heading";
import PoolCard from "./PoolCard";
import { PoolAdvertisement } from "../../api/generated";

export interface ActiveRecruitmentSectionProps {
  activeRecruitmentPools: PoolAdvertisement[];
}

export const ActiveRecruitmentSection = ({
  activeRecruitmentPools,
}: ActiveRecruitmentSectionProps) => {
  const intl = useIntl();

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
        {activeRecruitmentPools.length ? (
          <ul
            data-h2-margin="base(0)"
            data-h2-padding="base(0)"
            data-h2-list-style="base(none)"
          >
            {activeRecruitmentPools.map((poolAdvertisement) => (
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
