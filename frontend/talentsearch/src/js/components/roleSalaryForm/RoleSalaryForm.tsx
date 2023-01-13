import React from "react";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import {
  BriefcaseIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";

import { BasicForm, Checklist } from "@common/components/form";

import { errorMessages, navigationMessages } from "@common/messages";
import { notEmpty } from "@common/helpers/util";
import { unpackMaybes } from "@common/helpers/formUtils";
import { toast } from "@common/components/Toast";
import Well from "@common/components/Well";
import { ExternalLink } from "@common/components/Link";
import { getFullPoolAdvertisementTitle } from "@common/helpers/poolUtils";

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
import useRoutes from "../../hooks/useRoutes";

export type FormValues = {
  expectedGenericJobTitles: GenericJobTitleKey[];
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
  const navigate = useNavigate();
  const paths = useRoutes();
  const returnRoute = application
    ? paths.reviewApplication(application.id)
    : paths.myProfile();

  const labels = {
    expectedGenericJobTitles: intl.formatMessage({
      defaultMessage:
        "I would like to be referred for jobs at the following levels:",
      id: "DrR60L",
      description: "Legend for role and salary checklist form",
    }),
  };

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

  // intl styling functions section
  function link(chunks: React.ReactNode, url: string) {
    return (
      <ExternalLink newTab href={url}>
        {chunks}
      </ExternalLink>
    );
  }

  const applicationBreadcrumbs = application
    ? [
        {
          title: intl.formatMessage({
            defaultMessage: "My Applications",
            id: "mq4G8h",
            description:
              "'My Applications' breadcrumb from applicant profile wrapper.",
          }),
          href: paths.applications(application.user.id),
          icon: <BriefcaseIcon style={{ width: "1rem", marginRight: "5px" }} />,
        },
        {
          title: getFullPoolAdvertisementTitle(
            intl,
            application.poolAdvertisement,
          ),
          href: paths.pool(application.pool.id),
        },
        {
          href: paths.reviewApplication(application.id),
          title: intl.formatMessage(navigationMessages.stepOne),
        },
      ]
    : [];

  return (
    <ProfileFormWrapper
      title={intl.formatMessage({
        defaultMessage: "Role and Salary Expectations",
        id: "kCBLsJ",
        description: "Title role and salary expectations form",
      })}
      description={intl.formatMessage({
        defaultMessage:
          "Government classifications are labels that the Government of Canada uses to group similar types of work. In the Government of Canada salary is tied to how positions are classified.",
        id: "uIpPFZ",
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
            id: "dgOYID",
            description: "Label for role and salary link",
          }),
        },
      ]}
      prefixBreadcrumbs={!application}
    >
      <BasicForm
        cacheKey="role-salary-form"
        onSubmit={handleSubmit}
        labels={labels}
        options={{
          defaultValues: dataToFormValues(initialData),
        }}
      >
        <p data-h2-margin="base(0, 0, x2, 0)">
          {intl.formatMessage({
            defaultMessage:
              "This platform is focused on hiring digital talent to work in positions classified as IT (Information Technology). Look at the following levels within the IT classification and <strong>select only</strong> the ones that represent the work you want to do.",
            id: "Eubngf",
            description: "Blurb describing the purpose of the form",
          })}
        </p>
        <Checklist
          idPrefix="expectedGenericJobTitles"
          legend={labels.expectedGenericJobTitles}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          name="expectedGenericJobTitles"
          id="expectedGenericJobTitles"
          items={[
            {
              value: GenericJobTitleKey.TechnicianIt01,
              label: intl.formatMessage(
                {
                  defaultMessage:
                    "Level 1: Technician ($60,000 to $78,000). <openModal>Learn about IT-01</openModal>",
                  id: "Zn10pO",
                  description:
                    "Checkbox label for Level IT-01 selection, ignore things in <> tags please",
                },
                {
                  openModal: (msg: React.ReactNode) =>
                    DialogLevelOne({ children: msg }),
                },
              ),
            },
            {
              value: GenericJobTitleKey.AnalystIt02,
              label: intl.formatMessage(
                {
                  defaultMessage:
                    "Level 2: Analyst ($75,000 to $91,000). <openModal>Learn about IT-02</openModal>",
                  id: "PcYOnN",
                  description:
                    "Checkbox label for Level IT-02 selection, ignore things in <> tags please",
                },
                {
                  openModal: (msg: React.ReactNode) =>
                    DialogLevelTwo({ children: msg }),
                },
              ),
            },
            {
              value: GenericJobTitleKey.TeamLeaderIt03,
              label: intl.formatMessage(
                {
                  defaultMessage:
                    "Level 3: Team Leader ($88,000 to $110,000). <openModal>Learn about IT-03</openModal>",
                  id: "hizC89",
                  description:
                    "Checkbox label for Level IT-03 leader selection, ignore things in <> tags please",
                },
                {
                  openModal: (msg: React.ReactNode) =>
                    DialogLevelThreeLead({ children: msg }),
                },
              ),
            },
            {
              value: GenericJobTitleKey.TechnicalAdvisorIt03,
              label: intl.formatMessage(
                {
                  defaultMessage:
                    "Level 3: Technical Advisor ($88,000 to $110,000). <openModal>Learn about IT-03</openModal>",
                  id: "44bgIY",
                  description:
                    "Checkbox label for Level IT-03 advisor selection, ignore things in <> tags please",
                },
                {
                  openModal: (msg: React.ReactNode) =>
                    DialogLevelThreeAdvisor({ children: msg }),
                },
              ),
            },
            {
              value: GenericJobTitleKey.SeniorAdvisorIt04,
              label: intl.formatMessage(
                {
                  defaultMessage:
                    "Level 4: Senior Advisor ($101,000 to $126,000). <openModal>Learn about IT-04</openModal>",
                  id: "FayQOt",
                  description:
                    "Checkbox label for Level IT-04 senior advisor selection, ignore things in <> tags please",
                },
                {
                  openModal: (msg: React.ReactNode) =>
                    DialogLevelFourAdvisor({ children: msg }),
                },
              ),
            },
            {
              value: GenericJobTitleKey.ManagerIt04,
              label: intl.formatMessage(
                {
                  defaultMessage:
                    "Level 4: Manager ($101,000 to $126,000). <openModal>Learn about IT-04</openModal>",
                  id: "75nLSV",
                  description:
                    "Checkbox label for Level IT-04 manager selection, ignore things in <> tags please",
                },
                {
                  openModal: (msg: React.ReactNode) =>
                    DialogLevelFourLead({ children: msg }),
                },
              ),
            },
          ]}
        />
        <Well data-h2-margin="base(x.5, 0, x1, 0)">
          <p data-h2-display="base(flex)" data-h2-align-items="base(center)">
            <InformationCircleIcon
              data-h2-margin="base(0, x.25, 0, 0)"
              style={{ width: "0.9rem" }}
            />
            {intl.formatMessage(
              {
                defaultMessage:
                  "<link>Click here to learn more about classifications in the Government of Canada's Digital Community.</link>",
                id: "KT3jUW",
                description: "Link to learn more about classifications",
              },
              {
                link: (chunks: React.ReactNode) =>
                  link(
                    chunks,
                    intl.locale === "en"
                      ? "https://www.canada.ca/en/government/system/digital-government/gcdigital-community/careers-digital.html"
                      : "https://www.canada.ca/fr/gouvernement/systeme/gouvernement-numerique/collectivite-gcnumerique/carriere-domaine-numerique.html",
                  ),
              },
            )}
          </p>
        </Well>
        <ProfileFormFooter
          mode="saveButton"
          cancelLink={{ href: returnRoute }}
        />
      </BasicForm>
    </ProfileFormWrapper>
  );
};

export default RoleSalaryForm;
