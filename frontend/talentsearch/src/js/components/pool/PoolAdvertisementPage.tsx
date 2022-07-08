import React from "react";
import { useIntl } from "react-intl";
import { BriefcaseIcon } from "@heroicons/react/solid";

import Breadcrumbs from "@common/components/Breadcrumbs";
import type { BreadcrumbsProps } from "@common/components/Breadcrumbs";
import NotFound from "@common/components/NotFound";
import Pending from "@common/components/Pending";
import { getLocale, getLocalizedName } from "@common/helpers/localize";
import { imageUrl } from "@common/helpers/router";

import { useGetPoolAdvertisementQuery } from "../../api/generated";
import type { PoolAdvertisement } from "../../api/generated";
import { useDirectIntakeRoutes } from "../../directIntakeRoutes";
import TALENTSEARCH_APP_DIR from "../../talentSearchConstants";
import commonMessages from "../commonMessages";

interface PoolAdvertisementProps {
  poolAdvertisement: PoolAdvertisement;
}

const PoolAdvertisement = ({ poolAdvertisement }: PoolAdvertisementProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useDirectIntakeRoutes();

  const classification = poolAdvertisement.classifications
    ? poolAdvertisement.classifications[0]
    : null;
  const genericTitle = classification?.genericJobTitles?.length
    ? classification.genericJobTitles[0]
    : null;
  const localizedClassificationName = getLocalizedName(
    classification?.name,
    intl,
  );
  const localizedTitle = getLocalizedName(genericTitle?.name, intl);
  const fullTitle = `${localizedClassificationName} ${localizedTitle} (${classification?.group}-0${classification?.level})`;

  const links = [
    {
      title: intl.formatMessage({
        defaultMessage: "Browse opportunities",
        description: "Breadcrumb title for the browse pools page.",
      }),
      href: paths.home(),
      icon: <BriefcaseIcon style={{ width: "1rem", marginRight: "5px" }} />,
    },
    {
      title: fullTitle,
    },
  ] as BreadcrumbsProps["links"];

  return (
    <>
      <div
        data-h2-padding="b(top-bottom, m) b(right-left, s)"
        data-h2-font-color="b(white)"
        style={{
          background: `url(${imageUrl(
            TALENTSEARCH_APP_DIR,
            "applicant-profile-banner.png",
          )})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div data-h2-container="b(center, m)">
          <h1 data-h2-margin="b(top-bottom, l)">{fullTitle}</h1>
        </div>
      </div>
      <div
        data-h2-bg-color="b(white)"
        data-h2-shadow="b(m)"
        data-h2-padding="b(top-bottom, m)"
      >
        <div data-h2-container="b(center, m)">
          <Breadcrumbs links={links} />
        </div>
      </div>
    </>
  );
};

interface PoolAdvertisementPageProps {
  id: string;
}

const PoolAdvertisementPage = ({ id }: PoolAdvertisementPageProps) => {
  const intl = useIntl();

  const [{ data, fetching, error }] = useGetPoolAdvertisementQuery({
    variables: { id },
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.poolAdvertisement ? (
        <PoolAdvertisement poolAdvertisement={data?.poolAdvertisement} />
      ) : (
        <NotFound
          headingMessage={intl.formatMessage(commonMessages.notFound, {
            type: "Pool",
            id,
          })}
        >
          {intl.formatMessage({
            defaultMessage: "Error, pool unable to be loaded",
            description: "Error message, placeholder",
          })}
        </NotFound>
      )}
    </Pending>
  );
};

export default PoolAdvertisementPage;
