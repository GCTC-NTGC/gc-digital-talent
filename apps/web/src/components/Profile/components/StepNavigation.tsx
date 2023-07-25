import React from "react";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@gc-digital-talent/ui";
import { useFeatureFlags } from "@gc-digital-talent/env";
import { toast } from "@gc-digital-talent/toast";
import { errorMessages } from "@gc-digital-talent/i18n";

import useRoutes from "~/hooks/useRoutes";
import applicationMessages from "~/messages/applicationMessages";
import {
  PoolCandidate,
  useUpdateApplicationMutation,
  ApplicationStep,
} from "~/api/generated";
import {
  getMissingLanguageRequirements,
  PartialUser as LanguageUser,
} from "~/utils/languageUtils";
import {
  hasEmptyRequiredFields as hasEmptyDEIRequiredFields,
  PartialUser as DeiUser,
} from "~/validators/profile/diversityEquityInclusion";
import { useApplicationContext } from "~/pages/Applications/ApplicationContext";
import { useProfileFormContext } from "./ProfileFormContext";

type ProfileActionFormValues = {
  action: "continue" | "quit";
};

interface StepNavigationProps {
  application: PoolCandidate;
  user: DeiUser & LanguageUser;
  isValid?: boolean;
}

const StepNavigation = ({
  application,
  user,
  isValid,
}: StepNavigationProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const navigate = useNavigate();
  const { applicantDashboard } = useFeatureFlags();
  const { dirtySections } = useProfileFormContext();
  const [{ fetching: submitting }, executeSubmitMutation] =
    useUpdateApplicationMutation();
  const { followingPageUrl, isIAP } = useApplicationContext();
  const nextStepPath =
    followingPageUrl ?? paths.applicationCareerTimelineIntro(application.id);
  const methods = useForm<ProfileActionFormValues>({
    defaultValues: {
      action: "continue",
    },
  });
  const { setValue, register } = methods;
  const actionProps = register("action");

  const checkDirtySections = () => {
    if (dirtySections.length) {
      const firstDirtySection = document.getElementById(
        `${dirtySections[0]}-section`,
      );

      toast.warning(
        intl.formatMessage({
          defaultMessage:
            "Please, save or close any open forms before continuing.",
          description:
            "Message displayed to users when they attempt to quit the profile form with unsaved changes",
          id: "kf5Td+",
        }),
      );

      if (firstDirtySection) {
        setTimeout(() => {
          firstDirtySection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 10);
      }

      return true;
    }

    return false;
  };

  const handleNavigation = (values: ProfileActionFormValues) => {
    const hasDirtySections = checkDirtySections();

    if (!hasDirtySections) {
      if (values.action === "quit") {
        navigate(
          applicantDashboard
            ? paths.profileAndApplications({ fromIapDraft: isIAP })
            : paths.myProfile(),
        );
        return true;
      }

      if (isValid) {
        executeSubmitMutation({
          id: application.id,
          application: {
            insertSubmittedStep: ApplicationStep.ReviewYourProfile,
          },
        })
          .then((res) => {
            if (res.data) {
              navigate(nextStepPath);
            }
          })
          .catch(() => {
            toast.error(
              intl.formatMessage(errorMessages.unknownErrorRequestErrorTitle),
            );
          });
        return true;
      }
      toast.error(
        intl.formatMessage({
          defaultMessage:
            "Please complete all required fields before continuing.",
          id: "G1jegJ",
          description:
            "Error message displayed when user attempts to submit incomplete profile",
        }),
      );
      const missingLanguageRequirements = getMissingLanguageRequirements(
        user,
        application?.pool,
      );
      if (missingLanguageRequirements.length > 0) {
        const requirements = missingLanguageRequirements.map((requirement) => (
          <li key={requirement.id}>{intl.formatMessage(requirement)}</li>
        ));
        toast.error(
          intl.formatMessage(
            {
              defaultMessage:
                "You are missing the following language requirements: {requirements}",
              id: "CPHTk9",
              description:
                "Error message when a user does not meet a pools language requirements",
            },
            { requirements },
          ),
        );
      }
      const completeDEI = !hasEmptyDEIRequiredFields(user, application?.pool);
      if (!completeDEI) {
        toast.error(
          intl.formatMessage(applicationMessages.reservedForIndigenous),
        );
      }
    }
    return false;
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleNavigation)}>
        <div
          data-h2-display="base(flex)"
          data-h2-gap="base(x.25, x.5)"
          data-h2-flex-wrap="base(wrap)"
          data-h2-flex-direction="base(column) l-tablet(row)"
          data-h2-align-items="base(flex-start) l-tablet(center)"
        >
          <Button
            type="submit"
            color="primary"
            mode="solid"
            {...actionProps}
            value="continue"
            onClick={() => setValue("action", "continue")}
            disabled={submitting}
          >
            {intl.formatMessage(applicationMessages.saveContinue)}
          </Button>
          <Button
            type="submit"
            mode="inline"
            color="secondary"
            {...actionProps}
            value="quit"
            onClick={() => setValue("action", "quit")}
            disabled={submitting}
          >
            {intl.formatMessage(applicationMessages.saveQuit)}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default StepNavigation;
