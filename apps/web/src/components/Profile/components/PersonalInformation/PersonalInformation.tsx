import { useIntl } from "react-intl";
import { SubmitHandler } from "react-hook-form";
import UserIcon from "@heroicons/react/24/outline/UserIcon";
import { useQuery } from "urql";
import { ReactNode } from "react";

import {
  Notice,
  Link,
  Loading,
  ToggleSection,
  Well,
} from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";
import { BasicForm } from "@gc-digital-talent/forms";
import { commonMessages } from "@gc-digital-talent/i18n";
import {
  FragmentType,
  getFragment,
  graphql,
  Pool,
} from "@gc-digital-talent/graphql";
import { useLocalStorage } from "@gc-digital-talent/storage";

import profileMessages from "~/messages/profileMessages";
import {
  hasAllEmptyFields,
  hasEmptyRequiredFields,
} from "~/validators/profile/about";
import ToggleForm from "~/components/ToggleForm/ToggleForm";
import useRoutes from "~/hooks/useRoutes";

import { SectionProps } from "../../types";
import FormActions from "../FormActions";
import useSectionInfo from "../../hooks/useSectionInfo";
import { formValuesToSubmitData, dataToFormValues } from "./utils";
import { FormValues } from "./types";
import NullDisplay from "./NullDisplay";
import Display from "./Display";
import FormFields from "./FormFields";

const PersonalInformationForm_Query = graphql(/* GraphQL */ `
  query PersonalInformationForm {
    ...PersonalInformationFormOptions
  }
`);

const ProfilePersonalInformation_Fragment = graphql(/** GraphQL */ `
  fragment ProfilePersonalInformation on User {
    id
    firstName
    lastName
    telephone
    preferredLang {
      value
    }
    preferredLanguageForInterview {
      value
    }
    preferredLanguageForExam {
      value
    }
    citizenship {
      value
    }
    armedForcesStatus {
      value
    }
    ...PersonalInformationDisplay
  }
`);

interface PersonalInformationProps extends SectionProps<Pick<Pool, "id">> {
  query: FragmentType<typeof ProfilePersonalInformation_Fragment>;
}

const NoticeDismissedKey =
  "dismissed_alert_account_settings_collection_changed";

const PersonalInformation = ({
  query,
  onUpdate,
  isUpdating,
  pool,
}: PersonalInformationProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const user = getFragment(ProfilePersonalInformation_Fragment, query);
  const [alertIsDismissed, setNoticeIsDismissed] = useLocalStorage<boolean>(
    NoticeDismissedKey,
    false,
  );
  const isNull = hasAllEmptyFields(user);
  const emptyRequired = hasEmptyRequiredFields(user);
  const { labels, isEditing, setIsEditing, icon, title } = useSectionInfo({
    section: "personal",
    isNull,
    emptyRequired,
    fallbackIcon: UserIcon,
  });
  const [{ data, fetching }] = useQuery({
    query: PersonalInformationForm_Query,
  });

  const handleSubmit: SubmitHandler<FormValues> = async (formValues) => {
    return onUpdate(user.id, formValuesToSubmitData(formValues, user))
      .then((response) => {
        if (response) {
          toast.success(
            intl.formatMessage({
              defaultMessage:
                "Personal and contact information updated successfully!",
              id: "J+MAUg",
              description:
                "Message displayed when a user successfully updates their personal and contact information.",
            }),
          );
          setIsEditing(false);
        }
      })
      .catch(() => {
        toast.error(intl.formatMessage(profileMessages.updatingFailed));
      });
  };

  return (
    <ToggleSection.Root
      id="personal-section"
      open={isEditing}
      onOpenChange={setIsEditing}
    >
      <ToggleSection.Header
        icon={icon.icon}
        color={icon.color}
        level={pool ? "h3" : "h2"}
        size={pool ? "h4" : "h3"}
        toggle={
          !isNull ? (
            <ToggleForm.Trigger
              aria-label={intl.formatMessage({
                defaultMessage: "Edit personal and contact information",
                id: "WE8ZUX",
                description:
                  "Button text to start editing personal and contact information",
              })}
            >
              {intl.formatMessage(commonMessages.editThisSection)}
            </ToggleForm.Trigger>
          ) : undefined
        }
      >
        {title ? intl.formatMessage(title) : null}
      </ToggleSection.Header>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "Manage your name, contact preferences, citizenship, and veteran status. Government of Canada employees can also verify their work email to gain access to employee tools.",
          id: "3duqOV",
          description:
            "Description for the Personal and contact information section",
        })}
      </p>
      {!alertIsDismissed ? (
        <Notice.Root onDismiss={() => setNoticeIsDismissed(true)} mode="card">
          <Notice.Title defaultIcon>
            {intl.formatMessage({
              defaultMessage:
                "We’ve changed how we collect employee information",
              id: "ozb92E",
              description: "title for alert about changed collection",
            })}
          </Notice.Title>
          <Notice.Content>
            <p>
              {intl.formatMessage(
                {
                  defaultMessage:
                    "To better capture your career journey in the public service, we now collect information about your classification, department and more as part of your <a>career experience</a>. If you currently work in the Government of Canada, please update your latest work experience to include this information.",
                  id: "vj9jcO",
                  description: "body for alert about changed collection",
                },
                {
                  a: (chunks: ReactNode) => (
                    <Link href={paths.careerTimeline()}>{chunks}</Link>
                  ),
                },
              )}
            </p>
          </Notice.Content>
        </Notice.Root>
      ) : null}
      {pool && emptyRequired && (
        <Well color="error">
          <p>
            {intl.formatMessage({
              defaultMessage: "You are missing required personal information.",
              id: "QceO8G",
              description:
                "Error message displayed when a users personal information is incomplete",
            })}
          </p>
        </Well>
      )}
      <ToggleSection.Content>
        <ToggleSection.InitialContent>
          {isNull ? <NullDisplay /> : <Display query={user} />}
        </ToggleSection.InitialContent>
        <ToggleSection.OpenContent>
          {fetching ? (
            <Loading inline />
          ) : (
            <BasicForm
              onSubmit={handleSubmit}
              options={{
                defaultValues: dataToFormValues(user),
              }}
            >
              <FormFields labels={labels} optionsQuery={data} />
              <FormActions isUpdating={isUpdating} />
            </BasicForm>
          )}
        </ToggleSection.OpenContent>
      </ToggleSection.Content>
    </ToggleSection.Root>
  );
};

export default PersonalInformation;
