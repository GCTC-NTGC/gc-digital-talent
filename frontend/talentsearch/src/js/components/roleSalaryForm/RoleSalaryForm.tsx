import React from "react";
import { useIntl } from "react-intl";
import { BasicForm, Checklist } from "@common/components/form";
import {
  BriefcaseIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";
import { errorMessages } from "@common/messages";
import Button from "@common/components/Button";
import { notEmpty } from "@common/helpers/util";
import { unpackMaybes } from "@common/helpers/formUtils";
import { navigate } from "@common/helpers/router";
import { toast } from "react-toastify";
import { getLocale } from "@common/helpers/localize";
import { checkFeatureFlag } from "@common/helpers/runtimeVariable";
import {
  DialogLevelOne,
  DialogLevelTwo,
  DialogLevelThreeLead,
  DialogLevelThreeAdvisor,
  DialogLevelFourLead,
  DialogLevelFourAdvisor,
} from "./dialogs";
import {
  GenericJobTitle,
  GenericJobTitleKey,
  GetRoleSalaryInfoQuery,
  PoolCandidate,
  UpdateUserAsUserInput,
  UpdateUserAsUserMutation,
} from "../../api/generated";
import ProfileFormWrapper from "../applicantProfile/ProfileFormWrapper";
import ProfileFormFooter from "../applicantProfile/ProfileFormFooter";
import profileMessages from "../profile/profileMessages";
import applicantProfileRoutes from "../../applicantProfileRoutes";
import directIntakeRoutes from "../../directIntakeRoutes";

export type FormValues = {
  expectedGenericJobTitles: GenericJobTitleKey[];
};

// accessible button for modals - generate clickable inline elements resembling <a>
interface ModalButtonProps {
  click: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
  children?: React.ReactNode;
}
const ModalButton: React.FC<ModalButtonProps> = ({ click, children }) => {
  return (
    <Button
      color="black"
      mode="inline"
      data-h2-padding="base(0)"
      data-h2-font-size="base(caption)"
      onClick={click}
    >
      <span data-h2-font-style="base(underline)">{children}</span>
    </Button>
  );
};

const dataToFormValues = (data: GetRoleSalaryInfoQuery): FormValues => {
  return {
    expectedGenericJobTitles:
      data?.me?.expectedGenericJobTitles
        ?.map((genericJobTitle) => genericJobTitle?.key)
        .filter(notEmpty) ?? [],
  };
};

const formValuesToSubmitData = (
  values: FormValues,
  GenericJobTitles: GenericJobTitle[],
): UpdateUserAsUserInput => {
  const ids = values.expectedGenericJobTitles
    .map((key: GenericJobTitleKey) =>
      GenericJobTitles.find((generic) => generic.key === key),
    )
    .filter(notEmpty)
    .map((c: GenericJobTitle) => c.id);
  return {
    expectedGenericJobTitles: {
      sync: ids,
    },
  };
};

export type RoleSalaryUpdateHandler = (
  id: string,
  data: UpdateUserAsUserInput,
) => Promise<UpdateUserAsUserMutation["updateUserAsUser"]>;

export interface RoleSalaryFormProps {
  initialData: GetRoleSalaryInfoQuery;
  application?: PoolCandidate;
  updateRoleSalary: RoleSalaryUpdateHandler;
}

export const RoleSalaryForm: React.FunctionComponent<RoleSalaryFormProps> = ({
  initialData,
  application,
  updateRoleSalary,
}) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const profilePaths = applicantProfileRoutes(locale);
  const directIntakePaths = directIntakeRoutes(locale);
  const returnRoute =
    application && checkFeatureFlag("FEATURE_DIRECTINTAKE")
      ? directIntakePaths.poolApply(application.pool.id)
      : profilePaths.myProfile();
  const GenericJobTitles = unpackMaybes(initialData?.genericJobTitles);

  const handleSubmit = async (formValues: FormValues) => {
    const userId = initialData.me?.id;
    if (userId === undefined) {
      return;
    }

    await updateRoleSalary(
      userId,
      formValuesToSubmitData(formValues, GenericJobTitles),
    )
      .then(() => {
        navigate(returnRoute);
        toast.success(intl.formatMessage(profileMessages.userUpdated));
      })
      .catch(() => {
        toast.error(intl.formatMessage(profileMessages.updatingFailed));
      });
  };

  // modal logic section
  const [isDialogLevel1Open, setDialogLevel1Open] =
    React.useState<boolean>(false);
  const [isDialogLevel2Open, setDialogLevel2Open] =
    React.useState<boolean>(false);
  const [isDialogLevel3LeadOpen, setDialogLevel3LeadOpen] =
    React.useState<boolean>(false);
  const [isDialogLevel3AdvisorOpen, setDialogLevel3AdvisorOpen] =
    React.useState<boolean>(false);
  const [isDialogLevel4ManagerOpen, setDialogLevel4ManagerOpen] =
    React.useState<boolean>(false);
  const [isDialogLevel4AdvisorOpen, setDialogLevel4AdvisorOpen] =
    React.useState<boolean>(false);

  // intl styling functions section
  function link(msg: string, url: string) {
    return <a href={url}>{msg}</a>;
  }

  function openModal(msg: string, setOpenStateFn: (state: boolean) => void) {
    return (
      <ModalButton
        click={(e) => {
          setOpenStateFn(true);
          e?.preventDefault();
        }}
      >
        {msg}
      </ModalButton>
    );
  }

  const applicationBreadcrumbs = application
    ? [
        {
          title: intl.formatMessage({
            defaultMessage: "My Applications",
            description:
              "'My Applications' breadcrumb from applicant profile wrapper.",
          }),
          href: directIntakePaths.applications(application.user.id),
          icon: <BriefcaseIcon style={{ width: "1rem", marginRight: "5px" }} />,
        },
        {
          title:
            application.poolAdvertisement?.name?.[locale] ||
            intl.formatMessage({
              defaultMessage: "Pool name not found",
              description:
                "Pools name breadcrumb from applicant profile wrapper if no name set.",
            }),
          href: directIntakePaths.poolApply(application.pool.id),
        },
      ]
    : [];

  return (
    <ProfileFormWrapper
      title={intl.formatMessage({
        defaultMessage: "Role and Salary Expectations",
        description: "Title role and salary expectations form",
      })}
      description={intl.formatMessage({
        defaultMessage:
          "Government classifications are labels that the Government of Canada uses to group similar types of work. In the Government of Canada salary is tied to how positions are classified.",
        description: "Description for the role and salary expectation form",
      })}
      cancelLink={{
        href: returnRoute,
      }}
      crumbs={[
        ...applicationBreadcrumbs,
        {
          title: intl.formatMessage({
            defaultMessage: "Role and Salary Expectations",
            description: "Label for role and salary link",
          }),
        },
      ]}
      prefixBreadcrumbs={!application}
    >
      <BasicForm
        onSubmit={handleSubmit}
        options={{
          defaultValues: dataToFormValues(initialData),
        }}
      >
        <p data-h2-margin="base(0, 0, x2, 0)">
          {intl.formatMessage({
            defaultMessage:
              "This platform is focused on hiring digital talent to work in positions classified as IT(Information Technology). Look at the following levels within the IT classification and <strong>select only</strong> the ones that represent the work you want to do.",
            description: "Blurb describing the purpose of the form",
          })}
        </p>
        <Checklist
          idPrefix="expectedGenericJobTitles"
          legend={intl.formatMessage({
            defaultMessage:
              "I would like to be referred for jobs at the following levels:",
            description: "Legend for role and salary checklist form",
          })}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          name="expectedGenericJobTitles"
          items={[
            {
              value: GenericJobTitleKey.TechnicianIt01,
              label: intl.formatMessage(
                {
                  defaultMessage:
                    "Level 1: Technician ($60,000 to $78,000). <openModal>Learn about IT-01</openModal>",
                  description:
                    "Checkbox label for Level IT-01 selection, ignore things in <> tags please",
                },
                {
                  openModal: (msg: string) =>
                    openModal(msg, setDialogLevel1Open),
                },
              ),
            },
            {
              value: GenericJobTitleKey.AnalystIt02,
              label: intl.formatMessage(
                {
                  defaultMessage:
                    "Level 2: Analyst ($75,000 to $91,000). <openModal>Learn about IT-02</openModal>",
                  description:
                    "Checkbox label for Level IT-02 selection, ignore things in <> tags please",
                },
                {
                  openModal: (msg: string) =>
                    openModal(msg, setDialogLevel2Open),
                },
              ),
            },
            {
              value: GenericJobTitleKey.TeamLeaderIt03,
              label: intl.formatMessage(
                {
                  defaultMessage:
                    "Level 3: Team Leader ($88,000 to $110,000). <openModal>Learn about IT-03</openModal>",
                  description:
                    "Checkbox label for Level IT-03 leader selection, ignore things in <> tags please",
                },
                {
                  openModal: (msg: string) =>
                    openModal(msg, setDialogLevel3LeadOpen),
                },
              ),
            },
            {
              value: GenericJobTitleKey.TechnicalAdvisorIt03,
              label: intl.formatMessage(
                {
                  defaultMessage:
                    "Level 3: Technical Advisor ($88,000 to $110,000). <openModal>Learn about IT-03</openModal>",
                  description:
                    "Checkbox label for Level IT-03 advisor selection, ignore things in <> tags please",
                },
                {
                  openModal: (msg: string) =>
                    openModal(msg, setDialogLevel3AdvisorOpen),
                },
              ),
            },
            {
              value: GenericJobTitleKey.SeniorAdvisorIt04,
              label: intl.formatMessage(
                {
                  defaultMessage:
                    "Level 4: Senior Advisor ($101,000 to $126,000). <openModal>Learn about IT-04</openModal>",
                  description:
                    "Checkbox label for Level IT-04 senior advisor selection, ignore things in <> tags please",
                },
                {
                  openModal: (msg: string) =>
                    openModal(msg, setDialogLevel4AdvisorOpen),
                },
              ),
            },
            {
              value: GenericJobTitleKey.ManagerIt04,
              label: intl.formatMessage(
                {
                  defaultMessage:
                    "Level 4: Manager ($101,000 to $126,000). <openModal>Learn about IT-04</openModal>",
                  description:
                    "Checkbox label for Level IT-04 manager selection, ignore things in <> tags please",
                },
                {
                  openModal: (msg: string) =>
                    openModal(msg, setDialogLevel4ManagerOpen),
                },
              ),
            },
          ]}
        />
        <div
          data-h2-background-color="base(light.dt-gray)"
          data-h2-margin="base(x1, 0, 0, 0)"
          data-h2-radius="base(s)"
        >
          <p data-h2-padding="base(x1, 0, x1, x.5)">
            <span>
              <InformationCircleIcon style={{ width: "0.9rem" }} />{" "}
              {intl.formatMessage(
                {
                  defaultMessage:
                    "<link>Click here to learn more about classifications in the Government of Canada's Digital Community.</link>",
                  description: "Link to learn more about classifications",
                },
                {
                  link: (msg: string) =>
                    link(
                      msg,
                      intl.locale === "en"
                        ? "https://www.canada.ca/en/government/system/digital-government/gcdigital-community/careers-digital.html"
                        : "https://www.canada.ca/fr/gouvernement/systeme/gouvernement-numerique/collectivite-gcnumerique/carriere-domaine-numerique.html",
                    ),
                },
              )}
            </span>
          </p>
        </div>
        <ProfileFormFooter mode="saveButton" />
      </BasicForm>

      <DialogLevelOne
        isOpen={isDialogLevel1Open}
        onDismiss={() => setDialogLevel1Open(false)}
      />
      <DialogLevelTwo
        isOpen={isDialogLevel2Open}
        onDismiss={() => setDialogLevel2Open(false)}
      />
      <DialogLevelThreeLead
        isOpen={isDialogLevel3LeadOpen}
        onDismiss={() => setDialogLevel3LeadOpen(false)}
      />
      <DialogLevelThreeAdvisor
        isOpen={isDialogLevel3AdvisorOpen}
        onDismiss={() => setDialogLevel3AdvisorOpen(false)}
      />
      <DialogLevelFourAdvisor
        isOpen={isDialogLevel4AdvisorOpen}
        onDismiss={() => setDialogLevel4AdvisorOpen(false)}
      />
      <DialogLevelFourLead
        isOpen={isDialogLevel4ManagerOpen}
        onDismiss={() => setDialogLevel4ManagerOpen(false)}
      />
    </ProfileFormWrapper>
  );
};

export default RoleSalaryForm;
