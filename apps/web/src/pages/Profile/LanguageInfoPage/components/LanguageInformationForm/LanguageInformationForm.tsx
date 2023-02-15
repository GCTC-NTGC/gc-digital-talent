import React from "react";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { SubmitHandler } from "react-hook-form";
import compact from "lodash/compact";
import omit from "lodash/omit";

import { toast } from "@gc-digital-talent/toast";
import { errorMessages, navigationMessages } from "@gc-digital-talent/i18n";
import { BasicForm, Checklist } from "@gc-digital-talent/forms";

import { getFullPoolAdvertisementTitleHtml } from "~/utils/poolUtils";
import {
  Applicant,
  BilingualEvaluation,
  GetLanguageInformationQuery,
  PoolCandidate,
  UpdateUserAsUserInput,
  UpdateUserAsUserMutation,
  User,
} from "~/api/generated";
import useRoutes from "~/hooks/useRoutes";
import useApplicationInfo from "~/hooks/useApplicationInfo";
import profileMessages from "~/messages/profileMessages";
import ProfileFormWrapper, {
  ProfileFormFooter,
} from "~/components/ProfileFormWrapper/ProfileFormWrapper";
import { getMissingLanguageRequirements } from "~/utils/languageUtils";
import MissingLanguageRequirements from "~/components/MissingLanguageRequirements";

import ConsideredLanguages from "../ConsideredLanguages";

export type FormValues = Pick<
  User,
  | "bilingualEvaluation"
  | "comprehensionLevel"
  | "writtenLevel"
  | "verbalLevel"
  | "estimatedLanguageAbility"
> & {
  consideredPositionLanguages: string[];
};

const formValuesToSubmitData = (formValues: FormValues) => {
  const data = {
    ...omit(formValues, ["consideredPositionLanguages"]),
    lookingForEnglish:
      formValues.consideredPositionLanguages.includes("lookingForEnglish"),
    lookingForFrench:
      formValues.consideredPositionLanguages.includes("lookingForFrench"),
    lookingForBilingual: formValues.consideredPositionLanguages.includes(
      "lookingForBilingual",
    ),
  };

  // various IF statements are to clean up cases where user toggles the conditionally rendered stuff before submitting
  // IE, picks looking for bilingual, then picks completed english evaluation before submitting, the conditionally rendered stuff still exists and can get submitted
  if (!data.lookingForBilingual) {
    data.bilingualEvaluation = null;
  }
  if (
    data.bilingualEvaluation !== BilingualEvaluation.CompletedEnglish &&
    data.bilingualEvaluation !== BilingualEvaluation.CompletedFrench
  ) {
    data.comprehensionLevel = null;
    data.writtenLevel = null;
    data.verbalLevel = null;
  }
  if (data.bilingualEvaluation !== BilingualEvaluation.NotCompleted) {
    data.estimatedLanguageAbility = null;
  }

  return data;
};

const dataToFormValues = (
  data: GetLanguageInformationQuery["me"],
): FormValues => {
  return {
    consideredPositionLanguages: compact([
      data?.lookingForEnglish ? "lookingForEnglish" : "",
      data?.lookingForFrench ? "lookingForFrench" : "",
      data?.lookingForBilingual ? "lookingForBilingual" : "",
    ]),
    bilingualEvaluation: data?.bilingualEvaluation
      ? data.bilingualEvaluation
      : BilingualEvaluation.CompletedEnglish,
    comprehensionLevel: data?.comprehensionLevel,
    writtenLevel: data?.writtenLevel,
    verbalLevel: data?.verbalLevel,
    estimatedLanguageAbility: data?.estimatedLanguageAbility,
  };
};

export type LanguageInformationUpdateHandler = (
  id: string,
  data: UpdateUserAsUserInput,
) => Promise<UpdateUserAsUserMutation["updateUserAsUser"]>;

const LanguageInformationForm: React.FunctionComponent<{
  initialData: User;
  application?: PoolCandidate;
  submitHandler: LanguageInformationUpdateHandler;
}> = ({ initialData, application, submitHandler }) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const paths = useRoutes();
  const { id: applicationId, returnRoute } = useApplicationInfo(initialData.id);

  const labels = {
    consideredPositionLanguages: intl.formatMessage({
      defaultMessage:
        "Select the positions you would like to be considered for",
      id: "ntUOoz",
      description:
        "Legend for considered position languages check list in language information form",
    }),
    bilingualEvaluation: intl.formatMessage({
      defaultMessage: "Bilingual evaluation",
      id: "X354at",
      description:
        "Legend bilingual evaluation status in language information form",
    }),
    comprehensionLevel: intl.formatMessage({
      defaultMessage: "Comprehension",
      id: "W4Svkd",
      description:
        "Label displayed on the language information form comprehension field.",
    }),
    writtenLevel: intl.formatMessage({
      defaultMessage: "Written",
      id: "x5C9Ab",
      description:
        "Label displayed on the language information form written field.",
    }),
    verbalLevel: intl.formatMessage({
      defaultMessage: "Verbal",
      id: "rywI3C",
      description:
        "Label displayed on the language information form verbal field.",
    }),
    estimatedLanguageAbility: intl.formatMessage({
      defaultMessage: "Second language proficiency level",
      id: "T1TKNL",
      description:
        "Legend for second language proficiency level in language information form",
    }),
  };

  const handleSubmit: SubmitHandler<FormValues> = async (formValues) => {
    await submitHandler(initialData.id, formValuesToSubmitData(formValues))
      .then(() => {
        navigate(returnRoute);
        toast.success(intl.formatMessage(profileMessages.userUpdated));
      })
      .catch(() => {
        toast.error(intl.formatMessage(profileMessages.updatingFailed));
      });
  };

  const ConsideredLangItems: { value: string; label: string }[] = [
    {
      value: "lookingForEnglish",
      label: intl.formatMessage({
        defaultMessage: "English positions",
        id: "JBRqD9",
        description: "Message for the english positions option",
      }),
    },
    {
      value: "lookingForFrench",
      label: intl.formatMessage({
        defaultMessage: "French positions",
        id: "5pQfyv",
        description: "Message for the french positions option",
      }),
    },
    {
      value: "lookingForBilingual",
      label: intl.formatMessage({
        defaultMessage: "Bilingual positions (English and French)",
        id: "Mu+1pI",
        description: "Message for the bilingual positions option",
      }),
    },
  ];

  const applicationBreadcrumbs = application
    ? [
        {
          label: intl.formatMessage({
            defaultMessage: "My Applications",
            id: "mq4G8h",
            description:
              "'My Applications' breadcrumb from applicant profile wrapper.",
          }),
          url: paths.applications(application.user.id),
        },
        {
          label: getFullPoolAdvertisementTitleHtml(
            intl,
            application.poolAdvertisement,
          ),
          url: paths.pool(application.pool.id),
        },
        {
          label: intl.formatMessage(navigationMessages.stepOne),
          url: paths.reviewApplication(applicationId ?? ""),
        },
        {
          label: intl.formatMessage({
            defaultMessage: "Language Information",
            id: "/k21MP",
            description: "Display Text for Language Information Form Page Link",
          }),
          url: `${paths.languageInformation(initialData.id)}${
            applicationId ? `?${applicationId}` : ``
          }`,
        },
      ]
    : [];

  const missingLanguageRequirements = getMissingLanguageRequirements(
    initialData as Applicant,
    application?.poolAdvertisement,
  );

  return (
    <ProfileFormWrapper
      description={intl.formatMessage({
        defaultMessage:
          "Use the form below to help us better understand your language preferences and capabilities",
        id: "TGCq/w",
        description:
          "Description text for Profile Form wrapper in Language Information Form",
      })}
      title={intl.formatMessage({
        defaultMessage: "Language Information",
        id: "R5aTZ9",
        description:
          "Title for Profile Form wrapper in Language Information Form",
      })}
      crumbs={
        applicationBreadcrumbs?.length
          ? applicationBreadcrumbs
          : [
              {
                label: intl.formatMessage({
                  defaultMessage: "Language Information",
                  id: "/k21MP",
                  description:
                    "Display Text for Language Information Form Page Link",
                }),
                url: paths.languageInformation(initialData.id),
              },
            ]
      }
      prefixBreadcrumbs={!application}
    >
      {missingLanguageRequirements.length ? (
        <div data-h2-margin="base(x1, 0)">
          <MissingLanguageRequirements
            applicant={initialData as Applicant}
            poolAdvertisement={application?.poolAdvertisement}
          />
        </div>
      ) : null}
      <BasicForm
        labels={labels}
        cacheKey="lang-info-form"
        onSubmit={handleSubmit}
        options={{
          defaultValues: dataToFormValues(initialData),
        }}
      >
        <div
          data-h2-width="base(100%) p-tablet(75%) l-tablet(50%)"
          data-h2-padding="base(x.5, 0)"
        >
          <Checklist
            idPrefix="considered-position-languages"
            legend={labels.consideredPositionLanguages}
            name="consideredPositionLanguages"
            id="consideredPositionLanguages"
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
            items={ConsideredLangItems}
          />
        </div>
        <ConsideredLanguages labels={labels} />
        <ProfileFormFooter
          mode="saveButton"
          cancelLink={{ href: returnRoute }}
        />
      </BasicForm>
    </ProfileFormWrapper>
  );
};

export default LanguageInformationForm;
