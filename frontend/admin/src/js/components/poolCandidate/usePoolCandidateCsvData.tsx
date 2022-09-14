import React from "react";
import { DownloadCsvProps } from "@common/components/Link";
import { useIntl } from "react-intl";
import {
  getJobLookingStatus,
  getLanguage,
  getProvinceOrTerritory,
} from "@common/constants/localizedConstants";
import { PoolCandidate } from "../../api/generated";

const usePoolCandidateCsvData = (candidates: PoolCandidate[]) => {
  const intl = useIntl();

  const headers: DownloadCsvProps["headers"] = [
    {
      key: "availability",
      label: intl.formatMessage({
        defaultMessage: "Availability",
        id: "l62TJM",
        description: "CSV Header, Availability column",
      }),
    },
    {
      key: "firstName",
      label: intl.formatMessage({
        defaultMessage: "First Name",
        id: "ukL9do",
        description: "CSV Header, First Name column",
      }),
    },
    {
      key: "lastName",
      label: intl.formatMessage({
        defaultMessage: "Last Name",
        id: "DlBusi",
        description: "CSV Header, Last Name column",
      }),
    },
    {
      key: "email",
      label: intl.formatMessage({
        defaultMessage: "Email",
        id: "H02JZe",
        description: "CSV Header, Email column",
      }),
    },
    {
      key: "preferredLanguage",
      label: intl.formatMessage({
        defaultMessage: "Preferred Language",
        id: "p0e6Y5",
        description: "CSV Header, Preferred Language column",
      }),
    },
    {
      key: "currentCity",
      label: intl.formatMessage({
        defaultMessage: "Current City",
        id: "CLOuJF",
        description: "CSV Header, Current City column",
      }),
    },
    {
      key: "currentProvince",
      label: intl.formatMessage({
        defaultMessage: "Current Province",
        id: "Xo0M3N",
        description: "CSV Header, Current Province column",
      }),
    },
    {
      key: "dateReceived",
      label: intl.formatMessage({
        defaultMessage: "Date Received",
        id: "j9m5qA",
        description: "CSV Header, Date Received column",
      }),
    },
    {
      key: "expiryDate",
      label: intl.formatMessage({
        defaultMessage: "Expiry Date",
        id: "BNEY8G",
        description: "CSV Header, Expiry Date column",
      }),
    },
  ];

  const data: DownloadCsvProps["data"] = React.useMemo(() => {
    const flattenedCandidates: DownloadCsvProps["data"] = candidates.map(
      ({ user, submittedAt, expiryDate }) => ({
        availability: user.jobLookingStatus
          ? intl.formatMessage(
              getJobLookingStatus(user.jobLookingStatus as string, "short"),
            )
          : "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        preferredLanguage: user.preferredLang
          ? intl.formatMessage(getLanguage(user.preferredLang as string))
          : "",
        currentCity: user.currentCity || "",
        currentProvince: user.currentProvince
          ? intl.formatMessage(
              getProvinceOrTerritory(user.currentProvince as string),
            )
          : "",
        dateReceived: submittedAt || "",
        expiryDate: expiryDate || "",
      }),
    );

    return flattenedCandidates;
  }, [candidates, intl]);

  return { headers, data };
};

export default usePoolCandidateCsvData;
