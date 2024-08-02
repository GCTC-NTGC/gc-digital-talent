import { SubmitHandler } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";
import kebabCase from "lodash/kebabCase";

import { Link } from "@gc-digital-talent/ui";
import {
  BasicForm,
  Input,
  RichTextInput,
  Submit,
} from "@gc-digital-talent/forms";
import { toast } from "@gc-digital-talent/toast";
import {
  CreateCommunityInput,
  CreateCommunityMutation,
  LocalizedStringInput,
  Maybe,
} from "@gc-digital-talent/graphql";
import { errorMessages } from "@gc-digital-talent/i18n";

import useRoutes from "~/hooks/useRoutes";

import labels from "../../labels";

type FormValues = {
  key: string;
  name?: Maybe<LocalizedStringInput>;
  description?: Maybe<LocalizedStringInput>;
};

const TEXT_AREA_MAX_WORDS = 200;

const formValuesToSubmitData = (data: FormValues): CreateCommunityInput => {
  return {
    key: kebabCase(data.key || ""),
    name: {
      en: data.name?.en,
      fr: data.name?.fr,
    },
    description: {
      en: data.description?.en,
      fr: data.description?.fr,
    },
  };
};

interface CreateCommunityFormProps {
  onSubmit: (
    data: CreateCommunityInput,
  ) => Promise<CreateCommunityMutation["createCommunity"]>;
}

const CreateCommunityForm = ({ onSubmit }: CreateCommunityFormProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const navigate = useNavigate();

  const { state } = useLocation();
  const navigateTo = state?.from ?? paths.communityTable();

  const handleSubmit: SubmitHandler<FormValues> = async (data) => {
    return onSubmit(formValuesToSubmitData(data))
      .then(() => {
        navigate(navigateTo);
        toast.success(
          intl.formatMessage({
            defaultMessage: "Community created successfully!",
            id: "LxRoWB",
            description: "Message displayed after a community is created",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: creating community failed",
            id: "ri2PBL",
            description: "Messaged displayed after creating community fails",
          }),
        );
      });
  };

  return (
    <BasicForm onSubmit={handleSubmit}>
      <div data-h2-wrapper="base(center, medium, x1) p-tablet(center, medium, x2)">
        <div
          data-h2-background="base(foreground)"
          data-h2-color="base(black)"
          data-h2-padding="base(x1)"
          data-h2-radius="base(rounded)"
          data-h2-shadow="base(m)"
        >
          <div
            data-h2-display="base(grid)"
            data-h2-gap="base(x1)"
            data-h2-grid-template-columns="p-tablet(repeat(2, 1fr))"
            data-h2-margin-bottom="base(x2)"
          >
            <Input
              id="name.en"
              label={intl.formatMessage(labels.nameEn)}
              name="name.en"
              type="text"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <Input
              id="name.fr"
              label={intl.formatMessage(labels.nameFr)}
              name="name.fr"
              type="text"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <RichTextInput
              id="description.en"
              label={intl.formatMessage(labels.descriptionEn)}
              name="description.en"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
              wordLimit={TEXT_AREA_MAX_WORDS}
            />
            <RichTextInput
              id="description.fr"
              label={intl.formatMessage(labels.descriptionFr)}
              name="description.fr"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
              wordLimit={TEXT_AREA_MAX_WORDS}
            />
            <Input
              id="key"
              label={intl.formatMessage(labels.key)}
              name="key"
              type="text"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
          </div>
          <div
            data-h2-display="base(flex)"
            data-h2-gap="base(x1)"
            data-h2-align-items="base(center)"
          >
            <Submit
              text={intl.formatMessage({
                defaultMessage: "Create community",
                id: "4/6TVC",
                description:
                  "Button text for the create community form submit button",
              })}
            />
            <Link mode="inline" color="warning" href={navigateTo}>
              {intl.formatMessage({
                defaultMessage: "Cancel and go back to communities",
                id: "OFGtZr",
                description: "Link text to cancel updating a community",
              })}
            </Link>
          </div>
        </div>
      </div>
    </BasicForm>
  );
};

export default CreateCommunityForm;
