import { useIntl } from "react-intl";
import { useWatch } from "react-hook-form";

import { DATE_SEGMENT, DateInput } from "@gc-digital-talent/forms";
import { errorMessages } from "@gc-digital-talent/i18n";
import { strToFormDate } from "@gc-digital-talent/date-helpers";
import { nodeToString } from "@gc-digital-talent/helpers";
import { EducationType, EducationStatus } from "@gc-digital-talent/graphql";

import type {
  EducationFormValues,
  SubExperienceFormProps,
} from "~/types/experience";

const DateFields = ({ labels }: SubExperienceFormProps) => {
  const intl = useIntl();
  const todayDate = new Date();

  const watchStartDate = useWatch<EducationFormValues>({ name: "startDate" });
  const watchIssueDate = useWatch<EducationFormValues>({
    name: "issueDate",
  });
  const watchProspectiveIssueDate = useWatch<EducationFormValues>({
    name: "prospectiveIssueDate",
  });
  const watchEducationType = useWatch<{ educationType: EducationType }>({
    name: "educationType",
  });
  const watchEducationStatus = useWatch<{ educationStatus: EducationStatus }>({
    name: "educationStatus",
  });

  const licenseOrCertification =
    watchEducationType === EducationType.LicenseAccreditation ||
    watchEducationType === EducationType.ProfessionalCertification;
  const inProgress = watchEducationStatus === EducationStatus.InProgress;

  if (
    watchEducationStatus === EducationStatus.DidNotComplete &&
    licenseOrCertification
  ) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      {licenseOrCertification ? (
        watchEducationStatus === EducationStatus.InProgress ? (
          <>
            <DateInput
              id="prospectiveIssueDate"
              legend={labels.prospectiveIssueDate}
              name="prospectiveIssueDate"
              round="floor"
              show={[DATE_SEGMENT.Month, DATE_SEGMENT.Year]}
              rules={{
                required: intl.formatMessage(errorMessages.required),
                min: {
                  value: strToFormDate(todayDate.toISOString()),
                  message: intl.formatMessage(errorMessages.futureDate),
                },
              }}
            />
            <DateInput
              id="prospectiveExpiryDate"
              legend={labels.prospectiveExpiryDate}
              name="prospectiveExpiryDate"
              round="ceil"
              show={[DATE_SEGMENT.Month, DATE_SEGMENT.Year]}
              rules={{
                required: intl.formatMessage(errorMessages.required),
                min: {
                  value: watchProspectiveIssueDate
                    ? String(watchProspectiveIssueDate)
                    : "",
                  message: intl.formatMessage(errorMessages.minDateSelfLabel, {
                    labelSelf: nodeToString(
                      labels.prospectiveExpiryDate,
                    ).toLowerCase(),
                    labelAssociated: nodeToString(
                      labels.prospectiveIssueDate,
                    ).toLowerCase(),
                  }),
                },
              }}
            />
          </>
        ) : (
          <>
            <DateInput
              id="issueDate"
              legend={labels.issueDate}
              name="issueDate"
              round="floor"
              show={[DATE_SEGMENT.Month, DATE_SEGMENT.Year]}
              rules={{
                required: intl.formatMessage(errorMessages.required),
                max: {
                  value: strToFormDate(todayDate.toISOString()),
                  message: intl.formatMessage(
                    errorMessages.mustNotBeFutureIssueDate,
                  ),
                },
              }}
            />
            <DateInput
              id="expiryDate"
              legend={labels.expiryDate}
              name="expiryDate"
              round="ceil"
              show={[DATE_SEGMENT.Month, DATE_SEGMENT.Year]}
              rules={{
                required: intl.formatMessage(errorMessages.required),
                min: {
                  value: watchIssueDate ? String(watchIssueDate) : "",
                  message: intl.formatMessage(errorMessages.minDateSelfLabel, {
                    labelSelf: nodeToString(labels.expiryDate).toLowerCase(),
                    labelAssociated: nodeToString(
                      labels.issueDate,
                    ).toLowerCase(),
                  }),
                },
              }}
            />
          </>
        )
      ) : (
        <>
          <DateInput
            id="startDate"
            legend={labels.startDate}
            name="startDate"
            round="floor"
            show={[DATE_SEGMENT.Month, DATE_SEGMENT.Year]}
            rules={{
              required: intl.formatMessage(errorMessages.required),
              max: {
                value: strToFormDate(todayDate.toISOString()),
                message: intl.formatMessage(
                  errorMessages.mustNotBeFutureStartDate,
                ),
              },
            }}
          />
          {inProgress ? (
            <DateInput
              id="expectedEndDate"
              legend={labels.expectedEndDate}
              name="expectedEndDate"
              round="ceil"
              show={[DATE_SEGMENT.Month, DATE_SEGMENT.Year]}
              rules={{
                required: intl.formatMessage(errorMessages.required),
                min: {
                  value: strToFormDate(todayDate.toISOString()),
                  message: intl.formatMessage(errorMessages.futureDate),
                },
              }}
            />
          ) : (
            <DateInput
              id="endDate"
              legend={labels.endDate}
              name="endDate"
              round="ceil"
              show={[DATE_SEGMENT.Month, DATE_SEGMENT.Year]}
              rules={{
                required: intl.formatMessage(errorMessages.required),
                min: {
                  value: watchStartDate ? String(watchStartDate) : "",
                  message: intl.formatMessage(errorMessages.minDateSelfLabel, {
                    labelSelf: nodeToString(labels.endDate).toLowerCase(),
                    labelAssociated: nodeToString(
                      labels.startDate,
                    ).toLowerCase(),
                  }),
                },
                max: {
                  value: strToFormDate(todayDate.toISOString()),
                  message: intl.formatMessage(
                    errorMessages.mustNotBeFutureEndDate,
                  ),
                },
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default DateFields;
