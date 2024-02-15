import * as React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { MessageDescriptor, defineMessage, useIntl } from "react-intl";
import MegaphoneOutlineIcon from "@heroicons/react/24/outline/MegaphoneIcon";
import MegaphoneSolidIcon from "@heroicons/react/24/solid/MegaphoneIcon";
import { useQuery, useMutation } from "urql";

import {
  Scalars,
  SitewideAnnouncement,
  graphql,
} from "@gc-digital-talent/graphql";
import { Pending, NotFound, IconType } from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";
import {
  Input,
  RichTextInput,
  Submit,
  SwitchInput,
} from "@gc-digital-talent/forms";
import { errorMessages, commonMessages } from "@gc-digital-talent/i18n";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import AdminHero from "~/components/Hero/AdminHero";

type FormValues = {
  isEnabled: Scalars["Boolean"]["input"];
  publishDate: Scalars["DateTime"]["input"];
  expiryDate: Scalars["DateTime"]["input"];
  messageEn: string;
  messageFr: string;
};

const apiDataToFormValues = (apiData: SitewideAnnouncement): FormValues => ({
  isEnabled: !!apiData.isEnabled,
  publishDate: apiData.publishDate,
  expiryDate: apiData.expiryDate,
  messageEn: apiData.message.en ?? "",
  messageFr: apiData.message.fr ?? "",
});

const formValuesToApiData = (formValues: FormValues): SitewideAnnouncement => ({
  isEnabled: formValues.isEnabled,
  publishDate: formValues.publishDate,
  expiryDate: formValues.expiryDate,
  message: {
    en: formValues.messageEn,
    fr: formValues.messageFr,
  },
});

interface EditSitewideAnnouncementFormProps {
  initialData: FormValues;
  onUpdate: (data: FormValues) => Promise<void>;
}

export const EditSitewideAnnouncementForm = ({
  initialData,
  onUpdate: handleUpdate,
}: EditSitewideAnnouncementFormProps) => {
  const intl = useIntl();
  const methods = useForm<FormValues>({
    defaultValues: initialData,
  });
  const { handleSubmit } = methods;

  return (
    <section data-h2-container="base(left, s)">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(handleUpdate)}
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column)"
          data-h2-gap="base(x.5 0)"
        >
          <SwitchInput
            id="isEnabled"
            name="isEnabled"
            label={intl.formatMessage({
              defaultMessage: "Enabled",
              id: "QpghXO",
              description: "A switch to enable or disable a setting",
            })}
          />
          <Input
            id="publishDate"
            label={intl.formatMessage({
              defaultMessage: "Publish date (UTC)",
              id: "5cll86",
              description:
                "A date at which data will be published, in the UTC time standard",
            })}
            name="publishDate"
            type="text"
          />
          <Input
            id="expiryDate"
            label={intl.formatMessage({
              defaultMessage: "Expiry date (UTC)",
              id: "j9zYRY",
              description:
                "A date at which data will expire, in the UTC time standard",
            })}
            name="expiryDate"
            type="text"
          />
          <RichTextInput
            id="messageEn"
            label={intl.formatMessage({
              defaultMessage: "English - Message",
              id: "0Vjyzx",
              description: "The message, in English",
            })}
            name="messageEn"
          />
          <RichTextInput
            id="messageFr"
            label={intl.formatMessage({
              defaultMessage: "French - Message",
              id: "V/xaU2",
              description: "The message, in English",
            })}
            name="messageFr"
          />

          <div data-h2-align-self="base(flex-start)">
            <Submit />
          </div>
        </form>
      </FormProvider>
    </section>
  );
};

const EditSitewideAnnouncementPage_Query = graphql(/* GraphQL */ `
  query EditSitewideAnnouncementPage {
    sitewideAnnouncement {
      isEnabled
      publishDate
      expiryDate
      message {
        en
        fr
      }
    }
  }
`);

const UpdateSitewideAnnouncement_Mutation = graphql(/* GraphQL */ `
  mutation UpdateSitewideAnnouncement(
    $sitewideAnnouncementInput: SitewideAnnouncementInput!
  ) {
    updateSitewideAnnouncement(
      sitewideAnnouncementInput: $sitewideAnnouncementInput
    ) {
      isEnabled
      publishDate
      expiryDate
      message {
        en
        fr
      }
    }
  }
`);

export const pageTitle: MessageDescriptor = defineMessage({
  defaultMessage: "Sitewide announcement",
  id: "gChYmW",
  description: "Page title for the update sitewide announcement page",
});
export const pageOutlineIcon: IconType = MegaphoneOutlineIcon;
export const pageSolidIcon: IconType = MegaphoneSolidIcon;

const EditSitewideAnnouncementPage = () => {
  const intl = useIntl();
  const routes = useRoutes();
  const formattedPageTitle = intl.formatMessage(pageTitle);

  const [{ data: initialData, fetching: queryFetching, error: queryError }] =
    useQuery({
      query: EditSitewideAnnouncementPage_Query,
    });

  const [, executeMutation] = useMutation(UpdateSitewideAnnouncement_Mutation);

  const handleUpdateError = () => {
    toast.error(intl.formatMessage(commonMessages.error));

    throw new Error("UpdateSitewideAnnouncementError");
  };

  const handleUpdate = async (formValues: FormValues) => {
    const apiData = formValuesToApiData(formValues);
    await executeMutation({ sitewideAnnouncementInput: apiData })
      .then((result) => {
        if (result.data?.updateSitewideAnnouncement) {
          toast.success(intl.formatMessage(commonMessages.success));
        } else {
          handleUpdateError();
        }
      })
      .catch(handleUpdateError);
  };

  const navigationCrumbs = [
    {
      label: intl.formatMessage({
        defaultMessage: "Home",
        id: "EBmWyo",
        description: "Link text for the home link in breadcrumbs.",
      }),
      url: routes.adminDashboard(),
    },
  ];

  return (
    <>
      <SEO title={formattedPageTitle} />
      <AdminHero
        title={formattedPageTitle}
        nav={{ mode: "crumbs", items: navigationCrumbs }}
      />

      <AdminContentWrapper>
        <Pending fetching={queryFetching} error={queryError}>
          {initialData?.sitewideAnnouncement ? (
            <EditSitewideAnnouncementForm
              initialData={apiDataToFormValues(
                initialData.sitewideAnnouncement,
              )}
              onUpdate={handleUpdate}
            />
          ) : (
            <NotFound
              headingMessage={intl.formatMessage(commonMessages.notFound)}
            >
              {intl.formatMessage(errorMessages.unknown)}
            </NotFound>
          )}
        </Pending>
      </AdminContentWrapper>
    </>
  );
};

export default EditSitewideAnnouncementPage;
